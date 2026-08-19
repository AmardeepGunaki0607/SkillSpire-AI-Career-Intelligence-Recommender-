import React, { useState } from 'react';
import { 
  Compass, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome, 
  Briefcase, 
  Award, 
  TrendingUp, 
  ArrowLeft,
  KeyRound,
  Check
} from 'lucide-react';
import { AuthUser, DemoPersona } from '../types';
import { DEMO_PERSONAS } from '../data/demoPersonas';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser, redirectView?: 'dashboard' | 'onboarding' | 'landing') => void;
  onNavigateHome: () => void;
  onStartOnboarding?: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
  onStartOnboarding,
  initialMode = 'signin'
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpTargetRole, setSignUpTargetRole] = useState('Machine Learning Engineer');
  const [signUpRoleType, setSignUpRoleType] = useState<'student' | 'professional' | 'recruiter'>('student');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Standard Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const nameFromEmail = signInEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

      const user: AuthUser = {
        id: `user-${Date.now()}`,
        name: formattedName || 'Candidate',
        email: signInEmail,
        role: 'student',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        targetRole: 'Software Development & AI',
        plan: 'Pro Student',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };

      localStorage.setItem('skillspire_auth_user', JSON.stringify(user));
      setSuccessMessage('Welcome back! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(user, 'dashboard');
      }, 500);
    }, 600);
  };

  // Handle Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        id: `user-${Date.now()}`,
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        role: signUpRoleType,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        targetRole: signUpTargetRole,
        plan: 'Pro Student',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };

      localStorage.setItem('skillspire_auth_user', JSON.stringify(user));
      setSuccessMessage('Account created successfully! Preparing your onboarding...');
      setTimeout(() => {
        onLoginSuccess(user, 'onboarding');
      }, 600);
    }, 700);
  };

  // Handle Quick Demo Persona Login
  const handleDemoPersonaLogin = (persona: DemoPersona) => {
    setIsLoading(true);
    setErrorMessage('');
    
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        id: persona.id,
        name: persona.name,
        email: persona.profile.email || `${persona.id}@skillspire.ai`,
        role: 'student',
        avatar: persona.avatar,
        targetRole: persona.profile.careerGoal,
        plan: 'Pro Student',
        joinedDate: 'Jan 2026'
      };

      localStorage.setItem('skillspire_auth_user', JSON.stringify(user));
      setSuccessMessage(`Signed in as ${persona.name}!`);
      setTimeout(() => {
        onLoginSuccess(user, 'dashboard');
      }, 400);
    }, 400);
  };

  // Handle Judge / Admin Master Demo Login
  const handleJudgeMasterLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const judgeUser: AuthUser = {
        id: 'judge-evaluator-01',
        name: 'Evaluation Judge',
        email: 'judge@hackathon.ai',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        targetRole: 'Platform Evaluator & Reviewer',
        plan: 'Enterprise',
        joinedDate: 'Feb 2026'
      };
      localStorage.setItem('skillspire_auth_user', JSON.stringify(judgeUser));
      setSuccessMessage('Judge Master Access Granted! Loading evaluation dashboard...');
      setTimeout(() => {
        onLoginSuccess(judgeUser, 'dashboard');
      }, 400);
    }, 400);
  };

  // Handle Social Provider Logins
  const handleSocialLogin = (provider: 'google' | 'github') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser = {
        id: `${provider}-${Date.now()}`,
        name: provider === 'google' ? 'Google Scholar User' : 'GitHub OpenSource Contributor',
        email: provider === 'google' ? 'scholar@gmail.com' : 'dev@github.com',
        role: 'student',
        avatar: provider === 'google' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        targetRole: 'Full Stack & AI Engineer',
        plan: 'Pro Student',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      localStorage.setItem('skillspire_auth_user', JSON.stringify(user));
      setSuccessMessage(`Authenticated via ${provider.toUpperCase()}!`);
      setTimeout(() => {
        onLoginSuccess(user, 'dashboard');
      }, 400);
    }, 500);
  };

  // Handle Forgot Password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage('Please provide your registered email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      setSuccessMessage('Password reset link and temporary passkey sent to your email!');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      
      {/* Background ambient lighting accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: HERO VALUE PROP & DEMO SHORTCUTS (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf815_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Back to Home */}
          <div className="relative z-10 space-y-6">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl text-white tracking-tight">SkillSpire</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase tracking-wider">AI</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Next-Gen Career Diagnostics</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Unlock your personalized career roadmap.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Join thousands of engineering students and professionals using semantic AI to bridge skill gaps and land high-paying tech careers.
              </p>
            </div>

            {/* Feature Checkpoints */}
            <div className="space-y-2.5 pt-2">
              {[
                { title: '94% Accurate Career Matching', desc: 'Evaluates your tech stack against 500+ job roles' },
                { title: 'Interactive Video Classroom', desc: 'Integrated code sandbox & timestamped lectures' },
                { title: 'Verified Recruiter Portfolio', desc: '1-click cryptographically verifiable PDF exports' }
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">{f.title}</p>
                    <p className="text-[10px] text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Logins for Hackathon Evaluators */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>1-Click Evaluator Logins</span>
              </span>
              <span className="text-[10px] text-slate-400">Instant Demo</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_PERSONAS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleDemoPersonaLogin(p)}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                  title={`Sign in as ${p.name}`}
                >
                  <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover mb-1 border border-slate-600" />
                  <p className="text-[11px] font-bold text-white group-hover:text-blue-400 truncate">{p.name.split(' ')[0]}</p>
                  <p className="text-[9px] text-slate-400 truncate">{p.profile.careerGoal.split(' ')[0]}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleJudgeMasterLogin}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign in as Judge / Master Evaluator (Instant Access)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: AUTHENTICATION FORM (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Header Tabs: Sign In / Create Account */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`text-sm sm:text-base font-bold pb-1 transition-all cursor-pointer relative ${
                    authMode === 'signin'
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                  {authMode === 'signin' && (
                    <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`text-sm sm:text-base font-bold pb-1 transition-all cursor-pointer relative ${
                    authMode === 'signup'
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                  {authMode === 'signup' && (
                    <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                🔒 256-Bit SSL Encrypted
              </span>
            </div>

            {/* Notification Feedback Banners */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 1: SIGN IN FORM */}
            {/* ========================================================================= */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signin-email-input"
                      type="email"
                      required
                      placeholder="e.g. student@college.edu or aarav@skillspire.ai"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signin-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your account password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                <button
                  id="signin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: SIGN UP / REGISTRATION FORM */}
            {/* ========================================================================= */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / Professional Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      placeholder="e.g. priya@university.edu"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Target Role
                    </label>
                    <select
                      value={signUpTargetRole}
                      onChange={(e) => setSignUpTargetRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none"
                    >
                      <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                      <option value="Full Stack Developer">Full Stack Developer (MERN / Next)</option>
                      <option value="Cloud Solutions Architect">Cloud Solutions Architect (AWS/GCP)</option>
                      <option value="Data Scientist">Data Scientist & Analytics</option>
                      <option value="DevOps & Site Reliability">DevOps & Site Reliability (SRE)</option>
                      <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Profile Status
                    </label>
                    <select
                      value={signUpRoleType}
                      onChange={(e) => setSignUpRoleType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none"
                    >
                      <option value="student">Student / Recent Graduate</option>
                      <option value="professional">Working Professional</option>
                      <option value="recruiter">Recruiter / Employer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-slate-600 text-xs select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 mt-0.5"
                    />
                    <span>
                      I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span> and <span className="text-blue-600 font-semibold">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Creating SkillSpire Account...</span>
                  ) : (
                    <>
                      <span>Create Free Account & Start Diagnostics</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================================= */}
            {/* VIEW 3: FORGOT PASSWORD */}
            {/* ========================================================================= */}
            {authMode === 'forgot' && (
              <div className="space-y-4">
                <div className="text-left space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Reset Your Password</h3>
                  <p className="text-xs text-slate-500">
                    Enter your registered email address and we'll send you an instant reset verification link.
                  </p>
                </div>

                {!resetSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. candidate@university.edu"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? 'Sending Passkey...' : 'Send Password Reset Passkey'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-xs">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verification Link Dispatched</span>
                    </p>
                    <p className="text-emerald-700 leading-relaxed">
                      We sent a one-time login link to <strong>{forgotEmail}</strong>. You can also sign in with any of our instant 1-click Demo Personas.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setResetSent(false);
                    setErrorMessage('');
                  }}
                  className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* Social Authentication Providers Divider */}
            {authMode !== 'forgot' && (
              <div className="pt-5 space-y-3">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="social-google-login-btn"
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="text-rose-500 font-bold text-sm">G</span>
                    <span>Google</span>
                  </button>

                  <button
                    id="social-github-login-btn"
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-900" />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SkillSpire Single Sign-On (SSO)</span>
            </span>
            <span>SkillSpire AI © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
