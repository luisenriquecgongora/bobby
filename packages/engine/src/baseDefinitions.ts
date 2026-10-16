// @takient/core/src/3d/baseDefinitions.ts
// 3D Geometry Object Builder - Base Object Definitions Library

import { BaseObjectDefinition, RoomElementType } from '@openvenue/core';

/**
 * Library of base object definitions
 * Each definition describes how to build a furniture/element using primitive geometries
 */

/**
 * TV SCREEN SIZE STANDARDS
 * Based on common market sizes with accurate aspect ratios (16:9)
 * Dimensions: [width (m), depth (m), height (m)]
 * Formula: width = diagonal × 0.872, height = diagonal × 0.490 (16:9 aspect ratio)
 * Stand dimensions scale proportionally with screen size
 */

/**
 * 32" TV (32 inch / 81 cm diagonal)
 * Dimensions: 73cm (width) × 7cm (depth) × 43cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_32_INCH: BaseObjectDefinition = {
  id: 'tv_32_inch',
  type: RoomElementType.TV,
  name: '32" Wall-Mounted TV',
  description: '32" (81cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [0.73, 0.07, 0.43], // [width, depth, height] in meters
  supportsInstancing: true,
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===
    // Note: All Y positions shifted down by height/2 (0.215m) so base is at Y=0

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0.215, 0.035], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 0.68, height: 0.40, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.405, 0.035], // Near top
      scale: [1, 1, 1],
      params: { width: 0.68, height: 0.04, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.17, 0.265, 0.035], // Left side, mid-upper
      scale: [1, 1, 1],
      params: { width: 0.3, height: 0.25, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.17, 0.165, 0.035], // Right side, mid-lower
      scale: [1, 1, 1],
      params: { width: 0.3, height: 0.2, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0.215, 0.03], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 0.73, height: 0.43, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0.215, -0.015], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 0.72, height: 0.42, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0.215, -0.055], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 0.4, height: 0.03, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [-0.15, 0.215, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.03, height: 0.08, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [0.15, 0.215, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.03, height: 0.08, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * 40" TV (40 inch / 101 cm diagonal)
 * Dimensions: 89cm (width) � 7cm (depth) � 52cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_40_INCH: BaseObjectDefinition = {
  id: 'tv_40_inch',
  type: RoomElementType.TV,
  name: '40" Wall-Mounted TV',
  description: '40" (101cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [0.89, 0.07, 0.52], // [width, depth, height] in meters
  supportsInstancing: true,
  // Note: All Y positions shifted down by height/2 (0.26m) so base is at Y=0
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0.26, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 0.828, height: 0.484, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.502, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 0.828, height: 0.036, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.214, 0.302, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.311, height: 0.234, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.214, 0.218, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.311, height: 0.182, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0.26, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 0.89, height: 0.52, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0.26, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 0.863, height: 0.504, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0.26, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.445, height: 0.026, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.178, 0.26, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.036, height: 0.062, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.178, 0.26, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.036, height: 0.062, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 43" TV (43 inch / 109 cm diagonal)
 * Dimensions: 96cm (width) � 7cm (depth) � 56cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_43_INCH: BaseObjectDefinition = {
  id: 'tv_43_inch',
  type: RoomElementType.TV,
  name: '43" Wall-Mounted TV',
  description: '43" (109cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [0.96, 0.07, 0.56], // [width, depth, height] in meters
  supportsInstancing: true,
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 0.893, height: 0.521, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.26, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 0.893, height: 0.039, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.23, 0.045, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.336, height: 0.252, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.23, -0.045, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.336, height: 0.196, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 0.96, height: 0.56, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 0.931, height: 0.543, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.48, height: 0.028, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.192, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.038, height: 0.067, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.192, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.038, height: 0.067, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 50" TV (50 inch / 127 cm diagonal)
 * Dimensions: 111cm (width) � 7cm (depth) � 64cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_50_INCH: BaseObjectDefinition = {
  id: 'tv_50_inch',
  type: RoomElementType.TV,
  name: '50" Wall-Mounted TV',
  description: '50" (127cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.11, 0.07, 0.64], // [width, depth, height] in meters
  supportsInstancing: true,
  // Note: All Y positions shifted down by height/2 (0.32m) so base is at Y=0
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0.32, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 1.032, height: 0.595, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.618, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 1.032, height: 0.045, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.266, 0.371, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.389, height: 0.288, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.266, 0.269, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.389, height: 0.224, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0.32, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 1.11, height: 0.64, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0.32, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 1.077, height: 0.621, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0.32, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.555, height: 0.032, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.222, 0.32, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.044, height: 0.077, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.222, 0.32, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.044, height: 0.077, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 55" TV (55 inch / 139 cm diagonal)
 * Dimensions: 122cm (width) � 7cm (depth) � 71cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_55_INCH: BaseObjectDefinition = {
  id: 'tv_55_inch',
  type: RoomElementType.TV,
  name: '55" Wall-Mounted TV',
  description: '55" (139cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.22, 0.07, 0.71], // [width, depth, height] in meters
  supportsInstancing: true,
  // Note: All Y positions shifted down by height/2 (0.35m) so base is at Y=0
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0.35, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 1.135, height: 0.66, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.68, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 1.135, height: 0.05, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.293, 0.407, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.427, height: 0.32, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.293, 0.293, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.427, height: 0.248, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0.35, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 1.22, height: 0.71, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0.35, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 1.183, height: 0.689, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0.35, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.61, height: 0.035, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.244, 0.35, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.049, height: 0.085, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.244, 0.35, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.049, height: 0.085, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 65" TV (65 inch / 165 cm diagonal)
 * Dimensions: 144cm (width) � 7cm (depth) � 83cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_65_INCH: BaseObjectDefinition = {
  id: 'tv_65_inch',
  type: RoomElementType.TV,
  name: '65" Wall-Mounted TV',
  description: '65" (165cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.44, 0.07, 0.83], // [width, depth, height] in meters
  supportsInstancing: true,
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===
    // Note: All Y positions shifted down by height/2 (0.415m) so base is at Y=0

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0.415, 0.035], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 1.339, height: 0.772, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.801, 0.035], // Near top
      scale: [1, 1, 1],
      params: { width: 1.339, height: 0.058, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.346, 0.481, 0.035], // Left side, mid-upper
      scale: [1, 1, 1],
      params: { width: 0.504, height: 0.373, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.346, 0.349, 0.035], // Right side, mid-lower
      scale: [1, 1, 1],
      params: { width: 0.504, height: 0.29, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0.415, 0.03], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 1.44, height: 0.83, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0.415, -0.015], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 1.397, height: 0.805, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0.415, -0.055], // Center at mid-height
      scale: [1, 1, 1],
      params: { width: 0.72, height: 0.042, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.288, 0.415, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.058, height: 0.1, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.288, 0.415, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.058, height: 0.1, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 75" TV (75 inch / 190 cm diagonal)
 * Dimensions: 166cm (width) � 7cm (depth) � 96cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_75_INCH: BaseObjectDefinition = {
  id: 'tv_75_inch',
  type: RoomElementType.TV,
  name: '75" Wall-Mounted TV',
  description: '75" (190cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.66, 0.07, 0.96], // [width, depth, height] in meters
  supportsInstancing: true,
  // Note: All Y positions shifted down by height/2 (0.48m) so base is at Y=0
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0.48, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 1.544, height: 0.893, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.926, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 1.544, height: 0.067, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.398, 0.557, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.581, height: 0.432, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.398, 0.403, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.581, height: 0.336, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0.48, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 1.66, height: 0.96, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0.48, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 1.61, height: 0.931, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0.48, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.83, height: 0.048, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.332, 0.48, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.066, height: 0.115, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.332, 0.48, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.066, height: 0.115, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 77" TV (77 inch / 195 cm diagonal)
 * Dimensions: 171cm (width) � 7cm (depth) � 99cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_77_INCH: BaseObjectDefinition = {
  id: 'tv_77_inch',
  type: RoomElementType.TV,
  name: '77" Wall-Mounted TV',
  description: '77" (195cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.71, 0.07, 0.99], // [width, depth, height] in meters
  supportsInstancing: true,
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 1.59, height: 0.921, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.46, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 1.59, height: 0.069, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.41, 0.079, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.598, height: 0.446, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.41, -0.079, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.598, height: 0.346, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 1.71, height: 0.99, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 1.659, height: 0.96, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.855, height: 0.05, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.342, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.068, height: 0.119, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.342, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.068, height: 0.119, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 83" TV (83 inch / 210 cm diagonal)
 * Dimensions: 184cm (width) � 7cm (depth) � 106cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_83_INCH: BaseObjectDefinition = {
  id: 'tv_83_inch',
  type: RoomElementType.TV,
  name: '83" Wall-Mounted TV',
  description: '83" (210cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.84, 0.07, 1.06], // [width, depth, height] in meters
  supportsInstancing: true,
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 1.711, height: 0.986, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.493, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 1.711, height: 0.074, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.442, 0.085, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.644, height: 0.477, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.442, -0.085, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.644, height: 0.371, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 1.84, height: 1.06, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 1.785, height: 1.028, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.92, height: 0.053, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.368, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.074, height: 0.127, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.368, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.074, height: 0.127, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};


/**
 * 85" TV (85 inch / 215 cm diagonal)
 * Dimensions: 188cm (width) � 7cm (depth) � 109cm (height)
 * Wall-mounted with bracket, screen showing colorful content (always ON)
 * Three.js coordinates: X=width (horizontal), Y=height (vertical), Z=depth (from wall)
 */
