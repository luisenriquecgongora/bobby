import React, { useState, useEffect } from 'react';
import {
  PlaatoConnector,
  PlaatoBusiness,
  PlaatoRoomSummary,
  StorageQuota,
} from '@bobby/connector-plaato';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  Building2,
  DoorOpen,
  Upload,
  Download,
  Key,
  LogOut,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export interface PlaatoCloudModalProps {
  isOpen: boolean;
  onClose: () => void;
  connector: PlaatoConnector;
  onConnectorUpdated: (newConnector: PlaatoConnector) => void;
  currentRoom: {
    dimensions: { width: number; depth: number; height: number };
    floorMaterial?: any;
    wallSegments?: any[];
    tables: any[];
    elements: any[];
  };
  onImportRoom: (roomData: {
    roomId: string;
    roomName: string;
    dimensions: { width: number; depth: number; height: number };
    floorMaterial?: any;
    wallSegments?: any[];
    tables: any[];
    elements: any[];
  }) => void;
  linkedRoomId?: string | null;
  linkedRoomName?: string | null;
}

export const PlaatoCloudModal: React.FC<PlaatoCloudModalProps> = ({
  isOpen,
  onClose,
  connector,
  onConnectorUpdated,
  currentRoom,
  onImportRoom,
  linkedRoomId,
  linkedRoomName,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'sync' | 'assets' | 'settings'>('rooms');
  
  // Auth state
  const [apiBase, setApiBase] = useState(connector.apiBase || 'https://api-takient.onrender.com');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(connector.token || '');
  const [isConnected, setIsConnected] = useState(Boolean(connector.token));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Business and Room data
  const [businesses, setBusinesses] = useState<PlaatoBusiness[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(connector.businessId || '');
  const [rooms, setRooms] = useState<PlaatoRoomSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(linkedRoomId || '');
  const [quota, setQuota] = useState<StorageQuota | null>(null);
  const [assets, setAssets] = useState<any[]>([]);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Load saved credentials from localStorage on initial render
  useEffect(() => {
    const savedToken = localStorage.getItem('plaato_token');
    const savedBiz = localStorage.getItem('plaato_businessId');
    const savedBase = localStorage.getItem('plaato_apiBase');

    if (savedBase) setApiBase(savedBase);
    if (savedToken && !token) {
      setToken(savedToken);
      setIsConnected(true);
      const conn = new PlaatoConnector({
        apiBase: savedBase || apiBase,
        token: savedToken,
        businessId: savedBiz || selectedBusinessId,
      });
      onConnectorUpdated(conn);
    }
  }, []);

  // When connected or business changes, fetch businesses & quota
  useEffect(() => {
    if (isConnected && token) {
      loadUserData();
    }
  }, [isConnected, token]);

  useEffect(() => {
    if (selectedBusinessId && isConnected) {
      loadRoomsAndQuota(selectedBusinessId);
    }
  }, [selectedBusinessId, isConnected]);

  const loadUserData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const conn = new PlaatoConnector({ apiBase, token, businessId: selectedBusinessId });
      const bizList = await conn.getMyBusinesses();
      setBusinesses(bizList);

      if (bizList.length > 0 && !selectedBusinessId) {
        const defaultBiz = bizList[0]._id;
        setSelectedBusinessId(defaultBiz);
        conn.setBusinessId(defaultBiz);
        localStorage.setItem('plaato_businessId', defaultBiz);
        onConnectorUpdated(conn);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsAndQuota = async (bizId: string) => {
    try {
      const conn = new PlaatoConnector({ apiBase, token, businessId: bizId });
      const [roomList, quotaData, assetList] = await Promise.all([
        conn.getRooms(bizId).catch(() => []),
        conn.getStorageQuota().catch(() => null),
        conn.listAssets().catch(() => []),
      ]);
      setRooms(roomList);
      setQuota(quotaData);
      setAssets(assetList);

      if (roomList.length > 0 && !selectedRoomId) {
        setSelectedRoomId(roomList[0]._id);
      }
    } catch (err: any) {
      console.warn('Error fetching rooms/quota:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await PlaatoConnector.login({ apiBase, email, password });
      setToken(result.token);
      setIsConnected(true);
      localStorage.setItem('plaato_token', result.token);
      localStorage.setItem('plaato_apiBase', apiBase);

      const conn = new PlaatoConnector({ apiBase, token: result.token, businessId: selectedBusinessId });
      onConnectorUpdated(conn);
      setSuccessMsg('Successfully connected to PlaatoOS!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsConnected(false);
    setBusinesses([]);
    setRooms([]);
    setQuota(null);
    localStorage.removeItem('plaato_token');
    localStorage.removeItem('plaato_businessId');
    const conn = new PlaatoConnector({ apiBase: 'https://api-takient.onrender.com' });
    onConnectorUpdated(conn);
  };

  const handleBusinessChange = (bizId: string) => {
    setSelectedBusinessId(bizId);
    localStorage.setItem('plaato_businessId', bizId);
    const conn = new PlaatoConnector({ apiBase, token, businessId: bizId });
    onConnectorUpdated(conn);
  };

  const handleImport = async () => {
    if (!selectedRoomId) {
      setErrorMsg('Please select a room to import');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const conn = new PlaatoConnector({ apiBase, token, businessId: selectedBusinessId });
      const roomData = await conn.getRoomMap(selectedRoomId);

      const targetRoom = rooms.find((r) => r._id === selectedRoomId);
      const roomName = targetRoom ? targetRoom.name : 'Imported Room';

      onImportRoom({
        roomId: selectedRoomId,
        roomName,
        dimensions: roomData.room?.dimensions || { width: 1600, depth: 1200, height: 400 },
        floorMaterial: roomData.room?.floorMaterial,
        wallSegments: roomData.room?.wallSegments || [],
        tables: roomData.tables || [],
        elements: roomData.elements || [],
      });

      setSuccessMsg(`Imported "${roomName}" with ${roomData.tables?.length || 0} tables and ${roomData.elements?.length || 0} objects!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import room');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishLive = async () => {
    const targetRoomId = linkedRoomId || selectedRoomId;
    if (!targetRoomId) {
      setErrorMsg('No target room selected to publish to');
      return;
    }

    setSyncing(true);
    setErrorMsg(null);
    setSyncResult(null);

    try {
      const conn = new PlaatoConnector({ apiBase, token, businessId: selectedBusinessId });
      const res = await conn.syncRoomMap({
        roomId: targetRoomId,
        dimensions: currentRoom.dimensions,
        floorMaterial: currentRoom.floorMaterial,
        wallSegments: currentRoom.wallSegments,
        tables: currentRoom.tables,
        elements: currentRoom.elements,
      });

      const preservedInfo = res.lockedTablesPreserved?.length
        ? ` (${res.lockedTablesPreserved.length} tables with ticket sales were safely locked)`
        : '';

      setSyncResult(`✅ Live Sync Successful! ${res.tableCount} tables and ${res.elementCount} elements updated${preservedInfo}.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          color: '#F8FAFC',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1E293B/50',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(20, 184, 166, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cloud size={20} color="#14B8A6" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                PlaatoOS Cloud Connection
                {isConnected && (
                  <span
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'rgba(20, 184, 166, 0.2)',
                      color: '#14B8A6',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Connected
                  </span>
                )}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                Import venues, rooms, and 3D assets directly from your PlaatoOS account.
              </p>
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation (when connected) */}
        {isConnected && (
          <div style={{ display: 'flex', borderBottom: '1px solid #1E293B', backgroundColor: '#0B1120' }}>
            <button
              onClick={() => setActiveTab('rooms')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'rooms' ? '#1E293B' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'rooms' ? '2px solid #14B8A6' : 'none',
                color: activeTab === 'rooms' ? '#14B8A6' : '#94A3B8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <DoorOpen size={16} /> Import Rooms
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'sync' ? '#1E293B' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'sync' ? '2px solid #14B8A6' : 'none',
                color: activeTab === 'sync' ? '#14B8A6' : '#94A3B8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Upload size={16} /> Publish to Live
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'assets' ? '#1E293B' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'assets' ? '2px solid #14B8A6' : 'none',
                color: activeTab === 'assets' ? '#14B8A6' : '#94A3B8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={16} /> 3D Asset Library ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: activeTab === 'settings' ? '#1E293B' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'settings' ? '2px solid #14B8A6' : 'none',
                color: activeTab === 'settings' ? '#14B8A6' : '#94A3B8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Key size={16} /> Account & Quota
            </button>
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Notifications */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#FCA5A5',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <AlertCircle size={16} color="#EF4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid #14B8A6',
                color: '#5EEAD4',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <CheckCircle2 size={16} color="#14B8A6" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form when NOT connected */}
          {!isConnected ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                  PlaatoOS API Endpoint
                </label>
                <input
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#FFF',
                    fontSize: '13px',
                  }}
                  placeholder="https://api-takient.onrender.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#FFF',
                    fontSize: '13px',
                  }}
                  placeholder="manager@venue.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#FFF',
                    fontSize: '13px',
                  }}
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#14B8A6',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                }}
              >
                {loading ? 'Connecting...' : 'Sign In with PlaatoOS'}
              </button>
            </form>
          ) : (
            /* Connected Content */
            <div>
              {/* Business Selector Header */}
              <div
                style={{
                  backgroundColor: '#1E293B',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={18} color="#14B8A6" />
                  <div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                      Selected Business
                    </span>
                    <select
                      value={selectedBusinessId}
                      onChange={(e) => handleBusinessChange(e.target.value)}
                      style={{
                        display: 'block',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        color: '#FFF',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginTop: '2px',
                      }}
                    >
                      {businesses.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name} ({b.myRoles?.join(', ') || 'member'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Storage badge */}
                {quota && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>3D Storage Quota</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: quota.canUpload ? '#14B8A6' : '#EF4444' }}>
                      {(quota.usedBytes / (1024 * 1024)).toFixed(1)} / {(quota.totalQuotaBytes / (1024 * 1024)).toFixed(0)} MB
                    </div>
                  </div>
                )}
              </div>

              {/* Tab 1: Rooms / Import */}
              {activeTab === 'rooms' && (
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 600 }}>
                    Select Room to Import:
                  </h4>
                  {rooms.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                      No rooms found for this business. Create rooms in PlaatoOS Admin first.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {rooms.map((r) => (
                        <div
                          key={r._id}
                          onClick={() => setSelectedRoomId(r._id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: selectedRoomId === r._id ? '1px solid #14B8A6' : '1px solid #1E293B',
                            backgroundColor: selectedRoomId === r._id ? 'rgba(20, 184, 166, 0.08)' : '#0B1120',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.name}</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                              Type: {r.roomType || 'Standard'} • Capacity: {r.capacity || 'N/A'}
                            </div>
                          </div>
                          <span style={{ fontSize: '12px', color: '#14B8A6', fontWeight: 600 }}>
                            {selectedRoomId === r._id ? '✓ Selected' : 'Select'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleImport}
                    disabled={loading || !selectedRoomId}
                    style={{
                      width: '100%',
                      backgroundColor: '#14B8A6',
                      color: '#0F172A',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: loading || !selectedRoomId ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Download size={16} /> {loading ? 'Importing from PlaatoOS...' : 'Import Room into Bobby'}
                  </button>
                </div>
              )}

              {/* Tab 2: Publish / Sync */}
              {activeTab === 'sync' && (
                <div>
                  <div
                    style={{
                      backgroundColor: 'rgba(20, 184, 166, 0.1)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      borderRadius: '10px',
                      padding: '14px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <ShieldCheck size={18} color="#14B8A6" />
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#14B8A6' }}>
                        Live Customer Floorplan Sync
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#CBD5E1', lineHeight: '1.5' }}>
                      Publishing pushes your current 3D room dimensions, wall layout, furniture, and table configurations directly to your customer booking app.
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>
                      🛡️ <strong>Safety Guarantee:</strong> Tables with paid reservations (<code>status: 'paid'</code>) are strictly protected and will never be deleted.
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0B1120', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Payload Summary:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px' }}>
                      <div>• Room: <strong>{currentRoom.dimensions.width / 100}m × {currentRoom.dimensions.depth / 100}m</strong></div>
                      <div>• Walls: <strong>{currentRoom.wallSegments?.length || 0} segments</strong></div>
                      <div>• Tables: <strong>{currentRoom.tables.length} tables</strong></div>
                      <div>• Objects: <strong>{currentRoom.elements.length} elements</strong></div>
                    </div>
                  </div>

                  {syncResult && (
                    <div
                      style={{
                        backgroundColor: 'rgba(20, 184, 166, 0.15)',
                        border: '1px solid #14B8A6',
                        color: '#5EEAD4',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '13px',
                      }}
                    >
                      {syncResult}
                    </div>
                  )}

                  <button
                    onClick={handlePublishLive}
                    disabled={syncing || (!linkedRoomId && !selectedRoomId)}
                    style={{
                      width: '100%',
                      backgroundColor: '#14B8A6',
                      color: '#0F172A',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: syncing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Upload size={16} /> {syncing ? 'Synchronizing Live...' : 'Publish Live to PlaatoOS'}
                  </button>
                </div>
              )}

              {/* Tab 3: 3D Assets */}
              {activeTab === 'assets' && (
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 600 }}>
                    Stored Cloud Models (.glb):
                  </h4>
                  {assets.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                      No 3D models uploaded to Cloudflare R2 yet for this business. Drag & drop .glb files into the canvas to upload!
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {assets.map((ast) => (
                        <div
                          key={ast._id}
                          style={{
                            backgroundColor: '#0B1120',
                            border: '1px solid #1E293B',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{ast.originalName}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                            {(ast.sizeBytes / (1024 * 1024)).toFixed(2)} MB • {ast.contentType}
                          </div>
                          <a
                            href={ast.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              marginTop: '8px',
                              fontSize: '11px',
                              color: '#14B8A6',
                              textDecoration: 'none',
                            }}
                          >
                            View Model ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Account & Settings */}
              {activeTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: '#0B1120', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Connected Endpoint</div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{apiBase}</div>
                  </div>

                  {quota && (
                    <div style={{ backgroundColor: '#0B1120', padding: '14px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Plan Status</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#14B8A6' }}>
                        {quota.tier.toUpperCase()} PLAN
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                        {(quota.usedBytes / (1024 * 1024)).toFixed(2)} MB of {(quota.totalQuotaBytes / (1024 * 1024)).toFixed(2)} MB used
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: '#1E293B',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginTop: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, (quota.usedBytes / quota.totalQuotaBytes) * 100)}%`,
                            height: '100%',
                            backgroundColor: '#14B8A6',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #EF4444',
                      color: '#EF4444',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut size={16} /> Disconnect from PlaatoOS
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
