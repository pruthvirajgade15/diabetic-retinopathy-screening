'use client';

import React from 'react';
import { DR_CLASSES } from '@/config';
import { Sparkles } from 'lucide-react';

interface ClassificationChartProps {
  probabilities: number[];
  predictedStage: number;
  confidence: number;
  isFail?: boolean;
}

export const ClassificationChart: React.FC<ClassificationChartProps> = ({
  probabilities,
  predictedStage,
  confidence,
  isFail = false,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">ICDR 5-Grade Probability Distribution</h4>
        </div>
        {!isFail && (
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <span>Confidence:</span>
            <span className="font-bold text-foreground font-mono">{(confidence * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {isFail ? (
        <div className="p-4 rounded-lg bg-muted/40 border border-border text-center text-xs text-muted-foreground">
          Classification suppressed due to image quality threshold failure (&lt; 0.55).
        </div>
      ) : (
        <div className="space-y-2.5">
          {DR_CLASSES.map((cls, idx) => {
            const prob = probabilities[idx] || 0;
            const percent = (prob * 100).toFixed(1);
            const isPredicted = idx === predictedStage;

            return (
              <div
                key={cls.id}
                className={`p-2 rounded-lg border transition-all ${
                  isPredicted
                    ? 'bg-muted/80 border-primary/40 shadow-xs ring-1 ring-primary/20'
                    : 'bg-background/50 border-border/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cls.color }}
                    />
                    <span className={`font-semibold ${isPredicted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {cls.name}
                    </span>
                    {isPredicted && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary text-primary-foreground">
                        PREDICTED
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-foreground text-xs">{percent}%</span>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, prob * 100)}%`,
                      backgroundColor: cls.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