export const TV_85_INCH: BaseObjectDefinition = {
  id: 'tv_85_inch',
  type: RoomElementType.TV,
  name: '85" Wall-Mounted TV',
  description: '85" (215cm) wall-mounted flat screen - always ON with colorful display',
  defaultDimensions: [1.88, 0.07, 1.09], // [width, depth, height] in meters
  supportsInstancing: true,
  parts: [
    // === SCREEN CONTENT (Multiple color zones simulating ON state) ===

    // Main screen area - bright blue (sky/background content)
    {
      type: 'box',
      position: [0, 0, 0.035], // Slightly forward from wall (Z-axis)
      scale: [1, 1, 1],
      params: { width: 1.748, height: 1.014, depth: 0.002 }, // Wide and tall, thin depth
      material: {
        color: '#2563eb', // Bright blue
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#2563eb',
        emissiveIntensity: 0.6, // Strong glow
      },
    },

    // Top UI bar (simulating app interface)
    {
      type: 'box',
      position: [0, 0.507, 0.035], // Top of screen (higher Y position)
      scale: [1, 1, 1],
      params: { width: 1.748, height: 0.076, depth: 0.002 },
      material: {
        color: '#1e293b', // Dark slate
        metalness: 0.2,
        roughness: 0.5,
        emissive: '#1e293b',
        emissiveIntensity: 0.3,
      },
    },

    // Content area 1 - teal accent (video/image content)
    {
      type: 'box',
      position: [-0.451, 0.087, 0.035], // Left side, slightly up
      scale: [1, 1, 1],
      params: { width: 0.658, height: 0.491, depth: 0.002 },
      material: {
        color: '#14b8a6', // Teal
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#14b8a6',
        emissiveIntensity: 0.5,
      },
    },

    // Content area 2 - purple accent
    {
      type: 'box',
      position: [0.451, -0.087, 0.035], // Right side, slightly down
      scale: [1, 1, 1],
      params: { width: 0.658, height: 0.382, depth: 0.002 },
      material: {
        color: '#a855f7', // Purple
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#a855f7',
        emissiveIntensity: 0.5,
      },
    },

    // === BEZEL / FRAME ===
    {
      type: 'box',
      position: [0, 0, 0.03], // At front of TV
      scale: [1, 1, 1],
      params: { width: 1.88, height: 1.09, depth: 0.01 }, // Full TV dimensions, thin frame
      material: {
        color: '#0f172a', // Very dark slate (modern thin bezel)
        metalness: 0.7,
        roughness: 0.3,
      },
    },

    // === TV BODY (behind screen) ===
    {
      type: 'box',
      position: [0, 0, -0.015], // Behind screen (negative Z)
      scale: [1, 1, 1],
      params: { width: 1.824, height: 1.057, depth: 0.05 },
      material: {
        color: '#1e293b', // Dark body
        metalness: 0.4,
        roughness: 0.6,
      },
    },

    // === WALL MOUNT BRACKET ===

    // Bracket - horizontal mount bar (behind TV)
    {
      type: 'box',
      position: [0, 0, -0.055], // Far behind TV body
      scale: [1, 1, 1],
      params: { width: 0.94, height: 0.055, depth: 0.02 },
      material: {
        color: '#475569', // Slate gray metal
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Bracket arms (left and right connecting to wall)
    {
      type: 'box',
      position: [0.376, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.075, height: 0.131, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    {
      type: 'box',
      position: [-0.376, 0, -0.04],
      scale: [1, 1, 1],
      params: { width: 0.075, height: 0.131, depth: 0.015 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};



/**
 * TV_WALL (kept for backward compatibility)
 * Original basic TV definition - same as 43" size
 */
export const TV_WALL: BaseObjectDefinition = {
  id: 'tv_wall_basic',
  type: RoomElementType.TV,
  name: 'Wall-Mounted TV',
  description: 'Flat screen TV with stand',
  defaultDimensions: [1.0, 0.1, 0.6], // 1m wide, 10cm deep, 60cm tall
  supportsInstancing: true,
  parts: [
    // Screen (main display)
    {
      type: 'box',
      position: [0, 0, 0],
      scale: [1, 1, 1],
      params: { width: 0.9, height: 0.05, depth: 0.5 },
      material: {
        color: '#1a1a1a',
        metalness: 0.8,
        roughness: 0.2,
        emissive: '#0a0a0a',
        emissiveIntensity: 0.1,
      },
    },
    // Frame
    {
      type: 'box',
      position: [0, -0.03, 0],
      scale: [1, 1, 1],
      params: { width: 0.95, height: 0.02, depth: 0.55 },
      material: {
        color: '#2a2a2a',
        metalness: 0.6,
        roughness: 0.4,
      },
    },
    // Stand base
    {
      type: 'box',
      position: [0, -0.3, 0],
      scale: [1, 1, 1],
      params: { width: 0.3, height: 0.02, depth: 0.2 },
      material: {
        color: '#3a3a3a',
        metalness: 0.5,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * Chair (Basic seat with backrest)
 * Composition: Seat (box) + Backrest (box) + 4 Legs (cylinders)
 */
export const CHAIR_BASIC: BaseObjectDefinition = {
  id: 'chair_basic',
  type: RoomElementType.CHAIR,
  name: 'Basic Chair',
  description: 'Simple chair with backrest and four legs',
  defaultDimensions: [0.5, 0.5, 0.9], // 50cm × 50cm × 90cm
  supportsInstancing: true,
  parts: [
    // Seat
    {
      type: 'box',
      position: [0, 0.45, 0],
      params: { width: 0.45, height: 0.05, depth: 0.45 },
      material: {
        color: '#6B7280',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Backrest
    {
      type: 'box',
      position: [0, 0.675, -0.2],
      params: { width: 0.45, height: 0.4, depth: 0.05 },
      material: {
        color: '#6B7280',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Leg - front left
    {
      type: 'cylinder',
      position: [-0.18, 0.225, 0.18],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.45, radialSegments: 8 },
      material: {
        color: '#4a4a4a',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg - front right
    {
      type: 'cylinder',
      position: [0.18, 0.225, 0.18],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.45, radialSegments: 8 },
      material: {
        color: '#4a4a4a',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg - back left
    {
      type: 'cylinder',
      position: [-0.18, 0.225, -0.18],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.45, radialSegments: 8 },
      material: {
        color: '#4a4a4a',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg - back right
    {
      type: 'cylinder',
      position: [0.18, 0.225, -0.18],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.45, radialSegments: 8 },
      material: {
        color: '#4a4a4a',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * Sofa (Multi-seat couch)
 * Composition: Main seat (box) + Backrest (box) + 2 Armrests (boxes)
 */
export const SOFA_BASIC: BaseObjectDefinition = {
  id: 'sofa_basic',
  type: RoomElementType.SOFA,
  name: 'Basic Sofa',
  description: 'Comfortable sofa with armrests',
  defaultDimensions: [2.0, 0.9, 0.85], // 2m wide, 90cm deep, 85cm tall
  supportsInstancing: true,
  parts: [
    // Main seat
    {
      type: 'box',
      position: [0, 0.35, 0],
      params: { width: 1.8, height: 0.15, depth: 0.7 },
      material: {
        color: '#EF4444',
        metalness: 0.05,
        roughness: 0.9,
      },
    },
    // Backrest
    {
      type: 'box',
      position: [0, 0.6, -0.3],
      params: { width: 1.8, height: 0.5, depth: 0.1 },
      material: {
        color: '#DC2626',
        metalness: 0.05,
        roughness: 0.9,
      },
    },
    // Armrest - left
    {
      type: 'box',
      position: [-0.85, 0.525, 0],
      params: { width: 0.1, height: 0.5, depth: 0.7 },
      material: {
        color: '#DC2626',
        metalness: 0.05,
        roughness: 0.9,
      },
    },
    // Armrest - right
    {
      type: 'box',
      position: [0.85, 0.525, 0],
      params: { width: 0.1, height: 0.5, depth: 0.7 },
      material: {
        color: '#DC2626',
        metalness: 0.05,
        roughness: 0.9,
      },
    },
    // Base/legs
    {
      type: 'box',
      position: [0, 0.1, 0],
      params: { width: 1.9, height: 0.2, depth: 0.8 },
      material: {
        color: '#991b1b',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
  ],
};

/**
 * Modern Black Leather Sofa
 * Style: Contemporary with boxy frame and sharp lines
 * Composition: Black faux leather upholstery with thick squared armrests
 * Features: Short cylindrical metal legs, firm cushions, sleek structured look
 * Dimensions: 2m wide, 90cm deep, 85cm tall
 */
export const SOFA_MODERN_BLACK: BaseObjectDefinition = {
  id: 'sofa_modern_black',
  type: RoomElementType.SOFA,
  name: 'Modern Black Leather Sofa',
  description: 'Contemporary black leather sofa with boxy frame and metal legs',
  defaultDimensions: [2.0, 0.9, 0.85], // 2m wide, 90cm deep, 85cm tall
  supportsInstancing: true,
  parts: [
    // Main seat cushion (firm, smooth)
    {
      type: 'box',
      position: [0, 0.325, 0], // Adjusted: 0.2 (leg height) + 0.05 (base height) + 0.075 (half cushion)
      params: { width: 1.85, height: 0.15, depth: 0.75 },
      material: {
        color: '#1C1C1C', // Black leather
        metalness: 0.2,
        roughness: 0.65, // Slight shine for leather
      },
    },

    // Seat base/frame under cushion
    {
      type: 'box',
      position: [0, 0.225, 0], // Adjusted: 0.2 (leg height) + 0.025 (half base height)
      params: { width: 1.9, height: 0.05, depth: 0.8 },
      material: {
        color: '#0A0A0A', // Very dark black
        metalness: 0.15,
        roughness: 0.7,
      },
    },

    // Backrest (straight, sharp lines)
    {
      type: 'box',
      position: [0, 0.575, -0.325], // Adjusted: from base at 0.225 + 0.35 (half backrest from base top)
      params: { width: 1.85, height: 0.55, depth: 0.15 },
      material: {
        color: '#1C1C1C',
        metalness: 0.2,
        roughness: 0.65,
      },
    },

    // Left armrest (thick, squared - same height as backrest)
    {
      type: 'box',
      position: [-0.9, 0.575, 0], // Adjusted to match backrest height
      params: { width: 0.2, height: 0.55, depth: 0.75 },
      material: {
        color: '#1C1C1C',
        metalness: 0.2,
        roughness: 0.65,
      },
    },

    // Left armrest top (cap)
    {
      type: 'box',
      position: [-0.9, 0.85, 0], // Adjusted: armrest center (0.575) + half armrest (0.275)
      params: { width: 0.2, height: 0.05, depth: 0.75 },
      material: {
        color: '#2A2A2A', // Slightly lighter for definition
        metalness: 0.25,
        roughness: 0.6,
      },
    },

    // Right armrest (thick, squared - same height as backrest)
    {
      type: 'box',
      position: [0.9, 0.575, 0], // Adjusted to match backrest height
      params: { width: 0.2, height: 0.55, depth: 0.75 },
      material: {
        color: '#1C1C1C',
        metalness: 0.2,
        roughness: 0.65,
      },
    },

    // Right armrest top (cap)
    {
      type: 'box',
      position: [0.9, 0.85, 0], // Adjusted: armrest center (0.575) + half armrest (0.275)
      params: { width: 0.2, height: 0.05, depth: 0.75 },
      material: {
        color: '#2A2A2A',
        metalness: 0.25,
        roughness: 0.6,
      },
    },

    // Metal leg - front left
    {
      type: 'cylinder',
      position: [-0.85, 0.1, 0.3],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.2, radialSegments: 16 },
      material: {
        color: '#C0C0C0', // Aluminum/steel
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Metal leg - front right
    {
      type: 'cylinder',
      position: [0.85, 0.1, 0.3],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.2, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Metal leg - back left
    {
      type: 'cylinder',
      position: [-0.85, 0.1, -0.3],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.2, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },

    // Metal leg - back right
    {
      type: 'cylinder',
      position: [0.85, 0.1, -0.3],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.2, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * Commercial Grade Cube Ottoman - Black Leather
 * Composition: Main body (cube) + Top cushion with tufting details + Base frame + Decorative buttons
 * Dimensions: 45cm × 45cm × 45cm - Commercial grade
 * Features: Tufted top, visible stitching, padded cushion, sturdy base
 */
export const OTTOMAN_CUBE_LEATHER: BaseObjectDefinition = {
  id: 'ottoman_cube_leather',
  type: RoomElementType.OTTOMAN,
  name: 'Cube Ottoman - Black Leather',
  description: 'Commercial grade cube ottoman with tufted leather finish',
  defaultDimensions: [0.45, 0.45, 0.45], // 45cm × 45cm × 45cm
  supportsInstancing: true,
  parts: [
    // Base frame (slightly smaller, gives definition)
    {
      type: 'box',
      position: [0, 0.04, 0],
      params: { width: 0.44, height: 0.08, depth: 0.44 },
      material: {
        color: '#1a1a1a', // Very dark, almost black
        metalness: 0.2,
        roughness: 0.7,
      },
    },

    // Main body/cushion base
    {
      type: 'box',
      position: [0, 0.225, 0],
      params: { width: 0.45, height: 0.37, depth: 0.45 },
      material: {
        color: '#2a2a2a', // Dark leather black
        metalness: 0.15,
        roughness: 0.8,
      },
    },

    // Top cushion surface (slightly raised for padded effect)
    {
      type: 'box',
      position: [0, 0.42, 0],
      params: { width: 0.43, height: 0.03, depth: 0.43 },
      material: {
        color: '#1f1f1f',
        metalness: 0.1,
        roughness: 0.85,
      },
    },

    // Tufted button - center
    {
      type: 'cylinder',
      position: [0, 0.435, 0],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.008, radialSegments: 16 },
      material: {
        color: '#0a0a0a',
        metalness: 0.3,
        roughness: 0.6,
      },
    },

    // Tufted button - top left
    {
      type: 'cylinder',
      position: [-0.12, 0.435, -0.12],
      params: { radiusTop: 0.012, radiusBottom: 0.012, height: 0.006, radialSegments: 16 },
      material: {
        color: '#0a0a0a',
        metalness: 0.3,
        roughness: 0.6,
      },
    },

    // Tufted button - top right
    {
      type: 'cylinder',
      position: [0.12, 0.435, -0.12],
      params: { radiusTop: 0.012, radiusBottom: 0.012, height: 0.006, radialSegments: 16 },
      material: {
        color: '#0a0a0a',
        metalness: 0.3,
        roughness: 0.6,
      },
    },

    // Tufted button - bottom left
    {
      type: 'cylinder',
      position: [-0.12, 0.435, 0.12],
      params: { radiusTop: 0.012, radiusBottom: 0.012, height: 0.006, radialSegments: 16 },
      material: {
        color: '#0a0a0a',
        metalness: 0.3,
        roughness: 0.6,
      },
    },

    // Tufted button - bottom right
    {
      type: 'cylinder',
      position: [0.12, 0.435, 0.12],
      params: { radiusTop: 0.012, radiusBottom: 0.012, height: 0.006, radialSegments: 16 },
      material: {
        color: '#0a0a0a',
        metalness: 0.3,
        roughness: 0.6,
      },
    },

    // Stitching detail - front vertical
    {
      type: 'box',
      position: [0, 0.225, 0.226],
      params: { width: 0.01, height: 0.35, depth: 0.002 },
      material: {
        color: '#3a3a3a',
        metalness: 0.05,
        roughness: 0.9,
      },
    },

    // Stitching detail - back vertical
    {
      type: 'box',
      position: [0, 0.225, -0.226],
      params: { width: 0.01, height: 0.35, depth: 0.002 },
      material: {
        color: '#3a3a3a',
        metalness: 0.05,
        roughness: 0.9,
      },
    },

    // Stitching detail - left vertical
    {
      type: 'box',
      position: [-0.226, 0.225, 0],
      params: { width: 0.002, height: 0.35, depth: 0.01 },
      material: {
        color: '#3a3a3a',
        metalness: 0.05,
        roughness: 0.9,
      },
    },

    // Stitching detail - right vertical
    {
      type: 'box',
      position: [0.226, 0.225, 0],
      params: { width: 0.002, height: 0.35, depth: 0.01 },
      material: {
        color: '#3a3a3a',
        metalness: 0.05,
        roughness: 0.9,
      },
    },

    // Corner piping - front left
    {
      type: 'cylinder',
      position: [-0.215, 0.08, 0.215],
      params: { radiusTop: 0.005, radiusBottom: 0.005, height: 0.08, radialSegments: 8 },
      material: {
        color: '#3a3a3a',
        metalness: 0.1,
        roughness: 0.8,
      },
    },

    // Corner piping - front right
    {
      type: 'cylinder',
      position: [0.215, 0.08, 0.215],
      params: { radiusTop: 0.005, radiusBottom: 0.005, height: 0.08, radialSegments: 8 },
      material: {
        color: '#3a3a3a',
        metalness: 0.1,
        roughness: 0.8,
      },
    },

    // Corner piping - back left
    {
      type: 'cylinder',
      position: [-0.215, 0.08, -0.215],
      params: { radiusTop: 0.005, radiusBottom: 0.005, height: 0.08, radialSegments: 8 },
      material: {
        color: '#3a3a3a',
        metalness: 0.1,
        roughness: 0.8,
      },
    },

    // Corner piping - back right
    {
      type: 'cylinder',
      position: [0.215, 0.08, -0.215],
      params: { radiusTop: 0.005, radiusBottom: 0.005, height: 0.08, radialSegments: 8 },
      material: {
        color: '#3a3a3a',
        metalness: 0.1,
        roughness: 0.8,
      },
    },

    // Bottom rubber feet - front left
    {
      type: 'cylinder',
      position: [-0.19, 0.015, 0.19],
      params: { radiusTop: 0.018, radiusBottom: 0.02, height: 0.03, radialSegments: 12 },
      material: {
        color: '#0f0f0f',
        metalness: 0,
        roughness: 0.95,
      },
    },

    // Bottom rubber feet - front right
    {
      type: 'cylinder',
      position: [0.19, 0.015, 0.19],
      params: { radiusTop: 0.018, radiusBottom: 0.02, height: 0.03, radialSegments: 12 },
      material: {
        color: '#0f0f0f',
        metalness: 0,
        roughness: 0.95,
      },
    },

    // Bottom rubber feet - back left
    {
      type: 'cylinder',
      position: [-0.19, 0.015, -0.19],
      params: { radiusTop: 0.018, radiusBottom: 0.02, height: 0.03, radialSegments: 12 },
      material: {
        color: '#0f0f0f',
        metalness: 0,
        roughness: 0.95,
      },
    },

    // Bottom rubber feet - back right
    {
      type: 'cylinder',
      position: [0.19, 0.015, -0.19],
      params: { radiusTop: 0.018, radiusBottom: 0.02, height: 0.03, radialSegments: 12 },
      material: {
        color: '#0f0f0f',
        metalness: 0,
        roughness: 0.95,
      },
    },
  ],
};

/**
 * Plant (Decorative potted plant)
 * Composition: Pot (cylinder) + Plant foliage (sphere)
 */
export const PLANT_POTTED: BaseObjectDefinition = {
  id: 'plant_potted',
  type: RoomElementType.PLANT,
  name: 'Potted Plant',
  description: 'Decorative plant in a pot',
  defaultDimensions: [0.4, 0.4, 1.2], // 40cm × 40cm × 120cm
  supportsInstancing: true,
  parts: [
    // Pot
    {
      type: 'cylinder',
      position: [0, 0.15, 0],
      params: { radiusTop: 0.18, radiusBottom: 0.15, height: 0.3, radialSegments: 16 },
      material: {
        color: '#92400E',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Foliage - lower
    {
      type: 'sphere',
      position: [0, 0.5, 0],
      params: { radius: 0.25, widthSegments: 12, heightSegments: 12 },
      material: {
        color: '#10B981',
        metalness: 0.0,
        roughness: 0.9,
      },
    },
    // Foliage - upper
    {
      type: 'sphere',
      position: [0, 0.8, 0],
      params: { radius: 0.2, widthSegments: 12, heightSegments: 12 },
      material: {
        color: '#059669',
        metalness: 0.0,
        roughness: 0.9,
      },
    },
  ],
};

/**
 * Bar Counter (Long service counter)
 * Composition: Countertop (box) + Base cabinet (box)
 */
export const BAR_COUNTER: BaseObjectDefinition = {
  id: 'bar_counter_basic',
  type: RoomElementType.BAR_COUNTER,
  name: 'Bar Counter',
  description: 'Service counter for bars',
  defaultDimensions: [3.0, 0.6, 1.1], // 3m wide, 60cm deep, 110cm tall
  supportsInstancing: false, // Usually only 1-2 per room
  parts: [
    // Countertop
    {
      type: 'box',
      position: [0, 1.05, 0],
      params: { width: 2.9, height: 0.05, depth: 0.55 },
      material: {
        color: '#8B5CF6',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#7C3AED',
        emissiveIntensity: 0.15,
      },
    },
    // Base cabinet
    {
      type: 'box',
      position: [0, 0.5, 0],
      params: { width: 2.8, height: 1.0, depth: 0.5 },
      material: {
        color: '#6D28D9',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * Stage Platform
 * Composition: Platform (box) + Raised edge (boxes)
 */
export const STAGE_PLATFORM: BaseObjectDefinition = {
  id: 'stage_platform',
  type: RoomElementType.STAGE,
  name: 'Stage Platform',
  description: 'Raised platform for performances',
  defaultDimensions: [4.0, 3.0, 0.5], // 4m wide, 3m deep, 50cm tall
  supportsInstancing: false,
  parts: [
    // Main platform
    {
      type: 'box',
      position: [0, 0.25, 0],
      params: { width: 3.9, height: 0.5, depth: 2.9 },
      material: {
        color: '#F59E0B',
        metalness: 0.4,
        roughness: 0.6,
        emissive: '#D97706',
        emissiveIntensity: 0.1,
      },
    },
    // Front edge
    {
      type: 'box',
      position: [0, 0.52, 1.45],
      params: { width: 4.0, height: 0.04, depth: 0.05 },
      material: {
        color: '#FBBF24',
        metalness: 0.8,
        roughness: 0.2,
        emissive: '#F59E0B',
        emissiveIntensity: 0.3,
      },
    },
  ],
};

/**
 * DJ Booth (Equipment station)
 * Composition: Main desk (box) + Equipment shelf (box) + Monitor stands (cylinders)
 */
export const DJ_BOOTH: BaseObjectDefinition = {
  id: 'dj_booth_basic',
  type: RoomElementType.DJ_BOOTH,
  name: 'DJ Booth',
  description: 'DJ equipment station',
  defaultDimensions: [2.0, 1.5, 1.2], // 2m wide, 1.5m deep, 1.2m tall
  supportsInstancing: false,
  parts: [
    // Main desk surface
    {
      type: 'box',
      position: [0, 1.0, 0],
      params: { width: 1.9, height: 0.05, depth: 1.4 },
      material: {
        color: '#EC4899',
        metalness: 0.6,
        roughness: 0.4,
        emissive: '#DB2777',
        emissiveIntensity: 0.2,
      },
    },
    // Equipment shelf
    {
      type: 'box',
      position: [0, 1.15, -0.5],
      params: { width: 1.5, height: 0.1, depth: 0.4 },
      material: {
        color: '#BE185D',
        metalness: 0.5,
        roughness: 0.5,
      },
    },
    // Base cabinet
    {
      type: 'box',
      position: [0, 0.5, 0],
      params: { width: 1.8, height: 1.0, depth: 1.3 },
      material: {
        color: '#9F1239',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Monitor stand - left
    {
      type: 'cylinder',
      position: [-0.5, 1.35, 0.3],
      params: { radiusTop: 0.05, radiusBottom: 0.08, height: 0.3, radialSegments: 16 },
      material: {
        color: '#1a1a1a',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Monitor stand - right
    {
      type: 'cylinder',
      position: [0.5, 1.35, 0.3],
      params: { radiusTop: 0.05, radiusBottom: 0.08, height: 0.3, radialSegments: 16 },
      material: {
        color: '#1a1a1a',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * Door
 * Composition: Door panel (box) + Handle (cylinder)
 */
export const DOOR_STANDARD: BaseObjectDefinition = {
  id: 'door_standard',
  type: RoomElementType.DOOR,
  name: 'Standard Door',
  description: 'Single door with handle',
  defaultDimensions: [0.9, 0.1, 2.1], // 90cm wide, 10cm deep, 210cm tall
  supportsInstancing: true,
  parts: [
    // Door panel
    {
      type: 'box',
      position: [0, 1.05, 0],
      params: { width: 0.85, height: 0.05, depth: 2.0 },
      material: {
        color: '#92400E',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Handle
    {
      type: 'cylinder',
      position: [0.35, 1.0, 0],
      rotation: [0, 0, Math.PI / 2],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.12, radialSegments: 8 },
      material: {
        color: '#D4A574',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * Rolling Shutter Door (Security Gate)
 * Composition: Horizontal slats stacked vertically + side rails + top housing
 * Style: Industrial, metallic galvanized steel finish
 * Features: Commercial/warehouse aesthetic, partially rolled appearance
 * Dimensions: 2.5m wide, 15cm deep, 2.5m tall
 */
export const DOOR_ROLLING_SHUTTER: BaseObjectDefinition = {
  id: 'door_rolling_shutter',
  type: RoomElementType.DOOR,
  name: 'Rolling Shutter Door',
  description: 'Industrial rolling security door with metal slats',
  defaultDimensions: [2.5, 0.15, 2.5], // 2.5m wide, 15cm deep, 2.5m tall
  supportsInstancing: true,
  parts: [
    // === TOP HOUSING (where door rolls up) ===
    {
      type: 'box',
      position: [0, 2.35, 0],
      params: { width: 2.5, height: 0.3, depth: 0.35 },
      material: {
        color: '#71717A', // Zinc gray
        metalness: 0.85,
        roughness: 0.4,
      },
    },

    // === HORIZONTAL SLATS (15 slats, each 15cm tall) ===
    // Slat 1 (bottom)
    {
      type: 'box',
      position: [0, 0.075, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 2
    {
      type: 'box',
      position: [0, 0.225, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 3
    {
      type: 'box',
      position: [0, 0.375, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 4
    {
      type: 'box',
      position: [0, 0.525, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 5
    {
      type: 'box',
      position: [0, 0.675, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 6
    {
      type: 'box',
      position: [0, 0.825, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 7
    {
      type: 'box',
      position: [0, 0.975, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 8
    {
      type: 'box',
      position: [0, 1.125, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 9
    {
      type: 'box',
      position: [0, 1.275, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 10
    {
      type: 'box',
      position: [0, 1.425, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 11
    {
      type: 'box',
      position: [0, 1.575, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 12
    {
      type: 'box',
      position: [0, 1.725, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 13
    {
      type: 'box',
      position: [0, 1.875, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 14
    {
      type: 'box',
      position: [0, 2.025, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#6B7280',
        metalness: 0.85,
        roughness: 0.4,
      },
    },
    // Slat 15 (top, slightly different color for variation)
    {
      type: 'box',
      position: [0, 2.175, 0],
      params: { width: 2.45, height: 0.005, depth: 0.15 },
      material: {
        color: '#6B7280',
        metalness: 0.85,
        roughness: 0.4,
      },
    },

    // === SIDE RAILS/TRACKS (left and right) ===
    // Left track
    {
      type: 'box',
      position: [-1.225, 1.25, 0],
      params: { width: 0.05, height: 0.05, depth: 2.5 },
      material: {
        color: '#52525B',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Right track
    {
      type: 'box',
      position: [1.225, 1.25, 0],
      params: { width: 0.05, height: 0.05, depth: 2.5 },
      material: {
        color: '#52525B',
        metalness: 0.9,
        roughness: 0.3,
      },
    },

    // === BOTTOM HANDLE BAR (optional pull handle) ===
    {
      type: 'cylinder',
      position: [0, 0.05, 0.1],
      rotation: [0, 0, Math.PI / 2],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 1.2, radialSegments: 16 },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * Glass Sliding Door (Modern)
 * Composition: Glass panels + aluminum frame + floor track + handle
 * Style: Contemporary minimalist with large glass surface
 * Materials: Transparent glass with aluminum frame
 * Dimensions: 2.0m wide, 10cm deep, 2.2m tall
 */
export const DOOR_GLASS_SLIDING: BaseObjectDefinition = {
  id: 'door_glass_sliding',
  type: RoomElementType.DOOR,
  name: 'Glass Sliding Door',
  description: 'Modern sliding door with large glass panels',
  defaultDimensions: [2.0, 0.1, 2.2], // 2m wide, 10cm deep, 2.2m tall
  supportsInstancing: true,
  parts: [
    // === GLASS PANEL 1 (left panel - stationary) ===
    {
      type: 'box',
      position: [-0.5, 1.1, 0],
      params: { width: 0.95, height: 0.05, depth: 2.1 },
      material: {
        color: '#87CEEB', // Light sky blue tint
        metalness: 0.9,
        roughness: 0.05,
        opacity: 0.25,
        transparent: true,
      },
    },

    // === GLASS PANEL 2 (right panel - sliding) ===
    {
      type: 'box',
      position: [0.5, 1.1, 0],
      params: { width: 0.95, height: 0.05, depth: 2.1 },
      material: {
        color: '#87CEEB',
        metalness: 0.9,
        roughness: 0.05,
        opacity: 0.25,
        transparent: true,
      },
    },

    // === ALUMINUM FRAME (top) ===
    {
      type: 'box',
      position: [0, 2.175, 0],
      params: { width: 2.0, height: 0.05, depth: 0.08 },
      material: {
        color: '#B0B0B0', // Brushed aluminum
        metalness: 0.85,
        roughness: 0.3,
      },
    },

    // === ALUMINUM FRAME (sides) ===
    // Left frame
    {
      type: 'box',
      position: [-0.975, 1.1, 0],
      params: { width: 0.05, height: 0.08, depth: 2.1 },
      material: {
        color: '#B0B0B0',
        metalness: 0.85,
        roughness: 0.3,
      },
    },
    // Center divider (between panels)
    {
      type: 'box',
      position: [0, 1.1, 0],
      params: { width: 0.05, height: 0.08, depth: 2.1 },
      material: {
        color: '#B0B0B0',
        metalness: 0.85,
        roughness: 0.3,
      },
    },
    // Right frame
    {
      type: 'box',
      position: [0.975, 1.1, 0],
      params: { width: 0.05, height: 0.08, depth: 2.1 },
      material: {
        color: '#B0B0B0',
        metalness: 0.85,
        roughness: 0.3,
      },
    },

    // === FLOOR TRACK (bottom rail system) ===
    {
      type: 'box',
      position: [0, 0.02, 0],
      params: { width: 2.0, height: 0.04, depth: 0.1 },
      material: {
        color: '#808080', // Gray track
        metalness: 0.75,
        roughness: 0.4,
      },
    },

    // === HANDLES (vertical pull handles on right panel) ===
    // Handle on right panel
    {
      type: 'cylinder',
      position: [0.85, 1.1, 0.06],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.3, radialSegments: 16 },
      material: {
        color: '#C0C0C0', // Chrome finish
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Handle mounting bracket (top)
    {
      type: 'box',
      position: [0.85, 1.25, 0.055],
      params: { width: 0.04, height: 0.03, depth: 0.02 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Handle mounting bracket (bottom)
    {
      type: 'box',
      position: [0.85, 0.95, 0.055],
      params: { width: 0.04, height: 0.03, depth: 0.02 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
  ],
};

/**
 * Window
 * Composition: Frame (boxes) + Glass (box with transparency)
 */
export const WINDOW_STANDARD: BaseObjectDefinition = {
  id: 'window_standard',
  type: RoomElementType.WINDOW,
  name: 'Standard Window',
  description: 'Glass window with frame',
  defaultDimensions: [1.5, 0.1, 1.2], // 150cm wide, 10cm deep, 120cm tall
  supportsInstancing: true,
  parts: [
    // Frame - top
    {
      type: 'box',
      position: [0, 0.6, 0],
      params: { width: 1.5, height: 0.05, depth: 0.05 },
      material: {
        color: '#374151',
        metalness: 0.4,
        roughness: 0.6,
      },
    },
    // Frame - bottom
    {
      type: 'box',
      position: [0, -0.6, 0],
      params: { width: 1.5, height: 0.05, depth: 0.05 },
      material: {
        color: '#374151',
        metalness: 0.4,
        roughness: 0.6,
      },
    },
    // Frame - left
    {
      type: 'box',
      position: [-0.725, 0, 0],
      params: { width: 0.05, height: 0.05, depth: 1.2 },
      material: {
        color: '#374151',
        metalness: 0.4,
        roughness: 0.6,
      },
    },
    // Frame - right
    {
      type: 'box',
      position: [0.725, 0, 0],
      params: { width: 0.05, height: 0.05, depth: 1.2 },
      material: {
        color: '#374151',
        metalness: 0.4,
        roughness: 0.6,
      },
    },
    // Glass
    {
      type: 'box',
      position: [0, 0, 0],
      params: { width: 1.4, height: 0.02, depth: 1.1 },
      material: {
        color: '#06B6D4',
        metalness: 0.9,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
  ],
};

/**
 * Column (Structural pillar)
 * Composition: Main shaft (cylinder) + Capital (box) + Base (cylinder)
 */
export const COLUMN_CYLINDRICAL: BaseObjectDefinition = {
  id: 'column_cylindrical',
  type: RoomElementType.COLUMN,
  name: 'Cylindrical Column',
  description: 'Structural support column',
  defaultDimensions: [0.5, 0.5, 3.0], // 50cm diameter, 3m tall
  supportsInstancing: true,
  parts: [
    // Main shaft
    {
      type: 'cylinder',
      position: [0, 1.5, 0],
      params: { radiusTop: 0.22, radiusBottom: 0.22, height: 2.8, radialSegments: 24 },
      material: {
        color: '#475569',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Capital (top)
    {
      type: 'box',
      position: [0, 2.95, 0],
      params: { width: 0.5, height: 0.1, depth: 0.5 },
      material: {
        color: '#334155',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Base
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.25, radiusBottom: 0.25, height: 0.15, radialSegments: 24 },
      material: {
        color: '#334155',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * Decoration (Generic decorative element)
 * Composition: Various shapes for artistic elements
 */
export const DECORATION_GENERIC: BaseObjectDefinition = {
  id: 'decoration_generic',
  type: RoomElementType.DECORATION,
  name: 'Generic Decoration',
  description: 'Decorative element',
  defaultDimensions: [0.8, 0.8, 1.0], // 80cm × 80cm × 100cm
  supportsInstancing: true,
  parts: [
    // Base
    {
      type: 'box',
      position: [0, 0.1, 0],
      params: { width: 0.6, height: 0.2, depth: 0.6 },
      material: {
        color: '#A855F7',
        metalness: 0.6,
        roughness: 0.4,
        emissive: '#9333EA',
        emissiveIntensity: 0.2,
      },
    },
    // Top sphere
    {
      type: 'sphere',
      position: [0, 0.6, 0],
      params: { radius: 0.3, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#C084FC',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#A855F7',
        emissiveIntensity: 0.15,
      },
    },
  ],
};

/**
 * Modern Minimalist Rug
 * Composition: Base plane + geometric accent planes for color blocks + border
 * Style: Contemporary, clean lines, two-tone color scheme
 * Materials: Matte fabric finish, low pile
 * Dimensions: 2.0m wide, 1.5cm thick, 3.0m long
 */
export const RUG_MODERN_MINIMALIST: BaseObjectDefinition = {
  id: 'rug_modern_minimalist',
  type: RoomElementType.RUG,
  name: 'Modern Minimalist Rug',
  description: 'Contemporary geometric rug with clean design',
  defaultDimensions: [2.0, 0.015, 3.0], // 2m wide, 1.5cm thick, 3m long
  supportsInstancing: true,
  parts: [
    // === BASE RUG SURFACE ===
    {
      type: 'box',
      position: [0, 0.0075, 0], // Half of thickness to sit on floor
      params: { width: 2.0, height: 0.015, depth: 3.0 },
      material: {
        color: '#E5E7EB', // Light gray base
        metalness: 0.0,
        roughness: 0.95, // Very matte, fabric-like
      },
    },

    // === GEOMETRIC ACCENT STRIP 1 (darker gray band) ===
    {
      type: 'box',
      position: [0, 0.016, 0.8], // Slightly above base
      params: { width: 1.9, height: 0.001, depth: 0.6 },
      material: {
        color: '#6B7280', // Medium gray
        metalness: 0.0,
        roughness: 0.95,
        opacity: 0.9,
        transparent: true,
      },
    },

    // === GEOMETRIC ACCENT STRIP 2 (dark accent) ===
    {
      type: 'box',
      position: [0, 0.016, -0.8], // Slightly above base, other end
      params: { width: 1.9, height: 0.001, depth: 0.4 },
      material: {
        color: '#374151', // Dark gray
        metalness: 0.0,
        roughness: 0.95,
        opacity: 0.9,
        transparent: true,
      },
    },

    // === BORDER/FRINGE (thin boxes at edges for visual interest) ===
    // Top border
    {
      type: 'box',
      position: [0, 0.008, 1.5], // At the edge
      params: { width: 2.0, height: 0.005, depth: 0.02 },
      material: {
        color: '#9CA3AF',
        metalness: 0.0,
        roughness: 0.98,
      },
    },
    // Bottom border
    {
      type: 'box',
      position: [0, 0.008, -1.5], // At the edge
      params: { width: 2.0, height: 0.005, depth: 0.02 },
      material: {
        color: '#9CA3AF',
        metalness: 0.0,
        roughness: 0.98,
      },
    },
  ],
};

/**
 * Persian/Oriental Rug
 * Composition: Base + multiple overlaid pattern layers for rich design
 * Style: Traditional ornate patterns with burgundy, navy, gold tones
 * Materials: Rich colors with subtle shimmer, high roughness
 * Dimensions: 2.5m wide, 2cm thick, 3.5m long
 */
export const RUG_PERSIAN_ORIENTAL: BaseObjectDefinition = {
  id: 'rug_persian_oriental',
  type: RoomElementType.RUG,
  name: 'Persian Oriental Rug',
  description: 'Traditional ornate rug with complex patterns',
  defaultDimensions: [2.5, 0.02, 3.5], // 2.5m wide, 2cm thick, 3.5m long
  supportsInstancing: true,
  parts: [
    // === BASE RUG SURFACE (deep burgundy) ===
    {
      type: 'box',
      position: [0, 0.01, 0],
      params: { width: 2.5, height: 0.02, depth: 3.5 },
      material: {
        color: '#8B1A1A', // Deep burgundy red
        metalness: 0.05,
        roughness: 0.92,
      },
    },

    // === CENTER MEDALLION (ornate center design) ===
    // Outer medallion ring (navy blue)
    {
      type: 'cylinder',
      position: [0, 0.021, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.6, radiusBottom: 0.6, height: 0.001, radialSegments: 32 },
      material: {
        color: '#1A2A4A', // Navy blue
        metalness: 0.1,
        roughness: 0.9,
        opacity: 0.85,
        transparent: true,
      },
    },
    // Inner medallion (gold accent)
    {
      type: 'cylinder',
      position: [0, 0.022, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.35, radiusBottom: 0.35, height: 0.001, radialSegments: 24 },
      material: {
        color: '#D4AF37', // Antique gold
        metalness: 0.2,
        roughness: 0.85,
        emissive: '#8B7355',
        emissiveIntensity: 0.05, // Subtle shimmer
        opacity: 0.9,
        transparent: true,
      },
    },

    // === BORDER PATTERN (ornate frame) ===
    // Outer border strip (dark red-brown)
    {
      type: 'box',
      position: [0, 0.021, 1.65], // Top border
      params: { width: 2.4, height: 0.001, depth: 0.2 },
      material: {
        color: '#5C1010',
        metalness: 0.05,
        roughness: 0.93,
        opacity: 0.9,
        transparent: true,
      },
    },
    {
      type: 'box',
      position: [0, 0.021, -1.65], // Bottom border
      params: { width: 2.4, height: 0.001, depth: 0.2 },
      material: {
        color: '#5C1010',
        metalness: 0.05,
        roughness: 0.93,
        opacity: 0.9,
        transparent: true,
      },
    },
    {
      type: 'box',
      position: [1.15, 0.021, 0], // Right border
      params: { width: 0.2, height: 0.001, depth: 3.1 },
      material: {
        color: '#5C1010',
        metalness: 0.05,
        roughness: 0.93,
        opacity: 0.9,
        transparent: true,
      },
    },
    {
      type: 'box',
      position: [-1.15, 0.021, 0], // Left border
      params: { width: 0.2, height: 0.001, depth: 3.1 },
      material: {
        color: '#5C1010',
        metalness: 0.05,
        roughness: 0.93,
        opacity: 0.9,
        transparent: true,
      },
    },

    // === DECORATIVE ACCENT BANDS (gold/cream patterns) ===
    // Top accent band
    {
      type: 'box',
      position: [0, 0.022, 1.5],
      params: { width: 2.2, height: 0.001, depth: 0.08 },
      material: {
        color: '#C9A961', // Light gold
        metalness: 0.15,
        roughness: 0.88,
        opacity: 0.75,
        transparent: true,
      },
    },
    // Bottom accent band
    {
      type: 'box',
      position: [0, 0.022, -1.5],
      params: { width: 2.2, height: 0.001, depth: 0.08 },
      material: {
        color: '#C9A961',
        metalness: 0.15,
        roughness: 0.88,
        opacity: 0.75,
        transparent: true,
      },
    },

    // === CORNER MOTIFS (decorative corner elements) ===
    // Top-right corner
    {
      type: 'box',
      position: [1.0, 0.022, 1.55],
      params: { width: 0.15, height: 0.001, depth: 0.15 },
      material: {
        color: '#DAA520', // Goldenrod
        metalness: 0.2,
        roughness: 0.85,
        opacity: 0.8,
        transparent: true,
      },
    },
    // Top-left corner
    {
      type: 'box',
      position: [-1.0, 0.022, 1.55],
      params: { width: 0.15, height: 0.001, depth: 0.15 },
      material: {
        color: '#DAA520',
        metalness: 0.2,
        roughness: 0.85,
        opacity: 0.8,
        transparent: true,
      },
    },
    // Bottom-right corner
    {
      type: 'box',
      position: [1.0, 0.022, -1.55],
      params: { width: 0.15, height: 0.001, depth: 0.15 },
      material: {
        color: '#DAA520',
        metalness: 0.2,
        roughness: 0.85,
        opacity: 0.8,
        transparent: true,
      },
    },
    // Bottom-left corner
    {
      type: 'box',
      position: [-1.0, 0.022, -1.55],
      params: { width: 0.15, height: 0.001, depth: 0.15 },
      material: {
        color: '#DAA520',
        metalness: 0.2,
        roughness: 0.85,
        opacity: 0.8,
        transparent: true,
      },
    },

    // === FRINGE (border tassels) ===
    // Top fringe
    {
      type: 'box',
      position: [0, 0.01, 1.75],
      params: { width: 2.5, height: 0.008, depth: 0.02 },
      material: {
        color: '#8B7355',
        metalness: 0.0,
        roughness: 0.98,
      },
    },
    // Bottom fringe
    {
      type: 'box',
      position: [0, 0.01, -1.75],
      params: { width: 2.5, height: 0.008, depth: 0.02 },
      material: {
        color: '#8B7355',
        metalness: 0.0,
        roughness: 0.98,
      },
    },
  ],
};

/**
 * Split-System Air Conditioner (Indoor Unit)
 * Style: Modern, sleek rectangular design with curved edges
 * Composition: Main housing, control panel, air outlet flap, indicator lights
 * Features: Quiet, efficient, wall-mounted design
 * Dimensions: 90cm wide, 30cm deep, 25cm tall
 */
export const AIR_CONDITIONER_SPLIT: BaseObjectDefinition = {
  id: 'air_conditioner_split',
  type: RoomElementType.AIR_CONDITIONER,
  name: 'Split-System Air Conditioner',
  description: 'Modern wall-mounted AC indoor unit',
  defaultDimensions: [0.9, 0.3, 0.25], // 90cm wide, 30cm deep, 25cm tall
  supportsInstancing: true,
  parts: [
    // Main housing body (white, sleek)
    {
      type: 'box',
      position: [0, 0.125, 0], // Adjusted: half of total height (0.25/2 = 0.125)
      params: { width: 0.88, height: 0.23, depth: 0.28 },
      material: {
        color: '#F8F9FA', // Off-white
        metalness: 0.3,
        roughness: 0.6,
      },
    },

    // Top curved edge (rounded top)
    {
      type: 'box',
      position: [0, 0.245, 0], // Adjusted: 0.12 + 0.125 offset
      params: { width: 0.86, height: 0.02, depth: 0.26 },
      material: {
        color: '#FFFFFF', // Pure white
        metalness: 0.25,
        roughness: 0.5,
      },
    },

    // Control panel strip (gray/blue accent)
    {
      type: 'box',
      position: [0, 0.145, 0.14], // Adjusted: 0.02 + 0.125 offset
      params: { width: 0.3, height: 0.08, depth: 0.005 },
      material: {
        color: '#6B7280', // Gray-blue
        metalness: 0.4,
        roughness: 0.4,
      },
    },

    // Indicator light 1 (left - power indicator)
    {
      type: 'box',
      position: [-0.12, 0.145, 0.145], // Adjusted: 0.02 + 0.125 offset
      params: { width: 0.015, height: 0.015, depth: 0.002 },
      material: {
        color: '#10B981', // Green
        metalness: 0.7,
        roughness: 0.2,
        emissive: '#10B981',
        emissiveIntensity: 0.5,
      },
    },

    // Indicator light 2 (center - mode indicator)
    {
      type: 'box',
      position: [0, 0.145, 0.145], // Adjusted: 0.02 + 0.125 offset
      params: { width: 0.015, height: 0.015, depth: 0.002 },
      material: {
        color: '#3B82F6', // Blue
        metalness: 0.7,
        roughness: 0.2,
        emissive: '#3B82F6',
        emissiveIntensity: 0.3,
      },
    },

    // Indicator light 3 (right - timer indicator)
    {
      type: 'box',
      position: [0.12, 0.145, 0.145], // Adjusted: 0.02 + 0.125 offset
      params: { width: 0.015, height: 0.015, depth: 0.002 },
      material: {
        color: '#F59E0B', // Amber
        metalness: 0.7,
        roughness: 0.2,
        emissive: '#F59E0B',
        emissiveIntensity: 0.2,
      },
    },

    // Air outlet flap at bottom (horizontal slats look)
    {
      type: 'box',
      position: [0, 0.015, 0.13], // Adjusted: -0.11 + 0.125 offset
      params: { width: 0.82, height: 0.025, depth: 0.03 },
      material: {
        color: '#E5E7EB', // Light gray
        metalness: 0.35,
        roughness: 0.55,
      },
    },

    // Air outlet opening (dark recessed area)
    {
      type: 'box',
      position: [0, 0.03, 0.12], // Adjusted: -0.095 + 0.125 offset
      params: { width: 0.78, height: 0.05, depth: 0.02 },
      material: {
        color: '#1F2937', // Dark gray (opening)
        metalness: 0.1,
        roughness: 0.9,
      },
    },

    // Side vent detail (left)
    {
      type: 'box',
      position: [-0.42, 0.125, 0.05], // Adjusted: 0 + 0.125 offset
      params: { width: 0.04, height: 0.18, depth: 0.18 },
      material: {
        color: '#D1D5DB', // Light gray
        metalness: 0.3,
        roughness: 0.65,
      },
    },

    // Side vent detail (right)
    {
      type: 'box',
      position: [0.42, 0.125, 0.05], // Adjusted: 0 + 0.125 offset
      params: { width: 0.04, height: 0.18, depth: 0.18 },
      material: {
        color: '#D1D5DB', // Light gray
        metalness: 0.3,
        roughness: 0.65,
      },
    },
  ],
};

/**
 * High Table (Cocktail/Standing Table)
 * Composition: Thin circular top + Central post + Cross base
 * Perfect for nightlife standing areas
 */
export const HIGH_TABLE: BaseObjectDefinition = {
  id: 'high_table',
  type: RoomElementType.CUSTOM,
  name: 'High Table',
  description: 'Standing cocktail table',
  defaultDimensions: [0.7, 0.7, 1.1], // 70cm diameter, 110cm tall
  supportsInstancing: true,
  parts: [
    // Table top - thin disk
    {
      type: 'cylinder',
      position: [0, 1.085, 0],
      params: { radiusTop: 0.35, radiusBottom: 0.35, height: 0.03, radialSegments: 32 },
      material: {
        color: '#1F2937',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#14B8A6',
        emissiveIntensity: 0.1,
      },
    },
    // Central post
    {
      type: 'cylinder',
      position: [0, 0.55, 0],
      params: { radiusTop: 0.05, radiusBottom: 0.05, height: 1.04, radialSegments: 16 },
      material: {
        color: '#374151',
        metalness: 0.8,
        roughness: 0.4,
      },
    },
    // Base - cross bar 1
    {
      type: 'box',
      position: [0, 0.05, 0],
      params: { width: 0.5, height: 0.05, depth: 0.08 },
      material: {
        color: '#4B5563',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    // Base - cross bar 2 (rotated 90°)
    {
      type: 'box',
      position: [0, 0.05, 0],
      rotation: [0, Math.PI / 2, 0],
      params: { width: 0.5, height: 0.05, depth: 0.08 },
      material: {
        color: '#4B5563',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * High Table Square (Cocktail/Standing Table with Square Top)
 * Composition: Thin square top + Central post + Cross base
 * Perfect for nightlife standing areas
 */
export const HIGH_TABLE_SQUARE: BaseObjectDefinition = {
  id: 'high_table_square',
  type: RoomElementType.CUSTOM,
  name: 'High Table (Square)',
  description: 'Standing cocktail table with square top',
  defaultDimensions: [0.7, 0.7, 1.1], // 70cm × 70cm, 110cm tall
  supportsInstancing: true,
  parts: [
    // Table top - thin square
    {
      type: 'box',
      position: [0, 1.085, 0],
      params: { width: 0.7, height: 0.03, depth: 0.7 },
      material: {
        color: '#1F2937',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#14B8A6',
        emissiveIntensity: 0.1,
      },
    },
    // Central post
    {
      type: 'cylinder',
      position: [0, 0.55, 0],
      params: { radiusTop: 0.05, radiusBottom: 0.05, height: 1.04, radialSegments: 16 },
      material: {
        color: '#374151',
        metalness: 0.8,
        roughness: 0.4,
      },
    },
    // Base - cross bar 1
    {
      type: 'box',
      position: [0, 0.05, 0],
      params: { width: 0.5, height: 0.05, depth: 0.08 },
      material: {
        color: '#4B5563',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    // Base - cross bar 2 (rotated 90°)
    {
      type: 'box',
      position: [0, 0.05, 0],
      rotation: [0, Math.PI / 2, 0],
      params: { width: 0.5, height: 0.05, depth: 0.08 },
      material: {
        color: '#4B5563',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * VIP Booth Table
 * Composition: Low rectangular table with LED edge lighting
 */
export const VIP_BOOTH_TABLE: BaseObjectDefinition = {
  id: 'vip_booth_table',
  type: RoomElementType.CUSTOM,
  name: 'VIP Booth Table',
  description: 'Low table for VIP booth seating',
  defaultDimensions: [1.2, 0.8, 0.45], // 120cm × 80cm × 45cm
  supportsInstancing: true,
  parts: [
    // Main tabletop
    {
      type: 'box',
      position: [0, 0.42, 0],
      params: { width: 1.15, height: 0.06, depth: 0.75 },
      material: {
        color: '#0F172A',
        metalness: 0.8,
        roughness: 0.2,
        emissive: '#F59E0B',
        emissiveIntensity: 0.15,
      },
    },
    // LED edge - front
    {
      type: 'box',
      position: [0, 0.39, 0.375],
      params: { width: 1.2, height: 0.02, depth: 0.02 },
      material: {
        color: '#FBBF24',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#F59E0B',
        emissiveIntensity: 0.8,
      },
    },
    // LED edge - back
    {
      type: 'box',
      position: [0, 0.39, -0.375],
      params: { width: 1.2, height: 0.02, depth: 0.02 },
      material: {
        color: '#FBBF24',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#F59E0B',
        emissiveIntensity: 0.8,
      },
    },
    // Base structure
    {
      type: 'box',
      position: [0, 0.2, 0],
      params: { width: 1.0, height: 0.4, depth: 0.6 },
      material: {
        color: '#1E293B',
        metalness: 0.4,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * Lounge Low Table (Coffee Table)
 * Composition: Low square/rectangular table with shelf
 */
export const LOUNGE_LOW_TABLE: BaseObjectDefinition = {
  id: 'lounge_low_table',
  type: RoomElementType.CUSTOM,
  name: 'Lounge Table',
  description: 'Low table for lounge seating areas',
  defaultDimensions: [1.0, 1.0, 0.4], // 100cm × 100cm × 40cm
  supportsInstancing: true,
  parts: [
    // Top surface
    {
      type: 'box',
      position: [0, 0.37, 0],
      params: { width: 0.95, height: 0.06, depth: 0.95 },
      material: {
        color: '#8B5CF6',
        metalness: 0.6,
        roughness: 0.4,
        emissive: '#7C3AED',
        emissiveIntensity: 0.15,
      },
    },
    // Lower shelf
    {
      type: 'box',
      position: [0, 0.15, 0],
      params: { width: 0.85, height: 0.04, depth: 0.85 },
      material: {
        color: '#6D28D9',
        metalness: 0.4,
        roughness: 0.6,
      },
    },
    // Leg - front left
    {
      type: 'cylinder',
      position: [-0.4, 0.2, 0.4],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.4, radialSegments: 12 },
      material: {
        color: '#5B21B6',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Leg - front right
    {
      type: 'cylinder',
      position: [0.4, 0.2, 0.4],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.4, radialSegments: 12 },
      material: {
        color: '#5B21B6',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Leg - back left
    {
      type: 'cylinder',
      position: [-0.4, 0.2, -0.4],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.4, radialSegments: 12 },
      material: {
        color: '#5B21B6',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Leg - back right
    {
      type: 'cylinder',
      position: [0.4, 0.2, -0.4],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.4, radialSegments: 12 },
      material: {
        color: '#5B21B6',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * Round Cocktail Table (Small)
 * Composition: Small round top + Single pedestal
 */
export const ROUND_COCKTAIL_TABLE: BaseObjectDefinition = {
  id: 'round_cocktail_table',
  type: RoomElementType.CUSTOM,
  name: 'Round Cocktail Table',
  description: 'Small round table for 2-4 people',
  defaultDimensions: [0.6, 0.6, 1.05], // 60cm diameter, 105cm tall
  supportsInstancing: true,
  parts: [
    // Table top
    {
      type: 'cylinder',
      position: [0, 1.035, 0],
      params: { radiusTop: 0.3, radiusBottom: 0.3, height: 0.03, radialSegments: 32 },
      material: {
        color: '#EC4899',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#DB2777',
        emissiveIntensity: 0.2,
      },
    },
    // Pedestal top (wider)
    {
      type: 'cylinder',
      position: [0, 0.95, 0],
      params: { radiusTop: 0.08, radiusBottom: 0.06, height: 0.14, radialSegments: 16 },
      material: {
        color: '#BE185D',
        metalness: 0.8,
        roughness: 0.4,
      },
    },
    // Pedestal shaft
    {
      type: 'cylinder',
      position: [0, 0.5, 0],
      params: { radiusTop: 0.06, radiusBottom: 0.06, height: 0.9, radialSegments: 16 },
      material: {
        color: '#9F1239',
        metalness: 0.8,
        roughness: 0.4,
      },
    },
    // Base
    {
      type: 'cylinder',
      position: [0, 0.05, 0],
      params: { radiusTop: 0.25, radiusBottom: 0.25, height: 0.1, radialSegments: 24 },
      material: {
        color: '#881337',
        metalness: 0.7,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * LED Cube Seat/Table
 * Composition: Illuminated cube for seating or side table
 */
export const LED_CUBE_SEAT: BaseObjectDefinition = {
  id: 'led_cube_seat',
  type: RoomElementType.CUSTOM,
  name: 'LED Cube',
  description: 'Illuminated cube seat or side table',
  defaultDimensions: [0.45, 0.45, 0.45], // 45cm cube
  supportsInstancing: true,
  parts: [
    // Main cube body
    {
      type: 'box',
      position: [0, 0.225, 0],
      params: { width: 0.44, height: 0.45, depth: 0.44 },
      material: {
        color: '#FFFFFF',
        metalness: 0.3,
        roughness: 0.7,
        opacity: 0.8,
        transparent: true,
        emissive: '#06B6D4',
        emissiveIntensity: 0.6,
      },
    },
    // Inner glow core
    {
      type: 'box',
      position: [0, 0.225, 0],
      params: { width: 0.4, height: 0.41, depth: 0.4 },
      material: {
        color: '#22D3EE',
        metalness: 0.1,
        roughness: 0.9,
        emissive: '#0891B2',
        emissiveIntensity: 0.9,
      },
    },
  ],
};

/**
 * Bar Stool (High Seat)
 * Composition: Round seat + Footrest + Central post
 */
export const BAR_STOOL: BaseObjectDefinition = {
  id: 'bar_stool',
  type: RoomElementType.CUSTOM,
  name: 'Bar Stool',
  description: 'High stool for bar seating',
  defaultDimensions: [0.4, 0.4, 0.75], // 40cm × 40cm × 75cm
  supportsInstancing: true,
  parts: [
    // Seat
    {
      type: 'cylinder',
      position: [0, 0.72, 0],
      params: { radiusTop: 0.18, radiusBottom: 0.18, height: 0.06, radialSegments: 24 },
      material: {
        color: '#1F2937',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Seat cushion edge
    {
      type: 'cylinder',
      position: [0, 0.75, 0],
      params: { radiusTop: 0.19, radiusBottom: 0.18, height: 0.03, radialSegments: 24 },
      material: {
        color: '#374151',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Central post
    {
      type: 'cylinder',
      position: [0, 0.375, 0],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.75, radialSegments: 16 },
      material: {
        color: '#6B7280',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Footrest ring
    {
      type: 'cylinder',
      position: [0, 0.25, 0],
      params: { radiusTop: 0.15, radiusBottom: 0.15, height: 0.02, radialSegments: 24 },
      material: {
        color: '#9CA3AF',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    // Base
    {
      type: 'cylinder',
      position: [0, 0.02, 0],
      params: { radiusTop: 0.2, radiusBottom: 0.2, height: 0.04, radialSegments: 24 },
      material: {
        color: '#4B5563',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
  ],
};

/**
 * Long Table (Dining/Conference)
 * Composition: Tabletop (box) + 4 Legs (cylinders)
 */
export const LONG_TABLE: BaseObjectDefinition = {
  id: 'long_table',
  type: RoomElementType.CUSTOM,
  name: 'Long Table',
  description: 'Rectangular dining or conference table',
  defaultDimensions: [2.0, 0.8, 0.75], // 200cm × 80cm × 75cm
  supportsInstancing: true,
  parts: [
    // Tabletop
    {
      type: 'box',
      position: [0, 0.71, 0],
      params: { width: 1.95, height: 0.08, depth: 0.75 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.7,
      },
    },
    // Leg - front left
    {
      type: 'cylinder',
      position: [-0.85, 0.335, -0.3],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.67, radialSegments: 16 },
      material: {
        color: '#654321',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Leg - front right
    {
      type: 'cylinder',
      position: [0.85, 0.335, -0.3],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.67, radialSegments: 16 },
      material: {
        color: '#654321',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Leg - back left
    {
      type: 'cylinder',
      position: [-0.85, 0.335, 0.3],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.67, radialSegments: 16 },
      material: {
        color: '#654321',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
    // Leg - back right
    {
      type: 'cylinder',
      position: [0.85, 0.335, 0.3],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.67, radialSegments: 16 },
      material: {
        color: '#654321',
        metalness: 0.2,
        roughness: 0.8,
      },
    },
  ],
};

/**
 * Palm Tree (Decorative Plant)
 * Composition: Trunk (cylinder) + Multiple palm leaves (boxes at angles)
 */
export const PALM_TREE: BaseObjectDefinition = {
  id: 'palm_tree',
  type: RoomElementType.PLANT,
  name: 'Palm Tree',
  description: 'Tropical palm tree decoration',
  defaultDimensions: [1.5, 1.5, 3.0], // 150cm × 150cm × 300cm
  supportsInstancing: true,
  parts: [
    // Trunk
    {
      type: 'cylinder',
      position: [0, 1.5, 0],
      params: { radiusTop: 0.12, radiusBottom: 0.18, height: 3.0, radialSegments: 12 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Palm leaf 1 (front)
    {
      type: 'box',
      position: [0, 2.9, 0.4],
      rotation: [Math.PI / 6, 0, 0],
      params: { width: 0.25, height: 0.05, depth: 1.2 },
      material: {
        color: '#228B22',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 2 (back)
    {
      type: 'box',
      position: [0, 2.9, -0.4],
      rotation: [-Math.PI / 6, 0, 0],
      params: { width: 0.25, height: 0.05, depth: 1.2 },
      material: {
        color: '#228B22',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 3 (left)
    {
      type: 'box',
      position: [-0.4, 2.9, 0],
      rotation: [0, 0, Math.PI / 6],
      params: { width: 1.2, height: 0.05, depth: 0.25 },
      material: {
        color: '#228B22',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 4 (right)
    {
      type: 'box',
      position: [0.4, 2.9, 0],
      rotation: [0, 0, -Math.PI / 6],
      params: { width: 1.2, height: 0.05, depth: 0.25 },
      material: {
        color: '#228B22',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 5 (diagonal front-left)
    {
      type: 'box',
      position: [-0.3, 2.85, 0.3],
      rotation: [Math.PI / 8, 0, Math.PI / 8],
      params: { width: 1.0, height: 0.05, depth: 0.25 },
      material: {
        color: '#2E8B57',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 6 (diagonal front-right)
    {
      type: 'box',
      position: [0.3, 2.85, 0.3],
      rotation: [Math.PI / 8, 0, -Math.PI / 8],
      params: { width: 1.0, height: 0.05, depth: 0.25 },
      material: {
        color: '#2E8B57',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 7 (diagonal back-left)
    {
      type: 'box',
      position: [-0.3, 2.85, -0.3],
      rotation: [-Math.PI / 8, 0, Math.PI / 8],
      params: { width: 1.0, height: 0.05, depth: 0.25 },
      material: {
        color: '#2E8B57',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Palm leaf 8 (diagonal back-right)
    {
      type: 'box',
      position: [0.3, 2.85, -0.3],
      rotation: [-Math.PI / 8, 0, -Math.PI / 8],
      params: { width: 1.0, height: 0.05, depth: 0.25 },
      material: {
        color: '#2E8B57',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Pot base
    {
      type: 'cylinder',
      position: [0, 0.15, 0],
      params: { radiusTop: 0.25, radiusBottom: 0.2, height: 0.3, radialSegments: 16 },
      material: {
        color: '#8B4513',
        metalness: 0.2,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * PA Speaker (Professional Audio)
 * Composition: Box enclosure + Circular drivers + Grille
 */
export const PA_SPEAKER: BaseObjectDefinition = {
  id: 'pa_speaker',
  type: RoomElementType.CUSTOM,
  name: 'PA Speaker',
  description: 'Professional audio speaker',
  defaultDimensions: [0.5, 0.7, 0.4], // 50cm × 70cm × 40cm
  supportsInstancing: true,
  parts: [
    // Main enclosure
    {
      type: 'box',
      position: [0, 0.35, 0],
      params: { width: 0.48, height: 0.68, depth: 0.38 },
      material: {
        color: '#1F2937',
        metalness: 0.3,
        roughness: 0.8,
      },
    },
    // Top woofer (low frequency driver)
    {
      type: 'cylinder',
      position: [0, 0.5, 0.195],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.15, radiusBottom: 0.15, height: 0.03, radialSegments: 32 },
      material: {
        color: '#111827',
        metalness: 0.5,
        roughness: 0.6,
        emissive: '#3B82F6',
        emissiveIntensity: 0.1,
      },
    },
    // Woofer cone (inner)
    {
      type: 'cylinder',
      position: [0, 0.5, 0.2],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.1, radiusBottom: 0.05, height: 0.05, radialSegments: 24 },
      material: {
        color: '#000000',
        metalness: 0.2,
        roughness: 0.9,
      },
    },
    // Mid-range driver
    {
      type: 'cylinder',
      position: [0, 0.15, 0.195],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.08, radiusBottom: 0.08, height: 0.03, radialSegments: 24 },
      material: {
        color: '#374151',
        metalness: 0.4,
        roughness: 0.7,
      },
    },
    // Tweeter (high frequency driver)
    {
      type: 'cylinder',
      position: [0, -0.1, 0.195],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.04, radiusBottom: 0.04, height: 0.03, radialSegments: 16 },
      material: {
        color: '#6B7280',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    // Grille frame
    {
      type: 'box',
      position: [0, 0.25, 0.2],
      params: { width: 0.45, height: 0.6, depth: 0.02 },
      material: {
        color: '#4B5563',
        metalness: 0.4,
        roughness: 0.6,
        opacity: 0.5,
        transparent: true,
      },
    },
    // Handle (top)
    {
      type: 'box',
      position: [0, 0.7, 0],
      params: { width: 0.3, height: 0.05, depth: 0.08 },
      material: {
        color: '#374151',
        metalness: 0.5,
        roughness: 0.6,
      },
    },
  ],
};

/**
 * Subwoofer (Bass Speaker)
 * Composition: Large cube enclosure + Large bass driver
 */
export const SUBWOOFER: BaseObjectDefinition = {
  id: 'subwoofer',
  type: RoomElementType.CUSTOM,
  name: 'Subwoofer',
  description: 'Bass frequency subwoofer',
  defaultDimensions: [0.6, 0.6, 0.6], // 60cm cube
  supportsInstancing: true,
  parts: [
    // Main enclosure
    {
      type: 'box',
      position: [0, 0.3, 0],
      params: { width: 0.58, height: 0.58, depth: 0.58 },
      material: {
        color: '#111827',
        metalness: 0.4,
        roughness: 0.7,
      },
    },
    // Bass driver (large woofer)
    {
      type: 'cylinder',
      position: [0, 0.3, 0.295],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.22, radiusBottom: 0.22, height: 0.04, radialSegments: 32 },
      material: {
        color: '#1F2937',
        metalness: 0.5,
        roughness: 0.6,
        emissive: '#EF4444',
        emissiveIntensity: 0.2,
      },
    },
    // Driver cone (inner)
    {
      type: 'cylinder',
      position: [0, 0.3, 0.31],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.15, radiusBottom: 0.08, height: 0.08, radialSegments: 24 },
      material: {
        color: '#000000',
        metalness: 0.2,
        roughness: 0.9,
      },
    },
    // Grille
    {
      type: 'box',
      position: [0, 0.3, 0.3],
      params: { width: 0.5, height: 0.5, depth: 0.02 },
      material: {
        color: '#374151',
        metalness: 0.4,
        roughness: 0.6,
        opacity: 0.4,
        transparent: true,
      },
    },
    // Port (bass reflex)
    {
      type: 'cylinder',
      position: [0, -0.15, 0.295],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.06, radiusBottom: 0.06, height: 0.02, radialSegments: 16 },
      material: {
        color: '#000000',
        metalness: 0.1,
        roughness: 1.0,
      },
    },
    // LED indicator
    {
      type: 'sphere',
      position: [0.25, 0.25, 0.295],
      params: { radius: 0.015, widthSegments: 12, heightSegments: 8 },
      material: {
        color: '#22C55E',
        metalness: 0.3,
        roughness: 0.5,
        emissive: '#10B981',
        emissiveIntensity: 0.9,
      },
    },
  ],
};

/**
 * Moving Head Light (Intelligent Lighting)
 * Composition: Base + Yoke + Head with lens
 */
export const MOVING_HEAD_LIGHT: BaseObjectDefinition = {
  id: 'moving_head_light',
  type: RoomElementType.CUSTOM,
  name: 'Moving Head',
  description: 'Intelligent moving head light',
  defaultDimensions: [0.4, 0.6, 0.4], // 40cm × 60cm × 40cm
  supportsInstancing: true,
  parts: [
    // Base
    {
      type: 'cylinder',
      position: [0, 0.05, 0],
      params: { radiusTop: 0.18, radiusBottom: 0.18, height: 0.1, radialSegments: 24 },
      material: {
        color: '#1F2937',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Yoke (mounting arm) - left side
    {
      type: 'box',
      position: [-0.15, 0.3, 0],
      params: { width: 0.05, height: 0.5, depth: 0.05 },
      material: {
        color: '#374151',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    // Yoke (mounting arm) - right side
    {
      type: 'box',
      position: [0.15, 0.3, 0],
      params: { width: 0.05, height: 0.5, depth: 0.05 },
      material: {
        color: '#374151',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    // Head body (spherical)
    {
      type: 'sphere',
      position: [0, 0.35, 0],
      params: { radius: 0.15, widthSegments: 24, heightSegments: 16 },
      material: {
        color: '#111827',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    // Lens (front)
    {
      type: 'cylinder',
      position: [0, 0.35, 0.15],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.08, radiusBottom: 0.08, height: 0.03, radialSegments: 24 },
      material: {
        color: '#FFFFFF',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#FBBF24',
        emissiveIntensity: 0.8,
        opacity: 0.7,
        transparent: true,
      },
    },
    // Lens housing
    {
      type: 'cylinder',
      position: [0, 0.35, 0.16],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.1, radiusBottom: 0.08, height: 0.05, radialSegments: 24 },
      material: {
        color: '#374151',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    // LED indicators (top)
    {
      type: 'sphere',
      position: [-0.05, 0.48, 0],
      params: { radius: 0.01, widthSegments: 8, heightSegments: 6 },
      material: {
        color: '#22C55E',
        metalness: 0.3,
        roughness: 0.5,
        emissive: '#10B981',
        emissiveIntensity: 1.0,
      },
    },
    {
      type: 'sphere',
      position: [0.05, 0.48, 0],
      params: { radius: 0.01, widthSegments: 8, heightSegments: 6 },
      material: {
        color: '#EF4444',
        metalness: 0.3,
        roughness: 0.5,
        emissive: '#DC2626',
        emissiveIntensity: 0.8,
      },
    },
  ],
};

/**
 * DJ Controller/Mixer
 * Composition: Flat rectangular box with various controls and display
 */
export const DJ_CONTROLLER: BaseObjectDefinition = {
  id: 'dj_controller',
  type: RoomElementType.DJ_BOOTH,
  name: 'DJ Controller',
  description: 'Professional DJ mixer and controller',
  defaultDimensions: [0.8, 0.15, 0.4], // 80cm × 15cm × 40cm
  supportsInstancing: true,
  parts: [
    // Main body
    {
      type: 'box',
      position: [0, 0.075, 0],
      params: { width: 0.78, height: 0.12, depth: 0.38 },
      material: {
        color: '#1F2937',
        metalness: 0.6,
        roughness: 0.4,
      },
    },
    // Top panel
    {
      type: 'box',
      position: [0, 0.135, 0],
      params: { width: 0.76, height: 0.02, depth: 0.36 },
      material: {
        color: '#111827',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Display screen (center)
    {
      type: 'box',
      position: [0, 0.146, 0],
      params: { width: 0.3, height: 0.01, depth: 0.15 },
      material: {
        color: '#000000',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#14B8A6',
        emissiveIntensity: 0.6,
      },
    },
    // Jog wheel (left)
    {
      type: 'cylinder',
      position: [-0.25, 0.146, 0.08],
      params: { radiusTop: 0.08, radiusBottom: 0.08, height: 0.01, radialSegments: 32 },
      material: {
        color: '#374151',
        metalness: 0.8,
        roughness: 0.3,
        emissive: '#06B6D4',
        emissiveIntensity: 0.3,
      },
    },
    // Jog wheel (right)
    {
      type: 'cylinder',
      position: [0.25, 0.146, 0.08],
      params: { radiusTop: 0.08, radiusBottom: 0.08, height: 0.01, radialSegments: 32 },
      material: {
        color: '#374151',
        metalness: 0.8,
        roughness: 0.3,
        emissive: '#06B6D4',
        emissiveIntensity: 0.3,
      },
    },
    // Faders (vertical sliders) - 4 across
    {
      type: 'box',
      position: [-0.22, 0.15, -0.08],
      params: { width: 0.025, height: 0.04, depth: 0.08 },
      material: {
        color: '#6B7280',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    {
      type: 'box',
      position: [-0.07, 0.15, -0.08],
      params: { width: 0.025, height: 0.04, depth: 0.08 },
      material: {
        color: '#6B7280',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    {
      type: 'box',
      position: [0.07, 0.15, -0.08],
      params: { width: 0.025, height: 0.04, depth: 0.08 },
      material: {
        color: '#6B7280',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    {
      type: 'box',
      position: [0.22, 0.15, -0.08],
      params: { width: 0.025, height: 0.04, depth: 0.08 },
      material: {
        color: '#6B7280',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    // Knobs (rotary controls) - row of 8
    {
      type: 'cylinder',
      position: [-0.28, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [-0.2, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [-0.12, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [-0.04, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [0.04, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [0.12, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [0.2, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    {
      type: 'cylinder',
      position: [0.28, 0.15, -0.12],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#9CA3AF',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    // Rubber feet
    {
      type: 'cylinder',
      position: [-0.35, 0.01, -0.15],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#000000',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    {
      type: 'cylinder',
      position: [0.35, 0.01, -0.15],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#000000',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    {
      type: 'cylinder',
      position: [-0.35, 0.01, 0.15],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#000000',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    {
      type: 'cylinder',
      position: [0.35, 0.01, 0.15],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 12 },
      material: {
        color: '#000000',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
  ],
};

/**
 * Laser Projector (Stage Lighting)
 * Composition: Box housing + Lens + Mounting bracket
 */
export const LASER_PROJECTOR: BaseObjectDefinition = {
  id: 'laser_projector',
  type: RoomElementType.CUSTOM,
  name: 'Laser Projector',
  description: 'RGB laser beam projector',
  defaultDimensions: [0.25, 0.2, 0.15], // 25cm × 20cm × 15cm
  supportsInstancing: true,
  parts: [
    // Main body
    {
      type: 'box',
      position: [0, 0.1, 0],
      params: { width: 0.23, height: 0.15, depth: 0.13 },
      material: {
        color: '#1F2937',
        metalness: 0.7,
        roughness: 0.4,
      },
    },
    // Lens housing (front)
    {
      type: 'cylinder',
      position: [0, 0.1, 0.08],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.05, radiusBottom: 0.05, height: 0.05, radialSegments: 24 },
      material: {
        color: '#374151',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Lens (glass)
    {
      type: 'cylinder',
      position: [0, 0.1, 0.105],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.045, radiusBottom: 0.045, height: 0.01, radialSegments: 24 },
      material: {
        color: '#06B6D4',
        metalness: 0.9,
        roughness: 0.1,
        emissive: '#0EA5E9',
        emissiveIntensity: 0.9,
        opacity: 0.8,
        transparent: true,
      },
    },
    // Mounting bracket (bottom)
    {
      type: 'box',
      position: [0, 0.02, 0],
      params: { width: 0.15, height: 0.03, depth: 0.08 },
      material: {
        color: '#4B5563',
        metalness: 0.6,
        roughness: 0.5,
      },
    },
    // Heat sink fins (back)
    {
      type: 'box',
      position: [0, 0.1, -0.07],
      params: { width: 0.2, height: 0.12, depth: 0.02 },
      material: {
        color: '#6B7280',
        metalness: 0.8,
        roughness: 0.6,
      },
    },
    // Power indicator
    {
      type: 'sphere',
      position: [0.08, 0.15, 0.05],
      params: { radius: 0.008, widthSegments: 8, heightSegments: 6 },
      material: {
        color: '#22C55E',
        metalness: 0.3,
        roughness: 0.5,
        emissive: '#10B981',
        emissiveIntensity: 1.0,
      },
    },
  ],
};

/**
 * Square Pouf (Cushioned Seat)
 * Composition: Cube-shaped cushion with slightly rounded appearance
 * Perfect for casual seating areas and lounge spaces
 */
export const POUF_SQUARE: BaseObjectDefinition = {
  id: 'pouf_square',
  type: RoomElementType.SEATING,
  name: 'Square Pouf',
  description: 'Cushioned square ottoman/floor seat',
  defaultDimensions: [0.5, 0.5, 0.4], // 50cm × 50cm × 40cm
  supportsInstancing: true,
  parts: [
    // Main cushion body
    {
      type: 'box',
      position: [0, 0.2, 0],
      params: { width: 0.48, height: 0.38, depth: 0.48 },
      material: {
        color: '#8B4513', // Saddle brown
        metalness: 0.1,
        roughness: 0.9, // Very rough for fabric texture
      },
    },
    // Top cushion padding (slightly smaller, raised)
    {
      type: 'box',
      position: [0, 0.395, 0],
      params: { width: 0.46, height: 0.03, depth: 0.46 },
      material: {
        color: '#A0522D', // Sienna (lighter brown)
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Bottom base (slightly smaller for support look)
    {
      type: 'box',
      position: [0, 0.015, 0],
      params: { width: 0.44, height: 0.03, depth: 0.44 },
      material: {
        color: '#654321', // Dark brown
        metalness: 0.2,
        roughness: 0.8,
      },
    },
  ],
};

/**
 * Round Pouf (Circular Cushioned Seat)
 * Composition: Cylindrical cushion with fabric appearance
 * Classic ottoman style for versatile seating
 */
export const POUF_ROUND: BaseObjectDefinition = {
  id: 'pouf_round',
  type: RoomElementType.SEATING,
  name: 'Round Pouf',
  description: 'Circular cushioned ottoman',
  defaultDimensions: [0.5, 0.5, 0.4], // 50cm diameter × 40cm height
  supportsInstancing: true,
  parts: [
    // Main cylindrical body
    {
      type: 'cylinder',
      position: [0, 0.2, 0],
      params: { radiusTop: 0.24, radiusBottom: 0.24, height: 0.38, radialSegments: 32 },
      material: {
        color: '#696969', // Dim gray (neutral fabric)
        metalness: 0.05,
        roughness: 0.95, // Very rough for fabric
      },
    },
    // Top cushion (slightly smaller radius, raised)
    {
      type: 'cylinder',
      position: [0, 0.395, 0],
      params: { radiusTop: 0.23, radiusBottom: 0.23, height: 0.025, radialSegments: 32 },
      material: {
        color: '#808080', // Gray (lighter shade)
        metalness: 0.03,
        roughness: 0.97,
      },
    },
    // Bottom ring base
    {
      type: 'cylinder',
      position: [0, 0.015, 0],
      params: { radiusTop: 0.22, radiusBottom: 0.22, height: 0.03, radialSegments: 32 },
      material: {
        color: '#2F4F4F', // Dark slate gray
        metalness: 0.2,
        roughness: 0.85,
      },
    },
  ],
};

/**
 * Ottoman Pouf (Rectangular Low Seat)
 * Composition: Rectangular cushioned seat with legs
 * Traditional ottoman style with structured appearance
 */
export const POUF_OTTOMAN: BaseObjectDefinition = {
  id: 'pouf_ottoman',
  type: RoomElementType.SEATING,
  name: 'Ottoman Pouf',
  description: 'Rectangular cushioned ottoman with legs',
  defaultDimensions: [0.8, 0.5, 0.45], // 80cm × 50cm × 45cm
  supportsInstancing: true,
  parts: [
    // Main cushion body
    {
      type: 'box',
      position: [0, 0.3, 0],
      params: { width: 0.78, height: 0.35, depth: 0.48 },
      material: {
        color: '#556B2F', // Dark olive green
        metalness: 0.08,
        roughness: 0.92,
      },
    },
    // Top cushion padding
    {
      type: 'box',
      position: [0, 0.475, 0],
      params: { width: 0.76, height: 0.03, depth: 0.46 },
      material: {
        color: '#6B8E23', // Olive drab (lighter)
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Leg front-left
    {
      type: 'cylinder',
      position: [-0.32, 0.06, 0.19],
      params: { radiusTop: 0.025, radiusBottom: 0.03, height: 0.12, radialSegments: 16 },
      material: {
        color: '#3E2723', // Dark wood
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg front-right
    {
      type: 'cylinder',
      position: [0.32, 0.06, 0.19],
      params: { radiusTop: 0.025, radiusBottom: 0.03, height: 0.12, radialSegments: 16 },
      material: {
        color: '#3E2723',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg back-left
    {
      type: 'cylinder',
      position: [-0.32, 0.06, -0.19],
      params: { radiusTop: 0.025, radiusBottom: 0.03, height: 0.12, radialSegments: 16 },
      material: {
        color: '#3E2723',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg back-right
    {
      type: 'cylinder',
      position: [0.32, 0.06, -0.19],
      params: { radiusTop: 0.025, radiusBottom: 0.03, height: 0.12, radialSegments: 16 },
      material: {
        color: '#3E2723',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * Square Pouf with Legs (Elevated Cushioned Seat)
 * Composition: Square cushion elevated on 4 small wooden legs
 * Modern ottoman style with visible leg structure
 */
export const POUF_SQUARE_LEGS: BaseObjectDefinition = {
  id: 'pouf_square_legs',
  type: RoomElementType.SEATING,
  name: 'Square Pouf with Legs',
  description: 'Cushioned square ottoman elevated on 4 wooden legs',
  defaultDimensions: [0.5, 0.5, 0.45], // 50cm × 50cm × 45cm (slightly taller due to legs)
  supportsInstancing: true,
  parts: [
    // Main cushion body (elevated)
    {
      type: 'box',
      position: [0, 0.32, 0], // Higher position due to legs
      params: { width: 0.48, height: 0.35, depth: 0.48 },
      material: {
        color: '#8B4513', // Saddle brown
        metalness: 0.1,
        roughness: 0.9, // Very rough for fabric texture
      },
    },
    // Top cushion padding (slightly smaller, raised)
    {
      type: 'box',
      position: [0, 0.495, 0],
      params: { width: 0.46, height: 0.03, depth: 0.46 },
      material: {
        color: '#A0522D', // Sienna (lighter brown)
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Leg front-left
    {
      type: 'cylinder',
      position: [-0.19, 0.08, 0.19],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.16, radialSegments: 16 },
      material: {
        color: '#3E2723', // Dark wood
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg front-right
    {
      type: 'cylinder',
      position: [0.19, 0.08, 0.19],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.16, radialSegments: 16 },
      material: {
        color: '#3E2723',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg back-left
    {
      type: 'cylinder',
      position: [-0.19, 0.08, -0.19],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.16, radialSegments: 16 },
      material: {
        color: '#3E2723',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Leg back-right
    {
      type: 'cylinder',
      position: [0.19, 0.08, -0.19],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.16, radialSegments: 16 },
      material: {
        color: '#3E2723',
        metalness: 0.3,
        roughness: 0.7,
      },
    },
  ],
};

/**
 * Square Pouf with Metal Legs (Low Profile Cushioned Seat)
 * Composition: Black leather cushion on 4 short metallic legs (5cm)
 * Contemporary style with chrome/steel finish
 */
export const POUF_SQUARE_METAL_LEGS: BaseObjectDefinition = {
  id: 'pouf_square_metal_legs',
  type: RoomElementType.SEATING,
  name: 'Square Pouf with Metal Legs',
  description: 'Black leather ottoman on short metallic legs',
  defaultDimensions: [0.5, 0.5, 0.4], // 50cm × 50cm × 40cm (5cm legs)
  supportsInstancing: true,
  parts: [
    // Main cushion body (black leather on short metal legs)
    {
      type: 'box',
      position: [0, 0.225, 0], // 5cm legs (0.05) + half cushion height (0.175) = 0.225
      params: { width: 0.48, height: 0.35, depth: 0.48 },
      material: {
        color: '#1C1C1C', // Very dark gray (black leather)
        metalness: 0.15,
        roughness: 0.7, // Leather has some shine
      },
    },
    // Top cushion padding (slightly lighter black for depth)
    {
      type: 'box',
      position: [0, 0.4, 0],
      params: { width: 0.46, height: 0.03, depth: 0.46 },
      material: {
        color: '#2A2A2A', // Slightly lighter for contrast
        metalness: 0.2,
        roughness: 0.65,
      },
    },
    // Metal Leg front-left (5cm = 0.05m height, positioned at Y = 0.025 which is half the leg height)
    {
      type: 'cylinder',
      position: [-0.20, 0.025, 0.20], // Positioned at corners under cushion
      params: { radiusTop: 0.015, radiusBottom: 0.02, height: 0.05, radialSegments: 16 },
      material: {
        color: '#C0C0C0', // Silver/Chrome
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Metal Leg front-right
    {
      type: 'cylinder',
      position: [0.20, 0.025, 0.20],
      params: { radiusTop: 0.015, radiusBottom: 0.02, height: 0.05, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Metal Leg back-left
    {
      type: 'cylinder',
      position: [-0.20, 0.025, -0.20],
      params: { radiusTop: 0.015, radiusBottom: 0.02, height: 0.05, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Metal Leg back-right
    {
      type: 'cylinder',
      position: [0.20, 0.025, -0.20],
      params: { radiusTop: 0.015, radiusBottom: 0.02, height: 0.05, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * LAPTOP_CHARGING_CABINET (Simplified)
 * White box laptop container with front doors
 * Square front face (width = height), shallow depth
 * Doors open downward like an oven (handles at top of each door)
 * Upper door: 50%, Gap: 10%, Lower door: 40%
 */
export const LAPTOP_CHARGING_CABINET: BaseObjectDefinition = {
  id: 'laptop_charging_cabinet',
  type: RoomElementType.TECH_DEVICES,
  name: 'Laptop Container',
  description: 'Simple white box laptop storage container with oven-style front doors',
  defaultDimensions: [0.85, 0.11, 0.85], // 85cm width (15% smaller), 11cm depth (10% thicker), 85cm height
  supportsInstancing: true,
  parts: [
    // Main box body - white
    {
      type: 'box',
      position: [0, 0.425, 0], // Center at half height (85cm / 2)
      params: { width: 0.85, height: 0.85, depth: 0.11 },
      material: {
        color: '#FFFFFF', // White
        metalness: 0.1,
        roughness: 0.6,
      },
    },

    // Upper door (50% of front area) - opens downward like oven door
    // Height: 0.425m (50%), positioned from 0.425m to 0.85m from bottom
    {
      type: 'box',
      position: [0, 0.6375, 0.056], // Slightly forward from box (depth 0.11 / 2 + 0.001)
      params: { width: 0.83, height: 0.415, depth: 0.002 },
      material: {
        color: '#F5F5F5', // Slightly off-white for door
        metalness: 0.05,
        roughness: 0.7,
      },
    },

    // Upper door handle (horizontal bar at TOP of door)
    {
      type: 'box',
      position: [0, 0.82, 0.058], // Near top of upper door (for oven-style opening)
      params: { width: 0.17, height: 0.012, depth: 0.012 },
      material: {
        color: '#888888', // Gray handle
        metalness: 0.6,
        roughness: 0.4,
      },
    },

    // Gap between doors (10% of front area)
    // This is just the main box showing through, no separate part needed

    // Lower door (40% of front area) - opens downward like oven door
    // Height: 0.34m (40%), positioned from 0m to 0.34m from bottom
    {
      type: 'box',
      position: [0, 0.17, 0.056], // Slightly forward from box
      params: { width: 0.83, height: 0.33, depth: 0.002 },
      material: {
        color: '#F5F5F5', // Slightly off-white for door
        metalness: 0.05,
        roughness: 0.7,
      },
    },

    // Lower door handle (horizontal bar at TOP of door)
    {
      type: 'box',
      position: [0, 0.32, 0.058], // Near top of lower door (for oven-style opening)
      params: { width: 0.15, height: 0.01, depth: 0.01 },
      material: {
        color: '#888888', // Gray handle
        metalness: 0.6,
        roughness: 0.4,
      },
    },
  ],
};

/**
 * LAPTOP_13_INCH
 * 13" compact laptop (MacBook Air 13", Dell XPS 13 style)
 * Dimensions: 30cm wide × 21cm deep × 1.5cm thick (closed)
 * Slim aluminum unibody design with screen, keyboard, and trackpad
 */
export const LAPTOP_13_INCH: BaseObjectDefinition = {
  id: 'laptop_13_inch',
  type: RoomElementType.TECH_DEVICES,
  name: '13" Laptop',
  description: 'Compact 13-inch ultrabook laptop',
  defaultDimensions: [0.30, 0.21, 0.015], // 30cm wide, 21cm deep, 1.5cm thick
  supportsInstancing: true,
  parts: [
    // Base (bottom half) - silver aluminum
    {
      type: 'box',
      position: [0, 0.0075, 0], // Center at half height
      params: { width: 0.30, height: 0.015, depth: 0.21 },
      material: {
        color: '#C0C0C0', // Silver aluminum
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Keyboard area (slightly darker)
    {
      type: 'box',
      position: [0, 0.016, 0],
      params: { width: 0.28, height: 0.001, depth: 0.19 },
      material: {
        color: '#2C2C2C', // Dark keyboard area
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Trackpad
    {
      type: 'box',
      position: [0, 0.016, 0.05],
      params: { width: 0.10, height: 0.001, depth: 0.07 },
      material: {
        color: '#B0B0B0', // Light gray trackpad
        metalness: 0.4,
        roughness: 0.2,
      },
    },
    // Screen bezel (when closed, thin lid)
    {
      type: 'box',
      position: [0, 0.0225, 0],
      params: { width: 0.298, height: 0.007, depth: 0.208 },
      material: {
        color: '#D0D0D0', // Lighter aluminum lid
        metalness: 0.7,
        roughness: 0.25,
      },
    },
  ],
};

/**
 * LAPTOP_14_INCH
 * 14" business laptop (ThinkPad, HP EliteBook style)
 * Dimensions: 32cm wide × 22cm deep × 1.8cm thick (closed)
 * Professional black finish
 */
export const LAPTOP_14_INCH: BaseObjectDefinition = {
  id: 'laptop_14_inch',
  type: RoomElementType.TECH_DEVICES,
  name: '14" Laptop',
  description: 'Standard 14-inch business laptop',
  defaultDimensions: [0.32, 0.22, 0.018], // 32cm wide, 22cm deep, 1.8cm thick
  supportsInstancing: true,
  parts: [
    // Base (bottom half) - matte black
    {
      type: 'box',
      position: [0, 0.009, 0],
      params: { width: 0.32, height: 0.018, depth: 0.22 },
      material: {
        color: '#2C2C2C', // Matte black
        metalness: 0.2,
        roughness: 0.7,
      },
    },
    // Keyboard area
    {
      type: 'box',
      position: [0, 0.019, 0],
      params: { width: 0.30, height: 0.001, depth: 0.20 },
      material: {
        color: '#1A1A1A', // Darker keyboard area
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Trackpad
    {
      type: 'box',
      position: [0, 0.019, 0.05],
      params: { width: 0.11, height: 0.001, depth: 0.08 },
      material: {
        color: '#404040', // Dark gray trackpad
        metalness: 0.3,
        roughness: 0.4,
      },
    },
    // Screen lid (when closed)
    {
      type: 'box',
      position: [0, 0.027, 0],
      params: { width: 0.318, height: 0.008, depth: 0.218 },
      material: {
        color: '#1C1C1C', // Black lid
        metalness: 0.3,
        roughness: 0.6,
      },
    },
  ],
};

/**
 * LAPTOP_15_INCH
 * 15.6" mainstream laptop (most common size)
 * Dimensions: 36cm wide × 25cm deep × 2cm thick (closed)
 * Gray/silver finish
 */
export const LAPTOP_15_INCH: BaseObjectDefinition = {
  id: 'laptop_15_inch',
  type: RoomElementType.TECH_DEVICES,
  name: '15" Laptop',
  description: 'Popular 15.6-inch laptop',
  defaultDimensions: [0.36, 0.25, 0.020], // 36cm wide, 25cm deep, 2cm thick
  supportsInstancing: true,
  parts: [
    // Base (bottom half) - dark gray
    {
      type: 'box',
      position: [0, 0.010, 0],
      params: { width: 0.36, height: 0.020, depth: 0.25 },
      material: {
        color: '#505050', // Dark gray
        metalness: 0.3,
        roughness: 0.6,
      },
    },
    // Keyboard area with numpad
    {
      type: 'box',
      position: [0, 0.021, 0],
      params: { width: 0.34, height: 0.001, depth: 0.23 },
      material: {
        color: '#2A2A2A', // Dark keyboard
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Trackpad (centered below keyboard)
    {
      type: 'box',
      position: [0, 0.021, 0.08],
      params: { width: 0.12, height: 0.001, depth: 0.09 },
      material: {
        color: '#606060', // Medium gray trackpad
        metalness: 0.3,
        roughness: 0.3,
      },
    },
    // Screen lid
    {
      type: 'box',
      position: [0, 0.030, 0],
      params: { width: 0.358, height: 0.009, depth: 0.248 },
      material: {
        color: '#585858', // Medium gray lid
        metalness: 0.4,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * LAPTOP_16_INCH
 * 16" premium laptop (MacBook Pro 16", Dell XPS 17 style)
 * Dimensions: 36cm wide × 25cm deep × 1.7cm thick (closed)
 * Premium space gray aluminum finish
 */
export const LAPTOP_16_INCH: BaseObjectDefinition = {
  id: 'laptop_16_inch',
  type: RoomElementType.TECH_DEVICES,
  name: '16" Laptop',
  description: 'Premium 16-inch laptop',
  defaultDimensions: [0.36, 0.25, 0.017], // 36cm wide, 25cm deep, 1.7cm thick
  supportsInstancing: true,
  parts: [
    // Base (bottom half) - space gray aluminum
    {
      type: 'box',
      position: [0, 0.0085, 0],
      params: { width: 0.36, height: 0.017, depth: 0.25 },
      material: {
        color: '#8A8A8A', // Space gray
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Keyboard area (black keys)
    {
      type: 'box',
      position: [0, 0.018, 0],
      params: { width: 0.34, height: 0.001, depth: 0.23 },
      material: {
        color: '#1A1A1A', // Black keyboard
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Large trackpad
    {
      type: 'box',
      position: [0, 0.018, 0.08],
      params: { width: 0.14, height: 0.001, depth: 0.10 },
      material: {
        color: '#A0A0A0', // Light gray trackpad
        metalness: 0.5,
        roughness: 0.2,
      },
    },
    // Screen lid
    {
      type: 'box',
      position: [0, 0.0255, 0],
      params: { width: 0.358, height: 0.008, depth: 0.248 },
      material: {
        color: '#909090', // Space gray lid
        metalness: 0.7,
        roughness: 0.25,
      },
    },
  ],
};

/**
 * MACBOOK_PRO_13
 * MacBook Pro 13" (2020-2024 models)
 * Dimensions: 30.4cm wide × 21.2cm deep × 1.56cm thick
 * Space Gray aluminum unibody, premium finish
 */
export const MACBOOK_PRO_13: BaseObjectDefinition = {
  id: 'macbook_pro_13',
  type: RoomElementType.TECH_DEVICES,
  name: 'MacBook Pro 13"',
  description: 'Apple MacBook Pro 13-inch laptop',
  defaultDimensions: [0.304, 0.212, 0.0156],
  supportsInstancing: true,
  parts: [
    // Base - space gray aluminum
    {
      type: 'box',
      position: [0, 0.0078, 0],
      params: { width: 0.304, height: 0.0156, depth: 0.212 },
      material: {
        color: '#7D7D7D', // Space gray
        metalness: 0.8,
        roughness: 0.25,
      },
    },
    // Keyboard area (black keys)
    {
      type: 'box',
      position: [0, 0.0165, 0],
      params: { width: 0.284, height: 0.001, depth: 0.19 },
      material: {
        color: '#0A0A0A',
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Large Force Touch trackpad
    {
      type: 'box',
      position: [0, 0.0165, 0.055],
      params: { width: 0.125, height: 0.001, depth: 0.085 },
      material: {
        color: '#9D9D9D',
        metalness: 0.6,
        roughness: 0.15,
      },
    },
    // Lid
    {
      type: 'box',
      position: [0, 0.0234, 0],
      params: { width: 0.302, height: 0.007, depth: 0.210 },
      material: {
        color: '#858585',
        metalness: 0.8,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * MACBOOK_PRO_14
 * MacBook Pro 14" (M1 Pro/Max, M2 Pro/Max, M3 Pro/Max)
 * Dimensions: 31.26cm wide × 22.12cm deep × 1.55cm thick
 * Space Black or Silver aluminum
 */
export const MACBOOK_PRO_14: BaseObjectDefinition = {
  id: 'macbook_pro_14',
  type: RoomElementType.TECH_DEVICES,
  name: 'MacBook Pro 14"',
  description: 'Apple MacBook Pro 14-inch laptop',
  defaultDimensions: [0.3126, 0.2212, 0.0155],
  supportsInstancing: true,
  parts: [
    // Base - space black aluminum
    {
      type: 'box',
      position: [0, 0.00775, 0],
      params: { width: 0.3126, height: 0.0155, depth: 0.2212 },
      material: {
        color: '#3A3A3A', // Space black
        metalness: 0.85,
        roughness: 0.2,
      },
    },
    // Keyboard
    {
      type: 'box',
      position: [0, 0.0163, 0],
      params: { width: 0.29, height: 0.001, depth: 0.20 },
      material: {
        color: '#0D0D0D',
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Force Touch trackpad
    {
      type: 'box',
      position: [0, 0.0163, 0.058],
      params: { width: 0.140, height: 0.001, depth: 0.095 },
      material: {
        color: '#4D4D4D',
        metalness: 0.7,
        roughness: 0.15,
      },
    },
    // Lid
    {
      type: 'box',
      position: [0, 0.0233, 0],
      params: { width: 0.3106, height: 0.007, depth: 0.2192 },
      material: {
        color: '#424242',
        metalness: 0.85,
        roughness: 0.18,
      },
    },
  ],
};

/**
 * MACBOOK_PRO_16
 * MacBook Pro 16" (M1 Pro/Max, M2 Pro/Max, M3 Pro/Max)
 * Dimensions: 35.57cm wide × 24.81cm deep × 1.68cm thick
 * Premium flagship laptop
 */
export const MACBOOK_PRO_16: BaseObjectDefinition = {
  id: 'macbook_pro_16',
  type: RoomElementType.TECH_DEVICES,
  name: 'MacBook Pro 16"',
  description: 'Apple MacBook Pro 16-inch laptop',
  defaultDimensions: [0.3557, 0.2481, 0.0168],
  supportsInstancing: true,
  parts: [
    // Base - space black aluminum
    {
      type: 'box',
      position: [0, 0.0084, 0],
      params: { width: 0.3557, height: 0.0168, depth: 0.2481 },
      material: {
        color: '#3A3A3A',
        metalness: 0.85,
        roughness: 0.2,
      },
    },
    // Keyboard
    {
      type: 'box',
      position: [0, 0.0176, 0],
      params: { width: 0.33, height: 0.001, depth: 0.225 },
      material: {
        color: '#0D0D0D',
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Large Force Touch trackpad
    {
      type: 'box',
      position: [0, 0.0176, 0.075],
      params: { width: 0.160, height: 0.001, depth: 0.105 },
      material: {
        color: '#4D4D4D',
        metalness: 0.7,
        roughness: 0.15,
      },
    },
    // Lid
    {
      type: 'box',
      position: [0, 0.0252, 0],
      params: { width: 0.3537, height: 0.008, depth: 0.2461 },
      material: {
        color: '#424242',
        metalness: 0.85,
        roughness: 0.18,
      },
    },
  ],
};

/**
 * DELL_XPS_13
 * Dell XPS 13 - Premium ultrabook
 * Silver aluminum chassis with carbon fiber palm rest and InfinityEdge display
 * Dimensions: 30.2cm × 19.9cm × 1.58cm
 */
export const DELL_XPS_13: BaseObjectDefinition = {
  id: 'dell_xps_13',
  type: RoomElementType.TECH_DEVICES,
  name: 'Dell XPS 13',
  description: 'Premium Dell XPS 13 ultrabook with carbon fiber',
  defaultDimensions: [0.302, 0.199, 0.0158],
  supportsInstancing: true,
  parts: [
    // Base - platinum silver aluminum
    {
      type: 'box',
      position: [0, 0.0079, 0],
      params: { width: 0.302, height: 0.0158, depth: 0.199 },
      material: {
        color: '#DCDCDC', // Platinum silver
        metalness: 0.75,
        roughness: 0.25,
      },
    },
    // Carbon fiber palm rest (black woven texture)
    {
      type: 'box',
      position: [0, 0.0166, 0.05],
      params: { width: 0.28, height: 0.001, depth: 0.12 },
      material: {
        color: '#0D0D0D', // Carbon fiber black
        metalness: 0.3,
        roughness: 0.7,
      },
    },
    // Keyboard area
    {
      type: 'box',
      position: [0, 0.0166, -0.03],
      params: { width: 0.28, height: 0.001, depth: 0.16 },
      material: {
        color: '#1A1A1A',
        metalness: 0.05,
        roughness: 0.9,
      },
    },
    // Precision touchpad (glass)
    {
      type: 'box',
      position: [0, 0.0167, 0.07],
      params: { width: 0.105, height: 0.001, depth: 0.065 },
      material: {
        color: '#2A2A2A',
        metalness: 0.6,
        roughness: 0.1,
      },
    },
    // Lid with Dell logo area
    {
      type: 'box',
      position: [0, 0.0237, 0],
      params: { width: 0.300, height: 0.007, depth: 0.197 },
      material: {
        color: '#E8E8E8',
        metalness: 0.75,
        roughness: 0.2,
      },
    },
    // Dell logo (center of lid)
    {
      type: 'cylinder',
      position: [0, 0.0275, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 0.001, radialSegments: 16 },
      material: {
        color: '#007DB8', // Dell blue
        metalness: 0.8,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * HP_PAVILION_GAMING
 * HP Pavilion Gaming Laptop
 * Shadow black with acid green accents, angular design, HP Omen-style
 * Dimensions: 36cm × 26cm × 2.35cm
 */
export const HP_PAVILION_GAMING: BaseObjectDefinition = {
  id: 'hp_pavilion_gaming',
  type: RoomElementType.TECH_DEVICES,
  name: 'HP Pavilion Gaming',
  description: 'HP gaming laptop with acid green accents',
  defaultDimensions: [0.36, 0.26, 0.0235],
  supportsInstancing: true,
  parts: [
    // Base - shadow black
    {
      type: 'box',
      position: [0, 0.01175, 0],
      params: { width: 0.36, height: 0.0235, depth: 0.26 },
      material: {
        color: '#1C1C1C', // Shadow black
        metalness: 0.3,
        roughness: 0.6,
      },
    },
    // Green accent stripe (left side)
    {
      type: 'box',
      position: [-0.17, 0.0243, 0],
      params: { width: 0.008, height: 0.001, depth: 0.24 },
      material: {
        color: '#76FF03', // Acid green
        metalness: 0.4,
        roughness: 0.5,
        emissive: '#76FF03',
        emissiveIntensity: 0.3,
      },
    },
    // Green accent stripe (right side)
    {
      type: 'box',
      position: [0.17, 0.0243, 0],
      params: { width: 0.008, height: 0.001, depth: 0.24 },
      material: {
        color: '#76FF03',
        metalness: 0.4,
        roughness: 0.5,
        emissive: '#76FF03',
        emissiveIntensity: 0.3,
      },
    },
    // Keyboard (backlit)
    {
      type: 'box',
      position: [0, 0.0244, 0],
      params: { width: 0.32, height: 0.001, depth: 0.22 },
      material: {
        color: '#0A0A0A',
        metalness: 0.05,
        roughness: 0.95,
        emissive: '#00FF00',
        emissiveIntensity: 0.15,
      },
    },
    // Trackpad
    {
      type: 'box',
      position: [0, 0.0244, 0.09],
      params: { width: 0.11, height: 0.001, depth: 0.08 },
      material: {
        color: '#2D2D2D',
        metalness: 0.3,
        roughness: 0.4,
      },
    },
    // Lid
    {
      type: 'box',
      position: [0, 0.0353, 0],
      params: { width: 0.358, height: 0.010, depth: 0.258 },
      material: {
        color: '#242424',
        metalness: 0.35,
        roughness: 0.55,
      },
    },
    // HP logo (center top of lid)
    {
      type: 'cylinder',
      position: [0, 0.0408, -0.11],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.012, height: 0.002, radialSegments: 16 },
      material: {
        color: '#76FF03',
        metalness: 0.7,
        roughness: 0.2,
        emissive: '#76FF03',
        emissiveIntensity: 0.4,
      },
    },
    // Rear vent grilles (gaming cooling)
    {
      type: 'box',
      position: [0, 0.0117, -0.128],
      params: { width: 0.30, height: 0.015, depth: 0.004 },
      material: {
        color: '#0D0D0D',
        metalness: 0.5,
        roughness: 0.8,
      },
    },
  ],
};

/**
 * ASUS_ROG_STRIX
 * ASUS ROG (Republic of Gamers) Strix Gaming Laptop
 * RGB lighting zones, aggressive gamer aesthetic, red accents
 * Dimensions: 36cm × 27.5cm × 2.7cm
 */
export const ASUS_ROG_STRIX: BaseObjectDefinition = {
  id: 'asus_rog_strix',
  type: RoomElementType.TECH_DEVICES,
  name: 'ASUS ROG Strix',
  description: 'Gaming laptop with RGB lighting and aggressive design',
  defaultDimensions: [0.36, 0.275, 0.027],
  supportsInstancing: true,
  parts: [
    // Base - gunmetal gray
    {
      type: 'box',
      position: [0, 0.0135, 0],
      params: { width: 0.36, height: 0.027, depth: 0.275 },
      material: {
        color: '#3D3D3D', // Gunmetal
        metalness: 0.6,
        roughness: 0.4,
      },
    },
    // RGB light bar (front edge)
    {
      type: 'box',
      position: [0, 0.0135, 0.1375],
      params: { width: 0.35, height: 0.004, depth: 0.006 },
      material: {
        color: '#FF0080', // RGB pink/magenta
        metalness: 0.3,
        roughness: 0.5,
        emissive: '#FF0080',
        emissiveIntensity: 0.6,
      },
    },
    // Per-key RGB keyboard
    {
      type: 'box',
      position: [0, 0.0278, 0],
      params: { width: 0.33, height: 0.001, depth: 0.24 },
      material: {
        color: '#050505',
        metalness: 0.05,
        roughness: 0.95,
        emissive: '#00FFFF', // RGB cyan
        emissiveIntensity: 0.4,
      },
    },
    // WASD keys highlight (gamers)
    {
      type: 'box',
      position: [-0.09, 0.0279, -0.02],
      params: { width: 0.025, height: 0.001, depth: 0.03 },
      material: {
        color: '#FF0000',
        metalness: 0.1,
        roughness: 0.9,
        emissive: '#FF0000',
        emissiveIntensity: 0.5,
      },
    },
    // Trackpad
    {
      type: 'box',
      position: [0.08, 0.0278, 0.09],
      params: { width: 0.09, height: 0.001, depth: 0.07 },
      material: {
        color: '#3A3A3A',
        metalness: 0.4,
        roughness: 0.3,
      },
    },
    // Lid with angular design
    {
      type: 'box',
      position: [0, 0.0405, 0],
      params: { width: 0.358, height: 0.012, depth: 0.273 },
      material: {
        color: '#2A2A2A',
        metalness: 0.5,
        roughness: 0.5,
      },
    },
    // ROG logo (glowing red)
    {
      type: 'cylinder',
      position: [0, 0.0470, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.025, radiusBottom: 0.025, height: 0.003, radialSegments: 20 },
      material: {
        color: '#FF0000', // ROG red
        metalness: 0.6,
        roughness: 0.3,
        emissive: '#FF0000',
        emissiveIntensity: 0.7,
      },
    },
    // Diagonal accent lines (gamer aesthetic)
    {
      type: 'box',
      position: [-0.12, 0.0470, 0.08],
      rotation: [0, 0, Math.PI / 6],
      params: { width: 0.08, height: 0.002, depth: 0.002 },
      material: {
        color: '#FF3333',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    {
      type: 'box',
      position: [0.12, 0.0470, 0.08],
      rotation: [0, 0, -Math.PI / 6],
      params: { width: 0.08, height: 0.002, depth: 0.002 },
      material: {
        color: '#FF3333',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * RAZER_BLADE_15
 * Razer Blade 15 - Sleek gaming laptop
 * Matte black CNC aluminum with Razer green logo and RGB
 * Dimensions: 35.5cm × 23.5cm × 1.78cm
 */
export const RAZER_BLADE_15: BaseObjectDefinition = {
  id: 'razer_blade_15',
  type: RoomElementType.TECH_DEVICES,
  name: 'Razer Blade 15',
  description: 'Sleek Razer gaming laptop with green accents',
  defaultDimensions: [0.355, 0.235, 0.0178],
  supportsInstancing: true,
  parts: [
    // Base - CNC matte black aluminum
    {
      type: 'box',
      position: [0, 0.0089, 0],
      params: { width: 0.355, height: 0.0178, depth: 0.235 },
      material: {
        color: '#0A0A0A', // Deep matte black
        metalness: 0.5,
        roughness: 0.7,
      },
    },
    // Per-key RGB Chroma keyboard
    {
      type: 'box',
      position: [0, 0.0186, 0],
      params: { width: 0.32, height: 0.001, depth: 0.21 },
      material: {
        color: '#000000',
        metalness: 0.05,
        roughness: 0.95,
        emissive: '#00FF00', // Razer green RGB
        emissiveIntensity: 0.35,
      },
    },
    // Glass precision touchpad
    {
      type: 'box',
      position: [0, 0.0187, 0.08],
      params: { width: 0.13, height: 0.001, depth: 0.09 },
      material: {
        color: '#1A1A1A',
        metalness: 0.7,
        roughness: 0.1,
      },
    },
    // Lid
    {
      type: 'box',
      position: [0, 0.0267, 0],
      params: { width: 0.353, height: 0.008, depth: 0.233 },
      material: {
        color: '#0D0D0D',
        metalness: 0.6,
        roughness: 0.6,
      },
    },
    // Razer logo (glowing green snake)
    {
      type: 'cylinder',
      position: [0, 0.0312, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.020, radiusBottom: 0.020, height: 0.002, radialSegments: 24 },
      material: {
        color: '#00FF00', // Razer green
        metalness: 0.8,
        roughness: 0.2,
        emissive: '#00FF00',
        emissiveIntensity: 0.8,
      },
    },
    // Razer wordmark (below logo)
    {
      type: 'box',
      position: [0, 0.0312, 0.035],
      params: { width: 0.08, height: 0.001, depth: 0.008 },
      material: {
        color: '#00FF00',
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#00FF00',
        emissiveIntensity: 0.4,
      },
    },
  ],
};

/**
 * LENOVO_LEGION_5
 * Lenovo Legion 5 Gaming Laptop
 * Blue accents, Y-logo design, balanced gaming aesthetic
 * Dimensions: 36.3cm × 26cm × 2.6cm
 */
export const LENOVO_LEGION_5: BaseObjectDefinition = {
  id: 'lenovo_legion_5',
  type: RoomElementType.TECH_DEVICES,
  name: 'Lenovo Legion 5',
  description: 'Lenovo gaming laptop with blue Legion accents',
  defaultDimensions: [0.363, 0.260, 0.026],
  supportsInstancing: true,
  parts: [
    // Base - phantom blue / storm gray
    {
      type: 'box',
      position: [0, 0.013, 0],
      params: { width: 0.363, height: 0.026, depth: 0.260 },
      material: {
        color: '#2E3A4A', // Phantom blue gray
        metalness: 0.4,
        roughness: 0.6,
      },
    },
    // Blue accent bar (rear hinge)
    {
      type: 'box',
      position: [0, 0.013, -0.129],
      params: { width: 0.35, height: 0.008, depth: 0.006 },
      material: {
        color: '#3F51B5', // Legion blue
        metalness: 0.5,
        roughness: 0.4,
        emissive: '#3F51B5',
        emissiveIntensity: 0.3,
      },
    },
    // TrueStrike keyboard with white backlight
    {
      type: 'box',
      position: [0, 0.0268, 0],
      params: { width: 0.34, height: 0.001, depth: 0.23 },
      material: {
        color: '#0F0F0F',
        metalness: 0.05,
        roughness: 0.9,
        emissive: '#FFFFFF', // White backlight
        emissiveIntensity: 0.25,
      },
    },
    // Trackpad
    {
      type: 'box',
      position: [0, 0.0268, 0.09],
      params: { width: 0.12, height: 0.001, depth: 0.08 },
      material: {
        color: '#353535',
        metalness: 0.3,
        roughness: 0.4,
      },
    },
    // Lid
    {
      type: 'box',
      position: [0, 0.0390, 0],
      params: { width: 0.361, height: 0.011, depth: 0.258 },
      material: {
        color: '#323E4C',
        metalness: 0.45,
        roughness: 0.55,
      },
    },
    // Legion Y-logo
    {
      type: 'cylinder',
      position: [0, 0.0450, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.022, radiusBottom: 0.022, height: 0.002, radialSegments: 20 },
      material: {
        color: '#5C6BC0', // Light legion blue
        metalness: 0.7,
        roughness: 0.3,
        emissive: '#5C6BC0',
        emissiveIntensity: 0.5,
      },
    },
  ],
};

/**
 * TABLE_LAMP_LUXURY_GOLD
 * Luxury table lamp for nightlife venues
 * Gold finish with white dome shade, modern upscale design
 * Dimensions: 25cm base × 45cm tall
 */
export const TABLE_LAMP_LUXURY_GOLD: BaseObjectDefinition = {
  id: 'table_lamp_luxury_gold',
  type: RoomElementType.DECORATION,
  name: 'Luxury Gold Table Lamp',
  description: 'Upscale gold table lamp with white dome shade',
  defaultDimensions: [0.25, 0.25, 0.45],
  supportsInstancing: true,
  parts: [
    // Base (round gold)
    {
      type: 'cylinder',
      position: [0, 0.02, 0],
      params: { radiusTop: 0.08, radiusBottom: 0.08, height: 0.04, radialSegments: 32 },
      material: {
        color: '#D4AF37', // Gold
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Stem (gold rod)
    {
      type: 'cylinder',
      position: [0, 0.23, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.38, radialSegments: 16 },
      material: {
        color: '#C5A028',
        metalness: 0.85,
        roughness: 0.25,
      },
    },
    // Lampshade (white cone - realistic tapered shade)
    {
      type: 'cone',
      position: [0, 0.40, 0],
      rotation: [Math.PI, 0, 0], // Flip upside down
      params: { radius: 0.10, height: 0.10, radialSegments: 32 },
      material: {
        color: '#FEFEFE',
        metalness: 0,
        roughness: 0.7,
        emissive: '#FFF9E6',
        emissiveIntensity: 0.3,
      },
    },
    // Gold decorative ring at shade base
    {
      type: 'torus',
      position: [0, 0.35, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radius: 0.101, tubeRadius: 0.004, radialSegments: 16, tubularSegments: 48 },
      material: {
        color: '#D4AF37',
        metalness: 0.9,
        roughness: 0.15,
      },
    },
  ],
};

/**
 * TABLE_LAMP_MODERN_BLACK
 * Modern minimalist table lamp
 * Matte black with warm LED glow
 * Dimensions: 20cm base × 38cm tall
 */
export const TABLE_LAMP_MODERN_BLACK: BaseObjectDefinition = {
  id: 'table_lamp_modern_black',
  type: RoomElementType.DECORATION,
  name: 'Modern Black Table Lamp',
  description: 'Minimalist matte black table lamp with warm glow',
  defaultDimensions: [0.20, 0.20, 0.38],
  supportsInstancing: true,
  parts: [
    // Base (cylindrical matte black)
    {
      type: 'cylinder',
      position: [0, 0.015, 0],
      params: { radiusTop: 0.065, radiusBottom: 0.065, height: 0.03, radialSegments: 32 },
      material: {
        color: '#1A1A1A',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Stem
    {
      type: 'cylinder',
      position: [0, 0.18, 0],
      params: { radiusTop: 0.008, radiusBottom: 0.01, height: 0.33, radialSegments: 16 },
      material: {
        color: '#2C2C2C',
        metalness: 0.2,
        roughness: 0.85,
      },
    },
    // Shade (black cone - modern minimalist)
    {
      type: 'cone',
      position: [0, 0.335, 0],
      rotation: [Math.PI, 0, 0], // Flip upside down
      params: { radius: 0.085, height: 0.09, radialSegments: 32 },
      material: {
        color: '#0D0D0D',
        metalness: 0.05,
        roughness: 0.95,
        emissive: '#FFD580',
        emissiveIntensity: 0.25,
      },
    },
  ],
};

/**
 * TABLE_LAMP_CRYSTAL
 * Crystal/glass luxury table lamp
 * Clear crystal base with chrome accents
 * Dimensions: 22cm base × 42cm tall
 */
export const TABLE_LAMP_CRYSTAL: BaseObjectDefinition = {
  id: 'table_lamp_crystal',
  type: RoomElementType.DECORATION,
  name: 'Crystal Table Lamp',
  description: 'Elegant crystal table lamp with chrome finish',
  defaultDimensions: [0.22, 0.22, 0.42],
  supportsInstancing: true,
  parts: [
    // Base (chrome)
    {
      type: 'cylinder',
      position: [0, 0.018, 0],
      params: { radiusTop: 0.075, radiusBottom: 0.075, height: 0.036, radialSegments: 32 },
      material: {
        color: '#E0E0E0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Crystal stem (transparent with refraction)
    {
      type: 'cylinder',
      position: [0, 0.20, 0],
      params: { radiusTop: 0.018, radiusBottom: 0.018, height: 0.33, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.05,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Shade (white silk cone)
    {
      type: 'cone',
      position: [0, 0.37, 0],
      rotation: [Math.PI, 0, 0], // Flip upside down
      params: { radius: 0.095, height: 0.10, radialSegments: 32 },
      material: {
        color: '#FFFEF7',
        metalness: 0,
        roughness: 0.75,
        emissive: '#FFFAED',
        emissiveIntensity: 0.35,
      },
    },
    // Chrome decorative ring at shade base
    {
      type: 'torus',
      position: [0, 0.32, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radius: 0.096, tubeRadius: 0.003, radialSegments: 16, tubularSegments: 48 },
      material: {
        color: '#F0F0F0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
  ],
};

/**
 * TABLE_LAMP_SQUARE_BASE
 * Modern table lamp with square base and tapered cylindrical shade
 * Matte black finish with warm LED glow
 * Dimensions: 15cm × 15cm base × 25cm tall
 */
export const TABLE_LAMP_SQUARE_BASE: BaseObjectDefinition = {
  id: 'table_lamp_square_base',
  type: RoomElementType.DECORATION,
  name: 'Square Base Table Lamp',
  description: 'Modern black table lamp with square base and tapered shade',
  defaultDimensions: [0.15, 0.15, 0.25],
  supportsInstancing: true,
  parts: [
    // Square base (matte black)
    {
      type: 'box',
      position: [0, 0.015, 0],
      params: { width: 0.15, height: 0.03, depth: 0.15 },
      material: {
        color: '#1A1A1A',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Vertical stem/pole (matte black cylinder)
    {
      type: 'cylinder',
      position: [0, 0.115, 0],
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 0.17, radialSegments: 16 },
      material: {
        color: '#2C2C2C',
        metalness: 0.2,
        roughness: 0.85,
      },
    },
    // Lampshade (tapered cylinder - smaller top, wider bottom)
    {
      type: 'cylinder',
      position: [0, 0.215, 0],
      params: { radiusTop: 0.04, radiusBottom: 0.07, height: 0.07, radialSegments: 32 },
      material: {
        color: '#0D0D0D',
        metalness: 0.05,
        roughness: 0.95,
        emissive: '#FFD580',
        emissiveIntensity: 0.3,
      },
    },
  ],
};

/**
 * VERTICAL_DISPLAY_PORTRAIT
 * Vertical portrait display (9:16 aspect ratio)
 * Digital signage, menu boards, advertising screens
 * Dimensions: 60cm wide × 5cm deep × 107cm tall (27" portrait)
 */
export const VERTICAL_DISPLAY_PORTRAIT: BaseObjectDefinition = {
  id: 'vertical_display_portrait',
  type: RoomElementType.TV,
  name: 'Portrait Display (27")',
  description: 'Vertical portrait orientation digital signage display',
  defaultDimensions: [0.60, 0.05, 1.07],
  supportsInstancing: true,
  parts: [
    // Screen frame (black bezel)
    {
      type: 'box',
      position: [0, 0.535, 0],
      params: { width: 0.60, height: 1.07, depth: 0.04 },
      material: {
        color: '#0A0A0A',
        metalness: 0.3,
        roughness: 0.6,
      },
    },
    // Active screen area (bright display)
    {
      type: 'box',
      position: [0, 0.535, 0.021],
      params: { width: 0.56, height: 1.00, depth: 0.001 },
      material: {
        color: '#FFFFFF',
        metalness: 0.05,
        roughness: 0.2,
        emissive: '#E0E0FF',
        emissiveIntensity: 0.5,
      },
    },
  ],
};

/**
 * VERTICAL_DISPLAY_ULTRA_WIDE
 * Ultra-wide vertical display (9:21 aspect ratio)
 * Slim vertical display for menus/advertising
 * Dimensions: 50cm wide × 5cm deep × 117cm tall
 */
export const VERTICAL_DISPLAY_ULTRA_WIDE: BaseObjectDefinition = {
  id: 'vertical_display_ultra_wide',
  type: RoomElementType.TV,
  name: 'Ultra Vertical Display',
  description: 'Extra-tall slim vertical display for signage',
  defaultDimensions: [0.50, 0.05, 1.17],
  supportsInstancing: true,
  parts: [
    // Frame
    {
      type: 'box',
      position: [0, 0.585, 0],
      params: { width: 0.50, height: 1.17, depth: 0.04 },
      material: {
        color: '#1A1A1A',
        metalness: 0.4,
        roughness: 0.5,
      },
    },
    // Screen
    {
      type: 'box',
      position: [0, 0.585, 0.021],
      params: { width: 0.47, height: 1.10, depth: 0.001 },
      material: {
        color: '#F0F0F0',
        metalness: 0.05,
        roughness: 0.25,
        emissive: '#D0D0FF',
        emissiveIntensity: 0.45,
      },
    },
  ],
};

/**
 * VERTICAL_DISPLAY_SQUARE
 * Square vertical display (1:1 aspect ratio)
 * Unique square format for special content
 * Dimensions: 80cm wide × 5cm deep × 80cm tall
 */
export const VERTICAL_DISPLAY_SQUARE: BaseObjectDefinition = {
  id: 'vertical_display_square',
  type: RoomElementType.TV,
  name: 'Square Display',
  description: '1:1 square format display screen',
  defaultDimensions: [0.80, 0.05, 0.80],
  supportsInstancing: true,
  parts: [
    // Frame
    {
      type: 'box',
      position: [0, 0.40, 0],
      params: { width: 0.80, height: 0.80, depth: 0.04 },
      material: {
        color: '#0F0F0F',
        metalness: 0.35,
        roughness: 0.55,
      },
    },
    // Screen
    {
      type: 'box',
      position: [0, 0.40, 0.021],
      params: { width: 0.76, height: 0.76, depth: 0.001 },
      material: {
        color: '#FAFAFA',
        metalness: 0.05,
        roughness: 0.22,
        emissive: '#FFE0E0',
        emissiveIntensity: 0.42,
      },
    },
  ],
};

// ==========================================
// LIGHTING ELEMENTS
// ==========================================

/**
 * COLORED_BULB_AMBER
 * Warm amber Edison-style hanging bulb
 * Dimensions: 6cm diameter × 10cm tall
 */
export const COLORED_BULB_AMBER: BaseObjectDefinition = {
  id: 'colored_bulb_amber',
  type: RoomElementType.LIGHTING,
  name: 'Amber Bulb',
  description: 'Warm amber hanging light bulb',
  defaultDimensions: [0.06, 0.06, 0.10],
  supportsInstancing: true,
  parts: [
    // Bulb glass (amber sphere)
    {
      type: 'sphere',
      position: [0, 0.05, 0],
      params: { radius: 0.03, widthSegments: 20, heightSegments: 16 },
      material: {
        color: '#FFB347',
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#FF8C00',
        emissiveIntensity: 0.8,
        opacity: 0.7,
        transparent: true,
      },
    },
    // Metal socket base
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: {
        color: '#8B7355',
        metalness: 0.6,
        roughness: 0.4,
      },
    },
  ],
};

/**
 * COLORED_BULB_RED
 * Red party/mood lighting bulb
 */
export const COLORED_BULB_RED: BaseObjectDefinition = {
  id: 'colored_bulb_red',
  type: RoomElementType.LIGHTING,
  name: 'Red Bulb',
  description: 'Red mood lighting bulb',
  defaultDimensions: [0.06, 0.06, 0.10],
  supportsInstancing: true,
  parts: [
    {
      type: 'sphere',
      position: [0, 0.05, 0],
      params: { radius: 0.03, widthSegments: 20, heightSegments: 16 },
      material: {
        color: '#FF0000',
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#FF0000',
        emissiveIntensity: 0.9,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: { color: '#8B7355', metalness: 0.6, roughness: 0.4 },
    },
  ],
};

/**
 * COLORED_BULB_BLUE
 * Blue ambient lighting bulb
 */
export const COLORED_BULB_BLUE: BaseObjectDefinition = {
  id: 'colored_bulb_blue',
  type: RoomElementType.LIGHTING,
  name: 'Blue Bulb',
  description: 'Blue ambient lighting bulb',
  defaultDimensions: [0.06, 0.06, 0.10],
  supportsInstancing: true,
  parts: [
    {
      type: 'sphere',
      position: [0, 0.05, 0],
      params: { radius: 0.03, widthSegments: 20, heightSegments: 16 },
      material: {
        color: '#0080FF',
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#0080FF',
        emissiveIntensity: 0.9,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: { color: '#8B7355', metalness: 0.6, roughness: 0.4 },
    },
  ],
};

/**
 * COLORED_BULB_GREEN
 * Green accent lighting bulb
 */
export const COLORED_BULB_GREEN: BaseObjectDefinition = {
  id: 'colored_bulb_green',
  type: RoomElementType.LIGHTING,
  name: 'Green Bulb',
  description: 'Green accent lighting bulb',
  defaultDimensions: [0.06, 0.06, 0.10],
  supportsInstancing: true,
  parts: [
    {
      type: 'sphere',
      position: [0, 0.05, 0],
      params: { radius: 0.03, widthSegments: 20, heightSegments: 16 },
      material: {
        color: '#00FF00',
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#00FF00',
        emissiveIntensity: 0.85,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: { color: '#8B7355', metalness: 0.6, roughness: 0.4 },
    },
  ],
};

/**
 * COLORED_BULB_PURPLE
 * Purple/magenta party lighting bulb
 */
export const COLORED_BULB_PURPLE: BaseObjectDefinition = {
  id: 'colored_bulb_purple',
  type: RoomElementType.LIGHTING,
  name: 'Purple Bulb',
  description: 'Purple party lighting bulb',
  defaultDimensions: [0.06, 0.06, 0.10],
  supportsInstancing: true,
  parts: [
    {
      type: 'sphere',
      position: [0, 0.05, 0],
      params: { radius: 0.03, widthSegments: 20, heightSegments: 16 },
      material: {
        color: '#FF00FF',
        metalness: 0.1,
        roughness: 0.3,
        emissive: '#FF00FF',
        emissiveIntensity: 0.9,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: { color: '#8B7355', metalness: 0.6, roughness: 0.4 },
    },
  ],
};

/**
 * COLORED_BULB_WHITE
 * Bright white LED bulb
 */
export const COLORED_BULB_WHITE: BaseObjectDefinition = {
  id: 'colored_bulb_white',
  type: RoomElementType.LIGHTING,
  name: 'White LED Bulb',
  description: 'Bright white LED bulb',
  defaultDimensions: [0.06, 0.06, 0.10],
  supportsInstancing: true,
  parts: [
    {
      type: 'sphere',
      position: [0, 0.05, 0],
      params: { radius: 0.03, widthSegments: 20, heightSegments: 16 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.2,
        emissive: '#FFFFFF',
        emissiveIntensity: 1.0,
        opacity: 0.8,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: { color: '#E0E0E0', metalness: 0.7, roughness: 0.3 },
    },
  ],
};

/**
 * NEON_STRIP_STRAIGHT_50CM
 * Straight neon tube strip - 50cm
 * Oriented horizontally along Z-axis (depth/front-back direction)
 */
export const NEON_STRIP_STRAIGHT_50CM: BaseObjectDefinition = {
  id: 'neon_strip_straight_50cm',
  type: RoomElementType.LIGHTING,
  name: 'Neon Strip 50cm (Teal)',
  description: 'Straight neon tube strip 50cm teal',
  defaultDimensions: [0.02, 0.50, 0.02], // width, depth (length along Z), height
  supportsInstancing: true,
  parts: [
    {
      type: 'cylinder',
      position: [0, 0, 0], // At ground level - prevents elevation change when scaled
      rotation: [Math.PI / 2, 0, 0], // Rotated to lie along Z-axis
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 0.50, radialSegments: 16 },
      material: {
        color: '#14B8A6',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#14B8A6',
        emissiveIntensity: 1.2,
        opacity: 0.8,
        transparent: true,
      },
    },
  ],
};

/**
 * NEON_STRIP_STRAIGHT_1M
 * Straight neon tube strip - 1 meter
 * Oriented horizontally along Z-axis (depth/front-back direction)
 */
export const NEON_STRIP_STRAIGHT_1M: BaseObjectDefinition = {
  id: 'neon_strip_straight_1m',
  type: RoomElementType.LIGHTING,
  name: 'Neon Strip 1m (Pink)',
  description: 'Straight neon tube strip 1 meter pink',
  defaultDimensions: [0.02, 1.0, 0.02], // width, depth (length along Z), height
  supportsInstancing: true,
  parts: [
    {
      type: 'cylinder',
      position: [0, 0, 0], // At ground level - prevents elevation change when scaled
      rotation: [Math.PI / 2, 0, 0], // Rotated to lie along Z-axis
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 1.0, radialSegments: 16 },
      material: {
        color: '#FF007F',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#FF007F',
        emissiveIntensity: 1.2,
        opacity: 0.8,
        transparent: true,
      },
    },
  ],
};

/**
 * NEON_STRIP_STRAIGHT_2M
 * Straight neon tube strip - 2 meters
 * Oriented horizontally along Z-axis (depth/front-back direction)
 */
export const NEON_STRIP_STRAIGHT_2M: BaseObjectDefinition = {
  id: 'neon_strip_straight_2m',
  type: RoomElementType.LIGHTING,
  name: 'Neon Strip 2m (Blue)',
  description: 'Straight neon tube strip 2 meters blue',
  defaultDimensions: [0.02, 2.0, 0.02], // width, depth (length along Z), height
  supportsInstancing: true,
  parts: [
    {
      type: 'cylinder',
      position: [0, 0, 0], // At ground level - prevents elevation change when scaled
      rotation: [Math.PI / 2, 0, 0], // Rotated to lie along Z-axis
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 2.0, radialSegments: 16 },
      material: {
        color: '#0080FF',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#0080FF',
        emissiveIntensity: 1.2,
        opacity: 0.8,
        transparent: true,
      },
    },
  ],
};

/**
 * NEON_STRIP_CIRCLE
 * Circular neon ring using full torus
 */
export const NEON_STRIP_CIRCLE: BaseObjectDefinition = {
  id: 'neon_strip_circle',
  type: RoomElementType.LIGHTING,
  name: 'Neon Circle (Purple)',
  description: 'Circular neon ring 40cm diameter',
  defaultDimensions: [0.40, 0.02, 0.40],
  supportsInstancing: true,
  parts: [
    {
      type: 'torus',
      position: [0, 0, 0], // At ground level - prevents elevation change when scaled
      rotation: [Math.PI / 2, 0, 0],
      params: { radius: 0.20, tubeRadius: 0.008, radialSegments: 16, tubularSegments: 64 },
      material: {
        color: '#9D4EDD',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#9D4EDD',
        emissiveIntensity: 1.3,
        opacity: 0.85,
        transparent: true,
      },
    },
  ],
};

/**
 * NEON_STRIP_L_SHAPE
 * L-shaped neon corner piece
 */
export const NEON_STRIP_L_SHAPE: BaseObjectDefinition = {
  id: 'neon_strip_l_shape',
  type: RoomElementType.LIGHTING,
  name: 'Neon L-Shape (Red)',
  description: 'L-shaped neon corner 50cm each side',
  defaultDimensions: [0.50, 0.02, 0.50],
  supportsInstancing: true,
  parts: [
    // Horizontal segment (along X-axis)
    {
      type: 'cylinder',
      position: [0.125, 0, 0], // At ground level - prevents elevation change when scaled
      rotation: [0, 0, Math.PI / 2],
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 0.25, radialSegments: 16 },
      material: {
        color: '#FF0040',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#FF0040',
        emissiveIntensity: 1.2,
        opacity: 0.8,
        transparent: true,
      },
    },
    // Vertical segment (along Z-axis)
    {
      type: 'cylinder',
      position: [0, 0, 0.125], // At ground level - prevents elevation change when scaled
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.008, radiusBottom: 0.008, height: 0.25, radialSegments: 16 },
      material: {
        color: '#FF0040',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#FF0040',
        emissiveIntensity: 1.2,
        opacity: 0.8,
        transparent: true,
      },
    },
    // Corner junction (small sphere)
    {
      type: 'sphere',
      position: [0, 0, 0], // At ground level - prevents elevation change when scaled
      params: { radius: 0.009, widthSegments: 12, heightSegments: 8 },
      material: {
        color: '#FF0040',
        metalness: 0.2,
        roughness: 0.3,
        emissive: '#FF0040',
        emissiveIntensity: 1.3,
        opacity: 0.85,
        transparent: true,
      },
    },
  ],
};

/**
 * LED_STRIP_50CM
 * Flat LED strip 50cm
 */
export const LED_STRIP_50CM: BaseObjectDefinition = {
  id: 'led_strip_50cm',
  type: RoomElementType.LIGHTING,
  name: 'LED Strip 50cm (RGB)',
  description: 'Flat LED strip 50cm with RGB',
  defaultDimensions: [0.50, 0.01, 0.02],
  supportsInstancing: true,
  parts: [
    // Base strip (white PCB)
    {
      type: 'box',
      position: [0, 0.005, 0],
      params: { width: 0.50, height: 0.01, depth: 0.015 },
      material: {
        color: '#F0F0F0',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // LED light surface
    {
      type: 'box',
      position: [0, 0.0105, 0],
      params: { width: 0.48, height: 0.001, depth: 0.012 },
      material: {
        color: '#00FFFF',
        metalness: 0.05,
        roughness: 0.2,
        emissive: '#00FFFF',
        emissiveIntensity: 1.0,
      },
    },
  ],
};

/**
 * LED_STRIP_1M
 * Flat LED strip 1 meter
 */
export const LED_STRIP_1M: BaseObjectDefinition = {
  id: 'led_strip_1m',
  type: RoomElementType.LIGHTING,
  name: 'LED Strip 1m (White)',
  description: 'Flat LED strip 1 meter white',
  defaultDimensions: [1.0, 0.01, 0.02],
  supportsInstancing: true,
  parts: [
    {
      type: 'box',
      position: [0, 0.005, 0],
      params: { width: 1.0, height: 0.01, depth: 0.015 },
      material: {
        color: '#F0F0F0',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    {
      type: 'box',
      position: [0, 0.0105, 0],
      params: { width: 0.98, height: 0.001, depth: 0.012 },
      material: {
        color: '#FFFFFF',
        metalness: 0.05,
        roughness: 0.2,
        emissive: '#FFFFFF',
        emissiveIntensity: 1.1,
      },
    },
  ],
};

/**
 * LED_STRIP_2M
 * Flat LED strip 2 meters
 */
export const LED_STRIP_2M: BaseObjectDefinition = {
  id: 'led_strip_2m',
  type: RoomElementType.LIGHTING,
  name: 'LED Strip 2m (Amber)',
  description: 'Flat LED strip 2 meters amber',
  defaultDimensions: [2.0, 0.01, 0.02],
  supportsInstancing: true,
  parts: [
    {
      type: 'box',
      position: [0, 0.005, 0],
      params: { width: 2.0, height: 0.01, depth: 0.015 },
      material: {
        color: '#F0F0F0',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    {
      type: 'box',
      position: [0, 0.0105, 0],
      params: { width: 1.98, height: 0.001, depth: 0.012 },
      material: {
        color: '#FFB347',
        metalness: 0.05,
        roughness: 0.2,
        emissive: '#FFB347',
        emissiveIntensity: 0.9,
      },
    },
  ],
};

// ==========================================
// BAR GLASSWARE
// ==========================================

/**
 * MARTINI_GLASS
 * Classic V-shaped martini/cocktail glass
 */
export const MARTINI_GLASS: BaseObjectDefinition = {
  id: 'martini_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Martini Glass',
  description: 'Classic V-shaped cocktail glass',
  defaultDimensions: [0.10, 0.10, 0.15],
  supportsInstancing: true,
  parts: [
    // Base (circular foot)
    {
      type: 'cylinder',
      position: [0, 0.005, 0],
      params: { radiusTop: 0.035, radiusBottom: 0.035, height: 0.01, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Stem
    {
      type: 'cylinder',
      position: [0, 0.05, 0],
      params: { radiusTop: 0.005, radiusBottom: 0.008, height: 0.08, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Bowl (inverted cone)
    {
      type: 'cone',
      position: [0, 0.115, 0],
      rotation: [Math.PI, 0, 0],
      params: { radius: 0.05, height: 0.07, radialSegments: 24, openEnded: false },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.25,
        transparent: true,
      },
    },
  ],
};

/**
 * HIGHBALL_GLASS
 * Tall straight glass for mixed drinks
 */
export const HIGHBALL_GLASS: BaseObjectDefinition = {
  id: 'highball_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Highball Glass',
  description: 'Tall glass for mixed drinks',
  defaultDimensions: [0.07, 0.07, 0.15],
  supportsInstancing: true,
  parts: [
    // Glass cylinder
    {
      type: 'cylinder',
      position: [0, 0.075, 0],
      params: { radiusTop: 0.032, radiusBottom: 0.03, height: 0.15, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.2,
        transparent: true,
      },
    },
    // Base (thick bottom)
    {
      type: 'cylinder',
      position: [0, 0.008, 0],
      params: { radiusTop: 0.03, radiusBottom: 0.03, height: 0.016, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.4,
        transparent: true,
      },
    },
  ],
};

/**
 * ROCKS_GLASS
 * Short tumbler for whiskey/spirits on rocks
 */
export const ROCKS_GLASS: BaseObjectDefinition = {
  id: 'rocks_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Rocks Glass',
  description: 'Short tumbler for whiskey on rocks',
  defaultDimensions: [0.08, 0.08, 0.09],
  supportsInstancing: true,
  parts: [
    // Glass body (slightly tapered)
    {
      type: 'cylinder',
      position: [0, 0.045, 0],
      params: { radiusTop: 0.038, radiusBottom: 0.035, height: 0.08, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.2,
        transparent: true,
      },
    },
    // Thick base
    {
      type: 'cylinder',
      position: [0, 0.008, 0],
      params: { radiusTop: 0.035, radiusBottom: 0.035, height: 0.016, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.4,
        transparent: true,
      },
    },
  ],
};

/**
 * SHOT_GLASS
 * Small shot glass
 */
export const SHOT_GLASS: BaseObjectDefinition = {
  id: 'shot_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Shot Glass',
  description: 'Small shot glass (50ml)',
  defaultDimensions: [0.05, 0.05, 0.06],
  supportsInstancing: true,
  parts: [
    {
      type: 'cylinder',
      position: [0, 0.03, 0],
      params: { radiusTop: 0.022, radiusBottom: 0.018, height: 0.055, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.25,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0, 0.005, 0],
      params: { radiusTop: 0.018, radiusBottom: 0.018, height: 0.01, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.4,
        transparent: true,
      },
    },
  ],
};

/**
 * WINE_GLASS
 * Standard wine glass
 */
export const WINE_GLASS: BaseObjectDefinition = {
  id: 'wine_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Wine Glass',
  description: 'Standard red wine glass',
  defaultDimensions: [0.09, 0.09, 0.20],
  supportsInstancing: true,
  parts: [
    // Base
    {
      type: 'cylinder',
      position: [0, 0.005, 0],
      params: { radiusTop: 0.03, radiusBottom: 0.03, height: 0.01, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Stem
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.004, radiusBottom: 0.006, height: 0.14, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Bowl (sphere-based)
    {
      type: 'sphere',
      position: [0, 0.165, 0],
      params: { radius: 0.045, widthSegments: 24, heightSegments: 20 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.2,
        transparent: true,
      },
    },
  ],
};

/**
 * CHAMPAGNE_FLUTE
 * Tall narrow champagne flute
 */
export const CHAMPAGNE_FLUTE: BaseObjectDefinition = {
  id: 'champagne_flute',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Champagne Flute',
  description: 'Tall narrow champagne glass',
  defaultDimensions: [0.06, 0.06, 0.22],
  supportsInstancing: true,
  parts: [
    // Base
    {
      type: 'cylinder',
      position: [0, 0.005, 0],
      params: { radiusTop: 0.025, radiusBottom: 0.025, height: 0.01, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Stem
    {
      type: 'cylinder',
      position: [0, 0.045, 0],
      params: { radiusTop: 0.004, radiusBottom: 0.005, height: 0.07, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Flute (narrow cylinder)
    {
      type: 'cylinder',
      position: [0, 0.145, 0],
      params: { radiusTop: 0.023, radiusBottom: 0.018, height: 0.13, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.2,
        transparent: true,
      },
    },
  ],
};

/**
 * BEER_PINT_GLASS
 * Standard pint glass
 */
export const BEER_PINT_GLASS: BaseObjectDefinition = {
  id: 'beer_pint_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Beer Pint Glass',
  description: 'Standard pint glass (568ml)',
  defaultDimensions: [0.08, 0.08, 0.16],
  supportsInstancing: true,
  parts: [
    // Glass body (tapered)
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.038, radiusBottom: 0.03, height: 0.15, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.2,
        transparent: true,
      },
    },
    // Base
    {
      type: 'cylinder',
      position: [0, 0.008, 0],
      params: { radiusTop: 0.03, radiusBottom: 0.03, height: 0.016, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.4,
        transparent: true,
      },
    },
  ],
};

/**
 * MARGARITA_GLASS
 * Wide rim margarita glass
 */
export const MARGARITA_GLASS: BaseObjectDefinition = {
  id: 'margarita_glass',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Margarita Glass',
  description: 'Wide rim margarita/coupette glass',
  defaultDimensions: [0.12, 0.12, 0.14],
  supportsInstancing: true,
  parts: [
    // Base
    {
      type: 'cylinder',
      position: [0, 0.005, 0],
      params: { radiusTop: 0.03, radiusBottom: 0.03, height: 0.01, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Stem
    {
      type: 'cylinder',
      position: [0, 0.04, 0],
      params: { radiusTop: 0.006, radiusBottom: 0.008, height: 0.06, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Bowl (wide inverted cone)
    {
      type: 'cone',
      position: [0, 0.10, 0],
      rotation: [Math.PI, 0, 0],
      params: { radius: 0.06, height: 0.06, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.05,
        roughness: 0.05,
        opacity: 0.2,
        transparent: true,
      },
    },
  ],
};

/**
 * COCKTAIL_SHAKER
 * Professional cocktail shaker (Boston style)
 */
export const COCKTAIL_SHAKER: BaseObjectDefinition = {
  id: 'cocktail_shaker',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Cocktail Shaker',
  description: 'Professional Boston-style cocktail shaker',
  defaultDimensions: [0.09, 0.09, 0.25],
  supportsInstancing: true,
  parts: [
    // Main tin (large tapered cylinder)
    {
      type: 'cylinder',
      position: [0, 0.125, 0],
      params: { radiusTop: 0.042, radiusBottom: 0.038, height: 0.24, radialSegments: 32 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Base rim
    {
      type: 'cylinder',
      position: [0, 0.01, 0],
      params: { radiusTop: 0.04, radiusBottom: 0.038, height: 0.01, radialSegments: 32 },
      material: {
        color: '#A8A8A8',
        metalness: 0.85,
        roughness: 0.25,
      },
    },
  ],
};

/**
 * ICE_BUCKET
 * Stainless steel ice bucket
 */
export const ICE_BUCKET: BaseObjectDefinition = {
  id: 'ice_bucket',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Ice Bucket',
  description: 'Stainless steel ice bucket with handles',
  defaultDimensions: [0.18, 0.18, 0.16],
  supportsInstancing: true,
  parts: [
    // Bucket body
    {
      type: 'cylinder',
      position: [0, 0.08, 0],
      params: { radiusTop: 0.085, radiusBottom: 0.075, height: 0.15, radialSegments: 32 },
      material: {
        color: '#E0E0E0',
        metalness: 0.95,
        roughness: 0.15,
      },
    },
    // Handle left (torus arc simulation with cylinder)
    {
      type: 'cylinder',
      position: [-0.09, 0.12, 0],
      rotation: [0, 0, Math.PI / 4],
      params: { radiusTop: 0.006, radiusBottom: 0.006, height: 0.05, radialSegments: 12 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Handle right
    {
      type: 'cylinder',
      position: [0.09, 0.12, 0],
      rotation: [0, 0, -Math.PI / 4],
      params: { radiusTop: 0.006, radiusBottom: 0.006, height: 0.05, radialSegments: 12 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Base
    {
      type: 'cylinder',
      position: [0, 0.008, 0],
      params: { radiusTop: 0.075, radiusBottom: 0.075, height: 0.016, radialSegments: 32 },
      material: {
        color: '#D0D0D0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * JIGGER
 * Double-sided measuring jigger
 */
export const JIGGER: BaseObjectDefinition = {
  id: 'jigger',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Jigger',
  description: 'Double-sided measuring jigger (25ml/50ml)',
  defaultDimensions: [0.05, 0.05, 0.08],
  supportsInstancing: true,
  parts: [
    // Small cup (25ml)
    {
      type: 'cone',
      position: [0, 0.02, 0],
      rotation: [Math.PI, 0, 0],
      params: { radius: 0.02, height: 0.035, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Large cup (50ml)
    {
      type: 'cone',
      position: [0, 0.06, 0],
      params: { radius: 0.025, height: 0.04, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Center connection
    {
      type: 'cylinder',
      position: [0, 0.04, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.012, height: 0.02, radialSegments: 12 },
      material: {
        color: '#B0B0B0',
        metalness: 0.85,
        roughness: 0.25,
      },
    },
  ],
};

/**
 * BAR_SPOON
 * Long bar mixing spoon
 */
export const BAR_SPOON: BaseObjectDefinition = {
  id: 'bar_spoon',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Bar Spoon',
  description: 'Long twisted bar mixing spoon',
  defaultDimensions: [0.02, 0.30, 0.02],
  supportsInstancing: true,
  parts: [
    // Handle (long thin cylinder)
    {
      type: 'cylinder',
      position: [0, 0.15, 0],
      params: { radiusTop: 0.002, radiusBottom: 0.002, height: 0.28, radialSegments: 12 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Spoon bowl (small sphere)
    {
      type: 'sphere',
      position: [0, 0.015, 0],
      params: { radius: 0.008, widthSegments: 12, heightSegments: 8 },
      material: {
        color: '#E0E0E0',
        metalness: 0.95,
        roughness: 0.15,
      },
    },
    // Top knob
    {
      type: 'sphere',
      position: [0, 0.295, 0],
      params: { radius: 0.004, widthSegments: 8, heightSegments: 6 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * MUDDLER
 * Bar muddler for crushing herbs/fruit
 */
export const MUDDLER: BaseObjectDefinition = {
  id: 'muddler',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Muddler',
  description: 'Wooden muddler for crushing ingredients',
  defaultDimensions: [0.03, 0.20, 0.03],
  supportsInstancing: true,
  parts: [
    // Handle (tapered cylinder)
    {
      type: 'cylinder',
      position: [0, 0.10, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.018, height: 0.18, radialSegments: 16 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Crushing head (flat cylinder)
    {
      type: 'cylinder',
      position: [0, 0.01, 0],
      params: { radiusTop: 0.018, radiusBottom: 0.018, height: 0.02, radialSegments: 16 },
      material: {
        color: '#654321',
        metalness: 0.05,
        roughness: 0.9,
      },
    },
  ],
};

/**
 * HAWTHORNE_STRAINER
 * Cocktail strainer with spring
 */
export const HAWTHORNE_STRAINER: BaseObjectDefinition = {
  id: 'hawthorne_strainer',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Hawthorne Strainer',
  description: 'Cocktail strainer with coil spring',
  defaultDimensions: [0.10, 0.10, 0.02],
  supportsInstancing: true,
  parts: [
    // Flat perforated disc
    {
      type: 'cylinder',
      position: [0, 0.01, 0],
      params: { radiusTop: 0.045, radiusBottom: 0.045, height: 0.003, radialSegments: 32 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Handle
    {
      type: 'box',
      position: [0.06, 0.01, 0],
      params: { width: 0.05, height: 0.003, depth: 0.015 },
      material: {
        color: '#A0A0A0',
        metalness: 0.85,
        roughness: 0.25,
      },
    },
    // Spring coil (torus)
    {
      type: 'torus',
      position: [0, 0.01, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radius: 0.042, tubeRadius: 0.003, radialSegments: 12, tubularSegments: 48 },
      material: {
        color: '#B8B8B8',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * BOTTLE_OPENER
 * Wall-mounted bottle opener
 */
export const BOTTLE_OPENER: BaseObjectDefinition = {
  id: 'bottle_opener',
  type: RoomElementType.BAR_EQUIPMENT,
  name: 'Bottle Opener',
  description: 'Professional bottle cap opener',
  defaultDimensions: [0.12, 0.04, 0.02],
  supportsInstancing: true,
  parts: [
    // Handle/body
    {
      type: 'box',
      position: [0, 0.02, 0],
      params: { width: 0.12, height: 0.04, depth: 0.015 },
      material: {
        color: '#A0A0A0',
        metalness: 0.85,
        roughness: 0.3,
      },
    },
    // Opening edge
    {
      type: 'box',
      position: [-0.05, 0.02, 0.008],
      params: { width: 0.03, height: 0.02, depth: 0.004 },
      material: {
        color: '#C0C0C0',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

// ==========================================
// SPIRIT BOTTLES
// ==========================================

/**
 * VODKA_BOTTLE_CLEAR
 * Clear vodka bottle (Absolut/Grey Goose style)
 */
export const VODKA_BOTTLE_CLEAR: BaseObjectDefinition = {
  id: 'vodka_bottle_clear',
  type: RoomElementType.BOTTLES,
  name: 'Vodka Bottle (Clear)',
  description: 'Premium clear vodka bottle 750ml',
  defaultDimensions: [0.08, 0.08, 0.30],
  supportsInstancing: true,
  parts: [
    // Main bottle body (capsule for rounded shape)
    {
      type: 'capsule',
      position: [0, 0.15, 0],
      params: { radius: 0.04, length: 0.24, capSegments: 8, radialSegments: 24 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.15,
        transparent: true,
      },
    },
    // Neck (tapered)
    {
      type: 'cylinder',
      position: [0, 0.26, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.025, height: 0.06, radialSegments: 16 },
      material: {
        color: '#F0F8FF',
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.2,
        transparent: true,
      },
    },
    // Cap/closure (black)
    {
      type: 'cylinder',
      position: [0, 0.295, 0],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.02, radialSegments: 16 },
      material: {
        color: '#1A1A1A',
        metalness: 0.3,
        roughness: 0.6,
      },
    },
    // Label (white box)
    {
      type: 'box',
      position: [0, 0.15, 0.041],
      params: { width: 0.06, height: 0.08, depth: 0.001 },
      material: {
        color: '#FFFFFF',
        metalness: 0,
        roughness: 0.9,
      },
    },
  ],
};

/**
 * WHISKEY_BOTTLE_SQUARE
 * Square whiskey bottle (Jack Daniel's style)
 */
export const WHISKEY_BOTTLE_SQUARE: BaseObjectDefinition = {
  id: 'whiskey_bottle_square',
  type: RoomElementType.BOTTLES,
  name: 'Whiskey Bottle (Square)',
  description: 'Square Tennessee whiskey bottle 750ml',
  defaultDimensions: [0.09, 0.09, 0.28],
  supportsInstancing: true,
  parts: [
    // Main body (square box)
    {
      type: 'box',
      position: [0, 0.14, 0],
      params: { width: 0.08, height: 0.24, depth: 0.08 },
      material: {
        color: '#2C1810',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.4,
        transparent: true,
      },
    },
    // Shoulder (tapered)
    {
      type: 'box',
      position: [0, 0.26, 0],
      params: { width: 0.06, height: 0.03, depth: 0.06 },
      material: {
        color: '#2C1810',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.4,
        transparent: true,
      },
    },
    // Neck
    {
      type: 'cylinder',
      position: [0, 0.285, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.018, height: 0.025, radialSegments: 16 },
      material: {
        color: '#2C1810',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.5,
        transparent: true,
      },
    },
    // Black label
    {
      type: 'box',
      position: [0, 0.15, 0.041],
      params: { width: 0.065, height: 0.12, depth: 0.001 },
      material: {
        color: '#000000',
        metalness: 0,
        roughness: 0.8,
      },
    },
  ],
};

/**
 * SCOTCH_BOTTLE_TALL
 * Tall scotch whisky bottle (Johnnie Walker style)
 */
export const SCOTCH_BOTTLE_TALL: BaseObjectDefinition = {
  id: 'scotch_bottle_tall',
  type: RoomElementType.BOTTLES,
  name: 'Scotch Bottle (Tall)',
  description: 'Tall scotch whisky bottle 750ml',
  defaultDimensions: [0.09, 0.09, 0.32],
  supportsInstancing: true,
  parts: [
    // Main body (tall rectangular)
    {
      type: 'box',
      position: [0, 0.16, 0],
      params: { width: 0.08, height: 0.28, depth: 0.08 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.35,
        transparent: true,
      },
    },
    // Shoulder taper
    {
      type: 'cylinder',
      position: [0, 0.305, 0],
      params: { radiusTop: 0.014, radiusBottom: 0.03, height: 0.025, radialSegments: 24 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.4,
        transparent: true,
      },
    },
    // Red label (Johnnie Walker signature)
    {
      type: 'box',
      position: [0, 0.18, 0.041],
      params: { width: 0.055, height: 0.10, depth: 0.001 },
      material: {
        color: '#DC143C',
        metalness: 0,
        roughness: 0.7,
      },
    },
    // Gold cap
    {
      type: 'cylinder',
      position: [0, 0.318, 0],
      params: { radiusTop: 0.016, radiusBottom: 0.016, height: 0.015, radialSegments: 16 },
      material: {
        color: '#FFD700',
        metalness: 0.85,
        roughness: 0.2,
      },
    },
  ],
};

/**
 * RUM_BOTTLE_DARK
 * Dark rum bottle (Bacardi/Captain Morgan style)
 */
export const RUM_BOTTLE_DARK: BaseObjectDefinition = {
  id: 'rum_bottle_dark',
  type: RoomElementType.BOTTLES,
  name: 'Dark Rum Bottle',
  description: 'Dark spiced rum bottle 750ml',
  defaultDimensions: [0.10, 0.10, 0.30],
  supportsInstancing: true,
  parts: [
    // Main body (rounded capsule)
    {
      type: 'capsule',
      position: [0, 0.15, 0],
      params: { radius: 0.045, length: 0.22, capSegments: 8, radialSegments: 24 },
      material: {
        color: '#4A2511',
        metalness: 0.15,
        roughness: 0.25,
        opacity: 0.5,
        transparent: true,
      },
    },
    // Neck
    {
      type: 'cylinder',
      position: [0, 0.265, 0],
      params: { radiusTop: 0.013, radiusBottom: 0.028, height: 0.05, radialSegments: 16 },
      material: {
        color: '#4A2511',
        metalness: 0.15,
        roughness: 0.25,
        opacity: 0.6,
        transparent: true,
      },
    },
    // Brown/gold label
    {
      type: 'box',
      position: [0, 0.15, 0.046],
      params: { width: 0.07, height: 0.10, depth: 0.001 },
      material: {
        color: '#D4AF37',
        metalness: 0.3,
        roughness: 0.6,
      },
    },
    // Black cap
    {
      type: 'cylinder',
      position: [0, 0.295, 0],
      params: { radiusTop: 0.016, radiusBottom: 0.016, height: 0.018, radialSegments: 16 },
      material: {
        color: '#1A1A1A',
        metalness: 0.4,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * TEQUILA_BOTTLE
 * Tequila bottle (Patrón/Don Julio style)
 */
export const TEQUILA_BOTTLE: BaseObjectDefinition = {
  id: 'tequila_bottle',
  type: RoomElementType.BOTTLES,
  name: 'Tequila Bottle',
  description: 'Premium tequila bottle 750ml',
  defaultDimensions: [0.12, 0.12, 0.28],
  supportsInstancing: true,
  parts: [
    // Main body (short wide capsule)
    {
      type: 'capsule',
      position: [0, 0.14, 0],
      params: { radius: 0.055, length: 0.18, capSegments: 8, radialSegments: 24 },
      material: {
        color: '#E8E4D0',
        metalness: 0.05,
        roughness: 0.15,
        opacity: 0.25,
        transparent: true,
      },
    },
    // Neck (wide)
    {
      type: 'cylinder',
      position: [0, 0.24, 0],
      params: { radiusTop: 0.016, radiusBottom: 0.035, height: 0.05, radialSegments: 20 },
      material: {
        color: '#E8E4D0',
        metalness: 0.05,
        roughness: 0.15,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Cork/wooden cap
    {
      type: 'cylinder',
      position: [0, 0.275, 0],
      params: { radiusTop: 0.020, radiusBottom: 0.020, height: 0.025, radialSegments: 16 },
      material: {
        color: '#8B7355',
        metalness: 0.1,
        roughness: 0.9,
      },
    },
    // Blue agave label
    {
      type: 'box',
      position: [0, 0.14, 0.056],
      params: { width: 0.08, height: 0.08, depth: 0.001 },
      material: {
        color: '#C0C0C0',
        metalness: 0.6,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * GIN_BOTTLE
 * Gin bottle (Tanqueray/Bombay style)
 */
export const GIN_BOTTLE: BaseObjectDefinition = {
  id: 'gin_bottle',
  type: RoomElementType.BOTTLES,
  name: 'Gin Bottle',
  description: 'London Dry Gin bottle 750ml',
  defaultDimensions: [0.09, 0.09, 0.30],
  supportsInstancing: true,
  parts: [
    // Main body (green-tinted capsule)
    {
      type: 'capsule',
      position: [0, 0.15, 0],
      params: { radius: 0.042, length: 0.22, capSegments: 8, radialSegments: 24 },
      material: {
        color: '#90EE90',
        metalness: 0.1,
        roughness: 0.15,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Neck
    {
      type: 'cylinder',
      position: [0, 0.265, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.026, height: 0.05, radialSegments: 16 },
      material: {
        color: '#90EE90',
        metalness: 0.1,
        roughness: 0.15,
        opacity: 0.35,
        transparent: true,
      },
    },
    // Red label/seal
    {
      type: 'box',
      position: [0, 0.15, 0.043],
      params: { width: 0.06, height: 0.09, depth: 0.001 },
      material: {
        color: '#DC143C',
        metalness: 0,
        roughness: 0.7,
      },
    },
    // Green cap
    {
      type: 'cylinder',
      position: [0, 0.295, 0],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.018, radialSegments: 16 },
      material: {
        color: '#2F4F2F',
        metalness: 0.4,
        roughness: 0.5,
      },
    },
  ],
};

/**
 * COGNAC_BOTTLE
 * Cognac/Brandy bottle (Hennessy/Rémy Martin style)
 */
export const COGNAC_BOTTLE: BaseObjectDefinition = {
  id: 'cognac_bottle',
  type: RoomElementType.BOTTLES,
  name: 'Cognac Bottle',
  description: 'Premium cognac bottle 700ml',
  defaultDimensions: [0.11, 0.11, 0.26],
  supportsInstancing: true,
  parts: [
    // Main body (distinctive cognac shape - wider at base)
    {
      type: 'sphere',
      position: [0, 0.13, 0],
      params: { radius: 0.055, widthSegments: 24, heightSegments: 20 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.4,
        transparent: true,
      },
    },
    // Neck (elegant taper)
    {
      type: 'cylinder',
      position: [0, 0.21, 0],
      params: { radiusTop: 0.014, radiusBottom: 0.038, height: 0.08, radialSegments: 20 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.45,
        transparent: true,
      },
    },
    // Gold label
    {
      type: 'box',
      position: [0, 0.13, 0.056],
      params: { width: 0.07, height: 0.07, depth: 0.001 },
      material: {
        color: '#FFD700',
        metalness: 0.7,
        roughness: 0.3,
      },
    },
    // Cork with gold foil
    {
      type: 'cylinder',
      position: [0, 0.255, 0],
      params: { radiusTop: 0.018, radiusBottom: 0.018, height: 0.025, radialSegments: 16 },
      material: {
        color: '#D4AF37',
        metalness: 0.8,
        roughness: 0.25,
      },
    },
  ],
};

/**
 * CHAMPAGNE_BOTTLE
 * Champagne bottle with traditional punt
 */
export const CHAMPAGNE_BOTTLE: BaseObjectDefinition = {
  id: 'champagne_bottle',
  type: RoomElementType.BOTTLES,
  name: 'Champagne Bottle',
  description: 'Champagne bottle 750ml',
  defaultDimensions: [0.09, 0.09, 0.32],
  supportsInstancing: true,
  parts: [
    // Main body (dark green cylinder)
    {
      type: 'cylinder',
      position: [0, 0.16, 0],
      params: { radiusTop: 0.04, radiusBottom: 0.042, height: 0.27, radialSegments: 32 },
      material: {
        color: '#2F4F2F',
        metalness: 0.15,
        roughness: 0.2,
        opacity: 0.5,
        transparent: true,
      },
    },
    // Shoulder/neck transition
    {
      type: 'cylinder',
      position: [0, 0.305, 0],
      params: { radiusTop: 0.013, radiusBottom: 0.035, height: 0.02, radialSegments: 24 },
      material: {
        color: '#2F4F2F',
        metalness: 0.15,
        roughness: 0.2,
        opacity: 0.55,
        transparent: true,
      },
    },
    // Long neck
    {
      type: 'cylinder',
      position: [0, 0.318, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.013, height: 0.008, radialSegments: 16 },
      material: {
        color: '#2F4F2F',
        metalness: 0.15,
        roughness: 0.2,
        opacity: 0.6,
        transparent: true,
      },
    },
    // Gold foil cap
    {
      type: 'cone',
      position: [0, 0.323, 0],
      params: { radius: 0.018, height: 0.015, radialSegments: 16 },
      material: {
        color: '#FFD700',
        metalness: 0.85,
        roughness: 0.2,
      },
    },
    // Gold/cream label
    {
      type: 'box',
      position: [0, 0.18, 0.043],
      params: { width: 0.06, height: 0.08, depth: 0.001 },
      material: {
        color: '#FFFACD',
        metalness: 0.2,
        roughness: 0.6,
      },
    },
  ],
};

/**
 * BEER_BOTTLE
 * Standard beer bottle
 */
export const BEER_BOTTLE: BaseObjectDefinition = {
  id: 'beer_bottle',
  type: RoomElementType.BOTTLES,
  name: 'Beer Bottle',
  description: 'Standard beer bottle 330ml',
  defaultDimensions: [0.07, 0.07, 0.24],
  supportsInstancing: true,
  parts: [
    // Main body (brown glass)
    {
      type: 'cylinder',
      position: [0, 0.12, 0],
      params: { radiusTop: 0.03, radiusBottom: 0.032, height: 0.20, radialSegments: 24 },
      material: {
        color: '#4A2511',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.5,
        transparent: true,
      },
    },
    // Neck
    {
      type: 'cylinder',
      position: [0, 0.235, 0],
      params: { radiusTop: 0.011, radiusBottom: 0.022, height: 0.03, radialSegments: 16 },
      material: {
        color: '#4A2511',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.6,
        transparent: true,
      },
    },
    // Bottle cap
    {
      type: 'cylinder',
      position: [0, 0.252, 0],
      params: { radiusTop: 0.013, radiusBottom: 0.013, height: 0.006, radialSegments: 16 },
      material: {
        color: '#D4AF37',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Label
    {
      type: 'box',
      position: [0, 0.14, 0.031],
      params: { width: 0.05, height: 0.08, depth: 0.001 },
      material: {
        color: '#FFFFFF',
        metalness: 0,
        roughness: 0.8,
      },
    },
  ],
};

/**
 * WINE_BOTTLE_RED
 * Red wine bottle (Bordeaux style)
 */
export const WINE_BOTTLE_RED: BaseObjectDefinition = {
  id: 'wine_bottle_red',
  type: RoomElementType.BOTTLES,
  name: 'Red Wine Bottle',
  description: 'Bordeaux-style red wine 750ml',
  defaultDimensions: [0.08, 0.08, 0.30],
  supportsInstancing: true,
  parts: [
    // Main body (dark green/black)
    {
      type: 'cylinder',
      position: [0, 0.15, 0],
      params: { radiusTop: 0.036, radiusBottom: 0.038, height: 0.26, radialSegments: 32 },
      material: {
        color: '#1A1A0F',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.45,
        transparent: true,
      },
    },
    // Shoulder
    {
      type: 'cylinder',
      position: [0, 0.285, 0],
      params: { radiusTop: 0.012, radiusBottom: 0.032, height: 0.025, radialSegments: 24 },
      material: {
        color: '#1A1A0F',
        metalness: 0.1,
        roughness: 0.2,
        opacity: 0.5,
        transparent: true,
      },
    },
    // Cork top
    {
      type: 'cylinder',
      position: [0, 0.302, 0],
      params: { radiusTop: 0.013, radiusBottom: 0.013, height: 0.015, radialSegments: 16 },
      material: {
        color: '#8B7355',
        metalness: 0.05,
        roughness: 0.95,
      },
    },
    // Wine label
    {
      type: 'box',
      position: [0, 0.18, 0.039],
      params: { width: 0.055, height: 0.10, depth: 0.001 },
      material: {
        color: '#F5DEB3',
        metalness: 0,
        roughness: 0.9,
      },
    },
  ],
};

// ==========================================
// STAIRS
// ==========================================

/**
 * Straight Staircase
 * Composition: Individual steps (treads + risers) + side stringers + handrail
 * Style: Modern architectural stairs with clean lines
 * Configuration: 14 steps, 20cm rise per step, 25cm tread depth
 * Dimensions: 1.2m wide, 3.5m deep (run), 2.8m tall (total rise)
 */
export const STAIRS_STRAIGHT: BaseObjectDefinition = {
  id: 'stairs_straight',
  type: RoomElementType.STAIRS,
  name: 'Straight Staircase',
  description: '14-step straight staircase with handrail',
  defaultDimensions: [1.2, 3.5, 2.8], // 1.2m wide, 3.5m run, 2.8m rise
  supportsInstancing: false,
  parts: [
    // === STEPS (14 steps total) ===
    // Step 1 (bottom)
    {
      type: 'box',
      position: [0, 0.1, 0],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513', // Saddle brown (wood)
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 2
    {
      type: 'box',
      position: [0, 0.3, -0.25],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 3
    {
      type: 'box',
      position: [0, 0.5, -0.5],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 4
    {
      type: 'box',
      position: [0, 0.7, -0.75],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 5
    {
      type: 'box',
      position: [0, 0.9, -1.0],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 6
    {
      type: 'box',
      position: [0, 1.1, -1.25],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 7
    {
      type: 'box',
      position: [0, 1.3, -1.5],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 8
    {
      type: 'box',
      position: [0, 1.5, -1.75],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 9
    {
      type: 'box',
      position: [0, 1.7, -2.0],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 10
    {
      type: 'box',
      position: [0, 1.9, -2.25],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 11
    {
      type: 'box',
      position: [0, 2.1, -2.5],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 12
    {
      type: 'box',
      position: [0, 2.3, -2.75],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 13
    {
      type: 'box',
      position: [0, 2.5, -3.0],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },
    // Step 14 (top)
    {
      type: 'box',
      position: [0, 2.7, -3.25],
      params: { width: 1.2, height: 0.2, depth: 0.25 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.8,
      },
    },

    // === SIDE STRINGERS (support structure) ===
    // Left stringer
    {
      type: 'box',
      position: [-0.55, 1.4, -1.625],
      rotation: [0, 0, -Math.atan(2.8 / 3.5)], // Angle matching stair slope
      params: { width: 0.08, height: 4.3, depth: 0.2 },
      material: {
        color: '#654321',
        metalness: 0.2,
        roughness: 0.7,
      },
    },
    // Right stringer
    {
      type: 'box',
      position: [0.55, 1.4, -1.625],
      rotation: [0, 0, -Math.atan(2.8 / 3.5)], // Angle matching stair slope
      params: { width: 0.08, height: 4.3, depth: 0.2 },
      material: {
        color: '#654321',
        metalness: 0.2,
        roughness: 0.7,
      },
    },

    // === HANDRAIL (metal railing on right side) ===
    // Main rail (angled)
    {
      type: 'cylinder',
      position: [0.6, 1.5, -1.625],
      rotation: [0, Math.atan(2.8 / 3.5), 0], // Angle matching stair slope
      params: { radiusTop: 0.025, radiusBottom: 0.025, height: 4.5, radialSegments: 16 },
      material: {
        color: '#475569', // Slate gray
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Bottom post
    {
      type: 'cylinder',
      position: [0.6, 0.5, 0.1],
      params: { radiusTop: 0.03, radiusBottom: 0.03, height: 1.0, radialSegments: 16 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
    // Top post
    {
      type: 'cylinder',
      position: [0.6, 2.3, -3.35],
      params: { radiusTop: 0.03, radiusBottom: 0.03, height: 1.0, radialSegments: 16 },
      material: {
        color: '#475569',
        metalness: 0.9,
        roughness: 0.2,
      },
    },
  ],
};

// ==========================================
// BATHROOM FIXTURES
// ==========================================

/**
 * Pedestal Sink
 * Composition: Basin (hemisphere/torus) + pedestal (tapered cylinder) + faucet + handles
 * Style: Classic white porcelain with chrome fixtures
 * Dimensions: 60cm wide, 50cm deep, 85cm tall
 */
export const SINK_PEDESTAL: BaseObjectDefinition = {
  id: 'sink_pedestal',
  type: RoomElementType.BATHROOM_FIXTURE,
  name: 'Pedestal Sink',
  description: 'Classic white pedestal sink with chrome faucet',
  defaultDimensions: [0.6, 0.5, 0.85], // 60cm wide, 50cm deep, 85cm tall
  supportsInstancing: true,
  parts: [
    // === BASIN (sink bowl) ===
    // Main bowl (sphere for rounded basin)
    {
      type: 'sphere',
      position: [0, 0.75, 0],
      scale: [1, 0.5, 1.2], // Flatten to make it bowl-shaped
      params: { radius: 0.25, widthSegments: 32, heightSegments: 16 },
      material: {
        color: '#FFFFFF', // White porcelain
        metalness: 0.1,
        roughness: 0.15, // Glossy ceramic finish
      },
    },
    // Basin rim (torus for rounded edge)
    {
      type: 'torus',
      position: [0, 0.77, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: { radius: 0.24, tubeRadius: 0.02, radialSegments: 32, tubularSegments: 32 },
      material: {
        color: '#FAFAFA',
        metalness: 0.15,
        roughness: 0.1,
      },
    },
    // Basin back splash (small wall behind faucet)
    {
      type: 'box',
      position: [0, 0.78, -0.22],
      params: { width: 0.5, height: 0.06, depth: 0.05 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.15,
      },
    },

    // === PEDESTAL (support column) ===
    // Main pedestal column (tapered)
    {
      type: 'cylinder',
      position: [0, 0.35, 0],
      params: { radiusTop: 0.12, radiusBottom: 0.15, height: 0.7, radialSegments: 24 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.15,
      },
    },
    // Pedestal base (wider)
    {
      type: 'cylinder',
      position: [0, 0.03, 0],
      params: { radiusTop: 0.15, radiusBottom: 0.18, height: 0.06, radialSegments: 24 },
      material: {
        color: '#F5F5F5',
        metalness: 0.1,
        roughness: 0.15,
      },
    },

    // === FAUCET ASSEMBLY (chrome finish) ===
    // Faucet base (mounting)
    {
      type: 'cylinder',
      position: [0, 0.78, -0.15],
      params: { radiusTop: 0.025, radiusBottom: 0.03, height: 0.02, radialSegments: 16 },
      material: {
        color: '#C0C0C0', // Chrome
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Faucet neck (vertical pipe)
    {
      type: 'cylinder',
      position: [0, 0.83, -0.15],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.08, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Faucet spout (angled forward)
    {
      type: 'cylinder',
      position: [0, 0.87, -0.08],
      rotation: [Math.PI / 3, 0, 0], // Angle downward
      params: { radiusTop: 0.012, radiusBottom: 0.018, height: 0.12, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },

    // === HOT/COLD HANDLES (chrome knobs) ===
    // Left handle (hot - slight red tint)
    {
      type: 'sphere',
      position: [-0.08, 0.80, -0.15],
      params: { radius: 0.018, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#B8B8B8',
        metalness: 0.9,
        roughness: 0.1,
      },
    },
    // Right handle (cold - slight blue tint)
    {
      type: 'sphere',
      position: [0.08, 0.80, -0.15],
      params: { radius: 0.018, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#B8B8B8',
        metalness: 0.9,
        roughness: 0.1,
      },
    },

    // === DRAIN (center of basin) ===
    {
      type: 'cylinder',
      position: [0, 0.72, 0],
      params: { radiusTop: 0.02, radiusBottom: 0.015, height: 0.01, radialSegments: 16 },
      material: {
        color: '#888888',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * Modern Toilet
 * Composition: Bowl (sphere+cylinder) + tank + seat + base + flush lever
 * Style: Contemporary ceramic with glossy finish
 * Dimensions: 70cm wide, 75cm deep, 75cm tall
 */
export const TOILET_MODERN: BaseObjectDefinition = {
  id: 'toilet_modern',
  type: RoomElementType.BATHROOM_FIXTURE,
  name: 'Modern Toilet',
  description: 'Contemporary white ceramic toilet',
  defaultDimensions: [0.7, 0.75, 0.75], // 70cm wide, 75cm deep, 75cm tall
  supportsInstancing: true,
  parts: [
    // === BOWL (toilet bowl) ===
    // Main bowl body (elongated sphere for bowl shape)
    {
      type: 'sphere',
      position: [0, 0.25, 0],
      scale: [1, 0.7, 1.3], // Elongate front-to-back
      params: { radius: 0.22, widthSegments: 32, heightSegments: 16 },
      material: {
        color: '#FFFFFF', // White ceramic
        metalness: 0.1,
        roughness: 0.12, // Very glossy
      },
    },
    // Bowl rim (top edge)
    {
      type: 'torus',
      position: [0, 0.38, 0],
      rotation: [Math.PI / 2, 0, 0],
      scale: [1, 1.3, 1], // Match bowl elongation
      params: { radius: 0.21, tubeRadius: 0.015, radialSegments: 32, tubularSegments: 32 },
      material: {
        color: '#FAFAFA',
        metalness: 0.15,
        roughness: 0.08,
      },
    },

    // === BASE (pedestal/floor connection) ===
    {
      type: 'cylinder',
      position: [0, 0.05, 0],
      params: { radiusTop: 0.20, radiusBottom: 0.25, height: 0.1, radialSegments: 24 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.12,
      },
    },

    // === TANK (back tank) ===
    // Main tank body
    {
      type: 'box',
      position: [0, 0.53, -0.23],
      params: { width: 0.42, height: 0.36, depth: 0.18 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.12,
      },
    },
    // Tank top (lid)
    {
      type: 'box',
      position: [0, 0.72, -0.23],
      params: { width: 0.44, height: 0.02, depth: 0.20 },
      material: {
        color: '#F5F5F5',
        metalness: 0.12,
        roughness: 0.10,
      },
    },

    // === SEAT (toilet seat - open position) ===
    // Seat ring (torus for seat shape)
    {
      type: 'torus',
      position: [0, 0.39, 0.02],
      rotation: [Math.PI / 2.5, 0, 0], // Slightly tilted up (open position)
      scale: [1, 1.2, 1],
      params: { radius: 0.18, tubeRadius: 0.025, radialSegments: 32, tubularSegments: 32 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.15,
      },
    },

    // === FLUSH LEVER (side of tank) ===
    // Lever arm
    {
      type: 'box',
      position: [-0.22, 0.60, -0.23],
      params: { width: 0.03, height: 0.08, depth: 0.02 },
      material: {
        color: '#C0C0C0', // Chrome
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Lever button/handle
    {
      type: 'cylinder',
      position: [-0.22, 0.64, -0.24],
      rotation: [Math.PI / 2, 0, 0],
      params: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.03, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
  ],
};

/**
 * Shower Stall
 * Composition: Floor pan + glass walls + frame + showerhead + drain
 * Style: Modern frameless glass enclosure
 * Dimensions: 1.0m wide, 1.0m deep, 2.2m tall
 */
export const SHOWER_STALL: BaseObjectDefinition = {
  id: 'shower_stall',
  type: RoomElementType.BATHROOM_FIXTURE,
  name: 'Shower Stall',
  description: 'Modern glass shower enclosure',
  defaultDimensions: [1.0, 1.0, 2.2], // 1m × 1m × 2.2m tall
  supportsInstancing: true,
  parts: [
    // === FLOOR PAN (shower base) ===
    {
      type: 'box',
      position: [0, 0.03, 0],
      params: { width: 1.0, height: 0.06, depth: 1.0 },
      material: {
        color: '#F5F5F5', // Light gray
        metalness: 0.1,
        roughness: 0.6,
      },
    },

    // === DRAIN (center of floor) ===
    {
      type: 'cylinder',
      position: [0, 0.061, 0],
      params: { radiusTop: 0.05, radiusBottom: 0.04, height: 0.002, radialSegments: 16 },
      material: {
        color: '#888888', // Gray metal
        metalness: 0.85,
        roughness: 0.3,
      },
    },

    // === GLASS WALLS (3 sides - front is open for entry) ===
    // Back wall
    {
      type: 'box',
      position: [0, 1.1, -0.49],
      params: { width: 1.0, height: 0.01, depth: 2.14 },
      material: {
        color: '#E0E0E0', // Light frosted glass
        metalness: 0.9,
        roughness: 0.08,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Left wall
    {
      type: 'box',
      position: [-0.49, 1.1, 0],
      params: { width: 0.01, height: 2.14, depth: 1.0 },
      material: {
        color: '#E0E0E0',
        metalness: 0.9,
        roughness: 0.08,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Right wall
    {
      type: 'box',
      position: [0.49, 1.1, 0],
      params: { width: 0.01, height: 2.14, depth: 1.0 },
      material: {
        color: '#E0E0E0',
        metalness: 0.9,
        roughness: 0.08,
        opacity: 0.3,
        transparent: true,
      },
    },

    // === FRAME (chrome/aluminum trim) ===
    // Top frame
    {
      type: 'box',
      position: [0, 2.17, 0],
      params: { width: 1.02, height: 0.04, depth: 1.02 },
      material: {
        color: '#C0C0C0', // Chrome
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Vertical corner frames
    {
      type: 'box',
      position: [-0.49, 1.1, -0.49],
      params: { width: 0.03, height: 0.03, depth: 2.14 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    {
      type: 'box',
      position: [0.49, 1.1, -0.49],
      params: { width: 0.03, height: 0.03, depth: 2.14 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },

    // === SHOWERHEAD ASSEMBLY (back wall, top) ===
    // Shower pipe (vertical)
    {
      type: 'cylinder',
      position: [0, 1.7, -0.45],
      params: { radiusTop: 0.015, radiusBottom: 0.015, height: 0.8, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Showerhead (angled)
    {
      type: 'cylinder',
      position: [0, 2.08, -0.42],
      rotation: [Math.PI / 6, 0, 0], // Angled downward
      params: { radiusTop: 0.08, radiusBottom: 0.06, height: 0.08, radialSegments: 24 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Showerhead face (spray plate)
    {
      type: 'cylinder',
      position: [0, 2.04, -0.38],
      rotation: [Math.PI / 6, 0, 0],
      params: { radiusTop: 0.085, radiusBottom: 0.085, height: 0.01, radialSegments: 24 },
      material: {
        color: '#888888',
        metalness: 0.8,
        roughness: 0.2,
      },
    },

    // === CONTROL HANDLES (wall-mounted) ===
    // Hot/cold mixer handle
    {
      type: 'sphere',
      position: [-0.15, 1.2, -0.44],
      params: { radius: 0.035, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
  ],
};

/**
 * Freestanding Bathtub
 * Composition: Tub body (multiple boxes for oval shape) + rim + feet + faucet
 * Style: Classic freestanding with claw feet
 * Dimensions: 1.7m wide, 0.8m deep, 0.6m tall
 */
export const BATHTUB_FREESTANDING: BaseObjectDefinition = {
  id: 'bathtub_freestanding',
  type: RoomElementType.BATHROOM_FIXTURE,
  name: 'Freestanding Bathtub',
  description: 'Classic freestanding tub with claw feet',
  defaultDimensions: [1.7, 0.8, 0.6], // 1.7m long, 0.8m wide, 0.6m tall
  supportsInstancing: true,
  parts: [
    // === TUB BODY (oval shape using multiple scaled boxes) ===
    // Center section
    {
      type: 'box',
      position: [0, 0.25, 0],
      params: { width: 0.70, height: 0.45, depth: 1.5 },
      material: {
        color: '#FFFFFF', // White acrylic/ceramic
        metalness: 0.1,
        roughness: 0.10, // Glossy finish
      },
    },
    // Left rounded end
    {
      type: 'sphere',
      position: [0, 0.25, -0.75],
      scale: [0.85, 0.9, 0.5],
      params: { radius: 0.4, widthSegments: 24, heightSegments: 16 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.10,
      },
    },
    // Right rounded end
    {
      type: 'sphere',
      position: [0, 0.25, 0.75],
      scale: [0.85, 0.9, 0.5],
      params: { radius: 0.4, widthSegments: 24, heightSegments: 16 },
      material: {
        color: '#FFFFFF',
        metalness: 0.1,
        roughness: 0.10,
      },
    },

    // === RIM (top edge) ===
    {
      type: 'torus',
      position: [0, 0.48, 0],
      rotation: [Math.PI / 2, 0, 0],
      scale: [0.9, 2.0, 1],
      params: { radius: 0.38, tubeRadius: 0.02, radialSegments: 32, tubularSegments: 32 },
      material: {
        color: '#FAFAFA',
        metalness: 0.15,
        roughness: 0.08,
      },
    },

    // === CLAW FEET (4 ornate feet) ===
    // Front-left foot
    {
      type: 'sphere',
      position: [-0.28, 0.04, -0.65],
      params: { radius: 0.045, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#D4AF37', // Antique brass/gold
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Front-right foot
    {
      type: 'sphere',
      position: [0.28, 0.04, -0.65],
      params: { radius: 0.045, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#D4AF37',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Back-left foot
    {
      type: 'sphere',
      position: [-0.28, 0.04, 0.65],
      params: { radius: 0.045, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#D4AF37',
        metalness: 0.8,
        roughness: 0.3,
      },
    },
    // Back-right foot
    {
      type: 'sphere',
      position: [0.28, 0.04, 0.65],
      params: { radius: 0.045, widthSegments: 16, heightSegments: 16 },
      material: {
        color: '#D4AF37',
        metalness: 0.8,
        roughness: 0.3,
      },
    },

    // === FAUCET ASSEMBLY (freestanding floor-mounted) ===
    // Faucet base (floor stand)
    {
      type: 'cylinder',
      position: [0, 0.3, -0.85],
      params: { radiusTop: 0.03, radiusBottom: 0.05, height: 0.6, radialSegments: 16 },
      material: {
        color: '#C0C0C0', // Chrome
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Faucet spout (curved pipe)
    {
      type: 'torus',
      position: [0, 0.58, -0.75],
      rotation: [0, 0, Math.PI / 2],
      params: { radius: 0.12, tubeRadius: 0.015, radialSegments: 16, tubularSegments: 16, arc: Math.PI },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },
    // Spout end
    {
      type: 'cylinder',
      position: [0, 0.46, -0.63],
      rotation: [Math.PI / 3, 0, 0],
      params: { radiusTop: 0.02, radiusBottom: 0.025, height: 0.08, radialSegments: 16 },
      material: {
        color: '#C0C0C0',
        metalness: 0.95,
        roughness: 0.05,
      },
    },

    // === DRAIN (inside tub) ===
    {
      type: 'cylinder',
      position: [0, 0.06, 0.6],
      params: { radiusTop: 0.03, radiusBottom: 0.025, height: 0.01, radialSegments: 16 },
      material: {
        color: '#888888',
        metalness: 0.85,
        roughness: 0.3,
      },
    },
  ],
};

// ==========================================
// STAIRS - Spiral Staircase
// ==========================================

/**
 * Spiral Staircase
 * Curved staircase with helix pattern, central pole, and helical handrail
 * 12 steps rotating around center pole in 1.5 rotations (540 degrees)
 */
export const STAIRS_SPIRAL: BaseObjectDefinition = {
  id: 'stairs_spiral',
  type: RoomElementType.STAIRS,
  name: 'Spiral Staircase',
  description: 'Curved staircase with helical handrail rotating around central pole',
  defaultDimensions: [2.4, 2.8, 2.4], // Diameter x Height x Diameter
  supportsInstancing: false,
  parts: [
    // Central support pole (floor to top)
    {
      type: 'cylinder',
      position: [0, 1.4, 0],
      params: {
        radiusTop: 0.08,
        radiusBottom: 0.08,
        height: 2.8,
        radialSegments: 16,
      },
      material: {
        color: '#3F3F46', // Dark gray metal
        metalness: 0.9,
        roughness: 0.3,
      },
    },

    // 12 Steps rotating in helix pattern (540 degrees total = 1.5 rotations)
    // Step 1 (0 degrees)
    {
      type: 'box',
      position: [0.5, 0.1, 0],
      rotation: [0, 0, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 2 (45 degrees)
    {
      type: 'box',
      position: [0.354, 0.33, 0.354],
      rotation: [0, Math.PI / 4, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 3 (90 degrees)
    {
      type: 'box',
      position: [0, 0.56, 0.5],
      rotation: [0, Math.PI / 2, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 4 (135 degrees)
    {
      type: 'box',
      position: [-0.354, 0.79, 0.354],
      rotation: [0, (3 * Math.PI) / 4, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 5 (180 degrees)
    {
      type: 'box',
      position: [-0.5, 1.02, 0],
      rotation: [0, Math.PI, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 6 (225 degrees)
    {
      type: 'box',
      position: [-0.354, 1.25, -0.354],
      rotation: [0, (5 * Math.PI) / 4, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 7 (270 degrees)
    {
      type: 'box',
      position: [0, 1.48, -0.5],
      rotation: [0, (3 * Math.PI) / 2, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 8 (315 degrees)
    {
      type: 'box',
      position: [0.354, 1.71, -0.354],
      rotation: [0, (7 * Math.PI) / 4, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 9 (360 degrees - full rotation)
    {
      type: 'box',
      position: [0.5, 1.94, 0],
      rotation: [0, 2 * Math.PI, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 10 (405 degrees)
    {
      type: 'box',
      position: [0.354, 2.17, 0.354],
      rotation: [0, (9 * Math.PI) / 4, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 11 (450 degrees)
    {
      type: 'box',
      position: [0, 2.40, 0.5],
      rotation: [0, (5 * Math.PI) / 2, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },
    // Step 12 (495 degrees)
    {
      type: 'box',
      position: [-0.354, 2.63, 0.354],
      rotation: [0, (11 * Math.PI) / 4, 0],
      params: { width: 1.0, height: 0.05, depth: 0.3 },
      material: {
        color: '#8B4513',
        metalness: 0.1,
        roughness: 0.6,
      },
    },

    // Handrail support posts (every 2 steps)
    // Post 1 (at step 2)
    {
      type: 'cylinder',
      position: [0.85, 0.33, 0.85],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.9,
        radialSegments: 8,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Post 2 (at step 4)
    {
      type: 'cylinder',
      position: [-0.85, 0.79, 0.85],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.9,
        radialSegments: 8,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Post 3 (at step 6)
    {
      type: 'cylinder',
      position: [-0.85, 1.25, -0.85],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.9,
        radialSegments: 8,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Post 4 (at step 8)
    {
      type: 'cylinder',
      position: [0.85, 1.71, -0.85],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.9,
        radialSegments: 8,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Post 5 (at step 10)
    {
      type: 'cylinder',
      position: [0.85, 2.17, 0.85],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.9,
        radialSegments: 8,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Post 6 (at step 12)
    {
      type: 'cylinder',
      position: [-0.85, 2.63, 0.85],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.9,
        radialSegments: 8,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },

    // Helical handrail segments (connecting posts as torus arcs)
    // Segment 1-2
    {
      type: 'torus',
      position: [0, 0.78, 0],
      rotation: [Math.PI / 2, 0, -Math.PI / 4],
      params: {
        radius: 1.2,
        tubeRadius: 0.025,
        radialSegments: 16,
        tubularSegments: 12,
        arc: Math.PI / 2,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Segment 2-3
    {
      type: 'torus',
      position: [0, 1.24, 0],
      rotation: [Math.PI / 2, 0, (3 * Math.PI) / 4],
      params: {
        radius: 1.2,
        tubeRadius: 0.025,
        radialSegments: 16,
        tubularSegments: 12,
        arc: Math.PI / 2,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Segment 3-4
    {
      type: 'torus',
      position: [0, 1.70, 0],
      rotation: [Math.PI / 2, 0, (5 * Math.PI) / 4],
      params: {
        radius: 1.2,
        tubeRadius: 0.025,
        radialSegments: 16,
        tubularSegments: 12,
        arc: Math.PI / 2,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Segment 4-5
    {
      type: 'torus',
      position: [0, 2.16, 0],
      rotation: [Math.PI / 2, 0, (7 * Math.PI) / 4],
      params: {
        radius: 1.2,
        tubeRadius: 0.025,
        radialSegments: 16,
        tubularSegments: 12,
        arc: Math.PI / 2,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    // Segment 5-6
    {
      type: 'torus',
      position: [0, 2.62, 0],
      rotation: [Math.PI / 2, 0, Math.PI / 4],
      params: {
        radius: 1.2,
        tubeRadius: 0.025,
        radialSegments: 16,
        tubularSegments: 12,
        arc: Math.PI / 2,
      },
      material: {
        color: '#3F3F46',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
  ],
};

// ==========================================
// DOORS - Additional Variants
// ==========================================

/**
 * Double Swing Doors
 * Restaurant/kitchen style double swing doors (push open both ways)
 * Two doors with circular windows and metal kick plates
 */
export const DOOR_DOUBLE_SWING: BaseObjectDefinition = {
  id: 'door_double_swing',
  type: RoomElementType.DOOR,
  name: 'Double Swing Doors',
  description: 'Restaurant-style double doors with circular windows',
  defaultDimensions: [1.8, 2.1, 0.1], // Width x Height x Depth
  supportsInstancing: true,
  parts: [
    // Left door panel
    {
      type: 'box',
      position: [-0.45, 1.05, 0],
      params: { width: 0.85, height: 2.1, depth: 0.05 },
      material: {
        color: '#52525B', // Gray
        metalness: 0.2,
        roughness: 0.6,
      },
    },
    // Left door circular window
    {
      type: 'cylinder',
      position: [-0.45, 1.4, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: {
        radiusTop: 0.15,
        radiusBottom: 0.15,
        height: 0.06,
        radialSegments: 24,
      },
      material: {
        color: '#BFDBFE',
        metalness: 0.1,
        roughness: 0.05,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Left door kick plate (bottom)
    {
      type: 'box',
      position: [-0.45, 0.2, 0.026],
      params: { width: 0.80, height: 0.4, depth: 0.01 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.25,
      },
    },

    // Right door panel
    {
      type: 'box',
      position: [0.45, 1.05, 0],
      params: { width: 0.85, height: 2.1, depth: 0.05 },
      material: {
        color: '#52525B',
        metalness: 0.2,
        roughness: 0.6,
      },
    },
    // Right door circular window
    {
      type: 'cylinder',
      position: [0.45, 1.4, 0],
      rotation: [Math.PI / 2, 0, 0],
      params: {
        radiusTop: 0.15,
        radiusBottom: 0.15,
        height: 0.06,
        radialSegments: 24,
      },
      material: {
        color: '#BFDBFE',
        metalness: 0.1,
        roughness: 0.05,
        opacity: 0.3,
        transparent: true,
      },
    },
    // Right door kick plate (bottom)
    {
      type: 'box',
      position: [0.45, 0.2, 0.026],
      params: { width: 0.80, height: 0.4, depth: 0.01 },
      material: {
        color: '#71717A',
        metalness: 0.85,
        roughness: 0.25,
      },
    },

    // Center divider strip
    {
      type: 'box',
      position: [0, 1.05, 0],
      params: { width: 0.05, height: 2.1, depth: 0.06 },
      material: {
        color: '#3F3F46',
        metalness: 0.7,
        roughness: 0.4,
      },
    },

    // Hinge indicators (left door - left side)
    {
      type: 'box',
      position: [-0.875, 1.8, 0],
      params: { width: 0.03, height: 0.15, depth: 0.08 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    {
      type: 'box',
      position: [-0.875, 1.05, 0],
      params: { width: 0.03, height: 0.15, depth: 0.08 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    {
      type: 'box',
      position: [-0.875, 0.3, 0],
      params: { width: 0.03, height: 0.15, depth: 0.08 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.3,
      },
    },

    // Hinge indicators (right door - right side)
    {
      type: 'box',
      position: [0.875, 1.8, 0],
      params: { width: 0.03, height: 0.15, depth: 0.08 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    {
      type: 'box',
      position: [0.875, 1.05, 0],
      params: { width: 0.03, height: 0.15, depth: 0.08 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
    {
      type: 'box',
      position: [0.875, 0.3, 0],
      params: { width: 0.03, height: 0.15, depth: 0.08 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.3,
      },
    },
  ],
};

/**
 * Barn Sliding Door
 * Rustic sliding barn door with X-brace pattern and overhead track
 */
export const DOOR_BARN_SLIDING: BaseObjectDefinition = {
  id: 'door_barn_sliding',
  type: RoomElementType.DOOR,
  name: 'Barn Sliding Door',
  description: 'Rustic barn door with X-brace and sliding track',
  defaultDimensions: [1.2, 2.4, 0.08], // Width x Height x Depth
  supportsInstancing: true,
  parts: [
    // Main door panel (wooden planks effect)
    {
      type: 'box',
      position: [0, 1.2, 0],
      params: { width: 1.2, height: 2.4, depth: 0.05 },
      material: {
        color: '#654321', // Dark wood
        metalness: 0.0,
        roughness: 0.85,
      },
    },

    // Vertical plank dividers (5 planks)
    {
      type: 'box',
      position: [-0.48, 1.2, 0.026],
      params: { width: 0.015, height: 2.4, depth: 0.01 },
      material: {
        color: '#4A3728',
        metalness: 0.0,
        roughness: 0.9,
      },
    },
    {
      type: 'box',
      position: [-0.24, 1.2, 0.026],
      params: { width: 0.015, height: 2.4, depth: 0.01 },
      material: {
        color: '#4A3728',
        metalness: 0.0,
        roughness: 0.9,
      },
    },
    {
      type: 'box',
      position: [0, 1.2, 0.026],
      params: { width: 0.015, height: 2.4, depth: 0.01 },
      material: {
        color: '#4A3728',
        metalness: 0.0,
        roughness: 0.9,
      },
    },
    {
      type: 'box',
      position: [0.24, 1.2, 0.026],
      params: { width: 0.015, height: 2.4, depth: 0.01 },
      material: {
        color: '#4A3728',
        metalness: 0.0,
        roughness: 0.9,
      },
    },
    {
      type: 'box',
      position: [0.48, 1.2, 0.026],
      params: { width: 0.015, height: 2.4, depth: 0.01 },
      material: {
        color: '#4A3728',
        metalness: 0.0,
        roughness: 0.9,
      },
    },

    // Diagonal X-brace (top-left to bottom-right)
    {
      type: 'box',
      position: [0, 1.2, 0.035],
      rotation: [0, 0, Math.atan(2.4 / 1.2)], // Diagonal angle
      params: { width: 0.08, height: 2.68, depth: 0.02 },
      material: {
        color: '#1F1F1F', // Black metal
        metalness: 0.7,
        roughness: 0.5,
      },
    },
    // Diagonal X-brace (top-right to bottom-left)
    {
      type: 'box',
      position: [0, 1.2, 0.035],
      rotation: [0, 0, -Math.atan(2.4 / 1.2)], // Diagonal angle (opposite)
      params: { width: 0.08, height: 2.68, depth: 0.02 },
      material: {
        color: '#1F1F1F',
        metalness: 0.7,
        roughness: 0.5,
      },
    },

    // Horizontal cross braces
    {
      type: 'box',
      position: [0, 2.1, 0.035],
      params: { width: 1.25, height: 0.12, depth: 0.02 },
      material: {
        color: '#1F1F1F',
        metalness: 0.7,
        roughness: 0.5,
      },
    },
    {
      type: 'box',
      position: [0, 0.3, 0.035],
      params: { width: 1.25, height: 0.12, depth: 0.02 },
      material: {
        color: '#1F1F1F',
        metalness: 0.7,
        roughness: 0.5,
      },
    },

    // Overhead track mount
    {
      type: 'box',
      position: [0, 2.45, 0],
      params: { width: 2.0, height: 0.08, depth: 0.08 },
      material: {
        color: '#3F3F46',
        metalness: 0.8,
        roughness: 0.35,
      },
    },

    // Sliding hardware (rollers)
    // Left roller bracket
    {
      type: 'box',
      position: [-0.4, 2.38, 0.03],
      params: { width: 0.06, height: 0.15, depth: 0.06 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.25,
      },
    },
    {
      type: 'cylinder',
      position: [-0.4, 2.47, 0.03],
      rotation: [0, 0, Math.PI / 2],
      params: {
        radiusTop: 0.03,
        radiusBottom: 0.03,
        height: 0.06,
        radialSegments: 16,
      },
      material: {
        color: '#52525B',
        metalness: 0.85,
        roughness: 0.3,
      },
    },

    // Right roller bracket
    {
      type: 'box',
      position: [0.4, 2.38, 0.03],
      params: { width: 0.06, height: 0.15, depth: 0.06 },
      material: {
        color: '#71717A',
        metalness: 0.9,
        roughness: 0.25,
      },
    },
    {
      type: 'cylinder',
      position: [0.4, 2.47, 0.03],
      rotation: [0, 0, Math.PI / 2],
      params: {
        radiusTop: 0.03,
        radiusBottom: 0.03,
        height: 0.06,
        radialSegments: 16,
      },
      material: {
        color: '#52525B',
        metalness: 0.85,
        roughness: 0.3,
      },
    },

    // Handle (simple vertical bar)
    {
      type: 'cylinder',
      position: [0.5, 1.2, 0.06],
      params: {
        radiusTop: 0.02,
        radiusBottom: 0.02,
        height: 0.4,
        radialSegments: 12,
      },
      material: {
        color: '#1F1F1F',
        metalness: 0.8,
        roughness: 0.35,
      },
    },
  ],
};

// ==========================================
// RUGS - Shaggy Style
// ==========================================

/**
 * Shaggy Rug
 * High-pile textured rug with depth illusion using layered geometry
 * Simulates fluffy, plush carpet texture
 */
export const RUG_SHAGGY: BaseObjectDefinition = {
  id: 'rug_shaggy',
  type: RoomElementType.RUG,
  name: 'Shaggy Rug',
  description: 'High-pile plush rug with fluffy texture',
  defaultDimensions: [2.0, 0.06, 3.0], // Width x Thickness x Depth
  supportsInstancing: true,
  parts: [
    // Base layer (thicker than normal rug)
    {
      type: 'box',
      position: [0, 0.03, 0],
      params: { width: 2.0, height: 0.06, depth: 3.0 },
      material: {
        color: '#F3F4F6', // Light cream
        metalness: 0.0,
        roughness: 1.0, // Maximum roughness for matte texture
      },
    },

    // Texture simulation - scattered small cylinders on top to create "pile" effect
    // Row 1
    {
      type: 'cylinder',
      position: [-0.7, 0.065, -1.0],
      params: {
        radiusTop: 0.08,
        radiusBottom: 0.08,
        height: 0.025,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [-0.3, 0.067, -1.1],
      params: {
        radiusTop: 0.09,
        radiusBottom: 0.09,
        height: 0.028,
        radialSegments: 8,
      },
      material: {
        color: '#F9FAFB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.65,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.2, 0.064, -0.9],
      params: {
        radiusTop: 0.075,
        radiusBottom: 0.075,
        height: 0.022,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.75,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.6, 0.066, -1.05],
      params: {
        radiusTop: 0.085,
        radiusBottom: 0.085,
        height: 0.026,
        radialSegments: 8,
      },
      material: {
        color: '#F3F4F6',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.7,
        transparent: true,
      },
    },

    // Row 2
    {
      type: 'cylinder',
      position: [-0.8, 0.068, -0.3],
      params: {
        radiusTop: 0.09,
        radiusBottom: 0.09,
        height: 0.03,
        radialSegments: 8,
      },
      material: {
        color: '#F9FAFB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.65,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [-0.4, 0.065, -0.2],
      params: {
        radiusTop: 0.08,
        radiusBottom: 0.08,
        height: 0.024,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.1, 0.067, -0.35],
      params: {
        radiusTop: 0.087,
        radiusBottom: 0.087,
        height: 0.027,
        radialSegments: 8,
      },
      material: {
        color: '#F3F4F6',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.68,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.5, 0.064, -0.25],
      params: {
        radiusTop: 0.076,
        radiusBottom: 0.076,
        height: 0.023,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.72,
        transparent: true,
      },
    },

    // Row 3 (center)
    {
      type: 'cylinder',
      position: [-0.65, 0.066, 0.4],
      params: {
        radiusTop: 0.085,
        radiusBottom: 0.085,
        height: 0.026,
        radialSegments: 8,
      },
      material: {
        color: '#F9FAFB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.67,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [-0.2, 0.068, 0.5],
      params: {
        radiusTop: 0.09,
        radiusBottom: 0.09,
        height: 0.029,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.7,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.3, 0.065, 0.45],
      params: {
        radiusTop: 0.082,
        radiusBottom: 0.082,
        height: 0.025,
        radialSegments: 8,
      },
      material: {
        color: '#F3F4F6',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.69,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.75, 0.067, 0.3],
      params: {
        radiusTop: 0.088,
        radiusBottom: 0.088,
        height: 0.028,
        radialSegments: 8,
      },
      material: {
        color: '#F9FAFB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.66,
        transparent: true,
      },
    },

    // Row 4
    {
      type: 'cylinder',
      position: [-0.7, 0.064, 1.1],
      params: {
        radiusTop: 0.078,
        radiusBottom: 0.078,
        height: 0.023,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.73,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [-0.25, 0.066, 1.0],
      params: {
        radiusTop: 0.084,
        radiusBottom: 0.084,
        height: 0.026,
        radialSegments: 8,
      },
      material: {
        color: '#F3F4F6',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.68,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.15, 0.068, 1.15],
      params: {
        radiusTop: 0.091,
        radiusBottom: 0.091,
        height: 0.03,
        radialSegments: 8,
      },
      material: {
        color: '#F9FAFB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.65,
        transparent: true,
      },
    },
    {
      type: 'cylinder',
      position: [0.55, 0.065, 1.05],
      params: {
        radiusTop: 0.08,
        radiusBottom: 0.08,
        height: 0.024,
        radialSegments: 8,
      },
      material: {
        color: '#E5E7EB',
        metalness: 0.0,
        roughness: 1.0,
        opacity: 0.71,
        transparent: true,
      },
    },
  ],
};

// ==========================================
// BATHROOM FIXTURES - Urinal
// ==========================================

/**
 * Wall-Mounted Urinal
 * Commercial restroom urinal with flush valve and drain
 */
export const URINAL_WALL_MOUNTED: BaseObjectDefinition = {
  id: 'urinal_wall_mounted',
  type: RoomElementType.BATHROOM_FIXTURE,
  name: 'Wall-Mounted Urinal',
  description: 'Commercial urinal with automatic flush valve',
  defaultDimensions: [0.4, 0.65, 0.35], // Width x Height x Depth
  supportsInstancing: true,
  parts: [
    // Main bowl (elongated sphere)
    {
      type: 'sphere',
      position: [0, 0.3, 0.1],
      scale: [1.0, 1.4, 0.9],
      params: {
        radius: 0.18,
        widthSegments: 24,
        heightSegments: 16,
      },
      material: {
        color: '#FFFFFF',
        metalness: 0.3,
        roughness: 0.15,
      },
    },

    // Bowl rim (torus)
    {
      type: 'torus',
      position: [0, 0.5, 0.1],
      rotation: [Math.PI / 2, 0, 0],
      params: {
        radius: 0.19,
        tubeRadius: 0.015,
        radialSegments: 24,
        tubularSegments: 32,
      },
      material: {
        color: '#F5F5F5',
        metalness: 0.3,
        roughness: 0.1,
      },
    },

    // Splash guard top extension
    {
      type: 'box',
      position: [0, 0.58, 0.04],
      params: { width: 0.38, height: 0.15, depth: 0.02 },
      material: {
        color: '#FFFFFF',
        metalness: 0.3,
        roughness: 0.15,
      },
    },

    // Wall mounting bracket (top)
    {
      type: 'box',
      position: [0, 0.6, -0.05],
      params: { width: 0.3, height: 0.08, depth: 0.12 },
      material: {
        color: '#E5E7EB',
        metalness: 0.5,
        roughness: 0.4,
      },
    },

    // Drain at bottom
    {
      type: 'cylinder',
      position: [0, 0.08, 0.1],
      params: {
        radiusTop: 0.03,
        radiusBottom: 0.025,
        height: 0.05,
        radialSegments: 16,
      },
      material: {
        color: '#71717A',
        metalness: 0.8,
        roughness: 0.3,
      },
    },

    // Drain grate
    {
      type: 'torus',
      position: [0, 0.105, 0.1],
      rotation: [Math.PI / 2, 0, 0],
      params: {
        radius: 0.03,
        tubeRadius: 0.003,
        radialSegments: 16,
        tubularSegments: 24,
      },
      material: {
        color: '#52525B',
        metalness: 0.85,
        roughness: 0.25,
      },
    },

    // Flush valve assembly (top center)
    {
      type: 'box',
      position: [0, 0.62, 0.08],
      params: { width: 0.08, height: 0.12, depth: 0.06 },
      material: {
        color: '#E5E7EB',
        metalness: 0.7,
        roughness: 0.25,
      },
    },

    // Flush sensor (infrared)
    {
      type: 'cylinder',
      position: [0, 0.64, 0.115],
      rotation: [Math.PI / 2, 0, 0],
      params: {
        radiusTop: 0.015,
        radiusBottom: 0.015,
        height: 0.01,
        radialSegments: 12,
      },
      material: {
        color: '#1F1F1F',
        metalness: 0.4,
        roughness: 0.3,
        emissive: '#DC2626',
        emissiveIntensity: 0.3,
      },
    },

    // Water supply pipe (chrome)
    {
      type: 'cylinder',
      position: [-0.15, 0.4, -0.05],
      params: {
        radiusTop: 0.008,
        radiusBottom: 0.008,
        height: 0.3,
        radialSegments: 12,
      },
      material: {
        color: '#D4D4D8',
        metalness: 0.95,
        roughness: 0.1,
      },
    },

    // Supply connection elbow (top)
    {
      type: 'torus',
      position: [-0.15, 0.55, -0.05],
      rotation: [0, 0, Math.PI / 2],
      params: {
        radius: 0.02,
        tubeRadius: 0.008,
        radialSegments: 12,
        tubularSegments: 16,
        arc: Math.PI / 2,
      },
      material: {
        color: '#D4D4D8',
        metalness: 0.95,
        roughness: 0.1,
      },
    },

    // Connection to flush valve (horizontal pipe)
    {
      type: 'cylinder',
      position: [-0.075, 0.57, -0.05],
      rotation: [0, 0, Math.PI / 2],
      params: {
        radiusTop: 0.008,
        radiusBottom: 0.008,
        height: 0.09,
        radialSegments: 12,
      },
      material: {
        color: '#D4D4D8',
        metalness: 0.95,
        roughness: 0.1,
      },
    },

    // Deodorizer cake holder (inside bowl)
    {
      type: 'cylinder',
      position: [0, 0.15, 0.15],
      params: {
        radiusTop: 0.04,
        radiusBottom: 0.04,
        height: 0.01,
        radialSegments: 16,
      },
      material: {
        color: '#BFDBFE',
        metalness: 0.0,
        roughness: 0.8,
        opacity: 0.7,
        transparent: true,
      },
    },
  ],
};

/**
 * Base definitions registry
 * Maps element type to its base definition(s)
 * TV variants ordered from smallest to largest screen size
 */
export const BASE_DEFINITIONS_REGISTRY: Map<RoomElementType, BaseObjectDefinition[]> = new Map([
  [RoomElementType.TV, [
    TV_32_INCH,
    TV_40_INCH,
    TV_43_INCH,
    TV_50_INCH,
    TV_55_INCH,
    TV_65_INCH,
    TV_75_INCH,
    TV_77_INCH,
    TV_83_INCH,
    TV_85_INCH,
    TV_WALL, // Legacy definition (backward compatibility)
    // Vertical displays
    VERTICAL_DISPLAY_PORTRAIT,
    VERTICAL_DISPLAY_ULTRA_WIDE,
    VERTICAL_DISPLAY_SQUARE,
  ]],
  [RoomElementType.CHAIR, [CHAIR_BASIC]],
  [RoomElementType.SOFA, [SOFA_BASIC, SOFA_MODERN_BLACK]],
  [RoomElementType.OTTOMAN, [OTTOMAN_CUBE_LEATHER]],
  [RoomElementType.SEATING, [POUF_SQUARE, POUF_SQUARE_LEGS, POUF_SQUARE_METAL_LEGS, POUF_ROUND, POUF_OTTOMAN]],
  [RoomElementType.PLANT, [PLANT_POTTED, PALM_TREE]],
  [RoomElementType.BAR_COUNTER, [BAR_COUNTER]],
  [RoomElementType.STAGE, [STAGE_PLATFORM]],
  [RoomElementType.DJ_BOOTH, [DJ_BOOTH, DJ_CONTROLLER]],
  [RoomElementType.DOOR, [DOOR_STANDARD, DOOR_ROLLING_SHUTTER, DOOR_GLASS_SLIDING, DOOR_DOUBLE_SWING, DOOR_BARN_SLIDING]],
  [RoomElementType.WINDOW, [WINDOW_STANDARD]],
  [RoomElementType.COLUMN, [COLUMN_CYLINDRICAL]],
  [RoomElementType.DECORATION, [DECORATION_GENERIC, TABLE_LAMP_LUXURY_GOLD, TABLE_LAMP_MODERN_BLACK, TABLE_LAMP_CRYSTAL, TABLE_LAMP_SQUARE_BASE]],
  [RoomElementType.RUG, [RUG_MODERN_MINIMALIST, RUG_PERSIAN_ORIENTAL, RUG_SHAGGY]],
  [RoomElementType.STAIRS, [STAIRS_STRAIGHT, STAIRS_SPIRAL]],
  [RoomElementType.BATHROOM_FIXTURE, [SINK_PEDESTAL, TOILET_MODERN, SHOWER_STALL, BATHTUB_FREESTANDING, URINAL_WALL_MOUNTED]],
  [RoomElementType.AIR_CONDITIONER, [AIR_CONDITIONER_SPLIT]],
  [RoomElementType.TECH_DEVICES, [
    LAPTOP_CHARGING_CABINET,
    // Generic Laptops
    LAPTOP_13_INCH,
    LAPTOP_14_INCH,
    LAPTOP_15_INCH,
    LAPTOP_16_INCH,
    // Apple MacBook Pro
    MACBOOK_PRO_13,
    MACBOOK_PRO_14,
    MACBOOK_PRO_16,
    // Brand Laptops
    DELL_XPS_13,
    // Gaming Laptops
    HP_PAVILION_GAMING,
    ASUS_ROG_STRIX,
    RAZER_BLADE_15,
    LENOVO_LEGION_5,
  ]],
  [RoomElementType.LIGHTING, [
    // Colored Bulbs
    COLORED_BULB_AMBER,
    COLORED_BULB_RED,
    COLORED_BULB_BLUE,
    COLORED_BULB_GREEN,
    COLORED_BULB_PURPLE,
    COLORED_BULB_WHITE,
    // Neon Strips
    NEON_STRIP_STRAIGHT_50CM,
    NEON_STRIP_STRAIGHT_1M,
    NEON_STRIP_STRAIGHT_2M,
    NEON_STRIP_CIRCLE,
    NEON_STRIP_L_SHAPE,
    // LED Strips
    LED_STRIP_50CM,
    LED_STRIP_1M,
    LED_STRIP_2M,
  ]],
  [RoomElementType.BAR_EQUIPMENT, [
    // Glassware
    MARTINI_GLASS,
    HIGHBALL_GLASS,
    ROCKS_GLASS,
    SHOT_GLASS,
    WINE_GLASS,
    CHAMPAGNE_FLUTE,
    BEER_PINT_GLASS,
    MARGARITA_GLASS,
    // Bar Tools
    COCKTAIL_SHAKER,
    ICE_BUCKET,
    JIGGER,
    BAR_SPOON,
    MUDDLER,
    HAWTHORNE_STRAINER,
    BOTTLE_OPENER,
  ]],
  [RoomElementType.BOTTLES, [
    VODKA_BOTTLE_CLEAR,
    WHISKEY_BOTTLE_SQUARE,
    SCOTCH_BOTTLE_TALL,
    RUM_BOTTLE_DARK,
    TEQUILA_BOTTLE,
    GIN_BOTTLE,
    COGNAC_BOTTLE,
    CHAMPAGNE_BOTTLE,
    BEER_BOTTLE,
    WINE_BOTTLE_RED,
  ]],
]);

/**
 * Get base definition for an element type
 * @param type Element type
 * @param variant Optional variant index (default: 0)
 * @returns Base object definition or undefined
 */
export function getBaseDefinition(
  type: RoomElementType,
  variant: number = 0
): BaseObjectDefinition | undefined {
  const definitions = BASE_DEFINITIONS_REGISTRY.get(type);
  return definitions?.[variant];
}

/**
 * Get all base definitions for an element type
 * @param type Element type
 * @returns Array of base definitions
 */
export function getAllBaseDefinitions(type: RoomElementType): BaseObjectDefinition[] {
  return BASE_DEFINITIONS_REGISTRY.get(type) || [];
}
