import { AnalysisResult, UserProgressState, AppNotification, ReminderSettings } from '../types';

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  browserNotifications: false,
  reminderTime: '18:00',
  dailyModuleTarget: 2,
  notifyStreakRisk: true,
  soundEnabled: true
};

/**
 * Synthesizes a soft, pleasant notification chime using Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play two-tone soft chime (C5 -> G5)
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.debug('Audio chime skipped:', e);
  }
}

/**
 * Checks if the browser environment supports the Notifications API
 */
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Returns current permission status ('granted' | 'denied' | 'default' | 'unsupported')
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  try {
    return Notification.permission;
  } catch {
    return 'unsupported';
  }
}

/**
 * Requests browser permission for Web Notifications
 */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!isBrowserNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.warn('Could not request notification permission:', error);
    return false;
  }
}

/**
 * Sends a native browser push notification if permitted
 */
export function sendNativeNotification(title: string, body: string, onClick?: () => void) {
  if (!isBrowserNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'career-learning-reminder'
    });

    if (onClick) {
      notification.onclick = () => {
        window.focus();
        onClick();
        notification.close();
      };
    }
    return true;
  } catch (err) {
    console.debug('Native notification display error:', err);
    return false;
  }
}

/**
 * Formats today's date in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Calculates modules completed today
 */
export function getCompletedTodayCount(progress: UserProgressState): number {
  const today = getTodayDateString();
  const todayList = progress.dailyCompletedModuleIds?.[today] || [];
  return todayList.length;
}

/**
 * Generates personalized daily learning alerts and notifications based on current progress
 */
export function generateDailyLearningAlerts(
  analysisResult: AnalysisResult,
  progress: UserProgressState,
  settings: ReminderSettings = DEFAULT_REMINDER_SETTINGS
): AppNotification[] {
  const alerts: AppNotification[] = [];
  const today = getTodayDateString();
  const completedToday = getCompletedTodayCount(progress);
  const target = settings.dailyModuleTarget || 2;
  const careerTitle = analysisResult.primaryCareer.career.title;

  const allResources = analysisResult.allRecommendedResources || [];
  const pendingResources = allResources.filter(r => !progress.completedResourceIds.includes(r.id));
  const recommendedVideos = analysisResult.recommendedRecordedVideos || [];
  const pendingVideos = recommendedVideos.filter(v => !(progress.completedVideoLessonIds || []).includes(v.id));

  // Total mastery metrics
  const totalItems = allResources.length + recommendedVideos.length;
  const completedItems = progress.completedResourceIds.length + (progress.completedVideoLessonIds?.length || 0);
  const overallMastery = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // 1. DAILY LEARNING GOAL REMINDER
  if (completedToday >= target) {
    alerts.push({
      id: `alert-goal-met-${today}`,
      type: 'daily_reminder',
      title: '🎉 Daily Study Goal Achieved!',
      message: `Outstanding job! You've finished ${completedToday} of ${target} target modules today. Your ${progress.currentStreakDays}-day streak is secured.`,
      timestamp: 'Today',
      read: false,
      priority: 'low',
      actionText: 'Review Roadmap',
      actionTab: 'roadmap'
    });
  } else {
    const remainingForToday = target - completedToday;
    const nextItem = pendingResources[0] || pendingVideos[0];
    alerts.push({
      id: `alert-goal-pending-${today}`,
      type: 'daily_reminder',
      title: `🎯 Daily Learning Goal: ${completedToday}/${target} Completed`,
      message: `You have ${remainingForToday} more ${remainingForToday === 1 ? 'module' : 'modules'} to complete today to reach your daily benchmark for ${careerTitle}.`,
      timestamp: 'Today',
      read: false,
      priority: 'high',
      actionText: nextItem ? `Start: ${nextItem.title.slice(0, 30)}...` : 'Browse Modules',
      actionTab: nextItem && 'provider' in nextItem ? 'resources' : 'recorded-videos',
      targetId: nextItem?.id
    });
  }

  // 2. STREAK RETENTION ALERT (if user has active streak but hasn't completed modules today)
  if (progress.currentStreakDays > 0 && completedToday === 0 && settings.notifyStreakRisk) {
    alerts.push({
      id: `alert-streak-${today}`,
      type: 'streak_alert',
      title: `🔥 Protect Your ${progress.currentStreakDays}-Day Learning Streak!`,
      message: `Your active learning streak will reset if you don't complete at least 1 module before midnight. A quick 15-min lesson keeps your momentum alive.`,
      timestamp: 'Expiring today',
      read: false,
      priority: 'high',
      actionText: 'Quick 15m Lesson',
      actionTab: 'recorded-videos'
    });
  }

  // 3. CURRICULUM MASTERY MILESTONE NUDGE
  if (overallMastery < 100) {
    const nextMilestone = overallMastery < 25 ? 25 : overallMastery < 50 ? 50 : overallMastery < 75 ? 75 : 100;
    const itemsNeeded = Math.max(1, Math.ceil(((nextMilestone - overallMastery) / 100) * totalItems));
    alerts.push({
      id: `alert-milestone-${nextMilestone}`,
      type: 'milestone_nudge',
      title: `📈 ${nextMilestone}% Mastery Milestone Approaching`,
      message: `You are at ${overallMastery}% curriculum mastery. Complete ${itemsNeeded} more ${itemsNeeded === 1 ? 'module' : 'modules'} to unlock the ${nextMilestone}% career readiness badge!`,
      timestamp: 'Milestone Goal',
      read: false,
      priority: 'medium',
      actionText: 'Open Checklist',
      actionTab: 'resources'
    });
  }

  // 4. SMART RECOMMENDED NEXT LESSON (based on critical gap)
  if (pendingVideos.length > 0) {
    const topVideo = pendingVideos[0];
    alerts.push({
      id: `alert-video-rec-${topVideo.id}`,
      type: 'module_recommendation',
      title: `💡 Recommended Masterclass: ${topVideo.skillCovered || topVideo.title}`,
      message: `Master ${topVideo.title} with interactive scratchpad notes & cheat sheets. Covers: ${topVideo.whyRecommended}`,
      timestamp: 'Top Priority',
      read: false,
      priority: 'medium',
      actionText: 'Launch Video Classroom',
      actionTab: 'recorded-videos',
      targetId: topVideo.id
    });
  }

  return alerts;
}
