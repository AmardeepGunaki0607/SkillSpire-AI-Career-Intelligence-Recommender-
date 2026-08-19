import React, { useState } from 'react';
import { 
  TrendingUp, 
  X, 
  Briefcase, 
  DollarSign, 
  Globe, 
  Sparkles, 
  Building2, 
  Flame, 
  ExternalLink, 
  Layers, 
  Search, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';
import { JobMarketInsight } from '../types';
import { getJobMarketInsightForCareer } from '../data/jobMarketData';

interface JobMarketRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerTitle: string;
}

export const JobMarketRadarModal: React.FC<JobMarketRadarModalProps> = ({
  isOpen,
  onClose,
  careerTitle
}) => {
  if (!isOpen) return null;

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const insight = getJobMarketInsightForCareer(careerTitle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                  REAL-TIME MARKET INTELLIGENCE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {insight.yoyGrowthRate}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Job Market Radar & Compensation Insights
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Key Metrics Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Track Profile
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {careerTitle}
                </h4>
                <p className="text-xs text-slate-300">
                  Global demand is surging with <strong className="text-emerald-400">{insight.activeOpeningsEstimate}</strong> across tech hubs.
                </p>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 text-xs font-bold shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === 'INR' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  INR (₹ Lakhs)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === 'USD' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Salary Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Entry Level (0-2 Yrs)</span>
                <span className="text-base font-black text-white">
                  {currency === 'INR' ? insight.entrySalaryInr : '$90k – $120k / yr'}
                </span>
                <span className="text-[10px] text-slate-400 block">Baseline starting package</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-300 block">Mid Level (3-5 Yrs)</span>
                <span className="text-base font-black text-emerald-300">
                  {currency === 'INR' ? insight.avgSalaryInr : insight.avgSalaryUsd}
                </span>
                <span className="text-[10px] text-emerald-200/70 block">Target milestone package</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Staff / Senior (5+ Yrs)</span>
                <span className="text-base font-black text-white">
                  {currency === 'INR' ? insight.seniorSalaryInr : '$190k – $280k+ / yr'}
                </span>
                <span className="text-[10px] text-slate-400 block">Includes ESOPs & bonuses</span>
              </div>
            </div>
          </div>

          {/* Remote vs Onsite & Demand stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Remote Flexibility Ratio</span>
                </span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {insight.remoteOpportunityPercent}% Remote / Hybrid
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${insight.remoteOpportunityPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                High flexibility for global remote contracts and distributed engineering teams.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Interview Technical Bar</span>
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {insight.interviewDifficulty}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Requires strong mastery of data structures, live system design, and hands-on portfolio verification.
              </p>
            </div>
          </div>

          {/* Trending Tech & Skills Ticker */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h4 className="font-extrabold text-sm text-slate-900">
                Hottest Tech & Skill Keywords Trending This Month
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              {insight.hottestSkillsThisMonth.map((skill, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hiring Companies */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h4 className="font-extrabold text-sm text-slate-900">
                Top Hiring Organizations & Ecosystems
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {insight.topHiringCompanies.map((c, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white flex items-center justify-between text-xs transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-700">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.location}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Actively Hiring
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Job Board Shortcuts */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-blue-950">Live Openings Ticker</span>
              <p className="text-blue-800">Search verified openings matching this career track directly on top boards.</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(careerTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <span>LinkedIn Jobs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://wellfound.com/jobs?query=${encodeURIComponent(careerTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <span>Wellfound / AngelList</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Aggregated from Glassdoor, Levels.fyi & Naukri compensation benchmarks</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer"
          >
            Close Radar
          </button>
        </div>

      </div>

    </div>
  );
};
