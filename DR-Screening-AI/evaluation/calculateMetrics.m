function metrics = calculateMetrics(trueLabels, predLabels, scores)
% CALCULATEMETRICS Evaluates multi-class classification metrics
% Computes Accuracy, Precision, Recall/Sensitivity, Specificity, F1, Balanced Accuracy, and Confusion Matrix.

trueLabels = categorical(trueLabels);
predLabels = categorical(predLabels);
classes = categories(trueLabels);

cm = confusionmat(trueLabels, predLabels, 'Order', classes);
tp = diag(cm);
precision = tp ./ max(1, sum(cm, 1)');
recall = tp ./ max(1, sum(cm, 2));
f1 = 2 * (precision .* recall) ./ max(eps, precision + recall);
total = sum(cm(:));

metrics.accuracy = sum(tp) / max(1, total);
metrics.precision = precision;
metrics.recall = recall;
metrics.f1 = f1;
metrics.macroF1 = mean(f1);
metrics.sensitivity = recall;
metrics.specificity = (total - sum(cm, 2) - sum(cm, 1)' + tp) ./ max(1, total - sum(cm, 2));
metrics.balancedAccuracy = mean(recall);
metrics.confusionMatrix = cm;

if nargin >= 3 && ~isempty(scores)
    try
        if numel(classes) == 2
            [~, ~, ~, metrics.auroc] = perfcurve(trueLabels, scores(:, 2), classes{2});
        else
            aurocs = zeros(numel(classes), 1);
            for c = 1:numel(classes)
                binTrue = (trueLabels == classes{c});
                if any(binTrue) && ~all(binTrue) && size(scores, 2) >= c
                    [~, ~, ~, aurocs(c)] = perfcurve(binTrue, scores(:, c), true);
                else
                    aurocs(c) = NaN;
                end
            end
            validAurocs = aurocs(~isnan(aurocs));
            if isempty(validAurocs)
                metrics.auroc = NaN;
            else
                metrics.auroc = mean(validAurocs);
            end
        end
    catch
        metrics.auroc = NaN;
    end
else
    metrics.auroc = NaN;
end
end
