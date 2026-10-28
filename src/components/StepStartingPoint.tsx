import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Rocket, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Info, 
  Check, 
  Play, 
  FileEdit,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { StartingPoint, ScopeType } from '../types';
import { DEMO_PRESETS } from '../utils/demoPresets';

interface StepStartingPointProps {
  startingPoint: StartingPoint;
  onChange: (updated: StartingPoint) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  generationError: string | null;
  onClearError: () => void;
  onLoadPreset: (presetId: string) => void;
  hasApiKey: boolean;
}

export const StepStartingPoint: React.FC<StepStartingPointProps> = ({
  startingPoint,
  onChange,
  onSubmit,
  isGenerating,
  generationError,
  onClearError,
  onLoadPreset,
  hasApiKey,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleScope = (scope: ScopeType) => {
    const exists = startingPoint.selectedScopes.includes(scope);
    let next: ScopeType[];
    if (exists) {
      if (startingPoint.selectedScopes.length === 1) return; // Keep at least one
      next = startingPoint.selectedScopes.filter(s => s !== scope);
    } else {
      next = [...startingPoint.selectedScopes, scope];
    }
    onChange({ ...startingPoint, selectedScopes: next });
  };

  const handleFieldChange = (field: keyof StartingPoint, value: any) => {
    onChange({ ...startingPoint, [field]: value });
    if (validationError) setValidationError(null);
    if (generationError) onClearError();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingPoint.currentSituation.trim()) {
      setValidationError('Por favor describe tu situación actual para orientar el mapa.');
      return;
    }
    if (!startingPoint.threeYearAspiration.trim()) {
      setValidationError('Por favor indica tu aspiración principal a 3 años.');
      return;
    }
    setValidationError(null);
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prospectiva Personal &bull; Generación Real con Gemini</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display">
            Bienvenido a FuturoLab
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
            Introduce tus datos reales para generar mediante la IA de Gemini tres escenarios personalizados a un horizonte de tres años (Continuidad, Transformación y Futuro Preferido). Construye tu retroplanificación y un plan de acción para los primeros 30 días.
          </p>
        </div>

        {/* Demo Presets Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Play className="w-3.5 h-3.5 text-violet-400" />
              <span>Modo Demostración Alternativo (perfiles simulados):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onLoadPreset(p.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
                >
                  <span>{p.label.split('—')[0].trim()}</span>
                  <span className="text-[10px] text-cyan-400">({p.role.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error state if Gemini generation failed */}
      {generationError && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Error al conectar con Gemini</h3>
              <p className="text-xs text-rose-200 leading-relaxed">{generationError}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar generación con Gemini</span>
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset('tech-lead')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
            >
              Explorar mientras tanto en Modo Demo (Elena)
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Scope Selector */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-base font-semibold text-white flex items-center gap-2">
              <span>1. Ámbitos de exploración</span>
              <span className="text-xs font-normal text-slate-400">(Selecciona uno o varios)</span>
            </label>
            <p className="text-xs text-slate-400 mt-1">
              ¿En qué dimensiones de tu vida deseas proyectar los próximos tres años?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'profesional' as ScopeType,
                title: 'Desarrollo profesional',
                desc: 'Carrera laboral, ascensos, cambio de sector o especialización',
                icon: Briefcase,
              },
              {
                id: 'estudios' as ScopeType,
                title: 'Estudios y formación',
                desc: 'Másteres, certificaciones, investigación o nuevas habilidades',
                icon: GraduationCap,
              },
              {
                id: 'emprendimiento' as ScopeType,
                title: 'Emprendimiento',
                desc: 'Creación de proyectos, negocios propios, consultoría o freelancing',
                icon: Rocket,
              },
            ].map((scope) => {
              const isSelected = startingPoint.selectedScopes.includes(scope.id);
              const Icon = scope.icon;

              return (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => toggleScope(scope.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-slate-800/90 to-slate-900 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start justify-between w-full mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {scope.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {scope.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Questions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-white">2. Tu situación y aspiraciones</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Respuestas breves y precisas. Gemini las utilizará para calcular los tres escenarios diferenciados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Situación actual */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="currentSituation" className="text-sm font-medium text-slate-200">
                  Situación actual <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">¿Dónde te encuentras hoy?</span>
              </div>
              <textarea
                id="currentSituation"
                rows={2}
                value={startingPoint.currentSituation}
                onChange={(e) => handleFieldChange('currentSituation', e.target.value)}
                placeholder="Ejemplo: Llevo 3 años como especialista de operaciones en una pyme. Domino la gestión diaria pero siento que mis tareas son repetitivas..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
                required
              />
            </div>

            {/* Aspiración a 3 años */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="threeYearAspiration" className="text-sm font-medium text-slate-200">
                  Aspiración principal a tres años <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">¿Qué te gustaría ver hecho realidad?</span>
              </div>
              <textarea
                id="threeYearAspiration"
                rows={2}
                value={startingPoint.threeYearAspiration}
                onChange={(e) => handleFieldChange('threeYearAspiration', e.target.value)}
                placeholder="Ejemplo: Liderar proyectos de consultoría en transformación digital con clientes propios o un rol de dirección estratégica con autonomía..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition"
                required
              />
            </div>

            {/* Grid 2 cols for resources and obstacles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="skillsAndResources" className="text-sm font-medium text-slate-200 block mb-1">
                  Habilidades y recursos disponibles <span className="text-xs text-slate-500 font-normal">(Opcional)</span>
                </label>
                <textarea
                  id="skillsAndResources"
                  rows={2}
                  value={startingPoint.skillsAndResources}
                  onChange={(e) => handleFieldChange('skillsAndResources', e.target.value)}
                  placeholder="Fortalezas, red de contactos, experiencia previa, horas disponibles..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs transition"
                />
              </div>

              <div>
                <label htmlFor="limitationsAndObstacles" className="text-sm font-medium text-slate-200 block mb-1">
                  Limitaciones y obstáculos percibidos <span className="text-xs text-slate-500 font-normal">(Opcional)</span>
                </label>
                <textarea
                  id="limitationsAndObstacles"
                  rows={2}
                  value={startingPoint.limitationsAndObstacles}
                  onChange={(e) => handleFieldChange('limitationsAndObstacles', e.target.value)}
                  placeholder="Falta de tiempo, presupuesto ajustado, incertidumbre regulatoria..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs transition"
                />
              </div>
            </div>

            {/* Trends */}
            <div>
              <label htmlFor="trends" className="text-sm font-medium text-slate-200 block mb-1">
                Tendencias del entorno que podrían afectar tu objetivo <span className="text-xs text-slate-500 font-normal">(Opcional)</span>
              </label>
              <textarea
                id="trends"
                rows={2}
                value={startingPoint.trends}
                onChange={(e) => handleFieldChange('trends', e.target.value)}
                placeholder="Auge de inteligencia artificial, teletrabajo global, sostenibilidad, demanda de habilidades no-code..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs transition"
              />
            </div>

            {/* Grid 2 cols for willingToChange vs wantToPreserve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-900/30">
                <label htmlFor="willingToChange" className="text-xs font-semibold text-violet-300 block mb-1">
                  ¿Qué estás dispuesto a cambiar? (Disposición al cambio)
                </label>
                <textarea
                  id="willingToChange"
                  rows={2}
                  value={startingPoint.willingToChange}
                  onChange={(e) => handleFieldChange('willingToChange', e.target.value)}
                  placeholder="Dedicar 5 horas semanales a estudiar, reducir ocio pasivo, cambiar de ciudad si surge una oportunidad..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 text-xs transition"
                />
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/30">
                <label htmlFor="wantToPreserve" className="text-xs font-semibold text-cyan-300 block mb-1">
                  ¿Qué aspectos deseas preservar? (No negociables)
                </label>
                <textarea
                  id="wantToPreserve"
                  rows={2}
                  value={startingPoint.wantToPreserve}
                  onChange={(e) => handleFieldChange('wantToPreserve', e.target.value)}
                  placeholder="Tiempo con mi familia, salud física y mental, estabilidad económica básica sin deudas peligrosas..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice (Rule 6) */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
          <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Privacidad y Tratamiento de Datos con Gemini
            </p>
            <p className="leading-relaxed text-slate-300">
              FuturoLab no exige registro ni guarda tus respuestas personales en bases de datos del servidor ni en localStorage. Tus datos se mantienen en la memoria temporal durante tu sesión activa. Al pulsar el botón siguiente, tus respuestas serán enviadas a la API de Gemini de Google AI Studio para procesar los tres escenarios prospectivos según las condiciones del servicio. Puedes borrar todos los datos en cualquier momento con el botón "Reiniciar".
            </p>
          </div>
        </div>

        {validationError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500">
            * Campos mínimos requeridos para calcular los tres escenarios.
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 text-white shadow-xl transition-all ${
              isGenerating
                ? 'bg-slate-800 cursor-wait text-slate-400'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Generando escenarios con Gemini en tiempo real (~8-12 seg)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Construir mi mapa de futuros con Gemini</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
