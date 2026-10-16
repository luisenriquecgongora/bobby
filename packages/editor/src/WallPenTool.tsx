// @bobby/editor/src/WallPenTool.tsx
// The Sims-Style 2D CAD Wall-Pen Tool with grid snapping and real-time dimension measurements.

import React, { useRef, useState, useEffect } from 'react';
import { WallSegment, WallOpening, RoomDimensions } from '@bobby/core';
import { PenTool, DoorClosed, Check, Trash2, X, Move } from 'lucide-react';

interface WallPenToolProps {
  roomDimensions: RoomDimensions;
  wallSegments: WallSegment[];
  onWallsChange: (walls: WallSegment[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WallPenTool: React.FC<WallPenToolProps> = ({
  roomDimensions,
  wallSegments,
  onWallsChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<'wall' | 'door' | 'select'>('wall');
  const [currentStart, setCurrentStart] = useState<[number, number] | null>(null);
  const [cursorPos, setCursorPos] = useState<[number, number]>([0, 0]);
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);

  const canvasWidth = 750;
  const canvasHeight = 550;

  // Scale cm to canvas pixels
  const scale = Math.min(
    (canvasWidth - 80) / roomDimensions.width,
    (canvasHeight - 80) / roomDimensions.depth
  );
  const offsetX = (canvasWidth - roomDimensions.width * scale) / 2;
  const offsetY = (canvasHeight - roomDimensions.depth * scale) / 2;

  // Snap to 25cm grid
  const snapToGrid = (cmVal: number, gridSize = 25): number => {
    return Math.round(cmVal / gridSize) * gridSize;
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return [0, 0];
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cmX = (mouseX - offsetX) / scale;
    const cmY = (mouseY - offsetY) / scale;

    return [
      Math.max(0, Math.min(roomDimensions.width, snapToGrid(cmX))),
      Math.max(0, Math.min(roomDimensions.depth, snapToGrid(cmY))),
    ];
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setCursorPos(getCanvasCoords(e));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (activeTool === 'wall') {
      if (!currentStart) {
        // Start new wall segment
        setCurrentStart(coords);
      } else {
        // Complete wall segment
        const dist = Math.hypot(coords[0] - currentStart[0], coords[1] - currentStart[1]);
        if (dist > 20) {
          const newWall: WallSegment = {
            id: `wall_${Date.now()}`,
            start: currentStart,
            end: coords,
            thickness: 15,
            height: roomDimensions.height || 300,
            material: {
              type: 'paint' as any,
              finish: 'matte' as any,
              color: '#475569',
              roughness: 0.8,
            },
          };
          onWallsChange([...wallSegments, newWall]);
          // Chain to next wall segment (like The Sims!)
          setCurrentStart(coords);
        }
      }
    } else if (activeTool === 'door' && selectedWallId) {
      // Add a door opening to selected wall
      const wall = wallSegments.find((w) => w.id === selectedWallId);
      if (wall) {
        const opening: WallOpening = {
          id: `door_${Date.now()}`,
          type: 'door',
          offset: 50,
          width: 90, // 90cm standard door
          height: 210, // 210cm door height
          elevation: 0,
        };
        const updated = wallSegments.map((w) =>
          w.id === selectedWallId ? { ...w, openings: [...(w.openings || []), opening] } : w
        );
        onWallsChange(updated);
      }
    }
  };

  const handleFinishWall = () => {
    setCurrentStart(null);
  };

  const handleDeleteSelected = () => {
    if (selectedWallId) {
      onWallsChange(wallSegments.filter((w) => w.id !== selectedWallId));
      setSelectedWallId(null);
    }
  };

  // 2D Canvas Redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Grid (50cm)
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    const gridStepPx = 50 * scale;
    for (let x = offsetX; x <= offsetX + roomDimensions.width * scale; x += gridStepPx) {
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + roomDimensions.depth * scale);
      ctx.stroke();
    }
    for (let y = offsetY; y <= offsetY + roomDimensions.depth * scale; y += gridStepPx) {
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + roomDimensions.width * scale, y);
      ctx.stroke();
    }

    // Room boundary wireframe
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, roomDimensions.width * scale, roomDimensions.depth * scale);

