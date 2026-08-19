import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  HelpCircle, 
  Github, 
  FileText, 
  Award, 
  ArrowRight, 
  Check, 
  AlertCircle,
  BrainCircuit,
  ExternalLink,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { getQuizForTopic, VerificationQuizQuestion } from '../data/skillQuizzes';

export interface VerificationItem {
  id: string;
  type: 'milestone' | 'skill' | 'resource' | 'project' | 'video';
  title: string;
  category?: string;
  estimatedHours?: number;
  xpReward?: number;
}

interface VerificationModalProps {
  item: VerificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmVerified: (item: VerificationItem, verificationDetails?: { method: string; score?: number; githubUrl?: string; notes?: string }) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmVerified
}) => {
  if (!isOpen || !item) return null;

  const [activeTab, setActiveTab] = useState<'quiz' | 'evidence' | 'self'>('quiz');
  
  // Quiz State
  const quizData = React.useMemo(() => getQuizForTopic(item.title), [item.title]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Evidence State
  const [githubUrl, setGithubUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Self Verification State
  const [understoodConcepts, setUnderstoodConcepts] = useState(true);
  const [practicedCode, setPracticedCode] = useState(true);

  // Reset when item changes
  React.useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setGithubUrl('');
    setNotes('');
  }, [item.id]);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleEvaluateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / quizData.questions.length) * 100);
    setQuizScore(scorePercentage);
    setQuizSubmitted(true);
  };

  const handleCompleteWithQuiz = () => {
    onConfirmVerified(item, {
      method: 'Knowledge Check Quiz',
      score: quizScore ?? 100
    });
    onClose();
  };

  const handleCompleteWithEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmVerified(item, {
      method: 'GitHub & Project Evidence',
      githubUrl: githubUrl || undefined,
      notes: notes || undefined
    });
    onClose();
  };

  const handleCompleteWithSelf = () => {
    onConfirmVerified(item, {
      method: 'Self-Directed Completion'
    });
    onClose();
  };

  const xpAmount = item.xpReward || (item.type === 'project' ? 250 : item.type === 'milestone' ? 100 : 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold uppercase">
                {item.type.toUpperCase()} VERIFICATION
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>+{xpAmount} XP</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
              Verify Mastery: {item.title}
            </h3>
            <p className="text-xs text-slate-300">
              Confirm your understanding through a quick quiz, project evidence, or self-check.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Method Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 bg-slate-50 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>2-Min Knowledge Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Submit Evidence / Repo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('self')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'self'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Self-Paced Check-In</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: KNOWLEDGE QUIZ */}
          {/* ========================================================================= */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {!quizSubmitted ? (
                <form onSubmit={handleEvaluateQuiz} className="space-y-5">
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
                    <span className="font-semibold">Answer these 2 questions to verify your technical understanding:</span>
                    <span className="font-mono text-[11px] text-blue-700 font-bold">Passing: 50%+</span>
                  </div>

                  {quizData.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={Object.keys(selectedAnswers).length < quizData.questions.length}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Submit & Check Answers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Results Summary Card */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                    (quizScore ?? 0) >= 50
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-white shadow-sm">
                      {(quizScore ?? 0) >= 50 ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <h4 className="text-base font-extrabold">
                      {(quizScore ?? 0) >= 50 ? 'Skill Concept Verified!' : 'Needs Review'}
                    </h4>
                    <p className="text-xs font-semibold">
                      You scored {quizScore}% on the {quizData.topic} diagnostic quiz.
                    </p>
                  </div>

                  {/* Answers review */}
                  <div className="space-y-3">
                    {quizData.questions.map((q, idx) => {
                      const isCorrect = selectedAnswers[idx] === q.correctIndex;
                      return (
                        <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-800">Q{idx + 1}: {q.question}</span>
                            <span className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            💡 <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setQuizSubmitted(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Retry Quiz
                    </button>

                    <button
                      type="button"
                      onClick={handleCompleteWithQuiz}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm & Claim +{xpAmount} XP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EVIDENCE / GITHUB SUBMISSION */}
          {/* ========================================================================= */}
          {activeTab === 'evidence' && (
            <form onSubmit={handleCompleteWithEvidence} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-indigo-600" />
                  <span>Verify with Code or Repository Link</span>
                </p>
                <p className="text-indigo-700">
                  Submitting real proof like a GitHub URL will add a "Verified Code Proof" badge to your recruiter export report.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Repository / Commit / Live Demo URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project-or-lab"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Learnings & Implementation Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what you built, libraries utilized, and key challenges solved..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-900 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Verify with Evidence & Claim +{xpAmount} XP</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SELF-PACED CHECK-IN */}
          {/* ========================================================================= */}
          {activeTab === 'self' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Self-Directed Study Checklist:</h4>
                
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={understoodConcepts}
                    onChange={(e) => setUnderstoodConcepts(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>I have reviewed the core documentation and understand the theoretical concepts.</span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={practicedCode}
                    onChange={(e) => setPracticedCode(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>I have written and tested practical code exercises related to this topic.</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCompleteWithSelf}
                disabled={!understoodConcepts || !practicedCode}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Completion & Log Progress (+{xpAmount} XP)</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Extends daily streak & updates live readiness score</span>
          </span>
          <span className="font-semibold text-slate-700">SkillSpire Verified</span>
        </div>
      </div>

    </div>
  );
};
