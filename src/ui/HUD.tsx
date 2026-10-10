import React from 'react';
import { useGame } from '../game/state/store';
import { UNIVERSES, UniverseId } from '../game/config/universes';
import { calculateLevel } from '../game/logic/progression';
import { 
  Heart, 
  Shield,
  Crown,
  BookOpen, 
  Settings, 
  RotateCcw, 
  ArrowLeft,
  Palette,
  Lightbulb,
  Music
} from 'lucide-react';
import { Button } from './UIComponents';
import { soundFx } from '../game/logic/audio';

export const HUD: React.FC = () => {
  const { 
    state, 
    openModal, 
    returnToNexus, 
    resetCamera,
    updateSettings,
    showToast
  } = useGame();

  const { level, rankTitle, currentLevelBaseXp, progressPercent } = calculateLevel(state.xp);

  // Count hearts collected across kingdoms
  const heartsCount = Object.values(state.hearts).filter(Boolean).length;

  const isNexus = state.currentUniverse === 'nexus';
  const currentUnivConfig = !isNexus ? UNIVERSES[state.currentUniverse as UniverseId] : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Game Title or Return to Citadel */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {isNexus ? (
            <div className="flex items-center gap-3 bg-stone-900/90 backdrop-blur-md border border-amber-600/40 rounded-2xl px-4 py-2.5 shadow-2xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <Crown className="w-4 h-4 text-stone-950 font-bold" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-amber-200 leading-tight">
                  CITADEL OF KINGDOMS
                </h1>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span className="text-amber-400 font-semibold">Four Strongholds</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>Grand Keep</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={returnToNexus}
                className="bg-stone-900/95 backdrop-blur-md border-amber-500/40 text-amber-200 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Return to Citadel Keep</span>
                <span className="sm:hidden">Keep</span>
              </Button>

              <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-2xl px-3.5 py-2 shadow-xl">
                <div className="text-[11px] text-amber-400/90 uppercase tracking-wider font-mono">
                  {currentUnivConfig?.castleName}
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentUnivConfig?.primaryColor }}
                  />
                  {currentUnivConfig?.name}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center: Universe Quick Actions if in Valoria (Dreamora) */}
        {!isNexus && state.currentUniverse === 'dreamora' && (
          <div className="pointer-events-auto flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-amber-500/40 rounded-2xl p-1.5 shadow-xl">
            <Button
              variant="purple"
              size="sm"
              onClick={() => openModal('dreamora-puzzle')}
              className="gap-2 bg-amber-700/80 hover:bg-amber-600 border-amber-400/50 text-white font-medium"
            >
              <Lightbulb className="w-4 h-4 text-amber-200" />
              <span>Heraldic Riddles ({state.dreamora.solvedPuzzles.length}/3)</span>
            </Button>
            <Button
              variant="cyan"
              size="sm"
              onClick={() => openModal('dreamlab')}
              className="gap-2 bg-yellow-600 hover:bg-yellow-500 border-yellow-400/50 text-stone-950 font-bold"
            >
              <Shield className="w-4 h-4 text-stone-950" />
              <span>Armory Shield Forge</span>
            </Button>
          </div>
        )}

        {/* Center: Universe Quick Actions if in Vanguardia (Pixelia) */}
        {!isNexus && state.currentUniverse === 'pixelia' && (
          <div className="pointer-events-auto flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-sky-500/40 rounded-2xl p-1.5 shadow-xl">
            <Button
              variant="cyan"
              size="sm"
              onClick={() => openModal('pixelstudio')}
              className="gap-2 bg-sky-600 hover:bg-sky-500 border-sky-400/50 text-white font-medium"
            >
              <Palette className="w-4 h-4 text-sky-200" />
              <span>War Council Decree</span>
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 text-slate-300">
              <span className="text-slate-400">Decree:</span>
              <span className={state.pixelia.checklistSatisfied ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {state.pixelia.checklistSatisfied ? 'Certified & Ready' : 'In Progress'}
              </span>
            </div>
          </div>
        )}

        {/* Center: Universe Quick Actions if in Chronicler's Keep (Loreland) */}
        {!isNexus && state.currentUniverse === 'loreland' && (
          <div className="pointer-events-auto flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-1.5 shadow-xl">
            <Button
              variant="cyan"
              size="sm"
              onClick={() => openModal('storystudio')}
              className="gap-2 bg-emerald-700 hover:bg-emerald-600 border-emerald-400/50 text-white font-medium"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>Scribe’s Cloister</span>
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 text-slate-300">
              <span className="text-slate-400">Chronicle Fragments:</span>
              <span className="text-emerald-300 font-mono font-semibold">
                {state.loreland.fragmentsFound.length}/4
              </span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className={state.loreland.storySaved ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {state.loreland.storySaved ? 'Bound' : 'Inscribe Draft'}
              </span>
            </div>
          </div>
        )}

        {/* Center: Universe Quick Actions if in Bastion Core (Logicore) */}
        {!isNexus && state.currentUniverse === 'logicore' && (
          <div className="pointer-events-auto flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-purple-500/40 rounded-2xl p-1.5 shadow-xl">
            <Button
              variant="purple"
              size="sm"
              onClick={() => openModal('logicore-puzzles')}
              className="gap-2 bg-purple-700 hover:bg-purple-600 border-purple-400/50 text-white font-medium"
            >
              <Lightbulb className="w-4 h-4 text-purple-200" />
              <span>Siegecraft Protocols ({state.logicore.solvedPuzzles.length}/4)</span>
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 text-slate-300">
              <span className="text-slate-400">Portcullis Gates:</span>
              <span
                className={
                  state.logicore.solvedPuzzles.length >= 4
                    ? 'text-emerald-400 font-semibold'
                    : 'text-amber-400'
                }
              >
                {state.logicore.solvedPuzzles.length >= 4 ? 'Lowered' : '4 Calculations Required'}
              </span>
            </div>
          </div>
        )}

        {/* Right Side: Soldier Rank & Utility buttons */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto ml-auto">
          {/* Knight Rank & XP Box */}
          <div className="bg-stone-900/90 backdrop-blur-md border border-amber-600/30 rounded-2xl px-3.5 py-2 shadow-xl flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-xs text-stone-300 font-medium">
                <span className="text-amber-400 font-bold">{rankTitle}</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="text-amber-200 font-mono font-semibold">{state.xp} XP</span>
              </div>
              <div className="w-24 sm:w-28 h-1.5 bg-stone-950 rounded-full overflow-hidden mt-1.5 border border-stone-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                  title={`${state.xp - currentLevelBaseXp} / 100 XP to next knight rank`}
                />
              </div>
            </div>
          </div>

          {/* Hearts counter */}
          <div
            className="bg-stone-900/90 backdrop-blur-md border border-amber-600/30 rounded-2xl px-3.5 py-2 shadow-xl flex items-center gap-2"
            title={`${heartsCount} of 4 Citadel Hearts claimed`}
          >
            <Heart
              className={`w-4 h-4 ${
                heartsCount > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-stone-500'
              }`}
            />
            <span className="text-xs sm:text-sm font-semibold font-mono text-stone-200">
              {heartsCount}/4
            </span>
            <span className="hidden md:inline text-xs text-amber-300/80">Hearts</span>
          </div>

          {/* Castle Music toggle button */}
          <button
            onClick={() => {
              const next = !state.settings.musicEnabled;
              updateSettings({ musicEnabled: next });
              if (next) {
                soundFx.startCastleMusic();
                showToast({
                  type: 'info',
                  title: 'Castle Melodies Playing',
                  description: 'Atmospheric medieval lute, stone cathedral drone, and keep bells.',
                });
              } else {
                showToast({
                  type: 'info',
                  title: 'Castle Melodies Paused',
                });
              }
            }}
            className={`p-2 sm:p-2.5 rounded-xl transition-all border min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xl ${
              state.settings.musicEnabled
                ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-stone-900/90 hover:bg-stone-800 text-stone-500 hover:text-stone-300 border-stone-800'
            }`}
            title={state.settings.musicEnabled ? 'Castle Music: Playing (Click to Pause)' : 'Castle Music: Paused (Click to Play)'}
            aria-label="Toggle Castle Music"
          >
            <Music className={`w-4 h-4 ${state.settings.musicEnabled ? 'animate-pulse text-amber-300' : ''}`} />
          </button>

          {/* Reset Camera button */}
          <button
            onClick={resetCamera}
            className="p-2 sm:p-2.5 bg-stone-900/90 hover:bg-stone-800/90 text-stone-300 hover:text-white border border-stone-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xl"
            title="Reset Castle Camera View"
            aria-label="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Journal button */}
          <button
            onClick={() => openModal('journal')}
            className="p-2 sm:p-2.5 bg-stone-900/90 hover:bg-stone-800/90 text-amber-400 hover:text-amber-200 border border-amber-600/30 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xl"
            title="Knight's Codex & Medals"
            aria-label="Open Codex"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Settings button */}
          <button
            onClick={() => openModal('settings')}
            className="p-2 sm:p-2.5 bg-stone-900/90 hover:bg-stone-800/90 text-stone-300 hover:text-white border border-stone-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xl"
            title="Castle Settings"
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
