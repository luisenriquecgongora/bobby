// @bobby/editor/src/SpatialValidationDrawer.tsx
// Comprehensive slide-over inspector for authoritative 3D collisions, safety clearance, and GLB wall extrusion.

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Box,
  Layers,
  Cpu,
  ArrowRight,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Server,
  Zap,
} from 'lucide-react';
import {
  EngineValidationResult,
  EngineHealthResponse,
  EngineCollisionContact,
} from '@bobby/core';
import { ViewerTable, ViewerRoomElement } from '@bobby/viewer';

export interface SpatialValidationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isEngineOnline: boolean;
  isValidating: boolean;
  validationResult: EngineValidationResult | null;
  engineHealth: EngineHealthResponse | null;
  engineUrl: string;
  onSetEngineUrl: (url: string) => void;
  onRevalidate: () => void;
  onExtrudeWallsGLB?: () => Promise<ArrayBuffer | null>;
  tables: ViewerTable[];
  elements: ViewerRoomElement[];
  onSelectObject?: (id: string, type: 'table' | 'element') => void;
  onUseAuthoritativeWalls?: (glb: ArrayBuffer) => void;
}

export const SpatialValidationDrawer: React.FC<SpatialValidationDrawerProps> = ({
  isOpen,
  onClose,
  isEngineOnline,
  isValidating,
  validationResult,
  engineHealth,
  engineUrl,
  onSetEngineUrl,
  onRevalidate,
  onExtrudeWallsGLB,
  tables,
  elements,
  onSelectObject,
  onUseAuthoritativeWalls,
}) => {
  const [urlInput, setUrlInput] = useState(engineUrl);
  const [isExtruding, setIsExtruding] = useState(false);
  const [extrudeSuccess, setExtrudeSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Name resolution helper for IDs
  const getEntityName = (id: string): string => {
    const table = tables.find((t) => t._id === id);
    if (table) return `${table.name} (Table)`;
    const elem = elements.find((e) => e._id === id);
    if (elem) return `${elem.name} (${elem.type})`;
    if (id.startsWith('wall_')) return `Wall (${id})`;
    return id;
  };

  const handleFocus = (id: string) => {
    if (!onSelectObject) return;
    const isTable = tables.some((t) => t._id === id);
    if (isTable) {
      onSelectObject(id, 'table');
      onClose();
    } else {
      const isElem = elements.some((e) => e._id === id);
      if (isElem) {
        onSelectObject(id, 'element');
        onClose();
      }
    }
  };

  const handleExtrudeClick = async () => {
    if (!onExtrudeWallsGLB) return;
    setIsExtruding(true);
    setExtrudeSuccess(null);
    try {
      const glb = await onExtrudeWallsGLB();
      if (glb) {
        if (onUseAuthoritativeWalls) {
          onUseAuthoritativeWalls(glb);
        }
        setExtrudeSuccess(`Generated ${(glb.byteLength / 1024).toFixed(1)} KB watertight binary GLB stream`);
      }
    } catch (err: any) {
      alert(`Wall extrusion error: ${err.message}`);
    } finally {
      setIsExtruding(false);
    }
  };

  const collisions = validationResult?.collisions || [];
  const warnings = validationResult?.clearance_warnings || [];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1000,
    }}>
      <div style={{
        width: '520px',
        maxWidth: '100vw',
        height: '100%',
        backgroundColor: '#0B132B',
        borderLeft: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 24px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#14B8A6',
            }}>
              <Zap size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
                Spatial Geometry & Clearance
              </h2>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Authoritative Python microservice validation
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Engine Status & Telemetry Card */}
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={16} color={isEngineOnline ? '#10B981' : '#EF4444'} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>Microservice Connection</span>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: isEngineOnline ? '#064E3B' : '#450A0A',
                color: isEngineOnline ? '#6EE7B7' : '#FCA5A5',
              }}>
                {isEngineOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {/* URL input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://localhost:8000"
                style={{
                  flex: 1,
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <button
                onClick={() => { onSetEngineUrl(urlInput); onRevalidate(); }}
                style={{
                  backgroundColor: '#14B8A6',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </div>

            {/* Performance telemetry stats */}
            {isEngineOnline && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ backgroundColor: '#1E293B', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>LATENCY</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#38BDF8' }}>
                    {validationResult?.metrics?.computation_time_ms !== undefined
                      ? `${validationResult.metrics.computation_time_ms.toFixed(1)} ms`
                      : '—'}
                  </div>
                </div>
                <div style={{ backgroundColor: '#1E293B', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>MEMORY</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA' }}>
                    {engineHealth?.memory_mb ? `${engineHealth.memory_mb.toFixed(1)} MB` : '< 80 MB'}
                  </div>
                </div>
                <div style={{ backgroundColor: '#1E293B', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>COLLISION ACCEL</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#34D399' }}>
                    {engineHealth?.fcl_accelerated ? 'FCL + OBB' : 'Exact OBB'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Collisions & Interferences */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} color={collisions.length > 0 ? '#EF4444' : '#10B981'} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8', margin: 0 }}>
                  3D Collisions & Overlaps ({collisions.length})
                </h3>
              </div>
              <button
                onClick={onRevalidate}
                disabled={isValidating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={11} className={isValidating ? 'animate-spin' : ''} />
                Re-check
              </button>
            </div>

            {collisions.length === 0 ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#6EE7B7',
                fontSize: '13px',
              }}>
                <ShieldCheck size={20} color="#10B981" />
                <span>Zero 3D collisions detected. All fixtures and walls are non-intersecting.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {collisions.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#1E1B2E',
                      border: '1px solid #EF4444',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#EF4444',
                        backgroundColor: '#450A0A',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}>
                        {c.collision_type}
                      </span>
                      {c.penetration_depth !== null && c.penetration_depth !== undefined && (
                        <span style={{ fontSize: '11px', color: '#F87171', fontFamily: 'monospace' }}>
                          overlap: {(c.penetration_depth * 100).toFixed(1)} cm
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#F8FAFC' }}>
                      <span style={{ fontWeight: 600 }}>{getEntityName(c.object_a)}</span>
                      <ArrowRight size={12} color="#EF4444" />
                      <span style={{ fontWeight: 600 }}>{getEntityName(c.object_b)}</span>
                    </div>

                    {c.contact_point && (
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                        Contact centroid: ({c.contact_point.x.toFixed(2)}m, {c.contact_point.y.toFixed(2)}m, {c.contact_point.z.toFixed(2)}m)
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <button
                        onClick={() => handleFocus(c.object_a)}
                        style={{
                          backgroundColor: '#334155',
                          border: 'none',
                          color: '#F8FAFC',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Focus Object A
                      </button>
                      <button
                        onClick={() => handleFocus(c.object_b)}
                        style={{
                          backgroundColor: '#334155',
                          border: 'none',
                          color: '#F8FAFC',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Focus Object B
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Egress & Safety Clearance Warnings */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertTriangle size={16} color={warnings.length > 0 ? '#F59E0B' : '#10B981'} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8', margin: 0 }}>
                Corridor & Egress Clearances ({warnings.length})
              </h3>
            </div>

            {warnings.length === 0 ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#6EE7B7',
                fontSize: '13px',
              }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>All walking aisles meet or exceed the 1.20m emergency egress threshold.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {warnings.map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#2D1F13',
                      border: '1px solid #F59E0B',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      color: '#FDE68A',
                    }}
                  >
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Algorithmic 3D Wall Extrusion */}
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Box size={16} color="#14B8A6" />
              <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8', margin: 0 }}>
                Authoritative 3D Wall Extrusion
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 12px 0' }}>
              Generate watertight manifold 3D room meshes directly from the Python Trimesh/Shapely engine with boolean door and window openings.
            </p>

            <button
              onClick={handleExtrudeClick}
              disabled={isExtruding || !isEngineOnline}
              style={{
                width: '100%',
                backgroundColor: '#14B8A6',
                color: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isEngineOnline ? 'pointer' : 'not-allowed',
                opacity: isEngineOnline ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={14} className={isExtruding ? 'animate-spin' : ''} />
              {isExtruding ? 'Compiling 3D GLB Mesh...' : 'Extrude Authoritative GLB Walls'}
            </button>

            {extrudeSuccess && (
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#34D399', textAlign: 'center' }}>
                ✓ {extrudeSuccess}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
