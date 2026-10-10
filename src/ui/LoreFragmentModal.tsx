import React from 'react';
import { useGame } from '../game/state/store';
import { LORE_FRAGMENTS } from '../game/logic/lorelandData';
import { Modal, Button } from './UIComponents';
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, PenTool, Sparkles } from 'lucide-react';

export const LoreFragmentModal: React.FC = () => {
  const { 
    state, 
    activeModal, 
    closeModal, 
    activeLoreFragmentIndex, 
    inspectLoreFragment, 
    openModal 
  } = useGame();

  if (activeLoreFragmentIndex === null) return null;

  const fragment = LORE_FRAGMENTS[activeLoreFragmentIndex];
  const isFound = state.loreland.fragmentsFound.includes(activeLoreFragmentIndex);

  const handlePrev = () => {
    if (activeLoreFragmentIndex > 0) {
      inspectLoreFragment(activeLoreFragmentIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeLoreFragmentIndex < LORE_FRAGMENTS.length - 1) {
      inspectLoreFragment(activeLoreFragmentIndex + 1);
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'lore-fragment'}
      onClose={closeModal}
      title={fragment.title}
      subtitle={`Chronicle Fragment #${fragment.index + 1} of 4 · Discovered at ${fragment.sourceObjectName}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Fragment Navigation Header */}
        <div className="flex items-center justify-between p-2 bg-slate-950/70 border border-teal-500/30 rounded-xl">
          <div className="flex items-center gap-2">
            {LORE_FRAGMENTS.map((f) => {
              const discovered = state.loreland.fragmentsFound.includes(f.index);
              const isSelected = activeLoreFragmentIndex === f.index;
              return (
                <button
                  key={f.id}
                  onClick={() => inspectLoreFragment(f.index)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                      : discovered
                      ? 'bg-teal-950/70 border border-teal-500/40 text-teal-300 hover:bg-teal-900'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                  title={`${f.title} (${discovered ? 'Discovered' : 'Undiscovered'})`}
                >
                  {f.index + 1}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-teal-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {state.loreland.fragmentsFound.length}/4 Discovered
            </span>
          </div>
        </div>

        {/* Fragment Excerpt Quote */}
        <div className="p-3.5 bg-teal-950/30 border border-teal-500/20 rounded-xl text-xs text-teal-300 italic flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>"{fragment.loreSnippet}"</span>
        </div>

        {/* Narrative Inscription Text */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-200 text-sm sm:text-base leading-relaxed font-serif shadow-inner">
          <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-teal-400 first-letter:float-left first-letter:mr-2">
            {fragment.text}
          </p>
        </div>

        {/* Location Hint */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Sanctuary Source: {fragment.locationHint}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-850">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={activeLoreFragmentIndex === 0}
              onClick={handlePrev}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={activeLoreFragmentIndex === LORE_FRAGMENTS.length - 1}
              onClick={handleNext}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Button
            variant="cyan"
            size="sm"
            onClick={() => {
              closeModal();
              openModal('storystudio');
            }}
            className="gap-2 bg-teal-600 hover:bg-teal-500 border-teal-400/40"
          >
            <PenTool className="w-4 h-4" />
            <span>Inscribe in Scribe Hall</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
