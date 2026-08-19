import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Sparkles,
  Play,
  Pause,
  Download,
  RotateCcw,
  Film,
  Maximize2,
  Tv,
  Smartphone,
  Layers,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wand2,
  Copy,
  Check,
  Share2,
  Zap,
  Info,
  Compass,
  BookOpen
} from 'lucide-react';
import { AnalysisResult, GeneratedVeoVideo } from '../types';
import { SkillSpireMicroVideoPlayer } from './SkillSpireMicroVideoPlayer';

interface VeoVideoStudioProps {
  analysisResult: AnalysisResult;
  initialPrompt?: string;
  onClose?: () => void;
}

const SAMPLE_PROMPTS_BY_ROLE: Record<string, string[]> = {
  'Data Scientist': [
    'Cinematic 3D animation of a multi-layer deep neural network training on real-time data, glowing synapses firing with holographic loss curve converging.',
    'Futuristic holographic dashboard visualizing high-dimensional data clustering with rotating PCA vectors and glowing clusters in dark space.',
    'Isometric tech visualization of an end-to-end data science pipeline from raw ingestion to model deployment with glowing data streams.'
  ],
  'AI / Machine Learning Engineer': [
    'High-tech 3D visualization of a Transformer attention mechanism calculating self-attention weights across token nodes with golden light pulses.',
    'Cinematic close-up of a tensor processing unit chip with glowing optical circuits executing LLM matrix multiplications in neon blue.',
    'Futuristic robotic arm learning reinforcement learning locomotion on a simulated dynamics grid with glowing reward vectors.'
  ],
  'Full Stack Developer': [
    'Isometric 3D animation of modern web application architecture: frontend browser client sending GraphQL queries to distributed microservices.',
    'Sleek futuristic code editor interface where code automatically compiles into an interactive 3D UI floating in ambient neon space.',
    'High-tech visual concept of a real-time collaborative workspace with glowing cursor avatars and instant database synchronization.'
  ],
  'Cloud / DevOps Engineer': [
    'Cinematic visualization of a Kubernetes cluster automatically scaling pods during traffic spike with glowing network mesh traffic.',
    'Futuristic automated CI/CD pipeline assembling containerized microservices and deploying safely to a global multi-region cloud mesh.',
    'High-tech server room with holographic monitoring overlays tracking zero-downtime rolling deployment with green status pulses.'
  ],
  'Cybersecurity Analyst': [
    'High-energy holographic visual of an AI-powered Security Operations Center detecting and neutralizing a distributed cyber threat in real-time.',
    'Futuristic cryptographic zero-knowledge proof verification visualized as interlocking geometric quantum shields glowing emerald green.',
    '3D network topology visualization with glowing threat vectors quarantined by adaptive digital firewall barriers.'
  ],
  'default': [
    'Cinematic 3D animation of an abstract neural network processing information with luminous glowing nodes and vibrant fluid motion.',
    'Futuristic high-tech career progression roadmap with glowing milestones, holographic badges, and dynamic particle effects.',
    'Modern isometric tech workspace with interactive floating holographic code, data charts, and smooth lighting reflections.'
  ]
};

const STYLE_ENHANCERS = [
  'Cinematic 3D motion graphics',
  '4K photorealistic lighting',
  'Isometric tech schematic',
  'Holographic dark neon aesthetic',
  'Smooth 60fps fluid dynamics simulation',
  'Futuristic UI floating elements'
];

const GENERATION_STAGES = [
  'Connecting to Veo 3 video diffusion model...',
  'Interpreting spatial prompt geometry & optics...',
  'Synthesizing temporal consistency & motion vectors...',
  'Simulating photorealistic ray-traced lighting...',
  'Refining fine texture details and fluid dynamics...',
  'Encoding high-definition MP4 video stream...'
];

