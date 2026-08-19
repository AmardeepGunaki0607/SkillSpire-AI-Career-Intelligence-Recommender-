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
  Shield,
  Zap,
  Terminal,
  ArrowRight,
  ArrowDown,
  FileCode,
  Share2,
  Award,
  BookOpen,
  Subtitles,
  Music,
  Check,
  Film
} from 'lucide-react';
import { videoAudioEngine } from '../lib/videoAudio';

interface VideoScene {
  id: number;
  title: string;
  startSec: number;
  endSec: number;
  narration: string;
}

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 1,
    title: 'Welcome & Title',
    startSec: 0,
    endSec: 7,
    narration: "Welcome to SkillSpire AI. In this lesson, let's understand the fundamentals of Java."
  },
  {
    id: 2,
    title: 'What is Java?',
    startSec: 7,
    endSec: 18,
    narration: "Java is a popular, object-oriented programming language used to build applications across many platforms."
  },
  {
    id: 3,
    title: '4 Core Pillars',
    startSec: 18,
    endSec: 30,
    narration: "Java is known for being platform independent, object-oriented, secure, and robust."
  },
  {
    id: 4,
    title: 'Your First Java Program',
    startSec: 30,
    endSec: 45,
    narration: "Here is a simple Java program. The main method is the starting point of execution, and println displays our message."
  },
  {
    id: 5,
    title: 'Your Java Journey Roadmap',
    startSec: 45,
    endSec: 54,
    narration: "After mastering the basics, continue with object-oriented programming, collections, exception handling, and data structures."
  },
  {
    id: 6,
    title: 'Next Steps & Outro',
    startSec: 54,
    endSec: 60,
    narration: "Next, let's explore object-oriented programming. Keep learning with SkillSpire AI."
  }
];

interface SkillSpireMicroVideoPlayerProps {
  onComplete?: () => void;
  isCompleted?: boolean;
  autoPlay?: boolean;
  onDownloadKit?: () => void;
}