    // Draw existing walls
    wallSegments.forEach((wall) => {
      const isSelected = selectedWallId === wall.id;
      const x1 = offsetX + wall.start[0] * scale;
      const y1 = offsetY + wall.start[1] * scale;
      const x2 = offsetX + wall.end[0] * scale;
      const y2 = offsetY + wall.end[1] * scale;

      ctx.strokeStyle = isSelected ? '#38BDF8' : '#64748B';
      ctx.lineWidth = Math.max(4, (wall.thickness || 15) * scale);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Draw door openings on wall
      (wall.openings || []).forEach((op) => {
        const dx = (wall.end[0] - wall.start[0]);
        const dy = (wall.end[1] - wall.start[1]);
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;

        const opStartX = offsetX + (wall.start[0] + ux * op.offset) * scale;
        const opStartY = offsetY + (wall.start[1] + uy * op.offset) * scale;
        const opEndX = offsetX + (wall.start[0] + ux * (op.offset + op.width)) * scale;
        const opEndY = offsetY + (wall.start[1] + uy * (op.offset + op.width)) * scale;

        ctx.strokeStyle = '#F59E0B'; // Amber cutout indicator
        ctx.lineWidth = Math.max(6, (wall.thickness || 15) * scale + 2);
        ctx.beginPath();
        ctx.moveTo(opStartX, opStartY);
        ctx.lineTo(opEndX, opEndY);
        ctx.stroke();
      });
    });

    // Draw active drawing wall segment
    if (currentStart) {
      const x1 = offsetX + currentStart[0] * scale;
      const y1 = offsetY + currentStart[1] * scale;
      const x2 = offsetX + cursorPos[0] * scale;
      const y2 = offsetY + cursorPos[1] * scale;

      ctx.strokeStyle = '#14B8A6';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Length indicator text
      const lenM = (Math.hypot(cursorPos[0] - currentStart[0], cursorPos[1] - currentStart[1]) / 100).toFixed(2);
      ctx.fillStyle = '#14B8A6';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${lenM} m`, (x1 + x2) / 2 + 10, (y1 + y2) / 2 - 10);
    }
  }, [wallSegments, currentStart, cursorPos, selectedWallId, roomDimensions, scale, offsetX, offsetY]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: '#0F172A',
        border: '1px solid #1E293B',
        borderRadius: '16px',
        padding: '20px',
        maxWidth: '820px',
        width: '100%',
        color: '#F8FAFC',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool color="#14B8A6" size={20} />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>Sims-Style 2D Wall-Pen Studio</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
          <button
            onClick={() => { setActiveTool('wall'); setCurrentStart(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: activeTool === 'wall' ? '#14B8A6' : '#1E293B',
              color: activeTool === 'wall' ? '#0F172A' : '#F8FAFC',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <PenTool size={14} /> Draw Wall (Click points)
          </button>

          <button
            onClick={() => setActiveTool('door')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: activeTool === 'door' ? '#14B8A6' : '#1E293B',
              color: activeTool === 'door' ? '#0F172A' : '#F8FAFC',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <DoorClosed size={14} /> Cut Door / Window
          </button>

          {currentStart && (
            <button
              onClick={handleFinishWall}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#334155',
                color: '#F8FAFC',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <Check size={14} /> Finish Wall Chain (Esc)
            </button>
          )}

          {selectedWallId && (
            <button
              onClick={handleDeleteSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              <Trash2 size={14} /> Delete Wall
            </button>
          )}
        </div>

        {/* 2D Canvas */}
        <div style={{ border: '1px solid #1E293B', borderRadius: '10px', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            style={{ display: 'block', cursor: activeTool === 'wall' ? 'crosshair' : 'default' }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Snapping to 25cm grid. Walls automatically extrude to 3D and update the scene in real time.
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              backgroundColor: '#14B8A6',
              border: 'none',
              borderRadius: '8px',
              color: '#0F172A',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default WallPenTool;
