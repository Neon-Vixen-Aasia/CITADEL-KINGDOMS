import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { UniverseId } from '../config/universes';
import { GameState, GameSettings, ToastMessage, DreamLabDraft, PixeliaDraft } from './types';
import { loadSavedState, saveGameState, clearSavedState, DEFAULT_INITIAL_STATE } from './storage';
import { isUniverseUnlocked, ACHIEVEMENTS } from '../logic/progression';
import { soundFx } from '../logic/audio';

export type ActiveModal =
  | 'welcome'
  | 'journal'
  | 'settings'
  | 'dreamora-puzzle'
  | 'dreamlab'
  | 'pixelstudio'
  | 'storystudio'
  | 'lore-fragment'
  | 'logicore-puzzles'
  | null;

interface GameContextType {
  state: GameState;
  activeModal: ActiveModal;
  toasts: ToastMessage[];
  cameraResetSignal: number;
  activeLoreFragmentIndex: number | null;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  selectPortal: (universeId: UniverseId | null) => void;
  enterUniverse: (universeId: UniverseId) => void;
  returnToNexus: () => void;
  resetCamera: () => void;
  dismissWelcomeModal: () => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  resetProgress: () => void;
  solveDreamoraPuzzle: (puzzleIndex: number) => boolean;
  saveDreamoraDraft: (draft: DreamLabDraft) => void;
  exportDreamoraArtifact: () => void;
  collectDreamoraHeart: () => void;
  savePixeliaDraft: (draft: PixeliaDraft) => void;
  exportPixeliaArtifact: (isChecklistSatisfied: boolean) => void;
  collectPixeliaHeart: () => void;
  inspectLoreFragment: (index: number) => void;
  discoverLoreFragment: (index: number) => void;
  setLoreChoice: (key: string, value: string) => void;
  saveStoryDraft: (draft: { title: string; beginning: string; middle: string; ending: string }) => void;
  commitCompleteStory: () => boolean;
  collectLorelandHeart: () => void;
  solveLogicorePuzzle: (puzzleIndex: number) => boolean;
  collectLogicoreHeart: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => loadSavedState());
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [cameraResetSignal, setCameraResetSignal] = useState<number>(0);
  const [activeLoreFragmentIndex, setActiveLoreFragmentIndex] = useState<number | null>(null);

  // Sync sound settings with audio synth
  useEffect(() => {
    soundFx.setMuted(!state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  // Sync castle background music
  useEffect(() => {
    soundFx.setMusicMuted(!state.settings.musicEnabled);
    soundFx.setVolume(state.settings.volume);
  }, [state.settings.musicEnabled, state.settings.volume]);

  // Autoplay music upon first user interaction if enabled
  useEffect(() => {
    const handleFirstGesture = () => {
      if (state.settings.musicEnabled) {
        soundFx.startCastleMusic();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [state.settings.musicEnabled]);

  // Persist state on change
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Check for first-visit welcome modal
  useEffect(() => {
    if (!state.hasSeenWelcome) {
      setActiveModal('welcome');
    }
  }, [state.hasSeenWelcome]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev.slice(-4), newToast]);

    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerCelebration = useCallback((type: 'subtle' | 'grand') => {
    if (state.settings.reducedMotion) return;
    try {
      if (type === 'subtle') {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#c084fc', '#38bdf8', '#f472b6'],
        });
      } else {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#c084fc', '#38bdf8', '#ec4899', '#fde047'],
        });
      }
    } catch {
      // canvas confetti fallback
    }
  }, [state.settings.reducedMotion]);

  const awardXpAndCheckAchievements = useCallback(
    (rewardId: string, xpAmount: number, reason: string, updatedDraftState: GameState): GameState => {
      let newState = { ...updatedDraftState };

      // Prevent XP farming
      if (!newState.claimedRewardIds.includes(rewardId)) {
        newState.xp += xpAmount;
        newState.claimedRewardIds = [...newState.claimedRewardIds, rewardId];
        showToast({
          type: 'reward',
          title: `+${xpAmount} Cosmic XP`,
          description: reason,
        });
      }

      // Check achievements
      const newlyEarnedBadges: string[] = [];

      ACHIEVEMENTS.forEach((ach) => {
        if (!newState.achievements.includes(ach.id)) {
          let earned = false;
          if (ach.id === 'nexus_awakening' && newState.claimedRewardIds.includes('nexus_visited')) earned = true;
          if (ach.id === 'dreamora_first_puzzle' && newState.dreamora.solvedPuzzles.length >= 1) earned = true;
          if (ach.id === 'dreamora_all_puzzles' && newState.dreamora.solvedPuzzles.length >= 3) earned = true;
          if (ach.id === 'dreamora_first_artwork' && newState.dreamora.hasExportedArtifact) earned = true;
          if (ach.id === 'dreamora_heart' && newState.hearts.dreamora) earned = true;
          if (ach.id === 'pixelia_mission_complete' && newState.pixelia.checklistSatisfied) earned = true;
          if (ach.id === 'pixelia_heart' && newState.hearts.pixelia) earned = true;
          if (ach.id === 'loreland_fragments_found' && newState.loreland.fragmentsFound.length >= 4) earned = true;
          if (ach.id === 'loreland_story_saved' && newState.loreland.storySaved) earned = true;
          if (ach.id === 'loreland_heart' && newState.hearts.loreland) earned = true;
          if (ach.id === 'logicore_first_puzzle' && newState.logicore.solvedPuzzles.length >= 1) earned = true;
          if (ach.id === 'logicore_all_puzzles' && newState.logicore.solvedPuzzles.length >= 4) earned = true;
          if (ach.id === 'logicore_heart' && newState.hearts.logicore) earned = true;

          if (earned) {
            newlyEarnedBadges.push(ach.id);
            if (!newState.claimedRewardIds.includes(`ach_${ach.id}`)) {
              newState.xp += ach.xpReward;
              newState.claimedRewardIds.push(`ach_${ach.id}`);
            }
            showToast({
              type: 'success',
              title: `Badge Unlocked: ${ach.title}`,
              description: ach.description,
            });
            triggerCelebration('subtle');
          }
        }
      });

      if (newlyEarnedBadges.length > 0) {
        newState.achievements = [...newState.achievements, ...newlyEarnedBadges];
      }

      return newState;
    },
    [showToast, triggerCelebration]
  );

  const openModal = useCallback((modal: ActiveModal) => {
    soundFx.playClick();
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    soundFx.playClick();
    setActiveModal(null);
  }, []);

  const resetCamera = useCallback(() => {
    soundFx.playClick();
    setCameraResetSignal((prev) => prev + 1);
  }, []);

  const selectPortal = useCallback((universeId: UniverseId | null) => {
    soundFx.playClick();
    setState((prev) => ({
      ...prev,
      selectedPortal: universeId,
    }));
  }, []);

  const enterUniverse = useCallback(
    (universeId: UniverseId) => {
      if (!isUniverseUnlocked(universeId, state)) {
        showToast({
          type: 'info',
          title: 'Portal Locked',
          description: 'Fulfill the prior universe criteria to open this gate.',
        });
        return;
      }

      soundFx.playPortalWarp();
      setState((prev) => {
        let next: GameState = {
          ...prev,
          currentUniverse: universeId,
          selectedPortal: null,
        };

        // Award first portal entrance XP
        if (!next.claimedRewardIds.includes(`visit_${universeId}`)) {
          next = awardXpAndCheckAchievements(
            `visit_${universeId}`,
            25,
            `Arrived at ${universeId.toUpperCase()}`,
            next
          );
        }

        return next;
      });
    },
    [state, showToast, awardXpAndCheckAchievements]
  );

  const returnToNexus = useCallback(() => {
    soundFx.playPortalWarp();
    setState((prev) => ({
      ...prev,
      currentUniverse: 'nexus',
      selectedPortal: null,
    }));
  }, []);

  const dismissWelcomeModal = useCallback(() => {
    soundFx.playSuccessChime();
    setState((prev) => {
      let next: GameState = { ...prev, hasSeenWelcome: true };
      next = awardXpAndCheckAchievements('nexus_visited', 25, 'Awakened at the Bubble Nexus', next);
      return next;
    });
    setActiveModal(null);
  }, [awardXpAndCheckAchievements]);

  const updateSettings = useCallback((partial: Partial<GameSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    soundFx.playClick();
    clearSavedState();
    setState({ ...DEFAULT_INITIAL_STATE });
    setActiveModal(null);
    showToast({
      type: 'info',
      title: 'Progress Reset',
      description: 'Cosmic multiverse state has been returned to genesis.',
    });
  }, [showToast]);

  const solveDreamoraPuzzle = useCallback(
    (puzzleIndex: number): boolean => {
      if (state.dreamora.solvedPuzzles.includes(puzzleIndex)) {
        return true;
      }

      soundFx.playSuccessChime();
      triggerCelebration('subtle');

      setState((prev) => {
        const nextSolved = [...prev.dreamora.solvedPuzzles, puzzleIndex].sort((a, b) => a - b);
        let next = {
          ...prev,
          dreamora: {
            ...prev.dreamora,
            solvedPuzzles: nextSolved,
            activePuzzleIndex: Math.min(2, puzzleIndex + 1),
          },
        };

        next = awardXpAndCheckAchievements(
          `dreamora_puzzle_${puzzleIndex}`,
          50,
          `Solved Dreamora Puzzle #${puzzleIndex + 1}`,
          next
        );

        if (nextSolved.length === 3) {
          showToast({
            type: 'success',
            title: 'Dreamora Transfigured!',
            description: 'All 3 Prism Riddles solved. The central altar radiates with celestial harmony.',
          });
        }

        return next;
      });

      return true;
    },
    [state.dreamora.solvedPuzzles, triggerCelebration, awardXpAndCheckAchievements, showToast]
  );

  const saveDreamoraDraft = useCallback((draft: DreamLabDraft) => {
    setState((prev) => ({
      ...prev,
      dreamora: {
        ...prev.dreamora,
        studioDraft: draft,
      },
    }));
  }, []);

  const exportDreamoraArtifact = useCallback(() => {
    soundFx.playSuccessChime();
    triggerCelebration('subtle');

    setState((prev) => {
      let next = {
        ...prev,
        dreamora: {
          ...prev.dreamora,
          hasExportedArtifact: true,
          exportedCount: prev.dreamora.exportedCount + 1,
        },
      };

      next = awardXpAndCheckAchievements(
        'dreamora_artifact_exported',
        75,
        'Exported Original DreamLab Composition',
        next
      );

      // Check if Heart now unlocks
      if (next.dreamora.solvedPuzzles.length >= 3 && !next.hearts.dreamora) {
        showToast({
          type: 'heart',
          title: 'Heart of Imagination Awakened!',
          description: 'The Prismatic Heart is now levitating above the central Dreamora Altar! Click to collect it.',
        });
      }

      return next;
    });
  }, [triggerCelebration, awardXpAndCheckAchievements, showToast]);

  const collectDreamoraHeart = useCallback(() => {
    if (state.hearts.dreamora) return;

    soundFx.playHeartCollect();
    triggerCelebration('grand');

    setState((prev) => {
      let next = {
        ...prev,
        hearts: {
          ...prev.hearts,
          dreamora: true,
        },
        dreamora: {
          ...prev.dreamora,
          heartCollected: true,
        },
      };

      next = awardXpAndCheckAchievements(
        'heart_dreamora',
        150,
        'Claimed the Heart of Imagination (Dreamora Complete!)',
        next
      );

      showToast({
        type: 'heart',
        title: 'Universe Completed: Dreamora!',
        description: 'Pixelia and Loreland are now unlocked in the Bubble Nexus!',
        duration: 6000,
      });

      return next;
    });
  }, [state.hearts.dreamora, triggerCelebration, awardXpAndCheckAchievements, showToast]);

  const savePixeliaDraft = useCallback((draft: PixeliaDraft) => {
    setState((prev) => ({
      ...prev,
      pixelia: {
        ...prev.pixelia,
        studioDraft: draft,
      },
    }));
  }, []);

  const exportPixeliaArtifact = useCallback(
    (isChecklistSatisfied: boolean) => {
      soundFx.playSuccessChime();
      triggerCelebration('subtle');

      setState((prev) => {
        let next: GameState = {
          ...prev,
          pixelia: {
            ...prev.pixelia,
            hasExportedArtifact: true,
            checklistSatisfied: isChecklistSatisfied,
          },
        };

        next = awardXpAndCheckAchievements(
          'pixelia_artifact_exported',
          75,
          'Exported Pixelia Star Party Invitation',
          next
        );

        if (isChecklistSatisfied) {
          next = awardXpAndCheckAchievements(
            'pixelia_checklist_satisfied',
            75,
            'Fulfilled All Star Party Design Criteria',
            next
          );

          if (!next.hearts.pixelia) {
            showToast({
              type: 'heart',
              title: 'Heart of Design Discovered!',
              description:
                'The cybernetic Heart of Design has materialized atop the Pixelia Spire! Click to collect it.',
              duration: 6000,
            });
          }
        } else {
          showToast({
            type: 'info',
            title: 'Design Exported (Checklist Incomplete)',
            description:
              'Satisfy the full Star Party mission checklist (title, 3+ elements, chosen palette) to awaken the Heart of Design.',
          });
        }

        return next;
      });
    },
    [awardXpAndCheckAchievements, showToast, triggerCelebration]
  );

  const collectPixeliaHeart = useCallback(() => {
    if (state.hearts.pixelia) return;

    soundFx.playHeartCollect();
    triggerCelebration('grand');

    setState((prev) => {
      let next: GameState = {
        ...prev,
        hearts: {
          ...prev.hearts,
          pixelia: true,
        },
        pixelia: {
          ...prev.pixelia,
          heartCollected: true,
        },
      };

      next = awardXpAndCheckAchievements(
        'heart_pixelia',
        150,
        'Claimed the Heart of Design (Pixelia Complete!)',
        next
      );

      showToast({
        type: 'heart',
        title: 'Universe Completed: Pixelia!',
        description: 'Logicore is now unlocked in the Bubble Nexus!',
        duration: 6000,
      });

      return next;
    });
  }, [state.hearts.pixelia, triggerCelebration, awardXpAndCheckAchievements, showToast]);

  const discoverLoreFragment = useCallback(
    (index: number) => {
      soundFx.playSuccessChime();
      triggerCelebration('subtle');

      setState((prev) => {
        if (prev.loreland.fragmentsFound.includes(index)) {
          return prev;
        }

        const nextFragments = [...prev.loreland.fragmentsFound, index].sort((a, b) => a - b);
        let next: GameState = {
          ...prev,
          loreland: {
            ...prev.loreland,
            fragmentsFound: nextFragments,
          },
        };

        next = awardXpAndCheckAchievements(
          `loreland_frag_${index}`,
          25,
          `Discovered Lore Fragment #${index + 1}`,
          next
        );

        if (nextFragments.length === 4) {
          showToast({
            type: 'success',
            title: 'All 4 Chronicle Fragments Gathered!',
            description:
              'The ancient knowledge is restored. Head to StoryStudio to craft and bind your chronicle.',
          });
        }

        return next;
      });
    },
    [awardXpAndCheckAchievements, showToast, triggerCelebration]
  );

  const inspectLoreFragment = useCallback(
    (index: number) => {
      soundFx.playClick();
      setActiveLoreFragmentIndex(index);
      setActiveModal('lore-fragment');
      discoverLoreFragment(index);
    },
    [discoverLoreFragment]
  );

  const setLoreChoice = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      loreland: {
        ...prev.loreland,
        choices: {
          ...prev.loreland.choices,
          [key]: value,
        },
      },
    }));
  }, []);

  const saveStoryDraft = useCallback(
    (draft: { title: string; beginning: string; middle: string; ending: string }) => {
      setState((prev) => ({
        ...prev,
        loreland: {
          ...prev.loreland,
          storyDraft: draft,
        },
      }));
    },
    []
  );

  const commitCompleteStory = useCallback((): boolean => {
    soundFx.playSuccessChime();
    triggerCelebration('subtle');

    setState((prev) => {
      let next: GameState = {
        ...prev,
        loreland: {
          ...prev.loreland,
          storySaved: true,
        },
      };

      next = awardXpAndCheckAchievements(
        'loreland_story_saved_xp',
        100,
        'Bound Complete Chronicle in StoryStudio',
        next
      );

      if (next.loreland.fragmentsFound.length >= 4 && !next.hearts.loreland) {
        showToast({
          type: 'heart',
          title: 'Heart of Chronicles Revealed!',
          description:
            'The emerald Heart of Chronicles is levitating in the Story Temple atrium! Click to claim it.',
          duration: 6000,
        });
      } else {
        showToast({
          type: 'success',
          title: 'Chronicle Saved to Archives!',
          description:
            'Find all 4 fragments and keep your story complete to awaken the Heart of Chronicles.',
        });
      }

      return next;
    });

    return true;
  }, [awardXpAndCheckAchievements, showToast, triggerCelebration]);

  const collectLorelandHeart = useCallback(() => {
    if (state.hearts.loreland) return;

    soundFx.playHeartCollect();
    triggerCelebration('grand');

    setState((prev) => {
      let next: GameState = {
        ...prev,
        hearts: {
          ...prev.hearts,
          loreland: true,
        },
        loreland: {
          ...prev.loreland,
          heartCollected: true,
        },
      };

      next = awardXpAndCheckAchievements(
        'heart_loreland',
        150,
        'Claimed the Heart of Chronicles (Loreland Complete!)',
        next
      );

      showToast({
        type: 'heart',
        title: 'Universe Completed: Loreland!',
        description: 'Logicore is now unlocked in the Bubble Nexus!',
        duration: 6000,
      });

      return next;
    });
  }, [state.hearts.loreland, triggerCelebration, awardXpAndCheckAchievements, showToast]);

  const solveLogicorePuzzle = useCallback(
    (puzzleIndex: number): boolean => {
      if (state.logicore.solvedPuzzles.includes(puzzleIndex)) {
        return true;
      }

      soundFx.playSuccessChime();
      triggerCelebration('subtle');

      setState((prev) => {
        const nextSolved = [...prev.logicore.solvedPuzzles, puzzleIndex].sort((a, b) => a - b);
        let next: GameState = {
          ...prev,
          logicore: {
            ...prev.logicore,
            solvedPuzzles: nextSolved,
            activePuzzleIndex: Math.min(3, puzzleIndex + 1),
          },
        };

        next = awardXpAndCheckAchievements(
          `logicore_puzzle_${puzzleIndex}`,
          50,
          `Deciphered Logicore Protocol #${puzzleIndex + 1}`,
          next
        );

        if (nextSolved.length === 4) {
          showToast({
            type: 'heart',
            title: 'Heart of Reason Awakened!',
            description:
              'All 4 liminal logic protocols resolved! The iridescent Heart of Reason is levitating above the central Quantum Node. Click to collect it!',
            duration: 7000,
          });
        }

        return next;
      });

      return true;
    },
    [state.logicore.solvedPuzzles, triggerCelebration, awardXpAndCheckAchievements, showToast]
  );

  const collectLogicoreHeart = useCallback(() => {
    if (state.hearts.logicore) return;

    soundFx.playHeartCollect();
    triggerCelebration('grand');

    setState((prev) => {
      let next: GameState = {
        ...prev,
        hearts: {
          ...prev.hearts,
          logicore: true,
        },
        logicore: {
          ...prev.logicore,
          heartCollected: true,
        },
      };

      next = awardXpAndCheckAchievements(
        'heart_logicore',
        200,
        'Claimed the Heart of Reason (Logicore Complete!)',
        next
      );

      showToast({
        type: 'heart',
        title: 'MULTIVERSE FULLY HARMONIZED!',
        description:
          'You have gathered all 4 Multiverse Hearts and awakened the Dreamcore Continuum!',
        duration: 8000,
      });

      return next;
    });
  }, [state.hearts.logicore, triggerCelebration, awardXpAndCheckAchievements, showToast]);

  return (
    <GameContext.Provider
      value={{
        state,
        activeModal,
        toasts,
        cameraResetSignal,
        activeLoreFragmentIndex,
        openModal,
        closeModal,
        showToast,
        removeToast,
        selectPortal,
        enterUniverse,
        returnToNexus,
        resetCamera,
        dismissWelcomeModal,
        updateSettings,
        resetProgress,
        solveDreamoraPuzzle,
        saveDreamoraDraft,
        exportDreamoraArtifact,
        collectDreamoraHeart,
        savePixeliaDraft,
        exportPixeliaArtifact,
        collectPixeliaHeart,
        inspectLoreFragment,
        discoverLoreFragment,
        setLoreChoice,
        saveStoryDraft,
        commitCompleteStory,
        collectLorelandHeart,
        solveLogicorePuzzle,
        collectLogicoreHeart,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