export const SkillSpireMicroVideoPlayer: React.FC<SkillSpireMicroVideoPlayerProps> = ({
  onComplete,
  isCompleted = false,
  autoPlay = false,
  onDownloadKit
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(isCompleted);
  const [copiedCode, setCopiedCode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const currentSceneIdRef = useRef<number>(1);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  const duration = 60; // Exact 60 seconds

  // Determine current active scene
  const activeScene = VIDEO_SCENES.find(
    s => currentTime >= s.startSec && currentTime < s.endSec
  ) || VIDEO_SCENES[VIDEO_SCENES.length - 1];

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
  }, [activeScene.id, isPlaying, isMuted]);

  // Ambient Music Control
  useEffect(() => {
    if (isPlaying && isMusicEnabled && !isMuted) {
      videoAudioEngine.startAmbientMusic(0.06);
    } else {
      videoAudioEngine.stopAmbientMusic();
    }
  }, [isPlaying, isMusicEnabled, isMuted]);

  // Main Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
          setHasCompleted(true);
          if (onComplete) onComplete();
          return duration;
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, duration, onComplete]);

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      currentSceneIdRef.current = 1;
      setIsPlaying(true);
      if (!isMuted) {
        videoAudioEngine.speakNarration(VIDEO_SCENES[0].narration);
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
    const targetScene = VIDEO_SCENES.find(
      s => clamped >= s.startSec && clamped < s.endSec
    ) || VIDEO_SCENES[0];
    
    currentSceneIdRef.current = targetScene.id;
    if (isPlaying && !isMuted) {
      videoAudioEngine.speakNarration(targetScene.narration);
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
      if (isMusicEnabled) {
        videoAudioEngine.startAmbientMusic(0.06);
      }
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

  const copyJavaCode = () => {
    const code = `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, SkillSpire!");\n    }\n}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download Video Package & Generated Lesson Assets
  const handleDownloadLesson = () => {
    const code = `/**\n * SkillSpire AI - Java Fundamentals Starter\n * Lesson: Java Fundamentals (Micro-Learning 60s)\n * Generated on SkillSpire AI Platform\n */\npublic class Main {\n    public static void main(String[] args) {\n        // The main method is the entry point of execution in Java\n        System.out.println("Hello, SkillSpire!");\n    }\n}\n`;
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SkillSpire_Java_Fundamentals_Main.java';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onDownloadKit) {
      onDownloadKit();
    }
  };

  // Helper function to render a crisp 1080p/720p frame onto canvas
  const renderFrameToCanvas = (ctx: CanvasRenderingContext2D, timeSec: number) => {
    const width = 1280;
    const height = 720;

    // Dark Background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Accent glows
    ctx.save();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.beginPath();
    ctx.arc(300, 200, 260, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(147, 51, 234, 0.12)';
    ctx.beginPath();
    ctx.arc(980, 500, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // SkillSpire Header Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SKILLSPIRE AI', 60, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillText('Java Fundamentals • 60s Micro-Learning', 60, 85);

    // Scene Rendering based on timeSec
    if (timeSec < 7) {
      // Scene 1
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('WELCOME TO SKILLSPIRE AI', width / 2, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px system-ui, sans-serif';
      ctx.fillText('Java Fundamentals', width / 2, 330);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillText('Introduction for Beginners • Core Architecture & Syntax', width / 2, 380);
    } else if (timeSec < 18) {
      // Scene 2: What is Java
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CORE FOUNDATION', width / 2, 180);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 42px system-ui, sans-serif';
      ctx.fillText('What is Java?', width / 2, 235);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText('A popular, object-oriented language used across enterprise systems and platforms.', width / 2, 275);

      // 3 cards
      const cards = ['Enterprise Backends', 'Desktop & Mobile', 'Cloud & Big Data'];
      cards.forEach((c, idx) => {
        const x = 180 + idx * 320;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, 340, 280, 160, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(c, x + 24, 400);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Scalable Architecture', x + 24, 435);
      });
    } else if (timeSec < 30) {
      // Scene 3: 4 Pillars
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CORE PILLARS', width / 2, 180);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px system-ui, sans-serif';
      ctx.fillText('4 Core Pillars of Java', width / 2, 235);

      const pillars = ['Platform Independent', 'Object-Oriented', 'Secure', 'Robust'];
      pillars.forEach((p, idx) => {
        const x = 100 + idx * 270;
        ctx.fillStyle = 'rgba(30, 58, 138, 0.25)';
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, 320, 250, 180, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`0${idx + 1}`, x + 24, 370);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.fillText(p, x + 24, 415);
      });
    } else if (timeSec < 45) {
      // Scene 4: Code Editor
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(240, 160, 800, 360, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(240, 160, 800, 50, [16, 16, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Main.java', 300, 192);

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('public class ', 280, 260);
      ctx.fillStyle = '#fde047';
      ctx.fillText('Main {', 420, 260);

      ctx.fillStyle = '#c084fc';
      ctx.fillText('    public static void ', 280, 305);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('main(String[] args) {', 500, 305);

      ctx.fillStyle = '#34d399';
      ctx.fillText('        System.out.println("Hello, SkillSpire!");', 280, 350);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('    }', 280, 395);
      ctx.fillText('}', 280, 440);

      // Console output
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(240, 460, 800, 60);
      ctx.fillStyle = '#4ade80';
      ctx.font = '15px monospace';
      ctx.fillText('> Output: Hello, SkillSpire!', 280, 498);
    } else if (timeSec < 54) {
      // Scene 5: Roadmap
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LEARNING PATHWAY', width / 2, 180);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px system-ui, sans-serif';
      ctx.fillText('Your Java Journey', width / 2, 235);

      const steps = ['Java Basics', 'OOP', 'Collections', 'Exceptions', 'DSA'];
      steps.forEach((s, idx) => {
        const x = 110 + idx * 215;
        ctx.fillStyle = 'rgba(79, 70, 229, 0.3)';
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, 320, 195, 140, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a5b4fc';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`STEP ${idx + 1}`, x + 97, 365);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 17px system-ui, sans-serif';
        ctx.fillText(s, x + 97, 405);
      });
    } else {
      // Scene 6: Outro
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('UP NEXT IN YOUR ROADMAP', width / 2, 240);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px system-ui, sans-serif';
      ctx.fillText('NEXT: Java OOP', width / 2, 310);

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('Keep Learning. Keep Growing.', width / 2, 370);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('SkillSpire AI Micro-Learning Platform', width / 2, 430);
    }

    // Subtitles at bottom
    const activeSub = VIDEO_SCENES.find(s => timeSec >= s.startSec && timeSec < s.endSec) || VIDEO_SCENES[0];
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 450, height - 70, 900, 50, 12);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`"${activeSub.narration}"`, width / 2, height - 38);
  };

  // Record & Download real 60-second video stream via Canvas & MediaRecorder API
  const handleExportFullVideo = async () => {
    if (isExportingVideo) return;
    setIsExportingVideo(true);
    setExportProgress(5);

    try {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) throw new Error('Canvas not found');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('2D context not found');

      // Check MediaRecorder support
      if (typeof MediaRecorder !== 'undefined' && canvas.captureStream) {
        const stream = canvas.captureStream(30); // 30 fps
        const chunks: Blob[] = [];
        
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

        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        const recordingCompletePromise = new Promise<Blob>((resolve) => {
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: mimeType || 'video/mp4' });
            resolve(blob);
          };
        });

        recorder.start();

        // Fast render 60 seconds of frames
        const totalDuration = 60;
        const fps = 30;
        const totalFrames = totalDuration * fps;
        const frameIntervalSec = 1 / fps;

        for (let f = 0; f < totalFrames; f += 2) {
          const t = f * frameIntervalSec;
          renderFrameToCanvas(ctx, t);
          if (f % 40 === 0) {
            setExportProgress(Math.min(95, Math.round((f / totalFrames) * 100)));
            await new Promise(r => setTimeout(r, 8));
          }
        }

        renderFrameToCanvas(ctx, 59.9);
        await new Promise(r => setTimeout(r, 150));
        recorder.stop();

        const videoBlob = await recordingCompletePromise;
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SkillSpire_Java_Fundamentals_60s.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback transcript download if MediaRecorder is unavailable
        const summaryText = `SKILLSPIRE AI — Java Fundamentals (60-Second Micro-Learning)\n=======================================================\nScene 1 (0-7s): SkillSpire AI - Java Fundamentals\nScene 2 (7-18s): What is Java? (Object-Oriented, Cross-Platform)\nScene 3 (18-30s): 4 Core Pillars (Platform Independent, OOP, Secure, Robust)\nScene 4 (30-45s): First Java Program (Main.java with main method and println)\nScene 5 (45-54s): Your Java Journey (Java Basics -> OOP -> Collections -> Exception Handling -> DSA)\nScene 6 (54-60s): NEXT: Java OOP • Keep Learning. Keep Growing.\n\nCode Included:\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, SkillSpire!");\n    }\n}\n`;
        const blob = new Blob([summaryText], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SkillSpire_Java_Fundamentals_Transcript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExportingVideo(false);
      setExportProgress(0);
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* ========================================================================= */}
      {/* PROMINENT DIRECT DOWNLOAD BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-blue-900/90 border-b border-indigo-500/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>Ready to Download Video</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">MP4</span>
            </span>
            <p className="text-[11px] text-slate-300">
              Click the button on the right to save <span className="font-mono text-indigo-200">SkillSpire_Java_Fundamentals_60s.mp4</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="direct-download-mp4-top-btn"
            type="button"
            onClick={handleExportFullVideo}
            disabled={isExportingVideo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isExportingVideo ? `Rendering MP4 (${exportProgress}%)` : 'Download MP4 Video'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadLesson}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Download Code (.java)</span>
          </button>
        </div>
      </div>
      {/* ========================================================================= */}
      {/* 16:9 VIDEO FRAME STAGE */}
      {/* ========================================================================= */}
      <div 
        onClick={togglePlay}
        className="relative w-full aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden flex items-center justify-center cursor-pointer group"
      >
        {/* Ambient Radial Lighting & Subtle Particles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Watermark & Topic Badge */}
        <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-wider text-white">SKILLSPIRE AI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">ORIGINAL</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Java Fundamentals • Micro-Lesson</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-indigo-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeScene.title}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCENE 1: 0 - 7s — Title & Brand Introduction */}
        {/* ========================================================================= */}
        {currentTime >= 0 && currentTime < 7 && (
          <div className="relative z-10 text-center px-6 max-w-2xl space-y-5 animate-in fade-in zoom-in-95 duration-500">
            {/* Animated Logo Compass */}
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 blur-xl opacity-60 animate-pulse" />
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl border border-white/20">
                <Compass className="w-10 h-10 sm:w-12 sm:h-12 animate-spin duration-1000" style={{ animationDuration: '12s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-widest text-indigo-200 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>SKILLSPIRE AI</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                Java Fundamentals
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                Introduction for Beginners • Core Architecture & Syntax
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 2: 7 - 18s — What is Java? Applications & Cross-Platform */}
        {/* ========================================================================= */}
        {currentTime >= 7 && currentTime < 18 && (
          <div className="relative z-10 px-6 sm:px-12 w-full max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Foundation</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">What is Java?</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                A high-level, class-based, object-oriented language designed for cross-platform scalability.
              </p>
            </div>

            {/* 3 Interactive Architecture Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Card 1: Enterprise Backend */}
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-indigo-500/30 hover:border-indigo-400 transition-all space-y-2 group shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Enterprise Backends</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Powering high-throughput microservices, Spring Boot, and banking APIs globally.
                </p>
              </div>

              {/* Card 2: Desktop & Mobile */}
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-blue-500/30 hover:border-blue-400 transition-all space-y-2 group shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Desktop & Mobile</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Cross-platform desktop GUIs, JavaFX, and native Android application ecosystems.
                </p>
              </div>

              {/* Card 3: Cloud & Big Data */}
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-purple-500/30 hover:border-purple-400 transition-all space-y-2 group shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Cloud & Big Data</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Core engine for Apache Kafka, Hadoop, Spark, and distributed computing nodes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 3: 18 - 30s — 4 Core Pillars (Sequential Entrance) */}
        {/* ========================================================================= */}
        {currentTime >= 18 && currentTime < 30 && (
          <div className="relative z-10 px-6 sm:px-10 w-full max-w-4xl space-y-5 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Core Architecture</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">4 Core Pillars of Java</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Pillar 1: Platform Independent */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 space-y-2 ${
                currentTime >= 18 
                  ? 'bg-blue-900/30 border-blue-400/50 shadow-lg shadow-blue-500/10 scale-100 opacity-100' 
                  : 'opacity-0 scale-90'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                  1
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">Platform Independent</h3>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  "Write Once, Run Anywhere" via bytecode execution in the JVM.
                </p>
              </div>

              {/* Pillar 2: Object-Oriented */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 space-y-2 ${
                currentTime >= 21 
                  ? 'bg-indigo-900/30 border-indigo-400/50 shadow-lg shadow-indigo-500/10 scale-100 opacity-100' 
                  : 'opacity-0 scale-90'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                  2
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">Object-Oriented</h3>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Modularity with Classes, Objects, Inheritance, and Encapsulation.
                </p>
              </div>

              {/* Pillar 3: Secure */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 space-y-2 ${
                currentTime >= 24 
                  ? 'bg-purple-900/30 border-purple-400/50 shadow-lg shadow-purple-500/10 scale-100 opacity-100' 
                  : 'opacity-0 scale-90'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                  3
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">Secure</h3>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  No explicit pointers, bytecode verification & sandboxed runtime.
                </p>
              </div>

              {/* Pillar 4: Robust */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 space-y-2 ${
                currentTime >= 27 
                  ? 'bg-emerald-900/30 border-emerald-400/50 shadow-lg shadow-emerald-500/10 scale-100 opacity-100' 
                  : 'opacity-0 scale-90'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  4
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">Robust</h3>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Automatic Garbage Collection, strict memory checks & exception safety.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 4: 30 - 45s — Realistic Code Editor (Main.java Animated Line-by-Line) */}
        {/* ========================================================================= */}
        {currentTime >= 30 && currentTime < 45 && (
          <div className="relative z-10 px-4 sm:px-8 w-full max-w-3xl space-y-3 animate-in fade-in duration-300">
            {/* Editor Window */}
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Main.java</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyJavaCode}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Code2 className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code Body with Line-by-Line Highlight */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed space-y-1.5 bg-slate-950/60">
                
                {/* Line 1 */}
                <div className={`flex items-center transition-all ${currentTime >= 30 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="w-6 text-slate-600 select-none text-right mr-4 text-xs">1</span>
                  <span>
                    <span className="text-purple-400 font-bold">public class</span> <span className="text-amber-300 font-bold">Main</span> {'{'}
                  </span>
                </div>

                {/* Line 2 (main method entrance) */}
                <div className={`flex items-center transition-all ${currentTime >= 33 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="w-6 text-slate-600 select-none text-right mr-4 text-xs">2</span>
                  <span className="pl-4">
                    <span className="text-purple-400 font-bold">public static void</span> <span className="text-blue-400 font-bold">main</span>(String[] args) {'{'}
                  </span>
                  {currentTime >= 33 && currentTime < 40 && (
                    <span className="ml-3 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-sans border border-blue-500/30 animate-pulse">
                      ← Entry Point
                    </span>
                  )}
                </div>

                {/* Line 3 (println call) */}
                <div className={`flex items-center transition-all ${currentTime >= 37 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="w-6 text-slate-600 select-none text-right mr-4 text-xs">3</span>
                  <span className="pl-8">
                    <span className="text-emerald-400">System</span>.out.<span className="text-cyan-300">println</span>(<span className="text-amber-300">"Hello, SkillSpire!"</span>);
                  </span>
                  {currentTime >= 37 && (
                    <span className="ml-3 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-sans border border-emerald-500/30 animate-pulse">
                      ← Prints to Console
                    </span>
                  )}
                </div>

                {/* Line 4 */}
                <div className={`flex items-center transition-all ${currentTime >= 40 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="w-6 text-slate-600 select-none text-right mr-4 text-xs">4</span>
                  <span className="pl-4">{'}'}</span>
                </div>

                {/* Line 5 */}
                <div className={`flex items-center transition-all ${currentTime >= 40 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="w-6 text-slate-600 select-none text-right mr-4 text-xs">5</span>
                  <span>{'}'}</span>
                </div>

              </div>

              {/* Simulated Console Terminal Output */}
              {currentTime >= 40 && (
                <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center gap-2 font-mono text-[11px] text-emerald-400 animate-in fade-in slide-in-from-bottom-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">$ java Main</span>
                  <span className="font-bold text-emerald-300 ml-2">&gt; Hello, SkillSpire!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 5: 45 - 54s — Your Java Journey Roadmap Progression */}
        {/* ========================================================================= */}
        {currentTime >= 45 && currentTime < 54 && (
          <div className="relative z-10 px-4 sm:px-8 w-full max-w-4xl space-y-4 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Curriculum Path</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Your Java Journey</h2>
            </div>

            {/* Horizontal Step Flow */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 pt-2">
              
              {/* Step 1: Java Basics */}
              <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-center flex-1 min-w-[120px] ${
                currentTime >= 45 ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg' : 'opacity-40'
              }`}>
                <span className="text-[10px] text-indigo-300 font-bold block">STEP 1</span>
                <span className="text-xs sm:text-sm font-extrabold block mt-0.5">Java Basics</span>
                <span className="text-[9px] text-slate-300 block mt-0.5">Syntax & Types</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />

              {/* Step 2: OOP */}
              <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-center flex-1 min-w-[120px] ${
                currentTime >= 47 ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg' : 'opacity-40'
              }`}>
                <span className="text-[10px] text-blue-300 font-bold block">STEP 2</span>
                <span className="text-xs sm:text-sm font-extrabold block mt-0.5">OOP Pillars</span>
                <span className="text-[9px] text-slate-300 block mt-0.5">Classes & Methods</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />

              {/* Step 3: Collections */}
              <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-center flex-1 min-w-[120px] ${
                currentTime >= 49 ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg' : 'opacity-40'
              }`}>
                <span className="text-[10px] text-purple-300 font-bold block">STEP 3</span>
                <span className="text-xs sm:text-sm font-extrabold block mt-0.5">Collections</span>
                <span className="text-[9px] text-slate-300 block mt-0.5">Lists, Maps, Sets</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />

              {/* Step 4: Exception Handling */}
              <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-center flex-1 min-w-[120px] ${
                currentTime >= 51 ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg' : 'opacity-40'
              }`}>
                <span className="text-[10px] text-amber-300 font-bold block">STEP 4</span>
                <span className="text-xs sm:text-sm font-extrabold block mt-0.5">Exceptions</span>
                <span className="text-[9px] text-slate-300 block mt-0.5">Try, Catch & Logs</span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />

              {/* Step 5: DSA */}
              <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-center flex-1 min-w-[120px] ${
                currentTime >= 52 ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg' : 'opacity-40'
              }`}>
                <span className="text-[10px] text-emerald-300 font-bold block">STEP 5</span>
                <span className="text-xs sm:text-sm font-extrabold block mt-0.5">DSA</span>
                <span className="text-[9px] text-slate-300 block mt-0.5">Trees & Graphs</span>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 6: 54 - 60s — Next Steps & SkillSpire Outro */}
        {/* ========================================================================= */}
        {currentTime >= 54 && currentTime <= 60 && (
          <div className="relative z-10 text-center px-6 max-w-xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl">
              <Compass className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block">
                Up Next in Your Roadmap
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                NEXT: Java OOP
              </h2>
              <p className="text-sm font-semibold text-purple-300">
                Keep Learning. Keep Growing.
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>SkillSpire AI Micro-Learning Platform</span>
              </span>
            </div>
          </div>
        )}

        {/* Subtitles Bar (Bottom Overlay) */}
        {showSubtitles && (
          <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex justify-center">
            <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10 shadow-lg max-w-2xl transition-all">
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                "{activeScene.narration}"
              </p>
            </div>
          </div>
        )}

        {/* Big Play Overlay Button when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center transition-all">
            <button
              id="micro-video-play-overlay-btn"
              type="button"
              onClick={togglePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/30 group-hover:shadow-blue-500/50"
            >
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CONTROLS & TIMELINE TOOLBAR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3.5 border-t border-slate-800 space-y-3">
        
        {/* Timeline Scrubber */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="font-bold text-slate-200">{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-semibold">{activeScene.title}</span>
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
            className="relative w-full h-2 bg-slate-800 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all group"
          >
            {/* Scene Markers */}
            {VIDEO_SCENES.map(s => (
              <div 
                key={s.id}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
                style={{ left: `${(s.startSec / duration) * 100}%` }}
                title={s.title}
              />
            ))}

            {/* Filled Progress Bar */}
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-75 relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          {/* Left Controls: Play/Pause, Rewind, Mute, Ambient Music */}
          <div className="flex items-center gap-2">
            <button
              id="micro-video-play-btn"
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => handleSeek(0)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart Video (0:00)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="micro-video-mute-btn"
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
                isMusicEnabled ? 'text-indigo-300 bg-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Ambient Background Music"
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
              title="Toggle Subtitles (CC)"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CC</span>
            </button>
          </div>

          {/* Right Controls: Playback Speed, Download Video, Fullscreen */}
          <div className="flex items-center gap-2">
            
            {/* Speed Selector */}
            <div className="flex bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
              {[1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-md transition-all ${
                    playbackSpeed === speed ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Download Video (.mp4) */}
            <button
              id="export-micro-video-file-btn"
              type="button"
              onClick={handleExportFullVideo}
              disabled={isExportingVideo}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Render & Download 60-Second Video (.mp4)"
            >
              <Film className="w-3.5 h-3.5 text-white" />
              <span>{isExportingVideo ? `Rendering MP4 (${exportProgress}%)` : 'Download MP4 Video'}</span>
            </button>

            {/* Download Starter Code & Lesson Pack */}
            <button
              id="download-micro-video-btn"
              type="button"
              onClick={handleDownloadLesson}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              title="Download Starter Code (Main.java)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Code (.java)</span>
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Scene Jump Quick Links */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 font-bold uppercase text-[10px] mr-1 shrink-0">Scenes:</span>
          {VIDEO_SCENES.map(scene => {
            const isCurrent = activeScene.id === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSeek(scene.startSec)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  isCurrent 
                    ? 'bg-indigo-600 text-white shadow-xs font-bold' 
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{scene.id}.</span>
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
