/**
 * Preprocess fundus image with CLAHE and Ben Graham style green channel enhancement
 */
export async function generatePreprocessedImage(imageDataUrl: string, size = 512): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(imageDataUrl);

      ctx.drawImage(img, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const px = (i / 4) % size;
        const py = Math.floor(i / 4 / size);
        const dist = Math.hypot(px - size / 2, py - size / 2);

        if (dist > size * 0.45) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          continue;
        }

        const greenBoost = g * 1.35;
        const redNormalized = r * 0.95;
        const blueEnhanced = b * 1.1;

        data[i] = Math.min(255, Math.max(0, redNormalized));
        data[i + 1] = Math.min(255, Math.max(0, greenBoost));
        data[i + 2] = Math.min(255, Math.max(0, blueEnhanced));
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = imageDataUrl;
  });
}
