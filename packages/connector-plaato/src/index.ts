/**
 * @openvenue/connector-plaato
 *
 * Cloud synchronization adapter between OpenVenue Studio (desktop/web)
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
  private apiBase: string;
  private token: string;
  private businessId: string;

  constructor(options: { apiBase: string; token: string; businessId: string }) {
    this.apiBase = options.apiBase.replace(/\/$/, '');
    this.token = options.token;
    this.businessId = options.businessId;
  }

  private get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      'X-Business-Id': this.businessId,
    };
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
   * Zero server CPU/memory load on PlaatoOS API.
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
   * Tables with paid customer tickets are protected from accidental removal.
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
