// @takient/core/src/3d/proceduralTextures.ts
// Procedural Texture Generators using HTML5 Canvas

import * as THREE from 'three';
import { FloorMaterialConfig } from './floorMaterialTypes';

/**
 * Generate a wood plank texture
 */
export function generateWoodTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#8B4513';
  const variation = config.variation || 0.2;
  const plankWidth = config.plankWidth || 15; // cm
  const plankLength = config.plankLength || 100; // cm

  // Calculate plank dimensions in pixels (assuming canvas represents ~200cm)
  const pixelsPerCm = canvas.width / 200;
  const plankWidthPx = plankWidth * pixelsPerCm;
  const plankLengthPx = plankLength * pixelsPerCm;

  // Fill background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw planks
  for (let y = 0; y < canvas.height; y += plankWidthPx) {
    let x = 0;
    while (x < canvas.width) {
      const currentPlankLength = plankLengthPx * (0.8 + Math.random() * 0.4); // Vary plank length

      // Add color variation
      const colorVariation = Math.random() * variation;
      const variedColor = adjustBrightness(primaryColor, -colorVariation * 50);
      ctx.fillStyle = variedColor;
      ctx.fillRect(x, y, currentPlankLength, plankWidthPx);

      // Draw wood grain lines
      ctx.strokeStyle = adjustBrightness(primaryColor, -30);
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + plankWidthPx * (0.3 + Math.random() * 0.4));
        ctx.lineTo(x + currentPlankLength, y + plankWidthPx * (0.3 + Math.random() * 0.4));
        ctx.stroke();
      }

      // Draw plank border
      ctx.strokeStyle = adjustBrightness(primaryColor, -40);
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, currentPlankLength, plankWidthPx);

      x += currentPlankLength;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a tile texture with grout
 */
