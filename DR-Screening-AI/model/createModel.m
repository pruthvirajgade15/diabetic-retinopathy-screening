function lgraph = createModel(cfg)
% CREATEMODEL Constructs CNN model architecture for 5-stage DR classification
if nargin < 1
    cfg = modelConfig();
end

try
    base = efficientnetb0;
    lgraph = layerGraph(base);
    learnable = find(arrayfun(@(l) isa(l, 'nnet.cnn.layer.FullyConnectedLayer'), lgraph.Layers), 1, 'last');
    if ~isempty(learnable)
        old = lgraph.Layers(learnable);
        replacement = fullyConnectedLayer(cfg.numClasses, 'Name', old.Name, 'WeightLearnRateFactor', 10, 'BiasLearnRateFactor', 10);
        lgraph = replaceLayer(lgraph, old.Name, replacement);
    end
    
    % Replace classification output layer if present
    classLayerIdx = find(arrayfun(@(l) isa(l, 'nnet.cnn.layer.ClassificationOutputLayer'), lgraph.Layers), 1, 'last');
    if ~isempty(classLayerIdx)
        newClassLayer = classificationLayer('Name', lgraph.Layers(classLayerIdx).Name);
        lgraph = replaceLayer(lgraph, lgraph.Layers(classLayerIdx).Name, newClassLayer);
    end
catch
    % Resilient deep CNN architecture if external efficientnet toolbox package is not loaded
    layers = [
        imageInputLayer(cfg.inputSize, 'Name', 'input')
        convolution2dLayer(3, 32, 'Padding', 'same', 'Name', 'conv1')
        batchNormalizationLayer('Name', 'bn1')
        reluLayer('Name', 'relu1')
        maxPooling2dLayer(2, 'Stride', 2, 'Name', 'pool1')
        convolution2dLayer(3, 64, 'Padding', 'same', 'Name', 'conv2')
        batchNormalizationLayer('Name', 'bn2')
        reluLayer('Name', 'relu2')
        maxPooling2dLayer(2, 'Stride', 2, 'Name', 'pool2')
        convolution2dLayer(3, 128, 'Padding', 'same', 'Name', 'top_activation')
        batchNormalizationLayer('Name', 'bn3')
        reluLayer('Name', 'relu3')
        globalAveragePooling2dLayer('Name', 'gap')
        fullyConnectedLayer(cfg.numClasses, 'Name', 'fc')
        softmaxLayer('Name', 'prob')
        classificationLayer('Name', 'output')
    ];
    lgraph = layerGraph(layers);
end
end
