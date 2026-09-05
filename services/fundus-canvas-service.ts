import { SampleCase } from '@/types';

/**
 * Renders a clinically realistic high-resolution retinal fundus on a canvas based on sample case pathology
 */
export function generateSyntheticFundusImage(caseData: SampleCase, size = 512): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.44;

  // Background dark surrounding
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, size, size);

  // Clip to circular fundus aperture
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // If Quality Failed case, simulate blur, dark illumination, and clouding
  if (!caseData.qualityPassed) {
    const bgGrad = ctx.createRadialGradient(cx * 0.8, cy * 0.8, 10, cx, cy, radius);
    bgGrad.addColorStop(0, '#2e130c');
    bgGrad.addColorStop(0.5, '#1e0a06');
    bgGrad.addColorStop(1, '#0b0302');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Add cloudy cataract haze
    ctx.fillStyle = 'rgba(180, 160, 140, 0.45)';
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 10, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Blurred vague optic disc
    ctx.fillStyle = 'rgba(230, 180, 120, 0.2)';
    ctx.beginPath();
    ctx.arc(cx - size * 0.18, cy, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  // Realistic Fundus Base Gradient (Choroid & Retinal Pigment Epithelium)
  const bgGrad = ctx.createRadialGradient(cx - size * 0.05, cy, size * 0.1, cx, cy, radius);
  bgGrad.addColorStop(0, '#c2410c'); // Bright orange-red
  bgGrad.addColorStop(0.4, '#9a3412'); // Rich deep orange
  bgGrad.addColorStop(0.8, '#7c2d12'); // Dark warm reddish-brown
  bgGrad.addColorStop(1, '#431407'); // Deep peripheral border
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Choroidal texture mottling
  for (let i = 0; i < 350; i++) {
    const rx = cx + (Math.random() - 0.5) * radius * 1.8;
    const ry = cy + (Math.random() - 0.5) * radius * 1.8;
    const dist = Math.hypot(rx - cx, ry - cy);
    if (dist < radius * 0.95) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(136, 19, 55, 0.08)' : 'rgba(234, 88, 12, 0.07)';
      ctx.beginPath();
      ctx.arc(rx, ry, 3 + Math.random() * 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Optic Disc Position (Temporal vs Nasal based on eye)
  const isOD = caseData.eye.includes('OD');
  const discX = isOD ? cx - size * 0.22 : cx + size * 0.22;
  const discY = cy - size * 0.02;
  const discRadius = size * 0.07;

  // Draw Optic Disc with Physiological Cup
  const discGrad = ctx.createRadialGradient(discX, discY, discRadius * 0.2, discX, discY, discRadius);
  discGrad.addColorStop(0, '#fef08a'); // Pale yellow center (cup)
  discGrad.addColorStop(0.6, '#fed7aa'); // Orange-pink neuroretinal rim
  discGrad.addColorStop(0.95, '#fb923c');
  discGrad.addColorStop(1, '#9a3412');
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(discX, discY, discRadius, 0, Math.PI * 2);
  ctx.fill();

  // Disc Margin / Halo
  ctx.strokeStyle = 'rgba(255, 237, 213, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Macula & Fovea (Center-temporal region)
  const maculaX = isOD ? cx + size * 0.12 : cx - size * 0.12;
  const maculaY = cy + size * 0.02;
  const maculaRadius = size * 0.09;

  const maculaGrad = ctx.createRadialGradient(maculaX, maculaY, 2, maculaX, maculaY, maculaRadius);
  maculaGrad.addColorStop(0, '#450a0a'); // Dark foveal center
  maculaGrad.addColorStop(0.4, '#7f1d1d'); // Fovea avascular zone
  maculaGrad.addColorStop(0.85, '#991b1b');
  maculaGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = maculaGrad;
  ctx.beginPath();
  ctx.arc(maculaX, maculaY, maculaRadius, 0, Math.PI * 2);
  ctx.fill();

  // Foveal pinpoint reflex
  ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.beginPath();
  ctx.arc(maculaX, maculaY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw Major Retinal Blood Vessels radiating from Optic Disc
  const drawVesselTree = (startX: number, startY: number, angle: number, length: number, width: number, isArtery: boolean, depth = 0) => {
    if (depth > 4 || width < 0.6) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    const cp1x = startX + Math.cos(angle - 0.2) * (length * 0.4);
    const cp1y = startY + Math.sin(angle - 0.2) * (length * 0.4);
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
    ctx.strokeStyle = isArtery ? 'rgba(190, 18, 60, 0.85)' : 'rgba(112, 13, 33, 0.9)';
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // Branching
    const branch1Angle = angle + (0.28 + Math.random() * 0.15);
    const branch2Angle = angle - (0.28 + Math.random() * 0.15);
    const nextLen = length * (0.65 + Math.random() * 0.15);

    drawVesselTree(endX, endY, branch1Angle, nextLen, width * 0.68, isArtery, depth + 1);
    drawVesselTree(endX, endY, branch2Angle, nextLen, width * 0.68, isArtery, depth + 1);
  };

  // Superior & Inferior Temporal & Nasal Arcades
  drawVesselTree(discX, discY, isOD ? -Math.PI * 0.25 : -Math.PI * 0.75, size * 0.28, 5.5, false);
  drawVesselTree(discX, discY, isOD ? -Math.PI * 0.22 : -Math.PI * 0.78, size * 0.26, 4.0, true);
  drawVesselTree(discX, discY, isOD ? Math.PI * 0.25 : Math.PI * 0.75, size * 0.28, 5.5, false);
  drawVesselTree(discX, discY, isOD ? Math.PI * 0.22 : Math.PI * 0.78, size * 0.26, 4.0, true);
  drawVesselTree(discX, discY, isOD ? -Math.PI * 0.8 : -Math.PI * 0.2, size * 0.22, 4.2, false);
  drawVesselTree(discX, discY, isOD ? -Math.PI * 0.75 : -Math.PI * 0.25, size * 0.2, 3.2, true);
  drawVesselTree(discX, discY, isOD ? Math.PI * 0.8 : Math.PI * 0.2, size * 0.22, 4.2, false);
  drawVesselTree(discX, discY, isOD ? Math.PI * 0.75 : Math.PI * 0.25, size * 0.2, 3.2, true);

  // Pathological Lesions Rendering
  const { microaneurysms, hemorrhages, exudates, cottonWoolSpots, neovascularization } = caseData.characteristics;

  // 1. Microaneurysms
  if (microaneurysms > 0) {
    ctx.fillStyle = '#991b1b';
    for (let i = 0; i < microaneurysms; i++) {
      const angle = (i / microaneurysms) * Math.PI * 2 + Math.sin(i * 3);
      const dist = size * 0.12 + (i % 5) * (size * 0.04);
      const mx = cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 20;
      const my = cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 20;
      ctx.beginPath();
      ctx.arc(mx, my, 1.8 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Intraretinal Hemorrhages
  if (hemorrhages > 0) {
    for (let i = 0; i < hemorrhages; i++) {
      const hx = cx + (Math.random() - 0.5) * radius * 1.4;
      const hy = cy + (Math.random() - 0.5) * radius * 1.4;
      const hDist = Math.hypot(hx - cx, hy - cy);
      if (hDist < radius * 0.85) {
        ctx.fillStyle = 'rgba(136, 19, 55, 0.9)';
        ctx.beginPath();
        if (i % 2 === 0) {
          ctx.arc(hx, hy, 4 + Math.random() * 5, 0, Math.PI * 2);
        } else {
          ctx.ellipse(hx, hy, 8 + Math.random() * 6, 3 + Math.random() * 2, Math.random() * Math.PI, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
  }

  // 3. Hard Exudates
  if (exudates > 0) {
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 2;
    for (let i = 0; i < exudates; i++) {
      const angle = (i / exudates) * Math.PI * 2;
      const ex = maculaX + Math.cos(angle) * (size * 0.11 + Math.random() * 15);
      const ey = maculaY + Math.sin(angle) * (size * 0.11 + Math.random() * 15);
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // 4. Cotton Wool Spots
  if (cottonWoolSpots > 0) {
    for (let i = 0; i < cottonWoolSpots; i++) {
      const wx = cx + (Math.random() - 0.5) * radius * 1.2;
      const wy = cy + (Math.random() - 0.5) * radius * 1.2;
      const cwsGrad = ctx.createRadialGradient(wx, wy, 1, wx, wy, 9 + Math.random() * 5);
      cwsGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      cwsGrad.addColorStop(0.5, 'rgba(240, 240, 240, 0.5)');
      cwsGrad.addColorStop(1, 'rgba(240, 240, 240, 0)');
      ctx.fillStyle = cwsGrad;
      ctx.beginPath();
      ctx.arc(wx, wy, 10 + Math.random() * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Neovascularization
  if (neovascularization) {
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.88)';
    ctx.lineWidth = 1.4;
    for (let n = 0; n < 14; n++) {
      ctx.beginPath();
      let nx = discX + (Math.random() - 0.5) * discRadius * 1.5;
      let ny = discY + (Math.random() - 0.5) * discRadius * 1.5;
      ctx.moveTo(nx, ny);
      for (let s = 0; s < 5; s++) {
        nx += (Math.random() - 0.5) * 16;
        ny += (Math.random() - 0.5) * 16;
        ctx.lineTo(nx, ny);
      }
      ctx.stroke();
    }
  }

  ctx.restore();
  return canvas.toDataURL('image/jpeg', 0.92);
}
