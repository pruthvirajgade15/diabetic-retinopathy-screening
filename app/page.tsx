'use client';

import React, { useState } from 'react';
import { useTheme, useScreeningPipeline } from '@/hooks';
import { DR_CLASSES } from '@/config';
import { Header } from '@/components/layout/Header';
import { Navigation, type NavTab } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { PatientContextForm } from '@/components/screening/PatientContextForm';
import { ScreeningOverviewBanner } from '@/components/screening/ScreeningOverviewBanner';
import { FundusViewer } from '@/components/screening/FundusViewer';
import { QualityGauge } from '@/components/screening/QualityGauge';
import { ClassificationChart } from '@/components/screening/ClassificationChart';
import { BiomarkerPanel } from '@/components/screening/BiomarkerPanel';
import { ClinicalActionCard } from '@/components/screening/ClinicalActionCard';
import { SampleCohortGallery } from '@/components/screening/SampleCohortGallery';
import { ScreeningReportModal } from '@/components/reports/ScreeningReportModal';
import { BenchmarksView } from '@/components/analytics/BenchmarksView';
import { GuidelinesView } from '@/components/guidelines/GuidelinesView';

export default function Page() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('screening');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const {
    patientContext,
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
    runInference,
    reset,
  } = useScreeningPipeline(2);

  const handleUpdateField = (field: string, value: any) => {
    if (field === 'patientId') setPatientId(value);
    else if (field === 'age') setAge(value);
    else if (field === 'gender') setGender(value);
    else if (field === 'eye') setEye(value);
    else if (field === 'hba1c') setHba1c(value);
    else if (field === 'diabetesDuration') setDiabetesDuration(value);
  };

  const drClass =
    screeningResult && screeningResult.predictedStage >= 0
      ? DR_CLASSES[screeningResult.predictedStage]
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Top Application Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenReport={() => setShowReportModal(true)}
        hasResult={!!screeningResult}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Navigation Tabs */}
        <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* TAB 1: Screening Suite */}
        {activeTab === 'screening' && (
          <div className="space-y-6">
            {/* Patient Context & Image Toolbar */}
            <PatientContextForm
              patientContext={patientContext}
              selectedCaseId={selectedCase.id}
              onSelectCase={loadCase}
              onUpdateField={handleUpdateField as any}
              onUploadImage={handleCustomImage}
              onReset={reset}
              onRunScreening={runInference}
              isProcessing={isProcessing}
              hasImage={!!rawImageDataUrl}
            />

            {/* Pipeline Execution Animation */}
            {isProcessing && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 text-xs text-foreground animate-pulse">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                <div>
                  <span className="font-bold block">Executing Screening Pipeline</span>
                  <span className="text-muted-foreground">{processingStep}</span>
                </div>
              </div>
            )}

            {/* Diagnostic Classification Banner */}
            {screeningResult && !isProcessing && (
              <ScreeningOverviewBanner
                result={screeningResult}
                drClass={drClass}
              />
            )}

            {/* Interactive Multi-View & Tele-Ophthalmology Grid */}
            {screeningResult && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Multi-view Fundus & Explainability Viewer */}
                <div className="lg:col-span-2 space-y-6">
                  <FundusViewer
                    originalUrl={screeningResult.originalImageDataUrl}
                    preprocessedUrl={screeningResult.preprocessedDataUrl}
                    gradCamUrl={screeningResult.gradCamOverlayDataUrl}
                    lesionMapUrl={screeningResult.lesionMapDataUrl}
                    predictedStage={screeningResult.predictedStage}
                    stageName={screeningResult.predictedLabel}
                    stageColor={drClass?.color || '#3b82f6'}
                    isFail={screeningResult.quality.status === 'Fail'}
                  />

                  {/* Biomarker Profile */}
                  <BiomarkerPanel
                    biomarkers={screeningResult.biomarkers}
                    isFail={screeningResult.quality.status === 'Fail'}
                  />
                </div>

                {/* Right Column: Quality Gauge, Probability Distribution, and Clinical Action */}
                <div className="space-y-6">
                  <QualityGauge quality={screeningResult.quality} />

                  <ClassificationChart
                    probabilities={screeningResult.probabilities}
                    predictedStage={screeningResult.predictedStage}
                    confidence={screeningResult.confidence}
                    isFail={screeningResult.quality.status === 'Fail'}
                  />

                  <ClinicalActionCard
                    result={screeningResult}
                    onOpenReport={() => setShowReportModal(true)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Sample Cohort Gallery */}
        {activeTab === 'samples' && (
          <SampleCohortGallery
            selectedCaseId={selectedCase.id}
            onSelectAndRun={(c) => {
              loadCase(c);
              setActiveTab('screening');
            }}
          />
        )}

        {/* TAB 3: Validation Benchmarks */}
        {activeTab === 'benchmarks' && <BenchmarksView />}

        {/* TAB 4: ICDR Guidelines Reference */}
        {activeTab === 'guidelines' && <GuidelinesView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Full Diagnostic Screening Report Modal */}
      {showReportModal && screeningResult && (
        <ScreeningReportModal
          result={screeningResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
