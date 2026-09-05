import { PatientContext, ScreeningResult, RiskLevel } from '@/types';
import { DR_CLASSES } from '@/config';
import { assessImageQuality } from './iqa-service';
import { generatePreprocessedImage } from './clahe-service';
import { generateGradCAMOverlay } from './gradcam-service';
import { extractFundusPathology } from './retinal-feature-extractor';

/**
 * Execute the complete clinical screening pipeline for a fundus scan
 * Dynamically analyzes the pixel features of the input fundus image.
 */
export async function runClinicalScreening(
  imageDataUrl: string,
  patientInfo: PatientContext
): Promise<ScreeningResult> {
  // Step 1: Image Quality Assessment (IQA)
  const quality = await assessImageQuality(imageDataUrl);

  // If quality fails, return non-diagnostic report
  if (quality.status === 'Fail') {
    return {
      timestamp: new Date().toLocaleString(),
      patientId: patientInfo.patientId || 'PT-UNKNOWN',
      age: patientInfo.age || 50,
      gender: patientInfo.gender || 'Female',
      eye: patientInfo.eye || 'OD (Right)',
      hba1c: patientInfo.hba1c || 7.0,
      diabetesDuration: patientInfo.diabetesDuration || 5,
      quality,
      predictedStage: -1,
      predictedLabel: 'Inconclusive / Unusable Image',
      confidence: 0.25,
      probabilities: [0.2, 0.2, 0.2, 0.2, 0.2],
      riskLevel: 'Minimal',
      recommendation:
        'Image Quality Assessment failed. Re-acquire clear, well-focused, properly illuminated fundus photograph with pupil dilation if necessary before diagnostic screening.',
      followUp: 'Immediate Re-take',
      referralRequired: true,
      biomarkers: {
        microaneurysms: 0,
        hemorrhages: 0,
        exudates: 0,
        cottonWoolSpots: 0,
        neovascularization: false,
        macularEdemaRisk: 'Low',
      },
      originalImageDataUrl: imageDataUrl,
      preprocessedDataUrl: imageDataUrl,
      gradCamOverlayDataUrl: imageDataUrl,
      lesionMapDataUrl: imageDataUrl,
    };
  }

  // Step 2: CLAHE & Ben Graham Green Channel Preprocessing
  const preprocessedDataUrl = await generatePreprocessedImage(imageDataUrl);

  // Step 3: Pure Computer-Vision & Deep Feature Analysis of the Fundus Image
  const extractedFeatures = await extractFundusPathology(imageDataUrl);
  const stage = extractedFeatures.detectedStage;
  const drClass = DR_CLASSES[stage] || DR_CLASSES[0];

  // Step 4: Explainability (Grad-CAM & Lesion localization with real hotspot map)
  const { gradCamOverlay, lesionMap } = await generateGradCAMOverlay(
    imageDataUrl,
    stage,
    extractedFeatures.hotspotCoordinates
  );

  const riskLevels: RiskLevel[] = [
    'Minimal',
    'Mild',
    'Moderate',
    'High',
    'Severe / Emergency',
  ];

  return {
    timestamp: new Date().toLocaleString(),
    patientId: patientInfo.patientId || 'PT-UNKNOWN',
    age: patientInfo.age || 50,
    gender: patientInfo.gender || 'Female',
    eye: patientInfo.eye || 'OD (Right)',
    hba1c: patientInfo.hba1c || 7.0,
    diabetesDuration: patientInfo.diabetesDuration || 5,
    quality,
    predictedStage: stage,
    predictedLabel: drClass.name,
    confidence: extractedFeatures.confidence,
    probabilities: extractedFeatures.probabilities,
    riskLevel: riskLevels[stage],
    recommendation: drClass.recommendation,
    followUp: drClass.followUp,
    referralRequired: drClass.referralRequired,
    biomarkers: {
      microaneurysms: extractedFeatures.microaneurysms,
      hemorrhages: extractedFeatures.hemorrhages,
      exudates: extractedFeatures.exudates,
      cottonWoolSpots: extractedFeatures.cottonWoolSpots,
      neovascularization: extractedFeatures.neovascularization,
      macularEdemaRisk: extractedFeatures.macularEdemaRisk,
    },
    originalImageDataUrl: imageDataUrl,
    preprocessedDataUrl,
    gradCamOverlayDataUrl: gradCamOverlay,
    lesionMapDataUrl: lesionMap,
  };
}
