export interface StoryFragment {
  id: string;
  index: number;
  title: string;
  sourceObjectName: string;
  locationHint: string;
  text: string;
  loreSnippet: string;
}

export const LORE_FRAGMENTS: StoryFragment[] = [
  {
    id: 'fragment_1',
    index: 0,
    title: 'The Tome of the First Siege',
    sourceObjectName: 'Illuminated War Tome',
    locationHint: 'Resting on the stone lectern of the garrison library',
    loreSnippet: 'Before castles had names, soldiers carved honor into stone.',
    text: 'In the founding age of the Citadel Kingdoms, the first royal soldiers raised shields together against the dark tide. When the walls stood unbreached through the winter siege, the sovereign proclaimed that valor and loyalty would forever anchor the four strongholds of the realm.',
  },
  {
    id: 'fragment_2',
    index: 1,
    title: 'The Bastion Oath Monolith',
    sourceObjectName: 'Knight Oath Monolith',
    locationHint: 'Carved into the moss-covered fortress spire',
    loreSnippet: 'An oath sworn on steel is an oath bound for eternity.',
    text: 'Every soldier who took the royal oath pressed their sword hilt into the emerald rune stone. The citadel remembers every shield held in defense of the weak and every bridge defended at the cost of blood.',
  },
  {
    id: 'fragment_3',
    index: 2,
    title: 'The Wellspring of the Fallen',
    sourceObjectName: 'Memorial Wellspring',
    locationHint: 'Reflecting in the stone sanctuary basin',
    loreSnippet: 'Clear spring waters blessed by royal chaplains.',
    text: 'The sanctuary fountain does not mirror armor or weapons, but the spirit of the warrior. Drinkers of its cool depths find renewed strength for the coming trials and clear vision before the battle horn sounds.',
  },
  {
    id: 'fragment_4',
    index: 3,
    title: 'The Grand Oak of the Knights',
    sourceObjectName: 'Memorial Oak Tree',
    locationHint: 'Beneath the ancient branches of the castle courtyard tree',
    loreSnippet: 'Its leaves whisper the names of ancient marshals.',
    text: 'The mighty courtyard oak was planted with acorns gathered after the Great Unification. As long as loyal soldiers stand vigil on the castle ramparts, the branches will stay green and the kingdom will never fall.',
  },
];

export interface StoryChoiceOption {
  id: string;
  label: string;
  summary: string;
}

export interface StoryChoiceDef {
  id: string;
  title: string;
  prompt: string;
  options: [StoryChoiceOption, StoryChoiceOption];
}

export const STORY_CHOICES: StoryChoiceDef[] = [
  {
    id: 'pathChoice',
    title: 'Knightly Oath I: Battle Doctrine',
    prompt: 'Which code of chivalry guided the champion soldier through the siege?',
    options: [
      {
        id: 'luminary',
        label: 'The Paladin’s Shield (Vanguard defense & golden honor)',
        summary: 'Holding the battlements with shining steel and unwavering discipline.',
      },
      {
        id: 'shadow',
        label: 'The Scout’s Blade (Tactical reconnaissance & cunning vanguard)',
        summary: 'Moving silently through the forest paths to outmaneuver the enemy lines.',
      },
    ],
  },
  {
    id: 'resolutionChoice',
    title: 'Knightly Oath II: The Kingdom’s Fate',
    prompt: 'What proclamation did the champion deliver from the High Castle Balcony?',
    options: [
      {
        id: 'awaken',
        label: 'Proclaim the Grand Citadel Alliance (Unite all garrisons in peace)',
        summary: 'All four royal kingdoms lower their drawbridges in brotherly union.',
      },
      {
        id: 'seal',
        label: 'Raise the Unbreachable Bastion (Fortify the realm against all threats)',
        summary: 'The battlements are fortified forever, standing as an unyielding bulwark.',
      },
    ],
  },
];

export function generateSuggestedEnding(choices: Record<string, string>): string {
  const isLuminary = choices.pathChoice !== 'shadow';
  const isAwaken = choices.resolutionChoice !== 'seal';

  if (isLuminary && isAwaken) {
    return 'Raising the royal standard in the golden midday sun, the champion united all garrisons. Banners from Valoria, Vanguardia, Chronicler’s Keep, and Bastion Core billowed together, sealing eternal peace across the kingdom.';
  } else if (isLuminary && !isAwaken) {
    return 'With golden broadsword held high upon the parapet, the champion fortified the citadel gates. The stone walls stood proud and unyielding, an eternal sanctuary for all loyal soldiers and subjects.';
  } else if (!isLuminary && isAwaken) {
    return 'Through masterful reconnaissance and quiet diplomacy, the vanguard champion opened the fortress gates to former rivals, transforming ancient siege battlefields into flourishing tournament grounds.';
  } else {
    return 'Vigilant in the castle shadows, the champion reinforced the hidden watchtowers and iron portcullises. The fortress remained ever-ready, a quiet shield guarding the kingdom through the centuries.';
  }
}
