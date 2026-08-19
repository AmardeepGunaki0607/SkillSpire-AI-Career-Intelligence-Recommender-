export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  id: string;
  name: string;
  category: 'programming' | 'data' | 'ai_ml' | 'cloud_devops' | 'web' | 'cybersecurity' | 'soft' | 'tools' | 'other';
  proficiency: SkillProficiency;
}

export type EducationLevel = 'High School' | 'Diploma' | "Bachelor's" | "Master's" | 'PhD' | 'Self-Taught / Bootcamp' | 'Other';
export type AcademicStatus = 'Currently Studying' | 'Recent Graduate (0-1 yr)' | 'Early Career (1-3 yrs)' | 'Career Switcher' | 'Working Professional';
export type ExperienceLevel = 'Entry-Level / Student' | 'Junior (1-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (5+ yrs)';
export type LearningTime = '2-5 hours' | '5-10 hours' | '10-15 hours' | '15+ hours';
export type LearningStyle = 'Video Courses' | 'Interactive Coding' | 'Documentation & Books' | 'Hands-on Projects' | 'Mixed / Blended';
export type TargetTimeline = '3 months (Aggressive)' | '6 months (Standard)' | '9-12 months (Comprehensive)' | 'Flexible / Self-Paced';

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  educationLevel: EducationLevel;
  degree: string;
  major: string;
  graduationYear: string;
  academicStatus: AcademicStatus;
  skills: UserSkill[];
  interests: string[];
  careerGoal: string; // e.g. "Data Scientist" or "undecided"
  isGoalUndecided: boolean;
  experienceLevel: ExperienceLevel;
  internshipExperience: string;
  projectsCompletedCount: number;
  certifications: string[];
  currentJobStatus: string;
  weeklyLearningTime: LearningTime;
  learningStyle: LearningStyle;
  targetTimeline: TargetTimeline;
  targetIndustry: string;
  workLocationPreference: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  createdAt: string;
}

export interface CareerRequirement {
  skillName: string;
  category: string;
  requiredLevel: SkillProficiency;
  importance: 'critical' | 'high' | 'medium' | 'nice-to-have';
  description: string;
}

export interface CareerDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  avgSalaryRange: string;
  marketDemand: 'Very High' | 'High' | 'Moderate' | 'Growing Rapidly';
  typicalDayDescription: string;
  requiredSkills: CareerRequirement[];
  preferredSkills: string[];
  relatedCareerIds: string[];
  difficultyLevel: 'Moderate' | 'Challenging' | 'Advanced';
  basePrepTimeMonths: number;
}

export type GapSeverity = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface SkillGapItem {
  skillName: string;
  category: string;
  currentLevel: SkillProficiency | 'Not Started';
  requiredLevel: SkillProficiency;
  gapSeverity: GapSeverity;
  priorityOrder: number; // 1 = highest
  importance: 'critical' | 'high' | 'medium' | 'nice-to-have';
  rationale: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  skillCovered: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  estimatedHours: number;
  format: 'Video' | 'Interactive' | 'Project' | 'Reading' | 'Specialization';
  isFree: boolean;
  costEstimate?: string;
  url: string;
  whyRecommended: string;
  rating?: number;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  targetSkills: string[];
  description: string;
  architectureHighlights: string[];
  expectedDeliverables: string[];
  suggestedTechStack: string[];
  portfolioValueScore: number; // 1-100
  whyRecommended: string;
  githubStarterIdea: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  targetSkills: string[];
  estimatedHours: number;
  deliverable: string;
  isCompleted?: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  focusArea: string;
  durationWeeks: number;
  objectives: string[];
  skillsTaught: string[];
  milestones: RoadmapMilestone[];
  suggestedResources: LearningResource[];
  recommendedProject?: ProjectRecommendation;
}

export interface CareerMatch {
  career: CareerDefinition;
  matchScore: number; // 0-100
  skillMatchPercentage: number;
  interestMatchPercentage: number;
  backgroundMatchPercentage: number;
  strengths: string[];
  missingSkillsCount: number;
  estimatedMonths: string;
  difficulty: 'Moderate' | 'Challenging' | 'Advanced';
  fitSummary: string;
  skillGaps: SkillGapItem[];
}

export interface VideoChapter {
  id: string;
  title: string;
  timestamp: string;
  seconds: number;
  summary: string;
}

