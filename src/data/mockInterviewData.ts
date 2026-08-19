import { MockInterviewQuestion, MockInterviewEvaluation } from '../types';

export const MOCK_INTERVIEW_QUESTIONS_DATABASE: Record<string, MockInterviewQuestion[]> = {
  'machine_learning': [
    {
      id: 'ml-q1',
      type: 'technical',
      category: 'Deep Learning & Optimizers',
      question: 'How does Adam optimizer combine the advantages of AdaGrad and RMSProp, and when might SGD with momentum outperform Adam?',
      hint: 'Think about first and second moment estimates (exponential moving averages of gradients vs. squared gradients) and generalization on flat minima.',
      keyConcepts: ['Exponential Moving Averages', 'Momentum (First Moment)', 'Adaptive Learning Rate (Second Moment)', 'Generalization Gap', 'Flat vs. Sharp Minima'],
      sampleAnswer: 'Adam calculates adaptive learning rates for each parameter by computing exponentially decaying averages of past gradients (momentum) and past squared gradients (RMSProp). It includes bias correction for zero initialization. While Adam converges faster on sparse gradients, SGD with Momentum often generalizes better on vision and NLP tasks because it traverses sharp local minima to flatter basins.'
    },
    {
      id: 'ml-q2',
      type: 'system_design',
      category: 'MLOps & Low-Latency Serving',
      question: 'Design a real-time recommendation inference pipeline that needs to serve top-10 items with sub-50ms p99 latency for 50,000 active concurrent users.',
      hint: 'Break down the architecture into two stages: Candidate Generation (Retrieval/ANN using Faiss/Milvus) and Heavy Ranking (Transformer/GBDT cross-network) with caching.',
      keyConcepts: ['Two-Stage Architecture', 'Approximate Nearest Neighbors (ANN)', 'Vector Indexing (HNSW/IVF)', 'Feature Store / Redis Caching', 'Batching & TensorRT / ONNX Runtime'],
      sampleAnswer: 'A production high-throughput pipeline separates retrieval from ranking. Stage 1 (Candidate Generation) queries a vector database (e.g. Milvus/Qdrant using HNSW index) to filter millions of items down to ~500 candidates within 10ms. Stage 2 (Ranking & Re-ranking) passes candidates through a quantized model (TensorRT/ONNX) enriched with real-time user context from Redis. Results are de-duplicated and returned with a p99 under 35ms.'
    },
    {
      id: 'ml-q3',
      type: 'problem_solving',
      category: 'Data Drift & Model Monitoring',
      question: 'Your deployed churn prediction model drops 15% in AUC three weeks after deployment without code changes. How do you diagnose and resolve this?',
      hint: 'Differentiate between Concept Drift, Covariate Shift, and Upstream Data Pipeline / Schema corruption.',
      keyConcepts: ['Covariate Shift vs Concept Drift', 'Population Stability Index (PSI)', 'KS-Test / Wasserstein Distance', 'Upstream Feature Pipeline Audit', 'Automated Retraining Loop'],
      sampleAnswer: 'First, I verify upstream data pipelines to rule out schema changes or null value injections. Second, I calculate Population Stability Index (PSI) and Kolmogorov-Smirnov distance between training distribution and inference traffic to detect Covariate Shift. Third, if feature distributions are identical but outcomes shifted, Concept Drift has occurred. I initiate retraining on a sliding window of recent labeled data and re-evaluate on holdout sets.'
    },
    {
      id: 'ml-q4',
      type: 'behavioral',
      category: 'Cross-functional Collaboration',
      question: 'Tell me about a time a product manager asked for 99.9% model accuracy, but you knew that was mathematically infeasible or prone to catastrophic overfitting. How did you handle it?',
      hint: 'Use the STAR format: Situation, Task, Action, Result. Focus on translating technical trade-offs into business metrics.',
      keyConcepts: ['STAR Method', 'Precision-Recall Tradeoff', 'Cost Matrix / Business Impact', 'Stakeholder Communication'],
      sampleAnswer: 'In my past project, product leadership requested 99% accuracy for fraud detection. I demonstrated that achieving 99% raw accuracy on a 1% imbalanced dataset would simply predict non-fraud for everything. Instead, I proposed framing the goal around Precision at 90% Recall, aligning false positive rates with the customer support team’s review capacity. This saved hundreds of engineering hours and delivered measurable business ROI.'
    }
  ],

  'software_engineering': [
    {
      id: 'swe-q1',
      type: 'technical',
      category: 'Distributed Systems & Concurrency',
      question: 'Explain the difference between Optimistic Concurrency Control (OCC) and Pessimistic Locking. In what scenarios would you choose one over the other?',
      hint: 'Think about database row locking vs version timestamps and read-heavy vs high-contention write scenarios.',
      keyConcepts: ['Row Locking (SELECT FOR UPDATE)', 'Version Columns / Timestamps', 'Write Contention', 'Deadlock Risks', 'Throughput vs Safety'],
      sampleAnswer: 'Pessimistic locking explicitly locks rows (SELECT FOR UPDATE) preventing concurrent modifications until the transaction commits, ideal for high-conflict financial transactions. OCC does not acquire locks upfront; instead, it checks if a version number changed during commit. OCC provides significantly higher throughput in read-heavy applications where conflicting writes are rare.'
    },
    {
      id: 'swe-q2',
      type: 'system_design',
      category: 'Scalability & Caching',
      question: 'How do you handle Cache Breakdown (Thundering Herd) and Cache Penetration in a high-scale microservices architecture?',
      hint: 'Mention Mutex Locks / Singleflight, Bloom Filters, and Cache-Aside with stale-while-revalidate.',
      keyConcepts: ['Cache Stampede / Thundering Herd', 'Distributed Mutex (Redlock)', 'Bloom Filters for Non-existent Keys', 'Stale-While-Revalidate', 'TTL Jitter'],
      sampleAnswer: 'For Cache Stampede (when an expired hot key triggers thousands of DB hits), I use a distributed lock or Singleflight pattern so only one request queries the database while others wait, plus TTL jitter to prevent simultaneous expiry. For Cache Penetration (queries for non-existent IDs hitting the DB), I place a Bloom Filter in front of the cache and store null values with short TTLs.'
    },
    {
      id: 'swe-q3',
      type: 'problem_solving',
      category: 'API Design & Idempotency',
      question: 'How do you design a payment processing API endpoint so that a duplicate request from a flaky mobile client does not charge the customer twice?',
      hint: 'Discuss Idempotency Keys stored in Redis with unique transaction tokens and distributed locking.',
      keyConcepts: ['Idempotency Key Header', 'Unique Request Token', 'Atomic Compare-and-Swap in Redis', '2-Phase State Tracking (PROCESSING -> COMPLETED)'],
      sampleAnswer: 'I require clients to provide a unique Idempotency-Key in the request header (UUIDv4). The server performs an atomic SETNX in Redis with a 24-hour TTL. If the key exists with status "PROCESSING", subsequent requests receive HTTP 409 Conflict. Once payment succeeds, the final response is cached against the key so re-transmissions instantly receive the identical cached receipt.'
    },
    {
      id: 'swe-q4',
      type: 'behavioral',
      category: 'Incident Response & Ownership',
      question: 'Describe a situation where a bug in your code crashed a production service or caused a regression. How did you react and what post-mortem actions followed?',
      hint: 'Demonstrate zero defensiveness, rapid remediation, root cause analysis (5 Whys), and blameless post-mortem prevention.',
      keyConcepts: ['Immediate Rollback', 'Blameless Post-Mortem', '5 Whys Root Cause Analysis', 'Automated Regression Tests & Canary Deployments'],
      sampleAnswer: 'During a release, an unhandled null pointer on an optional user profile field caused a 500 error on the checkout page. I immediately initiated a 1-click rollback to the prior stable artifact within 3 minutes. Afterwards, I authored a blameless post-mortem identifying that our integration tests mocked non-null structures. We instituted TypeScript strict null checks and added end-to-end synthetic canary tests to our CI/CD pipeline.'
    }
  ],

  'data_science': [
    {
      id: 'ds-q1',
      type: 'technical',
      category: 'Statistics & Hypothesis Testing',
      question: 'When running an A/B test with multiple metric variants, what is the Family-Wise Error Rate (FWER) and how do you correct for it?',
      hint: 'Think about alpha inflation ($\alpha = 0.05 \rightarrow 1 - (1 - 0.05)^k$) and Bonferroni or False Discovery Rate (Benjamini-Hochberg) corrections.',
      keyConcepts: ['Alpha Inflation', 'Type I Error', 'Bonferroni Correction', 'False Discovery Rate (FDR)', 'Benjamini-Hochberg Procedure'],
      sampleAnswer: 'Testing multiple hypotheses simultaneously increases the probability of at least one false positive (Type I error). If testing 10 metrics at alpha = 0.05, the cumulative risk is ~40%. To control this, we use the Bonferroni correction (dividing alpha by number of tests) for strict control, or the Benjamini-Hochberg FDR procedure for a better balance of statistical power without excessive false negatives.'
    },
    {
      id: 'ds-q2',
      type: 'system_design',
      category: 'Feature Engineering & SQL Aggregation',
      question: 'How do you prevent data leakage when engineering rolling window features (e.g. 7-day average spend) for a time-series forecasting model?',
      hint: 'Mention time-based cross-validation (TimeSeriesSplit) and shifting window lags by at least $t-1$.',
      keyConcepts: ['Target / Data Leakage', 'Look-ahead Bias', 'Time-based Train/Val Split', 'Lagged Shift (t-1)', 'Point-in-Time Correctness'],
      sampleAnswer: 'Data leakage happens when information from future time steps leaks into past training records. I prevent this by always calculating rolling statistics strictly over lagged windows (e.g. rows between 7 days prior and $t-1$) using SQL point-in-time joins, and validating with Purged Group TimeSeriesSplit rather than randomized k-fold cross-validation.'
    },
    {
      id: 'ds-q3',
      type: 'behavioral',
      category: 'Data Storytelling & Influence',
      question: 'How do you present complex statistical findings to non-technical executives who just want a binary Yes/No recommendation?',
      hint: 'Focus on business KPIs, decision trees, risk bands, and actionable outcomes rather than p-values.',
      keyConcepts: ['Executive Summaries', 'Expected Value & Risk Range', 'Visual Heatmaps', 'Actionable Recommendation First'],
      sampleAnswer: 'I start with the "Bottom Line Up Front" (BLUF): the projected revenue impact, confidence bounds, and a clear strategic recommendation. Instead of detailing p-values or t-distributions, I translate uncertainty into expected monetary value and downside risk ranges. I provide an appendix with full statistical methodologies for technical review.'
    }
  ]
};

