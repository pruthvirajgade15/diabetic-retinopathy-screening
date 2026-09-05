import { BiomarkerProfile, RiskLevel } from './retinopathy';
import { PatientContext } from './patient';

export interface QualityMetrics {
  sharpnessScore: number;
  contrastScore: number;
  exposureScore: number;
  overallScore: number;
  status: 'Pass' | 'Fail';
  reasons: string[];
}

export interface ScreeningResult extends PatientContext {
  timestamp: string;
  quality: QualityMetrics;
  predictedStage: number;
  predictedLabel: string;
  confidence: number;
  probabilities: number[];
  riskLevel: RiskLevel;
  recommendation: string;
  followUp: string;
  referralRequired: boolean;
  biomarkers: BiomarkerProfile;
  originalImageDataUrl: string;
  preprocessedDataUrl: string;
  gradCamOverlayDataUrl: string;
  lesionMapDataUrl: string;
}
