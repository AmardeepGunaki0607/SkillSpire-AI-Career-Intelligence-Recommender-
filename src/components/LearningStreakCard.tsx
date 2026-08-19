import React from 'react';
import { 
  Flame, 
  Award, 
  TrendingUp, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { UserProgressState, AnalysisResult } from '../types';
import { 
  getCurrentStreakTier, 
  getPast7DaysStreak, 
  getTodayModuleCount, 
  isStreakActiveToday, 
  getMotivationalEncouragement 
} from '../lib/streak';

interface LearningStreakCardProps {
  progress: UserProgressState;
  analysisResult: AnalysisResult;
  onOpenStreakModal: () => void;
  onQuickStart: (tab: 'recorded-videos' | 'resources') => void;
  onUseStreakFreeze?: () => void;
}

export const LearningStreakCard: React.FC<LearningStreakCardProps> = ({
  progress,
  analysisResult,
  onOpenStreakModal,
  onQuickStart,
  onUseStreakFreeze
}) => {
  const currentStreak = progress.currentStreakDays || 0;
  const longestStreak = Math.max(progress.longestStreakDays || currentStreak, currentStreak);
  const isDoneToday = isStreakActiveToday(progress);
  const todayCount = getTodayModuleCount(progress);
  const target = progress.reminderSettings?.dailyModuleTarget || 2;
  
  const tierInfo = getCurrentStreakTier(currentStreak);
  const weekDays = getPast7DaysStreak(progress);
  const motivation = getMotivationalEncouragement(currentStreak, isDoneToday);
  const freezeAvailable = progress.streakFreezesAvailable ?? 1;

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/5 rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
                <Flame className={`w-7 h-7 ${currentStreak > 0 ? 'fill-white animate-pulse' : ''}`} />
              </div>
              {isDoneToday && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                  ✓
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Learning Streak Counter</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  isDoneToday
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                }`}>
                  {isDoneToday ? 'Active Today' : 'At Risk'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isDoneToday 
                  ? `Completed ${todayCount} of ${target} daily modules today • Streak protected!`
                  : `Complete ${Math.max(1, target - todayCount)} more module today to keep your streak alive.`}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenStreakModal}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Streak History</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Big Counter & Milestone Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main Streak Counter Stat */}
          <div className="p-4 rounded-xl bg-white border border-amber-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Current Consecutive Streak</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
                  {currentStreak}
                </span>
                <span className="text-sm font-bold text-slate-700">Days in a row</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500">Personal Best: <strong className="text-slate-800">{longestStreak} Days</strong></span>
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-500" /> Top 10%
              </span>
            </div>
          </div>

          {/* Current Tier & Progress to Next Tier */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Milestone Tier</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <span>{tierInfo.currentTier.badge}</span>
                  <span>{tierInfo.currentTier.title}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                {tierInfo.nextTier ? (
                  <>Next badge: <strong className="text-slate-800">{tierInfo.nextTier.badge} {tierInfo.nextTier.title}</strong> ({tierInfo.daysRemaining} days left)</>
                ) : (
                  <>Maximum Streak Prestige Achieved!</>
                )}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 mt-2 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{tierInfo.currentTier.days}d</span>
                <span>{tierInfo.progressPercent}%</span>
                <span>{tierInfo.nextTier?.days || tierInfo.currentTier.days}d</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${tierInfo.progressPercent}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Today's Target Action & Safeguard */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Daily Target</span>
                <span className={`text-[11px] font-bold ${isDoneToday ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {todayCount}/{target} Completed
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {motivation.body}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-100">
              <button
                onClick={() => onQuickStart('recorded-videos')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs ${
                  isDoneToday
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isDoneToday ? 'Bonus Lesson' : 'Quick Study (+1)'}</span>
              </button>

              <button
                onClick={onOpenStreakModal}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Streak Freeze Safeguard"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
              </button>
            </div>
          </div>

        </div>

        {/* 7-Day Rolling Activity Visual Bar */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Past 7 Days Consistency</span>
            </span>
            <span className="text-[11px] text-slate-500">
              {weekDays.filter(d => d.isCompleted).length}/7 Days Active
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day, idx) => (
              <div 
                key={day.dateStr}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  day.isToday
                    ? day.isCompleted
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/40 shadow-xs'
                      : 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/40 shadow-xs'
                    : day.isCompleted
                    ? 'bg-orange-50/70 border-orange-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200/70 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase">{day.dayOfWeek}</span>
                <span className="text-[11px] font-semibold text-slate-700 mt-0.5">{day.formattedDate.split(' ')[1]}</span>
                
                <div className="mt-1.5">
                  {day.isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                      🔥
                    </div>
                  ) : day.isToday ? (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center text-[10px] text-amber-600 font-bold animate-spin">
                      ⏳
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                      •
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-semibold mt-1 text-slate-500">
                  {day.isToday && !day.isCompleted ? 'Today' : day.isCompleted ? `${day.moduleCount}m` : '0m'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
