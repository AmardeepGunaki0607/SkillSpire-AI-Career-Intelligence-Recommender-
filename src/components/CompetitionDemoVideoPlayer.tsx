import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  CheckCircle2,
  Sparkles,
  Compass,
  Code2,
  Layers,
  Zap,
  Terminal,
  ArrowRight,
  FileCode,
  Share2,
  Award,
  BookOpen,
  Subtitles,
  Music,
  Check,
  Film,
  Target,
  BarChart3,
  Flame,
  Trophy,
  Briefcase,
  Star,
  Presentation,
  Bot,
  MousePointer2,
  Monitor,
  Video,
  FileText,
  User,
  Sliders,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Radio,
  Clock,
  Sparkle,
  HelpCircle
} from 'lucide-react';
import { videoAudioEngine } from '../lib/videoAudio';
import { fixWebmDuration, createStandaloneHtmlPresentation } from '../lib/webmDurationFix';
import { generateFullLengthVideo } from '../lib/videoExporter';

export interface TutorialScene {
  id: number;
  stepNumber: number;
  title: string;
  badge: string;
  startSec: number;
  endSec: number;
  instructionTitle: string;
  instructionText: string;
  narration: string;
  cursorTarget: { x: number; y: number; action: string; label: string };
}

export const WEBSITE_TUTORIAL_SCENES: TutorialScene[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'Platform Overview & Instant Start',
    badge: 'SCENE 1: PLATFORM OVERVIEW',
    startSec: 0,
    endSec: 22,
    instructionTitle: 'Explore Natural Language Goal Input or 1-Click Personas',
    instructionText: 'Type your career aspirations in natural language, or pick a verified 1-click Demo Persona to test the system immediately.',
    narration: 'Welcome to the official 3-minute master walkthrough of SkillSpire AI. SkillSpire AI is an intelligent career navigation and personalized upskilling SaaS platform designed to transform students and professionals into top-tier, industry-ready engineers. Get started with natural language goal input or one-click demo personas.',
    cursorTarget: { x: 50, y: 48, action: 'typing', label: 'Entering natural language goal' }
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'Onboarding & Technical Diagnostics',
    badge: 'SCENE 2: DIAGNOSTICS & PROFILE',
    startSec: 22,
    endSec: 45,
    instructionTitle: 'Select Academic Background, Known Technologies & Target Roles',
    instructionText: 'Choose your education, select programming languages and frameworks you know, and define your dream career target.',
    narration: 'During onboarding, candidates enter their academic background, target industry domain, and check off technical competencies across languages and frameworks. SkillSpire immediately evaluates proficiency levels and weekly study availability.',
    cursorTarget: { x: 38, y: 55, action: 'clicking', label: 'Selecting skill competencies' }
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'Semantic AI Matches & Gap Radar',
    badge: 'SCENE 3: MATCH SCORE & GAPS',
    startSec: 45,
    endSec: 68,
    instructionTitle: 'Inspect Readiness Match Score, Salary Projections & Radar',
    instructionText: 'View your 94% Career Match score, salary benchmarks ($115k-$145k), and pinpointed critical skill gaps on the radar.',
    narration: 'Our diagnostic AI engine matches user competencies against over 500 industry roles. Candidates discover their primary career match—such as Lead Machine Learning Engineer at 94% match—with salary benchmarks and an interactive 6-axis skill gap radar.',
    cursorTarget: { x: 70, y: 42, action: 'inspecting', label: 'Analyzing 94% Lead ML Role' }
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'Dynamic 5-Phase Roadmap',
    badge: 'SCENE 4: ACTION ROADMAP',
    startSec: 68,
    endSec: 92,
    instructionTitle: 'Step-by-Step Personalized Learning Pathway',
    instructionText: 'Explore your customized 12-week timeline from Foundations to Interview Prep, and check off milestones as you learn.',
    narration: 'SkillSpire constructs a customized 12-week dynamic learning roadmap divided into five progressive phases: Mathematical Foundations, Core Deep Learning, Scaled Production Systems, Capstone Portfolio Projects, and Final Technical Interview Sprints.',
    cursorTarget: { x: 30, y: 62, action: 'checking', label: 'Checking completed milestone' }
  },
  {
    id: 5,
    stepNumber: 5,
    title: 'Video Classroom & Live Code Sandbox',
    badge: 'SCENE 5: HANDS-ON SANDBOX',
    startSec: 92,
    endSec: 116,
    instructionTitle: 'Watch Masterclasses & Run Code Directly in Browser',
    instructionText: 'Watch timestamped video lectures, write code in the integrated sandbox, run it in the live terminal, and take retention quizzes.',
    narration: 'Learners dive into integrated masterclass lectures with timestamped chapters. Right inside the browser, students write code in the interactive sandbox, execute Python and PyTorch scripts in real time, and pass automated quiz assessments.',
    cursorTarget: { x: 62, y: 68, action: 'running_code', label: 'Executing in Live Terminal' }
  },
  {
    id: 6,
    stepNumber: 6,
    title: '24/7 Contextual AI Strategist',
    badge: 'SCENE 6: AI MENTORSHIP',
    startSec: 116,
    endSec: 138,
    instructionTitle: 'Real-Time Architectural Advice & Interview Coaching',
    instructionText: 'Ask your context-aware AI Mentor career advice, debug code, and review interview preparation questions.',
    narration: 'The 24/7 AI Career Strategist offers real-time contextual mentorship. Powered by state-of-the-art language models, it explains complex architectural trade-offs, reviews code snippets, and guides candidates through technical interview questions.',
    cursorTarget: { x: 75, y: 40, action: 'coaching', label: 'Real-time AI Guidance' }
  },
  {
    id: 7,
    stepNumber: 7,
    title: 'Daily Study Habit Engine & Streaks',
    badge: 'SCENE 7: GAMIFIED HABITS',
    startSec: 138,
    endSec: 160,
    instructionTitle: 'Maintain Daily Study Streaks, Earn XP & Freeze Protection',
    instructionText: 'Stay consistent every single day with streak milestones, XP rewards, and smart reminder notifications.',
    narration: 'To ensure consistent progress, SkillSpire features an intelligent habit engine with daily study streaks, XP rewards, streak freeze protection, and automated notifications that keep learners motivated and disciplined.',
    cursorTarget: { x: 80, y: 35, action: 'streaks', label: '5-Day Active Study Streak' }
  },
  {
    id: 8,
    stepNumber: 8,
    title: 'Verified Recruiter Export & Summary',
    badge: 'SCENE 8: RECRUITER EXPORT',
    startSec: 160,
    endSec: 180,
    instructionTitle: '1-Click Career Readiness Report PDF Export',
    instructionText: 'Export verifiable, shareable reports for recruiters and competition judges showcasing completed skills.',
    narration: 'Upon completing milestones, candidates export a verified, recruiter-ready Career Readiness Report in PDF and JSON formats. SkillSpire AI bridges the global talent gap and accelerates career success. Start your journey today!',
    cursorTarget: { x: 50, y: 50, action: 'exporting', label: 'Exporting Verified Report' }
  }
];

