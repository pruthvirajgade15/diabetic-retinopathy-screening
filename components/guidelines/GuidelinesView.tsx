'use client';

import React from 'react';
import { DR_CLASSES } from '@/config';
import { BookOpen, ShieldAlert, Clock, AlertTriangle, Stethoscope } from 'lucide-react';

export const GuidelinesView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            International Clinical Diabetic Retinopathy (ICDR) Screening Guidelines
          </h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Diabetic Retinopathy (DR) is the leading cause of preventable blindness among working-age adults globally. 
          Early detection through AI-assisted screening protocols enables timely interventions (anti-VEGF, panretinal photocoagulation, vitrectomy) 
          that prevent severe vision loss in up to 95% of patients.
        </p>
      </div>

      {/* 5 Stages Classification Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" /> ICDR Disease Severity Scale Reference
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {DR_CLASSES.map((cls) => (
            <div
              key={cls.id}
              className="bg-card border border-border rounded-xl p-4.5 shadow-xs hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: cls.color }}
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-muted-foreground mr-2">
                      [Stage {cls.id}]
                    </span>
                    <span className="text-sm font-bold text-foreground">{cls.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls.badgeBg} ${cls.badgeBorder} ${cls.badgeText}`}
                  >
                    Triage Urgency: {cls.urgency}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" /> {cls.followUp}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <span className="font-semibold block text-foreground mb-1">ICDR Diagnostic Criteria:</span>
                  <p className="text-muted-foreground leading-relaxed">{cls.icdrCriteria}</p>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <span className="font-semibold block text-foreground mb-1">Key Retinal Pathology Markers:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                    {cls.pathology.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-xs bg-primary/5 p-3 rounded-lg border border-primary/15 text-foreground/90 font-medium">
                <span className="font-bold text-primary mr-1.5">Action Plan:</span>
                {cls.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-2-1 Rule Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> The Severe NPDR "4-2-1 Rule" Criteria
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          According to the Early Treatment Diabetic Retinopathy Study (ETDRS), patients meeting any ONE of the following three criteria have severe NPDR and a ~50% risk of progressing to proliferative retinopathy (PDR) within 12 months:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
            <span className="font-bold text-amber-600 dark:text-amber-400 block text-sm mb-1">4 Quadrants</span>
            <span className="text-foreground font-medium block">Severe Intraretinal Hemorrhages</span>
            <span className="text-[11px] text-muted-foreground">&gt;20 intraretinal dot/blot hemorrhages in all 4 quadrants.</span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
            <span className="font-bold text-amber-600 dark:text-amber-400 block text-sm mb-1">2 Quadrants</span>
            <span className="text-foreground font-medium block">Definite Venous Beading</span>
            <span className="text-[11px] text-muted-foreground">Caliber changes and sausage-like dilatation of retinal veins.</span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/60">
            <span className="font-bold text-amber-600 dark:text-amber-400 block text-sm mb-1">1 Quadrant</span>
            <span className="text-foreground font-medium block">Prominent IRMA</span>
            <span className="text-[11px] text-muted-foreground">Intraretinal microvascular abnormalities (tortuous dilated shunt vessels).</span>
          </div>
        </div>
      </div>

      {/* Governance & Safety Notice */}
      <div className="bg-muted/30 border border-border rounded-xl p-5 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
          <ShieldAlert className="w-4 h-4 text-rose-500" /> Clinical Safety Governance & Quality Thresholds
        </div>
        <p>
          1. <strong>Image Quality Gating:</strong> Scans failing the IQA threshold (Sharpness &lt; 0.45 or Exposure &lt; 0.45 or Overall &lt; 0.55) must NOT be processed for automated grading and require immediate image re-acquisition.
        </p>
        <p>
          2. <strong>Low Confidence Threshold:</strong> If model softmax confidence is &lt; 60%, the case is automatically flagged for compulsory clinician manual audit.
        </p>
        <p>
          3. <strong>Explainability Obligation:</strong> Grad-CAM heatmaps must be reviewed in conjunction with raw fundus scans to ensure decision salient features correspond to valid physiological biomarkers.
        </p>
      </div>
    </div>
  );
};
