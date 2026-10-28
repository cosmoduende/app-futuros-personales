import React from 'react';
import { Compass, Sparkles, RotateCcw, HelpCircle, Layers, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export type AppGenerationState = 'idle' | 'demo' | 'ai_connected' | 'ai_unconfigured';

interface HeaderProps {
  currentStep: 1 | 2 | 3 | 4;
  onSelectStep: (step: 1 | 2 | 3 | 4) => void;
  canNavigateToStep: (step: 1 | 2 | 3 | 4) => boolean;
  onOpenMethodology: () => void;
  onOpenReset: () => void;
  generationState: AppGenerationState;
  modelName?: string;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  canNavigateToStep,
  onOpenMethodology,
  onOpenReset,
  generationState,
  modelName,
  hasApiKey,
}) => {
  const steps = [
    { num: 1 as const, title: 'Mi punto de partida', short: 'Partida' },
    { num: 2 as const, title: 'Mi mapa de futuros', short: 'Mapa' },
    { num: 3 as const, title: 'Laboratorio de decisiones', short: 'Decisiones' },
    { num: 4 as const, title: 'Mi ruta hacia el futuro', short: 'Ruta 30d' },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Slogan & Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  FuturoLab
                </span>

                {/* State Badge strictly following rule 8 */}
                {generationState === 'ai_connected' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-sm shadow-emerald-950/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>IA conectada</span>
                    {modelName && <span className="text-slate-400 hidden sm:inline">&bull; {modelName}</span>}
                  </span>
                )}

                {generationState === 'demo' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Modo demo
                  </span>
                )}

                {generationState === 'ai_unconfigured' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30" title="Configura GEMINI_API_KEY en Settings > Secrets">
                    Modo demo (IA sin configurar)
                  </span>
                )}

                {generationState === 'idle' && (
                  <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 hidden sm:inline-flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Gemini listo</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Imagina. Explora. Decide. Construye.
              </p>
            </div>
          </div>

          {/* Stepper Navigation (Desktop & Tablet) */}
          <nav aria-label="Progreso del estudio" className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isEnabled = canNavigateToStep(s.num);

              return (
                <button
                  key={s.num}
                  disabled={!isEnabled}
                  onClick={() => onSelectStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-white border border-cyan-500/40 shadow-sm'
                      : isEnabled
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                      : 'text-slate-600 cursor-not-allowed border border-transparent'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : isEnabled
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="hidden lg:inline">{s.title}</span>
                  <span className="lg:hidden">{s.short}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMethodology}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              title="Metodología de prospectiva personal Verne Wheelwright"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Metodología</span>
            </button>

            <button
              onClick={onOpenReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-300 bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 transition"
              title="Reiniciar y borrar datos de sesión"
              aria-label="Reiniciar sesión"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Mobile Stepper Bar */}
        <div className="md:hidden py-2 border-t border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5 w-full">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isEnabled = canNavigateToStep(s.num);

              return (
                <button
                  key={s.num}
                  disabled={!isEnabled}
                  onClick={() => onSelectStep(s.num)}
                  className={`flex-1 py-1 px-1 rounded-lg text-center text-[11px] font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : isEnabled
                      ? 'bg-slate-900 text-slate-400'
                      : 'bg-slate-950 text-slate-700'
                  }`}
                >
                  {s.num}. {s.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
