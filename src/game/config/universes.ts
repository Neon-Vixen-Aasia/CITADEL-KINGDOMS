/**
 * Universe definitions & configuration for Bubble Multiverse: Citadel of Kingdoms.
 * Medieval Castle & Soldier Fortress Theme.
 * Four Royal Strongholds: Valoria, Vanguardia, Chronicler's Keep, and Bastion Core.
 */

export type UniverseId = 'dreamora' | 'pixelia' | 'loreland' | 'logicore';

export interface UniverseConfig {
  id: UniverseId;
  name: string;
  castleName: string;
  domain: string;
  subtitle: string;
  primaryColor: string; // Hex for 3D shaders & lights
  accentColor: string;
  tailwindBorder: string;
  tailwindGlow: string;
  themeSummary: string;
  missionDescription: string;
  unlockCriteria: string;
  orbitAngle: number; // Angle around the central core in radians
  orbitRadius: number; // Distance from Nexus center
}

export const UNIVERSES: Record<UniverseId, UniverseConfig> = {
  dreamora: {
    id: 'dreamora',
    name: 'Valoria',
    castleName: 'Keep of the Suncrest Knights',
    domain: 'Knightly Valor & Heraldry',
    subtitle: 'The Royal Armory & Sunstone Ramparts',
    primaryColor: '#eab308', // Gold / Amber
    accentColor: '#ef4444',  // Crimson
    tailwindBorder: 'border-amber-400/50',
    tailwindGlow: 'shadow-[0_0_25px_rgba(234,179,8,0.4)]',
    themeSummary: 'A grand stone cliff-fortress where knights forge heraldic shields and royal armor beneath billowing crimson banners and fiery braziers.',
    missionDescription: 'Decipher the 3 Heraldic Crest riddles at the Grand Anvil Altar, forge a certified Knight Shield in the Armory Forge, and claim the Royal Heart of Valor.',
    unlockCriteria: 'Accessible to all sworn squires upon entering the Citadel.',
    orbitAngle: 0, // North
    orbitRadius: 9,
  },
  pixelia: {
    id: 'pixelia',
    name: 'Vanguardia',
    castleName: 'The High War Citadel',
    domain: 'Siege Tactics & Garrison Command',
    subtitle: 'Battlements of the Royal Vanguard',
    primaryColor: '#0ea5e9', // Royal Blue / Steel
    accentColor: '#f97316',  // Bronze Torchlight
    tailwindBorder: 'border-sky-400/50',
    tailwindGlow: 'shadow-[0_0_25px_rgba(14,165,233,0.4)]',
    themeSummary: 'A towering fortified stronghold of high watchtowers, crenellated battlements, and war strategy maps overlooking the royal frontier.',
    missionDescription: 'Draft a certified Royal Call-to-Arms Decree in the Commander Workshop (meeting title, 3+ heraldic stamps, and regiment colors) to uncover the Heart of Tactics.',
    unlockCriteria: 'Requires proof of Valor: complete all Valoria trials (3 crest riddles + forged shield + Heart of Valor).',
    orbitAngle: Math.PI / 2, // East
    orbitRadius: 9,
  },
  loreland: {
    id: 'loreland',
    name: 'Chronicler’s Keep',
    castleName: 'The Citadel Archives & Memorial',
    domain: 'Soldier Chronicles & Oaths',
    subtitle: 'Sanctuary of Ancient Royal Tomes',
    primaryColor: '#10b981', // Emerald / Forest Green
    accentColor: '#facc15',  // Imperial Gold
    tailwindBorder: 'border-emerald-400/50',
    tailwindGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
    themeSummary: 'An ancient stone cloister and library guarded by weathered knight statues, ancient soldier memorial oaks, and illuminated war chronicles.',
    missionDescription: 'Recover 4 scattered Battle Chronicle fragments across the sanctuary, swear your chivalric oath junction, and inscribe your saga into the Citadel Archives.',
    unlockCriteria: 'Requires proof of Valor: complete all Valoria trials (3 crest riddles + forged shield + Heart of Valor).',
    orbitAngle: Math.PI, // South
    orbitRadius: 9,
  },
  logicore: {
    id: 'logicore',
    name: 'Bastion Core',
    castleName: 'The Imperial Engineer Fortress',
    domain: 'Siegecraft & Fortification Logic',
    subtitle: 'Impenetrable Iron Portcullis Gates',
    primaryColor: '#8b5cf6', // Imperial Purple
    accentColor: '#cbd5e1',  // Fortified Steel
    tailwindBorder: 'border-purple-400/50',
    tailwindGlow: 'shadow-[0_0_25px_rgba(139,92,246,0.4)]',
    themeSummary: 'An imposing fortified mountain fortress of interlocking stone portcullises, heavy iron drawbridges, and calculated defensive counter-weights.',
    missionDescription: 'Resolve all 4 Siege Engineering logic protocols (marching sequence, ballista matrix, garrison deduction, master gate paradox) to conquer the Bastion Heart.',
    unlockCriteria: 'Requires conquered banners from either Vanguardia or Chronicler’s Keep.',
    orbitAngle: (3 * Math.PI) / 2, // West
    orbitRadius: 9,
  },
};
