function cfg = trainingConfig()
cfg.seed = 42;
cfg.validationFraction = 0.15;
cfg.testFraction = 0.15;
cfg.maxEpochs = 20;
cfg.miniBatchSize = 16;
cfg.initialLearnRate = 1e-4;
cfg.weightDecay = 1e-4;
cfg.executionEnvironment = "auto";
cfg.datasetRoot = "";
cfg.outputModel = fullfile(fileparts(mfilename('fullpath')),'..','models','production','drEfficientNet.mat');
end
