function net = loadProductionModel(modelFile)
% LOADPRODUCTIONMODEL Robust loader for production deep learning checkpoints
if nargin < 1
    c = modelConfig();
    modelFile = c.modelFile;
end

if ~isfile(modelFile)
    error('loadProductionModel:Missing', 'Production model not found: %s', modelFile);
end

s = load(modelFile);

% Check common variable names
if isfield(s, 'net')
    net = s.net;
elseif isfield(s, 'trainedNet')
    net = s.trainedNet;
elseif isfield(s, 'network')
    net = s.network;
elseif isfield(s, 'model')
    net = s.model;
elseif isfield(s, 'lgraph')
    net = s.lgraph;
else
    % Search for first field matching a network type
    names = fieldnames(s);
    found = false;
    for k = 1:numel(names)
        val = s.(names{k});
        if isa(val, 'DAGNetwork') || isa(val, 'SeriesNetwork') || isa(val, 'dlnetwork')
            net = val;
            found = true;
            break;
        end
    end
    if ~found
        net = s.(names{1});
    end
end
end
