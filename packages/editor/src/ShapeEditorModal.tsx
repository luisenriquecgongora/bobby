// @bobby/editor/src/ShapeEditorModal.tsx
// Interactive 3D Composite Shape and Primitive Geometry Builder Modal.
// Enables creating, editing, and previewing multi-part 3D shapes with PBR materials and neon glow.

import React, { useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import {
  GeometryPart,
  BoxParams,
  CylinderParams,
  SphereParams,
  CustomGeometry,
  RoomElementType,
} from '@bobby/core';
import { ViewerRoomElement } from '@bobby/viewer';
import { buildObjectFromDefinition } from '@bobby/engine';
import { PrimitiveEditor } from './PrimitiveEditor';
import {
  Box,
  Circle,
  CircleDot,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Check,
  X,
  Sparkles,
  Layers,
  Palette,
  RotateCcw,
} from 'lucide-react';

export interface ShapeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  element: ViewerRoomElement | null;
  onSave: (customGeometry: CustomGeometry, updatedDimensions?: { width: number; depth: number; height: number }) => void;
}

interface ShapeTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  parts: GeometryPart[];
  suggestedDimensions: { width: number; depth: number; height: number }; // cm
}

const SHAPE_TEMPLATES: ShapeTemplate[] = [
  {
    id: 'single_box',
    name: 'Simple Block',
    description: 'Clean single geometric cube primitive',
    icon: '📦',
    suggestedDimensions: { width: 120, depth: 80, height: 80 },
    parts: [
      {
        type: 'box',
        position: [0, 0.4, 0],
        material: { color: '#14B8A6', metalness: 0.2, roughness: 0.5, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 1.2, height: 0.8, depth: 0.8 },
      },
    ],
  },
  {
    id: 'pillar_column',
    name: 'Pillar / Column',
    description: 'Architectural column with plinth, capital, and neon ring',
    icon: '🏛️',
    suggestedDimensions: { width: 90, depth: 90, height: 300 },
    parts: [
      {
        type: 'cylinder',
        position: [0, 1.5, 0],
        material: { color: '#1E293B', metalness: 0.3, roughness: 0.6, emissive: '#000000', emissiveIntensity: 0 },
        params: { radiusTop: 0.35, radiusBottom: 0.35, height: 2.8, radialSegments: 32 },
      },
      {
        type: 'box',
        position: [0, 0.08, 0],
        material: { color: '#334155', metalness: 0.2, roughness: 0.7, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 0.9, height: 0.16, depth: 0.9 },
      },
      {
        type: 'box',
        position: [0, 2.92, 0],
        material: { color: '#334155', metalness: 0.2, roughness: 0.7, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 0.9, height: 0.16, depth: 0.9 },
      },
      {
        type: 'cylinder',
        position: [0, 1.5, 0],
        material: { color: '#14B8A6', metalness: 0.1, roughness: 0.2, emissive: '#14B8A6', emissiveIntensity: 1.8 },
        params: { radiusTop: 0.38, radiusBottom: 0.38, height: 0.06, radialSegments: 32 },
      },
    ],
  },
  {
    id: 'cocktail_bar',
    name: 'Cocktail Bar Counter',
    description: 'Multi-tiered bar counter with wooden top, front glow, and brass rail',
    icon: '🍸',
    suggestedDimensions: { width: 340, depth: 95, height: 110 },
    parts: [
      {
        type: 'box',
        position: [0, 0.5, 0],
        material: { color: '#1E293B', metalness: 0.2, roughness: 0.7, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 3.2, height: 1.0, depth: 0.8 },
      },
      {
        type: 'box',
        position: [0, 1.04, 0],
        material: { color: '#F59E0B', metalness: 0.1, roughness: 0.4, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 3.4, height: 0.08, depth: 0.95 },
      },
      {
        type: 'box',
        position: [0, 0.9, -0.42],
        material: { color: '#14B8A6', metalness: 0.1, roughness: 0.1, emissive: '#14B8A6', emissiveIntensity: 1.6 },
        params: { width: 3.0, height: 0.08, depth: 0.04 },
      },
      {
        type: 'cylinder',
        position: [0, 0.15, -0.45],
        material: { color: '#94A3B8', metalness: 0.8, roughness: 0.2, emissive: '#000000', emissiveIntensity: 0 },
        params: { radiusTop: 0.03, radiusBottom: 0.03, height: 3.0, radialSegments: 16 },
      },
    ],
  },
  {
    id: 'dj_booth',
    name: 'DJ Performance Booth',
    description: 'Electronic console with elevated deck and hot-pink neon banner',
    icon: '🎧',
    suggestedDimensions: { width: 220, depth: 85, height: 115 },
    parts: [
      {
        type: 'box',
        position: [0, 0.45, 0],
        material: { color: '#0F172A', metalness: 0.3, roughness: 0.6, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 2.2, height: 0.9, depth: 0.85 },
      },
      {
        type: 'box',
        position: [0, 0.93, 0],
        material: { color: '#334155', metalness: 0.4, roughness: 0.5, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 2.0, height: 0.06, depth: 0.7 },
      },
      {
        type: 'box',
        position: [0, 0.55, -0.44],
        material: { color: '#EC4899', metalness: 0.1, roughness: 0.2, emissive: '#EC4899', emissiveIntensity: 2.0 },
        params: { width: 1.8, height: 0.45, depth: 0.04 },
      },
      {
        type: 'box',
        position: [0, 1.05, 0.22],
        material: { color: '#06B6D4', metalness: 0.2, roughness: 0.2, emissive: '#06B6D4', emissiveIntensity: 1.4 },
        params: { width: 0.8, height: 0.2, depth: 0.04 },
      },
    ],
  },
  {
    id: 'lounge_sofa',
    name: 'VIP Lounge Sofa',
    description: 'Plush velvet sofa with deep purple backrest and underglow',
    icon: '🛋️',
    suggestedDimensions: { width: 240, depth: 95, height: 85 },
    parts: [
      {
        type: 'box',
        position: [0, 0.2, 0],
        material: { color: '#3B0764', metalness: 0.1, roughness: 0.8, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 2.4, height: 0.4, depth: 0.9 },
      },
      {
        type: 'box',
        position: [0, 0.62, 0.32],
        material: { color: '#581C87', metalness: 0.1, roughness: 0.8, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 2.4, height: 0.45, depth: 0.26 },
      },
      {
        type: 'box',
        position: [-1.15, 0.42, 0],
        material: { color: '#581C87', metalness: 0.1, roughness: 0.8, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 0.22, height: 0.45, depth: 0.9 },
      },
      {
        type: 'box',
        position: [1.15, 0.42, 0],
        material: { color: '#581C87', metalness: 0.1, roughness: 0.8, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 0.22, height: 0.45, depth: 0.9 },
      },
      {
        type: 'box',
        position: [0, 0.02, 0],
        material: { color: '#A855F7', metalness: 0.1, roughness: 0.1, emissive: '#A855F7', emissiveIntensity: 1.4 },
        params: { width: 2.2, height: 0.02, depth: 0.7 },
      },
    ],
  },
  {
    id: 'stage_platform',
    name: 'Stage Platform',
    description: 'Elevated live stage with step and front teal neon accent',
    icon: '🎤',
    suggestedDimensions: { width: 400, depth: 300, height: 60 },
    parts: [
      {
        type: 'box',
        position: [0, 0.3, 0],
        material: { color: '#1E293B', metalness: 0.3, roughness: 0.7, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 4.0, height: 0.6, depth: 3.0 },
      },
      {
        type: 'box',
        position: [0, 0.15, -1.7],
        material: { color: '#334155', metalness: 0.3, roughness: 0.7, emissive: '#000000', emissiveIntensity: 0 },
        params: { width: 3.4, height: 0.3, depth: 0.4 },
      },
      {
        type: 'box',
        position: [0, 0.58, -1.5],
        material: { color: '#14B8A6', metalness: 0.1, roughness: 0.1, emissive: '#14B8A6', emissiveIntensity: 1.8 },
        params: { width: 4.02, height: 0.04, depth: 0.04 },
      },
    ],
  },
];

