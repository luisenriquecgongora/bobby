import React, { useState } from 'react';
import {
  RoomDimensions,
  FloorMaterial,
  TableShape,
  TableCategory,
  WallSegment,
  packVenueToZip,
  unpackVenueFromZip,
  VenueProject
} from '@bobby/core';
import { ViewerTable, ViewerRoomElement } from '@bobby/viewer';
import { Viewport3D, WallPenTool, ImportedAssetResult } from '@bobby/editor';
import {
  Box,
  Layers,
  Plus,
  Save,
  FolderOpen,
  UploadCloud,
  Sliders,
  CheckCircle,
  HardDrive,
  PenTool
} from 'lucide-react';

const INITIAL_ROOM: RoomDimensions = {
  width: 1800, // 18m
  depth: 1400, // 14m
  height: 450, // 4.5m
  unit: 'cm',
};

const INITIAL_FLOOR: FloorMaterial = {
  type: 'procedural',
  pattern: 'wood',
  patternConfig: {
    primaryColor: '#7A4B20',
    secondaryColor: '#4A2B0F',
    plankWidth: 15,
    plankLength: 120,
    variation: 0.25,
  },
};

const INITIAL_TABLES: ViewerTable[] = [
  {
    _id: 'tbl_vip_a',
    name: 'VIP Booth A',
    shape: TableShape.RECTANGLE,
    category: TableCategory.VIP,
    position: { x: 300, y: 300, z: 0 },
    dimensions: { width: 240, depth: 120, height: 75 },
    rotation: 0,
    minCapacity: 6,
    maxCapacity: 10,
    basePrice: 600,
  },
  {
    _id: 'tbl_lounge_b',
    name: 'Lounge Table B',
    shape: TableShape.CIRCLE,
    category: TableCategory.LOUNGE,
    position: { x: 800, y: 600, z: 0 },
    dimensions: { width: 140, depth: 140, height: 75 },
    rotation: 0,
    minCapacity: 4,
    maxCapacity: 6,
    basePrice: 300,
  },
];

const INITIAL_ELEMENTS: ViewerRoomElement[] = [
  {
    _id: 'elem_bar_1',
    name: 'VIP Bar Island',
    type: 'bar_counter',
    position: { x: 900, y: 1200, z: 0 },
    dimensions: { width: 600, depth: 140, height: 110 },
    rotation: 0,
    color: '#14B8A6',
  },
];

