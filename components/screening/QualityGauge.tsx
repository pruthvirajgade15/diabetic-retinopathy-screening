'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
import { QualityMetrics } from '@/types';

interface QualityGaugeProps {
  quality: QualityMetrics;
}

export const QualityGauge: React.FC<QualityGaugeProps> = ({ quality }) => {
  const isPass = quality.status === 'Pass';
  const scorePercent = Math.round(quality.overallScore * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Image Quality Assessment (IQA)</h4>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isPass
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse'
          }`}
        >
          {isPass ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          {quality.status.toUpperCase()} ({scorePercent}%)
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground font-medium">Overall Quality Index</span>
            <span className="font-semibold text-foreground">{scorePercent}% (Threshold: 55%)</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isPass ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, scorePercent))}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-muted/40 p-2 rounded-lg border border-border/50 text-center">
            <div className="text-[11px] text-muted-foreground">Sharpness</div>
            <div className="text-xs font-bold text-foreground mt-0.5">
              {Math.round(quality.sharpnessScore * 100)}%
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: `${Math.round(quality.sharpnessScore * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-muted/40 p-2 rounded-lg border border-border/50 text-center">
            <div className="text-[11px] text-muted-foreground">Contrast</div>
            <div className="text-xs font-bold text-foreground mt-0.5">
              {Math.round(quality.contrastScore * 100)}%
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.round(quality.contrastScore * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-muted/40 p-2 rounded-lg border border-border/50 text-center">
            <div className="text-[11px] text-muted-foreground">Exposure</div>
            <div className="text-xs font-bold text-foreground mt-0.5">
              {Math.round(quality.exposureScore * 100)}%
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.round(quality.exposureScore * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {!isPass && quality.reasons.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <div className="font-semibold">Quality Assessment Flag</div>
              <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
                {quality.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
