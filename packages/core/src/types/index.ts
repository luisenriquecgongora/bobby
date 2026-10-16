// @openvenue/core/src/types/index.ts
// Universal 3D venue, room, fixture, and primitive type definitions.

/**
 * Supported room element / fixture types
 */
export enum RoomElementType {
  TV = 'tv',
  CHAIR = 'chair',
  SOFA = 'sofa',
  OTTOMAN = 'ottoman',
  SEATING = 'seating',
  PLANT = 'plant',
  BAR_COUNTER = 'bar_counter',
  STAGE = 'stage',
  DJ_BOOTH = 'dj_booth',
  DOOR = 'door',
  WINDOW = 'window',
  COLUMN = 'column',
  DECORATION = 'decoration',
  RUG = 'rug',
  STAIRS = 'stairs',
  BATHROOM_FIXTURE = 'bathroom_fixture',
  AIR_CONDITIONER = 'air_conditioner',
  TECH_DEVICES = 'tech_devices',
  LIGHTING = 'lighting',
  BAR_EQUIPMENT = 'bar_equipment',
  BOTTLES = 'bottles',
  CUSTOM = 'custom',
}

/**
 * Table shapes supported in venues
 */
export enum TableShape {
  CIRCLE = 'circle',
  SQUARE = 'square',
  RECTANGLE = 'rectangle',
  CUSTOM = 'custom',
}

/**
 * Table categories / tiers
 */
export enum TableCategory {
  STANDARD = 'standard',
  VIP = 'vip',
  BAR = 'bar',
  BALCONY = 'balcony',
  BOOTH = 'booth',
  LOUNGE = 'lounge',
}

/**
 * PBR material configuration for procedural primitives
 */
export interface MaterialConfig {
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
}

export type GeometryPrimitiveType =
  | 'box'
  | 'cylinder'
  | 'sphere'
  | 'cone'
  | 'torus'
  | 'plane'
  | 'capsule';

export interface BoxParams {
  width: number;
  height: number;
  depth: number;
}

export interface CylinderParams {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments?: number;
}

export interface SphereParams {
  radius: number;
  widthSegments?: number;
  heightSegments?: number;
}

export interface ConeParams {
  radius: number;
  height: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
}

export interface TorusParams {
  radius: number;
  tubeRadius: number;
  radialSegments?: number;
  tubularSegments?: number;
  arc?: number;
}

export interface PlaneParams {
  width: number;
  height: number;
  widthSegments?: number;
  heightSegments?: number;
}

export interface CapsuleParams {
  radius: number;
  length: number;
  capSegments?: number;
  radialSegments?: number;
}

export type PrimitiveParams =
  | BoxParams
  | CylinderParams
  | SphereParams
  | ConeParams
  | TorusParams
  | PlaneParams
  | CapsuleParams;

/**
 * Single geometry part in a composite object
 */
export interface GeometryPart {
  type: GeometryPrimitiveType;
  position: [number, number, number]; // [x, y, z] in meters relative to group origin
  scale?: [number, number, number];
  rotation?: [number, number, number]; // radians
  material: MaterialConfig;
  params: PrimitiveParams;
}

/**
 * Base procedural object definition
 */
export interface BaseObjectDefinition {
  id: string;
  type: RoomElementType;
  name: string;
  description?: string;
  parts: GeometryPart[];
  defaultDimensions: [number, number, number]; // [width, depth, height] in meters
  supportsInstancing?: boolean;
}

/**
 * Custom geometry definition for user-created objects
 */
export interface CustomGeometry {
  parts: GeometryPart[];
  baseColor?: string;
  version: string;
}

// ==========================================
// Wall System Types
// ==========================================

export enum WallType {
  SOLID = 'solid',
  GLASS = 'glass',
  HALF_WALL = 'half_wall',
  NONE = 'none',
}

export enum WallMaterialType {
  PAINT = 'paint',
  TILE = 'tile',
  WOOD = 'wood',
  METAL = 'metal',
  GLASS = 'glass',
  BRICK = 'brick',
  EXPOSED_BRICK = 'exposed_brick',
  STONE = 'stone',
  MIRROR = 'mirror',
  CONCRETE = 'concrete',
}

export enum WallFinish {
  MATTE = 'matte',
  SATIN = 'satin',
  GLOSSY = 'glossy',
  TEXTURED = 'textured',
  REFLECTIVE = 'reflective',
}

export enum WallSide {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
}

export interface WallMaterial {
  type: WallMaterialType;
  finish: WallFinish;
  color: string;
  opacity?: number;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface Wall {
  _id?: string;
  side: WallSide;
  visible: boolean;
  type: WallType;
  material: WallMaterial;
  height?: number; // meters
  thickness?: number; // meters
}

export const DEFAULT_WALL_MATERIAL: WallMaterial = {
  type: WallMaterialType.PAINT,
  finish: WallFinish.MATTE,
  color: '#F5F5F5',
  opacity: 1,
  metalness: 0,
  roughness: 0.8,
};

export function createDefaultWalls(): Wall[] {
  return [
    { side: WallSide.NORTH, visible: true, type: WallType.SOLID, material: { ...DEFAULT_WALL_MATERIAL }, thickness: 0.15 },
    { side: WallSide.SOUTH, visible: true, type: WallType.SOLID, material: { ...DEFAULT_WALL_MATERIAL }, thickness: 0.15 },
    { side: WallSide.EAST, visible: true, type: WallType.SOLID, material: { ...DEFAULT_WALL_MATERIAL }, thickness: 0.15 },
    { side: WallSide.WEST, visible: true, type: WallType.SOLID, material: { ...DEFAULT_WALL_MATERIAL }, thickness: 0.15 },
  ];
}

export interface WallOpening {
  id: string;
  type: 'door' | 'window';
  offset: number; // distance in cm from start point
  width: number; // opening width in cm
  height: number; // opening height in cm
  elevation: number; // bottom sill height in cm (0 for doors)
}

export interface WallSegment {
  id: string;
  start: [number, number]; // [x, y] in cm (room coordinates)
  end: [number, number]; // [x, y] in cm (room coordinates)
  thickness?: number; // thickness in cm (default 15cm)
  height?: number; // height in cm (default 300cm)
  material?: WallMaterial;
  openings?: WallOpening[];
}

// ==========================================
// Floor Material Types
// ==========================================

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
  | 'diagonal-grid';

export interface FloorPatternConfig {
  primaryColor: string;
  secondaryColor?: string;
  groutColor?: string;
  tileSize?: number; // cm
  plankWidth?: number; // cm
  plankLength?: number; // cm
  variation?: number;
}

export interface FloorMaterial {
  type: 'color' | 'texture' | 'procedural' | 'solid' | 'wood' | 'tile' | 'concrete' | 'marble' | 'carpet';
  color?: string;
  textureURL?: string;
  normalMapURL?: string;
  roughnessMapURL?: string;
  metalness?: number;
  roughness?: number;
  scale?: number;
  rotation?: number;
  pattern?: FloorPattern;
  patternConfig?: FloorPatternConfig;
}

// ==========================================
// Room Dimensions & Positions
// ==========================================

export interface RoomDimensions {
  width: number; // cm
  depth: number; // cm
  height: number; // cm
  unit: 'cm' | 'inches' | 'm';
}

export interface Position2D {
  x: number; // cm
  y: number; // cm
  z?: number; // elevation in cm
}

export interface Dimensions3D {
  width: number; // cm
  depth: number; // cm
  height: number; // cm
}
