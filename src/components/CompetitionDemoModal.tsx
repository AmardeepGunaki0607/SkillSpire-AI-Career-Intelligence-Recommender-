import React from 'react';
import { Video, X, Sparkles, Download, CheckCircle, Share2, Presentation, Flame, Play, Monitor } from 'lucide-react';
import { CompetitionDemoVideoPlayer } from './CompetitionDemoVideoPlayer';

interface CompetitionDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'tutorial' | 'pitch';
}

export const CompetitionDemoModal: React.FC<CompetitionDemoModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'tutorial'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 px-6 py-4 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  SkillSpire AI — Website Instruction & Tutorial Video
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[10px] tracking-wider uppercase">
                  User Guide
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Step-by-step walkthrough of the SkillSpire AI website interface, skill gap radar, 5-phase dynamic roadmap, and code classroom.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: The Tutorial & Demo Player */}
        <div className="p-4 sm:p-6 space-y-5 bg-slate-950/60">
          <CompetitionDemoVideoPlayer onClose={onClose} autoPlay={true} initialMode={initialMode} />

          {/* Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold font-mono">
                <Monitor className="w-3.5 h-3.5" />
                <span>STEP-BY-STEP</span>
              </div>
              <h4 className="text-xs font-bold text-white">Exact Website Interface</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Simulates natural clicks, tab navigation, roadmap milestone checkoffs, and live code sandbox execution.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>1-CLICK EXPORT</span>
              </div>
              <h4 className="text-xs font-bold text-white">1080p MP4 Video</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Downloadable as <code>SkillSpire_Website_Tutorial_Demo.mp4</code> for offline presentations, user training, and hackathons.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold font-mono">
                <Presentation className="w-3.5 h-3.5" />
                <span>AUDIO & CC</span>
              </div>
              <h4 className="text-xs font-bold text-white">Voiceover Narration</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Synchronized tutorial speech synthesis, closed captions, ambient background audio, and jump-to-step controls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
