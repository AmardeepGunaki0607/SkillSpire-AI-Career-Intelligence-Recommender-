import React, { useEffect, useState } from 'react';
import { Bell, Flame, CheckCircle2, X, ChevronRight, Sparkles } from 'lucide-react';
import { AppNotification } from '../types';

interface FloatingNotificationToastProps {
  toast: AppNotification | null;
  onClose: () => void;
  onAction?: (tab: 'overview' | 'matches' | 'skill-gaps' | 'roadmap' | 'recorded-videos' | 'resources' | 'projects' | 'progress' | 'assistant' | 'profile', targetId?: string) => void;
}

export const FloatingNotificationToast: React.FC<FloatingNotificationToastProps> = ({
  toast,
  onClose,
  onAction
}) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isStreak = toast.type === 'streak_alert';
  const isGoal = toast.type === 'daily_reminder';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3.5 backdrop-blur-md ${
        isStreak
          ? 'bg-slate-900/95 border-amber-500/40 text-white'
          : 'bg-slate-900/95 border-indigo-500/40 text-white'
      }`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isStreak
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
        }`}>
          {isStreak ? <Flame className="w-5 h-5 fill-amber-400" /> : <Bell className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">{toast.title}</h4>
            <span className="text-[10px] text-slate-400">Just now</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>

          {toast.actionText && toast.actionTab && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onAction) onAction(toast.actionTab!, toast.targetId);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>{toast.actionText}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
