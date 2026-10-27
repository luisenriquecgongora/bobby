import { describe, it, expect } from 'vitest';
import {
  cmToMeters,
  metersToCm,
  roomCoordsToWorld3D,
  world3DToRoomCoords,
  degreesToRadians,
  radiansToDegrees,
} from '../coordinateConverter';

describe('Coordinate Converter Math', () => {
  describe('Unit Conversions', () => {
    it('converts centimeters to meters correctly', () => {
      expect(cmToMeters(100)).toBe(1);
      expect(cmToMeters(150)).toBe(1.5);
      expect(cmToMeters(0)).toBe(0);
      expect(cmToMeters(-200)).toBe(-2);
    });

    it('converts meters to centimeters correctly', () => {
      expect(metersToCm(1)).toBe(100);
      expect(metersToCm(2.5)).toBe(250);
      expect(metersToCm(0)).toBe(0);
    });

    it('converts degrees to radians and back', () => {
      expect(degreesToRadians(0)).toBe(0);
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
    });
  });

  describe('2D Room to 3D World Transformation', () => {
    const roomDims = { width: 1000, depth: 1000 }; // 10m x 10m room
    const objectDims = { width: 100, depth: 100, height: 80 }; // 1m x 1m table, 0.8m high

    it('places an object at the center of the room at world origin (X=0, Z=0)', () => {
      // In a 1000x1000cm room, center of a 100x100 table is at room (450, 450)
      const roomPos = { x: 450, y: 450, z: 0 };
      const worldPos = roomCoordsToWorld3D(roomPos, objectDims, roomDims, false);

      expect(worldPos[0]).toBeCloseTo(0); // X = 0 (centered)
      expect(worldPos[2]).toBeCloseTo(0); // Z = 0 (centered)
      expect(worldPos[1]).toBeCloseTo(0.4); // Y = height / 2 = 0.4m
    });

    it('respects direct elevation for bottom-origin custom geometries', () => {
      const roomPos = { x: 450, y: 450, z: 50 }; // elevated by 50cm
      const worldPos = roomCoordsToWorld3D(roomPos, objectDims, roomDims, true);

      expect(worldPos[1]).toBeCloseTo(0.5); // 50cm = 0.5m directly
    });

    it('accurately transforms room coordinates to 3D world and back (Round Trip)', () => {
      const originalPos = { x: 250, y: 700 };
      const worldPos = roomCoordsToWorld3D(originalPos, objectDims, roomDims, false);
      const reconstructed = world3DToRoomCoords(worldPos, objectDims, roomDims);

      expect(reconstructed.x).toBeCloseTo(originalPos.x);
      expect(reconstructed.y).toBeCloseTo(originalPos.y);
    });
  });
});
