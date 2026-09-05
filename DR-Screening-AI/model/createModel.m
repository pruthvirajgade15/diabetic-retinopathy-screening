function lgraph=createModel(cfg)
if nargin<1,cfg=modelConfig();end
base=efficientnetb0; lgraph=layerGraph(base);
learnable=find(arrayfun(@(l) isa(l,'nnet.cnn.layer.FullyConnectedLayer'),lgraph.Layers),1,'last'); old=lgraph.Layers(learnable); replacement=fullyConnectedLayer(cfg.numClasses,'Name',old.Name,'WeightLearnRateFactor',10,'BiasLearnRateFactor',10); lgraph=replaceLayer(lgraph,old.Name,replacement);
end
