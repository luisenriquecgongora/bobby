// packages/core/src/spatial/__tests__/spatialClient.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpatialEngineClient } from '../spatialClient';

describe('SpatialEngineClient', () => {
  let client: SpatialEngineClient;

  beforeEach(() => {
    client = new SpatialEngineClient({ baseUrl: 'http://localhost:8000' });
    vi.restoreAllMocks();
  });

  it('normalizes trailing slashes on base URL', () => {
    const c = new SpatialEngineClient({ baseUrl: 'http://localhost:8000///' });
    expect(c.getBaseUrl()).toBe('http://localhost:8000');
  });

  it('checks health status', async () => {
    const mockHealth = {
      service: 'bobby-engine',
      version: '0.1.0',
      uptime_seconds: 12.5,
      memory_mb: 45.2,
      fcl_accelerated: true,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth,
    } as any);

    const res = await client.checkHealth();
    expect(res.service).toBe('bobby-engine');
    expect(res.memory_mb).toBe(45.2);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/health',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('submits layout validation request', async () => {
    const mockValidationResult = {
      is_valid: true,
      collisions: [],
      clearance_warnings: [],
      metrics: {
        fixture_count: 2,
        wall_count: 0,
        computation_time_ms: 1.2,
        collision_engine: 'FCL',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockValidationResult,
    } as any);

    const result = await client.validateLayout({
      venue_id: 'test',
      walls: [],
      fixtures: [],
    });

    expect(result.is_valid).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/v1/spatial/validate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('throws on non-ok HTTP responses with error text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => 'Unprocessable Entity: Missing walls',
    } as any);

    await expect(
      client.validateLayout({ venue_id: 'bad', walls: [], fixtures: [] })
    ).rejects.toThrow('Spatial validation failed (422)');
  });
});
