import * as THREE from 'three';

/**
 * Procedural medieval stone masonry and heraldic textures for Three.js
 */

export function createStonePaverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base weathered stone tone
  ctx.fillStyle = '#222d3d';
  ctx.fillRect(0, 0, 512, 512);

  // Draw interlocking flagstone pavers
  const rows = 8;
  const cols = 8;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (cellW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cellW + offset + 2;
      const y = r * cellH + 2;
      const w = cellW - 4;
      const h = cellH - 4;

      // Varied stone colors: slate, basalt, limestone
      const seed = Math.sin(r * 12.9898 + c * 78.233);
      const tone = Math.floor(40 + Math.abs(seed) * 35);
      const blueTint = Math.floor(55 + Math.abs(seed) * 45);
      ctx.fillStyle = `rgb(${tone}, ${tone + 8}, ${blueTint})`;

      // Rounded chiseled stone block
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();

      // Stone grain / chiseled highlights
      ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner stone shading
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + w * 0.6, y + h * 0.6, w * 0.4, h * 0.4);
    }
  }

  // Weathering noise & specks
  for (let i = 0; i < 4000; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    const alpha = Math.random() * 0.25;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(nx, ny, 1.5, 1.5);
  }

  // Deep dark mortar lines
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#090d16';
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellH);
    ctx.lineTo(512, r * cellH);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createStoneWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#18202c';
  ctx.fillRect(0, 0, 512, 512);

  // Staggered ashlar fortress blocks
  const rows = 12;
  const rowH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const cols = (r % 2 === 0) ? 6 : 5;
    const blockW = 512 / cols;
    const y = r * rowH;

    for (let c = 0; c < cols; c++) {
      const x = c * blockW;
      const seed = Math.sin(r * 31.4 + c * 17.8);
      const shade = Math.floor(32 + Math.abs(seed) * 35);
      const slate = Math.floor(45 + Math.abs(seed) * 40);

      // Block fill
      ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${slate})`;
      ctx.fillRect(x + 2, y + 2, blockW - 4, rowH - 4);

      // Top-left beveled highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + rowH - 2);
      ctx.lineTo(x + 2, y + 2);
      ctx.lineTo(x + blockW - 2, y + 2);
      ctx.stroke();

      // Bottom-right shadow
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(x + blockW - 2, y + 2);
      ctx.lineTo(x + blockW - 2, y + rowH - 2);
      ctx.lineTo(x + 2, y + rowH - 2);
      ctx.stroke();
    }
  }

  // Weathering and lichen speckling
  for (let i = 0; i < 3500; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.6 ? 'rgba(0, 0, 0, 0.28)' : 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(nx, ny, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

export function createStoneBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Black mortar base
  ctx.fillStyle = '#101010';
  ctx.fillRect(0, 0, 256, 256);

  // White/gray elevated stones
  const rows = 8;
  const cols = 8;
  const cellW = 256 / cols;
  const cellH = 256 / rows;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (cellW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cellW + offset + 2;
      const y = r * cellH + 2;
      const w = cellW - 4;
      const h = cellH - 4;

      const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, w / 2);
      grad.addColorStop(0, '#e5e5e5');
      grad.addColorStop(0.7, '#999999');
      grad.addColorStop(1, '#333333');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 4);
      ctx.fill();
    }
  }

  // Grain noise
  for (let i = 0; i < 2000; i++) {
    const nx = Math.random() * 256;
    const ny = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(nx, ny, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createHeraldicBannerTexture(
  theme: 'suncrest' | 'vanguard' | 'chronicler' | 'bastion'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Theme configuration
  const configs = {
    suncrest: {
      bgTop: '#1e3a8a', // Royal Azure
      bgBottom: '#172554',
      accent: '#f59e0b', // Sun Gold
      border: '#fbbf24',
      name: 'SUNCREST',
      symbol: 'sun'
    },
    vanguard: {
      bgTop: '#991b1b', // Imperial Crimson
      bgBottom: '#450a0a',
      accent: '#fbbf24', // Gold Lion
      border: '#fde047',
      name: 'VANGUARD',
      symbol: 'swords'
    },
    chronicler: {
      bgTop: '#065f46', // Emerald Keep
      bgBottom: '#022c22',
      accent: '#34d399', // Mystic Jade & Gold
      border: '#fbbf24',
      name: 'CHRONICLE',
      symbol: 'tome'
    },
    bastion: {
      bgTop: '#334155', // Fortress Slate & Ember
      bgBottom: '#0f172a',
      accent: '#f97316', // Forge Orange
      border: '#fdba74',
      name: 'BASTION',
      symbol: 'tower'
    }
  };

  const cfg = configs[theme];

  // Fabric gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, cfg.bgTop);
  bgGrad.addColorStop(0.8, cfg.bgBottom);
  bgGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 256, 512);

  // Subtle woven tapestry fabric texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 256, 1);
  }

  // Golden heraldic border & embroidered inner framing
  ctx.strokeStyle = cfg.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, 232, 488);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 216, 472);

  // Corner decorative flourishes
  ctx.fillStyle = cfg.border;
  const corners = [
    [24, 24],
    [232, 24],
    [24, 488],
    [232, 488]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Central Heraldic Shield Escutcheon
  const sx = 128;
  const sy = 160;
  const sw = 68;
  const sh = 90;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx - sw, sy);
  ctx.lineTo(sx + sw, sy);
  ctx.lineTo(sx + sw, sy + sh * 0.5);
  ctx.quadraticCurveTo(sx + sw, sy + sh, sx, sy + sh * 1.3);
  ctx.quadraticCurveTo(sx - sw, sy + sh, sx - sw, sy + sh * 0.5);
  ctx.closePath();

  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = cfg.border;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Draw heraldic sigil inside shield
  ctx.fillStyle = cfg.accent;
  ctx.strokeStyle = cfg.accent;
  ctx.lineWidth = 3;

  if (cfg.symbol === 'sun') {
    // Suncrest: Radiant sun with rays & center circle
    ctx.beginPath();
    ctx.arc(sx, sy + sh * 0.5, 18, 0, Math.PI * 2);
    ctx.fill();
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      const x1 = sx + Math.cos(angle) * 22;
      const y1 = sy + sh * 0.5 + Math.sin(angle) * 22;
      const x2 = sx + Math.cos(angle) * 34;
      const y2 = sy + sh * 0.5 + Math.sin(angle) * 34;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  } else if (cfg.symbol === 'swords') {
    // Vanguard: Crossed knight broadswords
    // Blade 1
    ctx.beginPath();
    ctx.moveTo(sx - 28, sy + 15);
    ctx.lineTo(sx + 28, sy + sh - 5);
    ctx.stroke();
    // Crossguard 1
    ctx.beginPath();
    ctx.moveTo(sx - 34, sy + 30);
    ctx.lineTo(sx - 18, sy + 18);
    ctx.stroke();

    // Blade 2
    ctx.beginPath();
    ctx.moveTo(sx + 28, sy + 15);
    ctx.lineTo(sx - 28, sy + sh - 5);
    ctx.stroke();
    // Crossguard 2
    ctx.beginPath();
    ctx.moveTo(sx + 34, sy + 30);
    ctx.lineTo(sx + 18, sy + 18);
    ctx.stroke();

    // Lion emblem circle
    ctx.beginPath();
    ctx.arc(sx, sy + sh * 0.45, 9, 0, Math.PI * 2);
    ctx.fill();
  } else if (cfg.symbol === 'tome') {
    // Chronicler: Open Tome & Quill
    ctx.beginPath();
    ctx.rect(sx - 26, sy + 25, 24, 38);
    ctx.rect(sx + 2, sy + 25, 24, 38);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sx - 22, sy + 32, 16, 3);
    ctx.fillRect(sx - 22, sy + 40, 16, 3);
    ctx.fillRect(sx + 6, sy + 32, 16, 3);
    ctx.fillRect(sx + 6, sy + 40, 16, 3);
    // Quill feather
    ctx.strokeStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(sx + 22, sy + 15);
    ctx.quadraticCurveTo(sx + 32, sy + 35, sx + 24, sy + 55);
    ctx.stroke();
  } else {
    // Bastion: Fortified Castle Tower with Crenellations
    ctx.fillRect(sx - 22, sy + 28, 44, 46);
    // Crenellations
    ctx.fillRect(sx - 26, sy + 18, 14, 14);
    ctx.fillRect(sx - 6, sy + 18, 12, 14);
    ctx.fillRect(sx + 12, sy + 18, 14, 14);
    // Arrow loop slit
    ctx.fillStyle = '#090d16';
    ctx.fillRect(sx - 3, sy + 36, 6, 20);
  }
  ctx.restore();

  // Banner Motto Ribbon
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(36, 320, 184, 34);
  ctx.strokeStyle = cfg.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 320, 184, 34);

  ctx.fillStyle = cfg.border;
  ctx.font = 'bold 18px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cfg.name, 128, 337);

  // Lower Chevron soldier heraldry lines
  ctx.strokeStyle = cfg.border;
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const cy = 385 + i * 22;
    ctx.beginPath();
    ctx.moveTo(40, cy);
    ctx.lineTo(128, cy + 24);
    ctx.lineTo(216, cy);
    ctx.stroke();
  }

  // Golden Fringe at Bottom Hem
  ctx.fillStyle = '#f59e0b';
  for (let x = 16; x < 240; x += 10) {
    ctx.fillRect(x, 480, 6, 20);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
