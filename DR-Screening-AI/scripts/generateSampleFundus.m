function generateSampleFundus()
% GENERATESAMPLEFUNDUS Generates synthetic retinal fundus images for testing

outputDir = fullfile(fileparts(fileparts(mfilename('fullpath'))), 'sample_images');
if ~exist(outputDir, 'dir')
    mkdir(outputDir);
end

sz = 512;
[X, Y] = meshgrid(linspace(-1, 1, sz), linspace(-1, 1, sz));
R = sqrt(X.^2 + Y.^2);
mask = R <= 0.88;

% 1. Stage 0: Healthy Fundus
I0 = zeros(sz, sz, 3);
I0(:,:,1) = 0.75 - 0.25 * R; % Red channel
I0(:,:,2) = 0.28 - 0.15 * R; % Green channel
I0(:,:,3) = 0.08 - 0.05 * R; % Blue channel

% Add Optic Disc
discDist = sqrt((X + 0.45).^2 + (Y + 0.05).^2);
discMask = discDist < 0.14;
I0(repmat(discMask, [1 1 3])) = 0.95;

% Add Macula
macDist = sqrt((X - 0.25).^2 + Y.^2);
macMask = macDist < 0.18;
I0(:,:,1) = I0(:,:,1) - 0.15 * macMask;
I0(:,:,2) = I0(:,:,2) - 0.08 * macMask;

I0 = I0 .* repmat(mask, [1 1 3]);
I0 = im2uint8(max(0, min(1, I0)));
imwrite(I0, fullfile(outputDir, 'sample_stage0_normal.png'));

% 2. Stage 2: Moderate NPDR (with hemorrhages and exudates)
I2 = im2double(I0);
% Microaneurysms and hemorrhages (dark red spots)
for k = 1:25
    rx = randi([120, 420]);
    ry = randi([120, 420]);
    if mask(ry, rx)
        I2(ry-2:ry+2, rx-2:rx+2, 1) = 0.4;
        I2(ry-2:ry+2, rx-2:rx+2, 2) = 0.05;
        I2(ry-2:ry+2, rx-2:rx+2, 3) = 0.02;
    end
end
% Hard Exudates (bright yellow plaques)
for k = 1:15
    ex = randi([260, 360]);
    ey = randi([200, 320]);
    if mask(ey, ex)
        I2(ey-3:ey+3, ex-3:ex+3, 1) = 0.98;
        I2(ey-3:ey+3, ex-3:ex+3, 2) = 0.92;
        I2(ey-3:ey+3, ex-3:ex+3, 3) = 0.45;
    end
end
I2 = im2uint8(max(0, min(1, I2)));
imwrite(I2, fullfile(outputDir, 'sample_stage2_moderate.png'));

% 3. Stage 4: Proliferative DR (severe hemorrhages and vascular proliferation)
I4 = im2double(I2);
for k = 1:40
    hx = randi([100, 430]);
    hy = randi([100, 430]);
    if mask(hy, hx)
        I4(max(1,hy-5):min(sz,hy+5), max(1,hx-5):min(sz,hx+5), 1) = 0.35;
        I4(max(1,hy-5):min(sz,hy+5), max(1,hx-5):min(sz,hx+5), 2) = 0.02;
        I4(max(1,hy-5):min(sz,hy+5), max(1,hx-5):min(sz,hx+5), 3) = 0.01;
    end
end
I4 = im2uint8(max(0, min(1, I4)));
imwrite(I4, fullfile(outputDir, 'sample_stage4_proliferative.png'));

fprintf('Sample fundus images successfully written to: %s\n', outputDir);
end