export function generateTileTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#E8E8E8';
  const groutColor = config.groutColor || '#9E9E9E';
  const tileSize = config.tileSize || 30; // cm
  const variation = config.variation || 0.1;

  // Calculate tile dimensions in pixels
  const pixelsPerCm = canvas.width / 200;
  const tileSizePx = tileSize * pixelsPerCm;
  const groutWidth = 2;

  // Fill grout
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw tiles
  for (let y = 0; y < canvas.height; y += tileSizePx + groutWidth) {
    for (let x = 0; x < canvas.width; x += tileSizePx + groutWidth) {
      // Add color variation
      const colorVariation = Math.random() * variation;
      const variedColor = adjustBrightness(primaryColor, -colorVariation * 30);
      ctx.fillStyle = variedColor;
      ctx.fillRect(x + groutWidth, y + groutWidth, tileSizePx - groutWidth, tileSizePx - groutWidth);

      // Add subtle texture
      ctx.fillStyle = adjustBrightness(variedColor, -5);
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(
          x + groutWidth + Math.random() * (tileSizePx - groutWidth),
          y + groutWidth + Math.random() * (tileSizePx - groutWidth),
          2,
          2
        );
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a marble texture
 */
export function generateMarbleTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#F5F5F5';
  const secondaryColor = config.secondaryColor || '#D0D0D0';

  // Base color
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add marble veins
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    ctx.moveTo(startX, startY);

    // Create wavy vein
    for (let j = 0; j < 10; j++) {
      const x = startX + (Math.random() - 0.5) * 200;
      const y = startY + (Math.random() - 0.5) * 200;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Add subtle noise
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10;
    imageData.data[i] += noise;     // R
    imageData.data[i + 1] += noise; // G
    imageData.data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a checkerboard pattern
 */
export function generateCheckerboardTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#FFFFFF';
  const secondaryColor = config.secondaryColor || '#000000';
  const tileSize = config.tileSize || 50; // cm

  const pixelsPerCm = canvas.width / 200;
  const tileSizePx = tileSize * pixelsPerCm;

  for (let y = 0; y < canvas.height; y += tileSizePx) {
    for (let x = 0; x < canvas.width; x += tileSizePx) {
      const isEven = ((x / tileSizePx) + (y / tileSizePx)) % 2 === 0;
      ctx.fillStyle = isEven ? primaryColor : secondaryColor;
      ctx.fillRect(x, y, tileSizePx, tileSizePx);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a hexagon tile pattern
 */
export function generateHexagonTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#E0E0E0';
  const groutColor = config.groutColor || '#A0A0A0';
  const tileSize = config.tileSize || 20; // cm

  const pixelsPerCm = canvas.width / 200;
  const hexSize = (tileSize * pixelsPerCm) / 2;

  // Fill grout background
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw hexagons
  const hexHeight = hexSize * Math.sqrt(3);
  const hexWidth = hexSize * 2;

  for (let row = 0; row < canvas.height / hexHeight + 2; row++) {
    for (let col = 0; col < canvas.width / (hexWidth * 0.75) + 2; col++) {
      const x = col * hexWidth * 0.75;
      const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

      drawHexagon(ctx, x, y, hexSize, primaryColor);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a herringbone wood pattern
 */
export function generateHerringboneTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#A0826D';
  const plankWidth = config.plankWidth || 8; // cm
  const plankLength = config.plankLength || 40; // cm
  const variation = config.variation || 0.15;

  const pixelsPerCm = canvas.width / 200;
  const plankWidthPx = plankWidth * pixelsPerCm;
  const plankLengthPx = plankLength * pixelsPerCm;

  ctx.fillStyle = adjustBrightness(primaryColor, -20);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw herringbone pattern
  for (let y = 0; y < canvas.height; y += plankWidthPx * 2) {
    for (let x = 0; x < canvas.width; x += plankLengthPx) {
      // Right-leaning plank
      const color1 = adjustBrightness(primaryColor, -Math.random() * variation * 50);
      drawRotatedRect(ctx, x, y, plankLengthPx, plankWidthPx, 45, color1);

      // Left-leaning plank
      const color2 = adjustBrightness(primaryColor, -Math.random() * variation * 50);
      drawRotatedRect(ctx, x + plankLengthPx / 2, y + plankWidthPx, plankLengthPx, plankWidthPx, -45, color2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a concrete texture
 */
export function generateConcreteTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#B0B0B0';

  // Base color
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add noise texture
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    imageData.data[i] += noise;     // R
    imageData.data[i + 1] += noise; // G
    imageData.data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);

  // Add subtle cracks
  ctx.strokeStyle = adjustBrightness(primaryColor, -20);
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    ctx.moveTo(startX, startY);
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(startX + (Math.random() - 0.5) * 100, startY + (Math.random() - 0.5) * 100);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a running bond (subway tile) texture
 */
export function generateRunningBondTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#F0F0F0';
  const groutColor = config.groutColor || '#A0A0A0';
  const tileWidth = (config.plankLength || 60) * (canvas.width / 200); // 60cm default
  const tileHeight = (config.plankWidth || 20) * (canvas.width / 200); // 20cm default
  const groutWidth = 2;

  // Fill grout background
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw running bond pattern (offset 50%)
  for (let row = 0; row < Math.ceil(canvas.height / (tileHeight + groutWidth)) + 1; row++) {
    const y = row * (tileHeight + groutWidth);
    const offset = (row % 2) * (tileWidth / 2);

    for (let col = 0; col < Math.ceil(canvas.width / (tileWidth + groutWidth)) + 2; col++) {
      const x = col * (tileWidth + groutWidth) - offset;

      // Color variation
      const variation = config.variation || 0.05;
      const variedColor = adjustBrightness(primaryColor, -Math.random() * variation * 30);
      ctx.fillStyle = variedColor;
      ctx.fillRect(x + groutWidth, y + groutWidth, tileWidth - groutWidth, tileHeight - groutWidth);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a basketweave pattern texture
 */
export function generateBasketweaveTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#D4A574';
  const secondaryColor = config.secondaryColor || '#B08D5D';
  const groutColor = config.groutColor || '#8B7355';
  const tileSize = (config.tileSize || 40) * (canvas.width / 200);
  const groutWidth = 2;

  // Fill grout
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw basketweave (pairs of horizontal and vertical tiles)
  for (let row = 0; row < Math.ceil(canvas.height / (tileSize * 2 + groutWidth)); row++) {
    for (let col = 0; col < Math.ceil(canvas.width / (tileSize * 2 + groutWidth)); col++) {
      const x = col * (tileSize * 2 + groutWidth);
      const y = row * (tileSize * 2 + groutWidth);

      // Determine if this cell is horizontal or vertical based on checkerboard
      const isHorizontal = (row + col) % 2 === 0;

      if (isHorizontal) {
        // Two horizontal tiles
        ctx.fillStyle = primaryColor;
        ctx.fillRect(x + groutWidth, y + groutWidth, tileSize * 2 - groutWidth, tileSize - groutWidth);
        ctx.fillRect(x + groutWidth, y + tileSize + groutWidth, tileSize * 2 - groutWidth, tileSize - groutWidth);
      } else {
        // Two vertical tiles
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(x + groutWidth, y + groutWidth, tileSize - groutWidth, tileSize * 2 - groutWidth);
        ctx.fillRect(x + tileSize + groutWidth, y + groutWidth, tileSize - groutWidth, tileSize * 2 - groutWidth);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a versailles (French pattern) texture
 */
export function generateVersaillesTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#C9B896';
  const groutColor = config.groutColor || '#9B8B73';
  const variation = config.variation || 0.15;
  const groutWidth = 2;

  // Fill grout
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Versailles pattern: mix of large and small squares/rectangles
  // Simplified 4-tile repeating pattern
  const patternSize = 200;

  for (let row = 0; row < Math.ceil(canvas.height / patternSize) + 1; row++) {
    for (let col = 0; col < Math.ceil(canvas.width / patternSize) + 1; col++) {
      const baseX = col * patternSize;
      const baseY = row * patternSize;

      // Large square (80x80)
      drawTile(ctx, baseX, baseY, 80, 80, primaryColor, variation, groutWidth);

      // Medium rectangle (80x60)
      drawTile(ctx, baseX + 80 + groutWidth, baseY, 80, 60, primaryColor, variation, groutWidth);

      // Medium rectangle (80x60)
      drawTile(ctx, baseX + 80 + groutWidth, baseY + 60 + groutWidth, 80, 60, primaryColor, variation, groutWidth);

      // Two small squares (40x40 each)
      drawTile(ctx, baseX, baseY + 80 + groutWidth, 40, 40, primaryColor, variation, groutWidth);
      drawTile(ctx, baseX + 40 + groutWidth, baseY + 80 + groutWidth, 40, 40, primaryColor, variation, groutWidth);

      // Medium rectangle (80x40)
      drawTile(ctx, baseX, baseY + 120 + groutWidth * 2, 80, 40, primaryColor, variation, groutWidth);

      // Fill remaining space
      drawTile(ctx, baseX + 160 + groutWidth * 2, baseY, 40, 80, primaryColor, variation, groutWidth);
      drawTile(ctx, baseX + 160 + groutWidth * 2, baseY + 80 + groutWidth, 40, 80, primaryColor, variation, groutWidth);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a windmill pattern texture
 */
export function generateWindmillTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#E0E0E0';
  const secondaryColor = config.secondaryColor || '#C0C0C0';
  const groutColor = config.groutColor || '#A0A0A0';
  const patternSize = 120;
  const groutWidth = 2;

  // Fill grout
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Windmill: center square surrounded by 4 rectangles
  for (let row = 0; row < Math.ceil(canvas.height / patternSize) + 1; row++) {
    for (let col = 0; col < Math.ceil(canvas.width / patternSize) + 1; col++) {
      const x = col * patternSize;
      const y = row * patternSize;
      const centerSize = patternSize / 3;
      const rectWidth = (patternSize * 2) / 3;

      // Center square
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(
        x + centerSize + groutWidth,
        y + centerSize + groutWidth,
        centerSize - groutWidth * 2,
        centerSize - groutWidth * 2
      );

      // Top rectangle
      ctx.fillStyle = primaryColor;
      ctx.fillRect(x + centerSize + groutWidth, y + groutWidth, centerSize - groutWidth * 2, centerSize - groutWidth);

      // Bottom rectangle
      ctx.fillRect(
        x + centerSize + groutWidth,
        y + rectWidth + groutWidth,
        centerSize - groutWidth * 2,
        centerSize - groutWidth
      );

      // Left rectangle
      ctx.fillRect(x + groutWidth, y + centerSize + groutWidth, centerSize - groutWidth, centerSize - groutWidth * 2);

      // Right rectangle
      ctx.fillRect(
        x + rectWidth + groutWidth,
        y + centerSize + groutWidth,
        centerSize - groutWidth,
        centerSize - groutWidth * 2
      );
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate an octagon & dot pattern texture
 */
export function generateOctagonDotTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#FFFFFF';
  const secondaryColor = config.secondaryColor || '#000000';
  const groutColor = config.groutColor || '#808080';
  const octSize = (config.tileSize || 50) * (canvas.width / 200);
  const dotSize = octSize * 0.3;
  const groutWidth = 2;

  // Fill grout
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const spacing = octSize + dotSize + groutWidth * 2;

  for (let row = 0; row < Math.ceil(canvas.height / spacing) + 1; row++) {
    for (let col = 0; col < Math.ceil(canvas.width / spacing) + 1; col++) {
      const x = col * spacing;
      const y = row * spacing;

      // Draw octagon (approximated with rectangle with cut corners)
      ctx.fillStyle = primaryColor;
      const cutSize = octSize * 0.3;
      ctx.beginPath();
      ctx.moveTo(x + cutSize, y);
      ctx.lineTo(x + octSize - cutSize, y);
      ctx.lineTo(x + octSize, y + cutSize);
      ctx.lineTo(x + octSize, y + octSize - cutSize);
      ctx.lineTo(x + octSize - cutSize, y + octSize);
      ctx.lineTo(x + cutSize, y + octSize);
      ctx.lineTo(x, y + octSize - cutSize);
      ctx.lineTo(x, y + cutSize);
      ctx.closePath();
      ctx.fill();

      // Draw dot (small square) at the junction
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(x + octSize + groutWidth, y + octSize + groutWidth, dotSize, dotSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generate a diagonal grid texture
 */
export function generateDiagonalGridTexture(config: FloorMaterialConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const primaryColor = config.primaryColor || '#F5F5F5';
  const groutColor = config.groutColor || '#C0C0C0';
  const tileSize = (config.tileSize || 40) * (canvas.width / 200);
  const groutWidth = 2;

  // Fill background
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Rotate context 45 degrees
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw grid
  const diagonalSize = Math.sqrt(2) * canvas.width;
  for (let y = -diagonalSize; y < diagonalSize; y += tileSize + groutWidth) {
    for (let x = -diagonalSize; x < diagonalSize; x += tileSize + groutWidth) {
      const variation = config.variation || 0.1;
      const variedColor = adjustBrightness(primaryColor, -Math.random() * variation * 30);
      ctx.fillStyle = variedColor;
      ctx.fillRect(x + groutWidth, y + groutWidth, tileSize - groutWidth, tileSize - groutWidth);
    }
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Helper function to draw a single tile with variation
function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  baseColor: string,
  variation: number,
  groutWidth: number
) {
  const variedColor = adjustBrightness(baseColor, -Math.random() * variation * 30);
  ctx.fillStyle = variedColor;
  ctx.fillRect(x + groutWidth, y + groutWidth, width - groutWidth, height - groutWidth);
}

// Helper functions

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const hx = x + size * Math.cos(angle);
    const hy = y + size * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(hx, hy);
    } else {
      ctx.lineTo(hx, hy);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = adjustBrightness(color, -20);
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawRotatedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.strokeStyle = adjustBrightness(color, -30);
  ctx.lineWidth = 1;
  ctx.strokeRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}
