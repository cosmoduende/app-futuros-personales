import React, { useState } from 'react';
import { 
  Sliders, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Compass,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { Scenario, ScenarioType, CriteriaImportanceMap, QualitativeImportance } from '../types';

interface StepDecisionLabProps {
  scenarios: Record<ScenarioType, Scenario>;
  selectedScenarioId: ScenarioType;
  onSelectScenario: (scenarioId: ScenarioType) => void;
  criteriaImportance: CriteriaImportanceMap;
  onChangeImportance: (criteria: keyof CriteriaImportanceMap, val: QualitativeImportance) => void;
  onNavigateToRoadmap: () => void;
  onBackToMap: () => void;
}

export const StepDecisionLab: React.FC<StepDecisionLabProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  criteriaImportance,
  onChangeImportance,
  onNavigateToRoadmap,
  onBackToMap,
}) => {
  const [activeTabScenario, setActiveTabScenario] = useState<ScenarioType>(selectedScenarioId);

  const criteriaList: {
    key: keyof CriteriaImportanceMap;
    label: string;
    description: string;
  }[] = [
    {
      key: 'aspirationFit',
      label: 'Coherencia con las aspiraciones',
      description: 'Grado en que el escenario satisface tu visión principal a 3 años',
    },
    {
      key: 'resourcesRequired',
      label: 'Recursos y esfuerzo requeridos',
      description: 'Demanda de tiempo, energía, aprendizaje o capital necesario',
    },
    {
      key: 'opportunitiesLevel',
      label: 'Oportunidades emergentes',
      description: 'Potencial de crecimiento, valor añadido y proyección futura',
    },
    {
      key: 'risksLevel',
      label: 'Riesgos y vulnerabilidades',
      description: 'Probabilidad de consecuencias adversas o costo de oportunidad',
    },
    {
      key: 'uncertaintyLevel',
      label: 'Nivel de incertidumbre',
      description: 'Dependencia de factores externos que escapan a tu control',
    },
    {
      key: 'flexibility',
      label: 'Flexibilidad ante cambios',
      description: 'Capacidad de maniobra o ajuste si el entorno se modifica',
    },
  ];

  const getRatingBadge = (val: string, criteriaKey: string) => {
    let color = 'bg-slate-800 text-slate-300 border-slate-700';

    if (criteriaKey === 'aspirationFit' || criteriaKey === 'opportunitiesLevel' || criteriaKey === 'flexibility') {
      if (val === 'Alta' || val === 'Alto') color = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      else if (val === 'Media' || val === 'Medio') color = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      else color = 'bg-slate-800 text-slate-400 border-slate-700';
    } else {
      // Risk / Resources / Uncertainty: Higher is more challenging
      if (val === 'Alto' || val === 'Alta') color = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      else if (val === 'Medio' || val === 'Media') color = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      else color = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }

    return (
      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${color}`}>
        {val}
      </span>
    );
  };

  const currentFocusScenario = scenarios[activeTabScenario];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Title & Philosophical Purpose */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-medium mb-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Fase D & E &bull; Laboratorio Comparativo de Decisiones</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            Matriz de contraste y análisis de supuestos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Compara objetivamente los tres escenarios. Ajusta la importancia cualitativa que das a cada criterio y reflexiona sobre qué tendría que ser cierto para que funcionen.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al mapa</span>
          </button>

          <button
            onClick={() => {
              onSelectScenario(activeTabScenario);
              onNavigateToRoadmap();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md transition"
          >
            <span>Crear mi ruta con este escenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Epistemological Note (Zero Pseudo-Science) */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">Nota metodológica Verne Wheelwright:</strong> Esta matriz no asigna probabilidades matemáticas engañosas ni un porcentaje ficticio de "éxito". En prospectiva personal, las matrices sirven para iluminar qué intercambios (trade-offs) estás dispuesto a aceptar y qué condiciones críticas requieren tu vigilancia.
        </p>
      </div>

      {/* Comparative Matrix Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Matriz Cualitativa de Escenarios</h2>
            <p className="text-xs text-slate-400">Personaliza la importancia de cada criterio según tu momento vital</p>
          </div>
          <div className="text-xs text-slate-400 italic">
            Haz clic en "Elegir" para seleccionar tu escenario preferido
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300">
                <th className="p-4 font-semibold w-1/4">Criterio y Peso Cualitativo</th>
                <th className="p-4 font-semibold text-amber-300 border-l border-slate-800/80 w-1/4">
                  <div className="flex items-center justify-between">
                    <span>1. Continuidad</span>
                    {selectedScenarioId === 'continuidad' && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">Elegido</span>
                    )}
                  </div>
                </th>
                <th className="p-4 font-semibold text-violet-300 border-l border-slate-800/80 w-1/4">
                  <div className="flex items-center justify-between">
                    <span>2. Transformación</span>
                    {selectedScenarioId === 'transformacion' && (
                      <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">Elegido</span>
                    )}
                  </div>
                </th>
                <th className="p-4 font-semibold text-cyan-300 border-l border-slate-800/80 w-1/4">
                  <div className="flex items-center justify-between">
                    <span>3. Futuro Preferido</span>
                    {selectedScenarioId === 'preferido' && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">Elegido</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {criteriaList.map((crit) => (
                <tr key={crit.key} className="hover:bg-slate-850/40 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-medium text-slate-200">{crit.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 mb-2">{crit.description}</div>
                    {/* Importance Selector */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 mr-1">Prioridad:</span>
                      {(['Crítica', 'Importante', 'Secundaria'] as QualitativeImportance[]).map((imp) => (
                        <button
                          key={imp}
                          type="button"
                          onClick={() => onChangeImportance(crit.key, imp)}
                          className={`text-[10px] px-2 py-0.5 rounded transition ${
                            criteriaImportance[crit.key] === imp
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {imp}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-middle border-l border-slate-800/80">
                    {getRatingBadge(scenarios.continuidad.criteriaRatings[crit.key], crit.key)}
                  </td>
                  <td className="p-4 align-middle border-l border-slate-800/80">
                    {getRatingBadge(scenarios.transformacion.criteriaRatings[crit.key], crit.key)}
                  </td>
                  <td className="p-4 align-middle border-l border-slate-800/80">
                    {getRatingBadge(scenarios.preferido.criteriaRatings[crit.key], crit.key)}
                  </td>
                </tr>
              ))}
              {/* Bottom Row: Selector Buttons */}
              <tr className="bg-slate-950/40">
                <td className="p-4 font-semibold text-slate-300">
                  Acción para la ruta:
                </td>
                <td className="p-4 border-l border-slate-800/80">
                  <button
                    onClick={() => onSelectScenario('continuidad')}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition ${
                      selectedScenarioId === 'continuidad'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {selectedScenarioId === 'continuidad' ? '✓ Seleccionado' : 'Seleccionar'}
                  </button>
                </td>
                <td className="p-4 border-l border-slate-800/80">
                  <button
                    onClick={() => onSelectScenario('transformacion')}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition ${
                      selectedScenarioId === 'transformacion'
                        ? 'bg-violet-500 text-white shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {selectedScenarioId === 'transformacion' ? '✓ Seleccionado' : 'Seleccionar'}
                  </button>
                </td>
                <td className="p-4 border-l border-slate-800/80">
                  <button
                    onClick={() => onSelectScenario('preferido')}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition ${
                      selectedScenarioId === 'preferido'
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {selectedScenarioId === 'preferido' ? '✓ Seleccionado' : 'Seleccionar'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Sections: "What must be true" & "Signals to reconsider" */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Exploración Profunda de Condiciones y Señales</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecciona un escenario para inspeccionar qué tendría que ser cierto para que funcione y qué señales indicarían revisarlo:
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 gap-2">
          {[
            { id: 'continuidad' as ScenarioType, label: '1. Continuidad', color: 'text-amber-400' },
            { id: 'transformacion' as ScenarioType, label: '2. Transformación', color: 'text-violet-400' },
            { id: 'preferido' as ScenarioType, label: '3. Futuro Preferido', color: 'text-cyan-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabScenario(tab.id)}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
                activeTabScenario === tab.id
                  ? 'border-cyan-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={tab.color}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* ¿Qué tendría que ser cierto? */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-violet-500/20 space-y-3">
            <div className="flex items-center gap-2 text-violet-300 text-sm font-bold font-display">
              <CheckCircle2 className="w-5 h-5 text-violet-400" />
              <h3>¿Qué tendría que ser cierto para que este escenario funcione?</h3>
            </div>
            <p className="text-xs text-slate-400">
              Condiciones críticas de viabilidad y supuestos de base que deben cumplirse:
            </p>
            <ul className="space-y-2.5 pt-1">
              {currentFocusScenario.whatMustBeTrue.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ¿Qué señales me indicarían que debo reconsiderarlo? */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-bold font-display">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3>¿Qué señales tempranas indicarían que debo reconsiderarlo?</h3>
            </div>
            <p className="text-xs text-slate-400">
              Indicadores observables de alerta para no persistir ciegamente en un camino descalibrado:
            </p>
            <ul className="space-y-2.5 pt-1">
              {currentFocusScenario.signalsToReconsider.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Selected scenario confirmation banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-violet-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-cyan-300 font-semibold uppercase tracking-wider">
              Escenario activo para la ruta:
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {scenarios[selectedScenarioId].title}
            </div>
          </div>
          <button
            onClick={onNavigateToRoadmap}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Avanzar a Mi ruta hacia el futuro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
