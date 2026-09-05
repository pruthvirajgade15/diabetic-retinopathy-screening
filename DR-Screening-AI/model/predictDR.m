function [classValue, label, confidence, probabilities] = predictDR(net, image, cfg)
if nargin<3,cfg=modelConfig();end
if isa(net,'DAGNetwork') || isa(net,'SeriesNetwork') || isa(net,'dlnetwork')
 scores=predict(net,image); probabilities=extractdata(scores); probabilities=probabilities(:)'; probabilities=probabilities/sum(probabilities);
else, error('predictDR:Type','Unsupported network type.'); end
[confidence,idx]=max(probabilities); classValue=idx-1; label=cfg.classNames(idx);
end
