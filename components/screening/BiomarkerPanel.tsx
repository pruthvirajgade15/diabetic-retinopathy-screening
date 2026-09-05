'use client';

import React from 'react';
import { Microscope, CheckCircle2, Flame } from 'lucide-react';
import { BiomarkerProfile } from '@/types';

interface BiomarkerPanelProps {
  biomarkers: BiomarkerProfile;
  isFail?: boolean;
}

export const BiomarkerPanel: React.FC<BiomarkerPanelProps> = ({ biomarkers, isFail = false }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Retinal Biomarker Pathology Profile</h4>
        </div>
      </div>

      {isFail ? (
        <div className="p-4 rounded-lg bg-muted/40 border border-border text-center text-xs text-muted-foreground">
          Biomarker quantification unavailable for failed quality scans.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50">
            <div className="text-[11px] text-muted-foreground">Microaneurysms (MAs)</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-foreground">{biomarkers.microaneurysms}</span>
              <span className="text-[10px] text-muted-foreground">detected</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {biomarkers.microaneurysms === 0
                ? 'None detected'
                : biomarkers.microaneurysms < 10
                ? 'Focal / Mild'
                : 'Diffuse clusters'}
            </div>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50">
            <div className="text-[11px] text-muted-foreground">Hemorrhages (Dot/Blot)</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-foreground">{biomarkers.hemorrhages}</span>
              <span className="text-[10px] text-muted-foreground">lesions</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {biomarkers.hemorrhages === 0
                ? 'Clear vasculature'
                : biomarkers.hemorrhages < 15
                ? '1-2 Quadrants'
                : 'Meets 4-2-1 rule criteria'}
            </div>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50">
            <div className="text-[11px] text-muted-foreground">Hard Lipid Exudates</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-foreground">{biomarkers.exudates}</span>
              <span className="text-[10px] text-muted-foreground">plaques</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {biomarkers.exudates === 0
                ? 'No lipid deposits'
                : biomarkers.exudates < 10
                ? 'Peripheral plaques'
                : 'Circinate macular ring'}
            </div>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50">
            <div className="text-[11px] text-muted-foreground">Cotton Wool Spots</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-foreground">{biomarkers.cottonWoolSpots}</span>
              <span className="text-[10px] text-muted-foreground">infarcts</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {biomarkers.cottonWoolSpots === 0 ? 'No nerve fiber infarcts' : 'Retinal ischemia signal'}
            </div>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50">
            <div className="text-[11px] text-muted-foreground">Macular Edema Risk</div>
            <div className="mt-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                  biomarkers.macularEdemaRisk === 'Low'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : biomarkers.macularEdemaRisk === 'Moderate'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {biomarkers.macularEdemaRisk}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">OCT correlation advised</div>
          </div>

          <div
            className={`p-2.5 rounded-lg border ${
              biomarkers.neovascularization
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-muted/40 border-border/50'
            }`}
          >
            <div className="text-[11px] text-muted-foreground">Neovascularization</div>
            <div className="flex items-center gap-1.5 mt-1">
              {biomarkers.neovascularization ? (
                <>
                  <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    DETECTED (PDR)
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Not Detected
                  </span>
                </>
              )}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {biomarkers.neovascularization ? 'Urgent PRP / Anti-VEGF' : 'Normal disc perfusion'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
