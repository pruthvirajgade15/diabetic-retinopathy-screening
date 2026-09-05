function tests = testPreprocessing
tests = functiontests(localfunctions);
end

function testRgbAndGrayscale(testCase)
I = uint8(rand(80, 100, 3) * 255);
[J, m] = preprocessImage(I);
verifySize(testCase, J, [224, 224, 3]);
verifyTrue(testCase, isfield(m, 'cropBoundingBox'));
end

function testInvalidChannels(testCase)
verifyError(testCase, @() preprocessImage(uint8(rand(20, 20, 2))), 'preprocessImage:Channels');
end
