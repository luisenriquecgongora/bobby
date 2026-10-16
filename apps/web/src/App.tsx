import React, { useState } from 'react';
import {
  RoomDimensions,
  FloorMaterial,
  TableShape,
  TableCategory
} from '@openvenue/core';
import { ViewerTable, ViewerRoomElement } from '@openvenue/viewer';
import { Viewport3D, PrimitiveEditor } from '@openvenue/editor';
import {
  Box,
  Layers,
  Plus,
  Download,
  UploadCloud,
  Eye,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const INITIAL_ROOM: RoomDimensions = {
  width: 1600, // 16 meters
  depth: 1200, // 12 meters
  height: 400, // 4 meters
  unit: 'cm',
};

const INITIAL_FLOOR: FloorMaterial = {
  type: 'procedural',
  pattern: 'wood',
  patternConfig: {
    primaryColor: '#8B5A2B',
    secondaryColor: '#5C3A1E',
    plankWidth: 15,
    plankLength: 120,
    variation: 0.2,
  },
};

const INITIAL_TABLES: ViewerTable[] = [
  {
    _id: 'table_1',
    name: 'VIP Booth 1',
    shape: TableShape.RECTANGLE,
    category: TableCategory.VIP,
    position: { x: 250, y: 250, z: 0 },
    dimensions: { width: 220, depth: 120, height: 75 },
    rotation: 0,
    minCapacity: 4,
    maxCapacity: 8,
    basePrice: 500,
  },
  {
    _id: 'table_2',
    name: 'Standard Table 2',
    shape: TableShape.CIRCLE,
    category: TableCategory.STANDARD,
    position: { x: 700, y: 500, z: 0 },
    dimensions: { width: 120, depth: 120, height: 75 },
    rotation: 0,
    minCapacity: 2,
    maxCapacity: 4,
    basePrice: 150,
  },
  {
    _id: 'table_3',
    name: 'Cocktail High Table 3',
    shape: TableShape.CIRCLE,
    category: TableCategory.BAR,
    position: { x: 1100, y: 700, z: 0 },
    dimensions: { width: 80, depth: 80, height: 105 },
    rotation: 0,
    minCapacity: 2,
    maxCapacity: 4,
    basePrice: 200,
  },
];

const INITIAL_ELEMENTS: ViewerRoomElement[] = [
  {
    _id: 'elem_bar',
    name: 'Main Cocktail Bar',
    type: 'bar_counter',
    position: { x: 800, y: 1050, z: 0 },
    dimensions: { width: 500, depth: 120, height: 110 },
    rotation: 0,
    color: '#8B5CF6',
  },
  {
    _id: 'elem_dj',
    name: 'DJ Riser Stage',
    type: 'stage',
    position: { x: 800, y: 150, z: 0 },
    dimensions: { width: 350, depth: 200, height: 60 },
    rotation: 0,
    color: '#EC4899',
  },
];

export default function App() {
  const [room] = useState<RoomDimensions>(INITIAL_ROOM);
  const [tables, setTables] = useState<ViewerTable[]>(INITIAL_TABLES);
  const [elements, setElements] = useState<ViewerRoomElement[]>(INITIAL_ELEMENTS);
  const [selectedId, setSelectedId] = useState<string | null>('table_1');
  const [selectedType, setSelectedType] = useState<'table' | 'element' | null>('table');
  const [isPrimitiveEditorOpen, setIsPrimitiveEditorOpen] = useState(false);

  const selectedTable = tables.find((t) => t._id === selectedId);
  const selectedElement = elements.find((e) => e._id === selectedId);

  const handleTableUpdate = (tableId: string, updates: Partial<ViewerTable>) => {
    setTables((prev) =>
      prev.map((t) => (t._id === tableId ? { ...t, ...updates } : t))
    );
  };

  const handleElementUpdate = (elementId: string, updates: Partial<ViewerRoomElement>) => {
    setElements((prev) =>
      prev.map((e) => (e._id === elementId ? { ...e, ...updates } : e))
    );
  };

  const handleAddTable = () => {
    const newId = `table_${Date.now()}`;
    const newTable: ViewerTable = {
      _id: newId,
      name: `Table ${tables.length + 1}`,
      shape: TableShape.RECTANGLE,
      category: TableCategory.STANDARD,
      position: { x: 500, y: 500, z: 0 },
      dimensions: { width: 140, depth: 90, height: 75 },
      rotation: 0,
      minCapacity: 2,
      maxCapacity: 4,
      basePrice: 100,
    };
    setTables([...tables, newTable]);
    setSelectedId(newId);
    setSelectedType('table');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#090D16' }}>
      {/* Top Navbar */}
      <header style={{
        height: '56px',
        borderBottom: '1px solid #1E293B',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#14B8A6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontWeight: 'bold',
          }}>
            3D
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.02em', margin: 0 }}>
              Plaato Studio <span style={{ fontSize: '11px', color: '#14B8A6', backgroundColor: '#134E4A', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>OpenVenue3D</span>
            </h1>
          </div>
        </div>

        {/* Center Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleAddTable}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Plus size={16} color="#14B8A6" /> Add Table
          </button>
        </div>

        {/* Cloud Sync & Export */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => alert('Saved local .venue bundle to your laptop disk.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#94A3B8',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <Download size={15} /> Export .venue
          </button>
          <button
            onClick={() => alert('Opt-In 3D Cloud Sync: Uploads clean JSON metadata and sends .glb models directly to Cloudflare R2.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#14B8A6',
              border: 'none',
              color: '#0F172A',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UploadCloud size={16} /> Publish to PlaatoOS
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar: Scene Hierarchy */}
        <aside style={{
          width: '260px',
          borderRight: '1px solid #1E293B',
          backgroundColor: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10
        }}>
          <div style={{ padding: '14px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="#14B8A6" />
            <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8' }}>Scene Hierarchy</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, padding: '4px 8px', textTransform: 'uppercase' }}>Tables ({tables.length})</div>
            {tables.map((t) => (
              <div
                key={t._id}
                onClick={() => { setSelectedId(t._id); setSelectedType('table'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: selectedId === t._id ? '#1E293B' : 'transparent',
                  border: selectedId === t._id ? '1px solid #14B8A6' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>{t.name}</span>
                <span style={{ fontSize: '10px', color: '#14B8A6', backgroundColor: '#134E4A', padding: '2px 6px', borderRadius: '4px' }}>{t.category}</span>
              </div>
            ))}

            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, padding: '12px 8px 4px 8px', textTransform: 'uppercase' }}>Fixtures ({elements.length})</div>
            {elements.map((e) => (
              <div
                key={e._id}
                onClick={() => { setSelectedId(e._id); setSelectedType('element'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: selectedId === e._id ? '#1E293B' : 'transparent',
                  border: selectedId === e._id ? '1px solid #14B8A6' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '13px', color: '#F8FAFC' }}>{e.name}</span>
                <span style={{ fontSize: '10px', color: '#A855F7', backgroundColor: '#3B0764', padding: '2px 6px', borderRadius: '4px' }}>{e.type}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: 3D Viewport with Transform Gizmos */}
        <main style={{ flex: 1, position: 'relative' }}>
          <Viewport3D
            roomDimensions={room}
            tables={tables}
            elements={elements}
            floorMaterial={INITIAL_FLOOR}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={(id, type) => { setSelectedId(id); setSelectedType(type); }}
            onTableUpdate={handleTableUpdate}
            onElementUpdate={handleElementUpdate}
          />
        </main>

        {/* Right Sidebar: Inspector */}
        <aside style={{
          width: '300px',
          borderLeft: '1px solid #1E293B',
          backgroundColor: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10
        }}>
          <div style={{ padding: '14px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="#14B8A6" />
            <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8' }}>Inspector</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {selectedTable && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Table Name</label>
                  <input
                    type="text"
                    value={selectedTable.name}
                    onChange={(e) => handleTableUpdate(selectedTable._id, { name: e.target.value })}
                    style={{ width: '100%', marginTop: '4px', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Category</label>
                  <select
                    value={selectedTable.category}
                    onChange={(e) => handleTableUpdate(selectedTable._id, { category: e.target.value as any })}
                    style={{ width: '100%', marginTop: '4px', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '8px' }}
                  >
                    <option value="standard">Standard</option>
                    <option value="vip">VIP</option>
                    <option value="bar">Bar</option>
                    <option value="balcony">Balcony</option>
                    <option value="booth">Booth</option>
                    <option value="lounge">Lounge</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Dimensions (cm)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '4px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>W</span>
                      <input
                        type="number"
                        value={selectedTable.dimensions.width}
                        onChange={(e) => handleTableUpdate(selectedTable._id, {
                          dimensions: { ...selectedTable.dimensions, width: parseFloat(e.target.value) || 50 }
                        })}
                        style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>D</span>
                      <input
                        type="number"
                        value={selectedTable.dimensions.depth}
                        onChange={(e) => handleTableUpdate(selectedTable._id, {
                          dimensions: { ...selectedTable.dimensions, depth: parseFloat(e.target.value) || 50 }
                        })}
                        style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>H</span>
                      <input
                        type="number"
                        value={selectedTable.dimensions.height}
                        onChange={(e) => handleTableUpdate(selectedTable._id, {
                          dimensions: { ...selectedTable.dimensions, height: parseFloat(e.target.value) || 50 }
                        })}
                        style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Capacity</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '4px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>Min Guests</span>
                      <input
                        type="number"
                        value={selectedTable.minCapacity || 1}
                        onChange={(e) => handleTableUpdate(selectedTable._id, { minCapacity: parseInt(e.target.value) || 1 })}
                        style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>Max Guests</span>
                      <input
                        type="number"
                        value={selectedTable.maxCapacity || 4}
                        onChange={(e) => handleTableUpdate(selectedTable._id, { maxCapacity: parseInt(e.target.value) || 1 })}
                        style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedTable && selectedElement && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Fixture Name</label>
                  <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => handleElementUpdate(selectedElement._id, { name: e.target.value })}
                    style={{ width: '100%', marginTop: '4px', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Type</label>
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '13px', color: '#F8FAFC', background: '#1E293B', padding: '8px', borderRadius: '6px' }}>
                    {selectedElement.type}
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