/**
 * 3D Preview Canvas sub-component
 */
const PreviewObjectGroup: React.FC<{ parts: GeometryPart[] }> = ({ parts }) => {
  const group = useMemo(() => {
    return buildObjectFromDefinition(
      {
        id: 'preview_geom',
        type: RoomElementType.CUSTOM,
        name: 'Preview Shape',
        parts,
        defaultDimensions: [1, 1, 1],
      },
      undefined,
      true,
      true
    );
  }, [parts]);

  return <primitive object={group} />;
};

export const ShapeEditorModal: React.FC<ShapeEditorModalProps> = ({
  isOpen,
  onClose,
  element,
  onSave,
}) => {
  if (!isOpen || !element) return null;

  const [parts, setParts] = useState<GeometryPart[]>(() => {
    if (element.customGeometry?.parts && element.customGeometry.parts.length > 0) {
      return JSON.parse(JSON.stringify(element.customGeometry.parts));
    }
    const wM = (element.dimensions.width || 100) * 0.01;
    const hM = (element.dimensions.height || 100) * 0.01;
    const dM = (element.dimensions.depth || 100) * 0.01;
    return [
      {
        type: 'box',
        position: [0, hM / 2, 0],
        material: {
          color: element.color || '#14B8A6',
          metalness: 0.2,
          roughness: 0.5,
          emissive: '#000000',
          emissiveIntensity: 0,
        },
        params: { width: wM, height: hM, depth: dM },
      },
    ];
  });

  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'parts' | 'templates'>('parts');

  // Sync parts when element changes
  useEffect(() => {
    if (element.customGeometry?.parts && element.customGeometry.parts.length > 0) {
      setParts(JSON.parse(JSON.stringify(element.customGeometry.parts)));
    }
  }, [element._id]);

  const handleAddPart = (type: 'box' | 'cylinder' | 'sphere') => {
    let newPart: GeometryPart;
    if (type === 'box') {
      newPart = {
        type: 'box',
        position: [0, 0.4, 0],
        material: {
          color: '#14B8A6',
          metalness: 0.2,
          roughness: 0.5,
          emissive: '#000000',
          emissiveIntensity: 0,
        },
        params: { width: 1.0, height: 0.8, depth: 1.0 },
      };
    } else if (type === 'cylinder') {
      newPart = {
        type: 'cylinder',
        position: [0, 0.6, 0],
        material: {
          color: '#A855F7',
          metalness: 0.2,
          roughness: 0.5,
          emissive: '#000000',
          emissiveIntensity: 0,
        },
        params: { radiusTop: 0.4, radiusBottom: 0.4, height: 1.2, radialSegments: 32 },
      };
    } else {
      newPart = {
        type: 'sphere',
        position: [0, 0.5, 0],
        material: {
          color: '#F59E0B',
          metalness: 0.3,
          roughness: 0.4,
          emissive: '#000000',
          emissiveIntensity: 0,
        },
        params: { radius: 0.5, widthSegments: 32, heightSegments: 16 },
      };
    }
    setParts((prev) => [...prev, newPart]);
    setEditingPartIndex(parts.length);
  };

  const handleDuplicatePart = (index: number) => {
    const source = parts[index];
    const clone: GeometryPart = JSON.parse(JSON.stringify(source));
    clone.position = [source.position[0] + 0.1, source.position[1], source.position[2] + 0.1];
    setParts((prev) => [...prev, clone]);
  };

  const handleDeletePart = (index: number) => {
    setParts((prev) => prev.filter((_, i) => i !== index));
    if (editingPartIndex === index) setEditingPartIndex(null);
  };

  const handleSavePart = (updatedPart: GeometryPart) => {
    if (editingPartIndex === null) return;
    setParts((prev) => prev.map((p, i) => (i === editingPartIndex ? updatedPart : p)));
    setEditingPartIndex(null);
  };

  const handleApplyTemplate = (tpl: ShapeTemplate) => {
    setParts(JSON.parse(JSON.stringify(tpl.parts)));
    setActiveTab('parts');
  };

  const handleSave = () => {
    const customGeometry: CustomGeometry = {
      parts,
      baseColor: element.color || '#14B8A6',
      version: '1.0.0',
    };
    onSave(customGeometry);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1080px',
          height: '85vh',
          maxHeight: '820px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          color: '#F8FAFC',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0B1120',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#134E4A',
                border: '1px solid #14B8A6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#14B8A6',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, letterSpacing: '0.02em' }}>
                3D Shape & Geometry Builder
              </h2>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                Customizing {element.name} ({element.type}) • {parts.length} primitive parts
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', backgroundColor: '#1E293B', borderRadius: '8px', padding: '3px' }}>
              <button
                onClick={() => setActiveTab('parts')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: activeTab === 'parts' ? '#14B8A6' : 'transparent',
                  color: activeTab === 'parts' ? '#0F172A' : '#94A3B8',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Layers size={14} /> Parts ({parts.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: activeTab === 'templates' ? '#14B8A6' : 'transparent',
                  color: activeTab === 'templates' ? '#0F172A' : '#94A3B8',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={14} /> Shape Presets
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Controls, Right 3D Viewport */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Column: Parts list or Templates */}
          <div
            style={{
              width: '440px',
              borderRight: '1px solid #1E293B',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0F172A',
            }}
          >
            {activeTab === 'parts' && (
              <>
                {/* Add Primitives Bar */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                    Add Primitive
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleAddPart('box')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#F8FAFC',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Box size={13} color="#14B8A6" /> Box
                    </button>
                    <button
                      onClick={() => handleAddPart('cylinder')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#F8FAFC',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Circle size={13} color="#A855F7" /> Cylinder
                    </button>
                    <button
                      onClick={() => handleAddPart('sphere')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#F8FAFC',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <CircleDot size={13} color="#F59E0B" /> Sphere
                    </button>
                  </div>
                </div>

                {/* Parts List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {parts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                      <p style={{ margin: '0 0 12px 0', fontSize: '13px' }}>No primitives in this shape.</p>
                      <p style={{ margin: 0, fontSize: '12px' }}>Click Box, Cylinder, or Sphere above to add parts, or pick a Shape Preset!</p>
                    </div>
                  ) : (
                    parts.map((p, idx) => {
                      const isEmissive = (p.material.emissiveIntensity || 0) > 0.2;
                      return (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: '10px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '3px',
                                  backgroundColor: p.material.color || '#14B8A6',
                                  boxShadow: isEmissive ? `0 0 8px ${p.material.emissive || p.material.color}` : 'none',
                                }}
                              />
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>
                                Part #{idx + 1}: {p.type.toUpperCase()}
                              </span>
                              {isEmissive && (
                                <span
                                  style={{
                                    fontSize: '9px',
                                    color: '#14B8A6',
                                    backgroundColor: '#134E4A',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                  }}
                                >
                                  NEON GLOW
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={() => setEditingPartIndex(idx)}
                                title="Edit primitive parameters"
                                style={{
                                  padding: '5px 8px',
                                  backgroundColor: '#0F172A',
                                  border: '1px solid #334155',
                                  borderRadius: '6px',
                                  color: '#38BDF8',
                                  cursor: 'pointer',
                                }}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDuplicatePart(idx)}
                                title="Duplicate primitive"
                                style={{
                                  padding: '5px 8px',
                                  backgroundColor: '#0F172A',
                                  border: '1px solid #334155',
                                  borderRadius: '6px',
                                  color: '#94A3B8',
                                  cursor: 'pointer',
                                }}
                              >
                                <Copy size={13} />
                              </button>
                              <button
                                onClick={() => handleDeletePart(idx)}
                                title="Delete primitive"
                                style={{
                                  padding: '5px 8px',
                                  backgroundColor: '#0F172A',
                                  border: '1px solid #334155',
                                  borderRadius: '6px',
                                  color: '#EF4444',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Dimensions & Offset Metrics */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                              color: '#94A3B8',
                              backgroundColor: '#0F172A',
                              padding: '6px 10px',
                              borderRadius: '6px',
                            }}
                          >
                            <span>
                              {p.type === 'box' && `Size: ${(p.params as BoxParams).width}m × ${(p.params as BoxParams).height}m × ${(p.params as BoxParams).depth}m`}
                              {p.type === 'cylinder' && `R: ${(p.params as CylinderParams).radiusTop}m, H: ${(p.params as CylinderParams).height}m`}
                              {p.type === 'sphere' && `Radius: ${(p.params as SphereParams).radius}m`}
                            </span>
                            <span style={{ color: '#64748B' }}>
                              Pos: [{p.position[0].toFixed(2)}, {p.position[1].toFixed(2)}, {p.position[2].toFixed(2)}]
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {activeTab === 'templates' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94A3B8' }}>
                  Load a pre-configured architectural 3D shape preset with materials, coordinates, and neon glow:
                </p>
                {SHAPE_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl)}
                    style={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#14B8A6')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#334155')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>{tpl.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>{tpl.name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{tpl.description}</div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#14B8A6',
                        backgroundColor: '#134E4A',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {tpl.parts.length} parts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Interactive 3D Canvas Preview */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              backgroundColor: '#090D16',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                color: '#94A3B8',
                display: 'flex',
                gap: '12px',
              }}
            >
              <span>Left-click + Drag to rotate</span>
              <span>Right-click to pan</span>
              <span>Scroll to zoom</span>
            </div>

            <Canvas camera={{ position: [2.8, 2.4, 3.2], fov: 45 }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 8, 5]} intensity={1.5} />
              <directionalLight position={[-5, 5, -5]} intensity={0.6} />
              <pointLight position={[0, 4, 0]} intensity={0.8} />

              <PreviewObjectGroup parts={parts} />

              <OrbitControls
                makeDefault
                {...({
                  enablePan: true,
                  maxPolarAngle: Math.PI / 2 + 0.1,
                } as any)}
              />
              <gridHelper args={[10, 20, '#334155', '#1E293B']} />
            </Canvas>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0B1120',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
            <Sparkles size={14} color="#14B8A6" />
            <span>Saves directly into room element custom geometry in PlaatoOS/Takient format</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#94A3B8',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                backgroundColor: '#14B8A6',
                border: 'none',
                borderRadius: '8px',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Check size={16} /> Save 3D Shape
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Primitive Part Editor Modal */}
      {editingPartIndex !== null && (
        <PrimitiveEditor
          isOpen={true}
          part={parts[editingPartIndex]}
          onSave={handleSavePart}
          onCancel={() => setEditingPartIndex(null)}
        />
      )}
    </div>
  );
};

export default ShapeEditorModal;
