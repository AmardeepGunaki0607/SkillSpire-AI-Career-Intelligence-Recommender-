import { GoogleGenAI } from '@google/genai';
import { UserProfile, AnalysisResult } from '../src/types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

const VALID_GEMINI_MODELS = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.7-flash'];

async function generateWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  responseMimeType?: string
): Promise<string | null> {
  for (const model of VALID_GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: responseMimeType ? { responseMimeType } : undefined,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch {
      // Continue to next available model without throwing
    }
  }
  return null;
}

export async function enhanceAnalysisWithGemini(
  profile: UserProfile,
  baseAnalysis: AnalysisResult
): Promise<AnalysisResult> {
  const ai = getGenAI();
  if (!ai) {
    return baseAnalysis;
  }

  try {
    const prompt = `
You are the Chief AI Career Strategist for SkillSpire AI.
Analyze the user profile and enrich the career recommendation with deeply personalized, human-readable insights.

User Profile:
- Name: ${profile.fullName}
- Academic: ${profile.educationLevel} in ${profile.degree || profile.major} (${profile.academicStatus})
- Current Skills & Proficiencies: ${profile.skills.map(s => `${s.name} (${s.proficiency})`).join(', ')}
- Interests: ${profile.interests.join(', ')}
- Stated Career Goal: ${profile.careerGoal} (Undecided: ${profile.isGoalUndecided})
- Experience: ${profile.experienceLevel}, Internships: "${profile.internshipExperience}", Projects Completed: ${profile.projectsCompletedCount}
- Available Learning Time: ${profile.weeklyLearningTime}
- Learning Style: ${profile.learningStyle}
- Target Timeline: ${profile.targetTimeline}
- Target Industry: ${profile.targetIndustry}

Base Evaluation:
- Primary Recommended Career: ${baseAnalysis.primaryCareer.career.title} (Match Score: ${baseAnalysis.primaryCareer.matchScore}%)
- Existing Strengths: ${baseAnalysis.topStrengths.join(', ')}
- Critical Skill Gaps: ${baseAnalysis.criticalGaps.map(g => `${g.skillName} (Current: ${g.currentLevel} -> Required: ${g.requiredLevel})`).join(', ')}

Please provide a JSON response with:
1. "whyThisCareerFits": 2-3 sentences explaining directly why this career path fits this specific user based on their exact skills and ambitions.
2. "strengthsAnalysis": A concise breakdown of their unfair advantages.
3. "gapsAnalysis": Clear, motivating explanation of their 2-3 most pivotal skill gaps and why mastering them unlocks hiring readiness.
4. "recommendationLogic": Clear explanation of the algorithmic logic and career trajectory reasoning.
5. "tailoredStrategyTips": An array of 3 actionable, high-impact bullet tips customized to their ${profile.weeklyLearningTime} weekly schedule.
`;

    const responseText = await generateWithFallback(ai, prompt, 'application/json');
    if (responseText) {
      const parsed = JSON.parse(responseText);
      return {
        ...baseAnalysis,
        aiExplanation: {
          fitSummary: baseAnalysis.aiExplanation.fitSummary,
          whyThisCareerFits: parsed.whyThisCareerFits || baseAnalysis.aiExplanation.whyThisCareerFits,
          strengthsAnalysis: parsed.strengthsAnalysis || baseAnalysis.aiExplanation.strengthsAnalysis,
          gapsAnalysis: parsed.gapsAnalysis || baseAnalysis.aiExplanation.gapsAnalysis,
          recommendationLogic: parsed.recommendationLogic || baseAnalysis.aiExplanation.recommendationLogic,
          tailoredStrategyTips: Array.isArray(parsed.tailoredStrategyTips) && parsed.tailoredStrategyTips.length > 0
            ? parsed.tailoredStrategyTips
            : baseAnalysis.aiExplanation.tailoredStrategyTips,
        },
      };
    }
  } catch (error) {
    console.warn('Gemini enhancement fallback used:', (error as Error).message);
  }

  return baseAnalysis;
}

