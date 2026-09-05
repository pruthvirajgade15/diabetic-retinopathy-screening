'use client';

import React from 'react';
import { ScreeningResult, DRClassInfo } from '@/types';

interface ScreeningOverviewBannerProps {
  result: ScreeningResult;
  drClass: DRClassInfo | null;
}

export const ScreeningOverviewBanner: React.FC<ScreeningOverviewBannerProps> = ({
  result,
  drClass,
}) => {
  return (
    <div
      className={`rounded-2xl p-5 border shadow-sm ${
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: drClass ? drClass.color : '#ef4444' }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              ICDR Disease Severity Classification
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {result.predictedLabel}
          </h1>
          <p className="text-xs font-medium text-foreground/85 max-w-3xl pt-1">
            {result.recommendation}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence:</span>
            <span className="text-base font-black font-mono text-foreground">
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                result.referralRequired
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}
            >
              {result.referralRequired ? 'Referral Indicated' : 'Routine Monitoring'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-background/80 border border-border">
              {result.followUp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
