import React from 'react';
import { useGame } from '../game/state/store';
import { Sparkles, CheckCircle2, Heart, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const icons = {
          info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          reward: <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          heart: <Heart className="w-5 h-5 text-pink-400 fill-pink-400 shrink-0 mt-0.5" />,
        };

        const borderThemes = {
          info: 'border-sky-500/30 bg-slate-900/95 shadow-sky-950/40',
          success: 'border-emerald-500/30 bg-slate-900/95 shadow-emerald-950/40',
          reward: 'border-amber-500/30 bg-slate-900/95 shadow-amber-950/40',
          heart: 'border-pink-500/40 bg-slate-900/95 shadow-pink-950/50',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl text-slate-100 animate-in slide-in-from-bottom-3 duration-200 ${borderThemes[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-sm font-semibold text-white tracking-tight">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
