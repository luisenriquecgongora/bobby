// @openvenue/core/src/format/venueFile.ts
// Standardized .venue project packaging engine (ZIP container of manifest.json, scene.json, and assets/)

import JSZip from 'jszip';
import { RoomDimensions, FloorMaterial, Wall } from '../types/index';

export interface VenueManifest {
  version: string;
  name: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  dimensions: RoomDimensions;
  generator: string;
}

export interface VenueSceneData {
  room: RoomDimensions;
  floorMaterial?: FloorMaterial;
  walls?: Wall[];
  tables: any[];
  elements: any[];
}

export interface VenueProject {
  manifest: VenueManifest;
  scene: VenueSceneData;
  assets?: Record<string, Uint8Array>; // filename -> binary data (.glb models, custom textures)
  thumbnailPngBase64?: string;
}

/**
 * Pack a VenueProject into a binary .venue ZIP archive
 *
 * @param project The in-memory venue project data
 * @returns Blob of the zipped .venue file
 */
export async function packVenueToZip(project: VenueProject): Promise<Blob> {
  const zip = new JSZip();

  // 1. Manifest
  zip.file('manifest.json', JSON.stringify(project.manifest, null, 2));

  // 2. Scene Data
  zip.file('scene.json', JSON.stringify(project.scene, null, 2));

  // 3. Optional thumbnail
  if (project.thumbnailPngBase64) {
    const cleanBase64 = project.thumbnailPngBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, '');
    zip.file('thumbnail.png', cleanBase64, { base64: true });
  }

  // 4. Assets folder (custom .glb models, textures)
  if (project.assets && Object.keys(project.assets).length > 0) {
    const assetsFolder = zip.folder('assets');
    if (assetsFolder) {
      for (const [filename, binaryData] of Object.entries(project.assets)) {
        assetsFolder.file(filename, binaryData);
      }
    }
  }

  // Generate binary package with deflate compression
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Unpack a binary .venue ZIP archive into an in-memory VenueProject
 *
 * @param data Binary file data (Blob, ArrayBuffer, or Uint8Array)
 * @returns Parsed VenueProject
 */
export async function unpackVenueFromZip(data: Blob | ArrayBuffer | Uint8Array): Promise<VenueProject> {
  const zip = await JSZip.loadAsync(data);

  // 1. Read manifest
  const manifestFile = zip.file('manifest.json');
  if (!manifestFile) {
    throw new Error('Invalid .venue file: missing manifest.json');
  }
  const manifestText = await manifestFile.async('string');
  const manifest: VenueManifest = JSON.parse(manifestText);

  // 2. Read scene
  const sceneFile = zip.file('scene.json');
  if (!sceneFile) {
    throw new Error('Invalid .venue file: missing scene.json');
  }
  const sceneText = await sceneFile.async('string');
  const scene: VenueSceneData = JSON.parse(sceneText);

  // 3. Read optional thumbnail
  let thumbnailPngBase64: string | undefined;
  const thumbnailFile = zip.file('thumbnail.png');
  if (thumbnailFile) {
    thumbnailPngBase64 = `data:image/png;base64,${await thumbnailFile.async('base64')}`;
  }

  // 4. Read assets
  const assets: Record<string, Uint8Array> = {};
  const assetsFolder = zip.folder('assets');
  if (assetsFolder) {
    for (const [relativePath, file] of Object.entries(assetsFolder.files)) {
      if (!file.dir) {
        const cleanName = relativePath.replace(/^assets\//, '');
        assets[cleanName] = await file.async('uint8array');
      }
    }
  }

  return {
    manifest,
    scene,
    assets,
    thumbnailPngBase64,
  };
}

/**
 * Browser helper to trigger a direct download of the .venue file to the user's laptop disk
 */
export async function downloadVenueFile(project: VenueProject, filename?: string): Promise<void> {
  const blob = await packVenueToZip(project);
  const name = filename || `${project.manifest.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.venue`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Browser helper to parse an uploaded or dragged .venue file
 */
export async function loadVenueFromFileInput(file: File): Promise<VenueProject> {
  return await unpackVenueFromZip(file);
}
