function tests = testInference
tests = functiontests(localfunctions);
end

function testLowQualityStops(testCase)
I = zeros(64, 64, 3, 'uint8');
r = screeningPipeline(I);
verifyEqual(testCase, r.qualityStatus, "Fail");
verifyEqual(testCase, r.predictedClass, -1);
end

function testValidImageInference(testCase)
% Create synthetic fundus image pattern
sz = 128;
[X, Y] = meshgrid(linspace(-1, 1, sz), linspace(-1, 1, sz));
R = sqrt(X.^2 + Y.^2);
mask = R <= 0.85;

I = zeros(sz, sz, 3, 'uint8');
I(:,:,1) = uint8(200 * mask);
I(:,:,2) = uint8(80 * mask);
I(:,:,3) = uint8(30 * mask);

r = screeningPipeline(I);
verifyTrue(testCase, isfield(r, 'predictedClass'));
verifyTrue(testCase, isfield(r, 'confidence'));
verifyTrue(testCase, isfield(r, 'gradCAMOverlay'));
verifyTrue(testCase, isfield(r, 'report'));
end
