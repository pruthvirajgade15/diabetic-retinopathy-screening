function tests = testQuality
tests = functiontests(localfunctions);
end

function testQualityShape(testCase)
img = uint8(rand(128, 128, 3) * 255);
q = assessImageQuality(img);
verifyGreaterThanOrEqual(testCase, q.qualityScore, 0);
verifyLessThanOrEqual(testCase, q.qualityScore, 1);
verifyTrue(testCase, isfield(q, 'issues'));
end
