function train()
root=fileparts(fileparts(mfilename('fullpath'))); addpath(genpath(root)); cfg=trainingConfig(); assert(strlength(cfg.datasetRoot)>0,'Set trainingConfig.datasetRoot before training.'); error('train:DatasetAdapterRequired','Create an imageDatastore/augmentedImageDatastore adapter for the manifest labels before calling trainModel.');
end
