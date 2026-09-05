function tests=testModel, tests=functiontests(localfunctions); end
function testMissingModel(testCase), verifyError(testCase,@()loadProductionModel(fullfile(tempdir,'missing.mat')),'loadProductionModel:Missing'); end
function testMetrics(testCase), m=calculateMetrics([0;1;1;0],[0;1;0;0]); verifyEqual(testCase,m.accuracy,.75,'AbsTol',1e-12); end
