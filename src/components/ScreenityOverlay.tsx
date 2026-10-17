import React, { useRef, useState, useEffect } from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { 
  Pencil, 
  Eraser, 
  Highlighter, 
  Trash2, 
  X, 
  Download, 
  Video, 
  Square,
  Circle,
  Move
} from 'lucide-react';

export const ScreenityOverlay: React.FC = () => {
  const { screenityDrawingActive, setScreenityDrawingActive, isExtensionActive } = useExtensions();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#3b82f6');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(4);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // If Screenity extension is not active, don't show
  if (!isExtensionActive('screenity') || !screenityDrawingActive) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      // Preserve drawing if needed or resize
      const ctx = canvas.getContext('2d');
      const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imgData && ctx) {
        ctx.putImageData(imgData, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [screenityDrawingActive]);

  // Recording timer
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === 'highlighter' ? lineWidth * 3 : lineWidth;
      ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenity-chromebook-${Date.now()}.png`;
    a.click();
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="absolute inset-0 pointer-events-auto cursor-crosshair"
      />

      {/* Screenity Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto bg-gray-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3">
        {/* Screenity Branding badge */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-gray-700">
          <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-400 to-indigo-600 shadow-xs" />
          <span className="text-xs font-bold tracking-wide">Screenity</span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1 bg-gray-800/80 p-1 rounded-xl">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              tool === 'pen' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Bolígrafo"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              tool === 'highlighter' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Resaltador transparente"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Borrador"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 px-1">
          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#ffffff'].map(c => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                if (tool === 'eraser') setTool('pen');
              }}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                color === c && tool !== 'eraser' ? 'scale-125 border-white ring-2 ring-blue-500' : 'border-transparent'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-2 border-l border-gray-700">
          <button
            onClick={clearCanvas}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Borrar todo el dibujo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={takeScreenshot}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Descargar captura"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300 hover:text-white'
            }`}
            title="Grabar pantalla"
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isRecording ? formatSeconds(recordSeconds) : 'Grabar'}</span>
          </button>
        </div>

        {/* Close toolbar */}
        <button
          onClick={() => setScreenityDrawingActive(false)}
          className="p-1 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer ml-1"
          title="Cerrar Screenity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
