import React, { useState, useEffect } from 'react';
import { useGame } from '../game/state/store';
import { STORY_CHOICES, generateSuggestedEnding } from '../game/logic/lorelandData';
import { Modal, Button } from '../ui/UIComponents';
import { 
  Download, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  Edit3, 
  Bookmark, 
  Compass,
  Save
} from 'lucide-react';

const MIN_LENGTHS = {
  title: 4,
  beginning: 25,
  middle: 25,
  ending: 25,
};

export const StoryStudio: React.FC = () => {
  const { 
    state, 
    activeModal, 
    closeModal, 
    setLoreChoice, 
    saveStoryDraft, 
    commitCompleteStory 
  } = useGame();

  const [title, setTitle] = useState(state.loreland.storyDraft.title || '');
  const [beginning, setBeginning] = useState(state.loreland.storyDraft.beginning || '');
  const [middle, setMiddle] = useState(state.loreland.storyDraft.middle || '');
  const [ending, setEnding] = useState(state.loreland.storyDraft.ending || '');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const choices = state.loreland.choices;
  const pathChoice = choices.pathChoice || 'luminary';
  const resolutionChoice = choices.resolutionChoice || 'awaken';

  // Autosave to store & localStorage on change
  useEffect(() => {
    saveStoryDraft({
      title,
      beginning,
      middle,
      ending,
    });
  }, [title, beginning, middle, ending, saveStoryDraft]);

  // Section validations
  const isTitleValid = title.trim().length >= MIN_LENGTHS.title;
  const isBeginningValid = beginning.trim().length >= MIN_LENGTHS.beginning;
  const isMiddleValid = middle.trim().length >= MIN_LENGTHS.middle;
  const isEndingValid = ending.trim().length >= MIN_LENGTHS.ending;
  const isStoryComplete = isTitleValid && isBeginningValid && isMiddleValid && isEndingValid;

  const handleApplySuggestedEnding = () => {
    const suggested = generateSuggestedEnding(choices);
    setEnding(suggested);
  };

  const handleCommitStory = () => {
    if (!isStoryComplete) {
      setSaveNotice('All four sections (Title, Beginning, Middle, Ending) must meet minimum length criteria before binding!');
      return;
    }

    commitCompleteStory();
    setSaveNotice('Chronicle bound to the sacred archives! The living runes have recorded your destiny.');
  };

  const handleExportTxt = () => {
    const suggestedEnding = generateSuggestedEnding(choices);
    const fullText = `=====================================================
    THE ROYAL BATTLE CHRONICLES OF THE CITADEL
=====================================================

TITLE: ${title || 'Untitled Soldier Chronicle'}
AUTHOR: Knight Scribe of the Guard
SANCTUARY: Chronicler's Keep (Citadel Archives)
DATE: ${new Date().toLocaleDateString()}

--- CANONICAL CHIVALRIC OATHS ---
* Battle Doctrine: ${pathChoice === 'shadow' ? 'The Scout’s Blade (Tactical reconnaissance & cunning vanguard)' : 'The Paladin’s Shield (Vanguard defense & golden honor)'}
* Kingdom Proclamation: ${resolutionChoice === 'seal' ? 'Raise the Unbreachable Bastion (Fortify the realm against all threats)' : 'Proclaim the Grand Citadel Alliance (Unite all garrisons in peace)'}

-----------------------------------------------------
I. THE MARCH & CALL TO ARMS (BEGINNING)
-----------------------------------------------------
${beginning}

-----------------------------------------------------
II. THE SIEGE & DEFENSE (MIDDLE)
-----------------------------------------------------
${middle}

-----------------------------------------------------
III. THE CORONATION & PROCLAMATION (ENDING)
-----------------------------------------------------
${ending}

=====================================================
Archived within the Royal Citadel Memorial Library
=====================================================`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${(title || 'citadel-soldier-chronicle').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={activeModal === 'storystudio'}
      onClose={closeModal}
      title="The Scribe's Scripting Hall: Soldier Chronicles"
      subtitle="Inscribe your chivalric saga and soldier oaths. Fulfill section lengths and bind the parchment to claim the Heart of Chronicles."
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Top Controls: Mode Switcher & Export */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950/70 border border-teal-500/30 rounded-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Readable Parchment Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-teal-400" />
              <span>Autosaved to localStorage</span>
            </span>
            <button
              onClick={handleExportTxt}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 font-medium cursor-pointer"
              title="Download story as .txt file"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export .txt</span>
            </button>
          </div>
        </div>

        {/* Story Choices Panel */}
        <div className="p-4 bg-slate-950/80 border border-teal-500/20 rounded-2xl space-y-3">
          <div className="text-xs uppercase font-mono font-bold text-teal-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Narrative Junction Choices (Alters Canonical Destiny)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {STORY_CHOICES.map((choice) => (
              <div key={choice.id} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-white">{choice.title}</div>
                <div className="text-[11px] text-slate-400">{choice.prompt}</div>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {choice.options.map((opt) => {
                    const isSelected = (choices[choice.id] || choice.options[0].id) === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setLoreChoice(choice.id, opt.id)}
                        className={`p-2 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-teal-950/80 border-teal-400 text-teal-200 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{opt.summary}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-400 italic">
              Your choices generate harmonious conclusion passages.
            </div>
            <button
              onClick={handleApplySuggestedEnding}
              className="text-xs text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
            >
              Insert Choice-Derived Ending
            </button>
          </div>
        </div>

        {/* Content View: Editor or Parchment Preview */}
        {viewMode === 'edit' ? (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Story Title</span>
                  {isTitleValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  {title.length}/{MIN_LENGTHS.title} chars min
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Living Runes of Eternity..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-serif focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Beginning */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Part I: The Beginning (Opening Context)</span>
                  {isBeginningValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  {beginning.length}/{MIN_LENGTHS.beginning} chars min
                </span>
              </div>
              <textarea
                rows={3}
                value={beginning}
                onChange={(e) => setBeginning(e.target.value)}
                placeholder="Beneath the starlit canopy of the emerald sanctuary, the journey began..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-serif leading-relaxed focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Middle */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Part II: The Middle (The Threshold & Trials)</span>
                  {isMiddleValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  {middle.length}/{MIN_LENGTHS.middle} chars min
                </span>
              </div>
              <textarea
                rows={3}
                value={middle}
                onChange={(e) => setMiddle(e.target.value)}
                placeholder="Deep within the stone temple, ancient glyphs challenged the traveler's convictions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-serif leading-relaxed focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Ending */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>Part III: The Ending (Resolution & Cosmic Legacy)</span>
                  {isEndingValid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  {ending.length}/{MIN_LENGTHS.ending} chars min
                </span>
              </div>
              <textarea
                rows={3}
                value={ending}
                onChange={(e) => setEnding(e.target.value)}
                placeholder="With sacred words inscribed, the realm resonated with newfound peace..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 font-serif leading-relaxed focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>
        ) : (
          /* Parchment Reader Preview Mode */
          <div className="p-6 bg-slate-950/90 border border-amber-500/20 rounded-2xl space-y-4 font-serif text-slate-200 shadow-xl max-h-[360px] overflow-y-auto">
            <div className="text-center pb-3 border-b border-amber-500/20">
              <h3 className="text-2xl font-bold text-amber-200 tracking-wide">
                {title || 'Untitled Chronicle'}
              </h3>
              <div className="text-xs text-amber-400/80 font-mono mt-1">
                Loreland Living Archive · Inscribed by Traveler
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-300 first-letter:float-left first-letter:mr-2">
                {beginning || 'The beginning of your tale awaits your pen.'}
              </p>
              <p>{middle || 'The trials and turning points remain unwritten.'}</p>
              <p>{ending || 'The resolution is yet to be sealed.'}</p>
            </div>
          </div>
        )}

        {/* Notification Alert */}
        {saveNotice && (
          <div className="p-3 bg-teal-950/50 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-850">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            {isStoryComplete ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All narrative parts complete & validated
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Fill all parts to unlock the Heart
              </span>
            )}
          </div>

          <Button
            variant="cyan"
            onClick={handleCommitStory}
            disabled={!isStoryComplete}
            className="w-full sm:w-auto gap-2 bg-teal-600 hover:bg-teal-500 border-teal-400/40 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save & Bind Chronicle</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
