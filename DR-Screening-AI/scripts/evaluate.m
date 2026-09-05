function metrics = evaluate(trueLabels, predictedLabels, scores)
% EVALUATE Evaluates model predictions and displays performance metrics
root = fileparts(fileparts(mfilename('fullpath')));
addpath(genpath(root));

if nargin < 3
    scores = [];
end

metrics = calculateMetrics(trueLabels, predictedLabels, scores);
disp(metrics);
end
