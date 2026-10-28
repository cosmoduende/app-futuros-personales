/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, AppGenerationState } from './components/Header';
import { StepStartingPoint } from './components/StepStartingPoint';
import { StepScenarioMap } from './components/StepScenarioMap';
import { StepDecisionLab } from './components/StepDecisionLab';
import { StepRoadmap } from './components/StepRoadmap';
import { MethodologyModal } from './components/MethodologyModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ReportModal } from './components/ReportModal';
import { 
  StartingPoint, 
  Scenario, 
  ScenarioType, 
  CriteriaImportanceMap, 
  ActionRoadmap, 
  QualitativeImportance 
} from './types';
import { synthesizeScenariosFromStartingPoint, generateRoadmapForScenario } from './utils/scenarioGenerator';
import { DEMO_PRESETS } from './utils/demoPresets';
import { downloadSessionAsJSON, FullSessionExport } from './utils/exportUtils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const INITIAL_STARTING_POINT: StartingPoint = {
  selectedScopes: ['profesional'],
  currentSituation: '',
  threeYearAspiration: '',
  skillsAndResources: '',
  limitationsAndObstacles: '',
  trends: '',
  willingToChange: '',
  wantToPreserve: '',
};

const INITIAL_CRITERIA_IMPORTANCE: CriteriaImportanceMap = {
  aspirationFit: 'Crítica',
  resourcesRequired: 'Importante',
  opportunitiesLevel: 'Importante',
  risksLevel: 'Importante',
  uncertaintyLevel: 'Importante',
  flexibility: 'Importante',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [startingPoint, setStartingPoint] = useState<StartingPoint>(INITIAL_STARTING_POINT);
  const [scenarios, setScenarios] = useState<Record<ScenarioType, Scenario> | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioType>('preferido');
  const [criteriaImportance, setCriteriaImportance] = useState<CriteriaImportanceMap>(INITIAL_CRITERIA_IMPORTANCE);
  const [roadmap, setRoadmap] = useState<ActionRoadmap | null>(null);

  // AI & Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [generationState, setGenerationState] = useState<AppGenerationState>('idle');
  const [dataSource, setDataSource] = useState<'gemini' | 'demo' | 'local'>('local');
  const [modelName, setModelName] = useState<string>('gemini-3.1-flash-lite');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Modals
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Toast / Status notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Check API health on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasApiKey(true);
          if (generationState === 'idle') {
            setGenerationState('idle');
          }
        } else {
          setHasApiKey(false);
          setGenerationState('ai_unconfigured');
        }
        if (data.model) {
          setModelName(data.model);
        }
      })
      .catch((err) => {
        console.warn('Could not verify /api/status:', err);
      });
  }, []);

  // Determine which steps can be accessed
  const canNavigateToStep = (step: 1 | 2 | 3 | 4): boolean => {
    if (step === 1) return true;
    if (step === 2) return Boolean(scenarios);
    if (step === 3) return Boolean(scenarios);
    if (step === 4) return Boolean(roadmap);
    return false;
  };

  // Real Gemini scenario generation (Step 1 -> Step 2)
  const handleGenerateScenarios = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          startingPoint,
          isDemoRequest: false 
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorText = data.error || `Error del servidor (${response.status})`;
        throw new Error(errorText);
      }

      if (data.scenarios && data.scenarios.continuidad && data.scenarios.preferido) {
        setScenarios(data.scenarios);
        setDataSource('gemini');
        setGenerationState('ai_connected');
        if (data.model) setModelName(data.model);

        // Pre-build default roadmap for preferido
        const chosen = data.scenarios[selectedScenarioId] || data.scenarios.preferido;
        const initialRoadmap = generateRoadmapForScenario(chosen, startingPoint);
        setRoadmap(initialRoadmap);

        setCurrentStep(2);
        showToast('¡Escenarios generados con éxito mediante Gemini!', 'success');
      } else {
        throw new Error('La respuesta de Gemini no contiene la estructura requerida.');
      }
    } catch (err: any) {
      console.error('Error generando con Gemini:', err.message);
      // DO NOT silently fall back to mock data! Report genuine error to user so they can retry.
      setGenerationError(err.message || 'Error de conexión con la API de Gemini.');
      showToast(`No se pudo generar con Gemini: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate scenarios with Gemini (from Step 2)
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/generate-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          startingPoint,
          isDemoRequest: dataSource === 'demo'
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.scenarios) {
        setScenarios(data.scenarios);
        if (data.source === 'gemini') {
          setDataSource('gemini');
          setGenerationState('ai_connected');
        }
        if (roadmap) {
          const chosen = data.scenarios[roadmap.chosenScenarioId] || data.scenarios.preferido;
          setRoadmap(generateRoadmapForScenario(chosen, startingPoint));
        }
        showToast('Escenarios recalculados con éxito.', 'success');
      } else {
        throw new Error(data.error || 'Fallo al regenerar');
      }
    } catch (err: any) {
      showToast(`Error al regenerar: ${err.message}`, 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Load demo preset (Elena, Carlos, Mariana)
  const handleLoadPreset = (presetId: string) => {
    const found = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;

    setStartingPoint(found.startingPoint);
    setDataSource('demo');
    setGenerationState('demo');
    setGenerationError(null);

    const synthesized = synthesizeScenariosFromStartingPoint(found.startingPoint);
    setScenarios(synthesized);
    setSelectedScenarioId('preferido');
    const initialRoadmap = generateRoadmapForScenario(synthesized.preferido, found.startingPoint);
    setRoadmap(initialRoadmap);

    showToast(`Cargado perfil de demostración: ${found.label}`, 'info');
    setCurrentStep(2);
  };

  // Switch chosen scenario
  const handleSelectScenario = (scenarioId: ScenarioType) => {
    setSelectedScenarioId(scenarioId);
    if (scenarios) {
      const chosen = scenarios[scenarioId];
      const newRoadmap = generateRoadmapForScenario(chosen, startingPoint);
      setRoadmap(newRoadmap);
    }
  };

  // Importance change
  const handleChangeImportance = (criteria: keyof CriteriaImportanceMap, val: QualitativeImportance) => {
    setCriteriaImportance((prev) => ({
      ...prev,
      [criteria]: val,
    }));
  };

  // Export full session to JSON
  const handleExportJSON = () => {
    if (!scenarios || !roadmap) {
      showToast('No hay estudio completo para exportar.', 'error');
      return;
    }
    const sessionExport: FullSessionExport = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      startingPoint,
      scenarios,
      criteriaImportance,
      roadmap,
    };
    downloadSessionAsJSON(sessionExport);
    showToast('Archivo JSON descargado correctamente.', 'success');
  };

  // Import JSON session
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed: FullSessionExport = JSON.parse(content);
        if (parsed.startingPoint && parsed.scenarios && parsed.roadmap) {
          setStartingPoint(parsed.startingPoint);
          setScenarios(parsed.scenarios as Record<ScenarioType, Scenario>);
          if (parsed.criteriaImportance) setCriteriaImportance(parsed.criteriaImportance);
          setRoadmap(parsed.roadmap);
          if (parsed.roadmap.chosenScenarioId) {
            setSelectedScenarioId(parsed.roadmap.chosenScenarioId);
          }
          setDataSource('local');
          setGenerationState('idle');
          setCurrentStep(4);
          showToast('Estudio de prospectiva importado con éxito.', 'success');
        } else {
          showToast('El archivo JSON no contiene la estructura requerida.', 'error');
        }
      } catch (err) {
        showToast('Error al procesar el archivo JSON importado.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Clear in-memory session
  const handleResetSession = () => {
    setStartingPoint(INITIAL_STARTING_POINT);
    setScenarios(null);
    setSelectedScenarioId('preferido');
    setCriteriaImportance(INITIAL_CRITERIA_IMPORTANCE);
    setRoadmap(null);
    setGenerationError(null);
    setDataSource('local');
    setGenerationState(hasApiKey ? 'idle' : 'ai_unconfigured');
    setCurrentStep(1);
    showToast('Sesión en memoria reiniciada por completo.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-900">
      {/* Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        canNavigateToStep={canNavigateToStep}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenReset={() => setIsResetConfirmOpen(true)}
        generationState={generationState}
        modelName={modelName}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Toast alert */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm animate-in slide-in-from-bottom duration-200 ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : toastMessage.type === 'error'
                ? 'bg-slate-900 border-rose-500/50 text-rose-300'
                : 'bg-slate-900 border-cyan-500/50 text-cyan-300'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Step 1: Starting Point */}
        {currentStep === 1 && (
          <StepStartingPoint
            startingPoint={startingPoint}
            onChange={(updated) => setStartingPoint(updated)}
            onSubmit={handleGenerateScenarios}
            isGenerating={isGenerating}
            generationError={generationError}
            onClearError={() => setGenerationError(null)}
            onLoadPreset={handleLoadPreset}
            hasApiKey={hasApiKey}
          />
        )}

        {/* Step 2: Scenario Map */}
        {currentStep === 2 && scenarios && (
          <StepScenarioMap
            scenarios={scenarios}
            startingPoint={startingPoint}
            onSelectScenarioForAction={(scId) => {
              handleSelectScenario(scId);
              setCurrentStep(4);
            }}
            onNavigateToDecisionLab={() => setCurrentStep(3)}
            onBackToStartingPoint={() => setCurrentStep(1)}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
            source={dataSource}
            modelName={modelName}
          />
        )}

        {/* Step 3: Decision Lab */}
        {currentStep === 3 && scenarios && (
          <StepDecisionLab
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={handleSelectScenario}
            criteriaImportance={criteriaImportance}
            onChangeImportance={handleChangeImportance}
            onNavigateToRoadmap={() => setCurrentStep(4)}
            onBackToMap={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Action Roadmap */}
        {currentStep === 4 && roadmap && scenarios && (
          <StepRoadmap
            roadmap={roadmap}
            onChangeRoadmap={(updated) => setRoadmap(updated)}
            scenarios={scenarios}
            startingPoint={startingPoint}
            onSwitchScenario={handleSelectScenario}
            onOpenReport={() => setIsReportModalOpen(true)}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onResetSession={() => setIsResetConfirmOpen(true)}
            onBackToDecisionLab={() => setCurrentStep(3)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">FuturoLab</span>
            <span>&bull;</span>
            <span>"Imagina. Explora. Decide. Construye."</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Inspirado en la prospectiva personal de Verne Wheelwright &bull; Datos en memoria de sesión
          </div>
        </div>
      </footer>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetSession}
      />

      {/* Printable Report Modal */}
      {scenarios && roadmap && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          data={{
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            startingPoint,
            scenarios,
            criteriaImportance,
            roadmap,
          }}
        />
      )}
    </div>
  );
}
