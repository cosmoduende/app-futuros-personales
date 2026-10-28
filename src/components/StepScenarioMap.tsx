import React, { useState } from 'react';
import { 
  GitFork, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  Edit3, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  CheckCircle2, 
  X,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Scenario, ScenarioType, StartingPoint } from '../types';

interface StepScenarioMapProps {
  scenarios: Record<ScenarioType, Scenario>;
  startingPoint: StartingPoint;
  onSelectScenarioForAction: (scenarioId: ScenarioType) => void;
  onNavigateToDecisionLab: () => void;
  onBackToStartingPoint: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  source?: 'gemini' | 'demo' | 'local';
  modelName?: string;
}

export const StepScenarioMap: React.FC<StepScenarioMapProps> = ({
  scenarios,
  startingPoint,
  onSelectScenarioForAction,
  onNavigateToDecisionLab,
  onBackToStartingPoint,
  onRegenerate,
  isRegenerating,
  source = 'gemini',
  modelName = 'gemini-3.1-flash-lite',
}) => {
  const [activeModalScenario, setActiveModalScenario] = useState<Scenario | null>(null);

  const scenarioCards: {
    id: ScenarioType;
    scenario: Scenario;
    accentColor: string;
    borderActive: string;
    badgeBg: string;
    badgeText: string;
    pathLabel: string;
    pathDesc: string;
  }[] = [
    {
      id: 'continuidad',
      scenario: scenarios.continuidad,
      accentColor: 'from-amber-500/20 to-slate-900',
      borderActive: 'border-amber-500/40 hover:border-amber-400/80',
      badgeBg: 'bg-amber-500/10 border-amber-500/30',
      badgeText: 'text-amber-400',
      pathLabel: 'Camino 1: Continuidad',
      pathDesc: 'Mantiene la trayectoria e inercia actual con adaptaciones graduales',
    },
    {
      id: 'transformacion',
      scenario: scenarios.transformacion,
      accentColor: 'from-violet-500/20 to-slate-900',
      borderActive: 'border-violet-500/40 hover:border-violet-400/80',
      badgeBg: 'bg-violet-500/10 border-violet-500/30',
      badgeText: 'text-violet-400',
      pathLabel: 'Camino 2: Transformación',
      pathDesc: 'Pivote proactivo, disrupción calculada y adquisición de nuevas capacidades',
    },
    {
      id: 'preferido',
      scenario: scenarios.preferido,
      accentColor: 'from-cyan-500/20 to-slate-900',
      borderActive: 'border-cyan-500/50 hover:border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/20',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/40',
      badgeText: 'text-cyan-300 font-semibold',
      pathLabel: 'Camino 3: Futuro Preferido',
      pathDesc: 'Horizonte intencional: máxima aspiración protegiendo tus valores no negociables',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-medium">
              <GitFork className="w-3.5 h-3.5" />
              <span>Fase C &bull; Mapeo de Escenarios Alternativos</span>
            </span>

            {source === 'gemini' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Generado con Gemini ({modelName})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <span>Modo Demostración (Datos simulados)</span>
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            Mi mapa de futuros posibles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {source === 'gemini'
              ? 'Tres trayectorias exploratorias generadas en tiempo real por Gemini para tu situación. Recuerda: no son predicciones rígidas, sino hipótesis de trabajo para contrastar decisiones y supuestos.'
              : 'Tres trayectorias de ejemplo para explorar la metodología. Para generar tus propios escenarios reales con IA, edita tu punto de partida.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onBackToStartingPoint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar partida</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
            title="Volver a sintetizar los escenarios"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerando...' : 'Regenerar'}</span>
          </button>

          <button
            onClick={onNavigateToDecisionLab}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md transition"
          >
            <span>Laboratorio de decisiones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Roadmap Connection Diagram */}
      <div className="relative py-4 px-2 hidden sm:block">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-4">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
            PUNTO DE PARTIDA (HOY)
          </span>
          <span className="text-slate-500 italic">Bifurcación en 3 años (2026 &rarr; 2029)</span>
          <span className="font-semibold text-slate-300">HORIZONTE 3 AÑOS</span>
        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-indigo-500 rounded-full opacity-60"></div>
      </div>

      {/* 3 Scenario Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarioCards.map(({ id, scenario, accentColor, borderActive, badgeBg, badgeText, pathLabel, pathDesc }) => (
          <div
            key={id}
            className={`flex flex-col justify-between rounded-2xl bg-gradient-to-b ${accentColor} border ${borderActive} p-6 transition-all duration-200 relative group`}
          >
            {id === 'preferido' && (
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow">
                Horizonte Deseado
              </div>
            )}

            <div>
              {/* Path Badge & Title */}
              <div className="mb-3">
                <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border ${badgeBg} ${badgeText} mb-2`}>
                  {pathLabel}
                </span>
                <h2 className="text-lg font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                  {scenario.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 italic">
                  "{scenario.tagline}"
                </p>
              </div>

              {/* Narrative Summary */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-4">
                {scenario.narrative}
              </p>

              {/* 3 Key Highlights Badges */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Oportunidad clave:
                  </span>
                  <p className="text-slate-300 text-[11px] line-clamp-2 pl-4">
                    {scenario.opportunities[0] || 'Desarrollo en nicho especializado.'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Riesgo u obstáculo latente:
                  </span>
                  <p className="text-slate-300 text-[11px] line-clamp-2 pl-4">
                    {scenario.risksAndObstacles[0] || 'Curva de adaptación o fatiga.'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    Señal centinela temprana:
                  </span>
                  <p className="text-slate-300 text-[11px] line-clamp-2 pl-4">
                    {scenario.earlySignals[0] || 'Cambios en la retroalimentación de clientes o colegas.'}
                  </p>
                </div>
              </div>

              {/* 3-Year Mini Timeline */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    Hitos del trienio
                  </span>
                  <span className="text-[10px] text-slate-500">1 &rarr; 2 &rarr; 3 años</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-[11px]">
                    <span className="font-bold text-slate-200">Año 1: </span>
                    <span className="text-slate-400">{scenario.milestones.year1.title}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-[11px]">
                    <span className="font-bold text-slate-200">Año 2: </span>
                    <span className="text-slate-400">{scenario.milestones.year2.title}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-[11px]">
                    <span className="font-bold text-slate-200">Año 3: </span>
                    <span className="text-slate-400">{scenario.milestones.year3.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModalScenario(scenario)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <span>Ver detalles</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => onSelectScenarioForAction(id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  id === 'preferido'
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                    : 'bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/30'
                }`}
                title={`Favorecer este escenario y construir la ruta de acción`}
              >
                <span>Elegir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Detail Modal */}
      {activeModalScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100"
            role="dialog"
            aria-labelledby="scenario-detail-title"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="scenario-detail-title" className="text-lg font-bold text-white font-display">
                    {activeModalScenario.title}
                  </h3>
                  <p className="text-xs text-slate-400 italic">"{activeModalScenario.tagline}"</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalScenario(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                aria-label="Cerrar modal de detalles"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs sm:text-sm text-slate-300">
              {/* Narrative */}
              <div>
                <h4 className="font-semibold text-white mb-1.5 text-sm">Descripción Narrativa a 3 Años</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {activeModalScenario.narrative}
                </p>
              </div>

              {/* Grid: Conditions vs Catalytic Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                  <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Condiciones que lo favorecen
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-xs">
                    {activeModalScenario.favorableConditions.map((cond, i) => (
                      <li key={i}>{cond}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                  <h4 className="font-semibold text-violet-300 mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    Decisiones que influyen en el resultado
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-xs">
                    {activeModalScenario.catalyticDecisions.map((dec, i) => (
                      <li key={i}>{dec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Grid: Opportunities vs Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Oportunidades emergentes
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-xs">
                    {activeModalScenario.opportunities.map((opp, i) => (
                      <li key={i}>{opp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <h4 className="font-semibold text-rose-300 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Riesgos y obstáculos
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-xs">
                    {activeModalScenario.risksAndObstacles.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Supuestos y Señales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                  <h4 className="font-semibold text-amber-300 mb-2">Supuestos Clave Asumidos</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-xs">
                    {activeModalScenario.keyAssumptions.map((assump, i) => (
                      <li key={i}>{assump}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                  <h4 className="font-semibold text-cyan-300 mb-2">Señales Centinela Observables</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-xs">
                    {activeModalScenario.earlySignals.map((sig, i) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Milestones Deep Dive */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white text-sm">Hitos Temporales (Año 1 a Año 3)</h4>
                <div className="space-y-3">
                  {[
                    { year: 'Año 1 (Fundación)', item: activeModalScenario.milestones.year1 },
                    { year: 'Año 2 (Aceleración)', item: activeModalScenario.milestones.year2 },
                    { year: 'Año 3 (Consolidación)', item: activeModalScenario.milestones.year3 },
                  ].map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                      <div className="font-bold text-cyan-300 text-xs">{m.year}: {m.item.title}</div>
                      <p className="text-slate-300 text-xs mt-1">{m.item.description}</p>
                      <div className="text-[11px] text-emerald-400 mt-1.5">
                        <strong>Indicador observable:</strong> {m.item.indicator}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur px-6 py-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveModalScenario(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cerrar
              </button>

              <button
                onClick={() => {
                  onSelectScenarioForAction(activeModalScenario.id);
                  setActiveModalScenario(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-semibold shadow transition"
              >
                Favorecer este escenario y crear mi ruta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
