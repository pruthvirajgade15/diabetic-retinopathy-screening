classdef DRScreeningApp < handle
    properties
        UIFigure;
        UploadButton;
        RunButton;
        ExportButton;
        ResetButton;
        OriginalAxes;
        ProcessedAxes;
        GradCAMAxes;
        StatusLabel;
        ResultText;
        CurrentImage;
        CurrentResult;
    end
    
    methods
        function app = DRScreeningApp
            % Initialize UI Figure
            app.UIFigure = uifigure('Name', 'RetinaSense AI - Explainable DR Screening', ...
                'Position', [80 80 1150 720], 'Color', [0.96 0.97 0.98]);
            
            % Top Header Title
            uilabel(app.UIFigure, 'Text', 'Explainable AI for Diabetic Retinopathy Screening', ...
                'Position', [30 670 600 30], 'FontSize', 18, 'FontWeight', 'bold', 'FontColor', [0.1 0.15 0.25]);
            
            % Toolbar Buttons
            app.UploadButton = uibutton(app.UIFigure, 'push', 'Text', '📁 Upload Fundus Image', ...
                'Position', [30 630 165 34], 'FontSize', 12, 'FontWeight', 'bold', ...
                'BackgroundColor', [0.15 0.45 0.85], 'FontColor', [1 1 1], ...
                'ButtonPushedFcn', @(~,~) app.upload());
            
            app.RunButton = uibutton(app.UIFigure, 'push', 'Text', '▶ Run Screening', ...
                'Position', [205 630 145 34], 'FontSize', 12, 'FontWeight', 'bold', ...
                'BackgroundColor', [0.1 0.65 0.45], 'FontColor', [1 1 1], ...
                'ButtonPushedFcn', @(~,~) app.run());
            
            app.ExportButton = uibutton(app.UIFigure, 'push', 'Text', '📄 Export Report', ...
                'Position', [360 630 135 34], 'FontSize', 12, 'FontWeight', 'bold', ...
                'BackgroundColor', [0.92 0.94 0.96], 'FontColor', [0.2 0.25 0.3], ...
                'ButtonPushedFcn', @(~,~) app.exportReport());

            app.ResetButton = uibutton(app.UIFigure, 'push', 'Text', '↺ Reset', ...
                'Position', [505 630 85 34], 'FontSize', 12, ...
                'BackgroundColor', [0.92 0.94 0.96], 'FontColor', [0.2 0.25 0.3], ...
                'ButtonPushedFcn', @(~,~) app.resetApp());
            
            % Status Bar
            app.StatusLabel = uilabel(app.UIFigure, 'Text', 'Status: Ready. Please select a retinal fundus photograph to begin screening.', ...
                'Position', [605 630 515 34], 'FontSize', 11, 'FontColor', [0.35 0.4 0.5]);
            
            % 3 Image Panels (Original, Processed CLAHE, Grad-CAM Heatmap)
            app.OriginalAxes = uiaxes(app.UIFigure, 'Position', [30 330 345 280], 'Title', '1. Raw Fundus Scan', 'Box', 'on');
            app.OriginalAxes.XTick = []; app.OriginalAxes.YTick = [];
            
            app.ProcessedAxes = uiaxes(app.UIFigure, 'Position', [400 330 345 280], 'Title', '2. CLAHE Preprocessed', 'Box', 'on');
            app.ProcessedAxes.XTick = []; app.ProcessedAxes.YTick = [];
            
            app.GradCAMAxes = uiaxes(app.UIFigure, 'Position', [770 330 345 280], 'Title', '3. Grad-CAM XAI Heatmap', 'Box', 'on');
            app.GradCAMAxes.XTick = []; app.GradCAMAxes.YTick = [];
            
            % Diagnostic Results & Clinical Decision Support Text Area
            uilabel(app.UIFigure, 'Text', 'Diagnostic Findings & Clinical Recommendation:', ...
                'Position', [30 290 400 25], 'FontSize', 12, 'FontWeight', 'bold', 'FontColor', [0.15 0.2 0.3]);
            
            app.ResultText = uitextarea(app.UIFigure, 'Position', [30 30 1085 255], ...
                'Editable', 'off', 'FontSize', 12, 'FontName', 'Consolas', ...
                'BackgroundColor', [0.99 0.99 1.0], ...
                'Value', { ...
                    '========================================================================================', ...
                    '                        RETINASENSE AI SCREENING DECISION SUPPORT                       ', ...
                    '========================================================================================', ...
                    'Status: No fundus scan loaded.', ...
                    'Instructions:', ...
                    '  1. Click "Upload Fundus Image" to select a retinal fundus photograph (.png, .jpg, .tif).', ...
                    '  2. Click "Run Screening" to execute the IQA quality assessment, deep learning prediction,', ...
                    '     and Grad-CAM explainability localization.', ...
                    '  3. Export a timestamped clinical audit report using "Export Report".', ...
                    '', ...
                    'DISCLAIMER: This application provides AI-assisted diabetic retinopathy decision support and', ...
                    'does not replace examination or diagnosis by a qualified eye-care professional.' ...
                });
        end
        
        function upload(app)
            [f, p] = uigetfile({'*.png;*.jpg;*.jpeg;*.tif;*.bmp', 'Fundus Image Files (*.png, *.jpg, *.tif, *.bmp)'});
            if isequal(f, 0) || isequal(p, 0)
                return;
            end
            
            try
                img = imread(fullfile(p, f));
                if size(img, 3) == 4
                    img = img(:,:,1:3);
                end
                app.CurrentImage = img;
                
                % Display image using native image handle
                app.showImage(app.OriginalAxes, app.CurrentImage);
                cla(app.ProcessedAxes);
                cla(app.GradCAMAxes);
                
                app.StatusLabel.Text = sprintf('Image loaded: %s (%dx%d). Click "Run Screening".', f, size(img, 1), size(img, 2));
                app.ResultText.Value = {
                    sprintf('File: %s', f);
                    sprintf('Resolution: %d x %d x %d', size(img, 1), size(img, 2), size(img, 3));
                    'Status: Image loaded into memory. Ready for automated pipeline execution.'
                };
            catch err
                app.StatusLabel.Text = 'Failed to load image.';
                uialert(app.UIFigure, sprintf('Error loading image file: %s', err.message), 'Image Load Error');
            end
        end
        
        function run(app)
            if isempty(app.CurrentImage)
                uialert(app.UIFigure, 'Please upload a fundus image before running screening.', 'Input Required');
                return;
            end
            
            app.StatusLabel.Text = 'Assessing image quality (IQA) and executing deep learning pipeline...';
            drawnow;
            
            try
                % Execute screening pipeline
                app.CurrentResult = screeningPipeline(app.CurrentImage);
                res = app.CurrentResult;
                
                % Display Processed Image
                if isfield(res, 'processedImage') && ~isempty(res.processedImage)
                    app.showImage(app.ProcessedAxes, res.processedImage);
                end
                
                % Display Grad-CAM Overlay
                if isfield(res, 'gradCAMOverlay') && ~isempty(res.gradCAMOverlay)
                    app.showImage(app.GradCAMAxes, res.gradCAMOverlay);
                end
                
                % Format Clinical Summary
                summary = {
                    '========================================================================================', ...
                    '                           DIABETIC RETINOPATHY SCREENING REPORT                        ', ...
                    '========================================================================================', ...
                    sprintf('Timestamp        : %s', char(string(res.timestamp))), ...
                    sprintf('Quality Status   : %s (Quality Score: %.1f%%)', char(string(res.qualityStatus)), res.qualityScore * 100), ...
                    sprintf('Predicted Class  : Stage %d - %s', res.predictedClass, char(string(res.predictedLabel))), ...
                    sprintf('Model Confidence : %.1f%%', res.confidence * 100), ...
                    '----------------------------------------------------------------------------------------', ...
                    'Class Probability Breakdown:'
                };
                
                if isfield(res, 'classProbabilities') && ~isempty(res.classProbabilities)
                    cfg = modelConfig();
                    for k = 1:min(length(cfg.classNames), length(res.classProbabilities))
                        summary{end+1} = sprintf('  [%d] %-30s : %5.1f%%', k-1, char(cfg.classNames(k)), res.classProbabilities(k) * 100);
                    end
                end
                
                summary{end+1} = '----------------------------------------------------------------------------------------';
                summary{end+1} = sprintf('Clinical Action  : %s', char(string(res.recommendation)));
                summary{end+1} = '----------------------------------------------------------------------------------------';
                summary{end+1} = 'NOTICE: AI-assisted screening reference implementation. Final clinical diagnosis';
                summary{end+1} = 'must be confirmed by a board-certified ophthalmologist or eye-care professional.';
                
                app.ResultText.Value = summary;
                app.StatusLabel.Text = sprintf('Screening completed. Result: %s (Confidence: %.1f%%)', char(string(res.predictedLabel)), res.confidence * 100);
                
            catch err
                app.StatusLabel.Text = 'Screening error occurred.';
                uialert(app.UIFigure, err.message, 'Screening Pipeline Error');
            end
        end
        
        function exportReport(app)
            if isempty(app.CurrentResult)
                uialert(app.UIFigure, 'Please run screening before exporting a report.', 'No Result Available');
                return;
            end
            
            [f, p] = uiputfile('screening-report.mat', 'Save Screening Report');
            if isequal(f, 0) || isequal(p, 0)
                return;
            end
            
            result = app.CurrentResult;
            save(fullfile(p, f), 'result');
            app.StatusLabel.Text = sprintf('Report successfully saved to: %s', f);
        end
        
        function resetApp(app)
            app.CurrentImage = [];
            app.CurrentResult = [];
            cla(app.OriginalAxes);
            cla(app.ProcessedAxes);
            cla(app.GradCAMAxes);
            app.StatusLabel.Text = 'Application reset. Please upload a new fundus image.';
            app.ResultText.Value = {'Ready for new examination.'};
        end
        
        function showImage(~, ax, img)
            if isempty(img)
                return;
            end
            cla(ax);
            % Use robust image() command which is 100% compatible with UIAxes
            image(ax, img);
            axis(ax, 'image');
            ax.XTick = [];
            ax.YTick = [];
            ax.Box = 'on';
        end
    end
end
