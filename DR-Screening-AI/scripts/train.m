function [net, info] = train(datasetDir)
% TRAIN Entrypoint script for training the DR deep learning model
root = fileparts(fileparts(mfilename('fullpath')));
addpath(genpath(root));

cfg = trainingConfig();
if nargin >= 1 && ~isempty(datasetDir)
    cfg.datasetRoot = datasetDir;
end

if isempty(cfg.datasetRoot) || ~exist(cfg.datasetRoot, 'dir')
    fprintf('No external dataset directory specified. Generating sample cohort...\n');
    generateSampleFundus();
    sampleDir = fullfile(root, 'sample_images');
    cfg.datasetRoot = sampleDir;
end

% Create image datastore from labeled directories
imds = imageDatastore(cfg.datasetRoot, ...
    'IncludeSubfolders', true, ...
    'LabelSource', 'foldernames');

if isempty(imds.Files)
    error('train:EmptyDataset', 'No images found in dataset directory: %s', cfg.datasetRoot);
end

[trainData, valData] = splitEachLabel(imds, 0.8, 'randomized');
imdsStruct.TrainingData = trainData;
imdsStruct.ValidationData = valData;

[net, info] = trainModel(imdsStruct, cfg);
fprintf('Training successfully completed and saved to: %s\n', cfg.outputModel);
end
