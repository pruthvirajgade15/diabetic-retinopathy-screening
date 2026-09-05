# Explainable AI for Diabetic Retinopathy Screening

MATLAB-first, five-class screening reference implementation for APTOS 2019/IDRiD-style datasets. Add the project root and subfolders to the MATLAB path, then launch with `app = DRScreeningApp;`. The programmatic class is App Designer-compatible; use **App Designer > Code View > Convert** to save a `.mlapp` artifact when a binary App Designer file is required.

## Run

```matlab
addpath(genpath(pwd)); app = DRScreeningApp;
```

Train only with a compatible, documented label schema. `prepareDataset` performs group-aware splitting when `patientId` exists and writes a manifest. Train with `model/trainModel`, evaluate with `evaluation/calculateMetrics`, and place the validated checkpoint at `models/production/drEfficientNet.mat`.

All metrics are computed from supplied labels and predictions; no values are fabricated. Model-dependent functions require Deep Learning Toolbox and EfficientNet support. Run tests with `results = runtests('tests');`.

This application provides AI-assisted diabetic retinopathy screening and does not replace examination or diagnosis by a qualified eye-care professional. Deploy the app through MATLAB Web App Server or MATLAB Production Server only after validating the model, dataset governance, privacy controls, and clinical review process.
