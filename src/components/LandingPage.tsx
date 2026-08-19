import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  BrainCircuit, 
  BarChart, 
  TrendingUp, 
  Layers, 
  BookOpen, 
  FolderGit2, 
  Activity, 
  Zap, 
  Users, 
  Award,
  ChevronRight,
  HelpCircle,
  Play,
  FileText,
  Video
} from 'lucide-react';
import { DEMO_PERSONAS } from '../data/demoPersonas';
import { DemoPersona } from '../types';
import { CAREER_KNOWLEDGE_BASE } from '../data/knowledgeBase';

interface LandingPageProps {
  onStartAssessment: () => void;
  onSelectDemoPersona: (persona: DemoPersona) => void;
  onNaturalLanguageSubmit?: (prompt: string) => void;
  onOpenTutorialDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onSelectDemoPersona,
  onNaturalLanguageSubmit,
  onOpenTutorialDemo
}) => {
  const howItWorksRef = React.useRef<HTMLDivElement>(null);
  const [naturalGoalInput, setNaturalGoalInput] = useState('');

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (naturalGoalInput.trim() && onNaturalLanguageSubmit) {
      onNaturalLanguageSubmit(naturalGoalInput.trim());
    } else {
      onStartAssessment();
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    setNaturalGoalInput(prompt);
    if (onNaturalLanguageSubmit) {
      onNaturalLanguageSubmit(prompt);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-400/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive Video Masterclasses & Next-Gen Career Intelligence</span>
            </div>

            {/* Main Headline & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Your skills today. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                Your career tomorrow.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Discover the career paths that fit your strengths, identify the skills you need next, and get an AI-powered learning roadmap with <strong>structured video masterclasses</strong>, notes, and projects.
            </p>

            {/* Conversational Natural Language Goal Input Bar */}
            <div className="pt-2 max-w-2xl mx-auto">
              <form 
                onSubmit={handleNaturalSubmit} 
                className="p-2 rounded-2xl bg-white border-2 border-indigo-200/80 shadow-lg shadow-indigo-100/50 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
              >
                <input
                  id="hero-natural-goal-input"
                  type="text"
                  value={naturalGoalInput}
                  onChange={(e) => setNaturalGoalInput(e.target.value)}
                  placeholder="e.g., 2nd year BTech, know Java & SQL, want a 12 LPA SDE role..."
                  className="flex-1 px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  id="hero-natural-goal-submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Path</span>
                </button>
              </form>

              {/* Quick Prompt Pills */}
              <div className="flex items-center gap-2 justify-center flex-wrap pt-3 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Quick Prompts:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPromptClick("I'm in 2nd year CSE, know basic C++ and Java, want to crack a 12 LPA SDE role")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
                >
                  ⚡ Java & DSA to SDE 1
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPromptClick("Zero to Full Stack Web Developer studying 12 hrs/week")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
                >
                  🌐 Full Stack Web Dev Bootcamp
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPromptClick("College student to Data Scientist & AI Engineer in 6 months using recorded video masterclass")}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
                >
                  🤖 AI & Data Science
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                id="hero-primary-cta-btn"
                onClick={onStartAssessment}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                <span>Take Full Diagnostic Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onOpenTutorialDemo && (
                <button
                  id="hero-tutorial-video-btn"
                  onClick={onOpenTutorialDemo}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4 fill-slate-950 stroke-[1.5]" />
                  <span>Watch Website Tutorial Video</span>
                </button>
              )}

              <button
                id="hero-secondary-cta-btn"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm transition-colors shadow-xs"
              >
                Explore How It Works
              </button>
            </div>

            {/* Quick Demo Profile Bar for Judges */}
            <div className="pt-6 pb-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-200/50 max-w-2xl mx-auto">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Hackathon Judge Quick-Start (1-Click Personas):
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Instant Full Results</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DEMO_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      id={`hero-demo-pill-${persona.id}`}
                      onClick={() => onSelectDemoPersona(persona)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 text-left transition-all group flex items-center gap-2.5 cursor-pointer"
                    >
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                          {persona.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          Target: {persona.profile.careerGoal}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Stats Trust Markers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200/70 text-slate-600">
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900">16+</p>
                <p className="text-xs text-slate-500 font-medium">Career Profiles Mapped</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-blue-600">100%</p>
                <p className="text-xs text-slate-500 font-medium">Personalized Roadmaps</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-indigo-600">Video Hub</p>
                <p className="text-xs text-slate-500 font-medium">Career-Focused Learning</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-emerald-600">&lt; 30s</p>
                <p className="text-xs text-slate-500 font-medium">AI Analysis Time</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Career-Focused Learning Recorded Videos Showcase Banner */}
      <section className="py-14 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <Video className="w-3.5 h-3.5" />
                <span>Career-Focused Learning • Video Classroom</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Learn from Structured Recorded Video Masterclasses
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                SkillSpire AI pairs your personalized learning roadmap directly with recommended video lectures—complete with timestamped chapters, formula cheat sheets, and post-lecture assessment quizzes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Timestamped Chapter Timeline</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lecture Notes & Formula Sheets</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive Post-Lecture Quizzes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live Scratchpad for Note-Taking</span>
                </div>
              </div>
            </div>

            {/* Video Classroom Preview Card */}
            <div className="w-full lg:max-w-md bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-2xl space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
                  alt="Career-Focused Learning Video Lecture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-amber-300">
                  Java & DSA Placement Mastery
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white">
                  145:00
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">
                  Java Core & OOP — From Zero to Hero
                </h4>
                <p className="text-[11px] text-slate-400">
                  Master SDE Faculty • 5 Chapters • Includes Notes & Quiz
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Product Differentiator Chain */}
      <section className="py-14 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">The SkillSpire Methodology</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              From Diagnostic Profile to Market-Ready Engineer
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Traditional sites just give you a generic job description. SkillSpire builds an actionable end-to-end execution pipeline.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { step: '01', title: 'WHO YOU ARE', desc: 'Skills, degrees & learning style', color: 'from-blue-500/20 to-blue-600/10' },
              { step: '02', title: 'WHAT FITS', desc: 'Match scores & ranking', color: 'from-indigo-500/20 to-indigo-600/10' },
              { step: '03', title: 'WHAT YOU LACK', desc: 'Multi-tier gap analysis', color: 'from-purple-500/20 to-purple-600/10' },
              { step: '04', title: 'WHAT TO LEARN', desc: 'Phased roadmap & courses', color: 'from-sky-500/20 to-sky-600/10' },
              { step: '05', title: 'WHAT TO BUILD', desc: 'Real portfolio projects', color: 'from-emerald-500/20 to-emerald-600/10' },
              { step: '06', title: 'PROGRESSION', desc: 'Readiness % & interview prep', color: 'from-amber-500/20 to-amber-600/10' },
            ].map((node, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border border-slate-800 bg-gradient-to-b ${node.color} flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 tracking-wider">STEP {node.step}</span>
                  <h3 className="text-xs font-bold text-white mt-1 mb-1">{node.title}</h3>
                </div>
                <p className="text-[11px] text-slate-400">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
              Clear 6-Step Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How SkillSpire AI Works
            </h2>
            <p className="text-slate-500 text-sm">
              A structured, transparent algorithm that takes the guesswork out of student career decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Tell Us About Yourself',
                desc: 'Enter your education, current technical and soft skills with proficiency levels, interests, and weekly available study hours.',
                icon: Users,
                color: 'text-blue-600 bg-blue-50'
              },
              {
                num: '2',
                title: 'AI Analyzes Your Profile',
                desc: 'Our scoring engine matches your skills against 16+ industry career roles using semantic knowledge bases and prerequisite graphs.',
                icon: BrainCircuit,
                color: 'text-indigo-600 bg-indigo-50'
              },
              {
                num: '3',
                title: 'Discover Suitable Careers',
                desc: 'Receive ranked career matches with transparent match scores, expected salary ranges, and market demand indicators.',
                icon: Target,
                color: 'text-sky-600 bg-sky-50'
              },
              {
                num: '4',
                title: 'Identify Skill Gaps',
                desc: 'See exactly where your current proficiencies fall short of real job requirements categorized into Low, Medium, High, and Critical gaps.',
                icon: BarChart,
                color: 'text-purple-600 bg-purple-50'
              },
              {
                num: '5',
                title: 'Follow Personalized Roadmap',
                desc: 'Get an automatically generated 5-phase timeline that adapts to your weekly schedule with vetted courses and milestone deliverables.',
                icon: Layers,
                color: 'text-emerald-600 bg-emerald-50'
              },
              {
                num: '6',
                title: 'Build Projects & Track Readiness',
                desc: 'Complete portfolio projects tailored to your gaps, track your career readiness score, and get instant guidance from your AI Career Assistant.',
                icon: Award,
                color: 'text-amber-600 bg-amber-50'
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.color} font-bold text-sm shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-blue-500 transition-colors">
                        0{step.num}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Key Features Bento Grid */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
              Comprehensive Feature Suite
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Real Career Outcomes
            </h2>
            <p className="text-slate-500 text-sm">
              Every tool a student or career changer needs to transition from uncertainty to a signed offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">AI Career Matching & Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Evaluates your technical competencies, academic status, and interests to rank multiple viable careers with visual ring match indicators.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">16+ Core Roles</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Top 3 Alternatives</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Salary Benchmarks</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <BarChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">Skill Gap Analyzer</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Precise side-by-side comparison between your current proficiency and industry expectations, categorized from Low to Critical.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Priority 1/2/3 Ordering</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Visual Progress Bars</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Actionable Rationale</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">Personalized Learning Roadmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Dynamic 5-phase timeline that automatically adjusts durations and milestones based on your available weekly study hours.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Weekly Breakdown</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Milestone Deliverables</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Phase Completion</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">AI Project Recommender</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Curates real-world portfolio projects specifically designed to plug your exact missing skills, complete with architecture specs.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Tech Stack Recipes</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Portfolio Value Score</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">GitHub Starter Ideas</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">Progress & Career Readiness Meter</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Interactive tracker allowing you to check off mastered skills, finished courses, and completed milestones to watch your readiness climb.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Live Readiness %</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Streak Tracking</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">PDF/Brief Export</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">Explainable AI & Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                No black-box guesses. SkillSpire explains the mathematical and trajectory logic behind recommendations with an interactive AI mentor.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Natural-Language Fit</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Contextual Chat</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Fast 10-Hour Blueprints</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Why SkillSpire vs Traditional Platforms Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
              The SkillSpire Advantage
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Traditional Platforms Fail Students
            </h2>
            <p className="text-slate-500 text-sm">
              Generic job boards and course websites dump thousands of unrelated links on you. SkillSpire engineers your exact roadmap.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Traditional Platforms */}
              <div className="p-6 sm:p-8 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Generic Job & Course Platforms
                </div>
                <ul className="space-y-4 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Recommends 40-hour generic video courses with no connection to your specific gaps.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Leaves you wondering why a role was suggested or if you have the prerequisites.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>No portfolio project strategy tailored to hiring manager expectations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>One-size-fits-all roadmaps that ignore your actual weekly hours and timeline.</span>
                  </li>
                </ul>
              </div>

              {/* SkillSpire AI */}
              <div className="p-6 sm:p-8 bg-blue-50/30">
                <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  SkillSpire AI Intelligent Engine
                </div>
                <ul className="space-y-4 text-xs text-slate-800">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Deep Diagnostic:</strong> Analyzes current proficiency levels and isolates only the missing skills.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Explainable Scoring:</strong> Transparent percentage breakdowns and mathematical fit reasoning.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Gap-Plugging Projects:</strong> Suggests capstones with architecture highlights and starter code plans.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dynamic Milestones:</strong> Custom-calculated weekly timeline and live readiness progress tracking.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Interactive Career Knowledge Base Teaser */}
      <section className="py-16 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Knowledge Base</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Explore 16+ High-Demand Tech Career Tracks
              </h2>
            </div>
            <button
              onClick={onStartAssessment}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>Take the assessment to find your match</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CAREER_KNOWLEDGE_BASE.slice(0, 8).map(career => (
              <div 
                key={career.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {career.category}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    {career.marketDemand}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{career.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">{career.avgSalaryRange}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Map Your Personalized Career Roadmap?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Take our 2-minute diagnostic assessment or load a demo profile to experience how SkillSpire AI transforms your preparation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="bottom-cta-start-btn"
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
            >
              Start Free Assessment
            </button>
            <button
              id="bottom-cta-demo-btn"
              onClick={() => onSelectDemoPersona(DEMO_PERSONAS[0])}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-900 text-white border border-blue-400/40 font-semibold text-sm transition-colors"
            >
              Load Demo as Aarav (Data Scientist)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
