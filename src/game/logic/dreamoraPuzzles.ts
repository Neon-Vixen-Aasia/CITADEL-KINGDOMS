/**
 * Valoria Knight & Soldier Armory Riddles.
 * Medieval Castle & Knight Heraldry theme with identical verified solutions.
 */

export interface PuzzleDefinition {
  id: string;
  title: string;
  tier: string;
  lore: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hints: [string, string];
}

export const DREAMORA_PUZZLES: PuzzleDefinition[] = [
  {
    id: 'dreamora_puzzle_1',
    title: 'Heraldic Enamel Convergence',
    tier: 'Rank I · Armory Apprentice',
    lore: 'The Master Armorer tempers knightly crests in the royal forge. Two sacred heraldic pigments must blend atop the knight’s war shield.',
    prompt: 'The heraldic triad tempers Rose Red and Royal Celeste Blue battle enamels. Which imperial color forms when both converge under the forge’s white flame?',
    options: ['Magenta', 'Emerald', 'Amber', 'Obsidian'],
    correctAnswer: 'Magenta',
    explanation: 'When Rose Red and Celeste Blue heraldic pigments fuse in optics, they temper vibrant imperial Magenta, the mark of sovereign honor.',
    hints: [
      'Recall which regal hue arises between scarlet red and royal blue.',
      'It is the vivid purplish-crimson enamel worn by the high knight marshals.'
    ]
  },
  {
    id: 'dreamora_puzzle_2',
    title: 'The Sentry March Cadence',
    tier: 'Rank II · Fortress Watchman',
    lore: 'The battlements are garrisoned by sentry horn signals sounding at marching intervals: 3 paces, 6 paces, 12 paces.',
    prompt: 'The fortress march doubles each watch (3 → 6 → 12), but the fourth defensive line subtracts 4 paces for the castle moat: (12 × 2) − 4 = ?',
    options: ['20', '18', '24', '16'],
    correctAnswer: '20',
    explanation: 'Doubling the 12-pace march yields 24, and subtracting the 4-pace moat offset leaves exactly 20 paces to secure the gate.',
    hints: [
      'First double the garrison march: 12 multiplied by 2 = 24.',
      'Now subtract the 4 paces for the defensive moat line.'
    ]
  },
  {
    id: 'dreamora_puzzle_3',
    title: 'The Crown Sigil Alignment',
    tier: 'Rank III · Knight Champion',
    lore: 'The sovereign altar stone bears the concentric battle shields of the kingdom’s three founding soldier orders.',
    prompt: 'Outer Rampart: 3 Battle Spikes (Cyan) | Middle Rampart: 4 Battle Spikes (Violet) | Inner Keep: ? Battle Spikes (Rose). To seal the fortress garrison, which configuration crowns the altar?',
    options: ['5 Petals, Rose', '6 Petals, Amber', '2 Petals, Teal', '5 Petals, Emerald'],
    correctAnswer: '5 Petals, Rose',
    explanation: 'The royal spikes progress in strict soldier rank (3 → 4 → 5), aligned with the sovereign Rose crimson enamel.',
    hints: [
      'Notice the defensive spike count progression: 3 spikes, then 4 spikes...',
      'The sequence increments by 1, and the inner keep requires the Rose crimson emblem.'
    ]
  }
];
