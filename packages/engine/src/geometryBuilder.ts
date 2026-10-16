// @takient/core/src/3d/geometryBuilder.ts
// Builds Three.js meshes from base object definitions

import * as THREE from 'three';
import {
  BaseObjectDefinition,
  GeometryPart,
  BoxParams,
  CylinderParams,
  SphereParams,
  ConeParams,
  TorusParams,
  PlaneParams,
  CapsuleParams
} from '@openvenue/core';
import { getMaterial, getMaterialWithColorOverride } from './materialLibrary';

/**
 * Geometry cache for reusing geometries
 */
const geometryCache: Map<string, THREE.BufferGeometry> = new Map();

/**
 * Generate cache key for geometry
 */
function generateGeometryCacheKey(part: GeometryPart): string {
  const params = part.params;

  if (part.type === 'box') {
    const p = params as BoxParams;
    return `box_${p.width}_${p.height}_${p.depth}`;
  } else if (part.type === 'cylinder') {
    const p = params as CylinderParams;
    return `cylinder_${p.radiusTop}_${p.radiusBottom}_${p.height}_${p.radialSegments || 32}`;
  } else if (part.type === 'sphere') {
    const p = params as SphereParams;
    return `sphere_${p.radius}_${p.widthSegments || 32}_${p.heightSegments || 16}`;
  } else if (part.type === 'cone') {
    const p = params as ConeParams;
    return `cone_${p.radius}_${p.height}_${p.radialSegments || 32}_${p.openEnded || false}`;
  } else if (part.type === 'torus') {
    const p = params as TorusParams;
    return `torus_${p.radius}_${p.tubeRadius}_${p.radialSegments || 16}_${p.tubularSegments || 100}`;
  } else if (part.type === 'plane') {
    const p = params as PlaneParams;
    return `plane_${p.width}_${p.height}_${p.widthSegments || 1}_${p.heightSegments || 1}`;
  } else if (part.type === 'capsule') {
    const p = params as CapsuleParams;
    return `capsule_${p.radius}_${p.length}_${p.capSegments || 8}_${p.radialSegments || 16}`;
  }

  return 'unknown';
}

/**
 * Create or get cached geometry for a part
 */
function getGeometry(part: GeometryPart): THREE.BufferGeometry {
  const cacheKey = generateGeometryCacheKey(part);

  // Check cache first
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!;
  }

  // Create new geometry
  let geometry: THREE.BufferGeometry;

  if (part.type === 'box') {
    const p = part.params as BoxParams;
    geometry = new THREE.BoxGeometry(p.width, p.height, p.depth);
  } else if (part.type === 'cylinder') {
    const p = part.params as CylinderParams;
    geometry = new THREE.CylinderGeometry(
      p.radiusTop,
      p.radiusBottom,
      p.height,
      p.radialSegments || 32
    );
  } else if (part.type === 'sphere') {
    const p = part.params as SphereParams;
    geometry = new THREE.SphereGeometry(
      p.radius,
      p.widthSegments || 32,
      p.heightSegments || 16
    );
  } else if (part.type === 'cone') {
    const p = part.params as ConeParams;
    geometry = new THREE.ConeGeometry(
      p.radius,
      p.height,
      p.radialSegments || 32,
      p.heightSegments || 1,
      p.openEnded || false
    );
  } else if (part.type === 'torus') {
    const p = part.params as TorusParams;
    geometry = new THREE.TorusGeometry(
      p.radius,
      p.tubeRadius,
      p.radialSegments || 16,
      p.tubularSegments || 100,
      p.arc || Math.PI * 2
    );
  } else if (part.type === 'plane') {
    const p = part.params as PlaneParams;
    geometry = new THREE.PlaneGeometry(
      p.width,
      p.height,
      p.widthSegments || 1,
      p.heightSegments || 1
    );
  } else if (part.type === 'capsule') {
    const p = part.params as CapsuleParams;
    geometry = new THREE.CapsuleGeometry(
      p.radius,
      p.length,
      p.capSegments || 8,
      p.radialSegments || 16
    );
  } else {
    // Fallback
    geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  // Cache the geometry
  geometryCache.set(cacheKey, geometry);

  return geometry;
}

/**
 * Build a mesh from a geometry part definition
 */
function buildPartMesh(part: GeometryPart, colorOverride?: string): THREE.Mesh {
  const geometry = getGeometry(part);
  const material = colorOverride
    ? getMaterialWithColorOverride(part.material, colorOverride)
    : getMaterial(part.material);

  const mesh = new THREE.Mesh(geometry, material);

  // Apply position
  mesh.position.set(part.position[0], part.position[1], part.position[2]);

  // Apply scale if specified
  if (part.scale) {
    mesh.scale.set(part.scale[0], part.scale[1], part.scale[2]);
  }

  // Apply rotation if specified
  // Use quaternion for proper rotation composition without gimbal lock
  if (part.rotation) {
    // Create a quaternion from Euler angles for more stable rotation
    const euler = new THREE.Euler(part.rotation[0], part.rotation[1], part.rotation[2], 'XYZ');
    mesh.quaternion.setFromEuler(euler);
  }

  return mesh;
}

/**
 * Build a complete object from a base definition
 *
 * @param definition Base object definition
 * @param colorOverride Optional color override (hex string)
 * @param castShadow Whether meshes should cast shadows
 * @param receiveShadow Whether meshes should receive shadows
 * @returns THREE.Group containing all meshes
 */
export function buildObjectFromDefinition(
  definition: BaseObjectDefinition,
  colorOverride?: string,
  castShadow: boolean = true,
  receiveShadow: boolean = true
): THREE.Group {
  const group = new THREE.Group();
  group.name = definition.id;

  // Build all parts
  for (const part of definition.parts) {
    const mesh = buildPartMesh(part, colorOverride);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    group.add(mesh);
  }

  return group;
}

/**
 * Clone an existing object group (faster than rebuilding from definition)
 * This creates a new Group with the same structure but allows independent transforms
 *
 * @param sourceGroup Source group to clone
 * @returns Cloned group
 */
export function cloneObject(sourceGroup: THREE.Group): THREE.Group {
  // Clone the entire group (geometry and materials are shared via references)
  return sourceGroup.clone(false) as THREE.Group;
}

/**
 * Clear geometry cache and dispose all geometries
 */
export function clearGeometryCache(): void {
  geometryCache.forEach((geometry) => {
    geometry.dispose();
  });
  geometryCache.clear();
}

/**
 * Get geometry cache statistics
 */
export function getGeometryCacheStats(): {
  size: number;
  keys: string[];
} {
  return {
    size: geometryCache.size,
    keys: Array.from(geometryCache.keys()),
  };
}

/**
 * Dispose of an object group and clean up its resources
 * Note: This does NOT dispose shared geometries/materials from cache
 *
 * @param group Group to dispose
 */
export function disposeObject(group: THREE.Group): void {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Don't dispose geometry/material here as they're cached
      // Just remove the mesh from the scene
      child.geometry = null as any;
      child.material = null as any;
    }
  });

  group.clear();
}
