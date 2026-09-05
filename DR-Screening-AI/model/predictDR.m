function [classValue, label, confidence, probabilities] = predictDR(net, image, cfg)
if nargin < 3, cfg = modelConfig(); end
if isa(net, 'DAGNetwork') || isa(net, 'SeriesNetwork') || isa(net, 'dlnetwork')
    scores = predict(net, image);
    if isa(scores, 'dlarray')
        probabilities = double(extractdata(scores));
    else
        probabilities = double(scores);
    end
    probabilities = probabilities(:)';
    probabilities = probabilities / max(eps, sum(probabilities));
else
    error('predictDR:Type', 'Unsupported network type.');
end
[confidence, idx] = max(probabilities);
classValue = idx - 1;
label = cfg.classNames(idx);
end
