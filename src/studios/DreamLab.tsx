import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../game/state/store';
import { DreamLabElement, DreamLabDraft } from '../game/state/types';
import { Modal, Button } from '../ui/UIComponents';
import { 
  Trash2, 
  Download, 
  Layers, 
  Sparkles, 
  Move, 
  Type, 
  Star, 
  Gem, 
  Circle, 
  Square,
  Shield,
  Sword,
  Crown,
  Flag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const HERALDIC_COLORS = [
  '#fbbf24', // Imperial Gold
  '#ef4444', // Blood Crimson
  '#38bdf8', // Royal Azure
  '#10b981', // Forest Emerald
  '#c084fc', // Sovereign Violet
  '#cbd5e1', // Forged Steel
  '#ffffff', // Silver Ivory
  '#0f172a', // Obsidian Charcoal
];

const CASTLE_BACKGROUNDS = [
  { id: '#1c1917', label: 'Dark Granite' },
  { id: '#2e1065', label: 'Royal Velvet' },
  { id: '#172554', label: 'Citadel Azure' },
  { id: '#064e3b', label: 'Knight Emerald' },
  { id: '#0f172a', label: 'Black Iron' },
];

export const DreamLab: React.FC = () => {
  const { 
    state, 
    activeModal, 
    closeModal, 
    saveDreamoraDraft, 
    exportDreamoraArtifact 
  } = useGame();

  const [elements, setElements] = useState<DreamLabElement[]>(
    () => state.dreamora.studioDraft.elements || []
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    () => state.dreamora.studioDraft.backgroundColor || '#1c1917'
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync draft to store on changes
  useEffect(() => {
    saveDreamoraDraft({
      backgroundColor,
      elements,
    });
  }, [backgroundColor, elements, saveDreamoraDraft]);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // Draw canvas contents
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background fill
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle stone castle vignette
    const grad = ctx.createRadialGradient(width / 2, height / 2, 30, width / 2, height / 2, width / 1.1);
    grad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw elements in order
    elements.forEach((el) => {
      ctx.save();
      ctx.translate(el.x, el.y);
      if (el.rotation) {
        ctx.rotate((el.rotation * Math.PI) / 180);
      }

      ctx.fillStyle = el.color;
      ctx.strokeStyle = el.color;
      ctx.lineWidth = 3;

      const size = el.size;

      switch (el.type) {
        case 'shield': {
          ctx.beginPath();
          const w = size * 0.85;
          const h = size * 1.1;
          ctx.moveTo(-w / 2, -h / 2);
          ctx.lineTo(w / 2, -h / 2);
          ctx.lineTo(w / 2, 0);
          ctx.quadraticCurveTo(w / 2, h / 2, 0, h / 2);
          ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
          // Inner boss rivet
          ctx.beginPath();
          ctx.arc(0, 0, size / 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          break;
        }
        case 'sword': {
          // Blade
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.6);
          ctx.lineTo(size * 0.1, -size * 0.45);
          ctx.lineTo(size * 0.08, size * 0.2);
          ctx.lineTo(-size * 0.08, size * 0.2);
          ctx.lineTo(-size * 0.1, -size * 0.45);
          ctx.closePath();
          ctx.fill();
          // Crossguard
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(-size * 0.35, size * 0.2, size * 0.7, size * 0.08);
          // Grip
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-size * 0.06, size * 0.28, size * 0.12, size * 0.22);
          // Pommel
          ctx.beginPath();
          ctx.arc(0, size * 0.54, size * 0.09, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          break;
        }
        case 'crown': {
          ctx.beginPath();
          ctx.moveTo(-size * 0.5, -size * 0.3);
          ctx.lineTo(-size * 0.25, 0);
          ctx.lineTo(0, -size * 0.4);
          ctx.lineTo(size * 0.25, 0);
          ctx.lineTo(size * 0.5, -size * 0.3);
          ctx.lineTo(size * 0.4, size * 0.35);
          ctx.lineTo(-size * 0.4, size * 0.35);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          break;
        }
        case 'banner': {
          ctx.beginPath();
          ctx.moveTo(-size * 0.4, -size * 0.5);
          ctx.lineTo(size * 0.4, -size * 0.5);
          ctx.lineTo(size * 0.4, size * 0.45);
          ctx.lineTo(0, size * 0.2);
          ctx.lineTo(-size * 0.4, size * 0.45);
          ctx.closePath();
          ctx.fill();
          // Hanging spear pole
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-size * 0.48, -size * 0.58, size * 0.96, size * 0.08);
          break;
        }
        case 'tower': {
          ctx.beginPath();
          ctx.rect(-size * 0.35, -size * 0.25, size * 0.7, size * 0.75);
          // Merlons
          ctx.rect(-size * 0.35, -size * 0.5, size * 0.18, size * 0.25);
          ctx.rect(-size * 0.09, -size * 0.5, size * 0.18, size * 0.25);
          ctx.rect(size * 0.17, -size * 0.5, size * 0.18, size * 0.25);
          ctx.fill();
          // Arrow slit
          ctx.fillStyle = '#000000';
          ctx.fillRect(-size * 0.04, -size * 0.05, size * 0.08, size * 0.3);
          break;
        }
        case 'star': {
          ctx.beginPath();
          const spikes = 5;
          const outerRadius = size / 2;
          const innerRadius = size / 4;
          let rot = (Math.PI / 2) * 3;
          let x = 0;
          let y = 0;
          const step = Math.PI / spikes;

          ctx.moveTo(0, -outerRadius);
          for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(0, -outerRadius);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'crystal': {
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 3, -size / 6);
          ctx.lineTo(size / 3, size / 3);
          ctx.lineTo(0, size / 2);
          ctx.lineTo(-size / 3, size / 3);
          ctx.lineTo(-size / 3, -size / 6);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.7)';
          ctx.stroke();
          break;
        }
        case 'circle': {
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'square': {
          ctx.fillRect(-size / 2, -size / 2, size, size);
          break;
        }
        case 'bubble': {
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.globalAlpha = 0.5;
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.stroke();
          break;
        }
        case 'cloud': {
          ctx.beginPath();
          const r = size / 3.5;
          ctx.arc(-r, 0, r, 0, Math.PI * 2);
          ctx.arc(r, 0, r, 0, Math.PI * 2);
          ctx.arc(0, -r * 0.8, r * 1.1, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'text': {
          ctx.font = `bold ${Math.round(size)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.text || 'VALORIA', 0, 0);
          break;
        }
      }

      // Draw bounding box if selected
      if (el.id === selectedId) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        const boundSize = Math.max(el.size + 16, 32);
        ctx.strokeRect(-boundSize / 2, -boundSize / 2, boundSize, boundSize);
      }

      ctx.restore();
    });
  }, [elements, backgroundColor, selectedId]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer interaction on canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = (e.clientX - rect.left) * scaleX;
    const clientY = (e.clientY - rect.top) * scaleY;

    // Check hit test from top to bottom
    const reversed = [...elements].reverse();
    const hit = reversed.find((el) => {
      const dist = Math.hypot(el.x - clientX, el.y - clientY);
      return dist <= el.size * 0.75;
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
      prev.map((el) =>
        el.id === selectedId
          ? {
              ...el,
              x: Math.round(clientX - dragOffsetRef.current.x),
              y: Math.round(clientY - dragOffsetRef.current.y),
            }
          : el
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe
    }
  };

  // Add Element Helper
  const addElement = (type: DreamLabElement['type']) => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 500;
    const height = canvas ? canvas.height : 400;

    const newElement: DreamLabElement = {
      id: `elem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      x: width / 2 + (Math.random() - 0.5) * 60,
      y: height / 2 + (Math.random() - 0.5) * 60,
      size: type === 'text' ? 28 : type === 'shield' ? 80 : 64,
      color: type === 'shield' ? '#ef4444' : type === 'sword' ? '#cbd5e1' : type === 'crown' ? '#fbbf24' : '#fbbf24',
      text: type === 'text' ? 'HONOR & STEEL' : undefined,
      rotation: 0,
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const updateSelected = (partial: Partial<DreamLabElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...partial } : el))
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const moveLayer = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === selectedId);
      if (idx === -1) return prev;
      const copy = [...prev];
      if (direction === 'up' && idx < copy.length - 1) {
        [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      } else if (direction === 'down' && idx > 0) {
        [copy[idx], copy[idx - 1]] = [copy[idx - 1], copy[idx]];
      }
      return copy;
    });
  };

  const handleExportPNG = () => {
    if (elements.length < 3) {
      setExportNotice('The Royal Armory requires at least 3 heraldic elements before certifying the Shield!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setSelectedId(null);
    setIsExporting(true);

    setTimeout(() => {
      renderCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `valoria-knight-shield-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      exportDreamoraArtifact();
      setExportNotice('Knightly Heraldic Shield forged & registered! Heart of Valor is uncovered at the Altar.');
      setIsExporting(false);
    }, 50);
  };

  return (
    <Modal
      isOpen={activeModal === 'dreamlab'}
      onClose={closeModal}
      title="The Royal Armory: Heraldic Shield Forge"
      subtitle="Craft an authentic Knight's Coat of Arms. Compose at least 3 heraldic elements and export PNG to uncover the Heart."
      maxWidth="4xl"
    >
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-stone-950/90 border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-inner">
          <div className="relative w-full max-w-[500px] aspect-[5/4] rounded-xl overflow-hidden shadow-2xl border border-amber-500/30">
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full touch-none cursor-crosshair"
            />
          </div>
          <div className="text-xs text-amber-300/80 mt-2.5 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5" />
            <span>Click and drag heraldic charges to position</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="font-semibold">{elements.length} Charges Assembled (3+ Required)</span>
          </div>
        </div>

        {/* Right: Studio Tool Palette */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Add Elements Palette */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              Heraldic Charges & Regalia
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => addElement('shield')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Knight Shield"
              >
                <Shield className="w-4 h-4 text-red-400" />
                <span>Shield</span>
              </button>
              <button
                onClick={() => addElement('sword')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Broadsword"
              >
                <Sword className="w-4 h-4 text-cyan-400" />
                <span>Sword</span>
              </button>
              <button
                onClick={() => addElement('crown')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Royal Crown"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Crown</span>
              </button>
              <button
                onClick={() => addElement('banner')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Pennon Banner"
              >
                <Flag className="w-4 h-4 text-emerald-400" />
                <span>Banner</span>
              </button>
              <button
                onClick={() => addElement('tower')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Castle Tower"
              >
                <Square className="w-4 h-4 text-slate-300" />
                <span>Tower</span>
              </button>
              <button
                onClick={() => addElement('star')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Solar Star"
              >
                <Star className="w-4 h-4 text-yellow-300" />
                <span>Star</span>
              </button>
              <button
                onClick={() => addElement('crystal')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Gemstone"
              >
                <Gem className="w-4 h-4 text-purple-400" />
                <span>Gem</span>
              </button>
              <button
                onClick={() => addElement('circle')}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                title="Add Boss / Rivet"
              >
                <Circle className="w-4 h-4 text-amber-200" />
                <span>Rivet</span>
              </button>
              <button
                onClick={() => addElement('text')}
                className="col-span-4 p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white flex items-center justify-center gap-1.5 text-[11px] cursor-pointer"
                title="Add Knight Motto"
              >
                <Type className="w-4 h-4 text-amber-400" />
                <span>Add Knight Motto / Battle Cry</span>
              </button>
            </div>
          </div>

          {/* Selected Element Controls */}
          {selectedElement ? (
            <div className="bg-stone-900/80 border border-amber-500/30 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Modify: {selectedElement.type}
                </span>
                <button
                  onClick={deleteSelected}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                  title="Remove charge"
                  aria-label="Remove charge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Text Input if text */}
              {selectedElement.type === 'text' && (
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Motto Text</label>
                  <input
                    type="text"
                    value={selectedElement.text || ''}
                    onChange={(e) => updateSelected({ text: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. HONOR & STEEL"
                  />
                </div>
              )}

              {/* Size Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                  <span>Scale / Size</span>
                  <span>{Math.round(selectedElement.size)}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  value={selectedElement.size}
                  onChange={(e) => updateSelected({ size: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                  <span>Orientation</span>
                  <span>{selectedElement.rotation || 0}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => updateSelected({ rotation: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Heraldic Enamel Colors */}
              <div>
                <label className="text-[11px] text-stone-400 block mb-1.5">Heraldic Enamel</label>
                <div className="flex flex-wrap gap-1.5">
                  {HERALDIC_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateSelected({ color: c })}
                      className={`w-6 h-6 rounded-full border cursor-pointer ${
                        selectedElement.color === c ? 'ring-2 ring-amber-400 border-white' : 'border-stone-700'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Layer Ordering */}
              <div className="flex items-center gap-2 pt-1 border-t border-stone-800">
                <span className="text-[11px] text-stone-400">Layering:</span>
                <button
                  onClick={() => moveLayer('up')}
                  className="px-2 py-1 bg-stone-950 hover:bg-stone-800 rounded text-[11px] text-stone-300 cursor-pointer"
                >
                  Forward
                </button>
                <button
                  onClick={() => moveLayer('down')}
                  className="px-2 py-1 bg-stone-950 hover:bg-stone-800 rounded text-[11px] text-stone-300 cursor-pointer"
                >
                  Backward
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-3 text-center text-xs text-stone-400">
              Select any heraldic charge on the canvas to resize, rotate, or recolor.
            </div>
          )}

          {/* Background Field Palette */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5">
            <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Fortress Field Texture
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {CASTLE_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackgroundColor(bg.id)}
                  className={`px-2 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 border cursor-pointer ${
                    backgroundColor === bg.id
                      ? 'border-amber-400 text-amber-300 bg-stone-950'
                      : 'border-stone-800 text-stone-400 bg-stone-950/60 hover:text-stone-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full border border-stone-700" style={{ backgroundColor: bg.id }} />
                  <span className="truncate">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Action Card */}
          <div className="bg-gradient-to-b from-amber-950/40 to-stone-950 border border-amber-500/40 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Forge Certification
              </span>
              <span className={elements.length >= 3 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                {elements.length >= 3 ? '✓ Ready (3+ charges)' : `${elements.length}/3 Charges`}
              </span>
            </div>

            {exportNotice && (
              <div className="p-2 bg-amber-950/80 border border-amber-500/40 rounded-lg text-[11px] text-amber-200 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{exportNotice}</span>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              className="w-full cursor-pointer bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 border border-amber-400 text-stone-950 font-bold"
              onClick={handleExportPNG}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-1.5" />
              {isExporting ? 'Forging Shield...' : 'Forge & Export Knight Shield PNG'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
