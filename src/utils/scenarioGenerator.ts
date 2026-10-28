import { StartingPoint, Scenario, ActionRoadmap, ThirtyDayAction, ScenarioType } from '../types';

export function synthesizeScenariosFromStartingPoint(data: StartingPoint): Record<ScenarioType, Scenario> {
  const aspiration = data.threeYearAspiration || 'alcanzar un nuevo nivel de impacto profesional y personal';
  const situation = data.currentSituation || 'en mi ocupación actual';
  const resources = data.skillsAndResources || 'habilidades transferibles y motivación';
  const obstacles = data.limitationsAndObstacles || 'limitaciones de tiempo y barreras de entrada';
  const trends = data.trends || 'evolución del mercado y transformaciones tecnológicas';
  const changes = data.willingToChange || 'hábitos diarios y enfoque de aprendizaje';
  const preserve = data.wantToPreserve || 'estabilidad personal y bienestar';

  const scopesLabel = data.selectedScopes.length > 0 
    ? data.selectedScopes.join(', ')
    : 'desarrollo integral';

  // 1. Escenario de Continuidad
  const continuidad: Scenario = {
    id: 'continuidad',
    title: 'Continuidad: Consolidación Progresiva',
    tagline: 'Mantenimiento del rumbo vigente con adaptaciones graduales de bajo riesgo',
    narrative: `En este escenario, decides mantener tu posición y entorno actual en ${situation}. Optas por no asumir transformaciones abruptas, capitalizando tu experiencia y reputación acumulada. La progresión ocurre por inercia positiva y ascensos o mejoras graduales dentro de tu marco conocido, protegiendo al máximo ${preserve}. Sin embargo, este camino te expone a que las tendencias del entorno (${trends}) avancen más rápido que tus adaptaciones internas.`,
    favorableConditions: [
      `Estabilidad del entorno directo y predictibilidad en tus responsabilidades diarias`,
      `Reconocimiento paulatino de tus fortalezas actuales (${resources}) sin necesidad de revalidación constante`,
      `Cero fricción financiera o familiar al evitar incertidumbres operativas`,
      `Preservación intacta de tus aspectos no negociables: ${preserve}`,
    ],
    opportunities: [
      `Profundizar en un nicho de especialización dentro de tu ámbito actual`,
      `Optimizar procesos conocidos para ganar tiempo libre sin alterar tu marco contractual`,
      `Construir un colchón de seguridad financiero o de reputación con mínimo estrés`,
      `Observar la evolución del sector desde una posición de relativo resguardo`,
    ],
    risksAndObstacles: [
      `Riesgo de estancamiento frente a la evolución de: ${trends}`,
      `Pérdida paulatina de entusiasmo o sensación de rezago frente a la aspiración de: ${aspiration}`,
      `Dificultad de reacción si el entorno sufre una disrupción repentina`,
      `Fricción interna acumulada por postergar cambios deseados`,
    ],
    keyAssumptions: [
      `Tu ámbito laboral o formativo mantendrá una demanda constante en los próximos 36 meses`,
      `No surgirán reducciones o reestructuraciones imprevistas en tu contexto inmediato`,
      `La satisfacción personal se mantendrá tolerable sin requerir un salto cualitativo`,
    ],
    catalyticDecisions: [
      `Decidir no postular a convocatorias arriesgadas en el corto plazo`,
      `Enfocar el tiempo disponible únicamente en certificaciones complementarias de bajo impacto`,
      `Priorizar la seguridad y los horarios predecibles sobre los retos de alta incertidumbre`,
    ],
    earlySignals: [
      `Disminución del aprendizaje semanal en tus tareas cotidianas`,
      `Aparición de nuevos requerimientos en ofertas laborales que desconoces por completo`,
      `Sensación creciente de desfasaje entre tu potencial y tus proyectos asignados`,
    ],
    milestones: {
      year1: {
        title: 'Año 1: Afianzamiento y Dominio',
        description: 'Optimización de las tareas actuales y aprovechamiento de los recursos disponibles sin perturbar la rutina.',
        indicator: 'Evaluación de desempeño positiva y mantenimiento del equilibrio de horarios.',
      },
      year2: {
        title: 'Año 2: Especialización Interna',
        description: 'Asunción de proyectos de escala moderada dentro del mismo marco organizacional.',
        indicator: 'Consolidación de estatus de referencia en los temas conocidos.',
      },
      year3: {
        title: 'Año 3: Techo Operativo',
        description: 'Llegada al límite superior de la trayectoria vigente; necesidad de decidir si continuar o renovarse.',
        indicator: 'Estabilidad consolidada, pero con brecha visible respecto a la aspiración inicial.',
      },
    },
    whatMustBeTrue: [
      `Que tu sector no sufra despidos o automatizaciones masivas en el trienio`,
      `Que el costo de oportunidad de no cambiar sea asumible emocional y económicamente`,
      `Que tus relaciones y entorno sigan valorando el conocimiento técnico tradicional`,
    ],
    signalsToReconsider: [
      `Reducción de presupuestos o cierre de áreas afines a tu función`,
      `Sentimiento crónico de desmotivación o desgano al iniciar la semana`,
      `Obsolescencia acelerada de tus herramientas de trabajo diarias`,
    ],
    criteriaRatings: {
      aspirationFit: 'Media',
      resourcesRequired: 'Moderado',
      opportunitiesLevel: 'Específico',
      risksLevel: 'Bajo',
      uncertaintyLevel: 'Baja',
      flexibility: 'Limitada',
    },
  };

  // 2. Escenario de Transformación
  const transformacion: Scenario = {
    id: 'transformacion',
    title: 'Transformación: Pivote y Salto Estratégico',
    tagline: 'Disrupción intencionada de rutinas para abrir nuevos horizontes y capacidades',
    narrative: `En este escenario, decides responder de forma proactiva a las tendencias emergentes (${trends}) mediante un cambio estructurado de modelo, rol o especialidad. Estás dispuesto a activar cambios significativos (${changes}) para superar los obstáculos identificados (${obstacles}). Implica ingresar en una curva empinada de aprendizaje, rediseñar tu red de contactos y probar nuevas hipótesis de valor, aceptando incomodidad temporal a cambio de un crecimiento acelerado.`,
    favorableConditions: [
      `Disposición genuina a modificar hábitos y desaprender dinámicas caducas (${changes})`,
      `Adopción temprana de herramientas ligadas a las tendencias del entorno (${trends})`,
      `Alineación de tus recursos (${resources}) hacia proyectos piloto de alta visibilidad`,
      `Flexibilidad mental para pivotar ante retroalimentación temprana del mercado`,
    ],
    opportunities: [
      `Posicionarte en la intersección de tus competencias previas con nuevas demandas (${trends})`,
      `Multiplicar tu valor percibido al solucionar problemas complejos que pocos dominan`,
      `Expandir de manera exponencial tu red de colaboradores y mentores estratégicos`,
      `Acelerar drásticamente la consecución de: ${aspiration}`,
    ],
    risksAndObstacles: [
      `Curva de fatiga o sobrecarga cognitiva durante los primeros 6 a 12 meses`,
      `Incertidumbre temporal sobre el retorno de inversión en tiempo y esfuerzo`,
      `Riesgo de descuidar involuntariamente aspectos que deseas preservar (${preserve}) si no fijas límites estrictos`,
      `Fricción con expectativas del entorno cercano acostumbrado a tu rol anterior`,
    ],
    keyAssumptions: [
      `Posees la energía y disciplina para sostener el ritmo de aprendizaje declarado`,
      `El mercado y tus potenciales aliados valorarán la nueva propuesta diferencial`,
      `Podrás mitigar las limitaciones iniciales (${obstacles}) mediante alianzas o método incremental`,
    ],
    catalyticDecisions: [
      `Reasignar de forma innegociable bloques de tiempo semanales para la nueva formación o proyecto`,
      `Lanzar pruebas de concepto públicas o iniciativas experimentales en los primeros 90 días`,
      `Renunciar a compromisos secundarios que consuman energía sin aportar a la transformación`,
    ],
    earlySignals: [
      `Primeras consultas o invitaciones a colaborar en temas asociados a tu nuevo enfoque`,
      `Superación tangible de la curva de aprendizaje inicial en los primeros 60 días`,
      `Generación de un portafolio o evidencia visible de tu nueva competencia`,
    ],
    milestones: {
      year1: {
        title: 'Año 1: Inmersión y Validación de Hipótesis',
        description: 'Construcción intensiva de nuevas habilidades y lanzamiento de iniciativas piloto controladas.',
        indicator: 'Primeros 2 hitos experimentales completados con retroalimentación externa objetiva.',
      },
      year2: {
        title: 'Año 2: Tracción y Reconocimiento',
        description: 'Consolidación del nuevo perfil; transición de aprendiz a agente activo en el nuevo dominio.',
        indicator: 'Colaboraciones recurrentes y primeras ofertas o ingresos derivados del nuevo rumbo.',
      },
      year3: {
        title: 'Año 3: Posicionamiento Transformado',
        description: 'Operación plena en el nuevo ecosistema con autoridad técnica o empresarial consolidada.',
        indicator: 'Cumplimiento sustantivo de la aspiración: ' + aspiration.slice(0, 70) + '...',
      },
    },
    whatMustBeTrue: [
      `Que puedas proteger un mínimo de 6 a 10 horas semanales de trabajo enfocado sin comprometer tu salud`,
      `Que la tendencia seleccionada (${trends}) continúe en fase de expansión`,
      `Que mantengas la resiliencia psicológica ante errores o rechazos en las etapas piloto`,
    ],
    signalsToReconsider: [
      `Deterioro evidente en tu salud o en los compromisos no negociables (${preserve})`,
      `Nula respuesta del entorno tras 6 meses de experimentos rigurosos`,
      `Desaparición de la demanda para la especialidad que estás persiguiendo`,
    ],
    criteriaRatings: {
      aspirationFit: 'Alta',
      resourcesRequired: 'Alto',
      opportunitiesLevel: 'Alto',
      risksLevel: 'Medio',
      uncertaintyLevel: 'Media',
      flexibility: 'Alta',
    },
  };

  // 3. Escenario de Futuro Preferido
  const preferido: Scenario = {
    id: 'preferido',
    title: 'Futuro Preferido: Convergencia con Propósito',
    tagline: 'Construcción intencional y calibrada que maximiza tu aspiración respetando tus valores esenciales',
    narrative: `Este escenario representa la articulación deliberada de tu mejor futuro viable a 3 años. No es una fantasía sin restricciones, sino la unión inteligente entre tu aspiración principal (${aspiration}), el apalancamiento de tus talentos (${resources}) y el blindaje estricto de lo que deseas preservar (${preserve}). Aquí diseñas tu avance mediante retroplanificación (backcasting): defines con claridad el estado deseado en el Año 3 y deduces las condiciones precisas que debes asegurar en los Años 2, 1 y en tus próximos 30 días.`,
    favorableConditions: [
      `Claridad meridiana en tu meta a 3 años combinada con pragmatismo en los pasos inmediatos`,
      `Manejo inteligente de los obstáculos (${obstacles}) sin arriesgar tu estabilidad vital`,
      `Alineación ética profunda: tus proyectos reflejan tu propósito y respetan tu bienestar (${preserve})`,
      `Enfoque disciplinado en victorias tempranas que alimenten la confianza y el impulso`,
    ],
    opportunities: [
      `Lograr el máximo equilibrio entre autonomía, satisfacción profesional y calidad de vida`,
      `Convertir tus obstáculos iniciales (${obstacles}) en aprendizajes diferenciadores`,
      `Crear un modelo sostenible en el tiempo que no dependa del sacrificio destructivo`,
      `Generar un impacto tangible y medible en tu entorno o comunidad de referencia`,
    ],
    risksAndObstacles: [
      `Riesgo de perfeccionismo o parálisis por análisis antes de dar pasos concretos`,
      `Impaciencia si los resultados no son inmediatos en el primer trimestre`,
      `Tentación de abarcar demasiados frentes a la vez sin priorizar con rigor`,
      `Eventuales resistencias del entorno al notar tus límites saludables`,
    ],
    keyAssumptions: [
      `La constancia en pasos pequeños pero continuos produce un efecto compuesto acumulativo`,
      `Es posible crecer profesionalmente sin sacrificar la salud ni la estabilidad económica`,
      `Las decisiones basadas en tus fortalezas fundamentales tienen mayor tasa de sostenibilidad`,
    ],
    catalyticDecisions: [
      `Elegir este escenario de forma explícita y formalizar un compromiso de revisión periódica`,
      `Definir límites inquebrantables para salvaguardar: ${preserve}`,
      `Activar la primera acción observable antes de que transcurran 7 días desde hoy`,
    ],
    earlySignals: [
      `Sensación de calma y claridad direccional al tomar decisiones cotidianas`,
      `Completar con éxito las primeras 3 tareas del plan de 30 días`,
      `Recepción de apoyo genuino por parte de personas clave de tu entorno`,
    ],
    milestones: {
      year1: {
        title: 'Año 1: Cimientos y Primeros Frutos',
        description: 'Adquisición de la habilidad crítica restante, primera validación práctica y establecimiento de rutinas protegidas.',
        indicator: 'Sistema de trabajo funcionando y primer proyecto piloto completado sin alterar la paz personal.',
      },
      year2: {
        title: 'Año 2: Expansión Armónica',
        description: 'Mayor visibilidad, consolidación de acuerdos estratégicos y escalado del impacto.',
        indicator: '50% de la meta trienal alcanzada de forma medible, manteniendo los estándares de calidad de vida.',
      },
      year3: {
        title: 'Año 3: Realización y Sostenibilidad',
        description: 'Vivir plenamente la meta trazada: ' + aspiration.slice(0, 80) + '.',
        indicator: 'Autonomía alcanzada, reconocimiento en el área y balance armónico preservado.',
      },
    },
    whatMustBeTrue: [
      `Que mantengas la disciplina de retroplanificación y revisión mensual de señales centinela`,
      `Que sepas decir 'no' a oportunidades que te alejen de tu eje central`,
      `Que tus habilidades (${resources}) se sigan puliendo con práctica deliberada`,
    ],
    signalsToReconsider: [
      `Comprobar que alcanzar la meta está costando tu bienestar físico o mental`,
      `Desvío continuado durante más de 4 meses sin ejecutar las acciones comprometidas`,
      `Cambio profundo en tus valores personales que vuelva irrelevante la aspiración original`,
    ],
    criteriaRatings: {
      aspirationFit: 'Alta',
      resourcesRequired: 'Medio',
      opportunitiesLevel: 'Alto',
      risksLevel: 'Bajo',
      uncertaintyLevel: 'Media',
      flexibility: 'Alta',
    },
  };

  return { continuidad, transformacion, preferido };
}

