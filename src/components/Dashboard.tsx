import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  Layers, 
  BookOpen, 
  FolderGit2, 
  Activity, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Flame, 
  Scale, 
  Download, 
  Send, 
  ExternalLink, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  ChevronDown,
  RefreshCw,
  Award,
  Zap,
  Info,
  Video,
  Play,
  FileText,
  Search,
  Filter,
  ListChecks,
  LayoutGrid,
  CheckSquare,
  Square,
  RotateCcw,
  GraduationCap,
  Bell,
  Settings2,
  Film,
  Trophy,
  FileSearch,
  Share2
} from 'lucide-react';
import { 
  AnalysisResult, 
  UserProgressState, 
  ChatMessage, 
  CareerMatch,
  SkillGapItem,
  GapSeverity,
  LearningResource,
  ProjectRecommendation,
  RoadmapPhase,
  RecordedVideoLesson,
  AppNotification,
  ReminderSettings
} from '../types';
import { triggerConfetti, cleanBrandText } from '../lib/utils';
import { CareerComparisonModal } from './CareerComparisonModal';
import { ExportModal } from './ExportModal';
import { VideoClassroomModal } from './VideoClassroomModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { DailyReminderBanner } from './DailyReminderBanner';
import { FloatingNotificationToast } from './FloatingNotificationToast';
import { LearningStreakCard } from './LearningStreakCard';
import { LearningStreakModal } from './LearningStreakModal';
import { CompetitionDemoModal } from './CompetitionDemoModal';
import { VerificationModal, VerificationItem } from './VerificationModal';
import { MockInterviewModal } from './MockInterviewModal';
import { ResumeAtsModal } from './ResumeAtsModal';
import { JobMarketRadarModal } from './JobMarketRadarModal';
import { DigitalCertificateModal } from './DigitalCertificateModal';
import { RECORDED_VIDEO_LESSONS_DATABASE } from '../data/recordedVideos';
import { 
  DEFAULT_REMINDER_SETTINGS, 
  generateDailyLearningAlerts, 
  getCompletedTodayCount, 
  getTodayDateString, 
  playNotificationSound, 
  sendNativeNotification 
} from '../lib/notifications';
import { isStreakActiveToday, getTodayModuleCount } from '../lib/streak';

interface DashboardProps {
  analysisResult: AnalysisResult;
  onUpdateAnalysis: (newAnalysis: AnalysisResult) => void;
  onEditProfile: () => void;
}

type TabType = 'overview' | 'matches' | 'skill-gaps' | 'roadmap' | 'recorded-videos' | 'resources' | 'projects' | 'progress' | 'assistant' | 'profile';

