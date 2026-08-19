import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  ListOrdered, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  Award,
  Clock,
  User,
  Zap,
  Bookmark,
  Share2,
  ChevronRight,
  Download
} from 'lucide-react';
import { RecordedVideoLesson, VideoChapter } from '../types';
import { SkillSpireMicroVideoPlayer } from './SkillSpireMicroVideoPlayer';
import { cleanBrandText } from '../lib/utils';

interface VideoClassroomModalProps {
  video: RecordedVideoLesson;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (videoId: string) => void;
}

export const VideoClassroomModal: React.FC<VideoClassroomModalProps> = ({
  video,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes' | 'quiz' | 'scratchpad'>('chapters');
  const [currentTimestampSeconds, setCurrentTimestampSeconds] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isSavedNote, setIsSavedNote] = useState(false);

  // Load saved scratchpad notes
  useEffect(() => {
    if (video?.id) {
      const saved = localStorage.getItem(`lesson_notes_${video.id}`);
      if (saved) {
        setUserNotes(saved);
      } else {
        setUserNotes('');
      }
      setQuizAnswers({});
      setQuizSubmitted(false);
      setCurrentTimestampSeconds(0);
    }
  }, [video?.id]);

  if (!isOpen || !video) return null;

  const handleSaveNotes = () => {
    localStorage.setItem(`lesson_notes_${video.id}`, userNotes);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  const handleQuizSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    video.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  // Video embed with start time parameter
  const embedSourceUrl = `${video.embedUrl}?autoplay=1&start=${currentTimestampSeconds}`;

  return (
    <div id="video-classroom-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-sm">
              <Play className="w-4 h-4 fill-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {cleanBrandText(video.batchName)}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {video.durationMinutes} mins
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {video.level}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                {cleanBrandText(video.title)}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="modal-mark-complete-btn"
              onClick={() => onToggleComplete(video.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isCompleted 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Lecture Completed' : 'Mark as Watched'}
            </button>
            
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Classroom Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
          
          {/* Left / Center Video Player Column (7 cols) */}
          <div className="lg:col-span-7 bg-black flex flex-col justify-between overflow-y-auto">
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              {video.isSkillSpireOriginal ? (
                <SkillSpireMicroVideoPlayer
                  isCompleted={isCompleted}
                  autoPlay={true}
                  onComplete={() => onToggleComplete(video.id)}
                />
              ) : (
                <iframe
                  src={embedSourceUrl}
                  title={cleanBrandText(video.title)}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Context Footer */}
            <div className="p-4 bg-slate-900/95 border-t border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-slate-200 font-medium">{cleanBrandText(video.instructor)}</span>
                    <span>•</span>
                    <span className="text-slate-400">{cleanBrandText(video.instructorTitle)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-amber-400 font-semibold">AI Recommendation Context: </span>
                    {video.whyRecommended}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    Skill: {video.skillCovered}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                    {video.isSkillSpireOriginal ? 'SkillSpire AI Original (60s)' : 'Video Masterclass'}
                  </span>
                </div>
                {video.youtubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Open External Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Interactive Classroom Sidebar (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col overflow-hidden">
            
            {/* Classroom Tab Navigation */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0">
              <button
                id="classroom-tab-chapters"
                onClick={() => setActiveTab('chapters')}
                className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'chapters'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Chapters</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 ml-0.5">
                  {video.chapters.length}
                </span>
              </button>

              <button
                id="classroom-tab-notes"
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'notes'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lecture Notes</span>
              </button>

              <button
                id="classroom-tab-quiz"
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz ({video.quiz.length})</span>
              </button>

              <button
                id="classroom-tab-scratchpad"
                onClick={() => setActiveTab('scratchpad')}
                className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'scratchpad'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Notes</span>
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: CHAPTERS */}
              {activeTab === 'chapters' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Timestamped Lecture Chapters
                    </h3>
                    <span className="text-[11px] text-slate-500">Click to jump in video</span>
                  </div>

                  <div className="space-y-2">
                    {video.chapters.map((chapter, index) => {
                      const isCurrent = currentTimestampSeconds === chapter.seconds;
                      return (
                        <button
                          key={chapter.id}
                          id={`classroom-chapter-${chapter.id}`}
                          onClick={() => setCurrentTimestampSeconds(chapter.seconds)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                            isCurrent
                              ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
                          }`}
                        >
                          <div className={`px-2 py-1 rounded-md text-xs font-mono font-semibold shrink-0 mt-0.5 ${
                            isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-900 group-hover:text-indigo-200'
                          }`}>
                            {chapter.timestamp}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 leading-snug">
                              {chapter.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {chapter.summary}
                            </p>
                          </div>
                          <Play className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 ${
                            isCurrent ? 'text-indigo-400' : 'text-slate-600 group-hover:text-indigo-400'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: LECTURE NOTES & FORMULAS */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">
                        Handcrafted Lecture Notes & Cheat Sheet
                      </h3>
                      <p className="text-[11px] text-slate-400">High-yield revision points, formulas, and interview takeaways</p>
                    </div>
                    <button
                      onClick={() => alert("Lecture Notes PDF downloaded to your study vault!")}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      Download PDF
                    </button>
                  </div>

                  <div className="space-y-3">
                    {video.keyFormulasAndNotes.map((note, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                          <Zap className="w-3 h-3" />
                          <span>Core Concept #{idx + 1}</span>
                        </div>
                        <p className="leading-relaxed text-slate-200">{note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
                    <p className="font-semibold text-indigo-300 mb-1">Instructor Pro-Tip:</p>
                    <p className="text-[11px] leading-relaxed text-indigo-200/90">
                      Before attending technical placement interviews, practice writing these code patterns on a whiteboard or blank sheet without IDE auto-complete.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZ & ASSESSMENT */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">
                        Lecture Assessment & Mastery Check
                      </h3>
                      <p className="text-[11px] text-slate-400">Test your understanding after watching</p>
                    </div>
                    {quizSubmitted && (
                      <div className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                        Score: {calculateScore()} / {video.quiz.length}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {video.quiz.map((q, qIndex) => {
                      const selectedOption = quizAnswers[q.id];
                      return (
                        <div key={q.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                          <h4 className="text-xs font-semibold text-slate-200">
                            Q{qIndex + 1}. {q.question}
                          </h4>

                          <div className="space-y-2">
                            {q.options.map((opt, optIndex) => {
                              const isSelected = selectedOption === optIndex;
                              const isCorrect = q.correctIndex === optIndex;
                              let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                              if (quizSubmitted) {
                                if (isCorrect) {
                                  style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold';
                                } else if (isSelected && !isCorrect) {
                                  style = 'bg-rose-950/50 border-rose-500 text-rose-200 line-through';
                                }
                              } else if (isSelected) {
                                style = 'bg-indigo-950/60 border-indigo-500 text-indigo-200 font-semibold';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => handleQuizSelect(q.id, optIndex)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${style}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isCorrect && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                              <span className="font-semibold text-amber-400">Explanation: </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      id="submit-quiz-btn"
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Submit Assessment & View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              )}

              {/* TAB 4: SCRATCHPAD NOTES */}
              {activeTab === 'scratchpad' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">
                        Interactive Lecture Scratchpad
                      </h3>
                      <p className="text-[11px] text-slate-400">Notes are automatically stored in your local session</p>
                    </div>
                  </div>

                  <textarea
                    id="classroom-scratchpad-input"
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Write your key takeaways, interview questions, or algorithmic doubts here while watching the lecture..."
                    rows={12}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isSavedNote ? '✅ Saved successfully!' : 'Press Save to persist notes'}
                    </span>
                    <button
                      id="save-scratchpad-btn"
                      onClick={handleSaveNotes}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
