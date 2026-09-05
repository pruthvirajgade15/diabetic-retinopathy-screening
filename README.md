# RetinaSense™ AI — Explainable Diabetic Retinopathy Screening Suite

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MATLAB](https://img.shields.io/badge/MATLAB-R2024%2B-orange?style=flat&logo=mathworks)](https://www.mathworks.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, tele-ophthalmology decision support system for **Diabetic Retinopathy (DR)** screening featuring pure image-driven pathology classification, Image Quality Assessment (IQA), and Explainable AI (XAI) Grad-CAM attention heatmaps.

---

## 🌟 Key Capabilities

- **Pure Image-Driven 5-Stage ICDR Classification**: Automatically analyzes retinal microvascular features across Stage 0 (No DR), Stage 1 (Mild NPDR), Stage 2 (Moderate NPDR), Stage 3 (Severe NPDR), and Stage 4 (Proliferative DR).
- **Explainable AI (XAI) Grad-CAM Suite**: Interactive multi-view inspection, split slider, pathology segmentation mask, and JET attention localization.
- **Automated Image Quality Gating (IQA)**: Real-time sharpness, contrast, and illumination checks with a $\ge 0.55$ clinical threshold to prevent non-diagnostic low-quality scans from being misgraded.
- **Biomarker Pathology Profiling**: Quantifies microaneurysms, dot/blot hemorrhages, hard lipid exudates, cotton wool spots, and CSME macular edema risk.
- **Clinical Screening Reports**: One-click printable PDF medical reports and JSON clinical audit downloads.
- **Dual Runtime Engine**: Interactive Next.js web application and standalone desktop/headless MATLAB backend (`DR-Screening-AI`).

---

## 🚀 Quick Start (Web Application)

### Prerequisites
- Node.js 18.0+ / 20.0+ / 22.0+
- npm 9+

### 1. Installation
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** (or `http://localhost:3001`).

### 3. Production Build & Execution
```bash
npm run build
npm run start
```

---

## 🔬 MATLAB Backend Architecture (`DR-Screening-AI`)

### Launch Desktop App Designer GUI
In MATLAB command prompt:
```matlab
cd 'DR-Screening-AI'
addpath(genpath(pwd));
app = DRScreeningApp;
```

### Run Batch Headless Inference
```matlab
addpath(genpath('DR-Screening-AI'));
result = screeningPipeline('sample_images/sample_stage2_moderate.png');
disp(result);
```

### Execute Test Suite
```matlab
cd 'DR-Screening-AI'
addpath(genpath(pwd));
results = runtests('tests');
```

---

## 🚢 Production Deployment

### Option 1: Vercel (One-Click)
Deploy seamlessly on Vercel:
```bash
npx vercel
```

### Option 2: Docker Container
Build and run the container:
```bash
docker build -t retinasense-ai .
docker run -p 3000:3000 retinasense-ai
```

---

## 🛡️ Clinical Disclaimer
This system provides AI-assisted decision support and does NOT replace examination or diagnosis by a qualified eye-care professional.
