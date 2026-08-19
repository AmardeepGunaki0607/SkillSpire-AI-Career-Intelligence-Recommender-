import React, { useState } from 'react';
import { 
  Flame, 
  X, 
  Award, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Info,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';
import { UserProgressState, AnalysisResult } from '../types';
import { 
  STREAK_MILESTONE_TIERS, 
  getCurrentStreakTier, 
  getPast7DaysStreak, 
  getPast30DaysActivity, 
  getTodayModuleCount, 
  isStreakActiveToday,
  getMotivationalEncouragement 
} from '../lib/streak';
import { triggerConfetti } from '../lib/utils';

interface LearningStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgressState;
  analysisResult: AnalysisResult;
  onQuickStart: (tab: 'recorded-videos' | 'resources') => void;
  onUseStreakFreeze: () => void;
  onManualCheckInToday: () => void;
}

export const LearningStreakModal: React.FC<LearningStreakModalProps> = ({
  isOpen,
  onClose,
  progress,
  analysisResult,
  onQuickStart,
  onUseStreakFreeze,
  onManualCheckInToday
}) => {
  if (!isOpen) return null;

  const currentStreak = progress.currentStreakDays || 0;
  const longestStreak = Math.max(progress.longestStreakDays || currentStreak, currentStreak);
  const isDoneToday = isStreakActiveToday(progress);
  const todayCount = getTodayModuleCount(progress);
  const target = progress.reminderSettings?.dailyModuleTarget || 2;
  const tierInfo = getCurrentStreakTier(currentStreak);
  const weekDays = getPast7DaysStreak(progress);
  const monthActivity = getPast30DaysActivity(progress);
  const motivation = getMotivationalEncouragement(currentStreak, isDoneToday);
  const freezesAvailable = progress.streakFreezesAvailable ?? 1;

  const [activeTab, setActiveTab] = useState<'analytics' | 'badges' | 'habits'>('analytics');
  const [freezeClaimedToday, setFreezeClaimedToday] = useState(false);

  const handleApplyFreeze = () => {
    if (freezesAvailable > 0 && !freezeClaimedToday) {
      setFreezeClaimedToday(true);
      onUseStreakFreeze();
      triggerConfetti();
    }
  };

  const handleManualCheckIn = () => {
    onManualCheckInToday();
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Banner */}
        <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-7 overflow-hidden">
          
          {/* Subtle Flame Ambient Background */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30 text-white">
                <Flame className="w-8 h-8 fill-white animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Learning Streak Studio</h2>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                    {tierInfo.currentTier.badge} {tierInfo.currentTier.title}
                  </span>
                </div>
                <p className="text-xs text-amber-100 mt-1 max-w-md">
                  Consecutive daily activity turns knowledge into muscle memory and fast-tracks career readiness.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

          {/* Key Metric Highlights in Banner */}
          <div className="grid grid-cols-3 gap-2 pt-5 mt-5 border-t border-white/20 text-center">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Current Streak</span>
              <span className="text-2xl font-black text-white">{currentStreak} <span className="text-xs font-normal">Days</span></span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Longest Record</span>
              <span className="text-2xl font-black text-white">{longestStreak} <span className="text-xs font-normal">Days</span></span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Today's Status</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {isDoneToday ? '✓ Secured' : '⏳ Pending'}
              </span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 text-xs font-semibold">
          {[
            { id: 'analytics', label: 'Streak Analytics & Heatmap', icon: Calendar },
            { id: 'badges', label: 'Milestone Tiers & Badges', icon: Award },
            { id: 'habits', label: 'Habit Science & Tips', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 font-bold transition-all ${
                  isActive
                    ? 'border-amber-600 text-amber-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* ========================================================================= */}
          {/* TAB 1: ANALYTICS & HEATMAP */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Daily Encouragement Callout */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isDoneToday 
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base ${
                  isDoneToday ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                }`}>
                  {isDoneToday ? '🎯' : '🔥'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{motivation.headline}</h4>
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{motivation.body}</p>
                  
                  {!isDoneToday && (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          onClose();
                          onQuickStart('recorded-videos');
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Start Today's Lesson</span>
                      </button>

                      <button
                        onClick={handleManualCheckIn}
                        className="px-3 py-1.5 bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 rounded-lg font-bold transition-colors"
                      >
                        Log 15m Study Check-In
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 30-Day Activity Heatmap Grid */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-slate-900 text-xs">30-Day Activity Heatmap</h4>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-200 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 inline-block" />
                    <span>More</span>
                  </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 pt-2">
                  {monthActivity.map((day) => {
                    const colorClass = 
                      day.level === 3 ? 'bg-orange-500 text-white font-bold' :
                      day.level === 2 ? 'bg-amber-400 text-slate-900' :
                      day.level === 1 ? 'bg-amber-200 text-slate-800' :
                      'bg-slate-100 text-slate-400 border border-slate-200/50';

                    return (
                      <div
                        key={day.dateStr}
                        title={`${day.formatted}: ${day.count} modules completed`}
                        className={`h-7 rounded-lg flex flex-col items-center justify-center text-[10px] transition-transform hover:scale-110 cursor-pointer ${colorClass} ${
                          day.isToday ? 'ring-2 ring-amber-600 ring-offset-1 font-bold' : ''
                        }`}
                      >
                        <span>{day.formatted.split(' ')[1]}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Active in <strong>{monthActivity.filter(d => d.count > 0).length}</strong> of the last 30 days ({Math.round((monthActivity.filter(d => d.count > 0).length / 30) * 100)}% consistency rate).
                </p>
              </div>

              {/* Streak Freeze Shield Safeguard */}
              <div className="p-4 rounded-2xl border border-cyan-200 bg-cyan-50/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">Streak Freeze Protection</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-200 text-cyan-900">
                        {freezesAvailable} Available
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Need a break or having a hectic day? Use a Streak Freeze to preserve your streak uninterrupted for 24 hours.
                    </p>
                  </div>
                </div>

                <button
                  disabled={freezesAvailable <= 0 || freezeClaimedToday || isDoneToday}
                  onClick={handleApplyFreeze}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-colors ${
                    freezesAvailable > 0 && !freezeClaimedToday && !isDoneToday
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {freezeClaimedToday ? 'Frozen for Today ✓' : isDoneToday ? 'Not Needed Today' : 'Use 1 Freeze'}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MILESTONE TIERS & BADGES */}
          {/* ========================================================================= */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Streak Milestone Badges</h4>
                  <p className="text-xs text-slate-500">Unlock prestigious badges as you maintain daily momentum.</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {STREAK_MILESTONE_TIERS.filter(t => currentStreak >= t.days).length} of {STREAK_MILESTONE_TIERS.length} Unlocked
                </span>
              </div>

              <div className="space-y-3">
                {STREAK_MILESTONE_TIERS.map((tier) => {
                  const isUnlocked = currentStreak >= tier.days;
                  const isCurrent = tierInfo.currentTier.days === tier.days;
                  const isNext = tierInfo.nextTier?.days === tier.days;

                  return (
                    <div 
                      key={tier.days}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? `${tier.bgColor} ${tier.borderColor} shadow-2xs`
                          : isNext
                          ? 'bg-white border-amber-300 ring-1 ring-amber-400/30'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs shrink-0 ${
                          isUnlocked ? 'bg-white border border-slate-200' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {tier.badge}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-900 text-xs">{tier.title} — {tier.tierName}</h5>
                            {isCurrent && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-600 text-white rounded">
                                Current Tier
                              </span>
                            )}
                            {isNext && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-indigo-600 text-white rounded">
                                Next Goal
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{tier.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isUnlocked ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500">
                            {tier.days - currentStreak} days to unlock
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: HABIT SCIENCE & RETENTION TIPS */}
          {/* ========================================================================= */}
          {activeTab === 'habits' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">The Science of Daily Learning Streaks</h4>
                <p className="text-xs text-slate-500">Proven cognitive psychology techniques to maximize career skill acquisition.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <span className="text-base">🧠</span>
                    <span>The Spacing Effect</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    20 minutes of learning 6 days a week yields <strong>3.2x higher memory retention</strong> than a single 2-hour cram session on Sunday.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold">
                    <span className="text-base">⚡</span>
                    <span>Habit Stacking</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Pair your daily learning module with an established routine (e.g., right after morning coffee or before opening Slack).
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <span className="text-base">🎯</span>
                    <span>Micro-Commitment Rule</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    On busy days, commit to just 1 video chapter (5 mins). Action precedes motivation, not the other way around.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <span className="text-base">🚀</span>
                    <span>Proof of Work Velocity</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Consistent learners build capstone portfolio projects <strong>40% faster</strong> because context is never lost between sessions.
                  </p>
                </div>

              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-900 text-white space-y-2">
                <h5 className="font-bold text-xs text-amber-400">💡 Pro Candidate Habit Rule:</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Never miss two days in a row. Missing one day is an accident; missing two days is the start of a new habit."
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Target Career: <strong className="text-slate-800">{analysisResult.primaryCareer.career.title}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onQuickStart('recorded-videos');
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Launch Daily Study Lesson</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
