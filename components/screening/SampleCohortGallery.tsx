'use client';

import React from 'react';
import { Layers, Play } from 'lucide-react';
import { SampleCase } from '@/types';
import { SAMPLE_CASES, DR_CLASSES } from '@/config';

interface SampleCohortGalleryProps {
  selectedCaseId: string;
  onSelectAndRun: (c: SampleCase) => void;
}

export const SampleCohortGallery: React.FC<SampleCohortGalleryProps> = ({
  selectedCaseId,
  onSelectAndRun,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-500" /> Reference Clinical Validation Cohort
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Explore standardized fundus scans representing all 5 stages of the International Clinical Diabetic Retinopathy scale plus Image Quality Fail cases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAMPLE_CASES.map((c) => {
          const isCurrent = selectedCaseId === c.id;
          const cls = c.trueStage >= 0 ? DR_CLASSES[c.trueStage] : null;

          return (
            <div
              key={c.id}
              className={`bg-card border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isCurrent ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      c.qualityPassed
                        ? cls?.badgeBg + ' ' + cls?.badgeBorder + ' ' + cls?.badgeText
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {c.qualityPassed ? `Stage ${c.trueStage}: ${cls?.shortName}` : 'IQA Quality Fail'}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{c.patientId}</span>
                </div>

                <h3 className="text-sm font-bold text-foreground">{c.name}</h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {c.notes}
                </p>

                <div className="grid grid-cols-3 gap-2 text-[11px] bg-muted/40 p-2.5 rounded-lg border border-border/40">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Age/Gender</span>
                    <span className="font-semibold text-foreground">{c.age} / {c.gender[0]}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Eye Exam</span>
                    <span className="font-semibold text-foreground">{c.eye.slice(0, 2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">HbA1c</span>
                    <span className="font-semibold text-foreground">{c.hba1c}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/60 bg-muted/20">
                <button
                  onClick={() => onSelectAndRun(c)}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Load & Run Screening
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
