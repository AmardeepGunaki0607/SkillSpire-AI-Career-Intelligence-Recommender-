import React from 'react';
import { X, Sparkles, Video } from 'lucide-react';
import { AnalysisResult } from '../types';
import { VeoVideoStudio } from './VeoVideoStudio';

interface VeoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult;
  initialPrompt?: string;
}

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  initialPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white">
                  Veo 3 Video Studio
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generate concept videos from text with 16:9 & 9:16 aspect ratios
              </p>
            </div>
          </div>

          <button
            id="close-veo-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <VeoVideoStudio
            analysisResult={analysisResult}
            initialPrompt={initialPrompt}
            onClose={onClose}
          />
        </div>

      </div>
    </div>
  );
};