export const VeoVideoStudio: React.FC<VeoVideoStudioProps> = ({
  analysisResult,
  initialPrompt,
  onClose,
}) => {
  const primaryRole = analysisResult.primaryCareer?.career?.title || 'Data Scientist';
  const samplePrompts = SAMPLE_PROMPTS_BY_ROLE[primaryRole] || SAMPLE_PROMPTS_BY_ROLE['default'];

  // Studio View Mode: Micro-Learning 60s Player vs Veo 3 Diffusion Generator
  const [activeStudioView, setActiveStudioView] = useState<'micro-learning' | 'ai-generator'>('micro-learning');

  // Generator State
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || samplePrompts[0] || 'Cinematic 3D animation of a neural network training with glowing synaptic connections.'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  
  // Generation Lifecycle
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Active Generated Video
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [activeOperationName, setActiveOperationName] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  
  // Video Player Controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // History of Generated Videos
  const [videoHistory, setVideoHistory] = useState<GeneratedVeoVideo[]>(() => {
    const saved = localStorage.getItem(`veo_videos_${analysisResult.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`veo_videos_${analysisResult.id}`, JSON.stringify(videoHistory));
  }, [videoHistory, analysisResult.id]);

  // Handle stage and progress ticker during generation
  useEffect(() => {
    let stageInterval: any;
    let progressInterval: any;

    if (isGenerating) {
      setProgressPercent(5);
      setCurrentStageIndex(0);

      stageInterval = setInterval(() => {
        setCurrentStageIndex((prev) => (prev < GENERATION_STAGES.length - 1 ? prev + 1 : prev));
      }, 4500);

      progressInterval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 92) return 92; // Hold at 92 until completed
          const increment = Math.max(1, Math.floor((90 - prev) / 10));
          return prev + increment;
        });
      }, 1000);
    }

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating]);

  const handleStartGeneration = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setCurrentVideoUrl(null);
    setActiveOperationName(null);

    try {
      // Step 1: Request video generation operation from backend
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          resolution,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.operationName) {
        throw new Error(data.error || 'Failed to initialize Veo 3 video generation.');
      }

      const operationName = data.operationName;
      setActiveOperationName(operationName);

      // Step 2: Poll operation status until done
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // Up to 3 minutes polling

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();

        if (statusData.error) {
          throw new Error(statusData.error.message || 'Error occurred during Veo 3 video rendering.');
        }

        if (statusData.done) {
          isDone = true;
          break;
        }
      }

      if (!isDone) {
        throw new Error('Video rendering timed out. Please try again with a shorter prompt.');
      }

      // Step 3: Fetch the generated MP4 stream from backend
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Failed to retrieve rendered video stream.');
      }

      const videoBlob = await downloadRes.blob();
      const videoObjectUrl = URL.createObjectURL(videoBlob);

      setProgressPercent(100);
      setCurrentVideoUrl(videoObjectUrl);
      setIsGenerating(false);

      // Save to video history
      const newVideoItem: GeneratedVeoVideo = {
        id: `veo-${Date.now()}`,
        operationName,
        prompt: prompt.trim(),
        aspectRatio,
        resolution,
        createdAt: new Date().toISOString(),
        status: 'ready',
        videoUrl: videoObjectUrl,
        category: primaryRole,
      };

      setVideoHistory((prev) => [newVideoItem, ...prev]);

    } catch (err: any) {
      console.error('Veo video generation error:', err);
      setIsGenerating(false);
      setErrorMessage(
        err.message || 'An unexpected error occurred during video generation. Please verify your API key.'
      );
    }
  };

  const handleApplyEnhancer = (enhancer: string) => {
    if (!prompt.includes(enhancer)) {
      setPrompt((prev) => `${prev.trim()}, ${enhancer}`);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadVideo = () => {
    if (!currentVideoUrl) return;
    const a = document.createElement('a');
    a.href = currentVideoUrl;
    a.download = `SkillSpire_Veo3_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/50 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Veo 3 Fast Preview
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Zap className="w-3 h-3" />
                veo-3.1-fast-generate-preview
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Video Generation from Text
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transform complex career concepts, system architectures, and technical workflows into high-definition animated video clips powered by Google DeepMind's Veo 3 model.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Aspect Ratios</span>
              <span className="text-sm font-extrabold text-white">16:9 & 9:16</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Engine</span>
              <span className="text-sm font-extrabold text-purple-300">Veo 3 Neural</span>
            </div>
          </div>
        </div>
      </div>

      {/* Studio View Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
        <button
          id="tab-micro-learning-view"
          type="button"
          onClick={() => setActiveStudioView('micro-learning')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeStudioView === 'micro-learning'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <Film className="w-4 h-4 text-indigo-400" />
          <span>SkillSpire 60s Micro-Lesson: Java Fundamentals</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">ORIGINAL</span>
        </button>

        <button
          id="tab-veo3-generator-view"
          type="button"
          onClick={() => setActiveStudioView('ai-generator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeStudioView === 'ai-generator'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span>Veo 3 AI Prompt Studio</span>
          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">DIFFUSION</span>
        </button>
      </div>

      {/* VIEW 1: SKILLSPIRE 60S MICRO-LEARNING VIDEO */}
      {activeStudioView === 'micro-learning' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    60-Second Micro-Learning
                  </span>
                  <span className="text-xs text-slate-400 font-mono">16:9 Landscape • 1080p Motion Graphics</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Java Fundamentals — Introduction for Beginners
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Custom high-definition educational video with synchronized narration, animated Java code execution, and 4 core architectural pillars.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  SkillSpire Original
                </span>
              </div>
            </div>

            {/* The 60-Second Player */}
            <SkillSpireMicroVideoPlayer autoPlay={false} />
          </div>
        </div>
      )}

      {/* VIEW 2: VEO 3 AI DIFFUSION GENERATOR */}
      {activeStudioView === 'ai-generator' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
        
        {/* Left Column: Video Controls & Prompt Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Step 1: Aspect Ratio Selection (Mandatory 16:9 or 9:16) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>1. Select Aspect Ratio</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">16:9 Landscape or 9:16 Portrait</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 16:9 Landscape */}
                <button
                  id="aspect-ratio-16-9"
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                    aspectRatio === '16:9'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>16:9 Landscape</span>
                      {aspectRatio === '16:9' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Widescreen desktop & presentations</p>
                  </div>
                </button>

                {/* 9:16 Portrait */}
                <button
                  id="aspect-ratio-9-16"
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                    aspectRatio === '9:16'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>9:16 Portrait</span>
                      {aspectRatio === '9:16' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Vertical micro-learning & mobile</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Prompt Composer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>2. Describe the Video Scene</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="veo-prompt-input"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Cinematic 3D animation of a distributed database cluster processing real-time transactions with shard replication..."
                  disabled={isGenerating}
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 resize-none leading-relaxed transition-all"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono">
                  {prompt.length} chars
                </span>
              </div>
            </div>

            {/* Quick Style Enhancers */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-2">
                ✨ Add Cinematic Style Enhancers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_ENHANCERS.map((enhancer) => (
                  <button
                    key={enhancer}
                    type="button"
                    onClick={() => handleApplyEnhancer(enhancer)}
                    disabled={isGenerating}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-[11px] font-medium transition-colors border border-slate-200/80"
                  >
                    + {enhancer}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preset Concepts for {primaryRole}:</span>
                </span>
              </div>

              <div className="space-y-1.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    disabled={isGenerating}
                    className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-50 hover:bg-indigo-50/80 hover:border-indigo-200 border border-slate-200/80 text-slate-700 hover:text-indigo-950 transition-all flex items-start gap-2 group"
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-indigo-600 group-hover:text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="line-clamp-2 leading-relaxed">{p}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector & Action */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Resolution:</span>
                <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setResolution('720p')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                      resolution === '720p' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    720p (Fast)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution('1080p')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                      resolution === '1080p' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    1080p HD
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <button
                id="generate-veo-video-btn"
                type="button"
                onClick={handleStartGeneration}
                disabled={isGenerating || !prompt.trim()}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                  isGenerating || !prompt.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-indigo-200 active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering with Veo 3...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Video from Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Generation Notice</p>
                  <p className="leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Preview Player & Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Player Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Veo 3 Stage Output
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                {aspectRatio} • {resolution}
              </span>
            </div>

            {/* Screen Canvas */}
            <div 
              className={`relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center transition-all ${
                aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[440px] mx-auto w-auto' : 'aspect-video w-full'
              }`}
            >
              {isGenerating ? (
                /* Generating Progress Overlay */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 backdrop-blur-xs space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <span className="text-xs font-bold text-white block">
                      Synthesizing Veo 3 Video
                    </span>
                    <p className="text-[11px] text-indigo-300 font-mono transition-all">
                      {GENERATION_STAGES[currentStageIndex]}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs space-y-1">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Neural Diffusion</span>
                      <span>{progressPercent}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic max-w-xs">
                    Veo 3 creates high-fidelity temporal coherence. This takes ~30–60 seconds.
                  </p>
                </div>
              ) : currentVideoUrl ? (
                /* Video Player */
                <div className="relative w-full h-full group flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    src={currentVideoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                /* Empty Placeholder */
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center mx-auto border border-slate-700">
                    <Film className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-300">Ready to Synthesize</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Choose an aspect ratio (`16:9` or `9:16`), enter a prompt, and click generate to create a Veo 3 video.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar for Generated Video */}
            {currentVideoUrl && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  id="download-video-btn"
                  type="button"
                  onClick={handleDownloadVideo}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </button>
              </div>
            )}

          </div>

          {/* Video History Gallery */}
          {videoHistory.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Generated Library ({videoHistory.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setVideoHistory([]);
                    localStorage.removeItem(`veo_videos_${analysisResult.id}`);
                  }}
                  className="text-[10px] text-slate-400 hover:text-rose-600"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {videoHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 text-xs transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {item.aspectRatio}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                      "{item.prompt}"
                    </p>
                    {item.videoUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentVideoUrl(item.videoUrl || null);
                            setAspectRatio(item.aspectRatio);
                            setPrompt(item.prompt);
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>Load in Player</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model Specification Card */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Model & Compliance Specifications</span>
            </div>
            <ul className="text-[11px] text-indigo-900/80 space-y-1 list-disc list-inside">
              <li>Engine: <strong>veo-3.1-fast-generate-preview</strong> (Veo 3 Preview)</li>
              <li>Output Aspect Ratios: <strong>16:9</strong> (Landscape) and <strong>9:16</strong> (Portrait)</li>
              <li>Output format: Standard MP4 video stream with temporal fidelity</li>
              <li>Backend architecture: Server-side operation polling with secure streaming</li>
            </ul>
          </div>

        </div>

      </div>
      )}

    </div>
  );
};
