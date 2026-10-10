import React, { useState } from 'react';
import { useGame } from '../game/state/store';
import { Modal, Button } from './UIComponents';
import { Shield, Crown, Heart, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { activeModal, dismissWelcomeModal } = useGame();
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      title: 'Welcome to the Citadel of Kingdoms',
      subtitle: 'A fortress nexus of four sovereign realms',
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            You have arrived at the Grand Citadel Keep, an ancient stone fortress where four
            sovereign kingdoms stand vigil around the Sovereign Sunstone Core.
          </p>
          <p>
            Four fortified strongholds await your trial: <strong className="text-amber-400">Valoria (Keep of the Suncrest Knights)</strong>, <strong className="text-sky-400">Vanguardia (The High War Citadel)</strong>, <strong className="text-emerald-400">Chronicler’s Keep (Soldier Memorial Sanctuary)</strong>, and <strong className="text-purple-400">Bastion Core (The Imperial Engineer Fortress)</strong>.
          </p>
        </div>
      ),
    },
    {
      title: 'The Knight\'s Chivalric Progression',
      subtitle: 'Explore → Train → Forge → Chronicle → Conquer',
      icon: <Shield className="w-8 h-8 text-amber-500" />,
      content: (
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            Your journey begins in <strong className="text-amber-400">Valoria</strong>, the golden armory fortress accessible to all sworn squires.
          </p>
          <p>
            Inside each kingdom, decipher tactical riddles, forge authentic military artifacts in dedicated workshops (Knight Shields, Call-to-Arms Decrees, Soldier Chronicles), and claim the sacred <strong className="text-amber-300">Citadel Hearts</strong>.
          </p>
          <p>
            Triumphs grant Knightly XP, promote you from Squire to Grand Marshal of the Realm, and break the siege gates to higher strongholds.
          </p>
        </div>
      ),
    },
    {
      title: 'Fortress Navigation & Garrison Commands',
      subtitle: '3D orbit & tactile gatehouse interactions',
      icon: <Heart className="w-8 h-8 text-amber-400 fill-amber-400" />,
      content: (
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            • <strong>Look Around:</strong> Click and drag or swipe to survey the fortress ramparts and watchtowers.
          </p>
          <p>
            • <strong>Garrison Gatehouses:</strong> Click any glowing fortress portal to inspect its siege mission and enter.
          </p>
          <p>
            • <strong>Reset Camera:</strong> Tap the rewind button in the top bar anytime to center your viewpoint on the keep.
          </p>
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <Modal
      isOpen={activeModal === 'welcome'}
      onClose={dismissWelcomeModal}
      title={current.title}
      subtitle={current.subtitle}
      maxWidth="md"
    >
      <div className="flex flex-col gap-6 py-2">
        <div className="flex items-center justify-center p-4 bg-stone-950/80 rounded-2xl border border-amber-500/30 shadow-inner">
          {current.icon}
        </div>

        {current.content}

        {/* Step indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-6 bg-amber-400' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="text-stone-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold border-amber-400"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={dismissWelcomeModal}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold border-amber-300"
              >
                <Check className="w-4 h-4 mr-1" />
                Swear the Citadel Oath
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
