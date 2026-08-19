import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#2563eb', '#38bdf8', '#10b981', '#6366f1']
  });
}

export function cleanBrandText(str: string | undefined | null): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/Physics\s*Wallah\s*Tech:?/gi, 'SkillSpire Placement Masterclass:')
    .replace(/Physics\s*Wallah/gi, 'SkillSpire AI')
    .replace(/PW\s*Skills\s*Master\s*Faculty\s*(&|and)?\s*Team/gi, 'Senior Engineering Faculty & Mentors')
    .replace(/PW\s*Skills/gi, 'SkillSpire AI')
    .replace(/By\s+PW\s+Skills/gi, 'By SkillSpire Faculty')
    .replace(/\bPW\b/gi, 'SkillSpire')
    .trim();
}

export function formatTimeAgo(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
}
