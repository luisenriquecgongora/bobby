// @bobby/editor/src/SpatialStatusBadge.tsx
// Compact navbar/status bar indicator for authoritative 3D spatial safety & collision status.

import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, RefreshCw, ServerOff } from 'lucide-react';
import { EngineValidationResult } from '@bobby/core';

export interface SpatialStatusBadgeProps {
  isEngineOnline: boolean;
  isValidating: boolean;
  validationResult: EngineValidationResult | null;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const SpatialStatusBadge: React.FC<SpatialStatusBadgeProps> = ({
  isEngineOnline,
  isValidating,
  validationResult,
  onClick,
  style,
}) => {
  if (!isEngineOnline) {
    return (
      <button
        onClick={onClick}
        title="bobby-engine microservice offline. Click to view settings or reconnect."
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          color: '#94A3B8',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'all 0.15s ease',
          ...style,
        }}
      >
        <ServerOff size={14} color="#94A3B8" />
        <span>Spatial Engine Offline</span>
      </button>
    );
  }

  if (isValidating) {
    return (
      <button
        onClick={onClick}
        title="Authoritative collision & egress clearance check running..."
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#0F2642',
          border: '1px solid #0284C7',
          color: '#38BDF8',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: 500,
          ...style,
        }}
      >
        <RefreshCw size={14} className="animate-spin" color="#38BDF8" />
        <span>Validating 3D Space...</span>
      </button>
    );
  }

  const collisionCount = validationResult?.collisions?.length || 0;
  const warningCount = validationResult?.clearance_warnings?.length || 0;
  const hasIssues = collisionCount > 0 || warningCount > 0;

  if (hasIssues) {
    return (
      <button
        onClick={onClick}
        title={`${collisionCount} collisions detected, ${warningCount} clearance warnings. Click for details.`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: collisionCount > 0 ? '#450A0A' : '#451A03',
          border: `1px solid ${collisionCount > 0 ? '#EF4444' : '#F59E0B'}`,
          color: collisionCount > 0 ? '#FCA5A5' : '#FCD34D',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: 600,
          animation: collisionCount > 0 ? 'pulse 2s infinite' : 'none',
          ...style,
        }}
      >
        {collisionCount > 0 ? (
          <AlertCircle size={15} color="#EF4444" />
        ) : (
          <AlertTriangle size={15} color="#F59E0B" />
        )}
        <span>
          {collisionCount > 0 && `${collisionCount} Collision${collisionCount > 1 ? 's' : ''}`}
          {collisionCount > 0 && warningCount > 0 && ' • '}
          {warningCount > 0 && `${warningCount} Clearance Warning${warningCount > 1 ? 's' : ''}`}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title="Spatial layout is authoritatively safe (0 collisions, egress clear)"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#064E3B',
        border: '1px solid #10B981',
        color: '#6EE7B7',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: 500,
        ...style,
      }}
    >
      <ShieldCheck size={15} color="#10B981" />
      <span>Spatial Authoritative: Safe</span>
      {validationResult?.metrics?.computation_time_ms !== undefined && (
        <span style={{ fontSize: '10px', color: '#A7F3D0', opacity: 0.8 }}>
          ({validationResult.metrics.computation_time_ms.toFixed(1)}ms)
        </span>
      )}
    </button>
  );
};
