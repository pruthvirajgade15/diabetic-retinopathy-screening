function score = exposureScore(I)
% EXPOSURESCORE Evaluates illumination suitability of fundus image
G = im2single(rgb2grayIfNeeded(I));
m = mean(G(:));
score = max(0, 1 - abs(m - 0.48) / 0.48);
score = min(1, score);
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
