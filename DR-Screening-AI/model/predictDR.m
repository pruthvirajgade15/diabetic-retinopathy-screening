function [classValue, label, confidence, probabilities] = predictDR(net, image, cfg)
% PREDICTDR Classifies a fundus image into 5 ICDR Diabetic Retinopathy stages
if nargin < 3, cfg = modelConfig(); end

% Ensure image is numeric and single precision
if ~isa(image, 'single') && ~isa(image, 'double')
    image = im2single(image);
else
    image = single(image);
end

% Ensure correct 3 channels
if size(image, 3) == 1
    image = repmat(image, [1 1 3]);
elseif size(image, 3) > 3
    image = image(:,:,1:3);
end

% Perform prediction according to network type
if isa(net, 'DAGNetwork') || isa(net, 'SeriesNetwork')
    scores = predict(net, image);
    if isa(scores, 'dlarray')
        probabilities = double(extractdata(scores));
    else
        probabilities = double(scores);
    end
elseif isa(net, 'dlnetwork')
    if ~isa(image, 'dlarray')
        dlImg = dlarray(image, 'SSC');
    else
        dlImg = image;
    end
    scores = predict(net, dlImg);
    if isa(scores, 'dlarray')
        probabilities = double(extractdata(scores));
    else
        probabilities = double(scores);
    end
elseif isstruct(net)
    error('predictDR:Type', 'Loaded model is a struct rather than a neural network.');
else
    error('predictDR:Type', 'Unsupported network type.');
end

probabilities = probabilities(:)';

% If raw logits are returned, convert via softmax
if any(probabilities < 0) || any(probabilities > 1) || abs(sum(probabilities) - 1.0) > 0.05
    exps = exp(probabilities - max(probabilities));
    probabilities = exps / max(eps, sum(exps));
else
    probabilities = probabilities / max(eps, sum(probabilities));
end

% Guarantee exact class dimension count
if length(probabilities) < cfg.numClasses
    padded = zeros(1, cfg.numClasses);
    padded(1:length(probabilities)) = probabilities;
    probabilities = padded;
elseif length(probabilities) > cfg.numClasses
    probabilities = probabilities(1:cfg.numClasses);
    probabilities = probabilities / max(eps, sum(probabilities));
end

[confidence, idx] = max(probabilities);
classValue = idx - 1;
if idx <= numel(cfg.classNames)
    label = cfg.classNames(idx);
else
    label = sprintf('Stage %d', classValue);
end
end
