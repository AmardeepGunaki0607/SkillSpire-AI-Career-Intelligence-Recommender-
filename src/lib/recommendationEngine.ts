import {
  UserProfile,
  CareerDefinition,
  CareerMatch,
  SkillGapItem,
  GapSeverity,
  RoadmapPhase,
  AnalysisResult,
  SkillProficiency,
  ProjectRecommendation,
  LearningResource,
  RecordedVideoLesson
} from '../types';
import { CAREER_KNOWLEDGE_BASE, LEARNING_RESOURCES_LIBRARY, PROJECT_CATALOG } from '../data/knowledgeBase';
import { RECORDED_VIDEO_LESSONS_DATABASE } from '../data/recordedVideos';

const PROFICIENCY_SCORES: Record<SkillProficiency | 'Not Started', number> = {
  'Not Started': 0,
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

function normalizeSkillName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Natural Language Goal to UserProfile Parser
 * Converts prompts like "I'm in 2nd year BTech, know Java and SQL, want to be a Full Stack Developer studying 10 hrs/week"
 */
export function parseNaturalLanguageGoal(input: string): UserProfile {
  const text = input.toLowerCase();
  
  // Detect education / academic status
  let academicStatus: UserProfile['academicStatus'] = 'Currently Studying';
  let degree = 'B.Tech in Computer Science';
  let graduationYear = '2026';
  
  if (text.includes('1st year') || text.includes('first year')) {
    academicStatus = 'Currently Studying';
    graduationYear = '2028';
  } else if (text.includes('2nd year') || text.includes('second year') || text.includes('sophomore')) {
    academicStatus = 'Currently Studying';
    graduationYear = '2027';
  } else if (text.includes('3rd year') || text.includes('third year') || text.includes('junior')) {
    academicStatus = 'Currently Studying';
    graduationYear = '2026';
  } else if (text.includes('final year') || text.includes('4th year') || text.includes('senior')) {
    academicStatus = 'Currently Studying';
    graduationYear = '2025';
  } else if (text.includes('fresh grad') || text.includes('fresher') || text.includes('recent graduate') || text.includes('graduated')) {
    academicStatus = 'Recent Graduate (0-1 yr)';
  } else if (text.includes('working') || text.includes('professional') || text.includes('employed') || text.includes('developer')) {
    academicStatus = 'Working Professional';
  } else if (text.includes('career changer') || text.includes('switch') || text.includes('non-tech')) {
    academicStatus = 'Career Switcher';
  }

  // Detect skills
  const knownSkillsCatalog: { name: string; category: UserProfile['skills'][0]['category'] }[] = [
    { name: 'Python', category: 'programming' },
    { name: 'Java', category: 'programming' },
    { name: 'C++', category: 'programming' },
    { name: 'JavaScript', category: 'programming' },
    { name: 'TypeScript', category: 'programming' },
    { name: 'SQL', category: 'data' },
    { name: 'React', category: 'web' },
    { name: 'Node.js', category: 'web' },
    { name: 'HTML/CSS', category: 'web' },
    { name: 'Machine Learning', category: 'ai_ml' },
    { name: 'Data Analysis', category: 'data' },
    { name: 'Docker', category: 'cloud_devops' },
    { name: 'Git', category: 'tools' }
  ];

  const extractedSkills: UserProfile['skills'] = [];
  knownSkillsCatalog.forEach(skill => {
    if (text.includes(skill.name.toLowerCase())) {
      extractedSkills.push({
        id: `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name: skill.name,
        proficiency: text.includes(`advanced in ${skill.name.toLowerCase()}`) || text.includes(`strong in ${skill.name.toLowerCase()}`) ? 'Advanced' :
                     text.includes(`basic ${skill.name.toLowerCase()}`) || text.includes(`know basic ${skill.name.toLowerCase()}`) ? 'Beginner' : 'Intermediate',
        category: skill.category
      });
    }
  });

  if (extractedSkills.length === 0) {
    extractedSkills.push(
      { id: 'skill-python', name: 'Python', proficiency: 'Beginner', category: 'programming' },
      { id: 'skill-problem-solving', name: 'Problem Solving', proficiency: 'Intermediate', category: 'soft' }
    );
  }

  // Detect career goal
  let careerGoal = 'Full Stack Developer';
  let isGoalUndecided = false;
  if (text.includes('data science') || text.includes('data scientist')) {
    careerGoal = 'Data Scientist';
  } else if (text.includes('machine learning') || text.includes('ml engineer')) {
    careerGoal = 'Machine Learning Engineer';
  } else if (text.includes('ai engineer') || text.includes('generative ai') || text.includes('llm')) {
    careerGoal = 'AI Engineer';
  } else if (text.includes('full stack') || text.includes('web dev') || text.includes('mern') || text.includes('sigma')) {
    careerGoal = 'Full Stack Developer';
  } else if (text.includes('frontend') || text.includes('ui developer')) {
    careerGoal = 'Frontend Developer';
  } else if (text.includes('backend') || text.includes('server')) {
    careerGoal = 'Backend Developer';
  } else if (text.includes('software engineer') || text.includes('sde') || text.includes('dsa') || text.includes('placement')) {
    careerGoal = 'Software Engineer';
  } else if (text.includes('data analyst') || text.includes('bi')) {
    careerGoal = 'Data Analyst';
  } else if (text.includes('devops') || text.includes('cloud')) {
    careerGoal = 'DevOps Engineer';
  } else if (text.includes('cybersecurity') || text.includes('security')) {
    careerGoal = 'Cybersecurity Analyst';
  } else if (text.includes('not sure') || text.includes('undecided') || text.includes('explore')) {
    isGoalUndecided = true;
    careerGoal = 'Undecided / Explore Options';
  }

  // Detect weekly learning time
  let weeklyLearningTime: UserProfile['weeklyLearningTime'] = '10-15 hours';
  if (text.includes('15+') || text.includes('15 hours') || text.includes('20 hours') || text.includes('full time') || text.includes('bootcamp')) {
    weeklyLearningTime = '15+ hours';
  } else if (text.includes('5-10') || text.includes('5 hours') || text.includes('6 hours') || text.includes('8 hours') || text.includes('part time')) {
    weeklyLearningTime = '5-10 hours';
  } else if (text.includes('< 5') || text.includes('2 hours') || text.includes('3 hours') || text.includes('busy') || text.includes('2-5')) {
    weeklyLearningTime = '2-5 hours';
  }

  return {
    id: `user-${Date.now()}`,
    fullName: 'Learner',
    email: 'learner@skillspire.ai',
    educationLevel: "Bachelor's",
    degree,
    major: 'Computer Science & Engineering',
    graduationYear,
    academicStatus,
    skills: extractedSkills,
    interests: ['Building Scalable Systems', 'DSA & Placement Prep', 'Full Stack Development'],
    careerGoal,
    isGoalUndecided,
    experienceLevel: academicStatus === 'Working Professional' ? 'Junior (1-2 yrs)' : 'Entry-Level / Student',
    internshipExperience: 'None or 1 summer project',
    projectsCompletedCount: 2,
    certifications: ['Full Stack & Algorithms Masterclass Candidate'],
    currentJobStatus: academicStatus === 'Currently Studying' ? 'Student' : 'Seeking Opportunities',
    weeklyLearningTime,
    learningStyle: 'Video Courses',
    targetTimeline: '6 months (Standard)',
    targetIndustry: 'Product / SaaS & Tech Companies',
    workLocationPreference: 'Any',
    createdAt: new Date().toISOString()
  };
}

export function calculateSkillGap(
  currentLevel: SkillProficiency | 'Not Started',
  requiredLevel: SkillProficiency,
  importance: 'critical' | 'high' | 'medium' | 'nice-to-have'
): { gapSeverity: GapSeverity; pointsGap: number } {
  const currentScore = PROFICIENCY_SCORES[currentLevel];
  const requiredScore = PROFICIENCY_SCORES[requiredLevel];
  const diff = requiredScore - currentScore;

  if (diff <= 0) {
    return { gapSeverity: 'None', pointsGap: 0 };
  }

  if (diff === 1) {
    return { gapSeverity: importance === 'critical' ? 'High' : 'Medium', pointsGap: 1 };
  }

  if (diff >= 2) {
    return { gapSeverity: importance === 'critical' ? 'Critical' : 'High', pointsGap: diff };
  }

  return { gapSeverity: 'Low', pointsGap: 1 };
}

export function matchCareerProfile(userProfile: UserProfile, career: CareerDefinition): CareerMatch {
  const userSkillMap = new Map<string, SkillProficiency>();
  userProfile.skills.forEach(s => {
    userSkillMap.set(normalizeSkillName(s.name), s.proficiency);
  });

  const strengths: string[] = [];
  const skillGaps: SkillGapItem[] = [];
  let totalRequiredWeight = 0;
  let earnedSkillWeight = 0;

  career.requiredSkills.forEach(req => {
    const weight = req.importance === 'critical' ? 4 : req.importance === 'high' ? 3 : req.importance === 'medium' ? 2 : 1;
    totalRequiredWeight += weight;

    // Check direct match or substring match
    const normalizedReq = normalizeSkillName(req.skillName);
    let matchedLevel: SkillProficiency | 'Not Started' = 'Not Started';

    for (const [userSkillKey, userProf] of userSkillMap.entries()) {
      if (userSkillKey === normalizedReq || userSkillKey.includes(normalizedReq) || normalizedReq.includes(userSkillKey)) {
        matchedLevel = userProf;
        break;
      }
    }

    const { gapSeverity, pointsGap } = calculateSkillGap(matchedLevel, req.requiredLevel, req.importance);

    if (gapSeverity === 'None') {
      strengths.push(req.skillName);
      earnedSkillWeight += weight;
    } else {
      // Partial credit
      const userVal = PROFICIENCY_SCORES[matchedLevel];
      const reqVal = PROFICIENCY_SCORES[req.requiredLevel];
      const ratio = Math.max(0, userVal / reqVal);
      earnedSkillWeight += weight * ratio;

      skillGaps.push({
        skillName: req.skillName,
        category: req.category,
        currentLevel: matchedLevel,
        requiredLevel: req.requiredLevel,
        gapSeverity,
        priorityOrder: req.importance === 'critical' ? 1 : req.importance === 'high' ? 2 : 3,
        importance: req.importance,
        rationale: `Required at ${req.requiredLevel} level for daily ${career.title} workflows (${req.description}).`
      });
    }
  });

  const skillMatchPercentage = Math.round((earnedSkillWeight / Math.max(1, totalRequiredWeight)) * 100);

  // Interest match score
  let interestMatchPercentage = 60;
  if (userProfile.interests && userProfile.interests.length > 0) {
    const matchedInterests = userProfile.interests.filter(interest => {
      if (!interest || typeof interest !== 'string') return false;
      const norm = interest.toLowerCase();
      const cTitle = (career.title || '').toLowerCase();
      const cCat = (career.category || '').toLowerCase();
      return cTitle.includes(norm) ||
             cCat.includes(norm) ||
             norm.includes(cCat.split('&')[0]?.trim() || '');
    });
    interestMatchPercentage = Math.min(100, Math.round(50 + (matchedInterests.length / userProfile.interests.length) * 50));
  }

  // Career goal proximity
  let goalBonus = 0;
  if (userProfile.careerGoal && typeof userProfile.careerGoal === 'string' && userProfile.careerGoal.toLowerCase() !== 'undecided') {
    const cTitle = (career.title || '').toLowerCase();
    const gNorm = userProfile.careerGoal.toLowerCase();
    if (normalizeSkillName(userProfile.careerGoal) === normalizeSkillName(career.title || '')) {
      goalBonus = 12;
    } else if (cTitle.includes(gNorm)) {
      goalBonus = 8;
    }
  }

  // Composite match score
  let finalScore = Math.round((skillMatchPercentage * 0.65) + (interestMatchPercentage * 0.25) + goalBonus);
  finalScore = Math.min(98, Math.max(35, finalScore));

  // Sort gaps by priority
  skillGaps.sort((a, b) => {
    const severityWeight: Record<GapSeverity, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 };
    return severityWeight[b.gapSeverity] - severityWeight[a.gapSeverity] || a.priorityOrder - b.priorityOrder;
  });

  // Re-index priority numbers 1..N
  skillGaps.forEach((gap, idx) => {
    gap.priorityOrder = idx + 1;
  });

  // Estimate prep time based on hours and gap volume
  const hoursPerWeekNum = userProfile.weeklyLearningTime === '15+ hours' ? 18 :
                          userProfile.weeklyLearningTime === '10-15 hours' ? 12 :
                          userProfile.weeklyLearningTime === '5-10 hours' ? 8 : 4;
  
  const totalGapPoints = skillGaps.reduce((acc, g) => acc + (g.gapSeverity === 'Critical' ? 40 : g.gapSeverity === 'High' ? 25 : 15), 0);
  const estimatedWeeks = Math.max(8, Math.round((totalGapPoints / hoursPerWeekNum) * 1.5));
  const minMonths = Math.max(2, Math.floor(estimatedWeeks / 4.3));
  const maxMonths = minMonths + 2;

  return {
    career,
    matchScore: finalScore,
    skillMatchPercentage,
    interestMatchPercentage,
    backgroundMatchPercentage: 85,
    strengths,
    missingSkillsCount: skillGaps.length,
    estimatedMonths: `${minMonths}–${maxMonths} months`,
    difficulty: career.difficultyLevel,
    fitSummary: `You have ${strengths.length} existing foundational strength${strengths.length === 1 ? '' : 's'} matching ${career.title}, with ${skillGaps.length} target skill area${skillGaps.length === 1 ? '' : 's'} to master.`,
    skillGaps
  };
}

export function buildPersonalizedRoadmap(
  userProfile: UserProfile,
  primaryCareer: CareerMatch,
  recommendedProjects: ProjectRecommendation[],
  recommendedResources: LearningResource[]
): RoadmapPhase[] {
  const gaps = primaryCareer.skillGaps;
  const criticalGaps = gaps.filter(g => g.gapSeverity === 'Critical' || g.gapSeverity === 'High').map(g => g.skillName);
  const mediumGaps = gaps.filter(g => g.gapSeverity === 'Medium' || g.gapSeverity === 'Low').map(g => g.skillName);

  // Speed multiplier based on weekly hours
  const isHighVelocity = userProfile.weeklyLearningTime === '15+ hours' || userProfile.weeklyLearningTime === '10-15 hours';
  const phase1Weeks = isHighVelocity ? 3 : 4;
  const phase2Weeks = isHighVelocity ? 4 : 6;
  const phase3Weeks = isHighVelocity ? 4 : 5;
  const phase4Weeks = isHighVelocity ? 3 : 4;
  const phase5Weeks = isHighVelocity ? 3 : 4;

  const phase1Skills = criticalGaps.slice(0, 2).length > 0 ? criticalGaps.slice(0, 2) : ['Core Foundations', 'Environment Setup'];
  const phase2Skills = criticalGaps.slice(2, 4).length > 0 ? criticalGaps.slice(2, 4) : ['Applied Core Concepts', 'Data & Architecture'];
  const phase3Skills = criticalGaps.slice(4).concat(mediumGaps.slice(0, 2));
  const phase4Skills = mediumGaps.slice(2).concat(['Deployment & Production Tooling', 'CI/CD']);
  const phase5Skills = ['Portfolio Showcase', 'System Design Interview Prep', 'Resume & Technical Review'];

  const phases: RoadmapPhase[] = [
    {
      id: 'phase-1-foundations',
      phaseNumber: 1,
      title: 'Foundations & Fast-Track Gap Closure',
      focusArea: 'Core Languages & Essential Theory',
      durationWeeks: phase1Weeks,
      objectives: [
        `Master fundamental syntax, patterns, and paradigms in ${phase1Skills.join(', ')}`,
        'Set up clean local development environment with linting, testing, and Git version control',
        'Solve 15 targeted coding and algorithmic problem sets'
      ],
      skillsTaught: phase1Skills,
      milestones: [
        {
          id: 'm1-env',
          title: 'Development Environment & Core Syntax Mastery',
          description: `Complete foundational exercises in ${phase1Skills[0] || 'Core Language'} and pass self-assessment drills.`,
          targetSkills: phase1Skills,
          estimatedHours: 20,
          deliverable: 'Configured GitHub repo with annotated solution notebooks/scripts'
        },
        {
          id: 'm1-mini-project',
          title: 'Foundational Baseline Mini-Project',
          description: 'Construct a standalone script or module demonstrating error handling, modular functions, and data validation.',
          targetSkills: phase1Skills,
          estimatedHours: 15,
          deliverable: 'Tested modular utility with documentation'
        }
      ],
      suggestedResources: recommendedResources.slice(0, 2),
      recommendedProject: undefined
    },
    {
      id: 'phase-2-core-mastery',
      phaseNumber: 2,
      title: `Applied ${primaryCareer.career.category} Core Architecture`,
      focusArea: 'Algorithms, Data Structures & Pipelines',
      durationWeeks: phase2Weeks,
      objectives: [
        `Bridge theory to real-world domain engineering in ${phase2Skills.join(', ')}`,
        'Implement robust data pipelines and model/component evaluations',
        'Build structured unit tests and validate edge-case resiliency'
      ],
      skillsTaught: phase2Skills.length > 0 ? phase2Skills : ['System Modeling', 'Pipeline Architecture'],
      milestones: [
        {
          id: 'm2-architecture',
          title: 'Core Domain Pipeline Implementation',
          description: 'Design and validate a multi-step pipeline handling ingestion, feature extraction, or relational API queries.',
          targetSkills: phase2Skills,
          estimatedHours: 25,
          deliverable: 'Clean documented pipeline with automated tests'
        }
      ],
      suggestedResources: recommendedResources.slice(2, 4),
      recommendedProject: recommendedProjects[0]
    },
    {
      id: 'phase-3-advanced-specialization',
      phaseNumber: 3,
      title: 'Advanced Specialization & Complex Problem Solving',
      focusArea: 'Scale, Deep Techniques & Frameworks',
      durationWeeks: phase3Weeks,
      objectives: [
        'Tackle advanced domain patterns: asynchronous concurrency, optimization, or neural architectures',
        'Benchmark computational complexity, latency bottlenecks, and memory overhead',
        'Implement explainable telemetry and audit logs'
      ],
      skillsTaught: phase3Skills.length > 0 ? phase3Skills : ['Advanced Modeling', 'Optimization'],
      milestones: [
        {
          id: 'm3-advanced-capstone',
          title: 'Advanced Capstone Feature Release',
          description: 'Deploy advanced logic (e.g. vector search, caching layer, or deep neural model) with benchmark metrics.',
          targetSkills: phase3Skills,
          estimatedHours: 30,
          deliverable: 'Live interactive demo with benchmark graphs'
        }
      ],
      suggestedResources: recommendedResources.slice(4, 6),
      recommendedProject: recommendedProjects[1] || recommendedProjects[0]
    },
    {
      id: 'phase-4-production-deployment',
      phaseNumber: 4,
      title: 'Production Deployment & Cloud Infrastructure',
      focusArea: 'Docker, Cloud APIs, CI/CD & Monitoring',
      durationWeeks: phase4Weeks,
      objectives: [
        'Containerize applications using Docker multi-stage builds',
        'Deploy service to scalable cloud infrastructure (AWS/GCP/Vercel)',
        'Configure automated GitHub Actions CI/CD with security scanning'
      ],
      skillsTaught: phase4Skills,
      milestones: [
        {
          id: 'm4-cloud-deploy',
          title: 'Cloud CI/CD & Production Host Setup',
          description: 'Automate build, test, and containerized deployment with live healthcheck endpoints.',
          targetSkills: phase4Skills,
          estimatedHours: 20,
          deliverable: 'Public HTTPS URL with automated GitHub Action pipeline'
        }
      ],
      suggestedResources: recommendedResources.slice(6, 8),
      recommendedProject: recommendedProjects[2] || recommendedProjects[0]
    },
    {
      id: 'phase-5-portfolio-career-ready',
      phaseNumber: 5,
      title: 'Portfolio Polish, Resume & Interview Readiness',
      focusArea: 'Career Launch & Hiring Manager Review',
      durationWeeks: phase5Weeks,
      objectives: [
        'Craft a high-impact technical portfolio highlighting measurable business ROI and architecture decisions',
        'Refine GitHub READMEs with architecture diagrams, setup scripts, and live interactive demo links',
        'Master technical interview drills, system design walkthroughs, and behavioral STAR stories'
      ],
      skillsTaught: phase5Skills,
      milestones: [
        {
          id: 'm5-portfolio-live',
          title: 'Live Technical Portfolio & Case Studies Published',
          description: 'Complete 3 polished repositories with live links, comprehensive documentation, and performance metrics.',
          targetSkills: ['Technical Writing', 'Git Showcase', 'System Design'],
          estimatedHours: 25,
          deliverable: 'Personal portfolio site & polished GitHub profile'
        },
        {
          id: 'm5-mock-interviews',
          title: 'Complete 5 Mock Technical Interviews',
          description: 'Practice domain coding questions and system design architectures under realistic time constraints.',
          targetSkills: ['Communication', 'Live Problem Solving'],
          estimatedHours: 15,
          deliverable: 'Self-assessment score sheet with feedback notes'
        }
      ],
      suggestedResources: [],
      recommendedProject: undefined
    }
  ];

  return phases;
}

export function generateCompleteAnalysis(userProfile: UserProfile): AnalysisResult {
  // Rank all careers
  const matches = CAREER_KNOWLEDGE_BASE.map(career => matchCareerProfile(userProfile, career));
  matches.sort((a, b) => b.matchScore - a.matchScore);

  let primaryMatch = matches[0];

  // If user had a specific goal, prefer that as primary if reasonable
  if (!userProfile.isGoalUndecided && userProfile.careerGoal) {
    const goalMatch = matches.find(m => normalizeSkillName(m.career.title) === normalizeSkillName(userProfile.careerGoal));
    if (goalMatch) {
      primaryMatch = goalMatch;
    }
  }

  const alternativeCareers = matches.filter(m => m.career.id !== primaryMatch.career.id).slice(0, 3);

  // Recommended projects matching primary career target skills
  const primaryRequiredSkillNames = (primaryMatch.career.requiredSkills || []).map(r => (r.skillName || '').toLowerCase()).filter(Boolean);
  const scoredProjects = PROJECT_CATALOG.map(proj => {
    const projTargetSkills = proj.targetSkills || [];
    const overlap = projTargetSkills.filter(ts => ts && primaryRequiredSkillNames.some(req => req && (req.includes(ts.toLowerCase()) || ts.toLowerCase().includes(req)))).length;
    return { project: proj, score: overlap * 10 + (proj.portfolioValueScore || 80) };
  });
  scoredProjects.sort((a, b) => b.score - a.score);
  const recommendedProjects = scoredProjects.map(sp => sp.project).slice(0, 4);

  // Recommended learning resources
  const recommendedResources = LEARNING_RESOURCES_LIBRARY.filter(res => {
    const skill = (res.skillCovered || '').toLowerCase();
    return skill && primaryRequiredSkillNames.some(req => req && (req.includes(skill) || skill.includes(req)));
  });
  // Add some general high-yield resources if needed
  if (recommendedResources.length < 6) {
    LEARNING_RESOURCES_LIBRARY.forEach(r => {
      if (!recommendedResources.some(existing => existing.id === r.id)) {
        recommendedResources.push(r);
      }
    });
  }

  // Build 5-phase customized roadmap
  const roadmap = buildPersonalizedRoadmap(userProfile, primaryMatch, recommendedProjects, recommendedResources);

  const topStrengths = (primaryMatch.strengths || []).slice(0, 4);
  const criticalGaps = (primaryMatch.skillGaps || []).filter(g => g.gapSeverity === 'Critical' || g.gapSeverity === 'High');

  // Timeline summary
  const totalWeeks = roadmap.reduce((acc, p) => acc + (p.durationWeeks || 2), 0);
  const hoursNum = userProfile.weeklyLearningTime === '15+ hours' ? 18 :
                   userProfile.weeklyLearningTime === '10-15 hours' ? 12 :
                   userProfile.weeklyLearningTime === '5-10 hours' ? 8 : 4;

  const minM = Math.max(2, Math.floor(totalWeeks / 4.3));
  const maxM = minM + 2;

  const targetTimeline = userProfile.targetTimeline || '6 months (Standard)';
  const timelineFeasibilityScore: 'High' | 'Realistic' | 'Aggressive' =
    targetTimeline.includes('3 months') && totalWeeks > 16 ? 'Aggressive' :
    targetTimeline.includes('6 months') ? 'Realistic' : 'High';

  // Curated recorded video lessons for the target career and critical gaps
  const recommendedRecordedVideos = RECORDED_VIDEO_LESSONS_DATABASE.filter(video => {
    const normSkill = (video.skillCovered || '').toLowerCase();
    return (normSkill && primaryRequiredSkillNames.some(req => req && (req.includes(normSkill) || normSkill.includes(req)))) ||
           video.category === primaryMatch.career.requiredSkills?.[0]?.category ||
           video.isFlagshipMasterclass;
  });

  const academicStatusText = (userProfile.academicStatus || 'learner').toLowerCase();
  const majorText = userProfile.major || userProfile.degree || 'technology';
  const skillNamesText = (userProfile.skills || []).map(s => s?.name || '').filter(Boolean).slice(0, 3).join(', ') || 'core fundamentals';
  const interestsList = (userProfile.interests || ['Software Engineering']).filter(Boolean);
  const interestsText = interestsList.slice(0, 2).join(' and ') || 'technology';

  return {
    id: `analysis-${Date.now()}`,
    userProfile,
    primaryCareer: primaryMatch,
    alternativeCareers,
    topStrengths,
    criticalGaps,
    allSkillGaps: primaryMatch.skillGaps,
    roadmap,
    allRecommendedProjects: recommendedProjects,
    allRecommendedResources: recommendedResources,
    recommendedRecordedVideos: recommendedRecordedVideos.length > 0 ? recommendedRecordedVideos : RECORDED_VIDEO_LESSONS_DATABASE,
    aiExplanation: {
      fitSummary: `Based on your ${academicStatusText} background in ${majorText} and proficiency in ${skillNamesText}, ${primaryMatch.career.title} provides your highest natural career leverage (${primaryMatch.matchScore}% Match).`,
      whyThisCareerFits: `You already possess demonstrated strengths in ${topStrengths.length > 0 ? topStrengths.join(', ') : 'foundational problem-solving'}, giving you a substantial head start over complete beginners. Your interest in ${interestsText} directly maps to industry demands for this role.`,
      strengthsAnalysis: `Your strongest assets are ${topStrengths.join(', ') || 'analytical problem solving'}, which form the core prerequisite foundation.`,
      gapsAnalysis: criticalGaps.length > 0
        ? `Your critical preparation areas are ${criticalGaps.slice(0, 3).map(g => g.skillName || '').filter(Boolean).join(', ')}. Closing these priority gaps will transition your profile from theoretical knowledge to production-grade readiness.`
        : 'Your foundational skills are well-rounded; focus on production deployment and portfolio depth.',
      recommendationLogic: `Calculated via hybrid semantic-skill vector similarity, prioritizing roles that minimize preparation friction while maximizing your long-term salary ceiling ($${primaryMatch.career.avgSalaryRange}).`,
      tailoredStrategyTips: [
        `Dedicate ${hoursNum} hours weekly with a focus on building projects over passive reading.`,
        `Complete the "${recommendedProjects[0]?.title || 'Core Project'}" project first to showcase proof of work.`,
        'Track weekly progress to maintain momentum and achieve interview readiness.'
      ]
    },
    estimatedTimelineSummary: {
      totalEstimatedWeeks: totalWeeks,
      estimatedMonthsText: `${minM}–${maxM} months`,
      hoursPerWeekRecommended: hoursNum,
      timelineFeasibilityScore,
      disclaimer: 'Estimates are based on consistent weekly commitment and hands-on project completion.'
    },
    generatedAt: new Date().toISOString()
  };
}