export default function App() {
  const [room, setRoom] = useState<RoomDimensions>(INITIAL_ROOM);
  const [tables, setTables] = useState<ViewerTable[]>(INITIAL_TABLES);
  const [elements, setElements] = useState<ViewerRoomElement[]>(INITIAL_ELEMENTS);
  const [wallSegments, setWallSegments] = useState<WallSegment[]>([]);
  const [isWallPenOpen, setIsWallPenOpen] = useState(false);
  const [assets, setAssets] = useState<Record<string, Uint8Array>>({});
  const [selectedId, setSelectedId] = useState<string | null>('tbl_vip_a');
  const [selectedType, setSelectedType] = useState<'table' | 'element' | null>('table');
  const [statusMessage, setStatusMessage] = useState<string>('Offline Mode Active (Local Storage Only)');

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

  const handleAssetImported = (result: ImportedAssetResult) => {
    setAssets((prev) => ({ ...prev, [result.filename]: result.binaryData }));
    setElements((prev) => [...prev, result.newElement]);
    setSelectedId(result.newElement._id);
    setSelectedType('element');
    setStatusMessage(`Imported 3D model "${result.filename}" (${result.dimensionsCm.width}x${result.dimensionsCm.depth}cm)`);
  };

  // Offline Native Save (.venue file)
  const handleSaveVenueLocally = async () => {
    try {
      const project: VenueProject = {
        manifest: {
          version: '1.0.0',
          name: 'My Venue Project',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dimensions: room,
          generator: 'Plaato Studio Desktop v0.1.0 (Tauri)',
        },
        scene: {
          room,
          floorMaterial: INITIAL_FLOOR,
          tables,
          elements,
          walls: wallSegments as any,
        },
        assets,
      };

      const blob = await packVenueToZip(project);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_venue_${Date.now()}.venue`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMessage(`Saved .venue file with ${tables.length} tables, ${wallSegments.length} walls, and ${Object.keys(assets).length} models`);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  // Offline Native Load (.venue file)
  const handleLoadVenueLocally = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.venue,application/zip';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const project = await unpackVenueFromZip(file);
        if (project.scene.room) setRoom(project.scene.room);
        if (project.scene.tables) setTables(project.scene.tables);
        if (project.scene.elements) setElements(project.scene.elements);
        if (project.scene.walls) setWallSegments(project.scene.walls as any);
        if (project.assets) setAssets(project.assets);
        setStatusMessage(`Loaded project "${project.manifest.name}" from .venue archive`);
      } catch (err: any) {
        alert(`Failed to load .venue file: ${err.message}`);
      }
    };
    input.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#090D16' }}>
      {/* Native Desktop Header */}
      <header style={{
        height: '52px',
        borderBottom: '1px solid #1E293B',
        backgroundColor: '#0A0F1D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: '#14B8A6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontWeight: 800,
            fontSize: '16px'
          }}>
            🛠️
          </div>
          <div>
            <h1 style={{ fontSize: '14px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Bobby <span style={{ fontSize: '11px', color: '#F59E0B' }}>Builder</span>
              <span style={{ fontSize: '10px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#064E3B', padding: '1px 6px', borderRadius: '4px' }}>
                <HardDrive size={10} /> 100% Offline Native
              </span>
            </h1>
          </div>
        </div>

        {/* Tools & File Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsWallPenOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isWallPenOpen ? '#14B8A6' : '#1E293B',
              color: isWallPenOpen ? '#0F172A' : '#F8FAFC',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <PenTool size={14} color={isWallPenOpen ? '#0F172A' : '#14B8A6'} /> Draw Walls ({wallSegments.length})
          </button>

          <button
            onClick={handleLoadVenueLocally}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <FolderOpen size={14} color="#14B8A6" /> Open .venue
          </button>

          <button
            onClick={handleSaveVenueLocally}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <Save size={14} color="#14B8A6" /> Save Project
          </button>
        </div>

        {/* Cloud Opt-in */}
        <div>
          <button
            onClick={() => alert('Opt-in 3D Cloud Sync: Sends sanitized JSON metadata to api-takient and custom models straight to Cloudflare R2.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#14B8A6',
              border: 'none',
              color: '#0F172A',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UploadCloud size={14} /> Sync to PlaatoOS
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <aside style={{ width: '250px', borderRight: '1px solid #1E293B', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#14B8A6" />
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8' }}>Venue Objects</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, padding: '4px', textTransform: 'uppercase' }}>Walls ({wallSegments.length})</div>
            {wallSegments.map((w, idx) => (
              <div
                key={w.id}
                onClick={() => setIsWallPenOpen(true)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#1E293B',
                  cursor: 'pointer',
                  marginBottom: '3px',
                }}
              >
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Wall {idx + 1}</span>
                <span style={{ fontSize: '10px', color: '#38BDF8' }}>{w.openings?.length || 0} cutouts</span>
              </div>
            ))}

            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, padding: '10px 4px 4px 4px', textTransform: 'uppercase' }}>Tables ({tables.length})</div>
            {tables.map((t) => (
              <div
                key={t._id}
                onClick={() => { setSelectedId(t._id); setSelectedType('table'); }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  backgroundColor: selectedId === t._id ? '#1E293B' : 'transparent',
                  border: selectedId === t._id ? '1px solid #14B8A6' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '3px',
                }}
              >
                <span style={{ fontSize: '12px', color: '#F8FAFC' }}>{t.name}</span>
                <span style={{ fontSize: '10px', color: '#14B8A6' }}>{t.category}</span>
              </div>
            ))}

            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, padding: '10px 4px 4px 4px', textTransform: 'uppercase' }}>Models & Fixtures ({elements.length})</div>
            {elements.map((e) => (
              <div
                key={e._id}
                onClick={() => { setSelectedId(e._id); setSelectedType('element'); }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  backgroundColor: selectedId === e._id ? '#1E293B' : 'transparent',
                  border: selectedId === e._id ? '1px solid #14B8A6' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '3px',
                }}
              >
                <span style={{ fontSize: '12px', color: '#F8FAFC' }}>{e.name}</span>
                <span style={{ fontSize: '10px', color: '#A855F7' }}>{e.type}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Viewport 3D with Wall Rendering & Drag-and-Drop GLB Importer */}
        <main style={{ flex: 1, position: 'relative' }}>
          <Viewport3D
            roomDimensions={room}
            tables={tables}
            elements={elements}
            wallSegments={wallSegments}
            floorMaterial={INITIAL_FLOOR}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={(id, type) => { setSelectedId(id); setSelectedType(type); }}
            onTableUpdate={handleTableUpdate}
            onElementUpdate={handleElementUpdate}
            onAssetImported={handleAssetImported}
          />

          {/* Bottom Status Bar */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #1E293B',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
          }}>
            <CheckCircle size={12} color="#10B981" />
            {statusMessage}
          </div>
        </main>

        {/* Right Inspector */}
        <aside style={{ width: '280px', borderLeft: '1px solid #1E293B', backgroundColor: '#0F172A', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Sliders size={14} color="#14B8A6" />
            <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#94A3B8' }}>Properties</span>
          </div>

          {selectedTable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>NAME</label>
                <input
                  type="text"
                  value={selectedTable.name}
                  onChange={(e) => handleTableUpdate(selectedTable._id, { name: e.target.value })}
                  style={{ width: '100%', marginTop: '3px', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CATEGORY</label>
                <select
                  value={selectedTable.category}
                  onChange={(e) => handleTableUpdate(selectedTable._id, { category: e.target.value as any })}
                  style={{ width: '100%', marginTop: '3px', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
                >
                  <option value="standard">Standard</option>
                  <option value="vip">VIP</option>
                  <option value="bar">Bar</option>
                  <option value="lounge">Lounge</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>DIMENSIONS (CM)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '3px' }}>
                  <input
                    type="number"
                    value={selectedTable.dimensions.width}
                    onChange={(e) => handleTableUpdate(selectedTable._id, {
                      dimensions: { ...selectedTable.dimensions, width: parseFloat(e.target.value) || 50 }
                    })}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '4px', padding: '4px', fontSize: '11px' }}
                  />
                  <input
                    type="number"
                    value={selectedTable.dimensions.depth}
                    onChange={(e) => handleTableUpdate(selectedTable._id, {
                      dimensions: { ...selectedTable.dimensions, depth: parseFloat(e.target.value) || 50 }
                    })}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '4px', padding: '4px', fontSize: '11px' }}
                  />
                  <input
                    type="number"
                    value={selectedTable.dimensions.height}
                    onChange={(e) => handleTableUpdate(selectedTable._id, {
                      dimensions: { ...selectedTable.dimensions, height: parseFloat(e.target.value) || 50 }
                    })}
                    style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', borderRadius: '4px', padding: '4px', fontSize: '11px' }}
                  />
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Wall-Pen CAD Modal */}
      <WallPenTool
        roomDimensions={room}
        wallSegments={wallSegments}
        onWallsChange={setWallSegments}
        isOpen={isWallPenOpen}
        onClose={() => setIsWallPenOpen(false)}
      />
    </div>
  );
}
