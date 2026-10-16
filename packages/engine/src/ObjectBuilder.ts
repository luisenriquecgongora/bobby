// @takient/core/src/3d/ObjectBuilder.ts
// Main API for creating 3D room objects from RoomElement data

import * as THREE from 'three';
import {
  RoomElementType,
  CustomGeometry,
  cmToMeters,
  roomCoordsToWorld3D,
  degreesToRadians,
  scaleDimensions
} from '@openvenue/core';
import { getBaseDefinition } from './baseDefinitions';
import { buildObjectFromDefinition } from './geometryBuilder';

/**
 * Room element interface (matches backend RoomElement model)
 */
export interface RoomElement {
  _id: string;
  name: string;
  roomId?: string;
  type: RoomElementType;
  position: { x: number; y: number; z?: number }; // in cm, z is elevation
  dimensions: { width: number; depth: number; height?: number }; // in cm
  rotation: number; // degrees
  color?: string; // hex color override
  description?: string;
  customGeometry?: CustomGeometry; // For CUSTOM type elements
}

/**
 * Room dimensions interface
 */
export interface RoomDimensions {
  width: number; // in cm
  depth: number; // in cm
  height?: number; // in cm
  unit: 'cm' | 'm' | 'ft' | string;
  floorMaterial?: any; // FloorMaterial from floorMaterialTypes
  walls?: any[]; // Wall from types.ts
}

/**
 * Options for object creation
 */
export interface CreateObjectOptions {
  castShadow?: boolean;
  receiveShadow?: boolean;
}

/**
 * Create a single 3D object from a RoomElement
 *
 * @param element Room element data from backend
 * @param roomDimensions Room dimensions
 * @param options Creation options
 * @returns THREE.Group positioned and scaled correctly
 */
export function createRoomObject(
  element: RoomElement,
  roomDimensions: RoomDimensions,
  options: CreateObjectOptions = {}
): THREE.Group {
  const {
    castShadow = true,
    receiveShadow = true,
  } = options;

  let objectGroup: THREE.Group;
  let defaultDimsM: { width: number; depth: number; height: number };

  // Handle CUSTOM type elements
  console.log('[ObjectBuilder] Processing element:', {
    id: element._id,
    type: element.type,
    hasCustomGeometry: !!element.customGeometry,
    partsCount: element.customGeometry?.parts?.length || 0,
    color: element.color
  });

  if (element.type === RoomElementType.CUSTOM) {
    if (!element.customGeometry || !element.customGeometry.parts) {
      console.warn(`CUSTOM element ${element._id} missing customGeometry data`);
      return new THREE.Group();
    }

    console.log('[ObjectBuilder] Building CUSTOM element with', element.customGeometry.parts.length, 'parts - NO color override');
    console.log('[ObjectBuilder] Parts data:', element.customGeometry.parts.map((part: any, i: number) => ({
      index: i,
      type: part.type,
      materialColor: part.material?.color,
      hasPosition: !!part.position,
      hasScale: !!part.scale
    })));

    // Build object from custom geometry parts
    const customDefinition = {
      id: element._id,
      type: RoomElementType.CUSTOM,
      name: element.name,
      description: element.description,
      parts: element.customGeometry.parts,
      defaultDimensions: [
        cmToMeters(element.dimensions.width),
        cmToMeters(element.dimensions.depth),
        cmToMeters(element.dimensions.height ?? 0),
      ] as [number, number, number],
      supportsInstancing: false,
    };

    // For custom objects, don't pass colorOverride so each primitive keeps its own color
    // element.color is the baseColor and should not override individual primitive colors
    objectGroup = buildObjectFromDefinition(
      customDefinition,
      undefined, // Don't override - use each part's material color
      castShadow,
      receiveShadow
    );

    // For custom objects, no scaling needed - dimensions already match
    defaultDimsM = {
      width: cmToMeters(element.dimensions.width),
      depth: cmToMeters(element.dimensions.depth),
      height: cmToMeters(element.dimensions.height ?? 0),
    };
  } else {
    // Handle standard pre-defined element types
    console.log('[ObjectBuilder] Building STANDARD element type:', element.type, 'with color override:', element.color);

    const definition = getBaseDefinition(element.type);

    if (!definition) {
      console.warn(`No base definition found for element type: ${element.type}`);
      return new THREE.Group();
    }

    // Build the object from definition
    objectGroup = buildObjectFromDefinition(
      definition,
      element.color, // Color override
      castShadow,
      receiveShadow
    );

    // Calculate scale factors
    // Base definitions use meters, backend uses cm
    defaultDimsM = {
      width: definition.defaultDimensions[0],
      depth: definition.defaultDimensions[1],
      height: definition.defaultDimensions[2],
    };

    const actualDimsCm = element.dimensions;
    const actualDimsM = {
      width: cmToMeters(actualDimsCm.width),
      depth: cmToMeters(actualDimsCm.depth),
      height: cmToMeters(actualDimsCm.height),
    };

    const scale = scaleDimensions(actualDimsM, defaultDimsM);

    // Apply scale
    objectGroup.scale.set(scale.x, scale.y, scale.z);
  }

  // Calculate world position
  let worldX: number, worldY: number, worldZ: number;

  // Convert position for all element types using unified coordinate converter
  // IMPORTANT DISTINCTION:
  // - Custom geometry (CUSTOM type): After ground normalization, the object's
  //   lowest point is at Y=0 in local space. The group origin is at the BOTTOM.
  //   We use direct elevation (no height offset) so the bottom sits at the specified Z.
  // - Lighting elements (LIGHTING type): Ground-mounted (neon strips, LED strips),
  //   use direct elevation so scaling doesn't affect vertical position.
  // - Standard elements (TV, CHAIR, etc.): Geometry is center-origin.
  //   We add height/2 to position the center at the specified Z elevation.
  const useDirectElevation = element.type === RoomElementType.CUSTOM || element.type === RoomElementType.LIGHTING;

  // Ensure position.z defaults to 0 if not provided
  const positionWithDefaults = {
    x: element.position.x,
    y: element.position.y,
    z: element.position.z !== undefined && element.position.z !== null ? element.position.z : 0
  };

  console.log('[ObjectBuilder] Placing element:', {
    id: element._id,
    type: element.type,
    position: positionWithDefaults,
    dimensions: element.dimensions,
    useDirectElevation
  });

  const worldPos = roomCoordsToWorld3D(
    positionWithDefaults,
    element.dimensions,
    { width: roomDimensions.width, depth: roomDimensions.depth },
    useDirectElevation
  );
  worldX = worldPos[0];
  worldY = worldPos[1];
  worldZ = worldPos[2];

  console.log('[ObjectBuilder] World position:', { worldX, worldY, worldZ });

  // Apply position
  objectGroup.position.set(worldX, worldY, worldZ);

  // Apply rotation (Y-axis rotation for horizontal plane)
  const rotationRad = degreesToRadians(element.rotation);
  objectGroup.rotation.y = rotationRad;

  // Store metadata
  objectGroup.userData = {
    elementId: element._id,
    elementName: element.name,
    elementType: element.type,
  };

  return objectGroup;
}

