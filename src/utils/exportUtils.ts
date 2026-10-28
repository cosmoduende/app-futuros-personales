import { StartingPoint, Scenario, ActionRoadmap, CriteriaImportanceMap } from '../types';

export interface FullSessionExport {
  version: string;
  exportedAt: string;
  startingPoint: StartingPoint;
  scenarios: Record<string, Scenario>;
  criteriaImportance: CriteriaImportanceMap;
  roadmap: ActionRoadmap;
}

export function downloadSessionAsJSON(data: FullSessionExport) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `futurolab-estudio-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function generatePrintableReportHTML(data: FullSessionExport): string {
  const { startingPoint, scenarios, roadmap } = data;
  const chosenScenario = scenarios[roadmap.chosenScenarioId] || scenarios.preferido;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>FuturoLab — Informe de Prospectiva Personal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 30px; }
    h1 { color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 8px; margin-bottom: 4px; }
    h2 { color: #4338ca; margin-top: 28px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { color: #0f172a; margin-top: 16px; margin-bottom: 6px; }
    .tagline { color: #64748b; font-style: italic; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #e0e7ff; color: #3730a3; margin-right: 6px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
    .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; background: #f8fafc; }
    .card-title { font-weight: bold; margin-bottom: 8px; color: #0f172a; }
    ul { padding-left: 20px; margin: 6px 0; }
    li { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; color: #0f172a; }
    .action-box { border-left: 4px solid #06b6d4; padding: 10px 14px; background: #f0fdfa; margin-bottom: 12px; border-radius: 0 6px 6px 0; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>FuturoLab — Informe de Prospectiva Personal</h1>
  <div class="tagline">"Imagina. Explora. Decide. Construye." — Metodología Verne Wheelwright | Horizonte 3 Años</div>

  <h2>1. Punto de Partida</h2>
  <p><strong>Ámbitos seleccionados:</strong> ${startingPoint.selectedScopes.map(s => `<span class="badge">${s}</span>`).join(' ')}</p>
  <p><strong>Situación actual:</strong> ${startingPoint.currentSituation}</p>
  <p><strong>Aspiración a 3 años:</strong> ${startingPoint.threeYearAspiration}</p>
  <p><strong>Recursos y fortalezas:</strong> ${startingPoint.skillsAndResources || 'No detallado'}</p>
  <p><strong>Obstáculos y restricciones:</strong> ${startingPoint.limitationsAndObstacles || 'No detallado'}</p>
  <p><strong>Tendencias del entorno:</strong> ${startingPoint.trends || 'No detallado'}</p>
  <p><strong>Dispuesto a cambiar:</strong> ${startingPoint.willingToChange || 'No detallado'}</p>
  <p><strong>Aspectos a preservar (no negociables):</strong> ${startingPoint.wantToPreserve || 'No detallado'}</p>

  <h2>2. Mapa de Escenarios Alternativos</h2>
  <div class="grid">
    <div class="card">
      <div class="card-title">1. Continuidad</div>
      <p style="font-size: 13px;"><em>${scenarios.continuidad?.tagline || ''}</em></p>
      <p style="font-size: 13px;">${scenarios.continuidad?.narrative || ''}</p>
      <p><strong>Riesgo clave:</strong> ${scenarios.continuidad?.risksAndObstacles?.[0] || ''}</p>
    </div>
    <div class="card">
      <div class="card-title">2. Transformación</div>
      <p style="font-size: 13px;"><em>${scenarios.transformacion?.tagline || ''}</em></p>
      <p style="font-size: 13px;">${scenarios.transformacion?.narrative || ''}</p>
      <p><strong>Oportunidad clave:</strong> ${scenarios.transformacion?.opportunities?.[0] || ''}</p>
    </div>
    <div class="card" style="border-color: #06b6d4; background: #f0fdfa;">
      <div class="card-title" style="color: #0d9488;">3. Futuro Preferido</div>
      <p style="font-size: 13px;"><em>${scenarios.preferido?.tagline || ''}</em></p>
      <p style="font-size: 13px;">${scenarios.preferido?.narrative || ''}</p>
      <p><strong>Condición crítica:</strong> ${scenarios.preferido?.whatMustBeTrue?.[0] || ''}</p>
    </div>
  </div>

  <h2>3. Escenario Elegido para la Acción</h2>
  <div class="card" style="border-color: #4338ca;">
    <h3>${chosenScenario?.title || 'Escenario'}</h3>
    <p><em>${chosenScenario?.tagline || ''}</em></p>
    <p>${chosenScenario?.narrative || ''}</p>
    <p><strong>¿Qué tendría que ser cierto para que funcione?</strong></p>
    <ul>
      ${(chosenScenario?.whatMustBeTrue || []).map(item => `<li>${item}</li>`).join('')}
    </ul>
    <p><strong>Señales observables para reconsiderar:</strong></p>
    <ul>
      ${(chosenScenario?.signalsToReconsider || []).map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>

  <h2>4. Retroplanificación (Backcasting) a 3 Años</h2>
  <p><strong>Meta Visión a 3 Años:</strong> ${roadmap.visionGoal3Years}</p>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Horizonte</th>
        <th>Hito Estratégico</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Año 3 (Consolidación)</strong></td>
        <td>${roadmap.milestones.year3}</td>
      </tr>
      <tr>
        <td><strong>Año 2 (Aceleración)</strong></td>
        <td>${roadmap.milestones.year2}</td>
      </tr>
      <tr>
        <td><strong>Año 1 (Cimientos)</strong></td>
        <td>${roadmap.milestones.year1}</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Plan de Acción Inmediato (Próximos 30 Días)</h2>
  ${roadmap.thirtyDayActions.map(action => `
    <div class="action-box">
      <div style="font-weight: bold; color: #0f172a;">${action.timeframe}: ${action.title}</div>
      <p style="margin: 4px 0;">${action.description}</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>Indicador de avance:</strong> ${action.indicator}</p>
      <p style="margin: 4px 0; font-size: 13px;"><strong>Obstáculo previsto y Plan B:</strong> ${action.possibleObstacle} &rarr; <em>${action.alternativePlan}</em></p>
    </div>
  `).join('')}

  <div class="footer">
    Documento generado por <strong>FuturoLab</strong>. Los escenarios son exploraciones condicionales para la toma de decisiones, no pronósticos deterministas.
  </div>
</body>
</html>`;
}
