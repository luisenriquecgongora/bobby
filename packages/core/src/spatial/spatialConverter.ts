// @bobby/core/src/spatial/spatialConverter.ts
// Mathematical converters between Bobby 2D/3D client objects and authoritative bobby-engine contracts.

import {
  RoomDimensions,
  WallSegment,
  WallOpening,
} from '../types/index';
import {
  cmToMeters,
  roomCoordsToWorld3D,
} from '../coordinates/coordinateConverter';
import {
  EngineVenueLayout,
  EngineFixtureItem,
  EngineWallSegment,
  EngineWallAperture,
  Vector3D,
} from './spatialTypes';

export interface SpatialConversionParams {
  venueId?: string;
  room: RoomDimensions;
  tables: Array<{
    _id: string;
    name: string;
    shape?: string;
    category?: string;
    position: { x: number; y: number; z?: number };
    dimensions: { width: number; depth: number; height: number };
    rotation: number;
    [key: string]: any;
  }>;
  elements: Array<{
    _id: string;
    name: string;
    type?: string;
    position: { x: number; y: number; z?: number };
    dimensions: { width: number; depth: number; height?: number };
    rotation: number;
    [key: string]: any;
  }>;
  walls?: WallSegment[];
}

/**
 * Converts a 2D room position in cm to 3D world Vector3D in meters.
 */
export function point2DToWorldVector(
  pointCm: [number, number],
  room: RoomDimensions,
  elevationM: number = 0
): Vector3D {
  const worldPos = roomCoordsToWorld3D(
    { x: pointCm[0], y: pointCm[1], z: 0 },
    { width: 0, depth: 0, height: 0 },
    { width: room.width, depth: room.depth },
    true
  );
  return {
    x: Number(worldPos[0].toFixed(4)),
    y: Number(elevationM.toFixed(4)),
    z: Number(worldPos[2].toFixed(4)),
  };
}

/**
 * Converts client WallOpening objects into EngineWallAperture specifications (meters).
 */
export function convertWallOpening(opening: WallOpening): EngineWallAperture {
  return {
    id: opening.id,
    type: opening.type === 'door' ? 'DOOR' : 'WINDOW',
    offset_along_wall: Number(cmToMeters(opening.offset).toFixed(4)),
    width: Number(cmToMeters(opening.width).toFixed(4)),
    height: Number(cmToMeters(opening.height).toFixed(4)),
    sill_height: Number(cmToMeters(opening.elevation || 0).toFixed(4)),
  };
}

/**
 * Converts a client WallSegment (cm room coords) to an EngineWallSegment (meters 3D world).
 */
export function convertWallSegment(
  wall: WallSegment,
  room: RoomDimensions
): EngineWallSegment {
  const startVec = point2DToWorldVector(wall.start, room, 0);
  const endVec = point2DToWorldVector(wall.end, room, 0);

  const thicknessM = cmToMeters(wall.thickness || 15);
  const heightM = cmToMeters(wall.height || 300);

  const apertures = (wall.openings || []).map(convertWallOpening);

  return {
    id: wall.id,
    start: startVec,
    end: endVec,
    thickness: Number(thicknessM.toFixed(4)),
    height: Number(heightM.toFixed(4)),
    apertures,
  };
}

/**
 * Converts a client table or room element into an EngineFixtureItem.
 */
export function convertTableToFixture(
  table: SpatialConversionParams['tables'][number],
  room: RoomDimensions
): EngineFixtureItem {
  const worldPos = roomCoordsToWorld3D(
    table.position,
    table.dimensions,
    { width: room.width, depth: room.depth },
    table.shape === 'custom'
  );

  return {
    id: table._id,
    name: table.name || `Table ${table._id}`,
    model_type: table.shape ? `table_${table.shape}` : 'table',
    position: {
      x: Number(worldPos[0].toFixed(4)),
      y: Number(worldPos[1].toFixed(4)),
      z: Number(worldPos[2].toFixed(4)),
    },
    rotation_y: table.rotation || 0,
    bounding_box: {
      x: Number(cmToMeters(table.dimensions.width).toFixed(4)),
      y: Number(cmToMeters(table.dimensions.height).toFixed(4)),
      z: Number(cmToMeters(table.dimensions.depth).toFixed(4)),
    },
  };
}

/**
 * Converts a client room element into an EngineFixtureItem.
 */
export function convertElementToFixture(
  element: SpatialConversionParams['elements'][number],
  room: RoomDimensions
): EngineFixtureItem {
  // Elements use direct elevation (bottom-origin)
  const worldPos = roomCoordsToWorld3D(
    element.position,
    element.dimensions,
    { width: room.width, depth: room.depth },
    true
  );

  // Position is at center of bounding box in 3D:
  const heightM = cmToMeters(element.dimensions.height ?? 100);
  const centerY = worldPos[1] + heightM / 2;

  return {
    id: element._id,
    name: element.name || `Fixture ${element._id}`,
    model_type: element.type || 'custom',
    position: {
      x: Number(worldPos[0].toFixed(4)),
      y: Number(centerY.toFixed(4)),
      z: Number(worldPos[2].toFixed(4)),
    },
    rotation_y: element.rotation || 0,
    bounding_box: {
      x: Number(cmToMeters(element.dimensions.width).toFixed(4)),
      y: Number(heightM.toFixed(4)),
      z: Number(cmToMeters(element.dimensions.depth).toFixed(4)),
    },
  };
}

/**
 * Assembles a complete EngineVenueLayout ready for transmission to bobby-engine.
 */
export function toEngineVenueLayout(params: SpatialConversionParams): EngineVenueLayout {
  const { venueId = 'venue_live', room, tables, elements, walls = [] } = params;

  const fixtures: EngineFixtureItem[] = [
    ...tables.map((t) => convertTableToFixture(t, room)),
    ...elements.map((e) => convertElementToFixture(e, room)),
  ];

  const engineWalls: EngineWallSegment[] = walls.map((w) => convertWallSegment(w, room));

  return {
    venue_id: venueId,
    version: '1.0.0',
    walls: engineWalls,
    fixtures,
  };
}
