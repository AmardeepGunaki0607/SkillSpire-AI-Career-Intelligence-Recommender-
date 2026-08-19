import React from 'react';
import { 
  Bell, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  X, 
  Settings2, 
  Target,
  Award
} from 'lucide-react';
import { AnalysisResult, UserProgressState, ReminderSettings } from '../types';
import { getCompletedTodayCount, getTodayDateString } from '../lib/notifications';

interface DailyReminderBannerProps {
  analysisResult: AnalysisResult;
  progress: UserProgressState;
  settings: ReminderSettings;
  onOpenSettings: () => void;
  onDismiss: () => void;
  onQuickStart: (tab: 'resources' | 'recorded-videos', targetId?: string) => void;
}

export const DailyReminderBanner: React.FC<DailyReminderBannerProps> = ({
  analysisResult,
  progress,
  settings,
  onOpenSettings,
  onDismiss,
  onQuickStart
}) => {
  const today = getTodayDateString();
  const isDismissedToday = (progress.dismissedAlertDates || []).includes(today);
  if (isDismissedToday) return null;

  const completedToday = getCompletedTodayCount(progress);
  const target = settings.dailyModuleTarget || 2;
  const isGoalComplete = completedToday >= target;
  const pct = Math.min(100, Math.round((completedToday / target) * 100));

  // Find next pending recommendation
  const allResources = analysisResult.allRecommendedResources || [];
  const pendingResource = allResources.find(r => !progress.completedResourceIds.includes(r.id));
  const recommendedVideos = analysisResult.recommendedRecordedVideos || [];
  const pendingVideo = recommendedVideos.find(v => !(progress.completedVideoLessonIds || []).includes(v.id));

  const nextItem = pendingResource || pendingVideo;
  const nextItemTab = pendingResource ? 'resources' : 'recorded-videos';

  return (
    <div 
      id="daily-learning-reminder-banner"
      className={`relative rounded-2xl border transition-all overflow-hidden ${
        isGoalComplete
          ? 'bg-gradient-to-r from-emerald-900/90 via-teal-950 to-slate-900 border-emerald-500/30 text-white shadow-md'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white shadow-lg'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Side: Goal & Streak Details */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
            isGoalComplete
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isGoalComplete ? <Award className="w-6 h-6" /> : <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isGoalComplete
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30'
              }`}>
                {isGoalComplete ? 'Daily Target Achieved' : 'Daily Learning Reminder'}
              </span>

              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/20">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{progress.currentStreakDays} Day Streak Active</span>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {isGoalComplete ? (
                <span>🎉 Great work! You completed today's study target ({completedToday}/{target} modules).</span>
              ) : (
                <span>
                  Complete {target - completedToday} more {target - completedToday === 1 ? 'module' : 'modules'} today to protect your streak and advance toward {analysisResult.primaryCareer.career.title}.
                </span>
              )}
            </h3>

            {/* Micro Progress Bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-36 sm:w-48 bg-slate-800 rounded-full h-2 overflow-hidden p-0.5 border border-slate-700/60">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isGoalComplete ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-indigo-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-300 font-medium">
                {completedToday} of {target} Modules
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action & Controls */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          {!isGoalComplete && nextItem && (
            <button
              onClick={() => onQuickStart(nextItemTab, nextItem.id)}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-indigo-500/25 transition-all"
            >
              <span>Quick Start: {nextItem.title.slice(0, 24)}...</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
            title="Configure Reminders & Times"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={onDismiss}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Dismiss for today"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
