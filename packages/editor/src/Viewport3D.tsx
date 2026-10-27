// @bobby/editor/src/Viewport3D.tsx
// Interactive 3D Viewport with TransformControls gizmos, authoritative collision feedback,
// GLB contact markers, arbitrary 3D wall rendering, and drag-and-drop GLB model importing.

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RoomDimensions,
  FloorMaterial,
  WallSegment,
  cmToMeters,
  roomCoordsToWorld3D,
  world3DToRoomCoords,
  degreesToRadians,
  radiansToDegrees,
  EngineCollisionContact,
} from '@bobby/core';
import { ViewerTable, ViewerRoomElement } from '@bobby/viewer';
import { FloorMaterialBuilder, createRoomObject, buildWallSegmentMesh } from '@bobby/engine';
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
  collidingIds?: Set<string>;
  collisionContacts?: EngineCollisionContact[];
  assets?: Record<string, Uint8Array>;
  authoritativeWallGLB?: ArrayBuffer | null;
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
  collidingIds,
  collisionContacts = [],
  authoritativeWallGLB,
}) => {
  const [activeGizmo, setActiveGizmo] = useState<GizmoMode>(gizmoMode);
  const [isDragOver, setIsDragOver] = useState(false);
  const [authoritativeWallScene, setAuthoritativeWallScene] = useState<THREE.Group | null>(null);
  const selectedMeshRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<any>(null);

  // Parse authoritative wall GLB when received from bobby-engine
  useEffect(() => {
    if (!authoritativeWallGLB) {
      setAuthoritativeWallScene(null);
      return;
    }
    const loader = new GLTFLoader();
    loader.parse(
      authoritativeWallGLB,
      '',
      (gltf) => {
        setAuthoritativeWallScene(gltf.scene);
      },
      (err) => {
        console.error('Failed to parse authoritative wall GLB:', err);
      }
    );
  }, [authoritativeWallGLB]);

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
          {...({
            minPolarAngle: degreesToRadians(15),
            maxPolarAngle: degreesToRadians(80),
          } as any)}
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

        {/* 3D Wall Rendering: Authoritative GLB scene if present, otherwise procedural segment meshes */}
        {authoritativeWallScene ? (
          <primitive object={authoritativeWallScene} />
        ) : (
          wallSegments.map((wall) => {
            const wallGroup = buildWallSegmentMesh(wall, roomDimensions);
            return <primitive key={wall.id} object={wallGroup} />;
          })
        )}

        {/* Tables */}
        {tables.map((table) => {
          const isSelected = selectedId === table._id && selectedType === 'table';
          const isColliding = collidingIds ? collidingIds.has(table._id) : false;

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
                    color={isColliding ? '#EF4444' : isSelected ? '#14B8A6' : '#F59E0B'}
                    emissive={isColliding ? '#DC2626' : isSelected ? '#14B8A6' : '#000000'}
                    emissiveIntensity={isColliding ? 0.7 : isSelected ? 0.3 : 0}
                  />
                </mesh>

                {/* 3D Collision Halo Ring */}
                {isColliding && (
                  <mesh position={[0, -hM / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[Math.max(wM, dM) * 0.55, Math.max(wM, dM) * 0.65, 32]} />
                    <meshBasicMaterial color="#EF4444" side={THREE.DoubleSide} />
                  </mesh>
                )}
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
          const isColliding = collidingIds ? collidingIds.has(element._id) : false;

          const object = createRoomObject(element as any, roomDimensions as any);

          const wM = cmToMeters(element.dimensions.width);
          const dM = cmToMeters(element.dimensions.depth);
          const hM = cmToMeters(element.dimensions.height ?? 100);

          const worldPos = roomCoordsToWorld3D(
            element.position,
            element.dimensions,
            { width: roomDimensions.width, depth: roomDimensions.depth },
            true
          );

          return (
            <React.Fragment key={element._id}>
              <group
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(element._id, 'element');
                }}
              >
                <primitive object={object} />

                {/* Collision Visual Indicator for Elements */}
                {isColliding && (
                  <mesh position={[worldPos[0], worldPos[1] + hM / 2, worldPos[2]]}>
                    <boxGeometry args={[wM * 1.05, hM * 1.05, dM * 1.05]} />
                    <meshBasicMaterial color="#EF4444" wireframe />
                  </mesh>
                )}
              </group>
            </React.Fragment>
          );
        })}

        {/* 3D Collision Contact Markers */}
        {collisionContacts.map((contact, idx) => {
          if (!contact.contact_point) return null;
          return (
            <group
              key={`collision_pt_${idx}`}
              position={[contact.contact_point.x, contact.contact_point.y, contact.contact_point.z]}
            >
              <mesh>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshStandardMaterial
                  color="#EF4444"
                  emissive="#EF4444"
                  emissiveIntensity={1.0}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.12, 0.18, 24]} />
                <meshBasicMaterial color="#FCA5A5" side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}
      </Canvas>
    </div>
  );
};

export default Viewport3D;
