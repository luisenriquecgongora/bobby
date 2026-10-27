import { describe, it, expect } from 'vitest';
import {
  packVenueToZip,
  unpackVenueFromZip,
  VenueProject,
} from '../venueFile';

describe('Venue ZIP File Packaging Engine', () => {
  const sampleProject: VenueProject = {
    manifest: {
      version: '1.0.0',
      name: 'Test Grand Ballroom',
      author: 'Luis Enrique',
      createdAt: '2026-10-27T12:00:00.000Z',
      updatedAt: '2026-10-27T12:00:00.000Z',
      dimensions: { width: 2000, depth: 1500, height: 500, unit: 'cm' },
      generator: 'Bobby Test Suite',
    },
    scene: {
      room: { width: 2000, depth: 1500, height: 500, unit: 'cm' },
      tables: [
        {
          _id: 'table_1',
          name: 'VIP Table 1',
          shape: 'rectangle',
          position: { x: 300, y: 300, z: 0 },
          dimensions: { width: 200, depth: 100, height: 75 },
          rotation: 45,
        },
      ],
      elements: [
        {
          _id: 'elem_bar_1',
          name: 'Main Bar',
          type: 'bar_counter',
          position: { x: 800, y: 1200, z: 0 },
          dimensions: { width: 500, depth: 120, height: 110 },
          rotation: 0,
        },
      ],
      walls: [],
    },
    assets: {
      'custom_chair.glb': new Uint8Array([0x67, 0x6c, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00]), // simulated GLB header
    },
    thumbnailPngBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  };

  it('packs a venue project into a valid ZIP blob', async () => {
    const blob = await packVenueToZip(sampleProject);
    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe('application/zip');
  });

  it('correctly unpacks and reconstructs manifest, scene, and embedded binary assets', async () => {
    const blob = await packVenueToZip(sampleProject);
    const unpacked = await unpackVenueFromZip(blob);

    // Verify manifest
    expect(unpacked.manifest.name).toBe('Test Grand Ballroom');
    expect(unpacked.manifest.dimensions.width).toBe(2000);
    expect(unpacked.manifest.version).toBe('1.0.0');

    // Verify scene tables and elements
    expect(unpacked.scene.tables).toHaveLength(1);
    expect(unpacked.scene.tables[0]._id).toBe('table_1');
    expect(unpacked.scene.tables[0].rotation).toBe(45);
    expect(unpacked.scene.elements).toHaveLength(1);
    expect(unpacked.scene.elements[0]._id).toBe('elem_bar_1');

    // Verify binary assets
    expect(unpacked.assets).toBeDefined();
    expect(unpacked.assets!['custom_chair.glb']).toBeDefined();
    expect(unpacked.assets!['custom_chair.glb']).toEqual(sampleProject.assets!['custom_chair.glb']);

    // Verify thumbnail
    expect(unpacked.thumbnailPngBase64).toBeDefined();
    expect(unpacked.thumbnailPngBase64).toContain('data:image/png;base64,');
  });

  it('throws an error if required files are missing in ZIP', async () => {
    const JSZip = (await import('jszip')).default;
    const corruptZip = new JSZip();
    corruptZip.file('other.txt', 'not a venue file');
    const corruptBlob = await corruptZip.generateAsync({ type: 'blob' });

    await expect(unpackVenueFromZip(corruptBlob)).rejects.toThrow('missing manifest.json');
  });
});
