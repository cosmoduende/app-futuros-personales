import { StartingPoint, Scenario, ActionRoadmap, ThirtyDayAction } from '../types';

export const DEMO_PRESETS: {
  id: string;
  label: string;
  role: string;
  startingPoint: StartingPoint;
}[] = [
  {
    id: 'tech-lead',
    label: 'Elena — Desarrolladora hacia Liderazgo en IA',
    role: 'Desarrollo profesional y estudios',
    startingPoint: {
      selectedScopes: ['profesional', 'estudios'],
      currentSituation: 'Llevo 4 años como desarrolladora web senior en una empresa de software mediana. Domino React, Node y arquitecturas en la nube, pero siento estancamiento técnico y organizativo.',
      threeYearAspiration: 'Liderar equipos de ingeniería aplicada a soluciones de inteligencia artificial ética, con autonomía estratégica y proyectos de impacto real.',
      skillsAndResources: 'Sólida base en programación, capacidad de aprendizaje autodidacta, red de contactos profesionales en el sector tecnológico y 8 horas semanales libres.',
      limitationsAndObstacles: 'Presupuesto moderado para másteres costosos, falta de experiencia formal en despliegue de modelos de lenguaje en producción y miedo al síndrome del impostor.',
      trends: 'Democratización de agentes de IA, creciente demanda de perfiles híbridos (ingeniería + gobernanza de IA) y automatización de tareas de desarrollo rutinario.',
      willingToChange: 'Dispuesto a dedicar fines de semana a proyectos prácticos de código abierto, reducir horas de ocio digital y asumir roles de menor confort técnico.',
      wantToPreserve: 'Mi salud mental, tiempo de calidad con mi familia los domingos y estabilidad financiera actual sin endeudarme.',
    },
  },
  {
    id: 'consultant-startup',
    label: 'Carlos — Consultoría en Sostenibilidad',
    role: 'Emprendimiento y desarrollo profesional',
    startingPoint: {
      selectedScopes: ['emprendimiento', 'profesional'],
      currentSituation: 'Trabajo como analista de operaciones en logística tradicional. Poseo conocimientos en optimización de rutas y huella de carbono, pero dentro de una estructura jerárquica rígida.',
      threeYearAspiration: 'Dirigir mi propia firma boutique de consultoría en descarbonización para pymes y cadenas de suministro, facturando con clientes recurrentes.',
      skillsAndResources: 'Metodología analítica rigurosa, habilidades de comunicación y negociación, pequeños ahorros de emergencia equivalentes a 6 meses de gastos básicos.',
      limitationsAndObstacles: 'Inexperiencia en captación comercial independiente, regulación ambiental cambiante y aversión familiar al riesgo emprendedor.',
      trends: 'Nuevas directivas europeas de reporte de sostenibilidad (CSRD), incentivos fiscales verdes y exigencia de consumidores por trazabilidad.',
      willingToChange: 'Dispuesto a trabajar en remoto, prospectar clientes en frío de forma respetuosa y comenzar prestando servicios piloto en paralelo.',
      wantToPreserve: 'No poner en riesgo el fondo de emergencia familiar ni aceptar clientes cuyas prácticas vulneren mis principios éticos.',
    },
  },
  {
    id: 'education-pivot',
    label: 'Mariana — Docente innovadora en EdTech',
    role: 'Estudios y emprendimiento',
    startingPoint: {
      selectedScopes: ['estudios', 'emprendimiento'],
      currentSituation: 'Profesora universitaria de humanidades y comunicación con 10 años de docencia presencial. Percibo que las dinámicas de clase tradicionales desconectan al alumnado actual.',
      threeYearAspiration: 'Crear una plataforma de microaprendizaje interactivo de pensamiento crítico y alfabetización informacional para jóvenes y empresas.',
      skillsAndResources: 'Excelente oratoria, diseño pedagógico, empatía con estudiantes y una comunidad fiel de 2.000 seguidores en newsletter educativa.',
      limitationsAndObstacles: 'Conocimientos limitados de programación web y modelos de negocio SaaS, además de agendas escolares rígidas durante el año lectivo.',
      trends: 'Auge del microaprendizaje visual, demanda corporativa de pensamiento crítico ante la desinformación sintética y auge de herramientas no-code.',
      willingToChange: 'Dispuesto a aprender herramientas digitales sin código, simplificar contenidos académicos complejos y publicar contenidos en formatos interactivos.',
      wantToPreserve: 'El rigor conceptual pedagógico, el contacto humano cálido y la vocación de servicio social.',
    },
  },
];
