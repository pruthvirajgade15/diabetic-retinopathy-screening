function [cropped, bbox] = cropFundus(I)
validateattributes(I, {'uint8','uint16','single','double'}, {'nonempty'});
J = im2uint8(I);
if size(J, 3) > 3, J = J(:,:,1:3); end
gray = rgb2grayIfNeeded(J);

mask = gray > max(10, graythresh(gray) * 255 * 0.35);
mask = imfill(bwareaopen(mask, round(numel(mask) * 0.01)), 'holes');
props = regionprops(mask, 'BoundingBox', 'Area');

if isempty(props)
    cropped = J;
    bbox = [1 1 size(J, 2) size(J, 1)];
    return;
end

[~, i] = max([props.Area]);
b = props(i).BoundingBox;
pad = 0.03 * max(b(3:4));

x1 = max(1, floor(b(1) - pad));
y1 = max(1, floor(b(2) - pad));
x2 = min(size(J, 2), ceil(b(1) + b(3) + pad));
y2 = min(size(J, 1), ceil(b(2) + b(4) + pad));
w = max(1, x2 - x1);
h = max(1, y2 - y1);
bbox = [x1, y1, w, h];

cropped = imcrop(J, bbox);
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
