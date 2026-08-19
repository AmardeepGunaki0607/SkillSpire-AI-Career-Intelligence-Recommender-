import { JobMarketInsight } from '../types';

export const JOB_MARKET_DATABASE: Record<string, JobMarketInsight> = {
  'machine_learning': {
    careerTitle: 'Machine Learning Engineer',
    entrySalaryInr: '₹8.5L – ₹14L / yr',
    avgSalaryInr: '₹18L – ₹28L / yr',
    seniorSalaryInr: '₹35L – ₹65L+ / yr',
    avgSalaryUsd: '$145,000 – $210,000 / yr',
    yoyGrowthRate: '+38.4% YoY',
    activeOpeningsEstimate: '24,500+ Active Roles',
    remoteOpportunityPercent: 68,
    topHiringCompanies: [
      { name: 'Google DeepMind', location: 'Bengaluru / Mountain View' },
      { name: 'Microsoft AI', location: 'Hyderabad / Redmond' },
      { name: 'NVIDIA', location: 'Pune / Santa Clara' },
      { name: 'Flipkart AI Labs', location: 'Bengaluru' },
      { name: 'OpenAI Ecosystem', location: 'Remote / SF' }
    ],
    hottestSkillsThisMonth: [
      'vLLM & TensorRT-LLM',
      'LoRA / QLoRA Fine-tuning',
      'LangGraph & Agentic Workflows',
      'Milvus / Qdrant Vector Search',
      'PyTorch 2.4 Distributed Training'
    ],
    interviewDifficulty: 'Very High'
  },

  'software_engineering': {
    careerTitle: 'Full-Stack Developer',
    entrySalaryInr: '₹6L – ₹10L / yr',
    avgSalaryInr: '₹14L – ₹22L / yr',
    seniorSalaryInr: '₹28L – ₹48L+ / yr',
    avgSalaryUsd: '$115,000 – $165,000 / yr',
    yoyGrowthRate: '+24.1% YoY',
    activeOpeningsEstimate: '48,000+ Active Roles',
    remoteOpportunityPercent: 74,
    topHiringCompanies: [
      { name: 'Amazon', location: 'Bengaluru / Seattle' },
      { name: 'CRED', location: 'Bengaluru' },
      { name: 'Uber Technologies', location: 'Hyderabad / SF' },
      { name: 'Atlassian', location: 'Bengaluru / Sydney' },
      { name: 'Stripe', location: 'Remote / SF' }
    ],
    hottestSkillsThisMonth: [
      'Next.js 15 App Router & React 19',
      'FastAPI & Go Microservices',
      'PostgreSQL Optimization & pgvector',
      'Docker & Kubernetes CI/CD',
      'Redis Distributed Caching'
    ],
    interviewDifficulty: 'High'
  },

  'data_science': {
    careerTitle: 'Data Scientist & AI Analyst',
    entrySalaryInr: '₹7L – ₹12L / yr',
    avgSalaryInr: '₹15L – ₹24L / yr',
    seniorSalaryInr: '₹30L – ₹52L+ / yr',
    avgSalaryUsd: '$125,000 – $180,000 / yr',
    yoyGrowthRate: '+29.6% YoY',
    activeOpeningsEstimate: '31,200+ Active Roles',
    remoteOpportunityPercent: 62,
    topHiringCompanies: [
      { name: 'Fractal Analytics', location: 'Mumbai / NYC' },
      { name: 'McKinsey QuantumBlack', location: 'Gurugram / London' },
      { name: 'Swiggy Data Labs', location: 'Bengaluru' },
      { name: 'JPMorgan Chase', location: 'Hyderabad / NYC' },
      { name: 'Zomato Intelligence', location: 'Gurugram' }
    ],
    hottestSkillsThisMonth: [
      'Advanced SQL & dbt Pipelines',
      'Snowflake & BigQuery Warehousing',
      'A/B Testing & Causal Inference',
      'Tableau / Power BI Embedded',
      'Python Statsmodels & Prophet'
    ],
    interviewDifficulty: 'High'
  }
};

export function getJobMarketInsightForCareer(careerTitle: string): JobMarketInsight {
  const lower = careerTitle.toLowerCase();
  if (lower.includes('data') || lower.includes('analyst') || lower.includes('statistician')) {
    return JOB_MARKET_DATABASE['data_science'];
  }
  if (lower.includes('machine') || lower.includes('ai') || lower.includes('deep learning')) {
    return JOB_MARKET_DATABASE['machine_learning'];
  }
  return JOB_MARKET_DATABASE['software_engineering'];
}
