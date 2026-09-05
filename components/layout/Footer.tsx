'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/60 mt-12 py-6 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">RetinaSense AI Suite</span>
          <span>•</span>
          <span>Explainable Deep Learning for Retinopathy Screening</span>
        </div>
        <div className="text-[11px]">
          MATLAB & Next.js Hybrid Architecture • APTOS 2019 / IDRiD / Messidor-2 Benchmark Standard
        </div>
      </div>
    </footer>
  );
};
