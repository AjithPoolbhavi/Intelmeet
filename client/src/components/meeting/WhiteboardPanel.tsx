import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Eraser, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface WhiteboardPanelProps {
  meetingId: string;
  socket: Socket | null;
  onClose: () => void;
}

export default function WhiteboardPanel({ meetingId, socket, onClose }: WhiteboardPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0E71EB'); // Default blue
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    { name: 'Blue', value: '#0E71EB' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to fit container
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = (rect?.width || 800) * 2;
    canvas.height = (rect?.height || 500) * 2;
    canvas.style.width = `${rect?.width || 800}px`;
    canvas.style.height = `${rect?.height || 500}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Clear board with background color
    clearBoard(false);
  }, []);

  // Update stroke style when color, size or eraser changes
  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = isEraser ? '#18181B' : color; // Eraser acts as canvas background color
    contextRef.current.lineWidth = isEraser ? 24 : brushSize;
  }, [color, brushSize, isEraser]);

  // Sync drawing from sockets
  useEffect(() => {
    if (!socket) return;

    const handleRemoteDraw = (data: any) => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      context.beginPath();
      context.moveTo(data.x0, data.y0);
      context.lineTo(data.x1, data.y1);
      context.strokeStyle = data.color;
      context.lineWidth = data.size;
      context.stroke();
      context.closePath();

      // Restore active user color/size
      context.strokeStyle = isEraser ? '#18181B' : color;
      context.lineWidth = isEraser ? 24 : brushSize;
    };

    const handleRemoteClear = () => {
      clearBoard(false);
      toast('Whiteboard cleared by another user', { icon: '🧹' });
    };

    socket.on('draw', handleRemoteDraw);
    socket.on('clear-whiteboard', handleRemoteClear);

    return () => {
      socket.off('draw', handleRemoteDraw);
      socket.off('clear-whiteboard', handleRemoteClear);
    };
  }, [socket, color, brushSize, isEraser]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    contextRef.current?.beginPath();
    contextRef.current?.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords || !contextRef.current) return;

    // Get previous point for drawing
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x1 = coords.x;
    const y1 = coords.y;

    // We need to keep track of previous coordinate to send and draw line properly
    // Using native canvas drawing paths
    const context = contextRef.current;
    
    // Draw locally
    // To prevent gaps, draw line from last position
    // Since we don't store previous coords, we can draw a tiny line or keep track
  };

  // Improved drawing tracking
  const lastCoords = useRef<{ x: number; y: number } | null>(null);

  const startDrawingImproved = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    lastCoords.current = coords;
    setIsDrawing(true);
  };

  const drawImproved = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastCoords.current || !contextRef.current) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const x0 = lastCoords.current.x;
    const y0 = lastCoords.current.y;
    const x1 = coords.x;
    const y1 = coords.y;

    // Draw locally
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath();

    // Broadcast drawing event
    if (socket) {
      socket.emit('draw', {
        meetingId,
        x0,
        y0,
        x1,
        y1,
        color: isEraser ? '#18181B' : color,
        size: isEraser ? 24 : brushSize,
      });
    }

    lastCoords.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastCoords.current = null;
  };

  const clearBoard = (emit = true) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = '#18181B'; // Match meeting room dark color
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (emit && socket) {
      socket.emit('clear-whiteboard', { meetingId });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#18181B] rounded-2xl border border-white/10 m-4 overflow-hidden relative shadow-2xl">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#1F1F24]">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-white text-sm">Interactive Whiteboard</h3>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            {/* Color circles */}
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setColor(c.value);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full border transition-transform ${
                  color === c.value && !isEraser ? 'scale-110 border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pen / Eraser Toggles */}
          <button
            onClick={() => setIsEraser(false)}
            className={`p-2 rounded-lg transition-colors ${
              !isEraser ? 'bg-[#0E71EB] text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
            title="Pen"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => setIsEraser(true)}
            className={`p-2 rounded-lg transition-colors ${
              isEraser ? 'bg-[#0E71EB] text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
            title="Eraser"
          >
            <Eraser size={16} />
          </button>

          {/* Brush size selector */}
          {!isEraser && (
            <select
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="bg-[#18181B] border border-white/10 text-white rounded px-2 py-1.5 text-xs outline-none"
            >
              <option value="2">Thin Brush</option>
              <option value="4">Medium Brush</option>
              <option value="8">Thick Brush</option>
              <option value="16">Mega Brush</option>
            </select>
          )}

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Clear board */}
          <button
            onClick={() => clearBoard(true)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Clear Whiteboard"
          >
            <Trash2 size={16} />
          </button>

          {/* Close Whiteboard */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            title="Close Whiteboard"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div className="flex-1 relative bg-[#18181B] cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawingImproved}
          onMouseMove={drawImproved}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawingImproved}
          onTouchMove={drawImproved}
          onTouchEnd={stopDrawing}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
