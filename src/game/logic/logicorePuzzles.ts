/**
 * Bastion Core Siegecraft & Fortress Engineering Puzzles.
 * Medieval Castle & Soldier Fortress theme with identical verified solutions.
 */

export interface LogicorePuzzleDefinition {
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

export const LOGICORE_PUZZLES: LogicorePuzzleDefinition[] = [
  {
    id: 'logicore_puzzle_1',
    title: 'Garrison Battalion Rally Sequence',
    tier: 'Siege Protocol I · Troop Formations',
    lore: 'The Citadel garrison assembles reinforcements across defensive rings: 4 guards, 9 sentries, 19 infantry, 39 vanguard soldiers.',
    prompt: 'Each defensive reinforcement line doubles the previous battalion and adds 1 scout: (n × 2) + 1. How many soldiers march in the fifth reinforcement line?',
    options: ['79', '78', '81', '75'],
    correctAnswer: '79',
    explanation: 'The battalion march follows (n × 2) + 1: (4×2)+1=9; (9×2)+1=19; (19×2)+1=39; and (39×2)+1 = 78 + 1 = 79 soldiers.',
    hints: [
      'Notice the formation rule: multiply the preceding troop count by 2, then add 1.',
      'Multiply 39 by 2 to reach 78, then add 1 to complete the royal garrison line.'
    ]
  },
  {
    id: 'logicore_puzzle_2',
    title: 'The Ballista Rampart Fortification',
    tier: 'Siege Protocol II · Bastion Architecture',
    lore: 'Four stone barbicans defend the castle gatehouse, each marked by fortified polygon walls and iron ballista bolt rivets.',
    prompt: 'Gate 1: Triangle (3 walls) + 1 Iron Rivet = 4 fortifications\nGate 2: Square (4 walls) + 2 Iron Rivets = 6 fortifications\nGate 3: Pentagon (5 walls) + 3 Iron Rivets = 8 fortifications\nGate 4: ?\nFollowing this strict siege construction (+1 wall, +1 rivet, total +2), which crest seals Gate 4?',
    options: [
      'Hexagon with 4 Eye Dots',
      'Heptagon with 3 Eye Dots',
      'Hexagon with 2 Eye Dots',
      'Octagon with 1 Eye Dot'
    ],
    correctAnswer: 'Hexagon with 4 Eye Dots',
    explanation: 'A Hexagonal fortress wall has 6 sides, and the ballista rivets advance to 4. 6 walls + 4 rivets = 10 defensive fortifications (4 → 6 → 8 → 10).',
    hints: [
      'Track the stone wall polygon progression: Triangle (3) → Square (4) → Pentagon (5) → ?',
      'The ballista rivet count increments sequentially: 1 → 2 → 3 → 4.'
    ]
  },
  {
    id: 'logicore_puzzle_3',
    title: 'The Four Fortress Captains',
    tier: 'Siege Protocol III · Officer Deduction',
    lore: 'Four castle captains guard the keys to the kingdom’s armory gates: Cyan, Pink, Gold, and Violet.',
    prompt: '1. Captain Echo (The Royal Watcher) holds the Gold key.\n2. Captain Luna (The High Archer) holds the Pink key.\n3. Captain Sola (The Sentry Shieldbearer) cannot hold the Violet key.\n4. Captain Nimbus (The Vanguard Knight) holds the remaining key.\nWhich key does Captain Nimbus hold?',
    options: ['Violet', 'Cyan', 'Pink', 'Gold'],
    correctAnswer: 'Violet',
    explanation: 'Gold is held by Echo, and Pink is held by Luna. Between Cyan and Violet, Sola is barred from Violet, so Sola must carry Cyan. Therefore, Vanguard Knight Nimbus holds the Violet key.',
    hints: [
      'Eliminate the Gold key (Echo) and Pink key (Luna) first.',
      'Between Cyan and Violet, Sola cannot take the Violet key. Who must hold Violet?'
    ]
  },
  {
    id: 'logicore_puzzle_4',
    title: 'The Master Portcullis Drawbridge Code',
    tier: 'Siege Protocol IV · Grand Engineer Parity',
    lore: 'The grand iron portcullis of the citadel demands calibrating the counterweights before lowering the drawbridge.',
    prompt: 'Step 1: Compute Base Iron Load B = (7 × 8) − 16.\nStep 2: Apply the Castle Gate Parity Shift: if B is even, divide B by 2; if B is odd, add 5.\nStep 3: Lower the Golden Anchor (+15) into the result from Step 2.\nWhat is the final Master Portcullis Key?',
    options: ['35', '42', '28', '50'],
    correctAnswer: '35',
    explanation: 'Step 1: 7 × 8 = 56; 56 − 16 = 40. Step 2: 40 is even, so 40 / 2 = 20. Step 3: 20 + 15 = 35. The drawbridge lowers!',
    hints: [
      'First compute (7 × 8) − 16 to find the base load B = 40.',
      'Since 40 is an even integer, divide it by 2 to reach 20, then add 15.'
    ]
  }
];
