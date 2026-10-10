import { GameState } from './types';

const STORAGE_KEY = 'bubble_multiverse_save_v1';
export const CURRENT_SAVE_VERSION = 1;

export const DEFAULT_INITIAL_STATE: GameState = {
  version: CURRENT_SAVE_VERSION,
  lastSaved: Date.now(),
  currentUniverse: 'nexus',
  selectedPortal: null,
  xp: 0,
  claimedRewardIds: [],
  hasSeenWelcome: false,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    reducedMotion: false,
    volume: 0.8,
  },
  hearts: {
    dreamora: false,
    pixelia: false,
    loreland: false,
    logicore: false,
  },
  dreamora: {
    solvedPuzzles: [],
    activePuzzleIndex: 0,
    hasExportedArtifact: false,
    exportedCount: 0,
    heartCollected: false,
    studioDraft: {
      backgroundColor: '#1e1136',
      elements: [
        {
          id: 'el-star-1',
          type: 'star',
          x: 140,
          y: 120,
          size: 64,
          color: '#f472b6',
        },
        {
          id: 'el-crystal-1',
          type: 'crystal',
          x: 320,
          y: 200,
          size: 80,
          color: '#38bdf8',
        },
        {
          id: 'el-text-1',
          type: 'text',
          x: 180,
          y: 320,
          size: 28,
          color: '#ffffff',
          text: 'Dreamora Prism',
        },
      ],
    },
  },
  pixelia: {
    checklistSatisfied: false,
    hasExportedArtifact: false,
    heartCollected: false,
    studioDraft: {
      backgroundColor: '#090d16',
      paletteId: 'cyber-neon',
      elements: [
        {
          id: 'px-text-1',
          kind: 'text',
          x: 240,
          y: 70,
          width: 320,
          height: 50,
          color: '#22d3ee',
          text: 'STARS & NEON PARTY',
          rotation: 0,
        },
        {
          id: 'px-sticker-1',
          kind: 'sticker',
          x: 240,
          y: 190,
          width: 80,
          height: 80,
          color: '#ec4899',
          stickerType: 'rocket',
          rotation: 0,
        },
        {
          id: 'px-shape-1',
          kind: 'shape',
          x: 100,
          y: 280,
          width: 50,
          height: 50,
          color: '#a855f7',
          shapeType: 'diamond',
          rotation: 0,
        },
      ],
    },
  },
  loreland: {
    fragmentsFound: [],
    choices: {},
    storySaved: false,
    heartCollected: false,
    storyDraft: {
      title: 'The Starlight Chronicle',
      beginning: 'Beneath the twin moons of Loreland, ancient glyphs stirred with quiet brilliance...',
      middle: 'Guided by the celestial runes, the wanderer crossed the shimmering bridge of forgotten words...',
      ending: 'At last, the living library opened its golden vaults, sealing harmony throughout the cosmos.',
    },
  },
  logicore: {
    solvedPuzzles: [],
    activePuzzleIndex: 0,
    heartCollected: false,
  },
  achievements: [],
};

/**
 * Migration hook to safely upgrade older save schemas
 */
function migrateSaveData(loadedData: any): GameState {
  if (!loadedData || typeof loadedData !== 'object') {
    return { ...DEFAULT_INITIAL_STATE };
  }

  const version = typeof loadedData.version === 'number' ? loadedData.version : 0;

  if (version === 0) {
    // Migration from unversioned to version 1
    return {
      ...DEFAULT_INITIAL_STATE,
      ...loadedData,
      version: CURRENT_SAVE_VERSION,
      lastSaved: Date.now(),
    };
  }

  // Version 1 or future: merge safely with DEFAULT_INITIAL_STATE structure
  return {
    ...DEFAULT_INITIAL_STATE,
    ...loadedData,
    settings: {
      ...DEFAULT_INITIAL_STATE.settings,
      ...(loadedData.settings || {}),
    },
    hearts: {
      ...DEFAULT_INITIAL_STATE.hearts,
      ...(loadedData.hearts || {}),
    },
    dreamora: {
      ...DEFAULT_INITIAL_STATE.dreamora,
      ...(loadedData.dreamora || {}),
      studioDraft: {
        ...DEFAULT_INITIAL_STATE.dreamora.studioDraft,
        ...(loadedData.dreamora?.studioDraft || {}),
      },
    },
    pixelia: {
      ...DEFAULT_INITIAL_STATE.pixelia,
      ...(loadedData.pixelia || {}),
    },
    loreland: {
      ...DEFAULT_INITIAL_STATE.loreland,
      ...(loadedData.loreland || {}),
    },
    logicore: {
      ...DEFAULT_INITIAL_STATE.logicore,
      ...(loadedData.logicore || {}),
    },
    claimedRewardIds: Array.isArray(loadedData.claimedRewardIds) ? loadedData.claimedRewardIds : [],
    achievements: Array.isArray(loadedData.achievements) ? loadedData.achievements : [],
  };
}

export function loadSavedState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_INITIAL_STATE };
    const parsed = JSON.parse(raw);
    return migrateSaveData(parsed);
  } catch (err) {
    console.warn('Failed to load saved state, safely falling back to fresh state:', err);
    return { ...DEFAULT_INITIAL_STATE };
  }
}

export function saveGameState(state: GameState): boolean {
  try {
    const dataToSave: GameState = {
      ...state,
      lastSaved: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (err) {
    console.warn('Failed to save game state to localStorage:', err);
    return false;
  }
}

export function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear saved state:', err);
  }
}
