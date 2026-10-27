/**
 * @bobby/connector-plaato
 *
 * Cloud synchronization adapter between Bobby Studio (desktop/web)
 * and PlaatoOS / Takient backend.
 */

export interface StorageQuota {
  tier: string;
  isBusinessPlan: boolean;
  baseQuotaBytes: number;
  addonQuotaBytes: number;
  totalQuotaBytes: number;
  usedBytes: number;
  remainingBytes: number;
  canUpload: boolean;
  reason?: string;
}

export interface PresignResponse {
  assetId: string;
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface PlaatoBusiness {
  _id: string;
  name: string;
  slug: string;
  venues?: Array<{ _id: string; name: string; logoURL?: string }>;
  myRoles?: string[];
  planTier?: string;
}

export interface PlaatoRoomSummary {
  _id: string;
  name: string;
  capacity?: number;
  roomType?: string;
  venueId?: string;
  isActive?: boolean;
}

export interface RoomSyncPayload {
  roomId: string;
  dimensions?: {
    width: number;
    depth: number;
    height: number;
    unit?: 'cm' | 'inches';
  };
  floorMaterial?: any;
  wallSegments?: any[];
  sceneModelUrl?: string;
  venuePackageUrl?: string;
  cameraState?: any;
  tables?: Array<{
    _id?: string;
    name: string;
    position: { x: number; y: number; z?: number };
    shape: string;
    dimensions: { width: number; depth: number; height: number };
    rotation?: number;
    minCapacity?: number;
    maxCapacity?: number;
    category?: string;
    basePrice?: number;
    customGeometry?: any;
  }>;
  elements?: Array<{
    _id?: string;
    name?: string;
    type: string;
    position: { x: number; y: number; z?: number };
    dimensions: { width: number; depth: number; height: number };
    rotation?: number;
    customGeometry?: any;
  }>;
}

export interface SyncResponse {
  success: boolean;
  message: string;
  roomId: string;
  tableCount: number;
  elementCount: number;
  lockedTablesPreserved: string[];
}

export class PlaatoConnector {
  public apiBase: string;
  public token: string;
  public businessId: string;

  constructor(options?: { apiBase?: string; token?: string; businessId?: string }) {
    this.apiBase = (options?.apiBase || 'https://api-takient.onrender.com').replace(/\/$/, '');
    this.token = options?.token || '';
    this.businessId = options?.businessId || '';
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      h.Authorization = `Bearer ${this.token}`;
    }
    if (this.businessId) {
      h['X-Business-Id'] = this.businessId;
    }
    return h;
  }

  setBusinessId(businessId: string) {
    this.businessId = businessId;
  }

  setToken(token: string) {
    this.token = token;
  }

  setApiBase(apiBase: string) {
    this.apiBase = apiBase.replace(/\/$/, '');
  }

  /**
   * Authenticate with email & password against PlaatoOS API.
   */
  static async login(params: {
    apiBase?: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user?: any }> {
    const base = (params.apiBase || 'https://api-takient.onrender.com').replace(/\/$/, '');
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: params.email, password: params.password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ msg: res.statusText }));
      throw new Error(err.msg || err.message || 'Login failed');
    }

    const data = await res.json();
    return { token: data.token, user: data.user };
  }

  /**
   * Fetch all businesses the logged-in user owns or manages.
   */
  async getMyBusinesses(): Promise<PlaatoBusiness[]> {
    const res = await fetch(`${this.apiBase}/client/business/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to fetch user businesses');
    }

    return res.json();
  }

  /**
   * Fetch all rooms belonging to the active business/venue.
   */
  async getRooms(businessId?: string): Promise<PlaatoRoomSummary[]> {
    const bizId = businessId || this.businessId;
    const res = await fetch(`${this.apiBase}/client/room`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        'X-Business-Id': bizId,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to fetch rooms');
    }

    const data = await res.json();
    return data.rooms || [];
  }

  /**
   * Fetch 3D asset library for the business.
   */
  async listAssets(): Promise<any[]> {
    const res = await fetch(`${this.apiBase}/client/room-3d/assets`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to fetch 3D assets');
    }

    const data = await res.json();
    return data.assets || [];
  }

  /**
   * Fetches current 3D storage usage and Business plan limits.
   */
  async getStorageQuota(): Promise<StorageQuota> {
    const res = await fetch(`${this.apiBase}/client/room-3d/quota`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to fetch storage quota');
    }

    const data = await res.json();
    return data.quota;
  }

  /**
   * Uploads a 3D model (.glb) or texture directly to Cloudflare R2 via presigned PUT.
   */
  async uploadAsset(params: {
    file: Blob | Uint8Array;
    fileName: string;
    contentType: string;
    roomId?: string;
    venueId?: string;
  }): Promise<{ assetId: string; publicUrl: string; key: string }> {
    const { file, fileName, contentType, roomId, venueId } = params;
    const bytes = file instanceof Uint8Array ? file.byteLength : file.size;

    // Step 1: Request presigned single-use PUT URL
    const presignRes = await fetch(`${this.apiBase}/client/room-3d/presign`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        fileName,
        contentType,
        bytes,
        roomId,
        venueId,
      }),
    });

    if (!presignRes.ok) {
      const err = await presignRes.json().catch(() => ({ message: presignRes.statusText }));
      throw new Error(err.message || 'Failed to obtain presigned upload URL');
    }

    const { assetId, uploadUrl, key, publicUrl }: PresignResponse = await presignRes.json();

    // Step 2: Direct browser/client PUT to Cloudflare R2
    const bodyPayload = file instanceof Uint8Array ? (file as unknown as BodyInit) : file;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: bodyPayload,
    });

    if (!uploadRes.ok) {
      throw new Error(`Direct R2 upload failed with status ${uploadRes.status}`);
    }

    // Step 3: Confirm upload and activate asset in PlaatoOS database
    const confirmRes = await fetch(`${this.apiBase}/client/room-3d/confirm-upload`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ assetId }),
    });

    if (!confirmRes.ok) {
      const err = await confirmRes.json().catch(() => ({ message: confirmRes.statusText }));
      throw new Error(err.message || 'Failed to confirm uploaded 3D asset');
    }

    return { assetId, publicUrl, key };
  }

  /**
   * Synchronizes room dimensions, multi-angle walls, 3D elements, and tables into PlaatoOS.
   */
  async syncRoomMap(payload: RoomSyncPayload): Promise<SyncResponse> {
    const res = await fetch(`${this.apiBase}/client/room-3d/sync`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to synchronize room map');
    }

    return res.json();
  }

  /**
   * Fetches room layout, tables, and elements for editing.
   */
  async getRoomMap(roomId: string): Promise<any> {
    const res = await fetch(`${this.apiBase}/client/room-3d/room/${roomId}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Failed to fetch room map');
    }

    return res.json();
  }
}
