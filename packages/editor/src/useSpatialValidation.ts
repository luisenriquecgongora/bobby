// @bobby/editor/src/useSpatialValidation.ts
// React hook for debounced authoritative 3D spatial validation and collision detection via bobby-engine.

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  RoomDimensions,
  WallSegment,
  EngineVenueLayout,
  EngineValidationResult,
  EngineCollisionContact,
  EngineHealthResponse,
  SpatialEngineClient,
  toEngineVenueLayout,
} from '@bobby/core';
import { ViewerTable, ViewerRoomElement } from '@bobby/viewer';

export interface UseSpatialValidationOptions {
  engineUrl?: string;
  autoValidate?: boolean;
  debounceMs?: number;
  healthCheckIntervalMs?: number;
}

export interface UseSpatialValidationReturn {
  isEngineOnline: boolean;
  isValidating: boolean;
  validationResult: EngineValidationResult | null;
  collidingIds: Set<string>;
  collisionContacts: EngineCollisionContact[];
  clearanceWarnings: string[];
  engineHealth: EngineHealthResponse | null;
  lastValidatedAt: Date | null;
  engineClient: SpatialEngineClient;
  revalidate: () => Promise<void>;
  extrudeWallsGLB: () => Promise<ArrayBuffer | null>;
  setEngineUrl: (url: string) => void;
  engineUrl: string;
}

export function useSpatialValidation(
  roomDimensions: RoomDimensions,
  tables: ViewerTable[],
  elements: ViewerRoomElement[],
  wallSegments: WallSegment[] = [],
  options: UseSpatialValidationOptions = {}
): UseSpatialValidationReturn {
  const {
    engineUrl: initialUrl = 'http://localhost:8000',
    autoValidate = true,
    debounceMs = 350,
    healthCheckIntervalMs = 15000,
  } = options;

  const [engineUrl, setEngineUrlState] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('bobby_engine_url') || initialUrl;
    }
    return initialUrl;
  });

  const engineClient = useMemo(
    () => new SpatialEngineClient({ baseUrl: engineUrl }),
    [engineUrl]
  );

  const [isEngineOnline, setIsEngineOnline] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [engineHealth, setEngineHealth] = useState<EngineHealthResponse | null>(null);
  const [validationResult, setValidationResult] = useState<EngineValidationResult | null>(null);
  const [lastValidatedAt, setLastValidatedAt] = useState<Date | null>(null);

  const setEngineUrl = useCallback((newUrl: string) => {
    setEngineUrlState(newUrl);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bobby_engine_url', newUrl);
    }
  }, []);

  // Check health of bobby-engine microservice
  const checkHealth = useCallback(async () => {
    try {
      const health = await engineClient.checkHealth();
      setEngineHealth(health);
      setIsEngineOnline(true);
      return true;
    } catch {
      setIsEngineOnline(false);
      setEngineHealth(null);
      return false;
    }
  }, [engineClient]);

  // Periodic health check
  useEffect(() => {
    let isMounted = true;
    const runCheck = async () => {
      const online = await checkHealth();
      if (!isMounted) return;
      if (online && autoValidate && !validationResult) {
        // Trigger initial validation
        runValidation();
      }
    };

    runCheck();
    const interval = setInterval(runCheck, healthCheckIntervalMs);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkHealth, autoValidate, healthCheckIntervalMs]);

  // Build authoritative layout payload
  const currentLayout = useMemo<EngineVenueLayout>(() => {
    return toEngineVenueLayout({
      venueId: 'venue_active',
      room: roomDimensions,
      tables,
      elements,
      walls: wallSegments,
    });
  }, [roomDimensions, tables, elements, wallSegments]);

  // Perform validation
  const runValidation = useCallback(async () => {
    if (!isEngineOnline && !engineHealth) {
      const online = await checkHealth();
      if (!online) return;
    }

    setIsValidating(true);
    try {
      const result = await engineClient.validateLayout(currentLayout);
      setValidationResult(result);
      setLastValidatedAt(new Date());
    } catch (err) {
      console.warn('[bobby-engine] Validation failed:', err);
    } finally {
      setIsValidating(false);
    }
  }, [currentLayout, engineClient, isEngineOnline, engineHealth, checkHealth]);

  // Debounced execution when scene objects mutate
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoValidate) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      runValidation();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentLayout, autoValidate, debounceMs, runValidation]);

  // Colliding IDs set
  const collidingIds = useMemo<Set<string>>(() => {
    if (!validationResult || !validationResult.collisions) return new Set();
    const ids = new Set<string>();
    for (const c of validationResult.collisions) {
      if (c.object_a) ids.add(c.object_a);
      if (c.object_b) ids.add(c.object_b);
    }
    return ids;
  }, [validationResult]);

  const collisionContacts = useMemo(() => {
    return validationResult?.collisions || [];
  }, [validationResult]);

  const clearanceWarnings = useMemo(() => {
    return validationResult?.clearance_warnings || [];
  }, [validationResult]);

  // Request compiled GLB wall extrusion
  const extrudeWallsGLB = useCallback(async (): Promise<ArrayBuffer | null> => {
    try {
      return await engineClient.extrudeWallsGLB(currentLayout.walls);
    } catch (err) {
      console.error('[bobby-engine] Extrude walls failed:', err);
      return null;
    }
  }, [currentLayout.walls, engineClient]);

  return {
    isEngineOnline,
    isValidating,
    validationResult,
    collidingIds,
    collisionContacts,
    clearanceWarnings,
    engineHealth,
    lastValidatedAt,
    engineClient,
    revalidate: runValidation,
    extrudeWallsGLB,
    setEngineUrl,
    engineUrl,
  };
}
