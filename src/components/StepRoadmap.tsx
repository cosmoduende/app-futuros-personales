import React, { useState } from 'react';
import { 
  Route, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  Printer, 
  Edit3, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  ShieldCheck, 
  FileText, 
  Upload, 
  ChevronRight,
  Clock,
  Compass
} from 'lucide-react';
import { ActionRoadmap, Scenario, ScenarioType, StartingPoint, ThirtyDayAction } from '../types';

interface StepRoadmapProps {
  roadmap: ActionRoadmap;
  onChangeRoadmap: (updated: ActionRoadmap) => void;
  scenarios: Record<ScenarioType, Scenario>;
  startingPoint: StartingPoint;
  onSwitchScenario: (scenarioId: ScenarioType) => void;
  onOpenReport: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onResetSession: () => void;
  onBackToDecisionLab: () => void;
}

export const StepRoadmap: React.FC<StepRoadmapProps> = ({
  roadmap,
  onChangeRoadmap,
  scenarios,
  startingPoint,
  onSwitchScenario,
  onOpenReport,
  onExportJSON,
  onImportJSON,
  onResetSession,
  onBackToDecisionLab,
}) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editedGoal, setEditedGoal] = useState(roadmap.visionGoal3Years);
  const [editedMilestone1, setEditedMilestone1] = useState(roadmap.milestones.year1);
  const [editedMilestone2, setEditedMilestone2] = useState(roadmap.milestones.year2);
  const [editedMilestone3, setEditedMilestone3] = useState(roadmap.milestones.year3);

  // New action modal or form state
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('Semana 1');
  const [newIndicator, setNewIndicator] = useState('');
  const [newObstacle, setNewObstacle] = useState('');
  const [newAlternative, setNewAlternative] = useState('');

  const currentScenario = scenarios[roadmap.chosenScenarioId] || scenarios.preferido;

  const toggleActionDone = (actionId: string) => {
    const updatedActions = roadmap.thirtyDayActions.map((a) => {
      if (a.id === actionId) return { ...a, completed: !a.completed };
      return a;
    });
    onChangeRoadmap({ ...roadmap, thirtyDayActions: updatedActions });
  };

  const deleteAction = (actionId: string) => {
    const updatedActions = roadmap.thirtyDayActions.filter((a) => a.id !== actionId);
    onChangeRoadmap({ ...roadmap, thirtyDayActions: updatedActions });
  };

  const handleSaveMeta = () => {
    onChangeRoadmap({
      ...roadmap,
      visionGoal3Years: editedGoal,
      milestones: {
        year1: editedMilestone1,
        year2: editedMilestone2,
        year3: editedMilestone3,
      },
    });
    setIsEditingMeta(false);
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAction: ThirtyDayAction = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Acción personalizada para avanzar hacia el objetivo.',
      timeframe: newTimeframe.trim() || 'Próximos días',
      indicator: newIndicator.trim() || 'Verificación observable completada.',
      possibleObstacle: newObstacle.trim() || 'Sobrecarga de tareas habituales.',
      alternativePlan: newAlternative.trim() || 'Ajustar plazo o dividir en dos sesiones breves.',
      completed: false,
    };

    onChangeRoadmap({
      ...roadmap,
      thirtyDayActions: [...roadmap.thirtyDayActions, newAction],
    });

    setNewTitle('');
    setNewDesc('');
    setNewIndicator('');
    setNewObstacle('');
    setNewAlternative('');
    setIsAddingAction(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Header & Scenario Switcher */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-medium mb-1.5">
            <Route className="w-3.5 h-3.5" />
            <span>Fase F & G &bull; Retroplanificación y Plan de Acción 30 Días</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            Mi ruta hacia el futuro
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Desde la meta a 3 años retroplanificamos hacia el presente. Concreta tus primeros 30 días con indicadores observables y planes de contingencia.
          </p>
        </div>

        {/* Change scenario pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-xs text-slate-400">Favoreciendo:</span>
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            {[
              { id: 'continuidad' as ScenarioType, label: 'Continuidad' },
              { id: 'transformacion' as ScenarioType, label: 'Transformación' },
              { id: 'preferido' as ScenarioType, label: 'Preferido' },
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSwitchScenario(sc.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  roadmap.chosenScenarioId === sc.id
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsible Foresight Notice */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-emerald-500/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-300">Prospectiva Responsable:</strong> FuturoLab prioriza la sostenibilidad de tu trayectoria. Los pasos propuestos son incrementales y basados en micro-pruebas de bajo costo. No comprometen tu empleo actual ni sugieren endeudamientos o decisiones irreversibles sin previo análisis de contingencias.
        </div>
      </div>

      {/* 3-Year Vision & Backcasting Milestones Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Horizonte a 3 Años & Retroplanificación (Backcasting)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Desde el Año 3 descendemos al Año 2, Año 1 y al momento actual
            </p>
          </div>
          <button
            onClick={() => setIsEditingMeta(!isEditingMeta)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingMeta ? 'Cancelar edición' : 'Editar meta e hitos'}</span>
          </button>
        </div>

        {/* 3-Year Vision Display / Edit */}
        {isEditingMeta ? (
          <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-700 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Meta Visión a 3 Años:
              </label>
              <textarea
                rows={2}
                value={editedGoal}
                onChange={(e) => setEditedGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Hito Año 3 (Consolidación):
              </label>
              <input
                type="text"
                value={editedMilestone3}
                onChange={(e) => setEditedMilestone3(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Hito Año 2 (Aceleración):
              </label>
              <input
                type="text"
                value={editedMilestone2}
                onChange={(e) => setEditedMilestone2(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Hito Año 1 (Cimientos):
              </label>
              <input
                type="text"
                value={editedMilestone1}
                onChange={(e) => setEditedMilestone1(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingMeta(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMeta}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/30 to-cyan-950/30 border border-cyan-500/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Meta Principal del Escenario ({currentScenario.title})
              </span>
              <p className="text-sm font-medium text-white leading-relaxed">
                "{roadmap.visionGoal3Years}"
              </p>
            </div>

            {/* Visual Backcasting Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-cyan-300 uppercase">Año 3 &bull; Consolidación</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                </div>
                <p className="text-xs text-slate-200">{roadmap.milestones.year3}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-violet-500/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-violet-300 uppercase">Año 2 &bull; Aceleración</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400"></span>
                </div>
                <p className="text-xs text-slate-200">{roadmap.milestones.year2}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase">Año 1 &bull; Cimientos</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-xs text-slate-200">{roadmap.milestones.year1}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 30-Day Action Plan Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              <span>Plan Inicial de 30 Días (Primeros Pasos Concretos)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Acciones con fecha estimada, indicador observable de avance y plan B para obstáculos
            </p>
          </div>

          <button
            onClick={() => setIsAddingAction(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-semibold shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir acción propia</span>
          </button>
        </div>

        {/* Adding Action Inline Form */}
        {isAddingAction && (
          <form onSubmit={handleAddAction} className="p-4 rounded-xl bg-slate-950 border border-violet-500/40 space-y-3 animate-in fade-in">
            <div className="font-semibold text-white text-xs flex items-center justify-between">
              <span>Nueva Acción Concreta de 30 Días</span>
              <button
                type="button"
                onClick={() => setIsAddingAction(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Título de la acción (ej. Entrevistar a un especialista en IA)..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Plazo (ej. Días 1 a 7)..."
                  value={newTimeframe}
                  onChange={(e) => setNewTimeframe(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Descripción detallada de la acción..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Indicador observable de avance..."
                  value={newIndicator}
                  onChange={(e) => setNewIndicator(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Obstáculo posible previsto..."
                  value={newObstacle}
                  onChange={(e) => setNewObstacle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Alternativa si aparece el obstáculo (Plan B)..."
                  value={newAlternative}
                  onChange={(e) => setNewAlternative(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAction(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Guardar Acción
              </button>
            </div>
          </form>
        )}

        {/* Action Items List */}
        <div className="space-y-3">
          {roadmap.thirtyDayActions.map((action, idx) => (
            <div
              key={action.id || idx}
              className={`p-4 rounded-xl border transition-all ${
                action.completed
                  ? 'bg-slate-950/40 border-emerald-900/40 opacity-75'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleActionDone(action.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition ${
                      action.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-700 hover:border-cyan-400 bg-slate-900'
                    }`}
                    title={action.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    aria-label={`Completar acción ${action.title}`}
                  >
                    {action.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-semibold ${action.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {idx + 1}. {action.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                        {action.timeframe}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteAction(action.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition shrink-0"
                  title="Eliminar acción"
                  aria-label="Eliminar acción"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Observable Indicator & Plan B Grid */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                  <span className="font-semibold text-emerald-400 block mb-0.5">
                    Indicador observable de avance:
                  </span>
                  <span className="text-slate-300">{action.indicator}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30">
                  <span className="font-semibold text-amber-400 block mb-0.5">
                    Obstáculo & Plan B:
                  </span>
                  <span className="text-slate-300">
                    {action.possibleObstacle} &rarr; <em className="text-amber-200">{action.alternativePlan}</em>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onBackToDecisionLab}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            &larr; Volver a matriz
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Download Report Modal */}
          <button
            onClick={onOpenReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Descargar mi informe</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition"
            title="Exportar archivo JSON para reanudar más tarde"
          >
            <Download className="w-4 h-4" />
            <span>Exportar JSON</span>
          </button>

          {/* Import JSON hidden input */}
          <label className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 cursor-pointer transition">
            <Upload className="w-4 h-4 text-violet-400" />
            <span>Importar JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Reset Experience */}
          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-semibold border border-rose-900/40 transition"
            title="Borrar memoria y reiniciar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
