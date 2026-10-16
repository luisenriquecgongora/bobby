// @openvenue/engine/src/wallBuilder.ts
// Procedural 3D Wall Generator supporting arbitrary angles and automatic door/window opening cutouts.

import * as THREE from 'three';
import {
  WallSegment,
  WallOpening,
  RoomDimensions,
  cmToMeters,
  roomCoordsToWorld3D,
} from '@openvenue/core';

/**
 * Builds a Three.js Group representing a 3D wall segment with cutouts for doors/windows
 */
export function buildWallSegmentMesh(
  wall: WallSegment,
  roomDims: RoomDimensions
): THREE.Group {
  const group = new THREE.Group();

  const [x1, y1] = wall.start;
  const [x2, y2] = wall.end;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthCm = Math.sqrt(dx * dx + dy * dy);

  if (lengthCm < 5) return group; // Ignore tiny fragments

  const angleRad = Math.atan2(dy, dx);
  const thicknessCm = wall.thickness || 15;
  const heightCm = wall.height || 300;

  const lengthM = cmToMeters(lengthCm);
  const thicknessM = cmToMeters(thicknessCm);
  const heightM = cmToMeters(heightCm);

  // Midpoint in room coords (cm)
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Convert midpoint to world 3D position (bottom-origin elevation Z = 0)
  const worldPos = roomCoordsToWorld3D(
    { x: midX, y: midY, z: 0 },
    { width: 0, depth: 0, height: heightCm },
    { width: roomDims.width, depth: roomDims.depth },
    true // bottom-origin
  );

  group.position.set(worldPos[0], worldPos[1], worldPos[2]);
  group.rotation.y = -angleRad; // Rotate to match wall angle

  // Material
  const color = wall.material?.color || '#334155';
  const roughness = wall.material?.roughness ?? 0.8;
  const metalness = wall.material?.metalness ?? 0.1;
  const opacity = wall.material?.opacity ?? 1.0;
  const transparent = opacity < 1.0;

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    opacity,
    transparent,
    side: THREE.DoubleSide,
  });

  const openings = wall.openings || [];

  if (openings.length === 0) {
    // Solid uninterrupted wall
    const geom = new THREE.BoxGeometry(lengthM, heightM, thicknessM);
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(0, heightM / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else {
    // Wall with cutouts: build segments around openings
    // Sort openings by offset from start of wall
    const sorted = [...openings].sort((a, b) => a.offset - b.offset);

    let currentOffsetCm = 0;

    sorted.forEach((opening, idx) => {
      const openStartCm = Math.max(currentOffsetCm, opening.offset);
      const openEndCm = Math.min(lengthCm, opening.offset + opening.width);

      // 1. Solid segment before this opening
      if (openStartCm > currentOffsetCm) {
        const segLenCm = openStartCm - currentOffsetCm;
        const segLenM = cmToMeters(segLenCm);
        const segCenterXCm = currentOffsetCm + segLenCm / 2 - lengthCm / 2;
        const segGeom = new THREE.BoxGeometry(segLenM, heightM, thicknessM);
        const segMesh = new THREE.Mesh(segGeom, material);
        segMesh.position.set(cmToMeters(segCenterXCm), heightM / 2, 0);
        segMesh.castShadow = true;
        segMesh.receiveShadow = true;
        group.add(segMesh);
      }

      // 2. Opening cutout area:
      const openingCenterCm = (openStartCm + openEndCm) / 2 - lengthCm / 2;
      const openingWidthM = cmToMeters(openEndCm - openStartCm);

      // SILL (below opening, e.g. for windows)
      if (opening.elevation > 0) {
        const sillHeightM = cmToMeters(opening.elevation);
        const sillGeom = new THREE.BoxGeometry(openingWidthM, sillHeightM, thicknessM);
        const sillMesh = new THREE.Mesh(sillGeom, material);
        sillMesh.position.set(cmToMeters(openingCenterCm), sillHeightM / 2, 0);
        sillMesh.castShadow = true;
        sillMesh.receiveShadow = true;
        group.add(sillMesh);
      }

      // LINTEL (above opening)
      const openingTopCm = opening.elevation + opening.height;
      if (openingTopCm < heightCm) {
        const lintelHeightCm = heightCm - openingTopCm;
        const lintelHeightM = cmToMeters(lintelHeightCm);
        const lintelGeom = new THREE.BoxGeometry(openingWidthM, lintelHeightM, thicknessM);
        const lintelMesh = new THREE.Mesh(lintelGeom, material);
        lintelMesh.position.set(
          cmToMeters(openingCenterCm),
          cmToMeters(openingTopCm) + lintelHeightM / 2,
          0
        );
        lintelMesh.castShadow = true;
        lintelMesh.receiveShadow = true;
        group.add(lintelMesh);
      }

      currentOffsetCm = openEndCm;
    });

    // 3. Trailing solid segment after the last opening
    if (currentOffsetCm < lengthCm) {
      const segLenCm = lengthCm - currentOffsetCm;
      const segLenM = cmToMeters(segLenCm);
      const segCenterXCm = currentOffsetCm + segLenCm / 2 - lengthCm / 2;
      const segGeom = new THREE.BoxGeometry(segLenM, heightM, thicknessM);
      const segMesh = new THREE.Mesh(segGeom, material);
      segMesh.position.set(cmToMeters(segCenterXCm), heightM / 2, 0);
      segMesh.castShadow = true;
      segMesh.receiveShadow = true;
      group.add(segMesh);
    }
  }

  return group;
}
