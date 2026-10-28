import React from 'react';
import { X, Compass, Target, ArrowLeftRight, Bell, ShieldCheck } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl shadow-cyan-950/40 text-slate-200"
        role="dialog"
        aria-labelledby="methodology-title"
      >
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 id="methodology-title" className="text-lg font-bold text-white font-display">
                Metodología Verne Wheelwright & Prospectiva Personal
              </h2>
              <p className="text-xs text-slate-400">Cómo pensar en tu futuro sin falsas predicciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-gradient-to-r from-violet-950/40 to-cyan-950/40 border border-violet-500/20 rounded-xl p-4">
            <p className="text-slate-200 font-medium">
              "El futuro no se predice: se explora, se decide y se construye."
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Verne Wheelwright, pionero de la prospectiva aplicada al individuo (Personal Foresight), adaptó las herramientas de los estudios de futuros corporativos para la vida de las personas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">1. Explorar antes de decidir (Los 3 Escenarios)</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  En lugar de apostar a un único camino rígido, construimos tres escenarios arquetípicos:
                </p>
                <ul className="list-disc pl-4 mt-1.5 text-xs text-slate-400 space-y-1">
                  <li><strong className="text-slate-200">Continuidad:</strong> qué ocurre si mantienes tu inercia actual. Revela el riesgo de estancamiento.</li>
                  <li><strong className="text-slate-200">Transformación:</strong> qué ocurre ante una bifurcación audaz. Revela las exigencias del cambio.</li>
                  <li><strong className="text-slate-200">Futuro Preferido:</strong> el escenario que buscas cultivar intencionalmente protegiendo tus valores esenciales.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">2. Retroplanificación (Backcasting)</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  En lugar de planear desde hoy hacia adelante con las limitaciones actuales, nos situamos mentalmente en el Año 3 y nos preguntamos: <em>¿Qué tuvo que ocurrir en el Año 2, en el Año 1 y en los próximos 30 días para que este horizonte fuera posible?</em>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">3. Señales Centinela (Early Warning Signals)</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Los planes cambian cuando cambia la realidad. Los escenarios definen indicadores observables tempranos que te avisan con meses de antelación si debes acelerar, pivotar o reconsiderar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white">4. Prudencia y No-Determinismo</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  FuturoLab jamás te incitará a renunciar a tu empleo intempestivamente, endeudarte ni tomar decisiones irreversibles a ciegas. Promovemos micro-experimentos de bajo riesgo para contrastar hipótesis con la realidad.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-xs rounded-xl shadow transition"
            >
              Comprendido, continuar explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