export interface VideoQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RecordedVideoLesson {
  id: string;
  batchName: string;
  instructor: string;
  instructorTitle: string;
  title: string;
  skillCovered: string;
  category: string;
  durationMinutes: number;
  youtubeVideoId?: string;
  embedUrl?: string;
  isSkillSpireOriginal?: boolean;
  originalVideoType?: 'motion_graphics' | 'interactive_micro' | 'standard';
  lectureNumber: number;
  thumbnail: string;
  chapters: VideoChapter[];
  keyFormulasAndNotes: string[];
  quiz: VideoQuizQuestion[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  isFlagshipMasterclass: boolean;
  whyRecommended: string;
}

export interface AnalysisResult {
  id: string;
  userProfile: UserProfile;
  primaryCareer: CareerMatch;
  alternativeCareers: CareerMatch[];
  topStrengths: string[];
  criticalGaps: SkillGapItem[];
  allSkillGaps: SkillGapItem[];
  roadmap: RoadmapPhase[];
  allRecommendedProjects: ProjectRecommendation[];
  allRecommendedResources: LearningResource[];
  recommendedRecordedVideos?: RecordedVideoLesson[];
  aiExplanation: {
    fitSummary: string;
    whyThisCareerFits: string;
    strengthsAnalysis: string;
    gapsAnalysis: string;
    recommendationLogic: string;
    tailoredStrategyTips: string[];
  };
  estimatedTimelineSummary: {
    totalEstimatedWeeks: number;
    estimatedMonthsText: string;
    hoursPerWeekRecommended: number;
    timelineFeasibilityScore: 'High' | 'Realistic' | 'Aggressive';
    disclaimer: string;
  };
  generatedAt: string;
}

export type NotificationType = 'daily_reminder' | 'streak_alert' | 'milestone_nudge' | 'module_recommendation' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionText?: string;
  actionTab?: 'overview' | 'matches' | 'skill-gaps' | 'roadmap' | 'recorded-videos' | 'resources' | 'projects' | 'progress' | 'assistant' | 'profile';
  targetId?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ReminderSettings {
  enabled: boolean;
  browserNotifications: boolean;
  reminderTime: string; // e.g. "09:00", "14:00", "18:00", "21:00"
  dailyModuleTarget: number; // e.g. 1, 2, 3
  notifyStreakRisk: boolean;
  soundEnabled: boolean;
}

export interface UserProgressState {
  completedSkillNames: string[];
  completedResourceIds: string[];
  completedProjectIds: string[];
  completedMilestoneIds: string[];
  completedPhaseIds: string[];
  completedVideoLessonIds?: string[];
  activePhaseId: string;
  currentStreakDays: number;
  longestStreakDays?: number;
  lastActiveDate: string;
  streakFreezesAvailable?: number;
  streakFreezesUsed?: string[];
  notes: Record<string, string>;
  dailyCompletedModuleIds?: Record<string, string[]>;
  reminderSettings?: ReminderSettings;
  dismissedAlertDates?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface DemoPersona {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  profile: UserProfile;
}

export interface GeneratedVeoVideo {
  id: string;
  operationName: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  createdAt: string;
  status: 'pending' | 'polling' | 'ready' | 'failed';
  videoUrl?: string;
  error?: string;
  category?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professional' | 'recruiter' | 'admin';
  avatar?: string;
  targetRole?: string;
  plan: 'Free' | 'Pro Student' | 'Enterprise';
  joinedDate: string;
}

export interface MockInterviewQuestion {
  id: string;
  type: 'technical' | 'system_design' | 'behavioral' | 'problem_solving';
  question: string;
  category: string;
  hint?: string;
  keyConcepts: string[];
  sampleAnswer: string;
}

export interface MockInterviewEvaluation {
  overallScore: number;
  technicalAccuracyScore: number;
  clarityAndStructureScore: number;
  strengths: string[];
  improvements: string[];
  idealAnswerHighlights: string;
  summaryFeedback: string;
}

export interface ResumeAtsAnalysis {
  overallMatchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingScore: number;
  impactScore: number;
  bulletPointRewrites: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  executiveSummary: string;
  criticalRecommendations: string[];
}

export interface JobMarketInsight {
  careerTitle: string;
  entrySalaryInr: string;
  avgSalaryInr: string;
  seniorSalaryInr: string;
  avgSalaryUsd: string;
  yoyGrowthRate: string;
  activeOpeningsEstimate: string;
  remoteOpportunityPercent: number;
  topHiringCompanies: Array<{ name: string; location: string; logoUrl?: string }>;
  hottestSkillsThisMonth: string[];
  interviewDifficulty: 'Moderate' | 'High' | 'Very High';
}


