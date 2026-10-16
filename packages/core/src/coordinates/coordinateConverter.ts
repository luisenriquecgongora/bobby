// @openvenue/core/src/coordinates/coordinateConverter.ts
// Mathematical coordinate system conversion utilities between 2D room units (cm) and 3D world units (meters).

/**
 * Convert centimeters to meters
 * @param cm Value in centimeters
 * @returns Value in meters
 */
export function cmToMeters(cm: number): number {
  return cm * 0.01;
}

/**
 * Convert meters to centimeters
 * @param meters Value in meters
 * @returns Value in centimeters
 */
export function metersToCm(meters: number): number {
  return meters * 100;
}

/**
 * Convert room coordinates (cm, top-left origin) to 3D world coordinates (meters, center origin)
 *
 * 2D Room Space: top-left corner (0, 0), Y goes downwards (front-back), units in cm.
 * 3D World Space: center origin (0, 0, 0), Y goes upwards (elevation), X & Z negated, units in meters.
 *
 * @param roomPos Position in room coordinates {x, y, z?} in cm (z is elevation)
 * @param objectDims Object dimensions {width, depth, height} in cm
 * @param roomDims Room dimensions {width, depth} in cm
 * @param useDirectElevation If true, use Z directly without adding height/2 (for custom bottom-origin geometry)
 * @returns World position [x, y, z] in meters with center origin
 */
export function roomCoordsToWorld3D(
  roomPos: { x: number; y: number; z?: number },
  objectDims: { width: number; depth: number; height?: number },
  roomDims: { width: number; depth: number },
  useDirectElevation: boolean = false
): [number, number, number] {
  const roomWidthM = cmToMeters(roomDims.width);
  const roomDepthM = cmToMeters(roomDims.depth);

  // Convert position to meters and adjust to object center
  const posXM = cmToMeters(roomPos.x) + cmToMeters(objectDims.width) / 2;
  const posYM = cmToMeters(roomPos.y) + cmToMeters(objectDims.depth) / 2;

  // Convert from top-left origin to center origin
  // Negate X to flip left-right orientation to match 2D view
  const worldX = -(posXM - roomWidthM / 2);
  const worldZ = posYM - roomDepthM / 2;

  // Y position calculation:
  // - Custom geometry (useDirectElevation=true):
  //   Lowest point is Y=0 in local space, so group origin is at the BOTTOM.
  // - Standard elements (useDirectElevation=false):
  //   Center-origin geometry, so we add height/2 to center the object at the desired elevation.
  let worldY: number;
  const zCm = roomPos.z !== undefined && roomPos.z !== null ? roomPos.z : 0;

  if (useDirectElevation) {
    worldY = cmToMeters(zCm);
  } else {
    worldY = cmToMeters(zCm) + cmToMeters(objectDims.height ?? 0) / 2;
  }

  // Negate Z for front/back orientation
  return [worldX, worldY, -worldZ];
}

/**
 * Convert 3D world coordinates back to room coordinates
 *
 * @param worldPos World position [x, y, z] in meters
 * @param objectDims Object dimensions {width, depth, height} in cm
 * @param roomDims Room dimensions {width, depth} in cm
 * @returns Room position {x, y} in cm (top-left origin)
 */
export function world3DToRoomCoords(
  worldPos: [number, number, number],
  objectDims: { width: number; depth: number; height?: number },
  roomDims: { width: number; depth: number }
): { x: number; y: number } {
  const [worldX, , worldZ] = worldPos;
  const roomWidthM = cmToMeters(roomDims.width);
  const roomDepthM = cmToMeters(roomDims.depth);

  // Reverse the conversion
  const posXM = -(worldX - roomWidthM / 2);
  const posYM = -worldZ + roomDepthM / 2;

  // Convert to cm and adjust from center to top-left
  const roomX = metersToCm(posXM) - objectDims.width / 2;
  const roomY = metersToCm(posYM) - objectDims.depth / 2;

  return { x: roomX, y: roomY };
}

/**
 * Calculate scale factors to transform default dimensions to actual dimensions
 *
 * @param actualDims Actual object dimensions in cm
 * @param defaultDims Default object dimensions in cm (from base definition)
 * @returns Scale factors {x, y, z}
 */
export function scaleDimensions(
  actualDims: { width: number; depth: number; height: number },
  defaultDims: { width: number; depth: number; height: number }
): { x: number; y: number; z: number } {
  return {
    x: actualDims.width / defaultDims.width,
    y: actualDims.height / defaultDims.height,
    z: actualDims.depth / defaultDims.depth,
  };
}

/**
 * Convert rotation from degrees (0-359) to radians
 *
 * @param degrees Rotation in degrees
 * @returns Rotation in radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert rotation from radians to degrees (0-359)
 *
 * @param radians Rotation in radians
 * @returns Rotation in degrees (normalized to 0-359)
 */
export function radiansToDegrees(radians: number): number {
  let degrees = (radians * 180) / Math.PI;
  while (degrees < 0) degrees += 360;
  while (degrees >= 360) degrees -= 360;
  return degrees;
}
