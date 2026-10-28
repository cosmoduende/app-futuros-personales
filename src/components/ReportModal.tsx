import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { StartingPoint, Scenario, ActionRoadmap, CriteriaImportanceMap } from '../types';
import { generatePrintableReportHTML, FullSessionExport } from '../utils/exportUtils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullSessionExport;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const { startingPoint, scenarios, roadmap } = data;
  const chosenScenario = scenarios[roadmap.chosenScenarioId] || scenarios.preferido;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const htmlContent = generatePrintableReportHTML(data);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futurolab-informe-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden"
        role="dialog"
        aria-labelledby="report-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-lg font-bold text-white font-display">
                Informe Ejecutivo de Prospectiva Personal
              </h2>
              <p className="text-xs text-slate-400">FuturoLab &bull; Horizonte 3 Años &bull; Backcasting</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-lg border border-slate-700 transition"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={handleDownloadHTML}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-medium rounded-lg shadow transition"
              title="Descargar archivo HTML independiente"
            >
              <Download className="w-4 h-4" />
              <span>Descargar HTML</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-2"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          {/* Executive Summary Card */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">Punto de partida</span>
              <div className="flex gap-1.5">
                {startingPoint.selectedScopes.map(scope => (
                  <span key={scope} className="text-[11px] px-2 py-0.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-800/40 capitalize">
                    {scope}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Aspiración a 3 Años</h3>
              <p className="text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                "{startingPoint.threeYearAspiration}"
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-700/50">
              <div>
                <strong className="text-slate-200">Situación actual:</strong> {startingPoint.currentSituation}
              </div>
              <div>
                <strong className="text-slate-200">Aspectos a preservar:</strong> {startingPoint.wantToPreserve || 'Estabilidad y bienestar integral'}
              </div>
            </div>
          </div>

          {/* Chosen Scenario */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/40 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Escenario Elegido para la Ruta de Acción</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              {chosenScenario.title}
            </h3>
            <p className="text-xs italic text-slate-300">"{chosenScenario.tagline}"</p>
            <p className="text-xs text-slate-300 leading-relaxed">{chosenScenario.narrative}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-700/60 text-xs">
              <div>
                <h4 className="font-semibold text-violet-300 mb-1">¿Qué tiene que ser cierto?</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {chosenScenario.whatMustBeTrue.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-amber-300 mb-1">Señales centinela para reconsiderar</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {chosenScenario.signalsToReconsider.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3-Year Backcasting Timeline */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h3 className="text-white font-semibold text-sm font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Retroplanificación desde el Año 3 hasta el Presente
            </h3>
            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-900/70 border-l-4 border-cyan-500">
                <div className="text-xs font-bold text-cyan-300">Año 3 — Horizonte de Consolidación</div>
                <div className="text-xs text-slate-300 mt-1">{roadmap.milestones.year3}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/70 border-l-4 border-violet-500">
                <div className="text-xs font-bold text-violet-300">Año 2 — Tracción y Escalado</div>
                <div className="text-xs text-slate-300 mt-1">{roadmap.milestones.year2}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/70 border-l-4 border-emerald-500">
                <div className="text-xs font-bold text-emerald-300">Año 1 — Cimientos y Validación</div>
                <div className="text-xs text-slate-300 mt-1">{roadmap.milestones.year1}</div>
              </div>
            </div>
          </div>

          {/* 30-Day Action Plan */}
          <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h3 className="text-white font-semibold text-sm font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              Plan Inicial de 30 Días (Primeras Acciones Concretas)
            </h3>
            <div className="space-y-2.5">
              {roadmap.thirtyDayActions.map((action, idx) => (
                <div key={action.id || idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] border border-cyan-500/30">
                        {idx + 1}
                      </span>
                      {action.title}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {action.timeframe}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{action.description}</p>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-800">
                    <div className="text-emerald-300">
                      <strong>Indicador:</strong> {action.indicator}
                    </div>
                    <div className="text-amber-300">
                      <strong>Plan B ante obstáculo:</strong> {action.alternativePlan}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>FuturoLab &bull; Los escenarios son exploraciones condicionales, no profecías.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
