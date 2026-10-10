/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './game/state/store';
import { NexusScene } from './scenes/NexusScene';
import { DreamoraScene } from './scenes/DreamoraScene';
import { PixeliaScene } from './scenes/PixeliaScene';
import { LorelandScene } from './scenes/LorelandScene';
import { LogicoreScene } from './scenes/LogicoreScene';
import { HUD } from './ui/HUD';
import { PortalInfoPanel } from './ui/PortalInfoPanel';
import { WelcomeModal } from './ui/WelcomeModal';
import { JournalModal } from './ui/JournalModal';
import { SettingsModal } from './ui/SettingsModal';
import { DreamoraPuzzleModal } from './ui/DreamoraPuzzleModal';
import { LogicorePuzzleModal } from './ui/LogicorePuzzleModal';
import { LoreFragmentModal } from './ui/LoreFragmentModal';
import { DreamLab } from './studios/DreamLab';
import { PixelStudio } from './studios/PixelStudio';
import { StoryStudio } from './studios/StoryStudio';
import { ToastContainer } from './ui/ToastContainer';

const MultiverseCanvas: React.FC = () => {
  const { state } = useGame();

  switch (state.currentUniverse) {
    case 'dreamora':
      return <DreamoraScene />;
    case 'pixelia':
      return <PixeliaScene />;
    case 'loreland':
      return <LorelandScene />;
    case 'logicore':
      return <LogicoreScene />;
    case 'nexus':
    default:
      return <NexusScene />;
  }
};

const MultiverseApp: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans text-stone-100 antialiased select-none">
      {/* 3D WebGL Canvas Layer */}
      <main className="absolute inset-0 z-0" aria-label="3D Multiverse Viewport">
        <MultiverseCanvas />
      </main>

      {/* Persistent Heads-Up Display */}
      <HUD />

      {/* Portal Selection & Inspection Panel */}
      <PortalInfoPanel />

      {/* Modals & 2D Creative Studios */}
      <WelcomeModal />
      <JournalModal />
      <SettingsModal />
      <DreamoraPuzzleModal />
      <LogicorePuzzleModal />
      <LoreFragmentModal />
      <DreamLab />
      <PixelStudio />
      <StoryStudio />

      {/* Non-intrusive Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MultiverseApp />
    </GameProvider>
  );
}
