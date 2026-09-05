'use client';

import React from 'react';
import { Activity, Layers, BarChart3, BookOpen } from 'lucide-react';

export type NavTab = 'screening' | 'samples' | 'benchmarks' | 'guidelines';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="flex justify-center sm:justify-start">
      <nav className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-xs w-full sm:w-auto overflow-x-auto">
        <button
          onClick={() => onSelectTab('screening')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'screening'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span>Screening Suite</span>
        </button>

        <button
          onClick={() => onSelectTab('samples')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'samples'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          <span>Sample Cohort</span>
        </button>

        <button
          onClick={() => onSelectTab('benchmarks')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'benchmarks'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Validation</span>
        </button>

        <button
          onClick={() => onSelectTab('guidelines')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'guidelines'
              ? 'bg-background text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>ICDR Guidelines</span>
        </button>
      </nav>
    </div>
  );
};
