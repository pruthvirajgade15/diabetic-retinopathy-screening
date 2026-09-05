function score = contrastScore(I)
% CONTRASTSCORE Evaluates fundus dynamic range and lesion visibility
G = im2single(rgb2grayIfNeeded(I));
s = std(G(:));
score = min(1, max(0, s / 0.20));
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
