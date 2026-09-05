function score = exposureScore(I)
G = im2single(rgb2grayIfNeeded(I)); m=mean(G(:)); score=max(0,1-abs(m-0.48)/0.48); score=min(1,score);
end
function G=rgb2grayIfNeeded(I), if size(I,3)==1,G=I;else,G=rgb2gray(I);end,end
