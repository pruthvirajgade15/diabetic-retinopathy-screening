function metrics=evaluate(trueLabels,predictedLabels,scores)
root=fileparts(fileparts(mfilename('fullpath'))); addpath(genpath(root)); metrics=calculateMetrics(trueLabels,predictedLabels,scores); disp(metrics);
end
