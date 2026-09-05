function net=loadProductionModel(modelFile)
if nargin<1, c=modelConfig(); modelFile=c.modelFile; end
if ~isfile(modelFile), error('loadProductionModel:Missing','Production model not found: %s',modelFile); end
s=load(modelFile); names=fieldnames(s); net=s.(names{1});
end
