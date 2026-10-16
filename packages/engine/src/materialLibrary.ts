// @takient/core/src/3d/materialLibrary.ts
// Material caching and management

import * as THREE from 'three';
import { MaterialConfig } from '@openvenue/core';

/**
 * Material cache - stores materials by color key for reuse
 */
const materialCache: Map<string, THREE.MeshStandardMaterial> = new Map();

/**
 * Default material properties for retrofuturism aesthetic
 */
const DEFAULT_MATERIAL_PROPS = {
  metalness: 0.2,
  roughness: 0.8,
  emissiveIntensity: 0.15,
  side: THREE.FrontSide,
};

/**
 * Generate a cache key from material configuration
 * @param config Material configuration
 * @returns Cache key string
 */
function generateCacheKey(config: MaterialConfig): string {
  const {
    color,
    metalness = DEFAULT_MATERIAL_PROPS.metalness,
    roughness = DEFAULT_MATERIAL_PROPS.roughness,
    emissive,
    emissiveIntensity = DEFAULT_MATERIAL_PROPS.emissiveIntensity,
    opacity = 1.0,
    transparent = false,
  } = config;

  // Create a unique key based on all material properties
  return `${color}_m${metalness}_r${roughness}_e${emissive || color}_ei${emissiveIntensity}_o${opacity}_t${transparent}`;
}

/**
 * Get or create a material from the cache
 * @param config Material configuration
 * @returns Cached or new material
 */
export function getMaterial(config: MaterialConfig): THREE.MeshStandardMaterial {
  const cacheKey = generateCacheKey(config);

  // Check if material already exists in cache
  if (materialCache.has(cacheKey)) {
    return materialCache.get(cacheKey)!;
  }

  // Create new material
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color),
    metalness: config.metalness ?? DEFAULT_MATERIAL_PROPS.metalness,
    roughness: config.roughness ?? DEFAULT_MATERIAL_PROPS.roughness,
    emissive: new THREE.Color(config.emissive || config.color),
    emissiveIntensity: config.emissiveIntensity ?? DEFAULT_MATERIAL_PROPS.emissiveIntensity,
    opacity: config.opacity ?? 1.0,
    transparent: config.transparent ?? false,
    side: DEFAULT_MATERIAL_PROPS.side,
  });

  // Cache the material
  materialCache.set(cacheKey, material);

  return material;
}

/**
 * Get material with custom color override (clones and modifies existing material config)
 * @param baseConfig Base material configuration
 * @param colorOverride New color hex string
 * @returns Material with overridden color
 */
export function getMaterialWithColorOverride(
  baseConfig: MaterialConfig,
  colorOverride: string
): THREE.MeshStandardMaterial {
  const modifiedConfig = {
    ...baseConfig,
    color: colorOverride,
    emissive: colorOverride, // Update emissive to match new color
  };

  return getMaterial(modifiedConfig);
}

/**
 * Create a material from configuration without caching
 * Useful for materials that need to be modified dynamically
 * @param config Material configuration
 * @returns New material instance
 */
export function createMaterial(config: MaterialConfig): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color),
    metalness: config.metalness ?? DEFAULT_MATERIAL_PROPS.metalness,
    roughness: config.roughness ?? DEFAULT_MATERIAL_PROPS.roughness,
    emissive: new THREE.Color(config.emissive || config.color),
    emissiveIntensity: config.emissiveIntensity ?? DEFAULT_MATERIAL_PROPS.emissiveIntensity,
    opacity: config.opacity ?? 1.0,
    transparent: config.transparent ?? false,
    side: DEFAULT_MATERIAL_PROPS.side,
  });
}

/**
 * Clear the entire material cache and dispose all materials
 * Call this when unmounting or resetting the scene
 */
export function clearMaterialCache(): void {
  materialCache.forEach((material) => {
    material.dispose();
  });
  materialCache.clear();
}

/**
 * Remove a specific material from the cache
 * @param config Material configuration to remove
 */
export function removeMaterialFromCache(config: MaterialConfig): void {
  const cacheKey = generateCacheKey(config);
  const material = materialCache.get(cacheKey);

  if (material) {
    material.dispose();
    materialCache.delete(cacheKey);
  }
}

/**
 * Get cache statistics for debugging/monitoring
 * @returns Cache statistics
 */
export function getMaterialCacheStats(): {
  size: number;
  keys: string[];
} {
  return {
    size: materialCache.size,
    keys: Array.from(materialCache.keys()),
  };
}
