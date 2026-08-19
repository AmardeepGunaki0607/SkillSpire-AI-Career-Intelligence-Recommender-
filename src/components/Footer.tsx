import React from 'react';
import { Compass, ShieldCheck, Cpu, Code2, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70 text-slate-600 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900">SkillSpire AI</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Your skills today. Your career tomorrow. Transforming student potential into actionable, production-grade career readiness.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md w-fit font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Full-Stack AI Career Engine Active
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">Product Core</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">AI Career Matching & Scoring</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Multi-Tier Skill Gap Analyzer</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Dynamic 5-Phase Learning Roadmaps</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Personalized AI Portfolio Projects</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Real-time Readiness Tracker</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">Career Knowledge Base</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>Data Science & AI Engineering</li>
              <li>Machine Learning & MLOps</li>
              <li>Full Stack & Backend Development</li>
              <li>Cloud & DevOps Architecture</li>
              <li>Cybersecurity & SOC Defense</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2.5 text-xs uppercase tracking-wider">Architecture & Tech</h4>
            <div className="space-y-2 text-slate-500">
              <p className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Powered by Google Gemini 3.7 Flash</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>React 19 + TypeScript + Express Backend</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Deterministic Scoring + LLM Explainability</span>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} SkillSpire AI — Career Intelligence & Learning Recommendation Platform.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Built for hackathon demonstration with instant demo profiles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
