function score = blurScore(I)
% BLURSCORE Computes image sharpness based on gradient energy variance
G = im2single(rgb2grayIfNeeded(I));
[Gx, Gy] = imgradientxy(G);
gradMag = hypot(Gx, Gy);
v = var(gradMag(:));
score = min(1, max(0, v / 0.02));
end

function G = rgb2grayIfNeeded(I)
if size(I, 3) == 1
    G = I;
else
    G = rgb2gray(I);
end
end