export const COMPETITION_PITCH_SCENES: TutorialScene[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'Platform Vision & Problem Solved',
    badge: 'VISION & IMPACT',
    startSec: 0,
    endSec: 12,
    instructionTitle: 'Bridging the Global Career Skill Gap',
    instructionText: 'SkillSpire AI transforms college students and career switchers into placement-ready professionals through AI precision.',
    narration: 'Welcome to SkillSpire AI: the next-generation career navigation and intelligent upskilling ecosystem built to turn career aspirations into industry-ready reality.',
    cursorTarget: { x: 50, y: 50, action: 'showcasing', label: 'SkillSpire Platform' }
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'Semantic Skill Matching & Gap Radar',
    badge: 'AI INTELLIGENCE',
    startSec: 12,
    endSec: 25,
    instructionTitle: 'Deep 500+ Competency Diagnostics',
    instructionText: 'Calculates 94% job readiness match and pinpoints high-priority technical gaps in seconds.',
    narration: 'SkillSpire ingests candidate profiles and executes deep semantic matching, benchmarking 500 plus industry competencies to calculate precise career readiness scores.',
    cursorTarget: { x: 65, y: 45, action: 'analyzing', label: 'Benchmarking 500+ Skills' }
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'Dynamic 5-Phase Roadmap Engine',
    badge: 'STRUCTURED PATHWAY',
    startSec: 25,
    endSec: 38,
    instructionTitle: 'Personalized 12-Week Milestones',
    instructionText: 'Dynamic progression engine mapping foundations, scale architecture, and interview prep.',
    narration: 'Our engine synthesizes structured 5-phase personalized learning roadmaps, pairing actionable milestones with time-to-job analytics and real-world projects.',
    cursorTarget: { x: 45, y: 60, action: 'planning', label: '12-Week Career Fast Track' }
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'Interactive Multi-Modal Classroom',
    badge: 'HANDS-ON LEARNING',
    startSec: 38,
    endSec: 51,
    instructionTitle: 'Video Lectures with Live In-Browser Sandbox',
    instructionText: 'Live code execution, timestamped chapters, and diagnostic quizzes.',
    narration: 'Students master complex concepts through interactive micro-learning classrooms with real-time code simulation, timestamped chapters, and instant retention quizzes.',
    cursorTarget: { x: 55, y: 65, action: 'executing', label: 'Live Sandbox & Quizzes' }
  },
  {
    id: 5,
    stepNumber: 5,
    title: 'Context-Aware AI Mentor & Habit Engine',
    badge: 'AI MENTORSHIP & STREAKS',
    startSec: 51,
    endSec: 64,
    instructionTitle: 'Personalized Coaching & Streak Protection',
    instructionText: 'Continuous learner accountability with streak freezes and personalized study reminders.',
    narration: 'Equipped with context-aware AI career mentoring and gamified daily study streak mechanics, SkillSpire keeps learners accountable every single day until placement.',
    cursorTarget: { x: 75, y: 40, action: 'coaching', label: 'Real-time AI Guidance' }
  },
  {
    id: 6,
    stepNumber: 6,
    title: 'Competition Pitch & Global Impact',
    badge: 'SUBMISSION READY',
    startSec: 64,
    endSec: 75,
    instructionTitle: 'Empowering Millions of Next-Gen Engineers',
    instructionText: 'Scalable full-stack architecture built for universities, bootcamps, and global talent.',
    narration: 'SkillSpire AI: Bridging the global skill gap and empowering the next generation of engineers and leaders. Built for scale. Built for the future.',
    cursorTarget: { x: 50, y: 50, action: 'ready', label: 'www.skillspire.ai' }
  }
];

interface CompetitionDemoVideoPlayerProps {
  onClose?: () => void;
  autoPlay?: boolean;
  initialMode?: 'tutorial' | 'pitch';
}

