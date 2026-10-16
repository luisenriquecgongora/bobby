// @openvenue/viewer/src/VenueViewer.tsx
// Ultra-lightweight, embeddable 3D venue room visualizer.

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  RoomDimensions,
  FloorMaterial,
  Wall,
  WallType,
  WallSide,
  TableShape,
  TableCategory,
  cmToMeters,
  roomCoordsToWorld3D,
  degreesToRadians
} from '@openvenue/core';
import { createRoomObject, FloorMaterialBuilder } from '@openvenue/engine';

export interface ViewerTable {
  _id: string;
  name: string;
  shape: TableShape | string;
  category: TableCategory | string;
  position: { x: number; y: number; z?: number }; // cm
  dimensions: { width: number; depth: number; height: number }; // cm
  rotation: number; // degrees
  status?: 'active' | 'inactive';
  minCapacity?: number;
  maxCapacity?: number;
  basePrice?: number;
  customGeometry?: any;
}

export interface ViewerRoomElement {
  _id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z?: number }; // cm
  dimensions: { width: number; depth: number; height?: number }; // cm
  rotation: number; // degrees
  color?: string;
  customGeometry?: any;
}

export interface VenueViewerProps {
  roomDimensions: RoomDimensions;
  tables?: ViewerTable[];
  elements?: ViewerRoomElement[];
  floorMaterial?: FloorMaterial;
  walls?: Wall[];
  selectedTableId?: string | null;
  onTableSelect?: (tableId: string | null) => void;
  showLabels?: boolean;
  showGrid?: boolean;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CATEGORY_COLORS: Record<string, string> = {
  standard: '#14B8A6', // Teal
  vip: '#F59E0B',      // Amber/Gold
  bar: '#A855F7',      // Purple
  balcony: '#06B6D4',  // Cyan
  booth: '#EC4899',    // Pink
  lounge: '#8B5CF6',   // Violet
};

/**
 * Emissive Point Lights: spawns dynamic point lights from TVs and neon strips
 */
const EmissiveLights: React.FC<{ object: THREE.Group }> = ({ object }) => {
  const lightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    lightsRef.current.forEach((light) => light.removeFromParent());
    lightsRef.current = [];

    if (!object) return;

    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const material = child.material;
        if (material.emissiveIntensity && material.emissiveIntensity > 0.5) {
          const light = new THREE.PointLight(
            material.emissive,
            material.emissiveIntensity * 0.8,
            3.0,
            2.0
          );
          const worldPos = new THREE.Vector3();
          child.getWorldPosition(worldPos);
          light.position.copy(worldPos);
          object.add(light);
          lightsRef.current.push(light);
        }
      }
    });

    return () => {
      lightsRef.current.forEach((light) => light.removeFromParent());
      lightsRef.current = [];
    };
  }, [object]);

  return null;
};

/**
 * Table 3D Mesh with selection pulse
 */
