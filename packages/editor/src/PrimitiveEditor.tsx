// @bobby/editor/src/PrimitiveEditor.tsx
// Interactive primitive part editor (replaces the "coming soon" stub).

import React, { useState } from 'react';
import { GeometryPart, BoxParams, CylinderParams, SphereParams } from '@bobby/core';
import { Box, Circle, CircleDot, X, Check } from 'lucide-react';

interface PrimitiveEditorProps {
  isOpen: boolean;
  part: GeometryPart | null;
  onSave: (updatedPart: GeometryPart) => void;
  onCancel: () => void;
}

export const PrimitiveEditor: React.FC<PrimitiveEditorProps> = ({
  isOpen,
  part,
  onSave,
  onCancel,
}) => {
  if (!isOpen || !part) return null;

  const [partData, setPartData] = useState<GeometryPart>({ ...part });

  const handleParamChange = (field: string, value: number) => {
    setPartData((prev) => ({
      ...prev,
      params: {
        ...prev.params,
        [field]: value,
      } as any,
    }));
  };

  const handlePositionChange = (axisIndex: number, value: number) => {
    const newPos: [number, number, number] = [...partData.position];
    newPos[axisIndex] = value;
    setPartData((prev) => ({ ...prev, position: newPos }));
  };

  const handleMaterialChange = (field: string, value: any) => {
    setPartData((prev) => ({
      ...prev,
      material: {
        ...prev.material,
        [field]: value,
      },
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: '#0F172A',
        border: '1px solid #1E293B',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '520px',
        width: '100%',
        color: '#F8FAFC',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {partData.type === 'box' && <Box color="#14B8A6" size={20} />}
            {partData.type === 'cylinder' && <Circle color="#14B8A6" size={20} />}
            {partData.type === 'sphere' && <CircleDot color="#14B8A6" size={20} />}
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Edit {partData.type.toUpperCase()} Primitive</h3>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '450px', overflowY: 'auto' }}>
          {/* Dimensions */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Dimensions (meters)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
              {partData.type === 'box' && (
                <>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Width</span>
                    <input
                      type="number"
                      step="0.05"
                      value={(partData.params as BoxParams).width}
                      onChange={(e) => handleParamChange('width', parseFloat(e.target.value) || 0.1)}
                      style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Height</span>
                    <input
                      type="number"
                      step="0.05"
                      value={(partData.params as BoxParams).height}
                      onChange={(e) => handleParamChange('height', parseFloat(e.target.value) || 0.1)}
                      style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Depth</span>
                    <input
                      type="number"
                      step="0.05"
                      value={(partData.params as BoxParams).depth}
                      onChange={(e) => handleParamChange('depth', parseFloat(e.target.value) || 0.1)}
                      style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                    />
                  </div>
                </>
              )}

              {partData.type === 'cylinder' && (
                <>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Radius Top</span>
                    <input
                      type="number"
                      step="0.05"
                      value={(partData.params as CylinderParams).radiusTop}
                      onChange={(e) => handleParamChange('radiusTop', parseFloat(e.target.value) || 0.05)}
                      style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Radius Bottom</span>
                    <input
                      type="number"
                      step="0.05"
                      value={(partData.params as CylinderParams).radiusBottom}
                      onChange={(e) => handleParamChange('radiusBottom', parseFloat(e.target.value) || 0.05)}
                      style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Height</span>
                    <input
                      type="number"
                      step="0.05"
                      value={(partData.params as CylinderParams).height}
                      onChange={(e) => handleParamChange('height', parseFloat(e.target.value) || 0.1)}
                      style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                    />
                  </div>
                </>
              )}

              {partData.type === 'sphere' && (
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Radius</span>
                  <input
                    type="number"
                    step="0.05"
                    value={(partData.params as SphereParams).radius}
                    onChange={(e) => handleParamChange('radius', parseFloat(e.target.value) || 0.1)}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Position Offsets */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Local Position Offset [X, Y, Z]</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
              {['X (horizontal)', 'Y (vertical)', 'Z (depth)'].map((label, idx) => (
                <div key={idx}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{label}</span>
                  <input
                    type="number"
                    step="0.05"
                    value={partData.position[idx]}
                    onChange={(e) => handlePositionChange(idx, parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Material & Appearance */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Material & Glow</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '6px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Color</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input
                    type="color"
                    value={partData.material.color || '#14B8A6'}
                    onChange={(e) => handleMaterialChange('color', e.target.value)}
                    style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={partData.material.color || '#14B8A6'}
                    onChange={(e) => handleMaterialChange('color', e.target.value)}
                    style={{ flex: 1, background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                  />
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Emissive Glow (Neon)</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <input
                    type="color"
                    value={partData.material.emissive || '#000000'}
                    onChange={(e) => handleMaterialChange('emissive', e.target.value)}
                    style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    placeholder="Intensity"
                    value={partData.material.emissiveIntensity || 0}
                    onChange={(e) => handleMaterialChange('emissiveIntensity', parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '8px', padding: '6px 8px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#94A3B8',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(partData)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#14B8A6',
              border: 'none',
              borderRadius: '8px',
              color: '#0F172A',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Check size={16} /> Save Primitive
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrimitiveEditor;
