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
  onSwipeUp: () => void;
  currentColor: string;
  isErasing: boolean;
}

export const InkCanvas = ({ onSwipeUp, currentColor, isErasing }: InkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Touch/gesture tracking for swipe detection
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

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

  // Redraw canvas with all strokes
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    strokes.forEach((stroke) => {
      drawStroke(ctx, stroke.points, stroke.color);
    });

    // Draw current stroke if drawing
    if (currentStroke.length > 0) {
      drawStroke(ctx, currentStroke, currentColor);
    }
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
  }, [strokes, currentStroke]);

  // Get pointer coordinates relative to canvas
  const getPointerPos = (e: PointerEvent | React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    // Track touch start for swipe detection
    if (e.pointerType === 'touch') {
      touchStartY.current = e.clientY;
      touchStartTime.current = Date.now();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);

    const point = getPointerPos(e);
    setCurrentStroke([point]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const point = getPointerPos(e);
    setCurrentStroke((prev) => [...prev, point]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    // Check for swipe-up gesture
    if (e.pointerType === 'touch') {
      const deltaY = touchStartY.current - e.clientY;
      const deltaTime = Date.now() - touchStartTime.current;
      const velocity = deltaY / deltaTime;

      // Swipe up: moved up at least 100px with good velocity
      if (deltaY > 100 && velocity > 0.3) {
        onSwipeUp();
        return;
      }
    }

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          touchAction: 'none',
          cursor: isErasing ? 'crosshair' : 'crosshair',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
