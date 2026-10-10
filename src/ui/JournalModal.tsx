import React from 'react';
import { useGame } from '../game/state/store';
import { ACHIEVEMENTS, calculateLevel } from '../game/logic/progression';
import { UNIVERSES, UniverseId } from '../game/config/universes';
import { Modal, Card, ProgressBar } from './UIComponents';
import { Award, Heart, Shield, Lock, ShieldCheck, Crown } from 'lucide-react';

export const JournalModal: React.FC = () => {
  const { state, activeModal, closeModal } = useGame();
  const { level, rankTitle, progressPercent } = calculateLevel(state.xp);

  const universeIds: UniverseId[] = ['dreamora', 'pixelia', 'loreland', 'logicore'];
  const unlockedBadgesCount = ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id)).length;

  return (
    <Modal
      isOpen={activeModal === 'journal'}
      onClose={closeModal}
      title="Knight's Codex & Citadel Medals"
      subtitle="Track your chivalric ranks, military honors, and conquered Strongholds"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Notice of in-game badges disclaimer */}
        <div className="flex items-start gap-3 p-3.5 bg-stone-950/80 border border-stone-800 rounded-xl text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Citadel Notice:</strong> Medals and military ranks displayed here represent honorary game-issued milestones awarded exclusively within the Citadel of Kingdoms.
          </span>
        </div>

        {/* Knight Rank & XP Overview */}
        <Card className="bg-gradient-to-r from-amber-950/40 via-stone-900/80 to-yellow-950/40 border-amber-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-mono">
                Chivalric Rank & Military Standing
              </div>
              <div className="text-2xl font-black text-amber-200 flex items-center gap-2">
                <span>{rankTitle}</span>
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-xs text-stone-400 mt-0.5">Rank Level {level}</div>
            </div>
            <div className="text-sm font-semibold font-mono text-amber-300">
              {state.xp} Total Knight XP
            </div>
          </div>
          <ProgressBar
            value={progressPercent}
            label="Progress to next knight promotion"
            sublabel={`${progressPercent}%`}
            color="amber"
          />
        </Card>

        {/* Citadel Hearts Status */}
        <div>
          <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>The Four Sovereign Hearts of the Citadel</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {universeIds.map((uId) => {
              const u = UNIVERSES[uId];
              const isFound = state.hearts[uId];
              return (
                <div
                  key={uId}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isFound
                      ? 'bg-stone-900/90 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-stone-950/60 border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    <Heart
                      className={`w-6 h-6 ${
                        isFound ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-stone-600'
                      }`}
                    />
                  </div>
                  <div className="text-xs font-bold text-white truncate">{u.name}</div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 font-mono">
                    {isFound ? 'Conquered' : 'Guarded'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medals list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Royal Military Medals & Deeds</span>
            </div>
            <div className="text-xs font-mono text-stone-400">
              {unlockedBadgesCount} / {ACHIEVEMENTS.length} Conferred
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {ACHIEVEMENTS.map((badge) => {
              const isUnlocked = state.achievements.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                    isUnlocked
                      ? 'bg-stone-900/90 border-amber-500/40'
                      : 'bg-stone-950/40 border-stone-800/80 opacity-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-500/50'
                        : 'bg-stone-900 text-stone-600 border border-stone-800'
                    }`}
                  >
                    {isUnlocked ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{badge.title}</h4>
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">
                        +{badge.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
