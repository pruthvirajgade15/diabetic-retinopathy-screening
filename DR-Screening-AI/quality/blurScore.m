function score = blurScore(I)
% BLURSCORE Computes image sharpness based on gradient energy variance
G = im2single(rgb2grayIfNeeded(I));
if exist('imgradientxy', 'file') == 2 || exist('imgradientxy', 'builtin') == 5
    [Gx, Gy] = imgradientxy(G);
else
    [Gx, Gy] = gradient(double(G));
end
gradMag = hypot(Gx, Gy);
v = var(gradMag(:));
score = min(1, max(0, v / 0.02));
end

function G = rgb2grayIfNeeded(I)
if size(I, 3) == 1
    G = I;
else
    if size(I, 3) > 3, I = I(:,:,1:3); end
    if exist('rgb2gray', 'file') == 2 || exist('rgb2gray', 'builtin') == 5
        G = rgb2gray(I);
    else
        Id = im2double(I);
        G = 0.2989 * Id(:,:,1) + 0.5870 * Id(:,:,2) + 0.1140 * Id(:,:,3);
    end
end
end
