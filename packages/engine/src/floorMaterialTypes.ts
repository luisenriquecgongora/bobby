// @takient/core/src/3d/floorMaterialTypes.ts
// Floor Material Type Definitions

/**
 * Floor material configuration for pattern customization
 */
export interface FloorMaterialConfig {
  primaryColor: string;
  secondaryColor?: string;
  groutColor?: string;      // For tiles
  tileSize?: number;        // In cm
  plankWidth?: number;      // For wood patterns (in cm)
  plankLength?: number;     // For wood patterns (in cm)
  variation?: number;       // Color variation 0-1
}

/**
 * Floor material pattern types
 */
export type FloorPattern =
  | 'wood'
  | 'marble'
  | 'tile'
  | 'mosaic'
  | 'herringbone'
  | 'checkerboard'
  | 'hexagon'
  | 'parquet'
  | 'concrete'
  | 'running-bond'
  | 'basketweave'
  | 'versailles'
  | 'windmill'
  | 'octagon-dot'
  | 'diagonal-grid'
  | string;

/**
 * Floor material definition
 */
export interface FloorMaterial {
  type: 'color' | 'texture' | 'procedural' | 'solid' | 'wood' | 'marble' | 'tile' | 'concrete' | 'carpet';

  // For solid color
  color?: string;

  // For texture-based (images)
  textureURL?: string;
  normalMapURL?: string;      // For depth/bump
  roughnessMapURL?: string;   // For material properties

  // Material properties
  metalness?: number;         // 0-1
  roughness?: number;         // 0-1
  scale?: number;             // Texture repeat scale
  rotation?: number;          // Texture rotation in degrees

  // For procedural patterns
  pattern?: FloorPattern;
  patternConfig?: FloorMaterialConfig;
}

/**
 * Preset material definition with metadata
 */
export interface FloorMaterialPreset {
  id: string;
  name: string;
  description: string;
  category: 'wood' | 'stone' | 'tile' | 'modern' | 'pattern';
  material: FloorMaterial;
  thumbnail?: string; // Optional preview image URL
}