const TableMesh: React.FC<{
  table: ViewerTable;
  roomDimensions: RoomDimensions;
  isSelected: boolean;
  onClick: () => void;
  showLabels?: boolean;
}> = ({ table, roomDimensions, isSelected, onClick, showLabels = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isCustom = table.shape === TableShape.CUSTOM && table.customGeometry;

  // Pulse animation for selected table
  useFrame(({ clock }) => {
    if (groupRef.current && isSelected) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.03;
      groupRef.current.scale.set(scale, scale, scale);
    } else if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  const customObject = useMemo(() => {
    if (isCustom) {
      return createRoomObject(
        {
          ...table,
          type: 'custom' as any,
          color: undefined,
        } as any,
        roomDimensions as any,
        { castShadow: true, receiveShadow: true }
      );
    }
    return null;
  }, [isCustom, table, roomDimensions]);

  const worldPos = useMemo(() => {
    return roomCoordsToWorld3D(
      table.position,
      table.dimensions,
      { width: roomDimensions.width, depth: roomDimensions.depth },
      isCustom
    );
  }, [table.position, table.dimensions, roomDimensions, isCustom]);

  const color = CATEGORY_COLORS[table.category] || '#14B8A6';
  const widthM = cmToMeters(table.dimensions.width);
  const depthM = cmToMeters(table.dimensions.depth);
  const heightM = cmToMeters(table.dimensions.height);

  return (
    <group
      ref={groupRef}
      position={worldPos}
      rotation={[0, degreesToRadians(table.rotation), 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {isCustom && customObject ? (
        <primitive object={customObject} />
      ) : (
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          {table.shape === TableShape.CIRCLE ? (
            <cylinderGeometry args={[widthM / 2, widthM / 2, heightM, 32]} />
          ) : (
            <boxGeometry args={[widthM, heightM, depthM]} />
          )}
          <meshStandardMaterial
            color={color}
            metalness={0.2}
            roughness={0.5}
            emissive={isSelected ? color : '#000000'}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        </mesh>
      )}

      {showLabels && (
        <Text
          position={[0, heightM / 2 + 0.25, 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {table.name}
        </Text>
      )}
    </group>
  );
};

/**
 * Single Room Element 3D Mesh
 */
const RoomElementMesh: React.FC<{
  element: ViewerRoomElement;
  roomDimensions: RoomDimensions;
}> = ({ element, roomDimensions }) => {
  const object = useMemo(() => {
    return createRoomObject(
      element as any,
      roomDimensions as any,
      { castShadow: true, receiveShadow: true }
    );
  }, [element, roomDimensions]);

  return (
    <>
      <primitive object={object} />
      <EmissiveLights object={object} />
    </>
  );
};

/**
 * Procedural Floor Mesh
 */
const FloorMesh: React.FC<{
  roomDimensions: RoomDimensions;
  floorMaterial?: FloorMaterial;
}> = ({ roomDimensions, floorMaterial }) => {
  const widthM = cmToMeters(roomDimensions.width);
  const depthM = cmToMeters(roomDimensions.depth);

  const material = useMemo(() => {
    if (floorMaterial) {
      return FloorMaterialBuilder.getMaterial(floorMaterial, {
        width: roomDimensions.width,
        depth: roomDimensions.depth,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#111827',
      metalness: 0.1,
      roughness: 0.9,
    });
  }, [floorMaterial, roomDimensions]);

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[widthM, depthM]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

/**
 * Main VenueViewer Component
 */
export const VenueViewer: React.FC<VenueViewerProps> = ({
  roomDimensions,
  tables = [],
  elements = [],
  floorMaterial,
  walls = [],
  selectedTableId = null,
  onTableSelect,
  showLabels = true,
  showGrid = true,
  accentColor = '#14B8A6',
  className = 'w-full h-full min-h-[500px]',
  style,
}) => {
  const widthM = cmToMeters(roomDimensions.width);
  const depthM = cmToMeters(roomDimensions.depth);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 45 }}
        style={{ background: '#090D16' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-widthM / 2, 4, -depthM / 2]} intensity={0.4} color={accentColor} />

        <OrbitControls
          makeDefault
          minPolarAngle={degreesToRadians(20)}
          maxPolarAngle={degreesToRadians(80)} // prevents going below floor
          minDistance={2}
          maxDistance={35}
        />

        {showGrid && (
          <Grid
            args={[widthM * 1.5, depthM * 1.5]}
            cellSize={0.5}
            cellColor="#1E293B"
            sectionSize={2.0}
            sectionColor="#334155"
            position={[0, -0.02, 0]}
          />
        )}

        <FloorMesh roomDimensions={roomDimensions} floorMaterial={floorMaterial} />

        {/* Tables */}
        {tables.map((table) => (
          <TableMesh
            key={table._id}
            table={table}
            roomDimensions={roomDimensions}
            isSelected={selectedTableId === table._id}
            onClick={() => onTableSelect && onTableSelect(table._id)}
            showLabels={showLabels}
          />
        ))}

        {/* Elements */}
        {elements.map((element) => (
          <RoomElementMesh
            key={element._id}
            element={element}
            roomDimensions={roomDimensions}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default VenueViewer;
