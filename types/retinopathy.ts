export type ICDRSeverity = 'normal' | 'mild' | 'moderate' | 'severe' | 'proliferative';
export type ReferralUrgency = 'Routine' | 'Elective' | 'Priority' | 'Urgent' | 'Emergency';
export type RiskLevel = 'Minimal' | 'Mild' | 'Moderate' | 'High' | 'Severe / Emergency';
export type EdemaRisk = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface DRClassInfo {
  id: number;
  code: string;
  name: string;
  shortName: string;
  severity: ICDRSeverity;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icdrCriteria: string;
  pathology: string[];
  recommendation: string;
  urgency: ReferralUrgency;
  followUp: string;
  referralRequired: boolean;
}

export interface BiomarkerProfile {
  microaneurysms: number;
  hemorrhages: number;
  exudates: number;
  cottonWoolSpots: number;
  neovascularization: boolean;
  macularEdemaRisk: EdemaRisk;
}
