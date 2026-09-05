function [cropped, bbox] = cropFundus(I)
validateattributes(I, {'uint8','uint16','single','double'}, {'nonempty'});
J = im2uint8(I); gray = rgb2grayIfNeeded(J);
mask = gray > max(10, graythresh(gray)*255*0.35);
mask = imfill(bwareaopen(mask, round(numel(mask)*0.01)), 'holes');
props = regionprops(mask,'BoundingBox','Area');
if isempty(props), cropped = J; bbox = [1 1 size(J,2) size(J,1)]; return; end
[~,i] = max([props.Area]); b = props(i).BoundingBox;
pad = 0.03*max(b(3:4)); bbox = [max(1,b(1)-pad) max(1,b(2)-pad) min(size(J,2)-b(1)+pad,b(3)+2*pad) min(size(J,1)-b(2)+pad,b(4)+2*pad)];
cropped = imcrop(J,bbox);
end
function G = rgb2grayIfNeeded(I)
if size(I,3)==1, G=I; else, G=rgb2gray(I); end
end
