function splits=prepareDataset(imageDir,labelTable,outDir)
% labelTable must contain image, label, and optionally patientId columns.
T=readtable(labelTable); required=["image","label"]; assert(all(ismember(required,string(T.Properties.VariableNames))),'Missing image/label columns.');
rng(42); if ismember('patientId',T.Properties.VariableNames), groups=categorical(T.patientId); else, groups=categorical(T.image); end
ug=unique(groups); ug=ug(randperm(numel(ug))); n=numel(ug); nTest=round(.15*n); nVal=round(.15*n); testG=ug(1:nTest); valG=ug(nTest+1:nTest+nVal); split=repmat("train",height(T),1); split(ismember(groups,testG))="test"; split(ismember(groups,valG))="validation"; T.split=split; if nargin>=3,writetable(T,fullfile(outDir,'manifest.csv'));end; splits=T;
end
