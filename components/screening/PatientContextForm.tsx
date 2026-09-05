'use client';

import React, { useRef } from 'react';
import { User, Upload, RotateCcw, Play } from 'lucide-react';
import { PatientContext, SampleCase } from '@/types';
import { SAMPLE_CASES } from '@/config';

interface PatientContextFormProps {
  patientContext: PatientContext;
  selectedCaseId: string;
  onSelectCase: (c: SampleCase) => void;
  onUpdateField: <K extends keyof PatientContext>(field: K, value: PatientContext[K]) => void;
  onUploadImage: (dataUrl: string) => void;
  onReset: () => void;
  onRunScreening: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const PatientContextForm: React.FC<PatientContextFormProps> = ({
  patientContext,
  selectedCaseId,
  onSelectCase,
  onUpdateField,
  onUploadImage,
  onReset,
  onRunScreening,
  isProcessing,
  hasImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) onUploadImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Patient & Examination Parameters</h2>
        </div>

        {/* Fundus Scans Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="text-muted-foreground text-[11px] whitespace-nowrap mr-1">Sample Fundus Scans:</span>
          {SAMPLE_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => onSelectCase(c)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCaseId === c.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-muted/50 border-border hover:bg-muted text-foreground'
              }`}
            >
              Scan #{idx + 1} ({c.eye.slice(0, 2)})
            </button>
          ))}
        </div>
      </div>

      {/* Patient Input Fields */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Patient ID</label>
          <input
            type="text"
            value={patientContext.patientId ?? ''}
            onChange={(e) => onUpdateField('patientId', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-mono font-semibold"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Age</label>
          <input
            type="number"
            value={patientContext.age ?? ''}
            onChange={(e) => onUpdateField('age', e.target.value === '' ? 0 : Number(e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-semibold"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Gender</label>
          <select
            value={patientContext.gender || 'Female'}
            onChange={(e) => onUpdateField('gender', e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-semibold"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Examined Eye</label>
          <select
            value={patientContext.eye || 'OD (Right)'}
            onChange={(e) => onUpdateField('eye', e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-semibold"
          >
            <option value="OD (Right)">OD (Right Eye)</option>
            <option value="OS (Left)">OS (Left Eye)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">HbA1c (%)</label>
          <input
            type="number"
            step="0.1"
            value={patientContext.hba1c ?? ''}
            onChange={(e) => onUpdateField('hba1c', e.target.value === '' ? 0 : Number(e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-semibold"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Diabetes Duration</label>
          <input
            type="number"
            value={patientContext.diabetesDuration ?? ''}
            onChange={(e) => onUpdateField('diabetesDuration', e.target.value === '' ? 0 : Number(e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-semibold"
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-primary" />
            Upload Custom Fundus Scan
          </button>
          <span className="text-[11px] text-muted-foreground hidden md:inline">
            Supported: JPG, PNG, TIFF
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={onRunScreening}
            disabled={isProcessing || !hasImage}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isProcessing ? 'Processing Pipeline...' : 'Run Explainable AI Screening'}
          </button>
        </div>
      </div>
    </div>
  );
};