export async function handleAssistantChat(
  message: string,
  analysisResult: AnalysisResult,
  chatHistory: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<string> {
  const ai = getGenAI();

  const profile = analysisResult.userProfile;
  const primaryCareer = analysisResult.primaryCareer;

  // Fallback intelligent responses if Gemini is not configured
  if (!ai) {
    const lower = message.toLowerCase();
    if (lower.includes('what should i learn next') || lower.includes('learn next') || lower.includes('start')) {
      const firstGap = analysisResult.criticalGaps[0]?.skillName || 'core foundational concepts';
      return `Based on your profile and ${profile.weeklyLearningTime} schedule, your highest priority is to start with **${firstGap}** in Phase 1 of your roadmap. Dedicate your first 2 weeks to building small hands-on scripts rather than just watching tutorials!`;
    }
    if (lower.includes('why') && (lower.includes('recommend') || lower.includes('fit') || lower.includes('data science') || lower.includes('career'))) {
      return `**${primaryCareer.career.title}** was recommended with a **${primaryCareer.matchScore}% Match Score** because you already possess strong skills in ${analysisResult.topStrengths.join(', ') || 'analytical problem-solving'}. Your major in ${profile.major || profile.degree} and interest in ${profile.interests.slice(0, 2).join(', ')} give you a significant natural advantage.`;
    }
    if (lower.includes('project') || lower.includes('which project') || lower.includes('build first')) {
      const proj = analysisResult.allRecommendedProjects[0];
      return `You should build **"${proj?.title || 'Customer Churn Intelligence'}"** first! It directly addresses your key skill gaps in ${proj?.targetSkills.slice(0, 3).join(', ')} and gives you an impressive portfolio piece with an estimated ${proj?.estimatedWeeks || 2}-week timeline.`;
    }
    if (lower.includes('3 months') || lower.includes('timeline') || lower.includes('fast') || lower.includes('prioritize')) {
      return `For an aggressive 3-month timeline, focus strictly on Phases 1 and 2 of your roadmap. Cut out nice-to-have tools and zero in on **${analysisResult.criticalGaps.slice(0, 2).map(g => g.skillName).join(' and ')}**, then immediately build and deploy one comprehensive capstone project to demonstrate proof-of-work.`;
    }
    if (lower.includes('10 hour') || lower.includes('plan') || lower.includes('schedule') || lower.includes('routine')) {
      return `Here is an optimized **10-Hour Weekly Blueprint** tailored to your ${profile.learningStyle} preference:\n- **Mon & Tue (3 hrs total):** Core theory and code katas in ${analysisResult.criticalGaps[0]?.skillName || 'key skills'}.\n- **Thu & Fri (3 hrs total):** Implement intermediate exercises and API integrations.\n- **Saturday (4 hrs sprint):** Hands-on building on your ${analysisResult.allRecommendedProjects[0]?.title || 'capstone project'}.\n- **Sunday:** Review code, commit to GitHub, and plan next week!`;
    }
    if (lower.includes('sql') || lower.includes('python')) {
      return `To level up your SQL/Python rapidly: Practice writing complex queries (Window functions like \`ROW_NUMBER()\`, CTEs, and aggregations) on real business datasets (e.g. Mode Analytics or LeetCode Database problems). Pair this with building a functional CRUD or ETL script!`;
    }

    return `As your SkillSpire AI Advisor for **${primaryCareer.career.title}**, I've reviewed your background (${profile.academicStatus}, ${profile.weeklyLearningTime}/week). You have ${analysisResult.topStrengths.length} strong foundational skills and ${analysisResult.criticalGaps.length} critical gaps to tackle. Feel free to ask for step-by-step coding drills, project architecture ideas, or interview strategies!`;
  }

  for (const model of VALID_GEMINI_MODELS) {
    try {
      const systemInstruction = `
You are SkillSpire AI Career Assistant — an elite, encouraging, and deeply knowledgeable technical career mentor.
You have access to the candidate's exact diagnostic profile:
- Candidate Name: ${profile.fullName}
- Educational Background: ${profile.educationLevel} in ${profile.degree || profile.major}
- Current Status: ${profile.academicStatus}
- Existing Skills & Proficiencies: ${profile.skills.map(s => `${s.name} [${s.proficiency}]`).join(', ')}
- Primary Recommended Career: ${primaryCareer.career.title} (${primaryCareer.matchScore}% Match)
- Top Strengths: ${analysisResult.topStrengths.join(', ')}
- Critical Skill Gaps: ${analysisResult.criticalGaps.map(g => `${g.skillName} (${g.currentLevel} -> ${g.requiredLevel})`).join(', ')}
- Weekly Available Time: ${profile.weeklyLearningTime}
- Learning Style: ${profile.learningStyle}
- Target Timeline: ${profile.targetTimeline}
- Current Recommended Project: ${analysisResult.allRecommendedProjects[0]?.title}

Instructions:
- Give concise, actionable, and empathetic advice.
- Use markdown formatting with bolding and structured bullet points where helpful.
- Reference their actual skills and target career directly so the advice is unmistakably personalized.
- If asked for learning schedules, tailor it to their exact weekly hours (${profile.weeklyLearningTime}).
`;

      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction,
        },
      });

      // Provide context and history
      for (const h of chatHistory.slice(-4)) {
        if (h.role === 'user') {
          await chat.sendMessage({ message: h.text });
        }
      }

      const response = await chat.sendMessage({ message });
      if (response.text) {
        return response.text;
      }
    } catch (error) {
      console.warn(`Chat model ${model} error (${(error as Error).message}), trying next...`);
    }
  }

  return `I analyzed your roadmap for **${primaryCareer.career.title}**. To maximize your ${profile.weeklyLearningTime} weekly commitment, concentrate on closing your top gap in **${analysisResult.criticalGaps[0]?.skillName || 'core skills'}** while building your portfolio!`;
}
