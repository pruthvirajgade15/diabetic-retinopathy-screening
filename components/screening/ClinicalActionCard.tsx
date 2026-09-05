'use client';

import React from 'react';
import { Stethoscope, FileText } from 'lucide-react';
import { ScreeningResult } from '@/types';

interface ClinicalActionCardProps {
  result: ScreeningResult;
  onOpenReport: () => void;
}

export const ClinicalActionCard: React.FC<ClinicalActionCardProps> = ({
  result,
  onOpenReport,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Stethoscope className="w-3.5 h-3.5 text-primary" /> Clinical Action & Next Steps
      </h4>
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
          <span className="text-[11px] text-muted-foreground block">Triage Urgency:</span>
          <span className="font-bold text-foreground text-sm">{result.riskLevel}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
          <span className="text-[11px] text-muted-foreground block">Recommended Action:</span>
          <span className="font-medium text-foreground">{result.recommendation}</span>
        </div>
      </div>

      <button
        onClick={onOpenReport}
        className="w-full mt-2 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
      >
        <FileText className="w-4 h-4" />
        View & Print Full Clinical Report
      </button>
    </div>
  );
};
