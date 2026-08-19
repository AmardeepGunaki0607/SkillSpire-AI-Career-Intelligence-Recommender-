import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { AnalyzingLoader } from './components/AnalyzingLoader';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { CompetitionDemoModal } from './components/CompetitionDemoModal';
import { UserProfile, AnalysisResult, DemoPersona, AuthUser } from './types';
import { generateCompleteAnalysis, parseNaturalLanguageGoal } from './lib/recommendationEngine';
import { DEMO_PERSONAS } from './data/demoPersonas';
import { RECORDED_VIDEO_LESSONS_DATABASE } from './data/recordedVideos';
import { triggerConfetti, cleanBrandText } from './lib/utils';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'dashboard' | 'login'>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showTutorialDemoModal, setShowTutorialDemoModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Restore previous session & auth user from localStorage ONLY if auth user exists
  useEffect(() => {
    try {
      // 1. Check Auth User first
      const savedAuth = localStorage.getItem('skillspire_auth_user');
      let authenticated = false;
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        if (parsedAuth && parsedAuth.name) {
          setCurrentUser(parsedAuth);
          authenticated = true;
        }
      }

      // 2. ONLY restore analysis result if user is authenticated
      if (authenticated) {
        const savedResult = localStorage.getItem('skillspire_last_analysis') || localStorage.getItem('pathpilot_last_analysis');
        if (savedResult) {
          let parsed = JSON.parse(savedResult);
          if (parsed && parsed.primaryCareer) {
            // Re-sync video lessons with the fresh database to remove any legacy cached brands
            if (Array.isArray(parsed.recommendedRecordedVideos)) {
              parsed.recommendedRecordedVideos = parsed.recommendedRecordedVideos.map((v: any) => {
                const fresh = RECORDED_VIDEO_LESSONS_DATABASE.find(f => f.id === v.id);
                if (fresh) return fresh;
                return {
                  ...v,
                  batchName: cleanBrandText(v.batchName),
                  instructor: cleanBrandText(v.instructor),
                  title: cleanBrandText(v.title)
                };
              });
            }
            setAnalysisResult(parsed);
            setCurrentProfile(parsed.userProfile);
          }
        }
      } else {
        // If not logged in, ensure no active analysis is preloaded
        setAnalysisResult(null);
        setCurrentProfile(null);
      }
    } catch (err) {
      console.warn('Failed to restore local session:', err);
    }
  }, []);

  const handleProfileSubmit = async (profile: UserProfile) => {
    setCurrentProfile(profile);
    
    // If not authenticated yet, create session with user's inputted details
    if (!currentUser) {
      const newAuthUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: profile.fullName || 'Learner',
        email: profile.email || 'learner@skillspire.ai',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        targetRole: profile.careerGoal || 'Software Engineer',
        plan: 'Pro Student',
        joinedDate: 'Jan 2026'
      };
      setCurrentUser(newAuthUser);
      localStorage.setItem('skillspire_auth_user', JSON.stringify(newAuthUser));
    }

    setIsAnalyzing(true);
    setCurrentView('dashboard');

    try {
      // Step 1: Request analysis from backend Express + Gemini endpoint
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      localStorage.setItem('skillspire_last_analysis', JSON.stringify(result));
      triggerConfetti();
    } catch (err) {
      console.warn('Backend API request failed or timed out, falling back to local recommendation engine:', err);
      // Deterministic client-side fallback
      const fallbackResult = generateCompleteAnalysis(profile);
      setAnalysisResult(fallbackResult);
      localStorage.setItem('skillspire_last_analysis', JSON.stringify(fallbackResult));
      triggerConfetti();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectDemoPersona = async (persona: DemoPersona) => {
    setCurrentProfile(persona.profile);
    
    // Also sync current user auth state
    const authUser: AuthUser = {
      id: persona.id,
      name: persona.name,
      email: persona.profile.email || `${persona.id}@skillspire.ai`,
      role: 'student',
      avatar: persona.avatar,
      targetRole: persona.profile.careerGoal,
      plan: 'Pro Student',
      joinedDate: 'Jan 2026'
    };
    setCurrentUser(authUser);
    localStorage.setItem('skillspire_auth_user', JSON.stringify(authUser));

    setIsAnalyzing(true);
    setCurrentView('dashboard');

    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona.profile)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      localStorage.setItem('skillspire_last_analysis', JSON.stringify(result));
      triggerConfetti();
    } catch (err) {
      console.warn('Backend API request fallback for demo persona:', err);
      const fallbackResult = generateCompleteAnalysis(persona.profile);
      setAnalysisResult(fallbackResult);
      localStorage.setItem('skillspire_last_analysis', JSON.stringify(fallbackResult));
      triggerConfetti();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoginSuccess = (user: AuthUser, redirectView: 'dashboard' | 'onboarding' | 'landing' = 'dashboard') => {
    setCurrentUser(user);
    if (redirectView === 'dashboard' && !analysisResult) {
      // Find matching or default demo persona if no analysis exists yet
      const match = DEMO_PERSONAS.find(p => p.id === user.id) || DEMO_PERSONAS[0];
      handleSelectDemoPersona(match);
    } else {
      setCurrentView(redirectView);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('skillspire_auth_user');
    localStorage.removeItem('skillspire_last_analysis');
    localStorage.removeItem('pathpilot_last_analysis');
    setCurrentUser(null);
    setAnalysisResult(null);
    setCurrentProfile(null);
    setCurrentView('login');
  };

  const handleReset = () => {
    localStorage.removeItem('skillspire_last_analysis');
    localStorage.removeItem('pathpilot_last_analysis');
    setAnalysisResult(null);
    setCurrentProfile(null);
    setCurrentView('landing');
  };

  const handleNaturalLanguageSubmit = (promptText: string) => {
    const parsedProfile = parseNaturalLanguageGoal(promptText);
    handleProfileSubmit(parsedProfile);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard' && !currentUser) {
            setCurrentView('login');
          } else {
            setCurrentView(view);
          }
        }}
        onSelectDemoPersona={handleSelectDemoPersona}
        hasActiveAnalysis={Boolean(currentUser && analysisResult)}
        onReset={handleReset}
        onOpenTutorialDemo={() => setShowTutorialDemoModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {isAnalyzing ? (
          <AnalyzingLoader />
        ) : currentView === 'login' ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => setCurrentView('landing')}
            onStartOnboarding={() => setCurrentView('onboarding')}
          />
        ) : currentView === 'landing' ? (
          <LandingPage
            onStartAssessment={() => setCurrentView('onboarding')}
            onSelectDemoPersona={handleSelectDemoPersona}
            onNaturalLanguageSubmit={handleNaturalLanguageSubmit}
            onOpenTutorialDemo={() => setShowTutorialDemoModal(true)}
          />
        ) : currentView === 'onboarding' ? (
          <OnboardingWizard
            initialProfile={currentProfile}
            onSubmit={handleProfileSubmit}
            onCancel={() => setCurrentView('landing')}
            onSelectDemoPersona={handleSelectDemoPersona}
          />
        ) : currentView === 'dashboard' && currentUser && analysisResult ? (
          <Dashboard
            analysisResult={analysisResult}
            onUpdateAnalysis={(newAnalysis) => {
              setAnalysisResult(newAnalysis);
              localStorage.setItem('skillspire_last_analysis', JSON.stringify(newAnalysis));
            }}
            onEditProfile={() => setCurrentView('onboarding')}
          />
        ) : currentView === 'dashboard' && !currentUser ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => setCurrentView('landing')}
            onStartOnboarding={() => setCurrentView('onboarding')}
          />
        ) : (
          <LandingPage
            onStartAssessment={() => setCurrentView('onboarding')}
            onSelectDemoPersona={handleSelectDemoPersona}
            onNaturalLanguageSubmit={handleNaturalLanguageSubmit}
            onOpenTutorialDemo={() => setShowTutorialDemoModal(true)}
          />
        )}
      </div>

      {/* Persistent Footer */}
      <Footer />

      {/* Global Interactive Website Tutorial & Demo Modal */}
      <CompetitionDemoModal
        isOpen={showTutorialDemoModal}
        onClose={() => setShowTutorialDemoModal(false)}
        initialMode="tutorial"
      />

    </div>
  );
}

