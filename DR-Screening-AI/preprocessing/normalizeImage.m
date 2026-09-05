function I = normalizeImage(I, inputSize)
if nargin < 2, inputSize = [224 224 3]; end
if size(I,3)==1, I = repmat(I,1,1,3); end
if size(I,3)>3, I = I(:,:,1:3); end
I = im2single(imresize(I,inputSize(1:2)));
end
