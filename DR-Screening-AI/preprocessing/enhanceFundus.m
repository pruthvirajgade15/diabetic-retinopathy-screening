function I = enhanceFundus(I)
I = im2uint8(I);
if size(I,3)==1, I = repmat(I,1,1,3); end
lab = rgb2lab(I); lab(:,:,1) = adapthisteq(lab(:,:,1)/100,'NumTiles',[8 8])*100;
I = lab2rgb(lab,'ColorSpace','lab'); I = im2uint8(I);
end
