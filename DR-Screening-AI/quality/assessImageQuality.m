function q = assessImageQuality(I)
validateattributes(I, {'uint8','uint16','single','double'}, {'nonempty'});
if size(I, 3) > 3
    I = I(:,:,1:3);
end

b = blurScore(I);
e = exposureScore(I);
c = contrastScore(I);
G = im2single(rgb2grayIfNeeded(I));
fov = mean(G(:) > 0.03);

q.blurScore = b;
q.exposureScore = e;
q.contrastScore = c;
q.fieldOfViewScore = min(1, fov / 0.35);
q.qualityScore = mean([b, e, c, q.fieldOfViewScore]);

issuesList = strings(0, 1);
if b < 0.35, issuesList = [issuesList; "Image may be blurred"]; end
if e < 0.45, issuesList = [issuesList; "Exposure is unsuitable"]; end
if c < 0.30, issuesList = [issuesList; "Contrast is too low"]; end
if q.fieldOfViewScore < 0.50, issuesList = [issuesList; "Fundus field of view is insufficient"]; end
q.issues = issuesList;

if q.qualityScore >= 0.55 && isempty(q.issues)
    q.status = "Pass";
else
    q.status = "Fail";
end
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
