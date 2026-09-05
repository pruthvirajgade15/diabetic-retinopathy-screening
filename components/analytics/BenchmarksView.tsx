'use client';

import React from 'react';
import { BENCHMARK_METRICS } from '@/config';
import { BarChart3, Award, Target, CheckCircle2, Cpu, Database, Layers } from 'lucide-react';

export const BenchmarksView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* High-level KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Quadratic Weighted Kappa</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {BENCHMARK_METRICS.quadraticWeightedKappa}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Excellent Clinical Agreement
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Macro Sensitivity (Recall)</span>
            <Target className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {BENCHMARK_METRICS.macroSensitivity}%
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-1">
            Low false-negative rate
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Multi-class AUC-ROC</span>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {BENCHMARK_METRICS.aucRoc}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            High discrimination capacity
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Overall Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {BENCHMARK_METRICS.overallAccuracy}%
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            Across 5 ICDR classes
          </div>
        </div>
      </div>

      {/* Per-Class Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> Per-Stage Diagnostic Performance (Validation Cohort)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="p-2.5 font-semibold">ICDR Severity Stage</th>
                <th className="p-2.5 font-semibold text-right">Sensitivity (%)</th>
                <th className="p-2.5 font-semibold text-right">Specificity (%)</th>
                <th className="p-2.5 font-semibold text-right">AUC-ROC</th>
                <th className="p-2.5 font-semibold text-right">F1-Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {BENCHMARK_METRICS.perClassMetrics.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="p-2.5 font-medium text-foreground">{row.stage}</td>
                  <td className="p-2.5 font-mono text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {row.sensitivity}%
                  </td>
                  <td className="p-2.5 font-mono text-right text-foreground">{row.specificity}%</td>
                  <td className="p-2.5 font-mono text-right text-indigo-600 dark:text-indigo-400 font-semibold">
                    {row.auc}
                  </td>
                  <td className="p-2.5 font-mono text-right text-foreground font-semibold">{row.f1Score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix & Technical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Multi-class Confusion Matrix (N = 3,820 Test Scans)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse font-mono">
              <thead>
                <tr>
                  <th className="p-1.5 text-[10px] text-muted-foreground text-left">Pred →<br/>True ↓</th>
                  <th className="p-1.5 text-[10px] text-muted-foreground">S0</th>
                  <th className="p-1.5 text-[10px] text-muted-foreground">S1</th>
                  <th className="p-1.5 text-[10px] text-muted-foreground">S2</th>
                  <th className="p-1.5 text-[10px] text-muted-foreground">S3</th>
                  <th className="p-1.5 text-[10px] text-muted-foreground">S4</th>
                </tr>
              </thead>
              <tbody>
                {BENCHMARK_METRICS.confusionMatrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-1.5 text-[10px] font-bold text-muted-foreground text-left">S{rIdx}</td>
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      return (
                        <td
                          key={cIdx}
                          className={`p-1.5 rounded-sm m-0.5 ${
                            isDiagonal
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30'
                              : val > 0
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'text-muted-foreground/40'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-muted-foreground mt-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-emerald-500/20 border border-emerald-500/30 inline-block" />
            <span>Diagonal indicates concordant clinical classifications.</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> Technical Architecture & Governance
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <Cpu className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-foreground">Backbone Model</span>
                <span className="text-muted-foreground">{BENCHMARK_METRICS.modelArchitecture}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <Database className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-foreground">Training & Benchmark Corpus</span>
                <span className="text-muted-foreground">{BENCHMARK_METRICS.trainingDataset}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/50">
              <Layers className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-foreground">Explainability Mechanism</span>
                <span className="text-muted-foreground">{BENCHMARK_METRICS.gradCamResolution}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
