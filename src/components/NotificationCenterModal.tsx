import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Volume2, 
  VolumeX, 
  Globe, 
  Sparkles, 
  ChevronRight, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  Video, 
  Send,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { AppNotification, ReminderSettings, UserProgressState, AnalysisResult } from '../types';
import { 
  isBrowserNotificationSupported, 
  getNotificationPermissionStatus, 
  requestBrowserNotificationPermission, 
  sendNativeNotification,
  playNotificationSound,
  getCompletedTodayCount,
  getTodayDateString
} from '../lib/notifications';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult;
  progress: UserProgressState;
  notifications: AppNotification[];
  settings: ReminderSettings;
  onUpdateSettings: (newSettings: ReminderSettings) => void;
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onSelectAction: (tab: 'overview' | 'matches' | 'skill-gaps' | 'roadmap' | 'recorded-videos' | 'resources' | 'projects' | 'progress' | 'assistant' | 'profile', targetId?: string) => void;
  onTriggerTestNotification: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  progress,
  notifications,
  settings,
  onUpdateSettings,
  onMarkNotificationRead,
  onClearAllNotifications,
  onSelectAction,
  onTriggerTestNotification
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>('alerts');
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const permissionStatus = getNotificationPermissionStatus();
  const completedToday = getCompletedTodayCount(progress);
  const target = settings.dailyModuleTarget || 2;
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    if (granted) {
      onUpdateSettings({ ...settings, browserNotifications: true });
      if (settings.soundEnabled) playNotificationSound();
      sendNativeNotification(
        '🔔 Learning Reminders Activated!',
        'You will now receive daily study reminders to help you master your curriculum on schedule.'
      );
    }
  };

  const handleTestNotification = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
    onTriggerTestNotification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Daily Learning Reminders</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Personalized study alerts for {analysisResult.primaryCareer.career.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Smart Alerts & Feed</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Reminder Preferences</span>
            </button>
          </div>

          {activeTab === 'alerts' && notifications.length > 0 && (
            <button
              onClick={onClearAllNotifications}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: ALERTS & FEED */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              
              {/* Daily Progress Goal Summary Pill */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-900">Today's Study Progress</span>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                      {completedToday} of {target} Modules
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {completedToday >= target
                      ? 'Daily benchmark completed! Your streak is protected.'
                      : `Complete ${target - completedToday} more module${target - completedToday > 1 ? 's' : ''} to reach today's milestone.`}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{progress.currentStreakDays} Days</span>
                  </div>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="font-bold text-sm text-slate-800">All caught up!</p>
                    <p className="text-xs text-slate-500">You don't have any pending alerts right now.</p>
                  </div>
                ) : (
                  notifications.map(notif => {
                    const isGoal = notif.type === 'daily_reminder';
                    const isStreak = notif.type === 'streak_alert';
                    const isMilestone = notif.type === 'milestone_nudge';

                    return (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          notif.read 
                            ? 'bg-white border-slate-200 opacity-80' 
                            : isStreak 
                            ? 'bg-amber-50/40 border-amber-200/90 shadow-2xs' 
                            : 'bg-white border-indigo-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${
                            isStreak
                              ? 'bg-amber-100 text-amber-700'
                              : isGoal
                              ? 'bg-indigo-100 text-indigo-700'
                              : isMilestone
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isStreak ? <Flame className="w-4 h-4" /> : isGoal ? <Clock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              )}
                              <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {notif.actionTab && notif.actionText && (
                            <button
                              onClick={() => {
                                onMarkNotificationRead(notif.id);
                                onClose();
                                onSelectAction(notif.actionTab!, notif.targetId);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <span>{notif.actionText}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!notif.read && (
                            <button
                              onClick={() => onMarkNotificationRead(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* TAB 2: REMINDER SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              
              {/* 1. Browser Native Push Notifications */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-sm font-bold text-slate-900">Browser Desktop Notifications</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Receive reminders directly on your operating system even when looking at other tabs.
                    </p>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        if (!settings.browserNotifications) {
                          handleRequestPermission();
                        } else {
                          onUpdateSettings({ ...settings, browserNotifications: false });
                        }
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        settings.browserNotifications ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        settings.browserNotifications ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Permission Status Feedback */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">System Permission:</span>
                  <span className={`font-bold ${
                    permissionStatus === 'granted' 
                      ? 'text-emerald-600' 
                      : permissionStatus === 'denied' 
                      ? 'text-rose-600' 
                      : 'text-amber-600'
                  }`}>
                    {permissionStatus === 'granted' 
                      ? '✓ Permission Granted' 
                      : permissionStatus === 'denied' 
                      ? '⚠️ Blocked in Browser Settings' 
                      : 'ℹ️ Permission Required'}
                  </span>
                </div>

                {permissionStatus !== 'granted' && isBrowserNotificationSupported() && (
                  <button
                    onClick={handleRequestPermission}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Grant Browser Notification Permission
                  </button>
                )}
              </div>

              {/* 2. Daily Module Target Goal */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Daily Study Target</h4>
                  <p className="text-xs text-slate-500">How many modules or masterclasses do you want to finish each day?</p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { target: 1, label: '1 Module', desc: '~30 mins / day', tag: 'Steady' },
                    { target: 2, label: '2 Modules', desc: '~1 hour / day', tag: 'Recommended' },
                    { target: 3, label: '3 Modules', desc: '~1.5+ hrs / day', tag: 'Accelerated' }
                  ].map(plan => (
                    <button
                      key={plan.target}
                      onClick={() => onUpdateSettings({ ...settings, dailyModuleTarget: plan.target })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.dailyModuleTarget === plan.target
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{plan.label}</span>
                        {plan.tag === 'Recommended' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                            Best
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{plan.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Study Reminder Time */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Preferred Reminder Schedule</h4>
                  <p className="text-xs text-slate-500">Select when you'd like to receive your daily study nudges.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { time: '09:00', label: 'Morning', desc: '09:00 AM' },
                    { time: '14:00', label: 'Afternoon', desc: '02:00 PM' },
                    { time: '18:00', label: 'Evening', desc: '06:00 PM' },
                    { time: '21:00', label: 'Night', desc: '09:00 PM' }
                  ].map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => onUpdateSettings({ ...settings, reminderTime: slot.time })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        settings.reminderTime === slot.time
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">{slot.label}</span>
                      <span className="text-[10px] text-slate-500">{slot.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Audio Sound Chimes & Streak Risks */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Audio Chime</h4>
                      <p className="text-[11px] text-slate-500">Play soft chime sound when alerts arrive</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Streak Expiration Warning</h4>
                      <p className="text-[11px] text-slate-500">Alert me when my active streak is about to reset</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyStreakRisk}
                    onChange={(e) => onUpdateSettings({ ...settings, notifyStreakRisk: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>

              {/* 5. Test Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleTestNotification}
                  disabled={testSent}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testSent ? '✓ Test Alert Sent!' : 'Trigger Test Reminder Now'}</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  Saves automatically to browser storage
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next Scheduled Alert at {settings.reminderTime}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
