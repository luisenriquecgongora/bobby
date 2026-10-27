// @bobby/core/src/spatial/spatialTypes.ts
// Authoritative data contracts for 3D spatial operations, computational geometry,
// and venue layout validation matching the Python bobby-engine microservice.

export type ApertureType = 'DOOR' | 'WINDOW';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface EngineWallAperture {
  id: string;
  type: ApertureType;
  offset_along_wall: number; // in meters along wall centerline
  width: number; // in meters
  height: number; // in meters
  sill_height?: number; // in meters (0 for doors)
}

export interface EngineWallSegment {
  id: string;
  start: Vector3D; // in 3D world space (meters)
  end: Vector3D; // in 3D world space (meters)
  thickness?: number; // in meters (default 0.15m)
  height?: number; // in meters (default 3.0m)
  apertures?: EngineWallAperture[];
}

export interface EngineFixtureItem {
  id: string;
  name: string;
  model_type: string;
  position: Vector3D; // center position in 3D space (meters)
  rotation_y: number; // rotation in degrees around Y
  bounding_box: Vector3D; // dimensions in meters: x=width, y=height, z=depth
}

export interface EngineVenueLayout {
  venue_id: string;
  version?: string;
  walls: EngineWallSegment[];
  fixtures: EngineFixtureItem[];
}

export interface EngineCollisionContact {
  object_a: string;
  object_b: string;
  collision_type: 'FIXTURE_FIXTURE' | 'FIXTURE_WALL' | string;
  contact_point?: Vector3D | null;
  penetration_depth?: number | null;
}

export interface EngineValidationMetrics {
  fixture_count: number;
  wall_count: number;
  computation_time_ms: number;
  collision_engine: string;
  [key: string]: any;
}

export interface EngineValidationResult {
  is_valid: boolean;
  collisions: EngineCollisionContact[];
  clearance_warnings: string[];
  metrics: EngineValidationMetrics;
}

export interface EngineExtrudeWallsResponse {
  wall_count: number;
  aperture_count: number;
  total_vertices: number;
  total_faces: number;
  is_watertight: boolean;
  bounds: number[][];
}

export interface EngineHealthResponse {
  service: string;
  version: string;
  uptime_seconds: number;
  memory_mb: number;
  fcl_accelerated: boolean;
}
