'use client';

import { useState, useEffect } from 'react';
import { SampleCase, PatientContext, ScreeningResult } from '@/types';
import { SAMPLE_CASES } from '@/config';
import { generateSyntheticFundusImage, runClinicalScreening } from '@/services';

export function useScreeningPipeline(defaultCaseIndex = 2) {
  const initialCase = SAMPLE_CASES[defaultCaseIndex] || SAMPLE_CASES[0];

  const [selectedCase, setSelectedCase] = useState<SampleCase>(initialCase);
  const [patientId, setPatientId] = useState<string>(initialCase.patientId);
  const [age, setAge] = useState<number>(initialCase.age);
  const [gender, setGender] = useState<'Female' | 'Male'>(initialCase.gender);
  const [eye, setEye] = useState<'OD (Right)' | 'OS (Left)'>(initialCase.eye);
  const [hba1c, setHba1c] = useState<number>(initialCase.hba1c);
  const [diabetesDuration, setDiabetesDuration] = useState<number>(initialCase.diabetesDuration);

  const [rawImageDataUrl, setRawImageDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  useEffect(() => {
    loadCase(initialCase);
  }, []);

  const loadCase = (c: SampleCase) => {
    setSelectedCase(c);
    setPatientId(c.patientId || '');
    setAge(c.age ?? 50);
    setGender(c.gender || 'Female');
    setEye(c.eye || 'OD (Right)');
    setHba1c(c.hba1c ?? 7.0);
    const dur = c.diabetesDuration ?? c.diabetesYears ?? 10;
    setDiabetesDuration(dur);

    const dataUrl = generateSyntheticFundusImage(c);
    setRawImageDataUrl(dataUrl);
    setScreeningResult(null);

    runInference(dataUrl, {
      patientId: c.patientId || 'PT-UNKNOWN',
      age: c.age ?? 50,
      gender: c.gender || 'Female',
      eye: c.eye || 'OD (Right)',
      hba1c: c.hba1c ?? 7.0,
      diabetesDuration: dur,
    });
  };

  const handleCustomImage = (dataUrl: string) => {
    setRawImageDataUrl(dataUrl);
    setScreeningResult(null);
    runInference(dataUrl, {
      patientId,
      age,
      gender,
      eye,
      hba1c,
      diabetesDuration,
    });
  };

  const runInference = async (
    imgUrl: string,
    patientInfo: PatientContext
  ) => {
    setIsProcessing(true);
    setProcessingStep('1. Assessing Image Quality & Aperture (IQA)...');

    setTimeout(async () => {
      setProcessingStep('2. Performing CLAHE & Ben Graham Color Normalization...');
      setTimeout(async () => {
        setProcessingStep('3. Deep Convolutional Inference (EfficientNet-B4)...');
        setTimeout(async () => {
          setProcessingStep('4. Computing Gradient-weighted Class Activation Map (Grad-CAM)...');
          setTimeout(async () => {
            const res = await runClinicalScreening(imgUrl, patientInfo);
            setScreeningResult(res);
            setIsProcessing(false);
            setProcessingStep('');
          }, 250);
        }, 250);
      }, 250);
    }, 250);
  };

  const reset = () => {
    loadCase(selectedCase);
  };

  return {
    patientContext: { patientId, age, gender, eye, hba1c, diabetesDuration },
    setPatientId,
    setAge,
    setGender,
    setEye,
    setHba1c,
    setDiabetesDuration,
    selectedCase,
    rawImageDataUrl,
    isProcessing,
    processingStep,
    screeningResult,
    loadCase,
    handleCustomImage,
    runInference: () =>
      runInference(rawImageDataUrl, {
        patientId,
        age,
        gender,
        eye,
        hba1c,
        diabetesDuration,
      }, selectedCase.trueStage),
    reset,
  };
}
