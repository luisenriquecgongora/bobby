// packages/core/src/spatial/__tests__/spatialConverter.test.ts
import { describe, it, expect } from 'vitest';
import {
  toEngineVenueLayout,
  point2DToWorldVector,
  convertWallOpening,
  convertWallSegment,
  convertTableToFixture,
} from '../spatialConverter';
import { RoomDimensions, TableShape, TableCategory, WallSegment, WallOpening } from '../../types';

describe('spatialConverter', () => {
  const mockRoom: RoomDimensions = {
    width: 1000, // 10m
    depth: 800,  // 8m
    height: 300, // 3m
    unit: 'cm',
  };

  it('converts 2D room point to 3D world vector', () => {
    // Top-left corner (0, 0) in room -> (5, 0, 4) in world
    const vecTL = point2DToWorldVector([0, 0], mockRoom);
    expect(vecTL.x).toBeCloseTo(5.0, 2);
    expect(vecTL.y).toBe(0);
    expect(vecTL.z).toBeCloseTo(4.0, 2);

    // Center (500, 400) in room -> (0, 0, 0) in world
    const vecCenter = point2DToWorldVector([500, 400], mockRoom);
    expect(vecCenter.x).toBeCloseTo(0.0, 2);
    expect(vecCenter.z).toBeCloseTo(0.0, 2);
  });

  it('converts WallOpening to EngineWallAperture in meters', () => {
    const opening: WallOpening = {
      id: 'door_1',
      type: 'door',
      offset: 150, // 1.5m
      width: 90,   // 0.9m
      height: 210, // 2.1m
      elevation: 0,
    };
    const aperture = convertWallOpening(opening);
    expect(aperture.id).toBe('door_1');
    expect(aperture.type).toBe('DOOR');
    expect(aperture.offset_along_wall).toBe(1.5);
    expect(aperture.width).toBe(0.9);
    expect(aperture.height).toBe(2.1);
    expect(aperture.sill_height).toBe(0);
  });

  it('converts WallSegment to EngineWallSegment', () => {
    const wall: WallSegment = {
      id: 'wall_north',
      start: [100, 100],
      end: [900, 100],
      thickness: 20,
      height: 280,
      openings: [
        {
          id: 'win_1',
          type: 'window',
          offset: 200,
          width: 120,
          height: 100,
          elevation: 90,
        },
      ],
    };

    const engineWall = convertWallSegment(wall, mockRoom);
    expect(engineWall.id).toBe('wall_north');
    expect(engineWall.thickness).toBe(0.2);
    expect(engineWall.height).toBe(2.8);
    expect(engineWall.apertures).toHaveLength(1);
    expect(engineWall.apertures?.[0].type).toBe('WINDOW');
    expect(engineWall.apertures?.[0].sill_height).toBe(0.9);
  });

  it('converts table to EngineFixtureItem', () => {
    const table = {
      _id: 'tbl_1',
      name: 'VIP 1',
      shape: TableShape.RECTANGLE,
      category: TableCategory.VIP,
      position: { x: 500, y: 400, z: 0 },
      dimensions: { width: 200, depth: 100, height: 75 },
      rotation: 45,
    };

    const fixture = convertTableToFixture(table, mockRoom);
    expect(fixture.id).toBe('tbl_1');
    expect(fixture.name).toBe('VIP 1');
    expect(fixture.model_type).toBe('table_rectangle');
    expect(fixture.rotation_y).toBe(45);
    expect(fixture.bounding_box.x).toBe(2.0);
    expect(fixture.bounding_box.y).toBe(0.75);
    expect(fixture.bounding_box.z).toBe(1.0);
  });

  it('assembles a full EngineVenueLayout', () => {
    const layout = toEngineVenueLayout({
      venueId: 'v123',
      room: mockRoom,
      tables: [
        {
          _id: 't1',
          name: 'T1',
          position: { x: 200, y: 200 },
          dimensions: { width: 100, depth: 100, height: 75 },
          rotation: 0,
        },
      ],
      elements: [
        {
          _id: 'e1',
          name: 'Bar',
          type: 'bar_counter',
          position: { x: 800, y: 700 },
          dimensions: { width: 300, depth: 100, height: 110 },
          rotation: 90,
        },
      ],
      walls: [
        {
          id: 'w1',
          start: [0, 0],
          end: [1000, 0],
        },
      ],
    });

    expect(layout.venue_id).toBe('v123');
    expect(layout.fixtures).toHaveLength(2);
    expect(layout.walls).toHaveLength(1);
    expect(layout.fixtures[0].id).toBe('t1');
    expect(layout.fixtures[1].id).toBe('e1');
  });
});
