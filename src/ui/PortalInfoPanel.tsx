import React from 'react';
import { useGame } from '../game/state/store';
import { UNIVERSES, UniverseId } from '../game/config/universes';
import { isUniverseUnlocked, getUnlockStatusDescription } from '../game/logic/progression';
import { Button } from './UIComponents';
import { Lock, Sparkles, X, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';

export const PortalInfoPanel: React.FC = () => {
  const { state, selectPortal, enterUniverse } = useGame();

  if (!state.selectedPortal) return null;

  const universeId: UniverseId = state.selectedPortal;
  const universe = UNIVERSES[universeId];
  const unlocked = isUniverseUnlocked(universeId, state);
  const unlockText = getUnlockStatusDescription(universeId, state);
  const heartCollected = state.hearts[universeId];

  // Specific progress computation
  let missionProgressLabel = '';
  if (universeId === 'dreamora') {
    missionProgressLabel = `Armory Riddles: ${state.dreamora.solvedPuzzles.length}/3 | Forged Shield: ${state.dreamora.hasExportedArtifact ? 'Certified' : 'Pending'}`;
  } else if (universeId === 'pixelia') {
    missionProgressLabel = `Call-to-Arms Decree: ${state.pixelia.checklistSatisfied ? 'Certified' : 'Drafting'} | Heart of Tactics: ${state.pixelia.heartCollected ? 'Conquered' : 'Hidden'}`;
  } else if (universeId === 'loreland') {
    missionProgressLabel = `War Fragments: ${state.loreland.fragmentsFound.length}/4 | Chronicle: ${state.loreland.storySaved ? 'Bound' : 'Pending'}`;
  } else if (universeId === 'logicore') {
    missionProgressLabel = `Siege Protocols: ${state.logicore.solvedPuzzles.length}/4 | Heart of Command: ${state.logicore.heartCollected ? 'Conquered' : 'Locked'}`;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-5 pointer-events-none animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="portal-panel-title"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs pointer-events-auto"
        onClick={() => selectPortal(null)}
      />

      <div
        className={`pointer-events-auto relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border ${universe.tailwindBorder} rounded-2xl shadow-2xl ${universe.tailwindGlow} p-5 sm:p-6 text-slate-100 z-10 animate-in slide-in-from-bottom-5 duration-200`}
      >
        {/* Close Button */}
        <button
          onClick={() => selectPortal(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-purple-400 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close portal information"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Portal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: `${universe.primaryColor}22`,
              border: `1.5px solid ${universe.primaryColor}`,
            }}
          >
            {unlocked ? (
              <Sparkles className="w-6 h-6" style={{ color: universe.primaryColor }} />
            ) : (
              <Lock className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              {universe.domain}
            </div>
            <h2
              id="portal-panel-title"
              className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2"
            >
              <span>{universe.name}</span>
              {heartCollected && (
                <span title="Heart Collected" className="flex items-center">
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {universe.themeSummary}
        </p>

        {/* Mission Card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
            Current Mission Objective
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-normal">
            {universe.missionDescription}
          </p>
          {missionProgressLabel && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{missionProgressLabel}</span>
            </div>
          )}
        </div>

        {/* Unlock Status / Requisite */}
        <div className="mb-5">
          {unlocked ? (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Dimensional resonance active. Portal ready for entry.</span>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-200">Locked Gateway</span>
                <span>{unlockText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => selectPortal(null)}
          >
            Stay in Nexus
          </Button>
          <Button
            variant="primary"
            className="flex-1 gap-2"
            disabled={!unlocked}
            onClick={() => enterUniverse(universeId)}
          >
            <span>Enter Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
