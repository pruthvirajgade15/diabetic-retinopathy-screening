export interface PerClassMetric {
  stage: string;
  sensitivity: number;
  specificity: number;
  auc: number;
  f1Score: number;
}

export interface BenchmarkMetrics {
  modelArchitecture: string;
  trainingDataset: string;
  quadraticWeightedKappa: number;
  overallAccuracy: number;
  macroSensitivity: number;
  macroSpecificity: number;
  aucRoc: number;
  qualityClassifierAccuracy: number;
  gradCamResolution: string;
  perClassMetrics: PerClassMetric[];
  confusionMatrix: number[][];
}
