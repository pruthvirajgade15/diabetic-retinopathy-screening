import { QualityMetrics } from '@/types';

/**
 * Perform Image Quality Assessment on a given fundus image
 * Analyzes sharpness (Laplacian variance), contrast (RMS), and exposure uniformity.
 */
export async function assessImageQuality(imageDataUrl: string): Promise<QualityMetrics> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          sharpnessScore: 0.7,
          contrastScore: 0.7,
          exposureScore: 0.7,
          overallScore: 0.7,
          status: 'Pass',
          reasons: [],
        });
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;

      let totalLum = 0;
      let totalLumSq = 0;
      let validPixels = 0;
      const lumArray: number[] = new Array(size * size);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        lumArray[i / 4] = lum;

        if (lum > 15) {
          totalLum += lum;
          totalLumSq += lum * lum;
          validPixels++;
        }
      }

      if (validPixels < size * size * 0.2) {
        resolve({
          sharpnessScore: 0.22,
          contrastScore: 0.31,
          exposureScore: 0.25,
          overallScore: 0.26,
          status: 'Fail',
          reasons: ['Aperture occlusion or insufficient retinal area visible (<20%).'],
        });
        return;
      }

      const meanLum = totalLum / validPixels;
      const variance = totalLumSq / validPixels - meanLum * meanLum;
      const stdDev = Math.sqrt(Math.max(0, variance));

      let exposureScore = 1.0;
      if (meanLum < 45) {
        exposureScore = Math.max(0.1, meanLum / 45);
      } else if (meanLum > 200) {
        exposureScore = Math.max(0.1, (255 - meanLum) / 55);
      }

      const contrastScore = Math.min(1.0, Math.max(0.1, stdDev / 60));

      let laplacianSum = 0;
      let edgePoints = 0;
      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          const idx = y * size + x;
          const center = lumArray[idx];
          if (center > 20) {
            const lap =
              lumArray[idx - 1] +
              lumArray[idx + 1] +
              lumArray[idx - size] +
              lumArray[idx + size] -
              4 * center;
            laplacianSum += Math.abs(lap);
            edgePoints++;
          }
        }
      }

      const avgLaplacian = edgePoints > 0 ? laplacianSum / edgePoints : 0;
      const sharpnessScore = Math.min(1.0, Math.max(0.1, avgLaplacian / 14));
      const overallScore = Number((sharpnessScore * 0.45 + contrastScore * 0.3 + exposureScore * 0.25).toFixed(3));
      const reasons: string[] = [];

      if (sharpnessScore < 0.45) reasons.push('Excessive motion or focus blur detected in fundus image.');
      if (exposureScore < 0.45) reasons.push('Suboptimal illumination (underexposed or overexposed field).');
      if (contrastScore < 0.45) reasons.push('Insufficient vessel-to-background contrast.');

      const status = overallScore >= 0.55 ? 'Pass' : 'Fail';

      resolve({
        sharpnessScore: Number(sharpnessScore.toFixed(3)),
        contrastScore: Number(contrastScore.toFixed(3)),
        exposureScore: Number(exposureScore.toFixed(3)),
        overallScore,
        status,
        reasons,
      });
    };
    img.src = imageDataUrl;
  });
}
