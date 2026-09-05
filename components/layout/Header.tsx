'use client';

import React from 'react';
import { Eye, Sun, Moon, FileText } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenReport?: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenReport,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-foreground">
                RetinaSense<span className="text-cyan-500">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                XAI v2.4
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Explainable Deep Learning for Diabetic Retinopathy Screening
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Toggle Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {hasResult && onOpenReport && (
            <button
              onClick={onOpenReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Screening Report</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