export function generateRoadmapForScenario(
  scenario: Scenario,
  startingPoint: StartingPoint
): ActionRoadmap {
  const aspiration = startingPoint.threeYearAspiration || 'Alcanzar el objetivo estratégico trazado a tres años';
  const resources = startingPoint.skillsAndResources || 'mis fortalezas actuales';
  const obstacles = startingPoint.limitationsAndObstacles || 'las restricciones de tiempo y contexto';

  // Backcasting: Year 3 -> Year 2 -> Year 1
  const milestones = {
    year3: `Consolidación plena: ${scenario.milestones.year3.title} — ${scenario.milestones.year3.description}`,
    year2: `Fase intermedia: ${scenario.milestones.year2.title} — ${scenario.milestones.year2.description}`,
    year1: `Fase fundacional: ${scenario.milestones.year1.title} — ${scenario.milestones.year1.description}`,
  };

  // 30-day realistic action plan (never recommends irresponsible actions like quitting job or high-risk debt)
  const thirtyDayActions: ThirtyDayAction[] = [
    {
      id: 'act-1',
      title: 'Diagnóstico de brechas y mapa de recursos inmediatos',
      description: `Listar con precisión las competencias específicas y herramientas que necesitas activar en el marco de ${scenario.title}, contrastándolas con ${resources}.`,
      timeframe: 'Días 1 a 7 (Semana 1)',
      indicator: 'Documento o libreta con las 3 brechas prioritarias y los 3 activos clave identificados.',
      possibleObstacle: 'Falta de tiempo o dispersión por exigencias de la rutina diaria.',
      alternativePlan: 'Bloquear una única sesión ininterrumpida de 45 minutos en un momento de baja demanda (ej. sábado por la mañana).',
      completed: false,
    },
    {
      id: 'act-2',
      title: 'Diseño de un experimento mínimo viable (Micro-prueba)',
      description: `Planificar una prueba piloto controlada de bajo riesgo que permita poner a prueba tu capacidad en el nuevo escenario sin comprometer tu estabilidad financiera o laboral.`,
      timeframe: 'Días 8 a 15 (Semana 2)',
      indicator: 'Guión, esquema o prototipo inicial listo para ser contrastado con una persona de confianza.',
      possibleObstacle: 'Perfeccionismo excesivo y temor a exponer una versión preliminar.',
      alternativePlan: 'Definir un alcance mínimo estricto (no más de 2 páginas o 1 entregable sencillo) y acordar revisión con un colega cercano.',
      completed: false,
    },
    {
      id: 'act-3',
      title: 'Conversación exploratoria con un referente o usuario clave',
      description: `Sostener un diálogo informal con alguien que ya habite el horizonte deseado o que conozca el obstáculo (${obstacles}) para validar supuestos reales.`,
      timeframe: 'Días 16 a 23 (Semana 3)',
      indicator: 'Reunión o llamada de 30 minutos celebrada y 3 notas prácticas de aprendizaje registradas.',
      possibleObstacle: 'Dificultad de agenda o no recibir respuesta de la persona contactada.',
      alternativePlan: 'Tener una lista de 3 contactos alternativos o recurrir a comunidades profesionales abiertas en línea.',
      completed: false,
    },
    {
      id: 'act-4',
      title: 'Establecimiento del sistema de revisión mensual de señales',
      description: `Crear una cita recurrente en tu calendario para evaluar las señales observables de este escenario (${scenario.earlySignals[0] || 'progreso semanal'}) y ajustar prioridades.`,
      timeframe: 'Días 24 a 30 (Semana 4)',
      indicator: 'Evento de revisión mensual programado y primer balance de los 30 días redactado.',
      possibleObstacle: 'Olvido o considerar que la revisión no es urgente.',
      alternativePlan: 'Configurar una alarma doble y vincular la revisión a una actividad placentera (ej. café matutino de fin de mes).',
      completed: false,
    },
  ];

  return {
    chosenScenarioId: scenario.id,
    visionGoal3Years: aspiration,
    milestones,
    thirtyDayActions,
    userCommitmentNotes: `Compromiso personal con el escenario "${scenario.title}": avanzar con pasos medibles y reflexivos, preservando lo esencial y vigilando señales de alerta.`,
  };
}
