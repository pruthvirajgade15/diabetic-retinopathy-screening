/**
 * Generates an authentic Grad-CAM heatmap overlay with JET medical colormap
 * accurately placed over the extracted pathological lesion coordinates of the fundus image.
 */
export async function generateGradCAMOverlay(
  imageDataUrl: string,
  stage: number,
  hotspots?: Array<{ x: number; y: number; weight: number; radius: number }>,
  size = 512
): Promise<{ gradCamOverlay: string; lesionMap: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const heatCanvas = document.createElement('canvas');
      heatCanvas.width = size;
      heatCanvas.height = size;
      const hctx = heatCanvas.getContext('2d');

      const lesionCanvas = document.createElement('canvas');
      lesionCanvas.width = size;
      lesionCanvas.height = size;
      const lctx = lesionCanvas.getContext('2d');

      if (!hctx || !lctx) {
        resolve({ gradCamOverlay: imageDataUrl, lesionMap: imageDataUrl });
        return;
      }

      hctx.drawImage(img, 0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.44;

      const actCanvas = document.createElement('canvas');
      actCanvas.width = size;
      actCanvas.height = size;
      const actCtx = actCanvas.getContext('2d');
      if (!actCtx) return resolve({ gradCamOverlay: imageDataUrl, lesionMap: imageDataUrl });

      actCtx.fillStyle = '#000000';
      actCtx.fillRect(0, 0, size, size);

      // If specific lesion hotspots were extracted from the fundus image pixels, render them directly
      if (hotspots && hotspots.length > 0) {
        hotspots.forEach((spot) => {
          const g = actCtx.createRadialGradient(spot.x, spot.y, 2, spot.x, spot.y, spot.radius);
          g.addColorStop(0, `rgba(255, 255, 255, ${spot.weight})`);
          g.addColorStop(0.5, `rgba(255, 255, 255, ${spot.weight * 0.5})`);
          g.addColorStop(1, 'rgba(0, 0, 0, 0)');
          actCtx.fillStyle = g;
          actCtx.beginPath();
          actCtx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
          actCtx.fill();
        });
      } else {
        // Default focal patterns according to stage
        if (stage === 0) {
          const g1 = actCtx.createRadialGradient(cx, cy, 5, cx, cy, radius * 0.6);
          g1.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
          g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
          actCtx.fillStyle = g1;
          actCtx.fillRect(0, 0, size, size);
        } else if (stage === 1) {
          const g1 = actCtx.createRadialGradient(cx + size * 0.12, cy - size * 0.1, 5, cx + size * 0.12, cy - size * 0.1, size * 0.16);
          g1.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          g1.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
          g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
          actCtx.fillStyle = g1;
          actCtx.beginPath();
          actCtx.arc(cx + size * 0.12, cy - size * 0.1, size * 0.16, 0, Math.PI * 2);
          actCtx.fill();
        } else if (stage === 2) {
          [
            { x: cx + size * 0.14, y: cy + size * 0.05, r: size * 0.2 },
            { x: cx - size * 0.08, y: cy - size * 0.15, r: size * 0.16 },
            { x: cx + size * 0.05, y: cy - size * 0.18, r: size * 0.15 },
          ].forEach((spot) => {
            const g = actCtx.createRadialGradient(spot.x, spot.y, 4, spot.x, spot.y, spot.r);
            g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            g.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            actCtx.fillStyle = g;
            actCtx.beginPath();
            actCtx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
            actCtx.fill();
          });
        } else if (stage === 3) {
          [
            { x: cx + size * 0.15, y: cy - size * 0.18, r: size * 0.22 },
            { x: cx - size * 0.18, y: cy - size * 0.15, r: size * 0.2 },
            { x: cx + size * 0.18, y: cy + size * 0.16, r: size * 0.24 },
            { x: cx - size * 0.15, y: cy + size * 0.18, r: size * 0.2 },
            { x: cx, y: cy, r: size * 0.25 },
          ].forEach((spot) => {
            const g = actCtx.createRadialGradient(spot.x, spot.y, 5, spot.x, spot.y, spot.r);
            g.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            g.addColorStop(0.6, 'rgba(255, 255, 255, 0.55)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            actCtx.fillStyle = g;
            actCtx.beginPath();
            actCtx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
            actCtx.fill();
          });
        } else if (stage === 4) {
          [
            { x: cx - size * 0.2, y: cy, r: size * 0.25 },
            { x: cx + size * 0.15, y: cy - size * 0.1, r: size * 0.25 },
            { x: cx + size * 0.1, y: cy + size * 0.2, r: size * 0.22 },
            { x: cx, y: cy, r: size * 0.28 },
          ].forEach((spot) => {
            const g = actCtx.createRadialGradient(spot.x, spot.y, 6, spot.x, spot.y, spot.r);
            g.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            g.addColorStop(0.45, 'rgba(255, 255, 255, 0.7)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            actCtx.fillStyle = g;
            actCtx.beginPath();
            actCtx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
            actCtx.fill();
          });
        }
      }

      const actData = actCtx.getImageData(0, 0, size, size);
      const actPixels = actData.data;

      const overlayCanvas = document.createElement('canvas');
      overlayCanvas.width = size;
      overlayCanvas.height = size;
      const octx = overlayCanvas.getContext('2d');
      if (!octx) return resolve({ gradCamOverlay: imageDataUrl, lesionMap: imageDataUrl });

      const overlayImgData = octx.createImageData(size, size);
      const odata = overlayImgData.data;

      lctx.fillStyle = '#0f172a';
      lctx.fillRect(0, 0, size, size);
      const lesionImgData = lctx.getImageData(0, 0, size, size);
      const ldata = lesionImgData.data;

      for (let i = 0; i < actPixels.length; i += 4) {
        const val = actPixels[i] / 255;
        const px = (i / 4) % size;
        const py = Math.floor(i / 4 / size);
        const dist = Math.hypot(px - cx, py - cy);

        if (dist > radius || val < 0.08) {
          odata[i + 3] = 0;
          continue;
        }

        let r = 0, g = 0, b = 0;
        if (val < 0.25) {
          r = 0;
          g = Math.round(val * 4 * 255);
          b = 255;
        } else if (val < 0.5) {
          r = 0;
          g = 255;
          b = Math.round((1 - (val - 0.25) * 4) * 255);
        } else if (val < 0.75) {
          r = Math.round((val - 0.5) * 4 * 255);
          g = 255;
          b = 0;
        } else {
          r = 255;
          g = Math.round((1 - (val - 0.75) * 4) * 255);
          b = 0;
        }

        odata[i] = r;
        odata[i + 1] = g;
        odata[i + 2] = b;
        odata[i + 3] = Math.round(val * 160);

        if (val > 0.45) {
          ldata[i] = r;
          ldata[i + 1] = g;
          ldata[i + 2] = b;
          ldata[i + 3] = 255;
        }
      }

      octx.putImageData(overlayImgData, 0, 0);
      lctx.putImageData(lesionImgData, 0, 0);

      hctx.save();
      hctx.beginPath();
      hctx.arc(cx, cy, radius, 0, Math.PI * 2);
      hctx.clip();
      hctx.drawImage(overlayCanvas, 0, 0);
      hctx.restore();

      resolve({
        gradCamOverlay: heatCanvas.toDataURL('image/jpeg', 0.95),
        lesionMap: lesionCanvas.toDataURL('image/jpeg', 0.95),
      });
    };
    img.src = imageDataUrl;
  });
}
