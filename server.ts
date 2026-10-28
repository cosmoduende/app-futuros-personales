import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';
import { synthesizeScenariosFromStartingPoint, generateRoadmapForScenario } from './src/utils/scenarioGenerator.ts';
import { StartingPoint, Scenario, ActionRoadmap } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to call Gemini with timeout
function callGeminiGenerate(prompt: string, model: string = 'gemini-3.1-flash-lite'): Promise<string> {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      reject(new Error('GEMINI_API_KEY_MISSING: La variable GEMINI_API_KEY no está configurada en Google AI Studio.'));
      return;
    }

    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'aistudio-build',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              resolve(text);
            } else {
              reject(new Error('Gemini no devolvió texto en la respuesta.'));
            }
          } catch (e: any) {
            reject(new Error(`Error al decodificar JSON de Gemini: ${e.message}`));
          }
        } else {
          let errorMsg = `HTTP ${res.statusCode} de la API de Gemini`;
          try {
            const errObj = JSON.parse(data);
            if (errObj.error?.message) {
              errorMsg = errObj.error.message;
            }
          } catch (_) {}
          reject(new Error(errorMsg));
        }
      });
    });

    // 45 seconds timeout for complete LLM generation
    req.setTimeout(45000, () => {
      req.destroy();
      reject(new Error('TIMEOUT: La solicitud a Gemini superó los 45 segundos de espera.'));
    });

    req.on('error', (err) => {
      reject(new Error(`Error de conexión con Gemini: ${err.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Call Gemini trying primary model then secondary if 503
async function generateWithGeminiCascade(prompt: string): Promise<{ text: string; model: string }> {
  try {
    const text = await callGeminiGenerate(prompt, 'gemini-3.1-flash-lite');
    return { text, model: 'gemini-3.1-flash-lite' };
  } catch (err: any) {
    console.warn('Intento con gemini-3.1-flash-lite falló, intentando con gemini-3.5-flash:', err.message);
    const text = await callGeminiGenerate(prompt, 'gemini-3.5-flash');
    return { text, model: 'gemini-3.5-flash' };
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health and status endpoint
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      provider: 'Google AI Studio',
      model: 'gemini-3.1-flash-lite',
      methodology: 'Verne Wheelwright Personal Foresight (Prospectiva Personal)',
    });
  });

  // Generate scenarios endpoint
  app.post('/api/generate-scenarios', async (req, res) => {
    const { startingPoint, isDemoRequest } = req.body;

    if (!startingPoint || !startingPoint.currentSituation || !startingPoint.threeYearAspiration) {
      res.status(400).json({ 
        success: false, 
        error: 'Faltan campos obligatorios: se requiere situación actual y aspiración a 3 años.' 
      });
      return;
    }

    // Explicit Demo Mode (simulated data)
    if (isDemoRequest) {
      const demoScenarios = synthesizeScenariosFromStartingPoint(startingPoint);
      res.json({
        success: true,
        source: 'demo',
        scenarios: demoScenarios,
      });
      return;
    }

    // Real Gemini AI Generation
    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        success: false,
        source: 'unconfigured',
        error: 'La clave GEMINI_API_KEY no está configurada en las variables de entorno de AI Studio.',
        solution: 'Puedes configurar tu clave en Settings > Secrets o probar con un perfil del Modo Demostración.',
      });
      return;
    }

    try {
      const prompt = `Actúa como especialista en prospectiva personal de Verne Wheelwright.
Genera exactamente tres escenarios a 3 años para la siguiente persona:
- Ámbitos: ${startingPoint.selectedScopes?.join(', ') || 'profesional'}
- Situación actual: ${startingPoint.currentSituation}
- Aspiración principal a 3 años: ${startingPoint.threeYearAspiration}
- Habilidades y recursos: ${startingPoint.skillsAndResources || 'Habilidades transferibles'}
- Obstáculos: ${startingPoint.limitationsAndObstacles || 'Restricciones cotidianas'}
- Tendencias: ${startingPoint.trends || 'Transformación tecnológica'}
- Dispuesto a cambiar: ${startingPoint.willingToChange || 'Hábitos diarios'}
- Desea preservar: ${startingPoint.wantToPreserve || 'Bienestar y estabilidad'}

REGLAS:
- Tono profesional, no determinista, reflexivo y respetuoso.
- No inventes salarios ni probabilidades científicas falsas.
- Viñetas concisas (máximo 15 palabras).
- Tres escenarios: "continuidad" (inercia actual), "transformacion" (pivote proactivo), "preferido" (horizonte intencional armónico).

Responde ÚNICAMENTE en JSON con esta estructura exacta:
{
  "scenarios": {
    "continuidad": {
      "title": "Continuidad: [Título]",
      "tagline": "[Frase síntesis de 1 línea]",
      "narrative": "[Párrafo reflexivo de 3-4 oraciones]",
      "favorableConditions": ["condición 1", "condición 2", "condición 3"],
      "opportunities": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
      "risksAndObstacles": ["riesgo 1", "riesgo 2", "riesgo 3"],
      "keyAssumptions": ["supuesto 1", "supuesto 2", "supuesto 3"],
      "catalyticDecisions": ["decisión 1", "decisión 2", "decisión 3"],
      "earlySignals": ["señal 1", "señal 2", "señal 3"],
      "milestones": {
        "year1": { "title": "Año 1", "description": "...", "indicator": "..." },
        "year2": { "title": "Año 2", "description": "...", "indicator": "..." },
        "year3": { "title": "Año 3", "description": "...", "indicator": "..." }
      },
      "whatMustBeTrue": ["condición 1", "condición 2", "condición 3"],
      "signalsToReconsider": ["alerta 1", "alerta 2", "alerta 3"],
      "criteriaRatings": {
        "aspirationFit": "Media", "resourcesRequired": "Moderado", "opportunitiesLevel": "Específico", "risksLevel": "Bajo", "uncertaintyLevel": "Baja", "flexibility": "Limitada"
      }
    },
    "transformacion": {
      "title": "Transformación: [Título]",
      "tagline": "[Frase síntesis de 1 línea]",
      "narrative": "[Párrafo reflexivo de 3-4 oraciones]",
      "favorableConditions": ["condición 1", "condición 2", "condición 3"],
      "opportunities": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
      "risksAndObstacles": ["riesgo 1", "riesgo 2", "riesgo 3"],
      "keyAssumptions": ["supuesto 1", "supuesto 2", "supuesto 3"],
      "catalyticDecisions": ["decisión 1", "decisión 2", "decisión 3"],
      "earlySignals": ["señal 1", "señal 2", "señal 3"],
      "milestones": {
        "year1": { "title": "Año 1", "description": "...", "indicator": "..." },
        "year2": { "title": "Año 2", "description": "...", "indicator": "..." },
        "year3": { "title": "Año 3", "description": "...", "indicator": "..." }
      },
      "whatMustBeTrue": ["condición 1", "condición 2", "condición 3"],
      "signalsToReconsider": ["alerta 1", "alerta 2", "alerta 3"],
      "criteriaRatings": {
        "aspirationFit": "Alta", "resourcesRequired": "Alto", "opportunitiesLevel": "Alto", "risksLevel": "Medio", "uncertaintyLevel": "Media", "flexibility": "Alta"
      }
    },
    "preferido": {
      "title": "Futuro Preferido: [Título]",
      "tagline": "[Frase síntesis de 1 línea]",
      "narrative": "[Párrafo reflexivo de 3-4 oraciones]",
      "favorableConditions": ["condición 1", "condición 2", "condición 3"],
      "opportunities": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
      "risksAndObstacles": ["riesgo 1", "riesgo 2", "riesgo 3"],
      "keyAssumptions": ["supuesto 1", "supuesto 2", "supuesto 3"],
      "catalyticDecisions": ["decisión 1", "decisión 2", "decisión 3"],
      "earlySignals": ["señal 1", "señal 2", "señal 3"],
      "milestones": {
        "year1": { "title": "Año 1", "description": "...", "indicator": "..." },
        "year2": { "title": "Año 2", "description": "...", "indicator": "..." },
        "year3": { "title": "Año 3", "description": "...", "indicator": "..." }
      },
      "whatMustBeTrue": ["condición 1", "condición 2", "condición 3"],
      "signalsToReconsider": ["alerta 1", "alerta 2", "alerta 3"],
      "criteriaRatings": {
        "aspirationFit": "Alta", "resourcesRequired": "Medio", "opportunitiesLevel": "Alto", "risksLevel": "Bajo", "uncertaintyLevel": "Media", "flexibility": "Alta"
      }
    }
  }
}`;

      const { text, model } = await generateWithGeminiCascade(prompt);
      const parsed = JSON.parse(text);
      const scenariosData = parsed.scenarios || parsed;

      if (scenariosData.continuidad && scenariosData.transformacion && scenariosData.preferido) {
        scenariosData.continuidad.id = 'continuidad';
        scenariosData.transformacion.id = 'transformacion';
        scenariosData.preferido.id = 'preferido';

        res.json({
          success: true,
          source: 'gemini',
          model: model,
          scenarios: scenariosData,
        });
        return;
      }

      throw new Error('La respuesta de Gemini no incluyó las claves requeridas para los tres escenarios.');
    } catch (err: any) {
      console.error('Error generando escenarios con Gemini:', err.message);
      res.status(502).json({
        success: false,
        source: 'error',
        error: `No se pudieron generar los escenarios con Gemini: ${err.message}`,
        canRetry: true,
      });
    }
  });

  // Refine action roadmap endpoint with Gemini
  app.post('/api/refine-plan', async (req, res) => {
    const { scenario, startingPoint, isDemoRequest } = req.body;
    if (!scenario || !startingPoint) {
      res.status(400).json({ success: false, error: 'Faltan datos del escenario o punto de partida.' });
      return;
    }

    if (isDemoRequest || !process.env.GEMINI_API_KEY) {
      const localRoadmap = generateRoadmapForScenario(scenario, startingPoint);
      res.json({
        success: true,
        source: isDemoRequest ? 'demo' : 'local',
        roadmap: localRoadmap,
      });
      return;
    }

    try {
      const prompt = `Actúa como especialista en retroplanificación (backcasting) para FuturoLab.
El usuario ha seleccionado el escenario: "${scenario.title}".
Aspiración a 3 años: ${startingPoint.threeYearAspiration}
Recursos: ${startingPoint.skillsAndResources || 'Habilidades existentes'}
Obstáculos: ${startingPoint.limitationsAndObstacles || 'Restricciones cotidianas'}
Aspectos a preservar: ${startingPoint.wantToPreserve || 'Estabilidad y bienestar'}

Genera una ruta de retroplanificación y exactamente 4 acciones iniciales para los primeros 30 días.
Reglas: No aconsejar renuncias a empleo ni deudas arriesgadas. Pasos realistas y verificables.

Responde ÚNICAMENTE en JSON:
{
  "visionGoal3Years": "meta cualitativa a 3 años",
  "milestones": {
    "year3": "hito de consolidación al año 3",
    "year2": "hito intermedio al año 2",
    "year1": "hito fundacional al año 1"
  },
  "thirtyDayActions": [
    {
      "id": "act-1",
      "title": "título concreto",
      "description": "descripción de la acción",
      "timeframe": "Días 1 a 7",
      "indicator": "indicador observable de avance",
      "possibleObstacle": "obstáculo realista",
      "alternativePlan": "alternativa plan B",
      "completed": false
    },
    {
      "id": "act-2",
      "title": "título concreto",
      "description": "descripción de la acción",
      "timeframe": "Días 8 a 15",
      "indicator": "indicador observable de avance",
      "possibleObstacle": "obstáculo realista",
      "alternativePlan": "alternativa plan B",
      "completed": false
    },
    {
      "id": "act-3",
      "title": "título concreto",
      "description": "descripción de la acción",
      "timeframe": "Días 16 a 23",
      "indicator": "indicador observable de avance",
      "possibleObstacle": "obstáculo realista",
      "alternativePlan": "alternativa plan B",
      "completed": false
    },
    {
      "id": "act-4",
      "title": "título concreto",
      "description": "descripción de la acción",
      "timeframe": "Días 24 a 30",
      "indicator": "indicador observable de avance",
      "possibleObstacle": "obstáculo realista",
      "alternativePlan": "alternativa plan B",
      "completed": false
    }
  ],
  "userCommitmentNotes": "compromiso reflexivo sobre el escenario"
}`;

      const { text, model } = await generateWithGeminiCascade(prompt);
      const parsed = JSON.parse(text);

      if (parsed.thirtyDayActions && Array.isArray(parsed.thirtyDayActions)) {
        res.json({
          success: true,
          source: 'gemini',
          model: model,
          roadmap: {
            chosenScenarioId: scenario.id,
            visionGoal3Years: parsed.visionGoal3Years || startingPoint.threeYearAspiration,
            milestones: parsed.milestones || {
              year1: scenario.milestones?.year1?.title || 'Cimientos',
              year2: scenario.milestones?.year2?.title || 'Aceleración',
              year3: scenario.milestones?.year3?.title || 'Consolidación',
            },
            thirtyDayActions: parsed.thirtyDayActions,
            userCommitmentNotes: parsed.userCommitmentNotes || '',
          },
        });
        return;
      }

      throw new Error('Formato inválido de acciones devueltas');
    } catch (err: any) {
      console.warn('Fallo en refine-plan con Gemini, usando generador local de apoyo:', err.message);
      const localRoadmap = generateRoadmapForScenario(scenario, startingPoint);
      res.json({
        success: true,
        source: 'local',
        roadmap: localRoadmap,
      });
    }
  });

  // Mount Vite or serve static
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FuturoLab server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
