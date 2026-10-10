import React, { useState } from 'react';
import { useGame } from '../game/state/store';
import { LOGICORE_PUZZLES } from '../game/logic/logicorePuzzles';
import { Modal, Button, Card } from './UIComponents';
import { 
  Cpu, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Layers
} from 'lucide-react';

export const LogicorePuzzleModal: React.FC = () => {
  const { state, activeModal, closeModal, solveLogicorePuzzle } = useGame();

  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    // Default to the first unsolved puzzle
    const solved = state.logicore.solvedPuzzles;
    for (let i = 0; i < 4; i++) {
      if (!solved.includes(i)) return i;
    }
    return 0;
  });

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);

  const puzzle = LOGICORE_PUZZLES[selectedIdx];
  const isAlreadySolved = state.logicore.solvedPuzzles.includes(selectedIdx);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setFeedback(null);
  };

  const handleVerify = () => {
    if (!selectedOption) return;

    if (selectedOption === puzzle.correctAnswer) {
      solveLogicorePuzzle(selectedIdx);
      setFeedback({
        isCorrect: true,
        message: `✦ Siege Defense Calibrated! ${puzzle.explanation}`,
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: 'The iron portcullis remains locked. The defensive parity or troop count calculation does not balance the gate counterweights. Review the hints and retry.',
      });
    }
  };

  const handlePrev = () => {
    if (selectedIdx > 0) {
      setSelectedIdx((prev) => prev - 1);
      setSelectedOption(null);
      setFeedback(null);
      setRevealedHints(0);
    }
  };

  const handleNext = () => {
    if (selectedIdx < 3) {
      setSelectedIdx((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      setRevealedHints(0);
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'logicore-puzzles'}
      onClose={closeModal}
      title="The Siegecraft Protocols of Bastion Core"
      subtitle="Decipher the 4 escalating fortification and soldier deductions to lower the Grand Portcullis Gates"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Protocol Selector Tabs */}
        <div className="flex items-center justify-between gap-1.5 p-1.5 bg-slate-950/70 border border-indigo-500/30 rounded-xl">
          {LOGICORE_PUZZLES.map((p, idx) => {
            const solved = state.logicore.solvedPuzzles.includes(idx);
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  setSelectedOption(null);
                  setFeedback(null);
                  setRevealedHints(0);
                }}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {solved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                ) : (
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">Protocol {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Puzzle Card */}
        <Card className="border-indigo-500/30 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-2">
            <span>{puzzle.tier}</span>
            {isAlreadySolved && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {puzzle.title}
          </h3>
          <p className="text-xs text-slate-400 mb-3 italic">
            "{puzzle.lore}"
          </p>
          <div className="text-sm text-slate-200 font-medium p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl leading-relaxed whitespace-pre-line font-mono">
            {puzzle.prompt}
          </div>
        </Card>

        {/* Options Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {puzzle.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isAnswerAndSolved = isAlreadySolved && opt === puzzle.correctAnswer;

            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all duration-150 cursor-pointer min-h-[44px] flex items-center justify-between focus-visible:ring-2 focus-visible:ring-indigo-400 focus:outline-none ${
                  isAnswerAndSolved
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : isSelected
                    ? 'bg-indigo-950/60 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{opt}</span>
                {isAnswerAndSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isSelected && !isAnswerAndSolved && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 animate-in fade-in duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm leading-relaxed">
              {feedback.message}
            </div>
          </div>
        )}

        {/* Hints Section */}
        <div className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Quantum Deduction Clues ({revealedHints}/2)</span>
            </div>
            {revealedHints < 2 && (
              <button
                onClick={() => setRevealedHints((h) => Math.min(2, h + 1))}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Reveal Clue {revealedHints + 1}
              </button>
            )}
          </div>

          {revealedHints >= 1 && (
            <div className="text-xs text-amber-300/90 bg-amber-950/20 border border-amber-500/20 rounded-lg p-2 leading-relaxed">
              <strong>Clue 1:</strong> {puzzle.hints[0]}
            </div>
          )}
          {revealedHints >= 2 && (
            <div className="text-xs text-amber-300/90 bg-amber-950/20 border border-amber-500/20 rounded-lg p-2 leading-relaxed">
              <strong>Clue 2:</strong> {puzzle.hints[1]}
            </div>
          )}
        </div>

        {/* Navigation & Execution Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedIdx === 0}
              onClick={handlePrev}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={selectedIdx === 3}
              onClick={handleNext}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Button
            variant="primary"
            disabled={!selectedOption || (isAlreadySolved && feedback?.isCorrect)}
            onClick={handleVerify}
            className="bg-indigo-600 hover:bg-indigo-500 border-indigo-400/40"
          >
            {isAlreadySolved ? 'Re-verify Protocol' : 'Decipher Liminal Code'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
