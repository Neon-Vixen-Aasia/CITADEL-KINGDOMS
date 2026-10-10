import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../game/state/store';
import { PixeliaElement, PixeliaDraft, PixeliaShapeType, PixeliaStickerType } from '../game/state/types';
import { Modal, Button } from '../ui/UIComponents';
import { 
  Download, 
  Trash2, 
  Copy, 
  Undo2, 
  Redo2, 
  Sparkles, 
  Move, 
  Type, 
  CheckCircle2, 
  AlertCircle,
  Square,
  Circle,
  Triangle,
  Rocket,
  Heart,
  Palette,
  Shield,
  Sword,
  Crown,
  Flag
} from 'lucide-react';

interface PaletteOption {
  id: string;
  name: string;
  colors: string[];
}

const THEME_PALETTES: PaletteOption[] = [
  {
    id: 'cyber-neon',
    name: 'Royal Vanguard',
    colors: ['#0284c7', '#38bdf8', '#f59e0b', '#ffffff', '#dc2626'],
  },
  {
    id: 'starlight-cyan',
    name: 'High Citadel',
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff', '#cbd5e1'],
  },
  {
    id: 'cosmic-magenta',
    name: 'Iron Guard',
    colors: ['#475569', '#64748b', '#dc2626', '#ffffff', '#94a3b8'],
  },
  {
    id: 'electric-amber',
    name: 'Forest Scouts',
    colors: ['#059669', '#10b981', '#f59e0b', '#ffffff', '#d97706'],
  },
];

const BACKGROUND_OPTIONS = [
  { id: '#090d16', label: 'Dark Iron Keep' },
  { id: '#1c1917', label: 'Granite Citadel' },
  { id: '#0c1a2c', label: 'Vanguard Azure' },
  { id: '#050508', label: 'Night Bastion' },
];

