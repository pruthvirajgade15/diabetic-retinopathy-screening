function score = blurScore(I)
G = im2single(rgb2grayIfNeeded(I)); v = var(imgradient(G)); score = min(1, max(0, v/0.02));
end
function G=rgb2grayIfNeeded(I), if size(I,3)==1,G=I;else,G=rgb2gray(I);end,end
