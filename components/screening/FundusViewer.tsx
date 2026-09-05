'use client';

import React, { useState } from 'react';
import { Eye, ZoomIn, ZoomOut, Sliders, Info, Sparkles } from 'lucide-react';

interface FundusViewerProps {
  originalUrl: string;
  preprocessedUrl: string;
  gradCamUrl: string;
  lesionMapUrl: string;
  predictedStage: number;
  stageName: string;
  stageColor: string;
  isFail?: boolean;
}

export const FundusViewer: React.FC<FundusViewerProps> = ({
  originalUrl,
  preprocessedUrl,
  gradCamUrl,
  lesionMapUrl,
  stageName,
  stageColor,
  isFail = false,
}) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'slider' | 'gradcam-focus' | 'lesion'>('side-by-side');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(85);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, z - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Header Toolbar */}
      <div className="p-3.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Interactive Explainable AI Fundus Inspection</h3>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border text-xs">
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'side-by-side'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Multi-View (3-Panel)
          </button>
          <button
            onClick={() => setActiveTab('slider')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'slider'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overlay Split Slider
          </button>
          <button
            onClick={() => setActiveTab('gradcam-focus')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'gradcam-focus'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Grad-CAM Focus
          </button>
          <button
            onClick={() => setActiveTab('lesion')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'lesion'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pathology Mask
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden text-xs">
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground border-r border-border"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 font-mono text-muted-foreground hover:bg-muted"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground border-l border-border"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="p-4 bg-black/95 flex-1 min-h-[380px] flex items-center justify-center overflow-hidden relative select-none">
        {activeTab === 'side-by-side' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}>
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden border border-border/40 bg-zinc-950">
                <img
                  src={originalUrl}
                  alt="Original Retinal Fundus"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[11px] font-medium text-zinc-300 border border-white/10">
                  1. Raw Fundus Scan
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1.5">Original input RGB image</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden border border-border/40 bg-zinc-950">
                <img
                  src={preprocessedUrl}
                  alt="CLAHE & Normalization"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                  2. CLAHE & Normalization
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1.5">Green channel & vessel enhancement</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full aspect-square relative rounded-lg overflow-hidden border border-border/40 bg-zinc-950">
                <img
                  src={gradCamUrl}
                  alt="Grad-CAM Attention Heatmap"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[11px] font-medium text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  3. Grad-CAM XAI Heatmap
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1.5">Model attention localization (JET map)</span>
            </div>
          </div>
        )}

        {activeTab === 'slider' && (
          <div className="w-full max-w-lg aspect-square relative rounded-xl overflow-hidden border border-border/50 bg-zinc-950" style={{ transform: `scale(${zoomLevel})` }}>
            <img
              src={gradCamUrl}
              alt="Grad-CAM"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div
              className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={originalUrl}
                alt="Original Fundus"
                className="absolute top-0 left-0 max-w-none h-full object-contain"
                style={{ width: '100%' }}
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 -ml-3 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow-md">
                ↔
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Comparison slider"
            />
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 backdrop-blur-xs text-xs font-semibold text-white pointer-events-none">
              Raw Fundus
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/75 backdrop-blur-xs text-xs font-semibold text-cyan-400 pointer-events-none">
              Grad-CAM Overlay
            </div>
          </div>
        )}

        {activeTab === 'gradcam-focus' && (
          <div className="w-full max-w-lg flex flex-col items-center gap-3" style={{ transform: `scale(${zoomLevel})` }}>
            <div className="w-full aspect-square relative rounded-xl overflow-hidden border border-border/50 bg-zinc-950">
              <img
                src={originalUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img
                src={gradCamUrl}
                alt="Grad-CAM Overlay"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ opacity: heatmapOpacity / 100 }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: stageColor }} />
                Attention Map: {stageName}
              </div>
            </div>

            <div className="w-full max-w-sm flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="whitespace-nowrap">Heatmap Intensity:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="font-mono text-[11px] w-8 text-right">{heatmapOpacity}%</span>
            </div>
          </div>
        )}

        {activeTab === 'lesion' && (
          <div className="w-full max-w-lg aspect-square relative rounded-xl overflow-hidden border border-border/50 bg-zinc-950" style={{ transform: `scale(${zoomLevel})` }}>
            <img
              src={lesionMapUrl}
              alt="Lesion Segmentation & Highlight"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-xs font-semibold text-red-400 border border-red-500/20">
              Isolated Microvascular Pathology Density
            </div>
          </div>
        )}
      </div>

      {/* Grad-CAM Color Bar */}
      <div className="p-3 bg-muted/40 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">
            {isFail
              ? 'Image quality insufficient to generate valid gradient class activation.'
              : 'XAI Grad-CAM highlights deep CNN features influencing the DR classification.'}
          </span>
        </div>

        {!isFail && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Low Attention</span>
            <div
              className="w-32 h-2.5 rounded-full shadow-inner border border-white/20"
              style={{
                background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)',
              }}
            />
            <span className="text-[11px] font-semibold text-rose-500">Pathological Salience</span>
          </div>
        )}
      </div>
    </div>
  );
};