export const PixelStudio: React.FC = () => {
  const { 
    state, 
    activeModal, 
    closeModal, 
    savePixeliaDraft, 
    exportPixeliaArtifact 
  } = useGame();

  const [elements, setElements] = useState<PixeliaElement[]>(
    () => state.pixelia.studioDraft.elements || []
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    () => state.pixelia.studioDraft.backgroundColor || '#090d16'
  );
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(
    () => state.pixelia.studioDraft.paletteId || 'cyber-neon'
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<PixeliaElement[][]>([]);
  const [redoStack, setRedoStack] = useState<PixeliaElement[][]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activePalette =
    THEME_PALETTES.find((p) => p.id === selectedPaletteId) || THEME_PALETTES[0];

  // Sync draft to storage on change
  useEffect(() => {
    savePixeliaDraft({
      backgroundColor,
      paletteId: selectedPaletteId,
      elements,
    });
  }, [backgroundColor, selectedPaletteId, elements, savePixeliaDraft]);

  // Validation Checklist logic
  const hasTitleText = elements.some(
    (el) => el.kind === 'text' && (el.text || '').trim().length > 0
  );
  const hasMinElements = elements.length >= 3;
  const hasThemePalette = Boolean(selectedPaletteId);
  const satisfiesChecklist = hasTitleText && hasMinElements && hasThemePalette;

  const pushHistory = (newElements: PixeliaElement[]) => {
    setHistory((prev) => [...prev.slice(-20), elements]);
    setRedoStack([]);
    setElements(newElements);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, elements]);
    setHistory((prev) => prev.slice(0, -1));
    setElements(previous);
    setSelectedId(null);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, elements]);
    setRedoStack((prev) => prev.slice(0, -1));
    setElements(next);
    setSelectedId(null);
  };

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw futuristic cyber grid lines
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw decorative border frame
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Corner cyber brackets
    const bLen = 14;
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(8, 8 + bLen);
    ctx.lineTo(8, 8);
    ctx.lineTo(8 + bLen, 8);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - 8 - bLen, 8);
    ctx.lineTo(width - 8, 8);
    ctx.lineTo(width - 8, 8 + bLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(8, height - 8 - bLen);
    ctx.lineTo(8, height - 8);
    ctx.lineTo(8 + bLen, height - 8);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - 8 - bLen, height - 8);
    ctx.lineTo(width - 8, height - 8);
    ctx.lineTo(width - 8, height - 8 - bLen);
    ctx.stroke();

    // Draw elements
    elements.forEach((el) => {
      ctx.save();
      ctx.translate(el.x, el.y);
      if (el.rotation) {
        ctx.rotate((el.rotation * Math.PI) / 180);
      }

      ctx.fillStyle = el.color;
      ctx.strokeStyle = el.color;
      ctx.lineWidth = 3;

      if (el.kind === 'shape') {
        const w = el.width;
        const h = el.height;
        switch (el.shapeType) {
          case 'rect':
            ctx.fillRect(-w / 2, -h / 2, w, h);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, Math.min(w, h) / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            ctx.lineTo(w / 2, h / 2);
            ctx.lineTo(-w / 2, h / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 'diamond':
            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            ctx.lineTo(w / 2, 0);
            ctx.lineTo(0, h / 2);
            ctx.lineTo(-w / 2, 0);
            ctx.closePath();
            ctx.fill();
            break;
        }
      } else if (el.kind === 'sticker') {
        const size = Math.min(el.width, el.height);
        switch (el.stickerType) {
          case 'rocket': {
            // Stylized vector rocket
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.quadraticCurveTo(size / 3, -size / 6, size / 4, size / 3);
            ctx.lineTo(-size / 4, size / 3);
            ctx.quadraticCurveTo(-size / 3, -size / 6, 0, -size / 2);
            ctx.fill();
            // Fins
            ctx.beginPath();
            ctx.moveTo(-size / 4, size / 4);
            ctx.lineTo(-size / 2, size / 2);
            ctx.lineTo(-size / 4, size / 2.5);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(size / 4, size / 4);
            ctx.lineTo(size / 2, size / 2);
            ctx.lineTo(size / 4, size / 2.5);
            ctx.closePath();
            ctx.fill();
            // Flame
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(-size / 6, size / 3);
            ctx.lineTo(0, size / 1.7);
            ctx.lineTo(size / 6, size / 3);
            ctx.closePath();
            ctx.fill();
            break;
          }
          case 'star-cluster': {
            // 4 pointed star cluster
            for (let i = 0; i < 3; i++) {
              ctx.save();
              const offX = (i - 1) * (size / 3);
              const offY = (i % 2 === 0 ? -1 : 1) * (size / 6);
              const s = size * (i === 1 ? 0.6 : 0.4);
              ctx.translate(offX, offY);
              ctx.beginPath();
              ctx.moveTo(0, -s);
              ctx.lineTo(s * 0.3, -s * 0.3);
              ctx.lineTo(s, 0);
              ctx.lineTo(s * 0.3, s * 0.3);
              ctx.lineTo(0, s);
              ctx.lineTo(-s * 0.3, s * 0.3);
              ctx.lineTo(-s, 0);
              ctx.lineTo(-s * 0.3, -s * 0.3);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
            break;
          }
          case 'neon-heart': {
            ctx.beginPath();
            const topY = -size / 3;
            ctx.moveTo(0, topY + size / 3);
            ctx.bezierCurveTo(0, topY, -size / 2, topY, -size / 2, topY + size / 3);
            ctx.bezierCurveTo(-size / 2, topY + size * 0.6, 0, topY + size * 0.8, 0, size / 2);
            ctx.bezierCurveTo(0, topY + size * 0.8, size / 2, topY + size * 0.6, size / 2, topY + size / 3);
            ctx.bezierCurveTo(size / 2, topY, 0, topY, 0, topY + size / 3);
            ctx.closePath();
            ctx.fill();
            break;
          }
          case 'galaxy-planet': {
            // Planet body
            ctx.beginPath();
            ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
            ctx.fill();
            // Planetary ring
            ctx.save();
            ctx.rotate(-Math.PI / 6);
            ctx.scale(1.8, 0.4);
            ctx.beginPath();
            ctx.arc(0, 0, size / 3.2, 0, Math.PI * 2);
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
            break;
          }
          case 'pixel-sparkle': {
            const r = size / 2.2;
            ctx.beginPath();
            ctx.moveTo(0, -r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.quadraticCurveTo(0, 0, 0, r);
            ctx.quadraticCurveTo(0, 0, -r, 0);
            ctx.quadraticCurveTo(0, 0, 0, -r);
            ctx.closePath();
            ctx.fill();
            break;
          }
          case 'constellation': {
            // 4 connected dots
            const pts = [
              { x: -size / 3, y: -size / 3 },
              { x: size / 4, y: -size / 4 },
              { x: size / 3, y: size / 4 },
              { x: -size / 4, y: size / 3 },
            ];
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            pts.forEach((p) => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.fill();
            });
            break;
          }
          case 'knight-helm': {
            ctx.beginPath();
            ctx.arc(0, -size * 0.1, size * 0.4, Math.PI, 0);
            ctx.lineTo(size * 0.4, size * 0.35);
            ctx.lineTo(0, size * 0.5);
            ctx.lineTo(-size * 0.4, size * 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-size * 0.28, -size * 0.05, size * 0.56, size * 0.1);
            ctx.beginPath();
            ctx.arc(0, -size * 0.45, size * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = '#dc2626';
            ctx.fill();
            break;
          }
          case 'crossed-swords': {
            ctx.save();
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-size * 0.06, -size * 0.5, size * 0.12, size);
            ctx.fillRect(-size * 0.25, size * 0.2, size * 0.5, size * 0.08);
            ctx.restore();
            ctx.save();
            ctx.rotate(-Math.PI / 4);
            ctx.fillRect(-size * 0.06, -size * 0.5, size * 0.12, size);
            ctx.fillRect(-size * 0.25, size * 0.2, size * 0.5, size * 0.08);
            ctx.restore();
            break;
          }
          case 'castle-tower': {
            ctx.fillRect(-size * 0.35, -size * 0.2, size * 0.7, size * 0.7);
            ctx.fillRect(-size * 0.35, -size * 0.45, size * 0.18, size * 0.25);
            ctx.fillRect(-size * 0.09, -size * 0.45, size * 0.18, size * 0.25);
            ctx.fillRect(size * 0.17, -size * 0.45, size * 0.18, size * 0.25);
            break;
          }
          case 'heraldic-lion': {
            ctx.beginPath();
            ctx.arc(0, -size * 0.2, size * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-size * 0.2, -size * 0.1, size * 0.4, size * 0.5);
            ctx.fillRect(size * 0.1, -size * 0.3, size * 0.25, size * 0.15);
            ctx.fillRect(size * 0.1, size * 0.2, size * 0.3, size * 0.15);
            break;
          }
          case 'royal-crown': {
            ctx.beginPath();
            ctx.moveTo(-size * 0.45, -size * 0.25);
            ctx.lineTo(-size * 0.22, 0);
            ctx.lineTo(0, -size * 0.35);
            ctx.lineTo(size * 0.22, 0);
            ctx.lineTo(size * 0.45, -size * 0.25);
            ctx.lineTo(size * 0.35, size * 0.35);
            ctx.lineTo(-size * 0.35, size * 0.35);
            ctx.closePath();
            ctx.fill();
            break;
          }
          case 'shield-crest': {
            ctx.beginPath();
            const w = size * 0.8;
            const h = size * 1.0;
            ctx.moveTo(-w / 2, -h / 2);
            ctx.lineTo(w / 2, -h / 2);
            ctx.lineTo(w / 2, 0);
            ctx.quadraticCurveTo(w / 2, h / 2, 0, h / 2);
            ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
          }
        }
      } else if (el.kind === 'text') {
        const fontSize = Math.max(16, Math.round(el.height * 0.7));
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.text || 'INVITATION', 0, 0);
      }

      // Selection bounding box
      if (el.id === selectedId) {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-el.width / 2 - 8, -el.height / 2 - 8, el.width + 16, el.height + 16);
      }

      ctx.restore();
    });
  }, [elements, backgroundColor, selectedId]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    const reversed = [...elements].reverse();
    const hit = reversed.find((el) => {
      const minX = el.x - el.width / 2 - 10;
      const maxX = el.x + el.width / 2 + 10;
      const minY = el.y - el.height / 2 - 10;
      const maxY = el.y + el.height / 2 + 10;
      return clientX >= minX && clientX <= maxX && clientY >= minY && clientY <= maxY;
    });

    if (hit) {
      setSelectedId(hit.id);
      isDraggingRef.current = true;
      dragOffsetRef.current = { x: clientX - hit.x, y: clientY - hit.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      setSelectedId(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !selectedId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId) {
          return {
            ...el,
            x: Math.round(clientX - dragOffsetRef.current.x),
            y: Math.round(clientY - dragOffsetRef.current.y),
          };
        }
        return el;
      })
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // safe
      }
    }
  };

  // Creation helpers
  const addShape = (shapeType: PixeliaShapeType) => {
    const newEl: PixeliaElement = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      kind: 'shape',
      shapeType,
      x: 240,
      y: 180,
      width: 60,
      height: 60,
      color: activePalette.colors[1],
      rotation: 0,
    };
    pushHistory([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const addSticker = (stickerType: PixeliaStickerType) => {
    const newEl: PixeliaElement = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      kind: 'sticker',
      stickerType,
      x: 240,
      y: 180,
      width: 70,
      height: 70,
      color: activePalette.colors[0],
      rotation: 0,
    };
    pushHistory([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const addText = () => {
    const newEl: PixeliaElement = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      kind: 'text',
      text: 'STAR PARTY 2026',
      x: 240,
      y: 120,
      width: 280,
      height: 48,
      color: '#ffffff',
      rotation: 0,
    };
    pushHistory([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const updateSelected = (partial: Partial<PixeliaElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...partial } : el))
    );
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;
    const cloned: PixeliaElement = {
      ...selectedElement,
      id: `dup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
    };
    pushHistory([...elements, cloned]);
    setSelectedId(cloned.id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    pushHistory(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSelectedId(null);
    setIsExporting(true);

    setTimeout(() => {
      renderCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `vanguardia-royal-decree-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      exportPixeliaArtifact(satisfiesChecklist);

      if (satisfiesChecklist) {
        setExportNotice('Royal Call-to-Arms Decree exported successfully! Heart of Tactics is unlocked on the Spire!');
      } else {
        setExportNotice('Decree exported! Fulfill the remaining mission checklist items to awaken the Heart.');
      }

      setIsExporting(false);
    }, 50);
  };

  return (
    <Modal
      isOpen={activeModal === 'pixelstudio'}
      onClose={closeModal}
      title="War Council: Royal Call-to-Arms Workshop"
      subtitle="Theme Prompt: 'Royal Call to Arms & Tournament Invitation'. Validate all checklist criteria to uncover the Heart."
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-4">
        {/* Mission Checklist Header Bar */}
        <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold mb-0.5">
              Mission Checklist: Royal Call-to-Arms Decree
            </div>
            <div className="text-xs text-slate-300">
              Required: Decree Title Text + At least 3 military elements + Curated Regiment Palette
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              {hasTitleText ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className={hasTitleText ? 'text-emerald-300' : 'text-slate-400'}>
                Title Text
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              {hasMinElements ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className={hasMinElements ? 'text-emerald-300' : 'text-slate-400'}>
                3+ Elements ({elements.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              {hasThemePalette ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className={hasThemePalette ? 'text-emerald-300' : 'text-slate-400'}>
                Theme Palette
              </span>
            </div>
          </div>
        </div>

        {/* Studio Body: Canvas & Controls */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Canvas Viewport */}
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-inner">
            {/* Action Bar (Undo, Redo, Duplicate, Delete) */}
            <div className="w-full flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 hover:text-white border border-slate-800 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 hover:text-white border border-slate-800 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                  title="Redo (Ctrl+Y)"
                  aria-label="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              {selectedElement && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={duplicateSelected}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white border border-slate-800 cursor-pointer min-h-[36px] flex items-center gap-1.5 px-2.5 text-xs font-medium"
                    title="Duplicate element"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="p-1.5 bg-red-950/60 hover:bg-red-900/80 rounded-lg text-red-300 hover:text-white border border-red-800/60 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Delete element"
                    aria-label="Delete element"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30">
              <canvas
                ref={canvasRef}
                width={480}
                height={600}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-full h-full touch-none cursor-crosshair"
              />
            </div>

            <div className="text-xs text-slate-400 mt-2.5 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5" />
              <span>Drag elements on poster to position</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{elements.length} Elements</span>
            </div>
          </div>

          {/* Controls Column */}
          <div className="w-full lg:w-84 flex flex-col gap-3.5">
            {/* Palette & Theme Selection */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Curated Theme Palette</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {THEME_PALETTES.map((p) => {
                  const isSelected = selectedPaletteId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPaletteId(p.id)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-850 border-cyan-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white mb-1.5">{p.name}</div>
                      <div className="flex gap-1">
                        {p.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Shapes, Stickers, Text */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
                Add Design Elements
              </div>

              {/* Text Button */}
              <button
                onClick={addText}
                className="w-full py-2 px-3 mb-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Type className="w-4 h-4" />
                <span>+ Add Poster Heading / Text</span>
              </button>

              {/* Shapes */}
              <div className="text-[11px] text-slate-400 mb-1 font-medium">Shapes</div>
              <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                <button
                  onClick={() => addShape('rect')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Rectangle"
                >
                  <Square className="w-4 h-4 text-cyan-400" />
                  <span>Rect</span>
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Circle"
                >
                  <Circle className="w-4 h-4 text-cyan-400" />
                  <span>Circle</span>
                </button>
                <button
                  onClick={() => addShape('triangle')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Triangle"
                >
                  <Triangle className="w-4 h-4 text-cyan-400" />
                  <span>Triangle</span>
                </button>
                <button
                  onClick={() => addShape('diamond')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Diamond"
                >
                  <div className="w-3.5 h-3.5 rotate-45 border-2 border-cyan-400 my-0.5" />
                  <span>Diamond</span>
                </button>
              </div>

              {/* Regiment Stamps & Insignia */}
              <div className="text-[11px] text-slate-400 mb-1 font-medium">
                Regiment Stamps & Insignia
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => addSticker('knight-helm')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Knight Helm"
                >
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Helm</span>
                </button>
                <button
                  onClick={() => addSticker('crossed-swords')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Crossed Swords"
                >
                  <Sword className="w-4 h-4 text-amber-400" />
                  <span>Swords</span>
                </button>
                <button
                  onClick={() => addSticker('castle-tower')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Castle Keep"
                >
                  <Square className="w-4 h-4 text-slate-300" />
                  <span>Tower</span>
                </button>
                <button
                  onClick={() => addSticker('royal-crown')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Royal Crown"
                >
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span>Crown</span>
                </button>
                <button
                  onClick={() => addSticker('shield-crest')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Shield Crest"
                >
                  <Flag className="w-4 h-4 text-rose-400" />
                  <span>Shield</span>
                </button>
                <button
                  onClick={() => addSticker('heraldic-lion')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Lion Emblem"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Lion</span>
                </button>
                <button
                  onClick={() => addSticker('star-cluster')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Honor Star"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Star</span>
                </button>
                <button
                  onClick={() => addSticker('neon-heart')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px] cursor-pointer"
                  title="Heart of Valor"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <span>Heart</span>
                </button>
              </div>
            </div>

            {/* Selected Element Properties */}
            {selectedElement && (
              <div className="bg-slate-950/60 border border-cyan-500/40 rounded-xl p-3.5 space-y-3">
                <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  Edit Selected: {selectedElement.kind}
                </div>

                {/* Text Content */}
                {selectedElement.kind === 'text' && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Text Inscription
                    </label>
                    <input
                      type="text"
                      value={selectedElement.text || ''}
                      onChange={(e) => updateSelected({ text: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                {/* Resize Slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Dimension Scale</span>
                    <span>{selectedElement.width}px</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="240"
                    value={selectedElement.width}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateSelected({ width: val, height: selectedElement.kind === 'text' ? Math.round(val * 0.25) : val });
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Color Chooser */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5">
                    Palette Swatch
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {activePalette.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateSelected({ color: c })}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          selectedElement.color === c ? 'scale-110 border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Poster Background */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <label className="text-[11px] text-slate-400 block mb-1.5">
                Poster Card Canvas Tint
              </label>
              <div className="flex items-center gap-2">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackgroundColor(bg.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] border cursor-pointer ${
                      backgroundColor === bg.id
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notice */}
            {exportNotice && (
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{exportNotice}</span>
              </div>
            )}

            {/* Export Action */}
            <Button
              variant="cyan"
              onClick={handleExportPNG}
              disabled={isExporting}
              className="w-full gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export Poster Artifact (PNG)</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
