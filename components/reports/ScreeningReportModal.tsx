'use client';

import React from 'react';
import { X, Printer, Download, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { ScreeningResult } from '@/types';
import { DR_CLASSES } from '@/config';
import { exportScreeningJSON, printClinicalReport } from '@/services';

interface ScreeningReportModalProps {
  result: ScreeningResult;
  onClose: () => void;
}

export const ScreeningReportModal: React.FC<ScreeningReportModalProps> = ({ result, onClose }) => {
  const drClass = result.predictedStage >= 0 ? DR_CLASSES[result.predictedStage] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background text-foreground border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header Controls */}
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-10 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold">Clinical DR Diagnostic Screening Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={printClinicalReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-xs font-semibold cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={() => exportScreeningJSON(result)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON Audit Record
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report View */}
        <div className="p-6 md:p-8 space-y-6 text-sm">
          <div className="flex flex-wrap items-start justify-between border-b pb-6 border-border gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    RetinaSense™ AI Screening Report
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Explainable AI Deep Learning Tele-Ophthalmology Decision Support
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right text-xs space-y-1">
              <div className="font-mono text-muted-foreground">Report Ref: <span className="font-semibold text-foreground">DR-{result.patientId}-{Date.now().toString().slice(-6)}</span></div>
              <div className="text-muted-foreground">Generated: <span className="font-semibold text-foreground">{result.timestamp}</span></div>
              <div className="text-muted-foreground">Model: <span className="font-semibold text-foreground">EfficientNet-B4 XAI v2.4</span></div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Patient Demographics & Examination Context
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Patient Identifier</span>
                <span className="font-bold text-sm text-foreground">{result.patientId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Age / Gender</span>
                <span className="font-semibold text-foreground">{result.age} yrs / {result.gender}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Eye Examined</span>
                <span className="font-semibold text-foreground">{result.eye}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">HbA1c / Duration</span>
                <span className="font-semibold text-foreground">{result.hba1c}% / {result.diabetesDuration} yrs</span>
              </div>
            </div>
          </div>

          <div
            className={`p-5 rounded-xl border ${
              result.quality.status === 'Fail'
                ? 'bg-rose-500/10 border-rose-500/30'
                : drClass?.severity === 'normal'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : drClass?.severity === 'mild'
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : drClass?.severity === 'moderate'
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: drClass ? drClass.color : '#ef4444' }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  AI Screening Diagnosis
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-background/80 border border-border">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {result.predictedLabel}
            </h2>
            <p className="text-xs text-foreground/80 mt-2 font-medium">
              {result.recommendation}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Diagnostic Imaging Evidence & Explainability Heatmap
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-border rounded-lg overflow-hidden bg-black flex flex-col">
                <img src={result.originalImageDataUrl} alt="Raw Fundus" className="w-full aspect-square object-contain" />
                <div className="p-1.5 bg-muted/60 text-center text-[11px] font-medium border-t border-border">
                  1. Raw Fundus Scan
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-black flex flex-col">
                <img src={result.preprocessedDataUrl} alt="CLAHE Preprocessed" className="w-full aspect-square object-contain" />
                <div className="p-1.5 bg-muted/60 text-center text-[11px] font-medium border-t border-border">
                  2. CLAHE Color Equalized
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-black flex flex-col">
                <img src={result.gradCamOverlayDataUrl} alt="Grad-CAM" className="w-full aspect-square object-contain" />
                <div className="p-1.5 bg-muted/60 text-center text-[11px] font-medium border-t border-border text-cyan-600 dark:text-cyan-400">
                  3. Grad-CAM Biomarker Heatmap
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-xl border border-border/60">
              <h5 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Image Quality Metrics (IQA)
              </h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IQA Status:</span>
                  <span className={`font-bold ${result.quality.status === 'Pass' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {result.quality.status} (Score: {(result.quality.overallScore * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sharpness / Focus:</span>
                  <span className="font-semibold">{(result.quality.sharpnessScore * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vessel Contrast:</span>
                  <span className="font-semibold">{(result.quality.contrastScore * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exposure Uniformity:</span>
                  <span className="font-semibold">{(result.quality.exposureScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-border/60">
              <h5 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Pathological Biomarkers Detected
              </h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Microaneurysms:</span>
                  <span className="font-semibold">{result.biomarkers.microaneurysms} lesions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hemorrhages:</span>
                  <span className="font-semibold">{result.biomarkers.hemorrhages} lesions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hard Lipid Exudates:</span>
                  <span className="font-semibold">{result.biomarkers.exudates} plaques</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Macular Edema (CSME) Risk:</span>
                  <span className="font-bold text-amber-500">{result.biomarkers.macularEdemaRisk}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Clinical Action & Triage Recommendation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-muted/40 p-2.5 rounded-lg">
                <span className="text-muted-foreground block text-[11px]">Recommended Follow-up</span>
                <span className="font-bold text-sm text-foreground">{result.followUp}</span>
              </div>
              <div className="bg-muted/40 p-2.5 rounded-lg">
                <span className="text-muted-foreground block text-[11px]">Specialist Referral</span>
                <span className={`font-bold text-sm ${result.referralRequired ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {result.referralRequired ? 'Required' : 'Not Required'}
                </span>
              </div>
              <div className="bg-muted/40 p-2.5 rounded-lg">
                <span className="text-muted-foreground block text-[11px]">Risk Urgency Tier</span>
                <span className="font-bold text-sm text-foreground">{result.riskLevel}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground/80 mb-1">Medical Device & AI Disclaimer:</p>
              <p>
                This screening report is generated by an artificial intelligence decision-support algorithm. It is intended to assist trained clinicians and eye-care professionals and does NOT constitute a standalone medical diagnosis. All findings must be reviewed and confirmed by a certified ophthalmologist or optometrist.
              </p>
            </div>
            <div className="border border-dashed border-border/80 rounded-lg p-3 flex flex-col justify-between">
              <div className="text-xs font-semibold text-foreground">Reviewing Clinician / Ophthalmologist Signature:</div>
              <div className="h-10 border-b border-zinc-400 dark:border-zinc-700 mt-4 flex items-end justify-between text-[10px]">
                <span>Signature / Stamp</span>
                <span>Date: ________________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
