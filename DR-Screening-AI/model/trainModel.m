function [net,info]=trainModel(imds,cfg)
if nargin<2,cfg=trainingConfig();end
modelCfg=modelConfig(); lgraph=createModel(modelCfg); opts=trainingOptions('adam','InitialLearnRate',cfg.initialLearnRate,'MaxEpochs',cfg.maxEpochs,'MiniBatchSize',cfg.miniBatchSize,'ValidationData',imds.ValidationData,'ValidationFrequency',20,'ValidationPatience',5,'Shuffle','every-epoch','ExecutionEnvironment',cfg.executionEnvironment,'Plots','training-progress','Verbose',true); [net,info]=trainNetwork(imds.TrainingData,lgraph,opts); if ~exist(fileparts(cfg.outputModel),'dir'),mkdir(fileparts(cfg.outputModel));end; save(cfg.outputModel,'net','info','-v7.3');
end
