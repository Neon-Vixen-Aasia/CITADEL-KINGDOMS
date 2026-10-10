import React, { useState } from 'react';
import { useGame } from '../game/state/store';
import { Modal, Button } from './UIComponents';
import { Volume2, VolumeX, Eye, AlertTriangle, RotateCcw, Music } from 'lucide-react';
import { soundFx } from '../game/logic/audio';

export const SettingsModal: React.FC = () => {
  const { state, activeModal, closeModal, updateSettings, resetProgress } = useGame();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <Modal
      isOpen={activeModal === 'settings'}
      onClose={() => {
        setConfirmingReset(false);
        closeModal();
      }}
      title="Citadel Settings & Fortifications"
      subtitle="Fanfare audio, visual motion, and knight campaign data management"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Castle Vibes Background Music Toggle */}
        <div className="p-3.5 bg-stone-950/80 border border-amber-600/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Music className={`w-4 h-4 ${state.settings.musicEnabled ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Castle Vibes Melodies</div>
                <div className="text-xs text-stone-400">
                  Atmospheric medieval lute arpeggios, cathedral drone & keep bells
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.settings.musicEnabled}
              onClick={() => {
                const next = !state.settings.musicEnabled;
                updateSettings({ musicEnabled: next });
                if (next) soundFx.startCastleMusic();
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none ${
                state.settings.musicEnabled ? 'bg-amber-600' : 'bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  state.settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider if music is enabled */}
          {state.settings.musicEnabled && (
            <div className="pt-2 border-t border-stone-800/80 flex items-center gap-3">
              <span className="text-xs text-stone-400 font-medium">Soundtrack Volume:</span>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={state.settings.volume}
                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <span className="text-xs font-mono text-amber-300 w-8 text-right">
                {Math.round(state.settings.volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Audio Effects Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-stone-950/80 border border-stone-800 rounded-xl">
          <div className="flex items-center gap-3">
            {state.settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-500" />
            )}
            <div>
              <div className="text-sm font-semibold text-white">Royal Audio & Fanfares</div>
              <div className="text-xs text-stone-400">
                Brass heraldic fanfares, sword hilt taps, and gate rumbles
              </div>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.soundEnabled}
            onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none ${
              state.settings.soundEnabled ? 'bg-amber-600' : 'bg-stone-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                state.settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-stone-950/80 border border-stone-800 rounded-xl">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-sm font-semibold text-white">Reduced Motion</div>
              <div className="text-xs text-stone-400">
                Suppress floating embers, spark particles, and camera oscillations
              </div>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={state.settings.reducedMotion}
            onClick={() => updateSettings({ reducedMotion: !state.settings.reducedMotion })}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none ${
              state.settings.reducedMotion ? 'bg-amber-600' : 'bg-stone-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                state.settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Progress Section with Confirmation */}
        <div className="pt-4 border-t border-stone-800">
          <div className="text-xs uppercase font-mono tracking-wider text-red-400 mb-2 font-bold">
            Danger Zone
          </div>

          {!confirmingReset ? (
            <div className="flex items-center justify-between p-3.5 bg-red-950/20 border border-red-900/40 rounded-xl">
              <div>
                <div className="text-sm font-semibold text-stone-200">Reset Knight Campaign</div>
                <div className="text-xs text-stone-400">
                  Clears local storage, solved riddles, conquered Hearts, and forged shields.
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmingReset(true)}
              >
                Reset...
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5 text-red-300">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="block text-red-200 font-semibold mb-0.5">
                    Are you absolutely sure?
                  </strong>
                  This will wipe all unlocked castle strongholds, Hearts of the Citadel, and saved armory drafts. This action cannot be undone.
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingReset(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    resetProgress();
                    setConfirmingReset(false);
                  }}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Confirm Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
