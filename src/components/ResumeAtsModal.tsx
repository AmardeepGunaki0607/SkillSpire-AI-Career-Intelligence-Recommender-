import React, { useState } from 'react';
import { 
  FileSearch, 
  X, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  FileText, 
  BarChart, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Wand2, 
  Briefcase 
} from 'lucide-react';
import { ResumeAtsAnalysis } from '../types';
import { analyzeResumeAts } from '../lib/atsAnalyzer';
import { triggerConfetti } from '../lib/utils';

interface ResumeAtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerTitle: string;
  userFullName?: string;
}

export const ResumeAtsModal: React.FC<ResumeAtsModalProps> = ({
  isOpen,
  onClose,
  careerTitle,
  userFullName = 'Candidate'
}) => {
  if (!isOpen) return null;

  const [resumeText, setResumeText] = useState<string>('');
  const [analysis, setAnalysis] = useState<ResumeAtsAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const sampleResumeSnippet = `Alex Chen | alex.chen@email.com | GitHub: github.com/alexchen
Education: B.S. Computer Science, Expected 2026
Technical Skills: Python, JavaScript, React, SQL, Git, Linux
Projects:
- Built a web scraper and data processing tool in Python to analyze market pricing.
- Developed a web app using React and Node.js for student assignment tracking.
- Created machine learning scripts with Scikit-Learn for basic image classification.
Experience:
- Software Intern at TechCorp: Created REST APIs, cleaned databases, assisted with frontend UI bugs.`;

  const handleUseSample = () => {
    setResumeText(sampleResumeSnippet);
    setFileName('Sample_Resume_Alex_Chen.txt');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setResumeText(content || '');
    };
    reader.readAsText(file);
  };

  const handleScanResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const result = analyzeResumeAts(resumeText, careerTitle);
      setAnalysis(result);
      setIsScanning(false);
      triggerConfetti();
    }, 700);
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                  AI ATS SCANNER & OPTIMIZER
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Target: {careerTitle}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Resume ATS Gap Scanner & Bullet Point Rewriter
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {!analysis ? (
            <form onSubmit={handleScanResume} className="space-y-4">
              
              {/* Upload Dropzone */}
              <div className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50/60 transition-all text-center space-y-3">
                <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Upload Resume or Paste Text Below
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports .txt, .pdf raw text, or copy-pasted sections (Projects, Skills, Experience)
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <label className="px-4 py-2 bg-white border border-slate-300 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
                    Browse File
                    <input 
                      type="file" 
                      accept=".txt,.pdf,.doc,.docx" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Paste Demo Resume
                  </button>
                </div>

                {fileName && (
                  <span className="inline-block text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Loaded: {fileName}
                  </span>
                )}
              </div>

              {/* Text Input Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Resume Content:</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </label>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here (Skills, Projects, Work Experience)..."
                  className="w-full p-4 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none leading-relaxed transition-all resize-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={!resumeText.trim() || isScanning}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scanning Against {careerTitle} ATS Rules...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Run AI ATS Diagnostic</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* ========================================================================= */
            /* ATS DIAGNOSTIC RESULTS */
            /* ========================================================================= */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Scorecard Hero */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                      ATS System Match Rating
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Target Role: {careerTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center px-3.5 py-2 rounded-xl bg-white/10 border border-white/15">
                      <span className="text-[9px] font-bold uppercase text-slate-300 block">Keywords</span>
                      <span className="text-sm font-black text-emerald-300">
                        {analysis.matchedKeywords.length}/{analysis.matchedKeywords.length + analysis.missingKeywords.length}
                      </span>
                    </div>

                    <div className="text-center px-3.5 py-2 rounded-xl bg-white/10 border border-white/15">
                      <span className="text-[9px] font-bold uppercase text-slate-300 block">Impact</span>
                      <span className="text-sm font-black text-blue-300">{analysis.impactScore}%</span>
                    </div>

                    <div className={`text-center px-4 py-2 rounded-xl border font-black text-lg ${
                      analysis.overallMatchScore >= 75 
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' 
                        : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    }`}>
                      <span className="text-[9px] font-bold uppercase block text-white/80">ATS Score</span>
                      <span>{analysis.overallMatchScore}/100</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                  {analysis.executiveSummary}
                </p>
              </div>

              {/* Keyword Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Matched */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matched Keywords ({analysis.matchedKeywords.length})</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Pass
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 text-[11px] font-medium shadow-2xs">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Missing High-Priority Keywords ({analysis.missingKeywords.length})</span>
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Action Required
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800 text-[11px] font-medium shadow-2xs">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1-Click AI Bullet Point Rewriter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-extrabold text-sm text-slate-900">
                    AI Bullet Point Optimizer (Google X-Y-Z Formula)
                  </h4>
                </div>

                <div className="space-y-3">
                  {analysis.bulletPointRewrites.map((rw, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Original Weak Phrasing:</span>
                        <p className="text-slate-600 line-through italic">{rw.original}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-blue-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>AI Quantified Rewrite:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyBullet(rw.improved, idx)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedIdx === idx ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="font-semibold text-slate-900 leading-relaxed">{rw.improved}</p>
                        <p className="text-[10px] text-slate-500 pt-0.5">
                          💡 <em>Reason: {rw.reason}</em>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAnalysis(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another Resume</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Close & Apply Fixes
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compatible with Workday, Greenhouse, Lever & Taleo ATS algorithms</span>
          </span>
          <span className="font-semibold text-slate-700">SkillSpire AI Career Suite</span>
        </div>

      </div>

    </div>
  );
};
