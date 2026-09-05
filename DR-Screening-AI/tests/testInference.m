function tests=testInference, tests=functiontests(localfunctions); end
function testLowQualityStops(testCase), I=zeros(64,64,3,'uint8'); r=screeningPipeline(I); verifyEqual(testCase,r.qualityStatus,"Fail"); verifyFalse(testCase,isfield(r,'predictedClass')); end