export const Dashboard: React.FC<DashboardProps> = ({
  analysisResult,
  onUpdateAnalysis,
  onEditProfile
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMockInterviewModal, setShowMockInterviewModal] = useState(false);
  const [showResumeAtsModal, setShowResumeAtsModal] = useState(false);
  const [showJobMarketRadarModal, setShowJobMarketRadarModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [activeVerificationItem, setActiveVerificationItem] = useState<VerificationItem | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<RecordedVideoLesson | null>(null);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('all');
  const [videoViewMode, setVideoViewMode] = useState<'cards' | 'checklist'>('cards');
  const [videoStatusFilter, setVideoStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedPhaseId, setExpandedPhaseId] = useState<string>(analysisResult.roadmap[0]?.id || 'phase-1-foundations');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Learning Resources Checklist State
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');
  const [resourceStatusFilter, setResourceStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [resourceDifficultyFilter, setResourceDifficultyFilter] = useState<string>('all');
  const [resourceFormatFilter, setResourceFormatFilter] = useState<string>('all');
  const [resourceViewMode, setResourceViewMode] = useState<'checklist' | 'cards'>('checklist');

  // Notifications & Daily Learning Reminders State
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`skillspire_read_notifs_${analysisResult.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Interactive Local Progress State
  const [progress, setProgress] = useState<UserProgressState>(() => {
    const saved = localStorage.getItem(`skillspire_progress_${analysisResult.id}`) || localStorage.getItem(`pathpilot_progress_${analysisResult.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      completedSkillNames: analysisResult.topStrengths,
      completedResourceIds: [],
      completedProjectIds: [],
      completedMilestoneIds: [],
      completedPhaseIds: [],
      completedVideoLessonIds: [],
      activePhaseId: analysisResult.roadmap[0]?.id || 'phase-1',
      currentStreakDays: 3,
      longestStreakDays: 5,
      lastActiveDate: new Date().toISOString(),
      streakFreezesAvailable: 1,
      streakFreezesUsed: [],
      notes: {},
      dailyCompletedModuleIds: {},
      reminderSettings: DEFAULT_REMINDER_SETTINGS,
      dismissedAlertDates: []
    };
  });

  const reminderSettings: ReminderSettings = progress.reminderSettings || DEFAULT_REMINDER_SETTINGS;

  const updateReminderSettings = (newSettings: ReminderSettings) => {
    const updated = { ...progress, reminderSettings: newSettings };
    saveProgress(updated);
  };

  const handleUseStreakFreeze = () => {
    const today = getTodayDateString();
    const currentFreezes = progress.streakFreezesAvailable ?? 1;
    const used = progress.streakFreezesUsed || [];
    if (currentFreezes > 0 && !used.includes(today)) {
      saveProgress({
        ...progress,
        streakFreezesAvailable: currentFreezes - 1,
        streakFreezesUsed: [...used, today]
      });
      if (reminderSettings.soundEnabled) playNotificationSound();
      setActiveToast({
        id: `freeze-used-${Date.now()}`,
        type: 'streak_alert',
        title: '🛡️ Streak Freeze Activated!',
        message: 'Your learning streak is safely protected for 24 hours. Take the rest you need!',
        timestamp: 'Just now',
        read: false
      });
    }
  };

  const handleManualCheckInToday = () => {
    const today = getTodayDateString();
    const currentDailyMap = { ...(progress.dailyCompletedModuleIds || {}) };
    const todayItems = currentDailyMap[today] || [];
    const isAlreadyActiveToday = todayItems.length > 0;
    const newStreak = isAlreadyActiveToday ? progress.currentStreakDays : (progress.currentStreakDays || 0) + 1;
    const newLongest = Math.max(progress.longestStreakDays || newStreak, newStreak);
    
    currentDailyMap[today] = [...todayItems, `manual-checkin-${Date.now()}`];
    saveProgress({
      ...progress,
      currentStreakDays: newStreak,
      longestStreakDays: newLongest,
      dailyCompletedModuleIds: currentDailyMap,
      lastActiveDate: new Date().toISOString()
    });
    if (reminderSettings.soundEnabled) playNotificationSound();
    setActiveToast({
      id: `manual-checkin-toast-${Date.now()}`,
      type: 'streak_alert',
      title: isAlreadyActiveToday ? '✨ Study Session Logged!' : `🔥 Streak Extended to ${newStreak} Days!`,
      message: 'Great job logging your daily practice! Your streak is secured for today.',
      timestamp: 'Just now',
      read: false
    });
  };

  const markNotificationRead = (notifId: string) => {
    const updated = [...readNotificationIds, notifId];
    setReadNotificationIds(updated);
    localStorage.setItem(`skillspire_read_notifs_${analysisResult.id}`, JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    const allIds = generatedNotifications.map(n => n.id);
    setReadNotificationIds(allIds);
    localStorage.setItem(`skillspire_read_notifs_${analysisResult.id}`, JSON.stringify(allIds));
  };

  const dismissDailyBannerForToday = () => {
    const today = getTodayDateString();
    const currentDismissed = progress.dismissedAlertDates || [];
    if (!currentDismissed.includes(today)) {
      saveProgress({ ...progress, dismissedAlertDates: [...currentDismissed, today] });
    }
  };

  const triggerTestNotification = () => {
    if (reminderSettings.soundEnabled) playNotificationSound();
    sendNativeNotification(
      '⏰ Daily Study Reminder: Career Roadmap',
      `Time for your daily module! Complete a quick 15-min lesson to advance toward ${analysisResult.primaryCareer.career.title}.`
    );
    setActiveToast({
      id: `test-toast-${Date.now()}`,
      type: 'daily_reminder',
      title: '⏰ Daily Study Reminder',
      message: `Complete your daily learning goal in Career-Focused Learning or Curated Resources to maintain your ${progress.currentStreakDays}-day streak!`,
      timestamp: 'Just now',
      read: false,
      actionText: 'Open Recommendations',
      actionTab: 'recorded-videos'
    });
  };

  const handleNotificationAction = (
    tab: 'overview' | 'matches' | 'skill-gaps' | 'roadmap' | 'recorded-videos' | 'resources' | 'projects' | 'progress' | 'assistant' | 'profile',
    targetId?: string
  ) => {
    setActiveTab(tab);
    if (tab === 'recorded-videos' && targetId) {
      const targetVideo = recommendedVideos.find(v => v.id === targetId);
      if (targetVideo) setActiveVideoModal(targetVideo);
    } else if (tab === 'resources' && targetId) {
      const targetResource = analysisResult.allRecommendedResources.find(r => r.id === targetId);
      if (targetResource) {
        setResourceSearchQuery(targetResource.title);
      }
    }
  };

  const recommendedVideos = (() => {
    const list = (analysisResult.recommendedRecordedVideos && analysisResult.recommendedRecordedVideos.length > 0)
      ? [...analysisResult.recommendedRecordedVideos]
      : [...RECORDED_VIDEO_LESSONS_DATABASE.slice(0, 5)];
    
    // Ensure the flagship SkillSpire original micro-learning lesson is always present at index 0
    const originalLesson = RECORDED_VIDEO_LESSONS_DATABASE.find(v => v.id === 'skillspire-original-java-01');
    if (originalLesson && !list.some(v => v.id === originalLesson.id)) {
      return [originalLesson, ...list];
    }
    return list;
  })();

  // Dynamic Learning Notifications Feed
  const rawNotifications = generateDailyLearningAlerts(analysisResult, progress, reminderSettings);
  const generatedNotifications = rawNotifications.map(n => ({
    ...n,
    read: readNotificationIds.includes(n.id)
  }));
  const unreadAlertsCount = generatedNotifications.filter(n => !n.read).length;

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Hello ${analysisResult.userProfile.fullName.split(' ')[0]}! I'm your AI Career Strategist for **${analysisResult.primaryCareer.career.title}**.\n\nI've analyzed your ${analysisResult.userProfile.skills.length} skills, identified your top gaps in **${analysisResult.criticalGaps.slice(0, 2).map(g => g.skillName).join(' & ')}**, and prepared your tailored 5-phase roadmap with **${recommendedVideos.length} Career-Focused Learning video masterclasses**. What would you like to explore first?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Open Career-Focused Learning',
        'What should I learn next?',
        'Why was this career recommended?',
        'Which project should I build first?'
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const profile = analysisResult.userProfile;
  const primaryCareer = analysisResult.primaryCareer;

  // Persist progress changes
  const saveProgress = (newProgress: UserProgressState) => {
    setProgress(newProgress);
    localStorage.setItem(`skillspire_progress_${analysisResult.id}`, JSON.stringify(newProgress));
  };

  // Daily Tracking Helper
  const recordDailyCompletion = (itemId: string, isNowCompleted: boolean) => {
    const today = getTodayDateString();
    const currentDailyMap = { ...(progress.dailyCompletedModuleIds || {}) };
    const currentTodayList = currentDailyMap[today] || [];
    
    let newTodayList: string[];
    if (isNowCompleted) {
      newTodayList = currentTodayList.includes(itemId) ? currentTodayList : [...currentTodayList, itemId];
    } else {
      newTodayList = currentTodayList.filter(id => id !== itemId);
    }
    currentDailyMap[today] = newTodayList;

    const target = reminderSettings.dailyModuleTarget || 2;
    if (isNowCompleted && newTodayList.length === target) {
      if (reminderSettings.soundEnabled) playNotificationSound();
      setActiveToast({
        id: `goal-reached-${Date.now()}`,
        type: 'daily_reminder',
        title: '🎯 Daily Study Goal Achieved!',
        message: `You completed ${target} of ${target} modules today! Your learning streak is protected.`,
        timestamp: 'Just now',
        read: false,
        actionText: 'View Readiness',
        actionTab: 'progress'
      });
      if (reminderSettings.browserNotifications) {
        sendNativeNotification('🎯 Daily Study Goal Achieved!', `You completed your daily target of ${target} modules for ${analysisResult.primaryCareer.career.title}!`);
      }
    }
    return currentDailyMap;
  };

  // Verification Confirmation Handler
  const handleConfirmVerification = (
    item: VerificationItem, 
    details?: { method: string; score?: number; githubUrl?: string; notes?: string }
  ) => {
    let updatedProgress = { ...progress };
    const xpReward = item.xpReward || (item.type === 'project' ? 250 : item.type === 'milestone' ? 100 : 50);

    if (item.type === 'skill') {
      if (!updatedProgress.completedSkillNames.includes(item.id)) {
        updatedProgress.completedSkillNames = [...updatedProgress.completedSkillNames, item.id];
      }
    } else if (item.type === 'resource') {
      if (!updatedProgress.completedResourceIds.includes(item.id)) {
        updatedProgress.completedResourceIds = [...updatedProgress.completedResourceIds, item.id];
        updatedProgress.dailyCompletedModuleIds = recordDailyCompletion(item.id, true);
      }
    } else if (item.type === 'video') {
      const currentVideos = updatedProgress.completedVideoLessonIds || [];
      if (!currentVideos.includes(item.id)) {
        updatedProgress.completedVideoLessonIds = [...currentVideos, item.id];
        updatedProgress.dailyCompletedModuleIds = recordDailyCompletion(item.id, true);
      }
    } else if (item.type === 'project') {
      if (!updatedProgress.completedProjectIds.includes(item.id)) {
        updatedProgress.completedProjectIds = [...updatedProgress.completedProjectIds, item.id];
      }
    } else if (item.type === 'milestone') {
      if (!updatedProgress.completedMilestoneIds.includes(item.id)) {
        updatedProgress.completedMilestoneIds = [...updatedProgress.completedMilestoneIds, item.id];
      }
    }

    saveProgress(updatedProgress);
    triggerConfetti();
    if (reminderSettings.soundEnabled) playNotificationSound();

    // Celebratory Active Toast
    setActiveToast({
      id: `verified-${Date.now()}`,
      type: 'daily_reminder',
      title: `🏆 Verified: ${item.title.length > 30 ? item.title.slice(0, 27) + '...' : item.title}`,
      message: `Earned +${xpReward} XP via ${details?.method || 'Verification'}! Readiness score updated.`,
      timestamp: 'Just now',
      read: false,
      actionText: 'View Readiness',
      actionTab: 'progress'
    });
  };

  // Toggle Handlers
  const toggleSkillCompleted = (skillName: string, forceVerify: boolean = false) => {
    const isCompleted = progress.completedSkillNames.includes(skillName);
    if (isCompleted && !forceVerify) {
      saveProgress({ 
        ...progress, 
        completedSkillNames: progress.completedSkillNames.filter(s => s !== skillName) 
      });
    } else {
      setActiveVerificationItem({
        id: skillName,
        type: 'skill',
        title: skillName,
        category: 'Skill Gap Mastery',
        xpReward: 75
      });
    }
  };

  const toggleResourceCompleted = (resourceId: string, resourceTitle?: string) => {
    const isCompleted = progress.completedResourceIds.includes(resourceId);
    if (isCompleted) {
      const updatedDailyMap = recordDailyCompletion(resourceId, false);
      saveProgress({ 
        ...progress, 
        completedResourceIds: progress.completedResourceIds.filter(id => id !== resourceId),
        dailyCompletedModuleIds: updatedDailyMap
      });
    } else {
      const found = analysisResult.allRecommendedResources.find(r => r.id === resourceId);
      setActiveVerificationItem({
        id: resourceId,
        type: 'resource',
        title: resourceTitle || found?.title || resourceId,
        category: found?.provider || 'Curated Resource',
        xpReward: 50
      });
    }
  };

  const toggleVideoCompleted = (videoId: string, videoTitle?: string) => {
    const currentCompleted = progress.completedVideoLessonIds || [];
    const isCompleted = currentCompleted.includes(videoId);
    if (isCompleted) {
      const updatedDailyMap = recordDailyCompletion(videoId, false);
      saveProgress({ 
        ...progress, 
        completedVideoLessonIds: currentCompleted.filter(id => id !== videoId),
        dailyCompletedModuleIds: updatedDailyMap
      });
    } else {
      const found = recommendedVideos.find(v => v.id === videoId);
      setActiveVerificationItem({
        id: videoId,
        type: 'video',
        title: videoTitle || found?.title || videoId,
        category: 'Career-Focused Learning',
        xpReward: 100
      });
    }
  };

  const toggleProjectCompleted = (projectId: string, projectTitle?: string) => {
    const isCompleted = progress.completedProjectIds.includes(projectId);
    if (isCompleted) {
      saveProgress({ 
        ...progress, 
        completedProjectIds: progress.completedProjectIds.filter(id => id !== projectId) 
      });
    } else {
      const found = analysisResult.allRecommendedProjects.find(p => p.id === projectId);
      setActiveVerificationItem({
        id: projectId,
        type: 'project',
        title: projectTitle || found?.title || projectId,
        category: 'Capstone Project',
        xpReward: 250
      });
    }
  };

  const toggleMilestoneCompleted = (milestoneId: string, milestoneTitle?: string) => {
    const isCompleted = progress.completedMilestoneIds.includes(milestoneId);
    if (isCompleted) {
      saveProgress({ 
        ...progress, 
        completedMilestoneIds: progress.completedMilestoneIds.filter(id => id !== milestoneId) 
      });
    } else {
      // Find milestone title from roadmap phases
      let title = milestoneTitle || milestoneId;
      if (!milestoneTitle) {
        for (const phase of analysisResult.roadmap) {
          const m = phase.milestones?.find(item => item.id === milestoneId);
          if (m) {
            title = m.title;
            break;
          }
        }
      }

      setActiveVerificationItem({
        id: milestoneId,
        type: 'milestone',
        title: title,
        category: 'Roadmap Milestone',
        xpReward: 100
      });
    }
  };

  // Bulk Actions
  const markAllResourcesCompleted = () => {
    const allIds = analysisResult.allRecommendedResources.map(r => r.id);
    triggerConfetti();
    saveProgress({ ...progress, completedResourceIds: allIds });
  };

  const resetAllResources = () => {
    saveProgress({ ...progress, completedResourceIds: [] });
  };

  const markAllVideosCompleted = () => {
    const allIds = recommendedVideos.map(v => v.id);
    triggerConfetti();
    saveProgress({ ...progress, completedVideoLessonIds: allIds });
  };

  const resetAllVideos = () => {
    saveProgress({ ...progress, completedVideoLessonIds: [] });
  };

  // Learning Resources Mastery Calculation
  const allResources = analysisResult.allRecommendedResources || [];
  const totalResourcesCount = allResources.length;
  const completedResourcesCount = allResources.filter(r => progress.completedResourceIds.includes(r.id)).length;
  const resourceMasteryPercentage = totalResourcesCount > 0 
    ? Math.round((completedResourcesCount / totalResourcesCount) * 100) 
    : 0;
  const totalResourceHours = allResources.reduce((sum, r) => sum + (r.estimatedHours || 0), 0);
  const completedResourceHours = allResources
    .filter(r => progress.completedResourceIds.includes(r.id))
    .reduce((sum, r) => sum + (r.estimatedHours || 0), 0);
  const remainingResourceHours = Math.max(0, totalResourceHours - completedResourceHours);

  // Video Masterclasses Mastery Calculation
  const totalVideosCount = recommendedVideos.length;
  const completedVideosCount = (progress.completedVideoLessonIds || []).filter(id => recommendedVideos.some(v => v.id === id)).length;
  const videoMasteryPercentage = totalVideosCount > 0
    ? Math.round((completedVideosCount / totalVideosCount) * 100)
    : 0;

  // Readiness Calculation
  const totalRequiredSkillsCount = primaryCareer.career.requiredSkills.length;
  const totalProjectsCount = Math.max(1, analysisResult.allRecommendedProjects.length);
  const totalMilestonesCount = Math.max(1, analysisResult.roadmap.flatMap(p => p.milestones).length);
  const totalVideosDenominator = Math.max(1, recommendedVideos.length);

  const skillsWeight = (progress.completedSkillNames.length / Math.max(1, totalRequiredSkillsCount)) * 40;
  const projectsWeight = (progress.completedProjectIds.length / totalProjectsCount) * 25;
  const milestonesWeight = (progress.completedMilestoneIds.length / totalMilestonesCount) * 20;
  const videosWeight = (completedVideosCount / totalVideosDenominator) * 15;

  const dynamicReadinessScore = Math.min(100, Math.round(skillsWeight + projectsWeight + milestonesWeight + videosWeight));

  // Chat message send handler
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          analysisResult,
          chatHistory: chatMessages.map(m => ({ role: m.sender, text: m.content }))
        })
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || "I've updated your roadmap context. What else can I guide you on?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'How can I improve my SQL?',
          'I have only 3 months. What should I prioritize?',
          'Give me an interview question for this role'
        ]
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: `For **${primaryCareer.career.title}**, focus on Phase 1 (${analysisResult.criticalGaps[0]?.skillName || 'Foundations'}). Build projects that solve real business problems to impress recruiters!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const nextImmediateAction = analysisResult.criticalGaps[0]
    ? `Master ${analysisResult.criticalGaps[0].skillName} in Phase 1 (${analysisResult.criticalGaps[0].rationale.slice(0, 70)}...)`
    : 'Deploy your first capstone project to a live cloud host.';

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      
      {/* Top Intelligence Banner */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Career Target & Match Score */}
            <div className="flex items-start sm:items-center gap-4">
              
              {/* Circular Match Ring */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${primaryCareer.matchScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {primaryCareer.matchScore}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Match</span>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Primary Target Career
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {primaryCareer.career.category}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {primaryCareer.career.avgSalaryRange}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                  <span>{primaryCareer.career.title}</span>
                </h1>

                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  Candidate: <strong>{profile.fullName}</strong> ({profile.educationLevel} • {profile.weeklyLearningTime}/wk)
                </p>
              </div>

            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Daily Learning Reminder Bell */}
              <button
                id="learning-notifications-btn"
                onClick={() => setShowNotificationModal(true)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  unreadAlertsCount > 0
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title="Daily Study Reminders & Alerts"
              >
                <Bell className={`w-3.5 h-3.5 ${unreadAlertsCount > 0 ? 'text-amber-600 animate-bounce' : 'text-slate-600'}`} />
                <span>Daily Reminders</span>
                {unreadAlertsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {/* Official Website Tutorial & Competition Demo Video Button */}
              <button
                id="header-competition-video-btn"
                onClick={() => setShowCompetitionModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer animate-pulse border border-amber-300"
                title="Watch Step-by-Step Website Tutorial & Competition Video (MP4)"
              >
                <Video className="w-3.5 h-3.5 fill-slate-950" />
                <span>Tutorial / Demo (MP4)</span>
              </button>

              {/* Direct Java MP4 Video Download Button */}
              <button
                id="header-download-video-btn"
                onClick={() => {
                  const originalLesson = RECORDED_VIDEO_LESSONS_DATABASE.find(v => v.id === 'skillspire-original-java-01');
                  if (originalLesson) {
                    setActiveVideoModal(originalLesson);
                  } else {
                    setActiveTab('recorded-videos');
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                title="Open Java Fundamentals Player & Download MP4 Video"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Java Video</span>
              </button>

              {/* AI Mock Interview Simulator */}
              <button
                id="header-mock-interview-btn"
                onClick={() => setShowMockInterviewModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Launch Live AI Technical & Behavioral Interview Simulation"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Mock Interview</span>
              </button>

              {/* AI Resume & ATS Scanner */}
              <button
                id="header-resume-ats-btn"
                onClick={() => setShowResumeAtsModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Scan Resume for ATS Compatibility & AI Bullet Rewrites"
              >
                <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                <span>ATS Resume Scanner</span>
              </button>

              {/* Real-time Job Market Radar */}
              <button
                id="header-job-market-btn"
                onClick={() => setShowJobMarketRadarModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Explore Live Job Openings, Salaries & Trending Skills"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Market Radar</span>
              </button>

              {/* Digital Certificate */}
              <button
                id="header-certificate-btn"
                onClick={() => setShowCertificateModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="View & Add Verified Certificate to LinkedIn"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Certificate</span>
              </button>

              <button
                id="compare-careers-btn"
                onClick={() => setShowComparisonModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Careers</span>
              </button>

              <button
                id="export-brief-btn"
                onClick={() => setShowExportModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Strategy Brief</span>
              </button>

              <button
                onClick={onEditProfile}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 text-xs">
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block font-medium">Career Readiness</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold text-slate-900">{dynamicReadinessScore}%</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  {dynamicReadinessScore > 50 ? 'On Track' : 'Getting Started'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${dynamicReadinessScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block font-medium">Estimated Preparation</span>
              <p className="text-base font-bold text-slate-900 mt-1">{primaryCareer.estimatedMonths}</p>
              <span className="text-[10px] text-slate-500 font-medium">at {profile.weeklyLearningTime}/week</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[11px] block font-medium">Skills Mastered</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {progress.completedSkillNames.length} <span className="text-xs font-normal text-slate-400">/ {primaryCareer.career.requiredSkills.length} required</span>
              </p>
              <span className="text-[10px] text-slate-500 font-medium">{analysisResult.criticalGaps.length} critical gaps</span>
            </div>

            {/* Learning Streak Interactive Metric Card */}
            <button
              id="learning-streak-metric-btn"
              onClick={() => setShowStreakModal(true)}
              className="bg-amber-50/80 hover:bg-amber-100/80 p-3 rounded-xl border border-amber-200/90 text-left transition-all group cursor-pointer"
              title="Click to view full Learning Streak analytics, heatmap & badges"
            >
              <div className="flex items-center justify-between">
                <span className="text-amber-900 text-[11px] font-bold">Learning Streak</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded transition-colors ${
                  isStreakActiveToday(progress)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-200/80 text-amber-900 group-hover:bg-amber-300'
                }`}>
                  {isStreakActiveToday(progress) ? 'Secured' : 'At Risk'}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-base font-bold text-amber-700">
                <Flame className={`w-4 h-4 fill-amber-500 ${progress.currentStreakDays > 0 ? 'animate-bounce' : ''}`} />
                <span>{progress.currentStreakDays} Days Active</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5 group-hover:text-amber-800">
                Heatmap & Badges →
              </span>
            </button>

          </div>

        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview & Final Plan', icon: BarChart3 },
              { id: 'matches', label: 'Career Matches', icon: Target, badge: `${analysisResult.alternativeCareers.length + 1}` },
              { id: 'skill-gaps', label: 'Skill Gap Analyzer', icon: Activity, badge: `${analysisResult.allSkillGaps.length}` },
              { id: 'roadmap', label: '5-Phase Roadmap', icon: Layers },
              { id: 'recorded-videos', label: 'Career-Focused Learning', icon: Video, badge: `${completedVideosCount}/${totalVideosCount}`, highlight: true },
              { id: 'resources', label: 'Courses & Resources', icon: BookOpen, badge: `${completedResourcesCount}/${totalResourcesCount}` },
              { id: 'projects', label: 'AI Projects', icon: FolderGit2, badge: `${analysisResult.allRecommendedProjects.length}` },
              { id: 'progress', label: 'Readiness Tracker', icon: CheckCircle2 },
              { id: 'assistant', label: 'AI Career Assistant', icon: Bot },
              { id: 'profile', label: 'Candidate Profile', icon: User },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : tab.highlight 
                      ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Daily Learning Reminder & Goal Banner */}
        <DailyReminderBanner
          analysisResult={analysisResult}
          progress={progress}
          settings={reminderSettings}
          onOpenSettings={() => setShowNotificationModal(true)}
          onDismiss={dismissDailyBannerForToday}
          onQuickStart={(tab, targetId) => handleNotificationAction(tab, targetId)}
        />
        
        {/* ========================================================================= */}
        {/* 1. OVERVIEW & FINAL RESULT SCREEN */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Learning Streak Counter Hero Widget */}
            <LearningStreakCard
              progress={progress}
              analysisResult={analysisResult}
              onOpenStreakModal={() => setShowStreakModal(true)}
              onQuickStart={(tab) => handleNotificationAction(tab)}
              onUseStreakFreeze={handleUseStreakFreeze}
            />

            {/* Recommended Next Action Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Recommended Next Action</span>
                  <p className="text-xs font-semibold text-white">{nextImmediateAction}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="px-4 py-2 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Go to Phase 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Official Website Tutorial & Competition Demo Video Showcase Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-5 sm:p-6 rounded-2xl border-2 border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <Video className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-white">
                      SkillSpire AI — Website Tutorial & Walkthrough Video
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider">
                      Interactive Guide
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Step-by-step video instruction demonstrating the exact website interface: skill gap diagnostics, dynamic roadmaps, and the live code sandbox.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  id="overview-play-competition-video-btn"
                  onClick={() => setShowCompetitionModal(true)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Watch Video Tutorial (MP4)</span>
                </button>
              </div>
            </div>

            {/* Career Readiness & Hackathon Acceleration Suite Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: AI Mock Technical Interviewer */}
              <div 
                onClick={() => setShowMockInterviewModal(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm hover:shadow-md transition-all cursor-pointer group border border-indigo-800/60 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 text-[10px] font-black uppercase">
                    AI Voice & Code
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    AI Mock Interviewer
                  </h4>
                  <p className="text-xs text-indigo-200/70 mt-1 line-clamp-2">
                    Role-specific technical & behavioral simulation with instant audio feedback.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-indigo-400 gap-1 pt-1">
                  <span>Start Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: AI Resume ATS Scanner */}
              <div 
                onClick={() => setShowResumeAtsModal(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-sm hover:shadow-md transition-all cursor-pointer group border border-blue-800/60 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-[10px] font-black uppercase">
                    ATS Diagnostic
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition-colors">
                    Resume ATS Scanner
                  </h4>
                  <p className="text-xs text-blue-200/70 mt-1 line-clamp-2">
                    Scan keyword gaps and optimize bullets with 1-click Google X-Y-Z rewrites.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-blue-400 gap-1 pt-1">
                  <span>Scan Resume</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Job Market Radar */}
              <div 
                onClick={() => setShowJobMarketRadarModal(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 text-white shadow-sm hover:shadow-md transition-all cursor-pointer group border border-emerald-800/60 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase">
                    Live Salaries
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    Job Market Radar
                  </h4>
                  <p className="text-xs text-emerald-200/70 mt-1 line-clamp-2">
                    Salary percentiles, top hiring companies, and trending tech skills.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-400 gap-1 pt-1">
                  <span>View Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Verifiable Certificate */}
              <div 
                onClick={() => setShowCertificateModal(true)}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-950 to-slate-900 text-white shadow-sm hover:shadow-md transition-all cursor-pointer group border border-amber-800/60 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase">
                    LinkedIn Ready
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                    Verified Certificate
                  </h4>
                  <p className="text-xs text-amber-200/70 mt-1 line-clamp-2">
                    Generate cryptographic credential with 1-click LinkedIn certification share.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-amber-400 gap-1 pt-1">
                  <span>Claim Credential</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Explainable AI Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Explainable AI: Why {primaryCareer.career.title} Fits You</h2>
                    <p className="text-xs text-slate-500">Transparent algorithmic reasoning backing your recommendations</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 hidden sm:inline">
                  Google Gemini 3.7 Flash Reasoning
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <p className="font-medium">{analysisResult.aiExplanation.whyThisCareerFits}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Existing Strengths */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your Key Unfair Advantages:</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-3">{analysisResult.aiExplanation.strengthsAnalysis}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.topStrengths.map(strength => (
                      <span key={strength} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        ✓ {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Priority Skill Gaps */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900 mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Critical Preparation Areas:</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-3">{analysisResult.aiExplanation.gapsAnalysis}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.criticalGaps.slice(0, 3).map(gap => (
                      <span key={gap.skillName} className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">
                        ⚡ {gap.skillName} ({gap.currentLevel} → {gap.requiredLevel})
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actionable Strategy Tips */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-800 mb-2">Personalized Strategy Tips:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {analysisResult.aiExplanation.tailoredStrategyTips.map((tip, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-blue-600 block mb-1">Tip #{idx + 1}</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Roadmap & Projects Sneak Peek */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Phased Roadmap summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Your 5-Phase Roadmap ({analysisResult.estimatedTimelineSummary.estimatedMonthsText})</span>
                  </h3>
                  <button onClick={() => setActiveTab('roadmap')} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                    View Full Roadmap →
                  </button>
                </div>

                <div className="space-y-2">
                  {analysisResult.roadmap.slice(0, 3).map(phase => (
                    <div key={phase.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">Phase {phase.phaseNumber}: {phase.title}</span>
                        <p className="text-[11px] text-slate-500">{phase.focusArea}</p>
                      </div>
                      <span className="font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {phase.durationWeeks} wks
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Project Highlight */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                    <span>Top Recommended Capstone Project</span>
                  </h3>
                  <button onClick={() => setActiveTab('projects')} className="text-xs font-bold text-blue-600 hover:text-blue-800">
                    Explore All Projects →
                  </button>
                </div>

                {analysisResult.allRecommendedProjects[0] && (
                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {analysisResult.allRecommendedProjects[0].title}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        Value Score: {analysisResult.allRecommendedProjects[0].portfolioValueScore}/100
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {analysisResult.allRecommendedProjects[0].description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {analysisResult.allRecommendedProjects[0].suggestedTechStack.slice(0, 4).map(tech => (
                        <span key={tech} className="text-[10px] bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Quick Actions Footer CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setActiveTab('roadmap')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Start My Roadmap
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Explore Projects
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className="px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs rounded-xl shadow-xs"
              >
                Ask AI Career Assistant
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CAREER MATCHES & COMPARISON */}
        {/* ========================================================================= */}
        {activeTab === 'matches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ranked Career Matches</h2>
                <p className="text-xs text-slate-500">
                  Multiple career options scored against your background, skills, and interests.
                </p>
              </div>
              <button
                onClick={() => setShowComparisonModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Scale className="w-4 h-4" />
                <span>Open Comparison Tool</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Primary Match Card */}
              <div className="p-6 rounded-2xl border-2 border-blue-600 bg-white shadow-md relative flex flex-col justify-between">
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  #1 BEST FIT (CURRENT TARGET)
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {primaryCareer.career.category}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600">{primaryCareer.matchScore}%</span>
                      <span className="text-[10px] text-slate-400 block font-bold">MATCH</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 mb-1">{primaryCareer.career.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{primaryCareer.career.description}</p>

                  <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg Salary:</span>
                      <span className="font-bold text-slate-900">{primaryCareer.career.avgSalaryRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prep Timeline:</span>
                      <span className="font-bold text-slate-900">{primaryCareer.estimatedMonths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Market Demand:</span>
                      <span className="font-bold text-emerald-700">{primaryCareer.career.marketDemand}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold">{primaryCareer.strengths.length} existing strengths</span>
                  <span className="text-blue-600 font-bold">Active Primary Target</span>
                </div>
              </div>

              {/* Alternative Match Cards */}
              {analysisResult.alternativeCareers.map((match, idx) => (
                <div key={match.career.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {match.career.category}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-800">{match.matchScore}%</span>
                        <span className="text-[10px] text-slate-400 block font-bold">MATCH</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 mb-1">{match.career.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{match.career.description}</p>

                    <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Avg Salary:</span>
                        <span className="font-bold text-slate-900">{match.career.avgSalaryRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Prep Timeline:</span>
                        <span className="font-bold text-slate-900">{match.estimatedMonths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Difficulty:</span>
                        <span className="font-bold text-slate-900">{match.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{match.strengths.length} strengths</span>
                    <button
                      onClick={() => {
                        const updatedPrimary = match;
                        const updatedAlts = [primaryCareer, ...analysisResult.alternativeCareers.filter(c => c.career.id !== match.career.id)];
                        onUpdateAnalysis({
                          ...analysisResult,
                          primaryCareer: updatedPrimary,
                          alternativeCareers: updatedAlts
                        });
                        triggerConfetti();
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors"
                    >
                      Switch to This Target
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SKILL GAP ANALYZER */}
        {/* ========================================================================= */}
        {activeTab === 'skill-gaps' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Skill Gap Analyzer & Priority Matrix</h2>
                <p className="text-xs text-slate-500">
                  Comparing current capability vs {primaryCareer.career.title} market expectations.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['all', 'programming', 'data', 'ai_ml', 'cloud_devops', 'soft'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                      selectedCategoryFilter === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Gap List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {analysisResult.allSkillGaps
                  .filter(g => selectedCategoryFilter === 'all' || g.category === selectedCategoryFilter)
                  .map(gap => {
                    const isMastered = progress.completedSkillNames.includes(gap.skillName);

                    return (
                      <div 
                        key={gap.skillName}
                        className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                          isMastered ? 'bg-emerald-50/20' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Priority {gap.priorityOrder}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900">{gap.skillName}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              gap.gapSeverity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                              gap.gapSeverity === 'High' ? 'bg-amber-100 text-amber-800' :
                              gap.gapSeverity === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {gap.gapSeverity} Gap
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{gap.rationale}</p>
                        </div>

                        {/* Visual Comparative Levels */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className="text-xs font-semibold text-slate-800">
                              <span className="text-slate-400">Current:</span> {gap.currentLevel} → <span className="text-blue-600 font-bold">{gap.requiredLevel}</span>
                            </div>
                            <div className="w-32 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  isMastered ? 'bg-emerald-600 w-full' :
                                  gap.currentLevel === 'Advanced' ? 'bg-emerald-500 w-full' :
                                  gap.currentLevel === 'Intermediate' ? 'bg-blue-500 w-2/3' :
                                  gap.currentLevel === 'Beginner' ? 'bg-amber-500 w-1/3' : 'bg-rose-400 w-1/12'
                                }`}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => toggleSkillCompleted(gap.skillName)}
                            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isMastered 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="Mark skill as mastered to update readiness"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isMastered ? 'Mastered' : 'Mark Done'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PERSONALIZED LEARNING ROADMAP */}
        {/* ========================================================================= */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">5-Phase Personalized Learning Roadmap</h2>
                <p className="text-xs text-slate-500">
                  Custom-paced for {profile.weeklyLearningTime} per week. Complete milestones to advance.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                Total Duration: {analysisResult.estimatedTimelineSummary.estimatedMonthsText} ({analysisResult.estimatedTimelineSummary.totalEstimatedWeeks} weeks)
              </span>
            </div>

            <div className="space-y-4">
              {analysisResult.roadmap.map((phase) => {
                const isExpanded = expandedPhaseId === phase.id;
                const isPhaseCompleted = progress.completedPhaseIds.includes(phase.id);

                return (
                  <div 
                    key={phase.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Phase Header */}
                    <div 
                      onClick={() => setExpandedPhaseId(isExpanded ? '' : phase.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPhaseCompleted ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          0{phase.phaseNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900">{phase.title}</h3>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {phase.durationWeeks} Weeks
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{phase.focusArea}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Phase Expanded Details */}
                    {isExpanded && (
                      <div className="p-6 border-t border-slate-100 bg-slate-50/40 space-y-5 animate-in fade-in duration-150 text-xs">
                        
                        {/* Objectives */}
                        <div>
                          <h4 className="font-bold text-slate-800 mb-2">Phase Objectives:</h4>
                          <ul className="space-y-1.5 text-slate-600 pl-2">
                            {phase.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Milestones Checklist */}
                        <div>
                          <h4 className="font-bold text-slate-800 mb-2">Milestone Deliverables:</h4>
                          <div className="space-y-2">
                            {phase.milestones.map(m => {
                              const isMCompleted = progress.completedMilestoneIds.includes(m.id);
                              return (
                                <div 
                                  key={m.id}
                                  onClick={() => toggleMilestoneCompleted(m.id)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                    isMCompleted ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                                      isMCompleted ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                                    }`}>
                                      {isMCompleted && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900">{m.title}</p>
                                      <p className="text-[11px] text-slate-500">Deliverable: {m.deliverable}</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-medium">~{m.estimatedHours} hrs</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Phase Project if attached */}
                        {phase.recommendedProject && (
                          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-indigo-700">Target Phase Project</span>
                              <p className="font-bold text-slate-900">{phase.recommendedProject.title}</p>
                            </div>
                            <button
                              onClick={() => setActiveTab('projects')}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                            >
                              View Specs
                            </button>
                          </div>
                        )}

                        {/* Associated Career-Focused Learning Recorded Lecture */}
                        {(() => {
                          const taughtSkills = (phase.skillsTaught || []).filter((s): s is string => typeof s === 'string' && Boolean(s.trim()));
                          const matchingVideo = recommendedVideos.find(v => {
                            if (!v) return false;
                            const vTitle = (v.title || '').toLowerCase();
                            const vTopic = (v.topic || '').toLowerCase();
                            return taughtSkills.some(s => {
                              const sLower = s.toLowerCase();
                              return vTitle.includes(sLower) || vTopic.includes(sLower);
                            });
                          }) || recommendedVideos[0];

                          if (!matchingVideo) return null;

                          return (
                            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                                  <Play className="w-4 h-4 fill-white ml-0.5" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                    Career-Focused Learning • {cleanBrandText(matchingVideo.batchName)}
                                  </span>
                                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{cleanBrandText(matchingVideo.title)}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setActiveVideoModal(matchingVideo)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Open Video Classroom</span>
                              </button>
                            </div>
                          );
                        })()}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4.5. CAREER-FOCUSED LEARNING VIDEO BATCHES */}
        {/* ========================================================================= */}
        {activeTab === 'recorded-videos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Banner & Visual Mastery Progress */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                    <Video className="w-3.5 h-3.5" />
                    <span>Career-Focused Learning • Video Classroom</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Structured Recorded Video Masterclasses
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Watch in-depth technical lectures aligned with your target career (<strong>{primaryCareer.career.title}</strong>). Each lecture includes interactive chapter timestamps, downloadable cheat sheets & formulas, local scratchpad notes, and diagnostic post-lecture quizzes.
                  </p>
                </div>

                {/* Progress Summary Card */}
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/15 shrink-0 lg:min-w-[280px] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      <span>Video Mastery</span>
                    </span>
                    <span className="text-amber-300 font-bold text-sm">
                      {videoMasteryPercentage}%
                    </span>
                  </div>

                  {/* Visual Progress Bar with Multi-milestone markers */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-xs"
                        style={{ width: `${videoMasteryPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>0%</span>
                      <span>{completedVideosCount} of {totalVideosCount} Watched</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Readiness Impact:</span>
                    <span className="font-bold text-amber-300">+{Math.round((completedVideosCount / Math.max(1, totalVideosCount)) * 15)}% Weight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter, Search & View Mode Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={videoSearchQuery}
                  onChange={(e) => setVideoSearchQuery(e.target.value)}
                  placeholder="Search by topic, instructor, Java, React, SQL, AI, Cloud..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold shrink-0">
                <button
                  onClick={() => setVideoStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    videoStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({totalVideosCount})
                </button>
                <button
                  onClick={() => setVideoStatusFilter('pending')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    videoStatusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  To Watch ({totalVideosCount - completedVideosCount})
                </button>
                <button
                  onClick={() => setVideoStatusFilter('completed')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    videoStatusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Watched ({completedVideosCount})
                </button>
              </div>

              {/* View Switcher and Bulk Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
                  <button
                    onClick={() => setVideoViewMode('cards')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition-all ${
                      videoViewMode === 'cards' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Grid Cards View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setVideoViewMode('checklist')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition-all ${
                      videoViewMode === 'checklist' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Checklist View"
                  >
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>Checklist</span>
                  </button>
                </div>

                {/* Bulk controls */}
                <button
                  onClick={completedVideosCount === totalVideosCount ? resetAllVideos : markAllVideosCompleted}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
                >
                  {completedVideosCount === totalVideosCount ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark All</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Batches' },
                { id: 'java', label: 'Java & DSA' },
                { id: 'web', label: 'Web Dev Sigma' },
                { id: 'data', label: 'Data & AI' },
                { id: 'cloud', label: 'Cloud & DevOps' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setVideoCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all ${
                    videoCategoryFilter === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Video List / Grid Content */}
            {(() => {
              const filtered = recommendedVideos.filter(v => {
                if (!v) return false;
                const q = (videoSearchQuery || '').toLowerCase().trim();
                const vTitle = (v.title || '').toLowerCase();
                const vBatch = (v.batchName || '').toLowerCase();
                const vInst = (v.instructor || '').toLowerCase();
                const vTopic = (v.topic || '').toLowerCase();

                const matchesSearch = !q || 
                  vTitle.includes(q) ||
                  vBatch.includes(q) ||
                  vInst.includes(q) ||
                  vTopic.includes(q);

                const matchesCat = videoCategoryFilter === 'all' ||
                  (videoCategoryFilter === 'java' && (vTopic.includes('java') || vTopic.includes('dsa'))) ||
                  (videoCategoryFilter === 'web' && (vTopic.includes('web') || vTopic.includes('react') || vTopic.includes('frontend') || vTopic.includes('node'))) ||
                  (videoCategoryFilter === 'data' && (vTopic.includes('data') || vTopic.includes('python') || vTopic.includes('ai') || vTopic.includes('sql'))) ||
                  (videoCategoryFilter === 'cloud' && (vTopic.includes('cloud') || vTopic.includes('devops') || vTopic.includes('docker')));

                const isCompleted = (progress.completedVideoLessonIds || []).includes(v.id);
                const matchesStatus = videoStatusFilter === 'all' ||
                  (videoStatusFilter === 'completed' && isCompleted) ||
                  (videoStatusFilter === 'pending' && !isCompleted);

                return matchesSearch && matchesCat && matchesStatus;
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
                    <Video className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-sm text-slate-700">No video masterclasses found matching your filters.</p>
                    <button 
                      onClick={() => { setVideoSearchQuery(''); setVideoCategoryFilter('all'); setVideoStatusFilter('all'); }}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                );
              }

              {/* CHECKLIST VIEW */}
              if (videoViewMode === 'checklist') {
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
                    <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-indigo-600" />
                        <span>Video Masterclasses Checklist ({filtered.length})</span>
                      </span>
                      <span className="text-slate-400 font-normal">Click checkmark to toggle completed status</span>
                    </div>

                    {filtered.map((video, idx) => {
                      const isCompleted = (progress.completedVideoLessonIds || []).includes(video.id);

                      return (
                        <div 
                          key={video.id}
                          className={`p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 ${
                            isCompleted ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            {/* Interactive Custom Checkbox */}
                            <button
                              onClick={() => toggleVideoCompleted(video.id)}
                              id={`check-video-${video.id}`}
                              className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                                isCompleted 
                                  ? 'bg-emerald-600 text-white shadow-xs' 
                                  : 'border-2 border-slate-300 hover:border-indigo-500 bg-white'
                              }`}
                              title={isCompleted ? 'Mark as unwatched' : 'Mark as watched'}
                            >
                              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-[10px] text-slate-400 font-bold">{idx + 1}</span>}
                            </button>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                                  {cleanBrandText(video.batchName)}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  {video.topic}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {video.duration}
                                </span>
                                {isCompleted && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Watched</span>
                                  </span>
                                )}
                              </div>

                              <h4 className={`text-sm font-bold text-slate-900 transition-colors ${
                                isCompleted ? 'line-through text-slate-500' : 'hover:text-indigo-600'
                              }`}>
                                {cleanBrandText(video.title)}
                              </h4>
                              
                              <p className="text-xs text-slate-500 line-clamp-1">
                                Instructor: <strong className="text-slate-700">{cleanBrandText(video.instructor)}</strong> • {video.chapters.length} Chapters • {cleanBrandText(video.whyRecommended)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => setActiveVideoModal(video)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 fill-indigo-700" />
                              <span>Play Lecture</span>
                            </button>

                            <button
                              onClick={() => toggleVideoCompleted(video.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                                isCompleted 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              {/* CARDS GRID VIEW */}
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map(video => {
                    const isCompleted = (progress.completedVideoLessonIds || []).includes(video.id);

                    return (
                      <div 
                        key={video.id}
                        className={`p-5 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                          isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-3">
                          
                          {/* Video Thumbnail & Play Overlay */}
                          <div 
                            onClick={() => setActiveVideoModal(video)}
                            className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-100 cursor-pointer"
                          >
                            <img
                              src={video.thumbnailUrl}
                              alt={cleanBrandText(video.title)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                              </div>
                            </div>
                            
                            {/* Duration & Quality Badges */}
                            <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-amber-300">
                              {cleanBrandText(video.batchName)}
                            </span>
                            <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white">
                              {video.duration}
                            </span>
                          </div>

                          {/* Metadata Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {video.topic} • {video.difficulty}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              By {cleanBrandText(video.instructor)}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h3 className={`font-bold text-sm transition-colors line-clamp-2 ${
                              isCompleted ? 'text-slate-600' : 'text-slate-900 group-hover:text-indigo-600'
                            }`}>
                              {cleanBrandText(video.title)}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                              {cleanBrandText(video.description)}
                            </p>
                          </div>

                          {/* Chapters & Notes Summary */}
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{video.chapters.length} Video Chapters</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-500" />
                              <span>PDF Cheat Sheet Included</span>
                            </div>
                          </div>

                          {/* Why Recommended for User */}
                          <div className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                            <span className="font-bold">Target Skill Gap: </span>
                            <span>{video.whyRecommended}</span>
                          </div>

                        </div>

                        {/* Card Actions */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setActiveVideoModal(video)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Launch Classroom</span>
                          </button>

                          <button
                            onClick={() => toggleVideoCompleted(video.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Watched' : 'Mark Done'}</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. COURSES & LEARNING RECOMMENDATIONS WITH PROGRESS BAR & CHECKLIST */}
        {/* ========================================================================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header & Visual Mastery Progress Bar Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Title & Rationale */}
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Learning Recommendations & Module Mastery</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Curated Learning Curriculum & Checklist
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Custom-matched courses and hands-on modules tailored to your {profile.learningStyle} preference and critical skill gaps for <strong>{primaryCareer.career.title}</strong>. Mark completed modules on the checklist below to track your overall curriculum mastery.
                  </p>
                </div>

                {/* Right Hero Mastery Progress Card */}
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 lg:min-w-[320px] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block">Overall Curriculum</span>
                      <span className="text-2xl font-black text-white">{resourceMasteryPercentage}% Mastery</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      resourceMasteryPercentage === 100 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : resourceMasteryPercentage >= 75
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : resourceMasteryPercentage >= 40
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {resourceMasteryPercentage === 100 
                        ? '🏆 Fully Mastered' 
                        : resourceMasteryPercentage >= 75 
                        ? '🚀 Interview Ready' 
                        : resourceMasteryPercentage >= 40 
                        ? '⚡ Core Competence' 
                        : '🌱 In Progress'}
                    </span>
                  </div>

                  {/* Multi-milestone Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3.5 bg-white/20 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shadow-xs"
                        style={{ width: `${resourceMasteryPercentage}%` }}
                      />
                    </div>
                    
                    {/* Milestone Ticks */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Stats Grid inside Progress Box */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Modules</span>
                      <span className="text-xs font-bold text-white">{completedResourcesCount}/{totalResourcesCount}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Study Hours</span>
                      <span className="text-xs font-bold text-white">{completedResourceHours}h/{totalResourceHours}h</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Remaining</span>
                      <span className="text-xs font-bold text-white">~{remainingResourceHours}h</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Checklist Controls, Filters & View Mode Switcher */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={resourceSearchQuery}
                  onChange={(e) => setResourceSearchQuery(e.target.value)}
                  placeholder="Search modules, skills, Coursera, Udemy, MIT, Harvard..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold shrink-0">
                <button
                  onClick={() => setResourceStatusFilter('all')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    resourceStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Modules ({totalResourcesCount})
                </button>
                <button
                  onClick={() => setResourceStatusFilter('pending')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    resourceStatusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  To Learn ({totalResourcesCount - completedResourcesCount})
                </button>
                <button
                  onClick={() => setResourceStatusFilter('completed')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    resourceStatusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Completed ({completedResourcesCount})
                </button>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={resourceDifficultyFilter}
                  onChange={(e) => setResourceDifficultyFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
                  <button
                    onClick={() => setResourceViewMode('checklist')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition-all ${
                      resourceViewMode === 'checklist' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Checklist View"
                  >
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>Checklist</span>
                  </button>
                  <button
                    onClick={() => setResourceViewMode('cards')}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold transition-all ${
                      resourceViewMode === 'cards' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Cards Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                </div>

                {/* Bulk Actions */}
                <button
                  onClick={completedResourcesCount === totalResourcesCount ? resetAllResources : markAllResourcesCompleted}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
                >
                  {completedResourcesCount === totalResourcesCount ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark All</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Curriculum Checklist and Cards Content */}
            {(() => {
              const filtered = allResources.filter(res => {
                if (!res) return false;
                const q = (resourceSearchQuery || '').toLowerCase().trim();
                const rTitle = (res.title || '').toLowerCase();
                const rProv = (res.provider || '').toLowerCase();
                const rSkill = (res.skillCovered || '').toLowerCase();
                const rWhy = (res.whyRecommended || '').toLowerCase();

                const matchesSearch = !q ||
                  rTitle.includes(q) ||
                  rProv.includes(q) ||
                  rSkill.includes(q) ||
                  rWhy.includes(q);

                const matchesDiff = resourceDifficultyFilter === 'all' || res.difficulty === resourceDifficultyFilter;

                const isCompleted = progress.completedResourceIds.includes(res.id);
                const matchesStatus = resourceStatusFilter === 'all' ||
                  (resourceStatusFilter === 'completed' && isCompleted) ||
                  (resourceStatusFilter === 'pending' && !isCompleted);

                return matchesSearch && matchesDiff && matchesStatus;
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-sm text-slate-700">No learning modules found matching your filters.</p>
                    <button 
                      onClick={() => { setResourceSearchQuery(''); setResourceStatusFilter('all'); setResourceDifficultyFilter('all'); }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                );
              }

              {/* CHECKLIST VIEW */}
              if (resourceViewMode === 'checklist') {
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
                    <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-blue-600" />
                        <span>Interactive Learning Checklist ({filtered.length} Modules)</span>
                      </span>
                      <span className="text-slate-400 font-normal">Check off modules as you complete them</span>
                    </div>

                    {filtered.map((res, idx) => {
                      const isCompleted = progress.completedResourceIds.includes(res.id);

                      return (
                        <div 
                          key={res.id} 
                          className={`p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/80 ${
                            isCompleted ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            
                            {/* Large Interactive Checkbox Button */}
                            <button
                              onClick={() => toggleResourceCompleted(res.id)}
                              id={`check-module-${res.id}`}
                              className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                                isCompleted 
                                  ? 'bg-emerald-600 text-white shadow-xs' 
                                  : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                              }`}
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-[10px] text-slate-400 font-bold">{idx + 1}</span>}
                            </button>

                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                                  {res.provider}
                                </span>
                                
                                {res.skillCovered && (
                                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                    Target Skill: {res.skillCovered}
                                  </span>
                                )}

                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  res.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {res.isFree ? 'Free / Audit' : (res.costEstimate || 'Paid')}
                                </span>

                                <span className="text-[10px] text-slate-400 font-mono">
                                  ~{res.estimatedHours}h
                                </span>

                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {res.difficulty}
                                </span>

                                {isCompleted && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Mastered</span>
                                  </span>
                                )}
                              </div>

                              <h3 className={`font-bold text-sm transition-colors ${
                                isCompleted ? 'line-through text-slate-500' : 'text-slate-900 hover:text-blue-600'
                              }`}>
                                {res.title}
                              </h3>
                              
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {res.whyRecommended}
                              </p>
                            </div>

                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <a 
                              href={res.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <span>Open Module</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => toggleResourceCompleted(res.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                                isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                );
              }

              {/* CARDS GRID VIEW */}
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((res, idx) => {
                    const isCompleted = progress.completedResourceIds.includes(res.id);

                    return (
                      <div 
                        key={res.id} 
                        className={`p-5 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                          isCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {/* Small Checkbox */}
                              <button
                                onClick={() => toggleResourceCompleted(res.id)}
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                  isCompleted ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white hover:border-blue-500'
                                }`}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                {res.provider}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                res.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {res.isFree ? 'Free / Audit' : (res.costEstimate || 'Paid')}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">{res.estimatedHours}h</span>
                            </div>
                          </div>

                          <h3 className={`font-bold text-sm mb-1 transition-colors ${
                            isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'
                          }`}>
                            {res.title}
                          </h3>
                          
                          {res.skillCovered && (
                            <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mb-2">
                              Target Skill: {res.skillCovered}
                            </span>
                          )}

                          <p className="text-xs text-slate-500 leading-relaxed mb-3">{res.whyRecommended}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <span>Open Resource</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => toggleResourceCompleted(res.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                              isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. AI PROJECT RECOMMENDER */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI-Recommended Portfolio Projects</h2>
              <p className="text-xs text-slate-500">
                Built specifically to address your highest-priority skill gaps and showcase commercial proof-of-work.
              </p>
            </div>

            <div className="space-y-6">
              {analysisResult.allRecommendedProjects.map((proj, idx) => {
                const isCompleted = progress.completedProjectIds.includes(proj.id);

                return (
                  <div key={proj.id} className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-5">
                    
                    {/* Project Top Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            Project #{idx + 1} • {proj.difficulty}
                          </span>
                          <span className="text-xs font-bold text-slate-400">~{proj.estimatedWeeks} Weeks</span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{proj.title}</h3>
                        <p className="text-xs text-slate-500">{proj.tagline}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xl font-black text-indigo-600">{proj.portfolioValueScore}/100</span>
                          <span className="text-[10px] text-slate-400 block font-bold">PORTFOLIO VALUE</span>
                        </div>

                        <button
                          onClick={() => toggleProjectCompleted(proj.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'Project Completed!' : 'Mark Completed'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Description & Why Recommended */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                      <p>{proj.description}</p>
                      <p className="font-semibold text-indigo-900">
                        <span className="text-indigo-600">Why Recommended:</span> {proj.whyRecommended}
                      </p>
                    </div>

                    {/* Architecture Specs & Tech Stack */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Architecture Highlights:</h4>
                        <ul className="space-y-1.5 text-slate-600">
                          {proj.architectureHighlights.map((arch, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{arch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Expected Deliverables:</h4>
                        <ul className="space-y-1.5 text-slate-600 mb-3">
                          {proj.expectedDeliverables.map((deliv, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.suggestedTechStack.map(tech => (
                            <span key={tech} className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. PROGRESS TRACKER & CAREER READINESS */}
        {/* ========================================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Learning Streak Tracker Card */}
            <LearningStreakCard
              progress={progress}
              analysisResult={analysisResult}
              onOpenStreakModal={() => setShowStreakModal(true)}
              onQuickStart={(tab) => handleNotificationAction(tab)}
              onUseStreakFreeze={handleUseStreakFreeze}
            />

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Career Readiness Score & Milestone Progression</h2>
                <p className="text-xs text-slate-500">
                  Calculated dynamically from your completed skills, learning resources, and portfolio projects.
                </p>
              </div>

              {/* Big Readiness Progress Bar */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">Total Career Readiness</span>
                    <p className="text-3xl font-black text-white">{dynamicReadinessScore}% Ready</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                    {dynamicReadinessScore >= 75 ? 'Ready for Technical Interviews' : dynamicReadinessScore >= 40 ? 'Core Foundations Established' : 'Early Phase Ramp-up'}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${dynamicReadinessScore}%` }}
                  />
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Skills Mastered</h4>
                  <p className="text-xl font-extrabold text-blue-600">
                    {progress.completedSkillNames.length} <span className="text-xs font-normal text-slate-500">/ {primaryCareer.career.requiredSkills.length}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Check off skills in the Skill Gap Analyzer</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Portfolio Projects</h4>
                  <p className="text-xl font-extrabold text-indigo-600">
                    {progress.completedProjectIds.length} <span className="text-xs font-normal text-slate-500">/ {analysisResult.allRecommendedProjects.length}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Deploy projects to prove competency</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Milestones Completed</h4>
                  <p className="text-xl font-extrabold text-emerald-600">
                    {progress.completedMilestoneIds.length} <span className="text-xs font-normal text-slate-500">/ {analysisResult.roadmap.flatMap(p => p.milestones).length}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Structured roadmap check-ins</p>
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Career Strategy Brief</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. AI CAREER ASSISTANT */}
        {/* ========================================================================= */}
        {activeTab === 'assistant' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">SkillSpire AI Career Mentor</h2>
                  <p className="text-xs text-slate-500">
                    Context-aware strategist equipped with your background, gaps, and roadmap.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-bold">
                Online & Context Active
              </span>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col h-[550px]">
              
              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs' 
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <span className={`text-[10px] mt-1.5 block ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Suggested Question Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(action)}
                            className="px-2.5 py-1 rounded-lg text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors font-medium text-left"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 italic bg-indigo-50 p-3 rounded-xl w-fit">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing career advice...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder={`Ask anything about ${primaryCareer.career.title}, interview drills, 10-hour schedules...`}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. CANDIDATE PROFILE */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Candidate Diagnostic Profile</h2>
                  <p className="text-xs text-slate-500">Information submitted during onboarding assessment.</p>
                </div>
                <button
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900">Academic Grounding</h4>
                  <p><strong>Candidate:</strong> {profile.fullName}</p>
                  <p><strong>Education:</strong> {profile.educationLevel} in {profile.degree || profile.major}</p>
                  <p><strong>Graduation Year:</strong> {profile.graduationYear}</p>
                  <p><strong>Status:</strong> {profile.academicStatus}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900">Learning Commitment</h4>
                  <p><strong>Weekly Available Time:</strong> {profile.weeklyLearningTime}</p>
                  <p><strong>Preferred Style:</strong> {profile.learningStyle}</p>
                  <p><strong>Target Timeline:</strong> {profile.targetTimeline}</p>
                  <p><strong>Industry:</strong> {profile.targetIndustry} ({profile.workLocationPreference})</p>
                </div>

              </div>

              {/* Skills List */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-2">Registered Skills & Proficiencies:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(s => (
                    <span key={s.name} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800">
                      {s.name} • <strong className="text-blue-600">{s.proficiency}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests List */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-2">Domain Interests:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(i => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      {showComparisonModal && (
        <CareerComparisonModal
          analysisResult={analysisResult}
          onClose={() => setShowComparisonModal(false)}
          onSelectPrimaryCareer={(newMatch) => {
            const updatedPrimary = newMatch;
            const updatedAlts = [primaryCareer, ...analysisResult.alternativeCareers.filter(c => c.career.id !== newMatch.career.id)];
            onUpdateAnalysis({
              ...analysisResult,
              primaryCareer: updatedPrimary,
              alternativeCareers: updatedAlts
            });
            triggerConfetti();
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          analysisResult={analysisResult}
          progress={progress}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {activeVideoModal && (
        <VideoClassroomModal
          video={activeVideoModal}
          isOpen={Boolean(activeVideoModal)}
          onClose={() => setActiveVideoModal(null)}
          isCompleted={Boolean(progress.completedVideoLessonIds?.includes(activeVideoModal.id))}
          onToggleComplete={(videoId) => toggleVideoCompleted(videoId)}
        />
      )}

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        analysisResult={analysisResult}
        progress={progress}
        notifications={generatedNotifications}
        settings={reminderSettings}
        onUpdateSettings={updateReminderSettings}
        onMarkNotificationRead={markNotificationRead}
        onClearAllNotifications={clearAllNotifications}
        onSelectAction={handleNotificationAction}
        onTriggerTestNotification={triggerTestNotification}
      />

      {/* Floating Notification Toast Alert */}
      <FloatingNotificationToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onAction={handleNotificationAction}
      />

      {/* Learning Streak Center Modal */}
      <LearningStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        progress={progress}
        analysisResult={analysisResult}
        onQuickStart={(tab) => handleNotificationAction(tab)}
        onUseStreakFreeze={handleUseStreakFreeze}
        onManualCheckInToday={handleManualCheckInToday}
      />

      {/* Interactive Skill & Milestone Verification Modal */}
      <VerificationModal
        item={activeVerificationItem}
        isOpen={Boolean(activeVerificationItem)}
        onClose={() => setActiveVerificationItem(null)}
        onConfirmVerified={handleConfirmVerification}
      />

      {/* Official Competition Demo Showcase Modal */}
      <CompetitionDemoModal
        isOpen={showCompetitionModal}
        onClose={() => setShowCompetitionModal(false)}
      />

      {/* AI Mock Technical Interview Simulator Modal */}
      <MockInterviewModal
        isOpen={showMockInterviewModal}
        onClose={() => setShowMockInterviewModal(false)}
        careerTitle={primaryCareer.career.title}
        userFullName={profile.fullName}
        onCompleteInterview={(score) => {
          triggerConfetti();
        }}
      />

      {/* AI Resume & ATS Gap Diagnostic Modal */}
      <ResumeAtsModal
        isOpen={showResumeAtsModal}
        onClose={() => setShowResumeAtsModal(false)}
        careerTitle={primaryCareer.career.title}
        userFullName={profile.fullName}
      />

      {/* Real-time Job Market Radar & Salary Insights Modal */}
      <JobMarketRadarModal
        isOpen={showJobMarketRadarModal}
        onClose={() => setShowJobMarketRadarModal(false)}
        careerTitle={primaryCareer.career.title}
      />

      {/* Verifiable Career Mastery Certificate Modal */}
      <DigitalCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        careerTitle={primaryCareer.career.title}
        userFullName={profile.fullName}
        completedMilestonesCount={progress.completedMilestoneIds.length}
        totalMilestonesCount={totalMilestonesCount}
        readinessScore={dynamicReadinessScore}
      />

    </div>
  );
};
