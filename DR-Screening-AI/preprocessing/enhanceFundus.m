function I = enhanceFundus(I)
% ENHANCEFUNDUS Enhances fundus contrast using adaptive histogram equalization in LAB space
I = im2uint8(I);
if size(I, 3) == 1
    I = repmat(I, 1, 1, 3);
end

lab = rgb2lab(I);
L = lab(:, :, 1) / 100;
L_eq = adapthisteq(L, 'NumTiles', [8 8], 'ClipLimit', 0.02) * 100;
lab(:, :, 1) = L_eq;

% Convert LAB back to RGB (standard MATLAB syntax without invalid parameter)
rgb = lab2rgb(lab);
I = im2uint8(max(0, min(1, rgb)));
end
