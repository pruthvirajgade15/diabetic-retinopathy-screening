function q=assessImageQuality(I)
validateattributes(I,{'uint8','uint16','single','double'},{'nonempty'});
if size(I,3)==4,I=I(:,:,1:3);end
b=blurScore(I); e=exposureScore(I); c=contrastScore(I); G=im2single(rgb2grayIfNeeded(I)); fov=mean(G(:)>0.03);
q.blurScore=b; q.exposureScore=e; q.contrastScore=c; q.fieldOfViewScore=min(1,fov/0.35); q.qualityScore=mean([b e c q.fieldOfViewScore]); q.issues=strings(0,1);
if b<.35,q.issues(end+1)="Image may be blurred";end
if e<.45,q.issues(end+1)="Exposure is unsuitable";end
if c<.30,q.issues(end+1)="Contrast is too low";end
if q.fieldOfViewScore<.50,q.issues(end+1)="Fundus field of view is insufficient";end
if q.qualityScore >= 0.55 && isempty(q.issues), q.status="Pass"; else, q.status="Fail"; end
end
function G=rgb2grayIfNeeded(I), if size(I,3)==1,G=I;else,G=rgb2gray(I);end,end