export const CompetitionDemoVideoPlayer: React.FC<CompetitionDemoVideoPlayerProps> = ({
  onClose,
  autoPlay = true,
  initialMode = 'tutorial'
}) => {
  const [videoMode, setVideoMode] = useState<'tutorial' | 'pitch'>(initialMode);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isSandboxRunning, setIsSandboxRunning] = useState<boolean>(false);
  const [roadmapMilestoneChecked, setRoadmapMilestoneChecked] = useState<boolean>(true);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [isLiveRecording, setIsLiveRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const currentSceneIdRef = useRef<number>(1);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeRecorderRef = useRef<MediaRecorder | null>(null);
  const liveRecordingTimerRef = useRef<number | null>(null);

  const activeScenes = videoMode === 'tutorial' ? WEBSITE_TUTORIAL_SCENES : COMPETITION_PITCH_SCENES;
  const duration = activeScenes[activeScenes.length - 1].endSec;

  // Active scene calculation
  const activeScene = activeScenes.find(
    s => currentTime >= s.startSec && currentTime < s.endSec
  ) || activeScenes[activeScenes.length - 1];

  // Narration Voice Trigger on Scene Transition
  useEffect(() => {
    if (!isPlaying) {
      videoAudioEngine.stopNarration();
      return;
    }

    if (activeScene.id !== currentSceneIdRef.current) {
      currentSceneIdRef.current = activeScene.id;
      if (!isMuted) {
        videoAudioEngine.speakNarration(activeScene.narration);
      }
    }
  }, [activeScene.id, isPlaying, isMuted, videoMode]);

  // Ambient Music
  useEffect(() => {
    if (isPlaying && isMusicEnabled && !isMuted) {
      videoAudioEngine.startAmbientMusic(0.08);
    } else {
      videoAudioEngine.stopAmbientMusic();
    }
  }, [isPlaying, isMusicEnabled, isMuted]);

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTimeRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const deltaSeconds = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
      lastTimeRef.current = now;

      setCurrentTime(prev => {
        const nextTime = prev + deltaSeconds;
        if (nextTime >= duration) {
          setIsPlaying(false);
          videoAudioEngine.stopAll();
          return duration;
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, duration]);

  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      currentSceneIdRef.current = 1;
      setIsPlaying(true);
      if (!isMuted) {
        videoAudioEngine.speakNarration(activeScenes[0].narration);
      }
      return;
    }

    if (!isPlaying) {
      setIsPlaying(true);
      if (!isMuted) {
        videoAudioEngine.speakNarration(activeScene.narration);
      }
    } else {
      setIsPlaying(false);
      videoAudioEngine.stopAll();
    }
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, time));
    setCurrentTime(clamped);
    const targetScene = activeScenes.find(
      s => clamped >= s.startSec && clamped < s.endSec
    ) || activeScenes[0];
    
    currentSceneIdRef.current = targetScene.id;
    if (isPlaying && !isMuted) {
      videoAudioEngine.speakNarration(targetScene.narration);
    }
  };

  const handleModeSwitch = (mode: 'tutorial' | 'pitch') => {
    setVideoMode(mode);
    setCurrentTime(0);
    currentSceneIdRef.current = 1;
    const newScenes = mode === 'tutorial' ? WEBSITE_TUTORIAL_SCENES : COMPETITION_PITCH_SCENES;
    if (isPlaying && !isMuted) {
      videoAudioEngine.speakNarration(newScenes[0].narration);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoAudioEngine.setNarrationMuted(nextMuted);
    if (nextMuted) {
      videoAudioEngine.stopAll();
    } else if (isPlaying) {
      videoAudioEngine.speakNarration(activeScene.narration);
      if (isMusicEnabled) videoAudioEngine.startAmbientMusic(0.08);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Render Frame to Canvas for 1080p / 720p HD MP4 export
  const renderFrameToCanvas = (ctx: CanvasRenderingContext2D, timeSec: number) => {
    const width = 1280;
    const height = 720;

    // Dark sleek gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.4, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing particle ambient effects
    ctx.save();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.beginPath();
    ctx.arc(280, 180, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.beginPath();
    ctx.arc(1000, 520, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Top Simulated Browser Bar
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(40, 25, width - 80, 45);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 25, width - 80, 45);

    // Browser dots
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(65, 47, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(80, 47, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(95, 47, 5, 0, Math.PI * 2); ctx.fill();

    // Browser Address Pill
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(140, 34, 400, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('🔒 https://skillspire.ai/app/dashboard', 155, 52);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('SKILLSPIRE AI — OFFICIAL INTERACTIVE TUTORIAL', width - 65, 52);

    const activeSub = activeScenes.find(s => timeSec >= s.startSec && timeSec < s.endSec) || activeScenes[0];

    // SCENE 1: LANDING & QUICK START (0 - 22s)
    if (timeSec < 22) {
      // Navbar Mockup
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(55, 85, width - 110, 50);
      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SkillSpire AI', 80, 117);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText('Your skills today. Your career tomorrow.', 210, 117);

      // Hero Card
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(55, 145, width - 110, 460, 16);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 36px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Your skills today. Your career tomorrow.', width / 2, 215);

      ctx.fillStyle = '#475569';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Discover career paths that fit your strengths, analyze skill gaps, and follow video roadmaps.', width / 2, 255);

      // Prompt Box
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 320, 290, 640, 55, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '15px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✍️ "2nd year BTech, know Java & SQL, want a 12 LPA SDE role..."', width / 2 - 300, 324);

      // CTA Button
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 140, 365, 280, 48, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Take Full Diagnostic Assessment →', width / 2, 395);

      // 3 Persona pills
      const personas = ['Aarav Patel (CS to AI Engineer)', 'Neha Sharma (Fresher to SDE-1)', 'Rohan Gupta (Cloud Architect)'];
      personas.forEach((p, i) => {
        const x = 160 + i * 330;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, 440, 300, 60, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText(`⚡ ${p}`, x + 150, 475);
      });
    }
    // SCENE 2: ONBOARDING & PROFILE SETUP (22 - 45s)
    else if (timeSec < 45) {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(80, 95, width - 160, 510, 18);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Top step progress
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('STEP 2 OF 3: TECHNICAL SKILL DIAGNOSTICS & GOAL SETTING', 120, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px system-ui, sans-serif';
      ctx.fillText('Select your known technologies, tools, and target career:', 120, 185);

      // Skills grid
      const skills = [
        { name: 'Python & Object Oriented Design', checked: true },
        { name: 'Java / C++ Core Fundamentals', checked: true },
        { name: 'SQL & Relational Database Design', checked: true },
        { name: 'Data Structures & Algorithms (DSA)', checked: true },
        { name: 'PyTorch / Neural Network Architectures', checked: false },
        { name: 'Docker Containerization & MLOps CI/CD', checked: false }
      ];

      skills.forEach((s, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 120 + col * 520;
        const y = 220 + row * 85;

        ctx.fillStyle = s.checked ? 'rgba(37, 99, 235, 0.2)' : 'rgba(30, 41, 59, 0.8)';
        ctx.strokeStyle = s.checked ? '#38bdf8' : '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, 480, 65, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = s.checked ? '#38bdf8' : '#ffffff';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText(`${s.checked ? '☑' : '☐'} ${s.name}`, x + 25, y + 40);
      });

      // Continue button
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(width - 380, 500, 260, 48, 12);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Synthesize AI Roadmap →', width - 250, 530);
    }
    // SCENE 3: CAREER MATCHES & SKILL GAP RADAR (45 - 68s)
    else if (timeSec < 68) {
      // Left Top Match Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, 95, 540, 510, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('TOP AI CAREER RECOMMENDATION', 100, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px system-ui, sans-serif';
      ctx.fillText('Lead ML Engineer', 100, 185);

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('94% Match Probability', 100, 230);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Estimated Salary: $115,000 - $145,000 / yr', 100, 275);
      ctx.fillText('Time to Job Readiness: 3.5 Months (12 Weeks)', 100, 310);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('Identified Strengths:', 100, 370);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText('• Strong Core Python & Object-Oriented Java (92%)', 100, 400);
      ctx.fillText('• Relational Database Design & Querying (88%)', 100, 430);

      // Right Skill Gap Card
      ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(640, 95, 570, 510, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('SKILL GAP DIAGNOSTIC RADAR', 670, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.fillText('Critical Missing Competencies to Bridge:', 670, 180);

      const gaps = [
        { name: 'PyTorch Deep Learning & Tensor Ops', gap: '45% Gap', color: '#f43f5e' },
        { name: 'Distributed Systems & Docker Containerization', gap: '55% Gap', color: '#f43f5e' },
        { name: 'System Design & Scalable REST APIs', gap: '30% Gap', color: '#eab308' }
      ];

      gaps.forEach((g, idx) => {
        const y = 230 + idx * 95;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.beginPath();
        ctx.roundRect(670, y, 510, 75, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.fillText(g.name, 690, y + 33);

        ctx.fillStyle = g.color;
        ctx.font = 'bold 14px monospace';
        ctx.fillText(`⚠️ ${g.gap} (Priority High)`, 690, y + 60);
      });
    }
    // SCENE 4: 5-PHASE DYNAMIC ROADMAP (68 - 92s)
    else if (timeSec < 92) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FEATURE WALKTHROUGH: DYNAMIC ROADMAP', width / 2, 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px system-ui, sans-serif';
      ctx.fillText('Dynamic 5-Phase Personalized Learning Pathway', width / 2, 160);

      const phases = [
        { name: 'Phase 1: Foundations', time: 'Wks 1-3', status: '✓ In Progress' },
        { name: 'Phase 2: Algorithmic Mastery', time: 'Wks 4-6', status: '🔒 Next' },
        { name: 'Phase 3: Production Scale', time: 'Wks 7-9', status: '🔒 Queued' },
        { name: 'Phase 4: Capstone Project', time: 'Wks 10-11', status: '🔒 Queued' },
        { name: 'Phase 5: System Design & Interviews', time: 'Wk 12', status: '🔒 Target' }
      ];

      phases.forEach((p, idx) => {
        const x = 70 + idx * 228;
        ctx.fillStyle = idx === 0 ? 'rgba(30, 58, 138, 0.8)' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = idx === 0 ? '#60a5fa' : '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, 200, 210, 380, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = idx === 0 ? '#93c5fd' : '#94a3b8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`PHASE 0${idx + 1}`, x + 105, 235);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px system-ui, sans-serif';
        ctx.fillText(p.name, x + 105, 275);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '13px monospace';
        ctx.fillText(p.time, x + 105, 315);

        // Milestone preview inside Phase 1
        if (idx === 0) {
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.roundRect(x + 15, 350, 180, 140, 10);
          ctx.fill();

          ctx.fillStyle = '#67e8f9';
          ctx.font = 'bold 12px system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('☑ PyTorch Tensors', x + 25, 380);
          ctx.fillText('☑ CNN Architecture', x + 25, 410);
          ctx.fillText('☐ DataLoaders Prep', x + 25, 440);
          ctx.fillText('☐ Loss Optimization', x + 25, 470);
        }
      });
    }
    // SCENE 5: VIDEO CLASSROOM & LIVE SANDBOX (92 - 116s)
    else if (timeSec < 116) {
      // Left Video Preview
      ctx.fillStyle = '#020617';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, 95, 520, 500, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(70, 95, 520, 280);

      // Play Icon in video
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(330, 235, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(320, 220); ctx.lineTo(350, 235); ctx.lineTo(320, 250);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Lecture: Deep Learning & PyTorch Pipelines', 95, 415);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px monospace';
      ctx.fillText('Chapters: 01:00 Intro • 05:20 Models • 09:10 Code Drill', 95, 450);
      ctx.fillText('Quiz: Test your understanding (Score 100%)', 95, 485);

      // Right Code Editor & Terminal
      ctx.fillStyle = '#0b0f19';
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(620, 95, 590, 500, 16);
      ctx.fill();
      ctx.stroke();

      // Top Editor bar
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.roundRect(620, 95, 590, 45, [16, 16, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('💻 SkillSpire Interactive Sandbox • model.py', 645, 124);

      // Code text
      ctx.fillStyle = '#c084fc';
      ctx.font = '15px monospace';
      ctx.fillText('import torch', 645, 175);
      ctx.fillText('import torch.nn as nn', 645, 205);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('class CareerModel(nn.Module):', 645, 245);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('    def forward(self, user_skills):', 680, 280);
      ctx.fillStyle = '#4ade80';
      ctx.fillText('        return "Placement Ready 100%"', 715, 315);

      // Terminal execution box
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      ctx.roundRect(640, 360, 550, 210, 12);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('$ python model.py', 660, 395);
      ctx.fillText('> Compiling PyTorch Neural Network...', 660, 430);
      ctx.fillText('> Epoch [5/5] Loss: 0.0012 Accuracy: 98.6%', 660, 465);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('✓ Execution Success: Lead ML Engineer Ready!', 660, 505);
    }
    // SCENE 6: 24/7 AI CAREER STRATEGIST (116 - 138s)
    else if (timeSec < 138) {
      // Left AI Chat
      ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, 95, 540, 500, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('24/7 AI CAREER STRATEGIST', 100, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.fillText('Real-Time Contextual Mentorship', 100, 180);

      // Chat bubble User
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.roundRect(100, 220, 480, 55, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('👤 User: "How do I optimize Docker container builds for PyTorch?"', 115, 253);

      // Chat bubble AI
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(100, 290, 480, 120, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#a5b4fc';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('🤖 AI Mentor: "Use multi-stage Docker builds with a CUDA base', 115, 325);
      ctx.fillText('image, leverage wheel caches, and pin exact torch versions', 115, 355);
      ctx.fillText('as outlined in Phase 3 of your roadmap!"', 115, 385);

      // Right Features Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(640, 95, 570, 500, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('INTELLIGENT REASONING ENGINE', 670, 140);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.fillText('Powered by Gemini Multi-Turn AI', 670, 180);

      const features = [
        '• Personalized roadmap guidance tied directly to active progress',
        '• Code reviews with architectural and memory optimization tips',
        '• Realistic technical interview drills with immediate scoring',
        '• Verified compensation benchmarks and negotiation strategies'
      ];
      features.forEach((feat, i) => {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillText(feat, 670, 235 + i * 50);
      });
    }
    // SCENE 7: DAILY STUDY HABIT ENGINE & STREAKS (138 - 160s)
    else if (timeSec < 160) {
      // Left Streak Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, 95, 540, 500, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('DAILY STUDY HABIT ENGINE', 100, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px system-ui, sans-serif';
      ctx.fillText('🔥 5-Day Active Study Streak', 100, 185);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('+50 XP Earned Today • Streak Freeze Protected', 100, 230);

      // Days circle preview
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((d, i) => {
        const x = 100 + i * 68;
        ctx.fillStyle = i < 5 ? '#f59e0b' : '#334155';
        ctx.beginPath();
        ctx.arc(x + 25, 290, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = i < 5 ? '#0f172a' : '#94a3b8';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(i < 5 ? '✓' : '•', x + 25, 295);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText(d, x + 25, 330);
      });

      // Gamification perks
      ctx.textAlign = 'left';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText('⚡ Consistency Benefits:', 100, 380);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('• 3.2x higher career transition completion rate', 100, 415);
      ctx.fillText('• Automated email & browser study reminders', 100, 445);
      ctx.fillText('• Verified consistency badge on recruiter reports', 100, 475);

      // Right Notification & Milestones Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(640, 95, 570, 500, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('INTELLIGENT LEARNER NOTIFICATIONS', 670, 140);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.fillText('Automated Habit Accountability', 670, 180);

      const reminders = [
        { time: '09:00 AM', title: 'Daily Warmup: PyTorch Tensor Broadcast Drill (+25 XP)' },
        { time: '02:30 PM', title: 'Roadmap Milestone: Complete CNN Backprop Quiz' },
        { time: '08:00 PM', title: 'Streak Protection: Study session logged successfully!' }
      ];
      reminders.forEach((r, idx) => {
        const y = 230 + idx * 85;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.beginPath();
        ctx.roundRect(670, y, 510, 70, 12);
        ctx.fill();

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(r.time, 690, y + 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText(r.title, 690, y + 52);
      });
    }
    // SCENE 8: RECRUITER REPORT & CONCLUSION (160 - 180s)
    else {
      // Left Export Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, 95, 540, 500, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('1-CLICK RECRUITER EXPORT', 100, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px system-ui, sans-serif';
      ctx.fillText('Verified Career Readiness PDF', 100, 180);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('SkillSpire_Career_Readiness_Report.pdf', 100, 220);

      const items = [
        '✓ Comprehensive 94% Lead ML Engineer Competency Verification',
        '✓ Verified Completion of 12-Week Roadmap Milestones',
        '✓ Code Sandbox Repository Links & Interactive Demos',
        '✓ 5-Day Active Study Habit & Consistency Score',
        '✓ Ready to share with HR recruiters & hiring managers'
      ];
      items.forEach((item, idx) => {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText(item, 100, 275 + idx * 42);
      });

      // Right Platform Conclusion Card
      ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(640, 95, 570, 500, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#a5b4fc';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('SKILLSPIRE AI ECOSYSTEM SUMMARY', 670, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px system-ui, sans-serif';
      ctx.fillText('Your Career. Accelerated.', 670, 185);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Empowering learners worldwide with personalized AI guidance.', 670, 230);

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(670, 280, 510, 120, 16);
      ctx.fill();

      ctx.fillStyle = '#022c22';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Start Your AI Career Journey Today!', 670 + 255, 335);
      ctx.font = 'bold 16px monospace';
      ctx.fillText('🌐 https://skillspire.ai', 670 + 255, 370);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Built for Google AI Studio • Production Ready Full-Stack SaaS', 670, 450);
    }

    // Bottom Subtitle bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 520, height - 70, 1040, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`"${activeSub.narration}"`, width / 2, height - 38);
  };

  // 1. Live High-Definition Video Recording (Real-time with Narration & Background Audio)
  const startLiveFullRecording = (speedMultiplier = 1) => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsLiveRecording(true);
    setRecordingSeconds(0);
    setShowExportMenu(false);

    try {
      const canvasStream = canvas.captureStream(30);
      const audioStream = videoAudioEngine.getAudioStream();
      const audioTracks = audioStream ? audioStream.getAudioTracks() : [];
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioTracks
      ]);

      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      }

      const chunks: Blob[] = [];
      const recorder = mimeType 
        ? new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 4500000 }) 
        : new MediaRecorder(combinedStream);
      
      activeRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const rawBlob = new Blob(chunks, { type: mimeType || 'video/mp4' });
        const finalDurationMs = duration * 1000;
        const fixedBlob = await fixWebmDuration(rawBlob, finalDurationMs);
        const url = URL.createObjectURL(fixedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = videoMode === 'tutorial' 
          ? 'SkillSpire_Website_Tutorial_Video.mp4' 
          : 'SkillSpire_Competition_Pitch_Video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsLiveRecording(false);
        setRecordingSeconds(0);
      };

      recorder.start(1000);

      // Start recording timeline from 0:00
      setCurrentTime(0);
      setIsPlaying(true);
      if (!isMuted) {
        videoAudioEngine.speakNarration(activeScenes[0].narration);
        if (isMusicEnabled) videoAudioEngine.startAmbientMusic(0.08);
      }

      const startTime = Date.now();
      let lastSceneId = 1;

      const recordingInterval = window.setInterval(() => {
        const elapsedRealSec = (Date.now() - startTime) / 1000;
        const currentVideoTime = elapsedRealSec * speedMultiplier;
        setRecordingSeconds(Math.min(duration, Math.round(currentVideoTime)));
        setCurrentTime(Math.min(duration, currentVideoTime));

        renderFrameToCanvas(ctx, currentVideoTime);

        const s = activeScenes.find(x => currentVideoTime >= x.startSec && currentVideoTime < x.endSec) || activeScenes[activeScenes.length - 1];
        if (s.id !== lastSceneId) {
          lastSceneId = s.id;
          if (!isMuted) {
            videoAudioEngine.speakNarration(s.narration);
          }
        }

        if (currentVideoTime >= duration) {
          clearInterval(recordingInterval);
          liveRecordingTimerRef.current = null;
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 33);

      liveRecordingTimerRef.current = recordingInterval;
    } catch (e) {
      console.error('Recording initialization error:', e);
      setIsLiveRecording(false);
    }
  };

  const stopAndSaveCurrentRecording = () => {
    if (liveRecordingTimerRef.current) {
      clearInterval(liveRecordingTimerRef.current);
      liveRecordingTimerRef.current = null;
    }
    if (activeRecorderRef.current && activeRecorderRef.current.state === 'recording') {
      activeRecorderRef.current.stop();
    } else {
      setIsLiveRecording(false);
    }
  };

  const cancelRecording = () => {
    if (liveRecordingTimerRef.current) {
      clearInterval(liveRecordingTimerRef.current);
      liveRecordingTimerRef.current = null;
    }
    if (activeRecorderRef.current && activeRecorderRef.current.state === 'recording') {
      activeRecorderRef.current.ondataavailable = null;
      activeRecorderRef.current.onstop = null;
      activeRecorderRef.current.stop();
    }
    setIsLiveRecording(false);
    setRecordingSeconds(0);
  };

  // 2. Instant Standalone Interactive HTML5 Demo Exporter
  const handleInstantHtmlExport = () => {
    const htmlContent = createStandaloneHtmlPresentation(videoMode, activeScenes);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = videoMode === 'tutorial' 
      ? 'SkillSpire_Interactive_Tutorial_Guide.html' 
      : 'SkillSpire_Competition_Pitch_Interactive.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 3. Fast Render Multi-Frame Exporter with Exact MP4 Video File
  const handleFastExportTutorialVideo = async () => {
    if (isExportingVideo || isLiveRecording) return;
    setIsExportingVideo(true);
    setExportProgress(5);
    setShowExportMenu(false);

    try {
      const result = await generateFullLengthVideo({
        duration,
        width: 1280,
        height: 720,
        fps: 15,
        renderFrame: (ctx, timeSec) => {
          renderFrameToCanvas(ctx, timeSec);
        },
        onProgress: (pct) => {
          setExportProgress(pct);
        },
        preferredFormat: 'mp4'
      });

      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = videoMode === 'tutorial' 
        ? 'SkillSpire_Website_Tutorial_Video.mp4' 
        : 'SkillSpire_Competition_Demo_Pitch.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export error:', e);
      // Fallback to standalone interactive HTML presentation if video encoding was constrained
      handleInstantHtmlExport();
    } finally {
      setIsExportingVideo(false);
      setExportProgress(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-slate-950 text-white rounded-3xl overflow-hidden border border-indigo-500/40 shadow-2xl flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* ========================================================================= */}
      {/* TOP HEADER: MODE TOGGLE & EXPORT OPTIONS */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 relative z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                SkillSpire AI — {videoMode === 'tutorial' ? 'Website Instruction & Tutorial Video' : 'Official Competition Demo'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[10px] tracking-wider uppercase">
                {videoMode === 'tutorial' ? 'Full 3:00 Video Guide' : '75s Pitch Edition'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Interactive demonstration of the real SkillSpire AI website interface, diagnostics, 5-phase roadmaps & code classroom.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex bg-slate-800/90 rounded-xl p-1 border border-slate-700">
            <button
              type="button"
              onClick={() => handleModeSwitch('tutorial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                videoMode === 'tutorial'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Website Tutorial (3:00)</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('pitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                videoMode === 'pitch'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Pitch Showcase</span>
            </button>
          </div>

          {/* Download Dropdown Toggle */}
          <div className="relative">
            <button
              id="download-full-video-dropdown-btn"
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExportingVideo || isLiveRecording}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isLiveRecording
                  ? `Recording (${formatTime(recordingSeconds)} / ${formatTime(duration)})`
                  : isExportingVideo
                  ? `Rendering (${exportProgress}%)`
                  : 'Download Full Video (MP4)'}
              </span>
            </button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-3.5 space-y-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Download Full 3-Minute Demo Video (.mp4)</span>
                  </div>
                  <button 
                    onClick={() => setShowExportMenu(false)}
                    className="text-slate-400 hover:text-white text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Option 1: Direct 3:00 MP4 Video Download */}
                <button
                  type="button"
                  onClick={handleFastExportTutorialVideo}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 transition-all group cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>1. Direct Full 3-Minute Video Download (.mp4)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Encodes all 3,600 frames across 8 complete scenes into a genuine <strong>3 minute (180s)</strong> MP4 video file playable in Windows Media Player, QuickTime, VLC & file explorer.
                  </p>
                </button>

                {/* Option 2: Live Recording with Voiceover */}
                <button
                  type="button"
                  onClick={() => startLiveFullRecording(1)}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-blue-950/60 border border-slate-700 hover:border-blue-500/50 transition-all group cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                      <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span>2. Live Recording with Speech Narration (.mp4)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      Voice Narration
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Records the player live in real-time with continuous speech voiceover and background music across all 8 scenes.
                  </p>
                </button>

                {/* Option 3: Instant Standalone Presentation */}
                <button
                  type="button"
                  onClick={handleInstantHtmlExport}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 transition-all group cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                      <Sparkle className="w-4 h-4" />
                      <span>3. Instant Standalone Demo Presentation (.html)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      Instant (0 Wait)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Instant single-file offline video presentation. Opens anywhere with full audio, scrubber, and all 8 scenes.
                  </p>
                </button>
              </div>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE RECORDING ACTIVE HUD OVERLAY */}
      {/* ========================================================================= */}
      {isLiveRecording && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-b border-rose-500/40 px-5 py-3 flex flex-wrap items-center justify-between gap-3 z-30 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-rose-400 text-xs tracking-wider">
                  RECORDING FULL DEMO VIDEO IN PROGRESS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold font-mono">
                  {formatTime(recordingSeconds)} / {formatTime(duration)} ({Math.round((recordingSeconds / duration) * 100)}%)
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Recording Step {activeScene.stepNumber}/{activeScenes.length}: <strong>{activeScene.title}</strong> with voiceover & UI walkthrough.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stopAndSaveCurrentRecording}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Finish & Save Video Now</span>
            </button>
            <button
              type="button"
              onClick={cancelRecording}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO RENDERING & EXPORT ACTIVE HUD OVERLAY */}
      {/* ========================================================================= */}
      {isExportingVideo && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/40 px-5 py-3 flex flex-wrap items-center justify-between gap-3 z-30 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-emerald-400 text-xs tracking-wider">
                  GENERATING HIGH-DEFINITION MP4 VIDEO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                  {exportProgress}% Encoded
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Encoding HD frames... Your download will begin automatically as <code>SkillSpire_Website_Tutorial_Video.mp4</code>.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-slate-800 rounded-full h-2 overflow-hidden border border-emerald-500/30">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-150 rounded-full"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATED BROWSER / WEBSITE INTERFACE VIDEO STAGE */}
      {/* ========================================================================= */}
      <div 
        onClick={togglePlay}
        className="relative w-full aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden flex flex-col cursor-pointer group"
      >
        {/* Simulated Browser Chrome Top Header */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between select-none z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="ml-3 px-3 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-400 flex items-center gap-1.5">
              <span>🔒</span>
              <span>https://skillspire.ai</span>
              <span className="text-slate-500">/app/{activeScene.id === 1 ? '' : activeScene.id === 2 ? 'onboarding' : 'dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[10px]">
              {activeScene.badge}
            </span>
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              Step {activeScene.stepNumber}/{activeScenes.length}
            </span>
          </div>
        </div>

        {/* Dynamic Instructional Callout Banner overlay */}
        <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 border-b border-indigo-500/30 px-5 py-2 z-20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-amber-300">Tutorial Guide:</span>
            <span className="font-semibold text-white truncate">{activeScene.instructionTitle}</span>
          </div>
          <span className="text-[11px] text-slate-300 hidden md:inline">
            {activeScene.instructionText}
          </span>
        </div>

        {/* Main Stage: Simulated Realistic Website Content */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-3 sm:p-5">
          
          {/* Glowing particle ambient effects */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* ========================================================================= */}
          {/* SCENE 1: LANDING PAGE & INSTANT START */}
          {/* ========================================================================= */}
          {activeScene.id === 1 && (
            <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-300 space-y-4">
              {/* Top Simulated Navbar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">SkillSpire AI</span>
                  <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">Your skills today. Your career tomorrow.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-200">
                    ⚡ Try Demo Profile
                  </div>
                  <div className="px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-[11px]">
                    Take Assessment
                  </div>
                </div>
              </div>

              {/* Simulated Hero Section */}
              <div className="text-center space-y-2 py-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  <Sparkles className="w-3 h-3" />
                  <span>Next-Gen Career Diagnostics & Video Roadmaps</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-950">
                  Your skills today. <span className="text-blue-600">Your career tomorrow.</span>
                </h1>
                <p className="text-xs text-slate-600 max-w-lg mx-auto">
                  Discover matching career paths, identify critical skill gaps, and follow structured video roadmaps.
                </p>
              </div>

              {/* Simulated Conversational Goal Input Bar */}
              <div className="max-w-xl mx-auto p-1.5 rounded-xl bg-slate-50 border-2 border-indigo-300 shadow-sm flex items-center gap-2">
                <span className="text-slate-400 text-xs pl-2">✍️</span>
                <span className="text-xs font-mono text-slate-800 flex-1">
                  2nd year BTech, know Java & SQL, want a 12 LPA SDE role...
                </span>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Build Path</span>
                </div>
              </div>

              {/* Quick Persona Pills */}
              <div className="grid grid-cols-3 gap-2 max-w-xl mx-auto pt-1">
                {[
                  { name: 'Aarav (CS)', role: 'AI Engineer' },
                  { name: 'Neha (IT)', role: 'SDE 1' },
                  { name: 'Rohan (ECE)', role: 'Cloud Architect' }
                ].map((p, i) => (
                  <div key={i} className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-center">
                    <p className="text-[11px] font-bold text-slate-900">{p.name}</p>
                    <p className="text-[9px] text-blue-600 font-semibold">{p.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 2: ONBOARDING & PROFILE SETUP */}
          {/* ========================================================================= */}
          {activeScene.id === 2 && (
            <div className="w-full max-w-3xl bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-700 animate-in fade-in duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">ONBOARDING WIZARD • STEP 2 OF 3</span>
                  <h3 className="text-base sm:text-lg font-bold text-white">Select Your Technical Competencies</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                  66% Complete
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Python', checked: true, tag: 'Proficient' },
                  { name: 'Java & OOP', checked: true, tag: 'Intermediate' },
                  { name: 'SQL & DBMS', checked: true, tag: 'Proficient' },
                  { name: 'Data Structures', checked: true, tag: 'Intermediate' },
                  { name: 'PyTorch / ML', checked: false, tag: 'To Learn' },
                  { name: 'Cloud & Docker', checked: false, tag: 'To Learn' }
                ].map((skill, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                      skill.checked 
                        ? 'bg-blue-600/20 border-blue-400 text-white shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                        skill.checked ? 'bg-blue-500 text-white' : 'border border-slate-700'
                      }`}>
                        {skill.checked && '✓'}
                      </div>
                      <span className="text-xs font-bold">{skill.name}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      skill.checked ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {skill.tag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400">Target Role: <strong>Machine Learning Engineer</strong></span>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Skill Gaps with AI →</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 3: CAREER MATCHES & SKILL GAP RADAR */}
          {/* ========================================================================= */}
          {activeScene.id === 3 && (
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-300">
              {/* Career Match Card */}
              <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-blue-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    PRIMARY MATCH
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                    94% MATCH
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">Lead ML Engineer</h3>
                  <p className="text-xs text-slate-400 font-medium">Estimated Range: $115,000 - $145,000 / yr</p>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Python & Core Algorithms</span>
                    <span className="text-emerald-400 font-bold">92% Ready</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[92%]" />
                  </div>

                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>Relational SQL & Pipelines</span>
                    <span className="text-emerald-400 font-bold">88% Ready</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[88%]" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Target Timeline: <strong>3.5 Months</strong></span>
                  <span className="text-blue-400 font-bold">View Gap Breakdown →</span>
                </div>
              </div>

              {/* Skill Gap Radar Card */}
              <div className="bg-indigo-950/60 rounded-2xl p-4 sm:p-5 border border-indigo-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                    GAP ANALYZER
                  </span>
                  <span className="text-xs text-amber-400 font-bold">3 Gaps to Bridge</span>
                </div>

                <h4 className="text-sm font-bold text-white">High-Priority Missing Competencies:</h4>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">PyTorch Deep Learning</p>
                      <p className="text-[10px] text-rose-400">Critical Gap (45% Competency)</p>
                    </div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">Urgent</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Distributed Scale & Docker</p>
                      <p className="text-[10px] text-amber-400">Moderate Gap (55% Competency)</p>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Phase 3</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 pt-1">
                  💡 Bridged directly via the customized 5-Phase Dynamic Roadmap.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 4: DYNAMIC 5-PHASE ROADMAP */}
          {/* ========================================================================= */}
          {activeScene.id === 4 && (
            <div className="w-full max-w-4xl bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-2xl animate-in fade-in duration-300 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">ROADMAP TIMELINE • 12 WEEKS</span>
                  <h3 className="text-base font-extrabold text-white">Personalized 5-Phase Career Fast Track</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  Phase 1: 35% Progress
                </div>
              </div>

              {/* 5 Phase horizontal pill steps */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { step: '01', name: 'Foundations', active: true },
                  { step: '02', name: 'Algorithmic', active: false },
                  { step: '03', name: 'Scale & Ops', active: false },
                  { step: '04', name: 'Capstone', active: false },
                  { step: '05', name: 'Interview', active: false }
                ].map((ph, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      ph.active 
                        ? 'bg-blue-600/30 border-blue-400 text-white shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[9px] font-mono block text-slate-400">PHASE {ph.step}</span>
                    <span className="text-[11px] font-bold block text-white truncate">{ph.name}</span>
                  </div>
                ))}
              </div>

              {/* Expanded Phase 1 Milestone items */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Phase 1 Milestones: PyTorch & Neural Foundations</span>
                  <span className="text-[10px] font-mono text-slate-400">Est. 18 hrs</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-4 h-4 rounded bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">✓</span>
                    <span>Master PyTorch Tensors & Matrix Computations</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-4 h-4 rounded bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">✓</span>
                    <span>Implement Forward & Backward Propagation Loops</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center text-[10px]">☐</span>
                    <span>Build Convolutional Classifier on Custom Dataset</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 5: VIDEO CLASSROOM & LIVE SANDBOX */}
          {/* ========================================================================= */}
          {activeScene.id === 5 && (
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-300">
              {/* Video Player Mockup */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col">
                <div className="aspect-video bg-slate-950 relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span>04:15 / 18:30</span>
                    <span className="text-emerald-400 font-bold">1080p HD</span>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-white">Lecture 03: PyTorch Neural Architectures</h4>
                  <p className="text-[10px] text-slate-400">Chapters: 01:00 Intro • 04:15 Forward Pass • 12:00 Quizzes</p>
                </div>
              </div>

              {/* Code Sandbox Mockup */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-xl flex flex-col">
                <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">💻 model.py (Live Sandbox)</span>
                  <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Live Compiler
                  </div>
                </div>

                <div className="p-3 font-mono text-[11px] space-y-1 bg-slate-950/80 flex-1">
                  <div><span className="text-purple-400">import</span> <span className="text-sky-300">torch</span></div>
                  <div><span className="text-purple-400">class</span> <span className="text-amber-300">Model</span>(torch.nn.Module):</div>
                  <div className="pl-4"><span className="text-sky-300">def</span> <span className="text-blue-400">forward</span>(self, x):</div>
                  <div className="pl-8"><span className="text-purple-400">return</span> <span className="text-emerald-300">"Placement Ready 100%"</span></div>
                </div>

                <div className="bg-slate-950 px-3 py-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                  <span>&gt; Output: 100% Accuracy Achieved</span>
                  <span className="text-slate-400">0.04s Execution</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 6: 24/7 AI CAREER STRATEGIST */}
          {/* ========================================================================= */}
          {activeScene.id === 6 && (
            <div className="w-full max-w-3xl bg-slate-900 rounded-2xl p-5 border border-purple-500/40 shadow-2xl animate-in fade-in duration-300 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">24/7 Contextual AI Career Strategist</h4>
                    <p className="text-[10px] text-purple-300">State-of-the-Art Architecture & Code Mentoring</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  AI ONLINE
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  <span className="font-bold text-blue-400">Candidate:</span> "How do I optimize multi-stage Docker container builds for large ML PyTorch inference pipelines?"
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-100 space-y-1.5">
                  <p className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SkillSpire AI Mentor:</span>
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    "Separate the build dependencies into a dedicated builder stage, install wheels into a virtual environment, and copy only the runtime artifacts to a slim Debian base. This reduces image size from 4.2GB to 480MB—exactly as practiced in Phase 3 Milestone 2!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 7: DAILY STUDY HABIT ENGINE & STREAKS */}
          {/* ========================================================================= */}
          {activeScene.id === 7 && (
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">🔥 5-Day Active Study Streak</h4>
                      <p className="text-[10px] text-slate-300">+50 XP Earned Today • 12 Day Personal Best</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                    PROTECTED
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 pt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div 
                      key={i} 
                      className={`p-2 rounded-lg text-center font-mono text-xs ${
                        i < 5 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{day}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-300">Daily habit tracking increases course completion rates by 3.8x.</p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 shadow-xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                    RETENTION BOOSTER
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">Smart Adaptive Quizzes & Spaced Repetition</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Retain critical algorithms with flash diagnostics triggered before every lecture.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">Accuracy: 96.4%</span>
                  <span className="text-indigo-300">Rank #12 on Leaderboard</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 8: VERIFIED RECRUITER EXPORT & SUMMARY */}
          {/* ========================================================================= */}
          {activeScene.id === 8 && (
            <div className="w-full max-w-4xl bg-slate-900 rounded-2xl p-5 border border-emerald-500/50 shadow-2xl animate-in fade-in duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Verified Career Readiness Portfolio</h4>
                    <p className="text-[10px] text-slate-300">SkillSpire_Career_Readiness_Report.pdf (Cryptographically Signed)</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md">
                  <Download className="w-3.5 h-3.5 stroke-[3]" />
                  <span>1-Click PDF Export</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-mono">ASSESSED SKILLS</p>
                  <p className="text-lg font-black text-white">18 Verified</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-mono">PRIMARY ROLE MATCH</p>
                  <p className="text-lg font-black text-emerald-400">94% Lead ML</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-[10px] text-slate-400 font-mono">INTERVIEW READINESS</p>
                  <p className="text-lg font-black text-blue-400">Placement Ready</p>
                </div>
              </div>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-300 font-medium">
                  SkillSpire AI bridges the global engineering talent gap. Transform your career today!
                </p>
              </div>
            </div>
          )}

          {/* Animated Virtual Cursor Simulating User Navigation */}
          <div 
            className="absolute pointer-events-none transition-all duration-700 ease-out z-30 flex items-center gap-1.5"
            style={{
              left: `${activeScene.cursorTarget.x}%`,
              top: `${activeScene.cursorTarget.y}%`
            }}
          >
            <div className="relative">
              <MousePointer2 className="w-6 h-6 text-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] fill-amber-400" />
              <span className="absolute -top-1 -left-1 w-8 h-8 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
            </div>
            <div className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-amber-400/50 text-[10px] font-mono text-amber-300 shadow-lg whitespace-nowrap">
              {activeScene.cursorTarget.label}
            </div>
          </div>

          {/* Subtitles Overlay */}
          {showSubtitles && (
            <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex justify-center">
              <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10 shadow-xl max-w-2xl transition-all">
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                  "{activeScene.narration}"
                </p>
              </div>
            </div>
          )}

          {/* Big Play Overlay Button */}
          {!isPlaying && (
            <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center transition-all">
              <button
                id="video-tutorial-play-overlay-btn"
                type="button"
                onClick={togglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/30"
              >
                <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIMELINE & CONTROLS TOOLBAR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3.5 border-t border-slate-800 space-y-3">
        {/* Scrubber */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="font-bold text-slate-200">{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold">{activeScene.title}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              handleSeek(pos * duration);
            }}
            className="relative w-full h-2.5 bg-slate-800 hover:h-3.5 rounded-full overflow-hidden cursor-pointer transition-all group"
          >
            {activeScenes.map(s => (
              <div 
                key={s.id}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
                style={{ left: `${(s.startSec / duration) * 100}%` }}
                title={s.title}
              />
            ))}

            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-full transition-all duration-75"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              id="tutorial-video-play-btn"
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => handleSeek(0)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart Tutorial Video (0:00)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="tutorial-video-mute-btn"
              type="button"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-colors ${
                isMuted ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMusicEnabled(!isMusicEnabled)}
              className={`p-2 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold ${
                isMusicEnabled ? 'text-amber-300 bg-amber-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">BGM</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded-xl transition-colors text-xs flex items-center gap-1 font-semibold ${
                showSubtitles ? 'text-blue-300 bg-blue-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CC</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed */}
            <div className="flex bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
              {[1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    playbackSpeed === speed ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Direct MP4 Exporter */}
            <button
              id="download-tutorial-mp4-toolbar-btn"
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExportingVideo || isLiveRecording}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Download Full 3:00 Video (180s)"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {isLiveRecording
                  ? `Recording (${formatTime(recordingSeconds)})`
                  : isExportingVideo
                  ? `Rendering (${exportProgress}%)`
                  : 'Download Full Video (3:00)'}
              </span>
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Chapter / Scene Selector */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 font-bold uppercase text-[10px] mr-1 shrink-0">Steps:</span>
          {activeScenes.map(scene => {
            const isCurrent = activeScene.id === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSeek(scene.startSec)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  isCurrent 
                    ? 'bg-blue-600 text-white font-bold shadow-xs' 
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{scene.stepNumber}.</span>
                <span>{scene.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <canvas ref={hiddenCanvasRef} width={1280} height={720} className="hidden" />
    </div>
  );
};
