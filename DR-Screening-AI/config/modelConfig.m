function cfg = modelConfig()
cfg.classNames = ["No DR","Mild DR","Moderate DR","Severe DR","Proliferative DR"];
cfg.numClasses = numel(cfg.classNames);
cfg.inputSize = [224 224 3];
cfg.modelFile = fullfile(fileparts(mfilename('fullpath')),'..','models','production','drEfficientNet.mat');
cfg.minQualityScore = 0.55;
cfg.lowConfidenceThreshold = 0.60;
cfg.gradCAMLayer = "top_activation";
end

function label = drLabel(classValue, cfg)
label = cfg.classNames(classValue + 1);
end
