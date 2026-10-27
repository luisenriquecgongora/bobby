import { useState, useEffect } from 'react';
import {
  RoomDimensions,
  FloorMaterial,
  TableShape,
  TableCategory,
  WallSegment,
  VenueProject,
  packVenueToZip,
  APP_VERSION,
  BUILT_IN_COMMITS
} from '@bobby/core';
import { ViewerTable, ViewerRoomElement } from '@bobby/viewer';
import { Viewport3D, WallPenTool, ImportedAssetResult, PlaatoCloudModal, ChangelogModal } from '@bobby/editor';
import { PlaatoConnector } from '@bobby/connector-plaato';
import {
  Layers,
  Plus,
  Download,
  UploadCloud,
  Sliders,
  PenTool,
  MonitorDown,
  Cloud,
  GitCommit,
  GitBranch
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
];

export default function App() {
  const [room, setRoom] = useState<RoomDimensions>(INITIAL_ROOM);
  const [floorMaterial, setFloorMaterial] = useState<FloorMaterial>(INITIAL_FLOOR);
  const [tables, setTables] = useState<ViewerTable[]>(INITIAL_TABLES);
  const [elements, setElements] = useState<ViewerRoomElement[]>(INITIAL_ELEMENTS);
  const [wallSegments, setWallSegments] = useState<WallSegment[]>([]);
  const [isWallPenOpen, setIsWallPenOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [connector, setConnector] = useState<PlaatoConnector>(() => new PlaatoConnector());
  const [linkedRoomId, setLinkedRoomId] = useState<string | null>(null);
  const [linkedRoomName, setLinkedRoomName] = useState<string | null>(null);
  const [assets, setAssets] = useState<Record<string, Uint8Array>>({});
  const [selectedId, setSelectedId] = useState<string | null>('table_1');
  const [selectedType, setSelectedType] = useState<'table' | 'element' | null>('table');

  // Automatic deep-link query parameter parsing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const bizParam = params.get('businessId');
    const roomParam = params.get('roomId');
    const apiParam = params.get('apiBase');
    const tabParam = params.get('tab') || params.get('view');
    if (tabParam === 'commits' || tabParam === 'changelog') {
      setIsChangelogOpen(true);
    }

    if (tokenParam) {
      const conn = new PlaatoConnector({
        apiBase: apiParam || 'https://api-takient.onrender.com',
        token: tokenParam,
        businessId: bizParam || '',
      });
      setConnector(conn);
      localStorage.setItem('plaato_token', tokenParam);
      if (bizParam) localStorage.setItem('plaato_businessId', bizParam);
      if (apiParam) localStorage.setItem('plaato_apiBase', apiParam);

      if (roomParam) {
        setLinkedRoomId(roomParam);
        conn.getRoomMap(roomParam).then((roomData) => {
          if (roomData.room) {
            if (roomData.room.dimensions) {
              setRoom({
                width: roomData.room.dimensions.width,
                depth: roomData.room.dimensions.depth,
                height: roomData.room.dimensions.height,
                unit: (roomData.room.dimensions.unit as any) || 'cm',
              });
            }
            if (roomData.room.floorMaterial) setFloorMaterial(roomData.room.floorMaterial);
            if (roomData.room.wallSegments) setWallSegments(roomData.room.wallSegments);
            setLinkedRoomName(roomData.room.name || 'Plaato Room');
          }
          if (roomData.tables) setTables(roomData.tables);
          if (roomData.elements) setElements(roomData.elements);
        }).catch((err) => {
          console.error('Error auto-importing room from deep link:', err);
        });
      }
    } else {
      const savedToken = localStorage.getItem('plaato_token');
      const savedBiz = localStorage.getItem('plaato_businessId');
      const savedBase = localStorage.getItem('plaato_apiBase');
      if (savedToken) {
        setConnector(new PlaatoConnector({
          apiBase: savedBase || 'https://api-takient.onrender.com',
          token: savedToken,
          businessId: savedBiz || '',
        }));
      }
    }
  }, []);

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

  // Called when a user drops a .glb file onto the 3D viewport
  const handleAssetImported = (result: ImportedAssetResult) => {
    setAssets((prev) => ({ ...prev, [result.filename]: result.binaryData }));
    setElements((prev) => [...prev, result.newElement]);
    setSelectedId(result.newElement._id);
    setSelectedType('element');
  };

  // Export .venue ZIP bundle containing manifest, scene, and embedded GLB models
  const handleExportVenue = async () => {
    const project: VenueProject = {
      manifest: {
        version: '1.0.0',
        name: 'Bobby Venue Project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dimensions: room,
        generator: 'Bobby Web Studio v0.1.0',
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
    a.download = `venue_project_${Date.now()}.venue`;
    a.click();
    URL.revokeObjectURL(url);
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
            backgroundColor: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            🛠️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.02em', margin: 0 }}>
                Bobby <span style={{ fontSize: '11px', color: '#14B8A6', backgroundColor: '#134E4A', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>Venue Builder</span>
              </h1>
              <button
                onClick={() => setIsChangelogOpen(true)}
                title="View release version and git commits"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#94A3B8',
                  borderRadius: '6px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  marginLeft: '4px'
                }}
              >
                <GitBranch size={11} color="#14B8A6" />
                <span style={{ fontWeight: 600, color: '#F8FAFC' }}>v{APP_VERSION}</span>
                <span style={{ fontFamily: 'monospace', color: '#64748B', fontSize: '10px' }}>({BUILT_IN_COMMITS[0]?.shortHash})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Actions */}
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
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <PenTool size={16} color={isWallPenOpen ? '#0F172A' : '#14B8A6'} /> Draw Walls ({wallSegments.length})
          </button>

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
          <a
            href="https://github.com/luisenriquecgongora/bobby/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Bobby Desktop for Windows, macOS, or Linux"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0F172A',
              border: '1px solid #14B8A6',
              color: '#14B8A6',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <MonitorDown size={15} /> Download Desktop App
          </a>
          <button
            onClick={handleExportVenue}
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
            }}
          >
            <Download size={15} color="#14B8A6" /> Export .venue ({Object.keys(assets).length} models)
          </button>
          <button
            onClick={() => setIsCloudModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: linkedRoomName ? '#0D9488' : '#14B8A6',
              border: 'none',
              color: '#0F172A',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Cloud size={16} /> {linkedRoomName ? `Sync to ${linkedRoomName}` : 'PlaatoOS Cloud'}
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
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, padding: '4px 8px', textTransform: 'uppercase' }}>Walls ({wallSegments.length})</div>
            {wallSegments.map((w, idx) => (
              <div
                key={w.id}
                onClick={() => setIsWallPenOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#1E293B',
                  cursor: 'pointer',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Wall Segment {idx + 1}</span>
                <span style={{ fontSize: '10px', color: '#38BDF8' }}>{w.openings?.length || 0} doors</span>
              </div>
            ))}

            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, padding: '12px 8px 4px 8px', textTransform: 'uppercase' }}>Tables ({tables.length})</div>
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

            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, padding: '12px 8px 4px 8px', textTransform: 'uppercase' }}>Fixtures & Models ({elements.length})</div>
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

        {/* Center: 3D Viewport with Transform Gizmos & GLB Drag-and-Drop */}
        <main style={{ flex: 1, position: 'relative' }}>
          <Viewport3D
            roomDimensions={room}
            tables={tables}
            elements={elements}
            wallSegments={wallSegments}
            floorMaterial={floorMaterial}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelect={(id: string | null, type: 'table' | 'element' | null) => { setSelectedId(id); setSelectedType(type); }}
            onTableUpdate={handleTableUpdate}
            onElementUpdate={handleElementUpdate}
            onAssetImported={handleAssetImported}
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
              </div>
            )}

            {!selectedTable && selectedElement && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Fixture / Model Name</label>
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

      {/* Wall-Pen CAD Modal */}
      <WallPenTool
        roomDimensions={room}
        wallSegments={wallSegments}
        onWallsChange={setWallSegments}
        isOpen={isWallPenOpen}
        onClose={() => setIsWallPenOpen(false)}
      />

      {/* PlaatoOS Cloud Import & Sync Modal */}
      <PlaatoCloudModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        connector={connector}
        onConnectorUpdated={(c) => setConnector(c)}
        currentRoom={{
          dimensions: room,
          floorMaterial,
          wallSegments,
          tables,
          elements,
        }}
        onImportRoom={(data) => {
          setLinkedRoomId(data.roomId);
          setLinkedRoomName(data.roomName);
          setRoom({ ...data.dimensions, unit: 'cm' });
          if (data.floorMaterial) setFloorMaterial(data.floorMaterial);
          if (data.wallSegments) setWallSegments(data.wallSegments);
          setTables(data.tables);
          setElements(data.elements);
        }}
        linkedRoomId={linkedRoomId}
        linkedRoomName={linkedRoomName}
      />

      {/* Release & Commits Changelog Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
}