/**
 * Create multiple room objects from an array of RoomElements
 *
 * @param elements Array of room elements
 * @param roomDimensions Room dimensions
 * @param options Creation options
 * @returns Array of THREE.Group objects
 */
export function createRoomObjects(
  elements: RoomElement[],
  roomDimensions: RoomDimensions,
  options: CreateObjectOptions = {}
): THREE.Group[] {
  return elements.map(element => createRoomObject(element, roomDimensions, options));
}

/**
 * Object Builder class for managing room object creation
 * Provides a stateful API for batch operations and caching
 */
export class ObjectBuilder {
  private roomDimensions: RoomDimensions;
  private objects: Map<string, THREE.Group> = new Map();
  private options: CreateObjectOptions;

  constructor(roomDimensions: RoomDimensions, options: CreateObjectOptions = {}) {
    this.roomDimensions = roomDimensions;
    this.options = options;
  }

  /**
   * Create a single object and track it
   */
  public create(element: RoomElement): THREE.Group {
    const object = createRoomObject(element, this.roomDimensions, this.options);
    this.objects.set(element._id, object);
    return object;
  }

  /**
   * Create multiple objects
   */
  public createMany(elements: RoomElement[]): THREE.Group[] {
    return elements.map(element => this.create(element));
  }

  /**
   * Get a specific object by element ID
   */
  public get(elementId: string): THREE.Group | undefined {
    return this.objects.get(elementId);
  }

  /**
   * Get all created objects
   */
  public getAll(): THREE.Group[] {
    return Array.from(this.objects.values());
  }

  /**
   * Remove and dispose an object
   */
  public remove(elementId: string): void {
    const object = this.objects.get(elementId);
    if (object) {
      // Clear the object
      object.clear();
      this.objects.delete(elementId);
    }
  }

  /**
   * Clear all objects
   */
  public clear(): void {
    this.objects.forEach(object => {
      object.clear();
    });
    this.objects.clear();
  }

  /**
   * Update object position
   */
  public updatePosition(elementId: string, newPosition: { x: number; y: number }): void {
    const object = this.objects.get(elementId);
    if (!object) return;

    const element = object.userData as { elementType: RoomElementType };
    const definition = getBaseDefinition(element.elementType);
    if (!definition) return;

    // Get dimensions from object scale
    const scale = object.scale;
    const actualDimsCm = {
      width: scale.x * definition.defaultDimensions[0] * 100,
      depth: scale.z * definition.defaultDimensions[1] * 100,
      height: scale.y * definition.defaultDimensions[2] * 100,
    };

    const worldPos = roomCoordsToWorld3D(
      newPosition,
      actualDimsCm,
      { width: this.roomDimensions.width, depth: this.roomDimensions.depth }
    );

    object.position.set(worldPos[0], worldPos[1], worldPos[2]);
  }

  /**
   * Update object rotation
   */
  public updateRotation(elementId: string, newRotationDeg: number): void {
    const object = this.objects.get(elementId);
    if (!object) return;

    const rotationRad = degreesToRadians(newRotationDeg);
    object.rotation.y = rotationRad;
  }

  /**
   * Get statistics
   */
  public getStats(): { count: number; types: Record<string, number> } {
    const types: Record<string, number> = {};

    this.objects.forEach(object => {
      const elementType = object.userData.elementType as string;
      types[elementType] = (types[elementType] || 0) + 1;
    });

    return {
      count: this.objects.size,
      types,
    };
  }
}
