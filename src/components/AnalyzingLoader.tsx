import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AnalyzingLoaderProps {
  onComplete?: () => void;
}

const STAGES = [
  'Understanding your skills & background',
  'Analyzing domain interests & career ambitions',
  'Matching against 16+ industry career roles',
  'Identifying multi-tier skill gaps & prerequisites',
  'Building personalized 5-phase learning roadmap',
  'Selecting tailored portfolio project recommendations',
  'Finalizing explainable AI career strategy'
];

export const AnalyzingLoader: React.FC<AnalyzingLoaderProps> = ({ onComplete }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex(prev => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStageIndex + 1) / STAGES.length) * 100));

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Central Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SkillSpire Intelligence Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Analyzing Your Career Trajectory...
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Running deterministic scoring matrix and LLM explainability synthesizers
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Diagnostic Progress</span>
            <span className="text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stage Checkpoints */}
        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-2.5 transition-colors ${
                  isCompleted ? 'text-emerald-700 font-medium' : isCurrent ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="truncate">{stage}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
