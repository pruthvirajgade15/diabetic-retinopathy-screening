import { BiomarkerProfile } from './retinopathy';

export interface PatientContext {
  patientId: string;
  age: number;
  gender: 'Female' | 'Male';
  eye: 'OD (Right)' | 'OS (Left)';
  hba1c: number;
  diabetesDuration: number;
}

export interface SampleCase extends PatientContext {
  id: string;
  name: string;
  diabetesYears: number;
  trueStage: number;
  qualityPassed: boolean;
  notes: string;
  previewColor: string;
  characteristics: BiomarkerProfile;
}
