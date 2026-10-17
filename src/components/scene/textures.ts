import * as THREE from "three";

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  draw(canvas.getContext("2d")!, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// เส้นบางๆ บนพื้นแบบภูมิประเทศเส้นในภาพอ้างอิง จางลงที่ขอบ
export function floorLinesTexture() {
  return canvasTexture(1024, (ctx, size) => {
    for (let y = 0; y < size; y += 7) {
      const t = y / size;
      ctx.strokeStyle = `rgba(255,255,255,${0.08 + 0.32 * Math.sin(Math.PI * t) ** 2})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= size; x += 16) {
        const wave = Math.sin(x / 140 + y / 90) * 6 * Math.sin(Math.PI * t);
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    const fade = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size / 2);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, "rgba(0,0,0,1)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, size, size);
  });
}

// ลำแสงแนวตั้ง สว่างตรงกลาง จางไปด้านข้างและด้านบน
export function beamTexture() {
  return canvasTexture(256, (ctx, size) => {
    const horizontal = ctx.createLinearGradient(0, 0, size, 0);
    horizontal.addColorStop(0, "rgba(255,255,255,0)");
    horizontal.addColorStop(0.5, "rgba(255,255,255,1)");
    horizontal.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = horizontal;
    ctx.fillRect(0, 0, size, size);
    const vertical = ctx.createLinearGradient(0, 0, 0, size);
    vertical.addColorStop(0, "rgba(0,0,0,1)");
    vertical.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = vertical;
    ctx.fillRect(0, 0, size, size);
  });
}

export function glowTexture() {
  return canvasTexture(256, (ctx, size) => {
    const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
  });
}

// ฉากหลังสตูดิโอถ่ายสินค้า: เทาอ่อนตรงกลาง ไล่เข้มที่ขอบให้กลืนกับหน้าเว็บสีดำ
export function studioTexture() {
  return canvasTexture(512, (ctx, size) => {
    const light = ctx.createRadialGradient(size / 2, size * 0.45, 0, size / 2, size * 0.45, size * 0.62);
    light.addColorStop(0, "#e4e4e7");
    light.addColorStop(0.45, "#b4b4ba");
    light.addColorStop(1, "#2a2a2e");
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, size, size);
  });
}
