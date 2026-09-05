function [processed, meta] = preprocessImage(input, inputSize)
if nargin < 2, inputSize = [224 224 3]; end
if ischar(input) || isstring(input), I = imread(input); else, I = input; end
validateattributes(I, {'uint8','uint16','single','double'}, {'nonempty','finite'});
if ndims(I) > 3 || (ndims(I)==3 && size(I,3)~=1 && size(I,3)~=3 && size(I,3)~=4), error('preprocessImage:Channels','Expected grayscale, RGB, or RGBA image.'); end
if size(I,3)==4, I = I(:,:,1:3); end
[cropped,bbox] = cropFundus(I); enhanced = enhanceFundus(cropped); processed = normalizeImage(enhanced,inputSize);
meta.originalSize = size(I); meta.cropBoundingBox = bbox; meta.displayImage = enhanced;
end
