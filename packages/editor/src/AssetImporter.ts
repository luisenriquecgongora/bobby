// @openvenue/editor/src/AssetImporter.ts
// Drag-and-drop .glb / .gltf 3D model importer with automatic bounding box calculation & ground normalization.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { metersToCm } from '@openvenue/core';
import { ViewerRoomElement } from '@openvenue/viewer';

export interface ImportedAssetResult {
  filename: string;
  binaryData: Uint8Array;
  dimensionsCm: { width: number; depth: number; height: number };
  newElement: ViewerRoomElement;
}

/**
 * Parses a dragged .glb or .gltf file and calculates its bounding box & ground normalization
 *
 * @param file The dragged browser File object
 * @param dropRoomPosition Default [x, y] in cm where the object was dropped in room
 * @returns ImportedAssetResult with binary data and scene element
 */
export async function importGLBAsset(
  file: File,
  dropRoomPosition: { x: number; y: number } = { x: 500, y: 500 }
): Promise<ImportedAssetResult> {
  const arrayBuffer = await file.arrayBuffer();
  const binaryData = new Uint8Array(arrayBuffer);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.parse(
      arrayBuffer,
      '',
      (gltf) => {
        const root = gltf.scene;

        // Compute 3D bounding box
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Convert meters to centimeters for room layout
        const widthCm = Math.max(20, Math.round(metersToCm(size.x)));
        const heightCm = Math.max(20, Math.round(metersToCm(size.y)));
        const depthCm = Math.max(20, Math.round(metersToCm(size.z)));

        const cleanName = file.name.replace(/\.(glb|gltf)$/i, '').replace(/[^a-zA-Z0-9_-]/g, ' ');

        const newElement: ViewerRoomElement = {
          _id: `asset_${Date.now()}`,
          name: cleanName || 'Custom 3D Model',
          type: 'custom',
          position: { x: dropRoomPosition.x, y: dropRoomPosition.y, z: 0 },
          dimensions: { width: widthCm, depth: depthCm, height: heightCm },
          rotation: 0,
          customGeometry: {
            isExternalGLB: true,
            assetFilename: file.name,
            parts: [],
            version: '1.0',
          },
        };

        resolve({
          filename: file.name,
          binaryData,
          dimensionsCm: { width: widthCm, depth: depthCm, height: heightCm },
          newElement,
        });
      },
      (error) => {
        reject(new Error(`Failed to parse 3D GLB model: ${error.message}`));
      }
    );
  });
}
