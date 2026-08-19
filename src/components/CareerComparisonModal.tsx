import React, { useState } from 'react';
import { X, Check, ArrowRight, Zap, Award, Sparkles, Scale } from 'lucide-react';
import { AnalysisResult, CareerMatch } from '../types';
import { CAREER_KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { matchCareerProfile } from '../lib/recommendationEngine';

interface CareerComparisonModalProps {
  analysisResult: AnalysisResult;
  onClose: () => void;
  onSelectPrimaryCareer: (careerMatch: CareerMatch) => void;
}

export const CareerComparisonModal: React.FC<CareerComparisonModalProps> = ({
  analysisResult,
  onClose,
  onSelectPrimaryCareer
}) => {
  const profile = analysisResult.userProfile;
  
  // By default compare primary career + top 2 alternatives
  const allMatches = CAREER_KNOWLEDGE_BASE.map(c => matchCareerProfile(profile, c)).sort((a, b) => b.matchScore - a.matchScore);

  const [selectedIds, setSelectedIds] = useState<string[]>([
    analysisResult.primaryCareer.career.id,
    allMatches[1]?.career.id || 'data-analyst',
    allMatches[2]?.career.id || 'software-engineer'
  ]);

  const comparedMatches = selectedIds.map(id => {
    return allMatches.find(m => m.career.id === id) || analysisResult.primaryCareer;
  });

  const toggleCareerSlot = (index: number, newId: string) => {
    const next = [...selectedIds];
    next[index] = newId;
    setSelectedIds(next);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Side-by-Side Career Path Comparison</h2>
              <p className="text-xs text-slate-500">Compare match scores, prerequisites, timelines, and responsibilities</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Comparison Matrix */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Career Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedMatches.map((m, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  m.career.id === analysisResult.primaryCareer.career.id 
                    ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-100' 
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {idx === 0 ? 'Primary Active Goal' : `Alternative Option #${idx}`}
                  </span>
                  {m.career.id === analysisResult.primaryCareer.career.id && (
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                      Active Target
                    </span>
                  )}
                </div>

                <select
                  value={m.career.id}
                  onChange={(e) => toggleCareerSlot(idx, e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/20"
                >
                  {allMatches.map(opt => (
                    <option key={opt.career.id} value={opt.career.id}>
                      {opt.career.title} ({opt.matchScore}% Match)
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-black text-slate-900">{m.matchScore}%</div>
                    <span className="text-[11px] text-slate-500">Match Score</span>
                  </div>
                  {m.career.id !== analysisResult.primaryCareer.career.id && (
                    <button
                      onClick={() => {
                        onSelectPrimaryCareer(m);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 rounded-lg transition-colors shadow-2xs"
                    >
                      Make Primary Target
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
            
            {/* Category & Salary */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-50/50 p-3">
              <div className="font-bold text-slate-700 md:col-span-1">Category & Salary</div>
              <div className="grid grid-cols-3 md:col-span-3 gap-4 mt-1 md:mt-0 text-slate-600">
                {comparedMatches.map((m, i) => (
                  <div key={i}>
                    <p className="font-semibold text-slate-900">{m.career.category}</p>
                    <p className="text-[11px] text-emerald-700 font-bold">{m.career.avgSalaryRange}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Time & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-4 p-3">
              <div className="font-bold text-slate-700 md:col-span-1">Estimated Timeline & Difficulty</div>
              <div className="grid grid-cols-3 md:col-span-3 gap-4 mt-1 md:mt-0 text-slate-600">
                {comparedMatches.map((m, i) => (
                  <div key={i}>
                    <p className="font-bold text-slate-900">{m.estimatedMonths}</p>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                      m.difficulty === 'Moderate' ? 'bg-emerald-100 text-emerald-800' :
                      m.difficulty === 'Challenging' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {m.difficulty} Difficulty
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Strengths Overlap */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-50/50 p-3">
              <div className="font-bold text-slate-700 md:col-span-1">Your Existing Strengths</div>
              <div className="grid grid-cols-3 md:col-span-3 gap-4 mt-1 md:mt-0">
                {comparedMatches.map((m, i) => (
                  <div key={i} className="space-y-1">
                    {m.strengths.length > 0 ? (
                      m.strengths.map(s => (
                        <div key={s} className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <Check className="w-3 h-3 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No direct overlap</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-4 p-3">
              <div className="font-bold text-slate-700 md:col-span-1">Primary Skill Gaps to Close</div>
              <div className="grid grid-cols-3 md:col-span-3 gap-4 mt-1 md:mt-0">
                {comparedMatches.map((m, i) => (
                  <div key={i} className="space-y-1">
                    {m.skillGaps.slice(0, 4).map(g => (
                      <div key={g.skillName} className="text-[11px]">
                        <span className="font-medium text-slate-800">{g.skillName}</span>
                        <span className={`ml-1 text-[9px] font-bold px-1 rounded ${
                          g.gapSeverity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                          g.gapSeverity === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {g.gapSeverity}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-50/50 p-3">
              <div className="font-bold text-slate-700 md:col-span-1">Typical Daily Work</div>
              <div className="grid grid-cols-3 md:col-span-3 gap-4 mt-1 md:mt-0 text-[11px] text-slate-600">
                {comparedMatches.map((m, i) => (
                  <p key={i} className="line-clamp-3 leading-relaxed">
                    {m.career.typicalDayDescription}
                  </p>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            SkillSpire AI dynamically updates all roadmaps & projects when you change targets.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
