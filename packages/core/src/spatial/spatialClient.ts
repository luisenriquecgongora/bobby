// @bobby/core/src/spatial/spatialClient.ts
// HTTP client for communicating with the bobby-engine Python FastAPI microservice.

import {
  EngineVenueLayout,
  EngineValidationResult,
  EngineWallSegment,
  EngineHealthResponse,
} from './spatialTypes';

export interface SpatialEngineClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
}

export class SpatialEngineClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options: SpatialEngineClientOptions = {}) {
    const globalObj = typeof globalThis !== 'undefined' ? (globalThis as any) : {};
    const envEngineUrl = globalObj.process?.env?.BOBBY_ENGINE_URL;
    this.baseUrl = (
      options.baseUrl ||
      envEngineUrl ||
      'http://localhost:8000'
    ).replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs ?? 8000;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  private async fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Pings the microservice /health endpoint to check status and uptime.
   */
  public async checkHealth(): Promise<EngineHealthResponse> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/health`);
    if (!res.ok) {
      throw new Error(`Engine health check failed with status ${res.status}`);
    }
    return res.json();
  }

  /**
   * Submits a full venue layout for collision detection and corridor egress validation.
   */
  public async validateLayout(layout: EngineVenueLayout): Promise<EngineValidationResult> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/v1/spatial/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(layout),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Spatial validation failed (${res.status}): ${errText}`);
    }

    return res.json();
  }

  /**
   * Submits wall segments to bobby-engine and retrieves a compiled binary GLB stream.
   */
  public async extrudeWallsGLB(walls: EngineWallSegment[]): Promise<ArrayBuffer> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/v1/spatial/extrude-walls?format=glb`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(walls),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Wall extrusion failed (${res.status}): ${errText}`);
    }

    return res.arrayBuffer();
  }

  /**
   * Submits previous and current layouts to compute an RFC 6902 JSON spatial diff.
   */
  public async diffLayout(
    previous: EngineVenueLayout,
    current: EngineVenueLayout
  ): Promise<any> {
    const res = await this.fetchWithTimeout(`${this.baseUrl}/v1/spatial/diff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ previous, current }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Spatial diff failed (${res.status}): ${errText}`);
    }

    return res.json();
  }
}
