import { UniverseId } from '../config/universes';

export interface DreamLabElement {
  id: string;
  type: 'text' | 'circle' | 'square' | 'star' | 'crystal' | 'cloud' | 'bubble' | 'shield' | 'sword' | 'tower' | 'crown' | 'banner';
  x: number;
  y: number;
  size: number;
  color: string;
  text?: string;
  rotation?: number;
}

export interface DreamLabDraft {
  backgroundColor: string;
  elements: DreamLabElement[];
}

export type PixeliaShapeType = 'rect' | 'circle' | 'triangle' | 'diamond';
export type PixeliaStickerType = 
  | 'star-cluster' 
  | 'rocket' 
  | 'galaxy-planet' 
  | 'pixel-sparkle' 
  | 'neon-heart' 
  | 'constellation'
  | 'knight-helm'
  | 'crossed-swords'
  | 'castle-tower'
  | 'heraldic-lion'
  | 'royal-crown'
  | 'shield-crest';

export interface PixeliaElement {
  id: string;
  kind: 'shape' | 'text' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rotation?: number;
  text?: string;
  shapeType?: PixeliaShapeType;
  stickerType?: PixeliaStickerType;
}

export interface PixeliaDraft {
  backgroundColor: string;
  paletteId: string;
  elements: PixeliaElement[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'Nexus' | 'Dreamora' | 'Pixelia' | 'Loreland' | 'Logicore';
  xpReward: number;
  unlockedAt?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
  volume: number; // 0.0 to 1.0
}

export interface GameState {
  version: number;
  lastSaved: number;
  currentUniverse: UniverseId | 'nexus';
  selectedPortal: UniverseId | null;
  xp: number;
  claimedRewardIds: string[];
  hasSeenWelcome: boolean;
  settings: GameSettings;
  
  // Universe Hearts
  hearts: Record<UniverseId, boolean>;

  // Universe 1: Dreamora State
  dreamora: {
    solvedPuzzles: number[]; // [0, 1, 2]
    activePuzzleIndex: number;
    hasExportedArtifact: boolean;
    exportedCount: number;
    heartCollected: boolean;
    studioDraft: DreamLabDraft;
  };

  // Universe 2: Pixelia State
  pixelia: {
    checklistSatisfied: boolean;
    hasExportedArtifact: boolean;
    heartCollected: boolean;
    studioDraft: PixeliaDraft;
  };

  // Universe 3: Loreland State
  loreland: {
    fragmentsFound: number[];
    choices: Record<string, string>;
    storySaved: boolean;
    heartCollected: boolean;
    storyDraft: {
      title: string;
      beginning: string;
      middle: string;
      ending: string;
    };
  };

  // Universe 4: Logicore State
  logicore: {
    solvedPuzzles: number[];
    activePuzzleIndex: number;
    heartCollected: boolean;
  };

  // Unlocked achievements
  achievements: string[];
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'reward' | 'heart';
  title: string;
  description?: string;
  duration?: number;
}
