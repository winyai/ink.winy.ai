import { useEffect, useRef, useState } from 'react';
import { getStroke } from 'perfect-freehand';

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface Stroke {
  points: Point[];
  color: string;
}

interface InkCanvasProps {
  currentColor: string;
  isErasing: boolean;
}

export const InkCanvas = ({ currentColor, isErasing }: InkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Pan and Zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPos = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const activeTouches = useRef<number>(0);

  // Setup canvas with high DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Redraw all strokes
    redrawCanvas();
  }, []);

  // Redraw canvas with all strokes (with pan and zoom)
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw all strokes
    strokes.forEach((stroke) => {
      drawStroke(ctx, stroke.points, stroke.color);
    });

    // Draw current stroke if drawing
    if (currentStroke.length > 0) {
      drawStroke(ctx, currentStroke, currentColor);
    }

    ctx.restore();
  };

  // Draw a stroke using Perfect Freehand
  const drawStroke = (ctx: CanvasRenderingContext2D, points: Point[], color: string) => {
    if (points.length < 2) return;

    const outlinePoints = getStroke(points, {
      size: 4,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      start: {
        taper: 0,
        cap: true,
      },
      end: {
        taper: 0,
        cap: true,
      },
    });

    ctx.fillStyle = color;
    ctx.beginPath();

    if (outlinePoints.length > 0) {
      ctx.moveTo(outlinePoints[0][0], outlinePoints[0][1]);

      for (let i = 1; i < outlinePoints.length; i++) {
        ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1]);
      }

      ctx.closePath();
      ctx.fill();
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [strokes, currentStroke, pan, zoom]);

  // Get pointer coordinates relative to canvas (accounting for pan/zoom)
  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Transform to world coordinates
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;

    const pressure = e.pressure || 0.5;

    return { x, y, pressure };
  };

  // Calculate distance between two touches
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start for pinch zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    activeTouches.current = e.touches.length;

    if (e.touches.length === 2) {
      // Two-finger gesture - prepare for zoom/pan
      e.preventDefault();
      setIsPanning(true);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lastPanPos.current = { x: midX, y: midY };
      lastTouchDistance.current = getTouchDistance(e.touches);
    }
  };

  // Handle touch move for pinch zoom
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2 && isPanning) {
      e.preventDefault();

      const currentDistance = getTouchDistance(e.touches);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // Zoom
      if (lastTouchDistance.current !== null) {
        const zoomDelta = currentDistance / lastTouchDistance.current;
        setZoom((prev) => Math.max(0.1, Math.min(5, prev * zoomDelta)));
      }

      // Pan
      const dx = midX - lastPanPos.current.x;
      const dy = midY - lastPanPos.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));

      lastPanPos.current = { x: midX, y: midY };
      lastTouchDistance.current = currentDistance;
    }
  };

  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length < 2) {
      setIsPanning(false);
      lastTouchDistance.current = null;
    }
    activeTouches.current = e.touches.length;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Ignore if two-finger gesture is active
    if (isPanning || activeTouches.current >= 2) return;

    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);

    const point = getPointerPos(e);
    setCurrentStroke([point]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (isPanning || activeTouches.current >= 2) return;

    e.preventDefault();

    const point = getPointerPos(e);
    setCurrentStroke((prev) => [...prev, point]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }

    if (currentStroke.length > 0) {
      if (isErasing) {
        // Erase strokes that intersect with eraser path
        const erasedStrokes = strokes.filter((stroke) => {
          return !strokesIntersect(stroke.points, currentStroke);
        });
        setStrokes(erasedStrokes);
      } else {
        // Add new stroke
        setStrokes((prev) => [...prev, { points: currentStroke, color: currentColor }]);
      }
    }

    setCurrentStroke([]);
    setIsDrawing(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(5, prev * zoomDelta)));
  };

  // Simple intersection detection for erasing
  const strokesIntersect = (stroke1: Point[], stroke2: Point[]): boolean => {
    for (const p1 of stroke1) {
      for (const p2 of stroke2) {
        const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        if (dist < 20) return true;
      }
    }
    return false;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{
          touchAction: 'none',
          cursor: isErasing ? 'crosshair' : isPanning ? 'grab' : 'crosshair',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Zoom indicator */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        Zoom: {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
};
