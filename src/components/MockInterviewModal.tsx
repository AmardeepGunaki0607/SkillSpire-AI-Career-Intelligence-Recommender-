import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  BrainCircuit, 
  Code2, 
  RotateCcw, 
  FileText, 
  Lightbulb, 
  ShieldAlert, 
  ThumbsUp, 
  Flame, 
  HelpCircle,
  Play
} from 'lucide-react';
import { MockInterviewQuestion, MockInterviewEvaluation } from '../types';
import { getInterviewQuestionsForCareer, evaluateUserInterviewResponse } from '../data/mockInterviewData';
import { triggerConfetti } from '../lib/utils';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerTitle: string;
  userFullName?: string;
  onCompleteInterview?: (score: number) => void;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  careerTitle,
  userFullName = 'Candidate',
  onCompleteInterview
}) => {
  if (!isOpen) return null;

  const questions = React.useMemo(() => getInterviewQuestionsForCareer(careerTitle), [careerTitle]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<Record<number, MockInterviewEvaluation>>({});
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isCompletedSession, setIsCompletedSession] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showIdealAnswer, setShowIdealAnswer] = useState<boolean>(false);

  // Speech & Voice State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const currentAnswer = userAnswers[currentQuestionIndex] || '';
  const currentEval = evaluations[currentQuestionIndex];

  // Initialize Speech Recognition & Synthesis check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setUserAnswers(prev => ({
              ...prev,
              [currentQuestionIndex]: (prev[currentQuestionIndex] ? prev[currentQuestionIndex] + ' ' : '') + transcript
            }));
          }
        };

        recognizer.onerror = () => {
          setIsListening(false);
        };

        recognizer.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognizer;
      }
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [currentQuestionIndex]);

  // Read question aloud
  const speakQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQ.question);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleMicListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }
  };

  const handleEvaluateCurrentAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim()) return;

    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    setIsEvaluating(true);
    setTimeout(() => {
      const evaluation = evaluateUserInterviewResponse(currentQ, currentAnswer);
      setEvaluations(prev => ({
        ...prev,
        [currentQuestionIndex]: evaluation
      }));
      setIsEvaluating(false);
    }, 600);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
      setShowIdealAnswer(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Calculate overall average
      const allEvaluations: MockInterviewEvaluation[] = Object.values(evaluations);
      const avgScore = allEvaluations.length > 0
        ? Math.round(allEvaluations.reduce((acc: number, curr: MockInterviewEvaluation) => acc + curr.overallScore, 0) / allEvaluations.length)
        : 85;

      setIsCompletedSession(true);
      triggerConfetti();
      if (onCompleteInterview) {
        onCompleteInterview(avgScore);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
      setShowIdealAnswer(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleResetInterview = () => {
    setUserAnswers({});
    setEvaluations({});
    setCurrentQuestionIndex(0);
    setIsCompletedSession(false);
    setShowHint(false);
    setShowIdealAnswer(false);
  };

  // Overall session metrics
  const sessionAverageScore = React.useMemo(() => {
    const evals: MockInterviewEvaluation[] = Object.values(evaluations);
    if (evals.length === 0) return 0;
    return Math.round(evals.reduce((sum: number, e: MockInterviewEvaluation) => sum + e.overallScore, 0) / evals.length);
  }, [evaluations]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                  AI TECHNICAL INTERVIEWER
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Role: {careerTitle}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Live Technical & System Design Simulation
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

        {/* Progress Step Bar */}
        {!isCompletedSession && (
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                {currentQ.type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentQuestionIndex 
                      ? 'w-6 bg-blue-600' 
                      : evaluations[idx] 
                        ? 'w-2 bg-emerald-500' 
                        : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {!isCompletedSession ? (
            <>
              {/* Question Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentQ.category}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={speakQuestion}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isSpeaking 
                          ? 'bg-amber-400 text-slate-950 animate-pulse' 
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                      title="Read question aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Mute' : 'Listen AI Voice'}</span>
                    </button>

                    {currentQ.hint && (
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                        <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
                  "{currentQ.question}"
                </h4>

                {showHint && currentQ.hint && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-in fade-in">
                    💡 <strong>Interviewer Hint:</strong> {currentQ.hint}
                  </div>
                )}
              </div>

              {/* Answer Input Section */}
              {!currentEval ? (
                <form onSubmit={handleEvaluateCurrentAnswer} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-blue-600" />
                        <span>Your Spoken or Written Technical Response:</span>
                      </label>

                      {speechSupported && (
                        <button
                          type="button"
                          onClick={toggleMicListening}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isListening 
                              ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                          <span>{isListening ? 'Recording Live... Click to Stop' : 'Dictate with Voice'}</span>
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={5}
                      value={currentAnswer}
                      onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                      placeholder="Explain your approach, system trade-offs, algorithms, or STAR behavioral breakdown..."
                      className="w-full p-4 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-900 outline-none leading-relaxed transition-all resize-none"
                    />

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Tip: Mention architectural trade-offs, latency bounds, or concrete formulas for highest score.</span>
                      <span className="font-mono">{currentAnswer.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 disabled:opacity-30 cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!currentAnswer.trim() || isEvaluating}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>AI Analyzing Response...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Evaluate Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Evaluation & Feedback Review */
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Score Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          Interviewer Assessment
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {currentEval.summaryFeedback}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-center px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200">
                          <span className="text-[9px] font-bold uppercase text-blue-600 block">Technical</span>
                          <span className="text-sm font-black text-blue-900">{currentEval.technicalAccuracyScore}%</span>
                        </div>
                        <div className="text-center px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200">
                          <span className="text-[9px] font-bold uppercase text-indigo-600 block">Structure</span>
                          <span className="text-sm font-black text-indigo-900">{currentEval.clarityAndStructureScore}%</span>
                        </div>
                        <div className={`text-center px-3.5 py-1.5 rounded-xl border font-black text-sm ${
                          currentEval.overallScore >= 80 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'bg-amber-50 border-amber-300 text-amber-700'
                        }`}>
                          <span className="text-[9px] font-bold uppercase block">Overall</span>
                          <span>{currentEval.overallScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1.5">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Candidate Strengths:</span>
                        </span>
                        <ul className="space-y-1 text-emerald-800">
                          {currentEval.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1.5">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Key Recommendations:</span>
                        </span>
                        <ul className="space-y-1 text-amber-800">
                          {currentEval.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-600">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Ideal Model Answer Accordion */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowIdealAnswer(!showIdealAnswer)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showIdealAnswer ? '▼ Hide Ideal Staff-Level Model Answer' : '▶ View Ideal Staff-Level Model Answer'}</span>
                      </button>

                      {showIdealAnswer && (
                        <div className="mt-2 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 text-xs text-indigo-950 leading-relaxed space-y-1.5 animate-in fade-in">
                          <p className="font-bold">Model Answer for {currentQ.category}:</p>
                          <p className="text-indigo-900">{currentEval.idealAnswerHighlights}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEvaluations(prev => {
                          const copy = { ...prev };
                          delete copy[currentQuestionIndex];
                          return copy;
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-attempt Answer</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview Session'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ========================================================================= */
            /* INTERVIEW COMPLETION SUMMARY */
            /* ========================================================================= */
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Award className="w-8 h-8 text-amber-300" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Interview Simulation Completed!
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {careerTitle} Mock Assessment
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Great work {userFullName.split(' ')[0]}! You completed all {questions.length} technical & behavioral rounds.
                </p>
              </div>

              {/* Performance Score Summary */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Overall Score</span>
                  <span className="text-xl font-black text-blue-600">{sessionAverageScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Questions</span>
                  <span className="text-xl font-black text-slate-800">{questions.length}/{questions.length}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">XP Earned</span>
                  <span className="text-xl font-black text-amber-500">+150 XP</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleResetInterview}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Session</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Return to Career Dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Voice & Speech recognition powered by SkillSpire AI</span>
          </span>
          <span className="font-semibold text-slate-700">STAR Method & System Design Ready</span>
        </div>

      </div>

    </div>
  );
};
