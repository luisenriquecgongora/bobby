// @openvenue/editor/src/Viewport3D.tsx
// Interactive 3D Viewport with TransformControls gizmos, arbitrary 3D wall rendering, and drag-and-drop GLB model importing.

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  RoomDimensions,
  FloorMaterial,
  WallSegment,
  cmToMeters,
  roomCoordsToWorld3D,
  world3DToRoomCoords,
  degreesToRadians,
  radiansToDegrees
} from '@openvenue/core';
import { ViewerTable, ViewerRoomElement } from '@openvenue/viewer';
import { FloorMaterialBuilder, createRoomObject, buildWallSegmentMesh } from '@openvenue/engine';
import { importGLBAsset, ImportedAssetResult } from './AssetImporter';
import { BoxSelect } from 'lucide-react';

export type GizmoMode = 'translate' | 'rotate' | 'scale';

interface Viewport3DProps {
  roomDimensions: RoomDimensions;
  tables: ViewerTable[];
  elements: ViewerRoomElement[];
  wallSegments?: WallSegment[];
  floorMaterial?: FloorMaterial;
  selectedId: string | null;
  selectedType: 'table' | 'element' | null;
  onSelect: (id: string | null, type: 'table' | 'element' | null) => void;
  onTableUpdate: (tableId: string, updates: Partial<ViewerTable>) => void;
  onElementUpdate: (elementId: string, updates: Partial<ViewerRoomElement>) => void;
  onAssetImported?: (result: ImportedAssetResult) => void;
  gizmoMode?: GizmoMode;
  snapEnabled?: boolean;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  roomDimensions,
  tables,
  elements,
  wallSegments = [],
  floorMaterial,
  selectedId,
  selectedType,
  onSelect,
  onTableUpdate,
  onElementUpdate,
  onAssetImported,
  gizmoMode = 'translate',
  snapEnabled = true,
}) => {
  const [activeGizmo, setActiveGizmo] = useState<GizmoMode>(gizmoMode);
  const [isDragOver, setIsDragOver] = useState(false);
  const selectedMeshRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<any>(null);

  // Keyboard shortcuts: W = translate, E = rotate, R = scale
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'w' || e.key === 'W') setActiveGizmo('translate');
      if (e.key === 'e' || e.key === 'E') setActiveGizmo('rotate');
      if (e.key === 'r' || e.key === 'R') setActiveGizmo('scale');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Drag and Drop 3D Model files (.glb / .gltf)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const glbFile = files.find((f) => /\.(glb|gltf)$/i.test(f.name));

    if (glbFile && onAssetImported) {
      try {
        const result = await importGLBAsset(glbFile, {
          x: roomDimensions.width / 2,
          y: roomDimensions.depth / 2,
        });
        onAssetImported(result);
      } catch (err: any) {
        alert(`Failed to import 3D model: ${err.message}`);
      }
    }
  };

  const widthM = cmToMeters(roomDimensions.width);
  const depthM = cmToMeters(roomDimensions.depth);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px', backgroundColor: '#090D16' }}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(20, 184, 166, 0.25)',
          border: '3px dashed #14B8A6',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <BoxSelect size={48} color="#14B8A6" />
          <h2 style={{ color: '#F8FAFC', marginTop: '12px', fontSize: '20px' }}>Drop 3D Model (.glb / .gltf) Here</h2>
          <p style={{ color: '#CCFBF1', fontSize: '13px' }}>Automatic scale detection & ground normalization</p>
        </div>
      )}

      {/* Gizmo Toolbar Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 10,
        display: 'flex',
        gap: '6px',
        backgroundColor: '#0F172A',
        padding: '6px',
        borderRadius: '10px',
        border: '1px solid #1E293B'
      }}>
        <button
          onClick={() => setActiveGizmo('translate')}
          style={{
            padding: '6px 12px',
            backgroundColor: activeGizmo === 'translate' ? '#14B8A6' : 'transparent',
            color: activeGizmo === 'translate' ? '#0F172A' : '#94A3B8',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Move (W)
        </button>
        <button
          onClick={() => setActiveGizmo('rotate')}
          style={{
            padding: '6px 12px',
            backgroundColor: activeGizmo === 'rotate' ? '#14B8A6' : 'transparent',
            color: activeGizmo === 'rotate' ? '#0F172A' : '#94A3B8',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Rotate (E)
        </button>
        <button
          onClick={() => setActiveGizmo('scale')}
          style={{
            padding: '6px 12px',
            backgroundColor: activeGizmo === 'scale' ? '#14B8A6' : 'transparent',
            color: activeGizmo === 'scale' ? '#0F172A' : '#94A3B8',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Scale (R)
        </button>
      </div>

      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 45 }}
        onPointerMissed={() => onSelect(null, null)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={0.8} castShadow />

        <OrbitControls
          ref={orbitRef}
          makeDefault
          minPolarAngle={degreesToRadians(15)}
          maxPolarAngle={degreesToRadians(80)}
        />

        <Grid
          args={[widthM * 1.5, depthM * 1.5]}
          cellSize={0.25} // 25cm grid
          cellColor="#1E293B"
          sectionSize={1.0}
          sectionColor="#334155"
          position={[0, -0.01, 0]}
        />

        {/* Floor */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <planeGeometry args={[widthM, depthM]} />
          <primitive
            object={
              floorMaterial
                ? FloorMaterialBuilder.getMaterial(floorMaterial, {
                    width: roomDimensions.width,
                    depth: roomDimensions.depth,
                  })
                : new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.8 })
            }
            attach="material"
          />
        </mesh>

        {/* 3D Wall Segments */}
        {wallSegments.map((wall) => {
          const wallGroup = buildWallSegmentMesh(wall, roomDimensions);
          return <primitive key={wall.id} object={wallGroup} />;
        })}

        {/* Tables */}
        {tables.map((table) => {
          const isSelected = selectedId === table._id && selectedType === 'table';
          const pos = roomCoordsToWorld3D(
            table.position,
            table.dimensions,
            { width: roomDimensions.width, depth: roomDimensions.depth },
            table.shape === 'custom'
          );
          const wM = cmToMeters(table.dimensions.width);
          const dM = cmToMeters(table.dimensions.depth);
          const hM = cmToMeters(table.dimensions.height);

          return (
            <React.Fragment key={table._id}>
              <group
                ref={isSelected ? selectedMeshRef : null}
                position={pos}
                rotation={[0, degreesToRadians(table.rotation), 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(table._id, 'table');
                }}
              >
                <mesh castShadow receiveShadow>
                  {table.shape === 'circle' ? (
                    <cylinderGeometry args={[wM / 2, wM / 2, hM, 32]} />
                  ) : (
                    <boxGeometry args={[wM, hM, dM]} />
                  )}
                  <meshStandardMaterial
                    color={isSelected ? '#14B8A6' : '#F59E0B'}
                    emissive={isSelected ? '#14B8A6' : '#000000'}
                    emissiveIntensity={isSelected ? 0.3 : 0}
                  />
                </mesh>
              </group>

              {isSelected && selectedMeshRef.current && (
                <TransformControls
                  object={selectedMeshRef.current}
                  mode={activeGizmo}
                  translationSnap={snapEnabled ? 0.1 : undefined} // 10cm snap
                  rotationSnap={snapEnabled ? Math.PI / 12 : undefined} // 15° snap
                  onMouseDown={() => {
                    if (orbitRef.current) orbitRef.current.enabled = false;
                  }}
                  onMouseUp={() => {
                    if (orbitRef.current) orbitRef.current.enabled = true;
                    if (selectedMeshRef.current) {
                      const newWorldPos: [number, number, number] = [
                        selectedMeshRef.current.position.x,
                        selectedMeshRef.current.position.y,
                        selectedMeshRef.current.position.z,
                      ];
                      const newRoomCoords = world3DToRoomCoords(
                        newWorldPos,
                        table.dimensions,
                        { width: roomDimensions.width, depth: roomDimensions.depth }
                      );
                      const newRotYDeg = Math.round(radiansToDegrees(selectedMeshRef.current.rotation.y));

                      onTableUpdate(table._id, {
                        position: { x: Math.round(newRoomCoords.x), y: Math.round(newRoomCoords.y) },
                        rotation: newRotYDeg,
                      });
                    }
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Room Elements */}
        {elements.map((element) => {
          const isSelected = selectedId === element._id && selectedType === 'element';
          const object = createRoomObject(element as any, roomDimensions as any);

          return (
            <React.Fragment key={element._id}>
              <group
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(element._id, 'element');
                }}
              >
                <primitive object={object} />
              </group>
            </React.Fragment>
          );
        })}
      </Canvas>
    </div>
  );
};

export default Viewport3D;
