import { ResumeAtsAnalysis } from '../types';

export function analyzeResumeAts(resumeText: string, targetCareer: string): ResumeAtsAnalysis {
  const text = resumeText.toLowerCase();
  const target = targetCareer.toLowerCase();

  // Keyword dictionary by career
  let expectedKeywords: string[] = [];

  if (target.includes('machine') || target.includes('ai') || target.includes('deep learning')) {
    expectedKeywords = [
      'Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Transformers',
      'HuggingFace', 'Computer Vision', 'NLP', 'MLOps', 'Docker',
      'CI/CD', 'FastAPI', 'Pandas', 'Vector Databases', 'LangChain',
      'Model Optimization', 'Quantization', 'Inference Latency', 'GPU', 'REST API'
    ];
  } else if (target.includes('data') || target.includes('analyst') || target.includes('business')) {
    expectedKeywords = [
      'SQL', 'Python', 'Power BI', 'Tableau', 'Excel',
      'Pandas', 'Data Cleaning', 'Statistical Modeling', 'Hypothesis Testing',
      'ETL Pipelines', 'A/B Testing', 'Snowflake', 'BigQuery', 'Data Warehousing',
      'KPI Dashboards', 'Stakeholder Communication', 'Data Storytelling'
    ];
  } else {
    expectedKeywords = [
      'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'RESTful APIs',
      'Tailwind CSS', 'Docker', 'Git', 'CI/CD', 'Microservices',
      'Redis', 'AWS / Cloud', 'Unit Testing', 'GraphQL', 'Next.js',
      'Database Optimization', 'State Management', 'Agile'
    ];
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  expectedKeywords.forEach(kw => {
    if (text.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoverage = matchedKeywords.length / Math.max(1, expectedKeywords.length);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Compute metrics
  const impactMetric = (text.match(/(\d+%|\$\d+|\b[0-9]+k\b|\b[0-9]+x\b|\breduced\b|\bincreased\b|\bscaled\b|\boptimized\b)/g) || []).length;
  
  const overallMatchScore = Math.min(96, Math.max(30, Math.round(keywordCoverage * 60 + Math.min(25, impactMetric * 4) + (wordCount > 100 ? 15 : wordCount * 0.1))));
  const formattingScore = Math.min(95, Math.max(50, Math.round(75 + (text.includes('experience') ? 10 : 0) + (text.includes('skills') ? 10 : 0))));
  const impactScore = Math.min(94, Math.max(35, Math.round(40 + impactMetric * 8)));

  // Generate actionable bullet point rewrites
  const bulletPointRewrites = [
    {
      original: 'Developed machine learning models and tested on datasets.',
      improved: `Engineered and benchmarked deep learning architectures (PyTorch), boosting validation AUC by +14.2% and reducing inference latency from 120ms to 38ms.`,
      reason: 'Replaced passive phrasing with specific framework metrics, latency improvements, and quantifiable accuracy gains.'
    },
    {
      original: 'Created REST APIs and worked with database tables.',
      improved: `Architected high-throughput RESTful endpoints using FastAPI and PostgreSQL, managing 45,000+ daily requests with 99.95% uptime and Redis caching.`,
      reason: 'Added throughput volume (45k+ requests), availability SLA (99.95%), and caching architecture.'
    },
    {
      original: 'Helped the team with data cleaning and dashboard creation.',
      improved: `Built automated ETL pipelines and real-time interactive dashboards (Tableau / SQL), cutting manual data triage time by 30 hours per sprint.`,
      reason: 'Highlighted business time savings (30h/sprint) and concrete pipeline engineering.'
    }
  ];

  return {
    overallMatchScore,
    matchedKeywords,
    missingKeywords,
    formattingScore,
    impactScore,
    bulletPointRewrites,
    executiveSummary: overallMatchScore >= 75
      ? `Strong ATS compatibility for ${targetCareer}. Your resume displays solid foundational vocabulary, but adding the missing keywords and quantifiable scale metrics will push you into top 5% recruiter shortlists.`
      : `Moderate ATS match for ${targetCareer}. Key domain frameworks are missing, and project descriptions need stronger action verbs with quantified outcomes.`,
    criticalRecommendations: [
      `Incorporate top missing domain keywords: ${missingKeywords.slice(0, 4).join(', ')}.`,
      'Apply Google X-Y-Z formula to all project bullets: "Accomplished [X], as measured by [Y], by doing [Z]".',
      'Ensure standard section headers (Experience, Technical Skills, Education, Projects) for clean ATS machine parsing.'
    ]
  };
}
