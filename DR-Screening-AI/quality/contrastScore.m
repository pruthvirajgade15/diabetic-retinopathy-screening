function score = contrastScore(I)
G=im2single(rgb2grayIfNeeded(I)); s=std(G(:)); score=min(1,max(0,s/0.20));
end
function G=rgb2grayIfNeeded(I), if size(I,3)==1,G=I;else,G=rgb2gray(I);end,end
