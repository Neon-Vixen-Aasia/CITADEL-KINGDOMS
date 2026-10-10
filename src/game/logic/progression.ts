import { UniverseId, UNIVERSES } from '../config/universes';
import { GameState, AchievementBadge } from '../state/types';

/**
 * Validates universe unlock requirements from actual game progress data in the Citadel Kingdom.
 */
export function isUniverseUnlocked(universeId: UniverseId, state: GameState): boolean {
  if (universeId === 'dreamora') {
    return true; // Valoria is the royal genesis fortress, always open
  }

  // Valoria completion check
  const dreamoraCompleted =
    state.dreamora.solvedPuzzles.length >= 3 &&
    state.dreamora.hasExportedArtifact &&
    state.hearts.dreamora;

  if (universeId === 'pixelia' || universeId === 'loreland') {
    return dreamoraCompleted;
  }

  if (universeId === 'logicore') {
    const pixeliaCompleted =
      state.pixelia.checklistSatisfied &&
      state.pixelia.hasExportedArtifact &&
      state.hearts.pixelia;

    const lorelandCompleted =
      state.loreland.fragmentsFound.length >= 4 &&
      state.loreland.storySaved &&
      state.hearts.loreland;

    return pixeliaCompleted || lorelandCompleted;
  }

  return false;
}

export function getUnlockStatusDescription(universeId: UniverseId, state: GameState): string {
  if (isUniverseUnlocked(universeId, state)) {
    return 'Garrison Gate Unlocked & Manned';
  }

  if (universeId === 'pixelia' || universeId === 'loreland') {
    const pCount = state.dreamora.solvedPuzzles.length;
    const art = state.dreamora.hasExportedArtifact;
    const heart = state.hearts.dreamora;
    const missing: string[] = [];
    if (pCount < 3) missing.push(`Armory riddles (${pCount}/3)`);
    if (!art) missing.push('Forge Knight Shield');
    if (!heart) missing.push('Claim Heart of Valor');
    return `Requires Valoria completion: ${missing.join(', ')}`;
  }

  if (universeId === 'logicore') {
    return 'Requires conquered banners from either Vanguardia or Chronicler’s Keep (all trials & Heart).';
  }

  return UNIVERSES[universeId].unlockCriteria;
}

export const KNIGHT_RANKS = [
  'Squire of the Citadel',
  'Man-at-Arms',
  'Knight Sentry',
  'Knight Corporal',
  'Knight Captain',
  'Knight Commander',
  'High Paladin',
  'Grand Marshal of the Realm',
];

export function calculateLevel(xp: number): {
  level: number;
  rankTitle: string;
  currentLevelBaseXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  // 100 XP per level
  const level = Math.floor(xp / 100) + 1;
  const currentLevelBaseXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const levelXp = xp - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((levelXp / 100) * 100)));
  const rankIndex = Math.min(KNIGHT_RANKS.length - 1, level - 1);
  const rankTitle = KNIGHT_RANKS[rankIndex];

  return {
    level,
    rankTitle,
    currentLevelBaseXp,
    nextLevelXp,
    progressPercent,
  };
}

export const ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'nexus_awakening',
    title: 'Citadel Oath Sworn',
    description: 'Began your vigil at the sovereign Sunstone Core of the Grand Citadel.',
    category: 'Nexus',
    xpReward: 25,
  },
  {
    id: 'dreamora_first_puzzle',
    title: 'Armory Apprentice',
    description: 'Deciphered the first knightly crest riddle in Valoria.',
    category: 'Dreamora',
    xpReward: 50,
  },
  {
    id: 'dreamora_all_puzzles',
    title: 'Master of the Anvil',
    description: 'Solved all three heraldic armor riddles, empowering the Valoria forge altar.',
    category: 'Dreamora',
    xpReward: 100,
  },
  {
    id: 'dreamora_first_artwork',
    title: 'Knight Heraldic Artisan',
    description: 'Forged and exported an authentic Knight’s Shield in the Armory Forge.',
    category: 'Dreamora',
    xpReward: 75,
  },
  {
    id: 'dreamora_heart',
    title: 'Heart of Valor',
    description: 'Claimed the incandescent golden Heart of Valor in Valoria.',
    category: 'Dreamora',
    xpReward: 150,
  },
  {
    id: 'pixelia_mission_complete',
    title: 'Vanguard War Tactician',
    description: 'Satisfied all royal decree criteria for the Castle Garrison Call-to-Arms.',
    category: 'Pixelia',
    xpReward: 75,
  },
  {
    id: 'pixelia_heart',
    title: 'Heart of Tactics',
    description: 'Drafted the Call-to-Arms decree and uncovered Vanguardia’s Heart.',
    category: 'Pixelia',
    xpReward: 150,
  },
  {
    id: 'loreland_fragments_found',
    title: 'Keeper of War Chronicles',
    description: 'Discovered all 4 ancient soldier battle fragments in Chronicler’s Keep.',
    category: 'Loreland',
    xpReward: 75,
  },
  {
    id: 'loreland_story_saved',
    title: 'Grand Scribe of the Guard',
    description: 'Authored and bound a complete three-part soldier chronicle in StoryStudio.',
    category: 'Loreland',
    xpReward: 100,
  },
  {
    id: 'loreland_heart',
    title: 'Heart of Chronicles',
    description: 'Bound your knight saga and claimed the Heart of Chronicles.',
    category: 'Loreland',
    xpReward: 150,
  },
  {
    id: 'logicore_first_puzzle',
    title: 'Bastion Engineer Initiate',
    description: 'Deciphered the first troop march protocol in the Bastion Fortress.',
    category: 'Logicore',
    xpReward: 50,
  },
  {
    id: 'logicore_all_puzzles',
    title: 'Grand Siege Architect',
    description: 'Resolved all four escalating fortress siegecraft protocols in Bastion Core.',
    category: 'Logicore',
    xpReward: 125,
  },
  {
    id: 'logicore_heart',
    title: 'Heart of Command',
    description: 'Resolved the 4 siege deductions and claimed the Bastion Heart of Command.',
    category: 'Logicore',
    xpReward: 200,
  },
];