export function getInterviewQuestionsForCareer(careerTitle: string): MockInterviewQuestion[] {
  const lower = careerTitle.toLowerCase();
  if (lower.includes('data') || lower.includes('analyst') || lower.includes('statistician')) {
    return MOCK_INTERVIEW_QUESTIONS_DATABASE['data_science'];
  }
  if (lower.includes('machine') || lower.includes('ai') || lower.includes('deep learning') || lower.includes('vision') || lower.includes('nlp')) {
    return MOCK_INTERVIEW_QUESTIONS_DATABASE['machine_learning'];
  }
  return MOCK_INTERVIEW_QUESTIONS_DATABASE['software_engineering'];
}

export function evaluateUserInterviewResponse(
  question: MockInterviewQuestion, 
  userResponseText: string
): MockInterviewEvaluation {
  const text = userResponseText.trim().toLowerCase();
  const wordCount = text.split(/\s+/).length;

  if (wordCount < 10) {
    return {
      overallScore: 35,
      technicalAccuracyScore: 30,
      clarityAndStructureScore: 40,
      strengths: ['Addressed the prompt directly'],
      improvements: [
        'Response is too brief. Elaborate on underlying architectural mechanisms and trade-offs.',
        'Use concrete technical terms and structured reasoning (e.g., Problem $\\rightarrow$ Solution $\\rightarrow$ Trade-offs).'
      ],
      idealAnswerHighlights: question.sampleAnswer,
      summaryFeedback: 'Good initial attempt, but technical interviewers expect detailed step-by-step reasoning and terminology.'
    };
  }

  // Count key concept hits
  let matchedConcepts: string[] = [];
  let missedConcepts: string[] = [];

  question.keyConcepts.forEach(concept => {
    const words = concept.toLowerCase().split(/[\s/()]+/);
    const hasMatch = words.some(w => w.length > 3 && text.includes(w));
    if (hasMatch) {
      matchedConcepts.push(concept);
    } else {
      missedConcepts.push(concept);
    }
  });

  const conceptCoverageRatio = matchedConcepts.length / Math.max(1, question.keyConcepts.length);
  
  let accuracyScore = Math.min(95, Math.round(55 + conceptCoverageRatio * 40));
  let structureScore = Math.min(98, Math.round(60 + (wordCount > 40 ? 30 : wordCount * 0.75)));
  let overallScore = Math.round((accuracyScore * 0.6) + (structureScore * 0.4));

  const strengthsList: string[] = [];
  if (matchedConcepts.length > 0) {
    strengthsList.push(`Strong coverage of key concepts: ${matchedConcepts.slice(0, 3).join(', ')}.`);
  }
  if (wordCount >= 50) {
    strengthsList.push('Well-structured explanation with sufficient depth and detail.');
  } else {
    strengthsList.push('Concise and direct answering style.');
  }

  const improvementsList: string[] = [];
  if (missedConcepts.length > 0) {
    improvementsList.push(`Consider mentioning ${missedConcepts.slice(0, 2).join(' and ')} to demonstrate senior-level mastery.`);
  }
  if (!text.includes('trade-off') && !text.includes('however') && !text.includes('because')) {
    improvementsList.push('Include engineering trade-offs (e.g. why one approach is chosen over alternatives).');
  }

  return {
    overallScore,
    technicalAccuracyScore: accuracyScore,
    clarityAndStructureScore: structureScore,
    strengths: strengthsList,
    improvements: improvementsList.length > 0 ? improvementsList : ['Excellent response! To make it world-class, share a specific real-world latency metric.'],
    idealAnswerHighlights: question.sampleAnswer,
    summaryFeedback: overallScore >= 80 
      ? '🎉 Outstanding technical interview answer! You demonstrated solid command of systems design, trade-offs, and accurate vocabulary.'
      : 'Solid foundational answer! Incorporating the recommended trade-offs and missed concepts will make your response standout to senior hiring managers.'
  };
}
