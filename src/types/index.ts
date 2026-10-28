export type ScopeType = 'profesional' | 'estudios' | 'emprendimiento';

export interface StartingPoint {
  selectedScopes: ScopeType[];
  currentSituation: string;
  threeYearAspiration: string;
  skillsAndResources: string;
  limitationsAndObstacles: string;
  trends: string;
  willingToChange: string;
  wantToPreserve: string;
}

export type ScenarioType = 'continuidad' | 'transformacion' | 'preferido';

export interface YearMilestone {
  title: string;
  description: string;
  indicator: string;
}

export interface Scenario {
  id: ScenarioType;
  title: string;
  tagline: string;
  narrative: string;
  favorableConditions: string[];
  opportunities: string[];
  risksAndObstacles: string[];
  keyAssumptions: string[];
  catalyticDecisions: string[];
  earlySignals: string[];
  milestones: {
    year1: YearMilestone;
    year2: YearMilestone;
    year3: YearMilestone;
  };
  whatMustBeTrue: string[];
  signalsToReconsider: string[];
  criteriaRatings: {
    aspirationFit: 'Alta' | 'Media' | 'Baja';
    resourcesRequired: 'Alto' | 'Medio' | 'Moderado';
    opportunitiesLevel: 'Alto' | 'Medio' | 'Específico';
    risksLevel: 'Alto' | 'Medio' | 'Bajo';
    uncertaintyLevel: 'Alta' | 'Media' | 'Baja';
    flexibility: 'Alta' | 'Media' | 'Limitada';
  };
}

export interface ThirtyDayAction {
  id: string;
  title: string;
  description: string;
  timeframe: string; // e.g. "Días 1 a 7", "Semana 2", etc.
  indicator: string; // Indicador observable de avance
  possibleObstacle: string; // Obstáculo posible
  alternativePlan: string; // Alternativa si aparece el obstáculo
  completed: boolean;
}

export interface ActionRoadmap {
  chosenScenarioId: ScenarioType;
  visionGoal3Years: string;
  milestones: {
    year1: string;
    year2: string;
    year3: string;
  };
  thirtyDayActions: ThirtyDayAction[];
  userCommitmentNotes?: string;
}

export type QualitativeImportance = 'Crítica' | 'Importante' | 'Secundaria';

export interface CriteriaImportanceMap {
  aspirationFit: QualitativeImportance;
  resourcesRequired: QualitativeImportance;
  opportunitiesLevel: QualitativeImportance;
  risksLevel: QualitativeImportance;
  uncertaintyLevel: QualitativeImportance;
  flexibility: QualitativeImportance;
}
