import { UserProgressState } from '../types';
import { getTodayDateString } from './notifications';

export interface StreakMilestoneTier {
  days: number;
  title: string;
  badge: string;
  tierName: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const STREAK_MILESTONE_TIERS: StreakMilestoneTier[] = [
  {
    days: 3,
    title: '3-Day Spark',
    badge: '⚡',
    tierName: 'Spark Starter',
    description: 'Built the initial spark! You have shown up for 3 days in a row.',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  {
    days: 7,
    title: '7-Day Flame',
    badge: '🔥',
    tierName: 'Consistency Master',
    description: 'A full week of non-stop learning! Study habits are crystallizing.',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    days: 14,
    title: '14-Day Blaze',
    badge: '🌟',
    tierName: 'Habit Builder',
    description: 'Two full weeks! Research shows 14 days forms a permanent daily neural habit.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  {
    days: 21,
    title: '21-Day Routine',
    badge: '🚀',
    tierName: 'Discipline Titan',
    description: '21 continuous days of career skill development! True career acceleration.',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    days: 30,
    title: '30-Day Inferno',
    badge: '👑',
    tierName: 'Infernal Champion',
    description: '1 full month of unwavering commitment! You are in the top 5% of dedicated learners.',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    days: 60,
    title: '60-Day Mastery',
    badge: '💎',
    tierName: 'Career Architect',
    description: '60 continuous days! Your skills are now commercially competitive and interview-ready.',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200'
  },
  {
    days: 100,
    title: '100-Day Legacy',
    badge: '🏆',
    tierName: 'Legendary Scholar',
    description: 'The ultimate 100-day milestone! Mastery achieved across curriculum foundations.',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200'
  }
];

export interface DayStreakItem {
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: string; // 'M', 'T', 'W', etc.
  dayName: string; // 'Monday', 'Tuesday', etc.
  formattedDate: string; // 'Aug 18'
  isToday: boolean;
  isPast: boolean;
  isCompleted: boolean;
  moduleCount: number;
}

export function getCurrentStreakTier(streakDays: number) {
  let currentTier: StreakMilestoneTier = STREAK_MILESTONE_TIERS[0];
  let nextTier: StreakMilestoneTier | null = STREAK_MILESTONE_TIERS[0];

  for (let i = 0; i < STREAK_MILESTONE_TIERS.length; i++) {
    if (streakDays >= STREAK_MILESTONE_TIERS[i].days) {
      currentTier = STREAK_MILESTONE_TIERS[i];
      nextTier = STREAK_MILESTONE_TIERS[i + 1] || null;
    } else {
      if (!nextTier || nextTier.days <= currentTier.days) {
        nextTier = STREAK_MILESTONE_TIERS[i];
      }
      break;
    }
  }

  const prevDays = streakDays < STREAK_MILESTONE_TIERS[0].days ? 0 : currentTier.days;
  const targetDays = nextTier ? nextTier.days : currentTier.days;
  const progressPercent = nextTier 
    ? Math.min(100, Math.max(0, Math.round(((streakDays - prevDays) / (targetDays - prevDays)) * 100)))
    : 100;
  const daysRemaining = nextTier ? Math.max(0, nextTier.days - streakDays) : 0;

  return {
    currentTier,
    nextTier,
    progressPercent,
    daysRemaining,
    isMaxTier: !nextTier
  };
}

export function getTodayModuleCount(progress: UserProgressState): number {
  const today = getTodayDateString();
  const dailyMap = progress.dailyCompletedModuleIds || {};
  return dailyMap[today]?.length || 0;
}

export function isStreakActiveToday(progress: UserProgressState): boolean {
  return getTodayModuleCount(progress) > 0;
}

export function getPast7DaysStreak(progress: UserProgressState): DayStreakItem[] {
  const items: DayStreakItem[] = [];
  const today = new Date();
  const dailyMap = progress.dailyCompletedModuleIds || {};

  const dayLetters = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    
    // Check if recorded as completed on that date or active in streak
    // For demo purposes, if streakDays >= 3 and it's within the streak window, show completed
    const explicitCount = dailyMap[dateStr]?.length || 0;
    const isCompleted = explicitCount > 0 || (isToday ? explicitCount > 0 : (progress.currentStreakDays >= i && i > 0));
    
    items.push({
      dateStr,
      dayOfWeek: dayLetters[d.getDay()],
      dayName: fullDayNames[d.getDay()],
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday,
      isPast: i > 0,
      isCompleted,
      moduleCount: explicitCount > 0 ? explicitCount : (isCompleted ? 1 : 0)
    });
  }

  return items;
}

export function getPast30DaysActivity(progress: UserProgressState) {
  const items: { dateStr: string; count: number; level: 0 | 1 | 2 | 3; formatted: string; isToday: boolean }[] = [];
  const today = new Date();
  const dailyMap = progress.dailyCompletedModuleIds || {};

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;

    let count = dailyMap[dateStr]?.length || 0;
    if (count === 0 && !isToday && progress.currentStreakDays >= (i + 1)) {
      count = 1; // within streak window
    }

    let level: 0 | 1 | 2 | 3 = 0;
    if (count >= 3) level = 3;
    else if (count === 2) level = 2;
    else if (count === 1) level = 1;

    items.push({
      dateStr,
      count,
      level,
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday
    });
  }

  return items;
}

export function getMotivationalEncouragement(streakDays: number, isTodayDone: boolean): {
  headline: string;
  body: string;
  actionPrompt: string;
} {
  if (isTodayDone) {
    if (streakDays >= 30) {
      return {
        headline: '🌟 Unstoppable Momentum!',
        body: `You are on an incredible ${streakDays}-day streak. Your dedication to your craft puts you ahead of 95% of candidates.`,
        actionPrompt: 'Great work! Feel free to review notes or rest up for tomorrow.'
      };
    }
    if (streakDays >= 7) {
      return {
        headline: '🔥 Streak Secured for Today!',
        body: `You've conquered your daily target and pushed your streak to ${streakDays} days. Consistency is your greatest career advantage.`,
        actionPrompt: 'Want extra credit? Try a quick 5-min video quiz or interview flashcard!'
      };
    }
    return {
      headline: '✨ Great Job Today!',
      body: `You completed your learning module today! Your ${streakDays}-day streak is actively compounding your skills.`,
      actionPrompt: 'Keep up this rhythm tomorrow to unlock your next milestone badge.'
    };
  } else {
    if (streakDays >= 7) {
      return {
        headline: `⏳ Protect Your ${streakDays}-Day Streak!`,
        body: `Don't let your ${streakDays} consecutive days reset. A quick 15-minute lesson or video classroom session will keep your streak burning bright.`,
        actionPrompt: 'Complete 1 module now to secure today!'
      };
    }
    return {
      headline: '🎯 Keep Your Daily Habit Alive',
      body: `Complete just 1 module or video chapter today to maintain your ${streakDays}-day streak and stay ahead on your roadmap.`,
      actionPrompt: 'Start today’s recommended lesson now.'
    };
  }
}
