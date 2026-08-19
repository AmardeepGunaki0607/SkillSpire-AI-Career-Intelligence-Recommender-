import React from 'react';
import { Compass, Sparkles, User, RefreshCw, BarChart3, BookOpen, Layers, LogIn, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { DEMO_PERSONAS } from '../data/demoPersonas';
import { DemoPersona, AuthUser } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'onboarding' | 'dashboard' | 'login';
  onNavigate: (view: 'landing' | 'onboarding' | 'dashboard' | 'login') => void;
  onSelectDemoPersona: (persona: DemoPersona) => void;
  hasActiveAnalysis: boolean;
  onReset: () => void;
  onOpenTutorialDemo?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onSelectDemoPersona,
  hasActiveAnalysis,
  onReset,
  onOpenTutorialDemo,
  currentUser,
  onLogout
}) => {
  const [showDemoMenu, setShowDemoMenu] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="navbar-logo-container"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">SkillSpire</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Your skills today. Your career tomorrow.
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Demo Selector Dropdown */}
          <div className="relative">
            <button
              id="try-demo-btn"
              onClick={() => {
                setShowDemoMenu(!showDemoMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 transition-colors shadow-sm cursor-pointer"
              title="Instant 1-Click Demo Profiles for Judges"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Try Demo Profile</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {showDemoMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                id="demo-dropdown-menu"
              >
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-700">Instant Demo Personas</p>
                  <p className="text-[11px] text-slate-400">Preloaded profiles for quick evaluation</p>
                </div>
                {DEMO_PERSONAS.map(persona => (
                  <button
                    key={persona.id}
                    id={`demo-persona-${persona.id}`}
                    onClick={() => {
                      onSelectDemoPersona(persona);
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition-colors group cursor-pointer"
                  >
                    <img 
                      src={persona.avatar} 
                      alt={persona.name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                        {persona.name} <span className="font-normal text-slate-500">→ {persona.profile.careerGoal}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{persona.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Website Tutorial & Demo Video Button */}
          {onOpenTutorialDemo && (
            <button
              id="navbar-video-tutorial-btn"
              onClick={onOpenTutorialDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-sm transition-all cursor-pointer"
              title="Watch interactive step-by-step video tutorial & user guide"
            >
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
              <span>Video Guide</span>
            </button>
          )}

          {/* Navigation Links */}
          {hasActiveAnalysis && (
            <button
              id="nav-to-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Active Dashboard</span>
            </button>
          )}

          {currentView !== 'onboarding' ? (
            <button
              id="start-assessment-btn"
              onClick={() => onNavigate('onboarding')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{hasActiveAnalysis ? 'New Assessment' : 'Build Path'}</span>
            </button>
          ) : (
            <button
              id="nav-cancel-assessment-btn"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 cursor-pointer"
            >
              <span>Back to Overview</span>
            </button>
          )}

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div className="relative ml-1">
              <button
                id="navbar-user-profile-btn"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowDemoMenu(false);
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer"
              >
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                  alt={currentUser.name} 
                  className="w-6 h-6 rounded-full object-cover border border-blue-500/50"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden md:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
                  id="user-account-dropdown"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
                    <img 
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                      alt={currentUser.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                        {currentUser.plan || 'Pro Student'}
                      </span>
                    </div>
                  </div>

                  <div className="px-2 py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Career Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('onboarding');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Retake Diagnostic Assessment</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Switch Account / Persona</span>
                    </button>
                  </div>

                  {onLogout && (
                    <div className="pt-1 border-t border-slate-100 px-2">
                      <button
                        id="logout-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              id="navbar-signin-btn"
              onClick={() => onNavigate('login')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                currentView === 'login'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 shadow-xs'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

