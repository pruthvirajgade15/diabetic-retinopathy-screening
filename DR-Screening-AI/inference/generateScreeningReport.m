function report=generateScreeningReport(result)
report=struct(); report.generatedAt=result.timestamp; report.title="AI-Assisted Diabetic Retinopathy Screening Report"; report.qualityStatus=result.qualityStatus; report.qualityScore=result.qualityScore;
if isfield(result,'predictedLabel'), report.predictedLabel=result.predictedLabel; report.confidence=result.confidence; report.recommendation=result.recommendation; else, report.predictedLabel="Not classified"; report.confidence=NaN; report.recommendation=result.recommendation;end
report.safetyNotice="This application provides AI-assisted diabetic retinopathy screening and does not replace examination or diagnosis by a qualified eye-care professional.";
end
