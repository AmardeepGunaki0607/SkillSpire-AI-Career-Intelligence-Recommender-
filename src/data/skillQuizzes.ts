export interface VerificationQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillQuizData {
  topic: string;
  questions: VerificationQuizQuestion[];
}

export const GENERIC_FALLBACK_QUIZZES: Record<string, SkillQuizData> = {
  'python': {
    topic: 'Python Programming',
    questions: [
      {
        id: 'py-1',
        question: 'Which built-in Python data structure is immutable and ordered?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctIndex: 2,
        explanation: 'Tuples are immutable sequence types in Python, meaning their elements cannot be modified after creation.'
      },
      {
        id: 'py-2',
        question: 'What is the time complexity of looking up a key in an average Python dictionary?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        correctIndex: 0,
        explanation: 'Python dictionaries are implemented as hash tables, offering O(1) average time complexity for key lookups.'
      }
    ]
  },
  'sql': {
    topic: 'SQL & Relational Databases',
    questions: [
      {
        id: 'sql-1',
        question: 'Which SQL clause is used to filter records resulting from a GROUP BY aggregation?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER'],
        correctIndex: 1,
        explanation: 'HAVING filters aggregated groups, whereas WHERE filters individual rows before grouping occurs.'
      },
      {
        id: 'sql-2',
        question: 'Which index type is best suited for range queries on numerical data in PostgreSQL / MySQL?',
        options: ['Hash Index', 'B-Tree Index', 'GIN Index', 'Bitmap Index'],
        correctIndex: 1,
        explanation: 'B-Tree indexes maintain sorted order, making them optimal for equality and range queries (<, <=, =, >=, >).'
      }
    ]
  },
  'pytorch': {
    topic: 'PyTorch Deep Learning',
    questions: [
      {
        id: 'torch-1',
        question: 'What method must be called on an optimizer before backpropagation to prevent gradient accumulation?',
        options: ['optimizer.zero_grad()', 'optimizer.step()', 'optimizer.clear()', 'loss.backward()'],
        correctIndex: 0,
        explanation: 'In PyTorch, gradients accumulate by default on backward passes, so optimizer.zero_grad() is required at each iteration.'
      },
      {
        id: 'torch-2',
        question: 'Which tensor method detaches a tensor from the current computation graph without gradient tracking?',
        options: ['.clone()', '.detach()', '.numpy()', '.cpu()'],
        correctIndex: 1,
        explanation: '.detach() returns a new Tensor, detached from the current autograd computation graph.'
      }
    ]
  },
  'docker': {
    topic: 'Docker & Containerization',
    questions: [
      {
        id: 'dk-1',
        question: 'What is the primary benefit of multi-stage Docker builds?',
        options: ['Faster network downloads only', 'Minimizing final production image size by separating build tools from runtime', 'Auto-scaling containers', 'Encrypting Dockerfiles'],
        correctIndex: 1,
        explanation: 'Multi-stage builds allow compiling in an intermediate stage and copying only the runtime binaries into a slim final image.'
      },
      {
        id: 'dk-2',
        question: 'Which Docker instruction sets default arguments that can be overridden when executing docker run?',
        options: ['RUN', 'CMD', 'ENTRYPOINT', 'ENV'],
        correctIndex: 1,
        explanation: 'CMD provides default execution parameters that are easily overridden by arguments passed to docker run.'
      }
    ]
  },
  'react': {
    topic: 'React & Frontend Architecture',
    questions: [
      {
        id: 'react-1',
        question: 'When should you use the useEffect cleanup return function?',
        options: ['To re-render the parent component', 'To cancel timers, subscriptions, or event listeners when component unmounts', 'To mutate props', 'To format dates'],
        correctIndex: 1,
        explanation: 'The function returned by useEffect runs during unmounting or before re-running the effect to clean up resources and prevent memory leaks.'
      },
      {
        id: 'react-2',
        question: 'What is the purpose of React.useMemo()?',
        options: ['To store state across sessions', 'To memoize expensive calculation results across re-renders', 'To trigger immediate re-renders', 'To make API calls'],
        correctIndex: 1,
        explanation: 'useMemo caches the result of an expensive calculation between re-renders when dependencies have not changed.'
      }
    ]
  },
  'data_structures': {
    topic: 'Data Structures & Algorithms',
    questions: [
      {
        id: 'dsa-1',
        question: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n^2)', 'O(log n)', 'O(n)'],
        correctIndex: 1,
        explanation: 'QuickSort degenerates to O(n^2) when an unbalanced pivot is chosen repeatedly (e.g., sorted array with last element pivot).'
      },
      {
        id: 'dsa-2',
        question: 'Which data structure is fundamentally used in Breadth-First Search (BFS) graph traversal?',
        options: ['Stack', 'Queue', 'Heap', 'Trie'],
        correctIndex: 1,
        explanation: 'BFS uses a FIFO (First-In, First-Out) Queue to explore neighbor vertices in order of proximity.'
      }
    ]
  },
  'cloud': {
    topic: 'Cloud Computing & Infrastructure',
    questions: [
      {
        id: 'cloud-1',
        question: 'Which cloud computing model manages the OS and runtime while you only deploy application code?',
        options: ['IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'Bare Metal', 'On-Premises'],
        correctIndex: 1,
        explanation: 'PaaS (like Google Cloud Run, Heroku, AWS Elastic Beanstalk) abstracts OS, networking, and server provisioning.'
      },
      {
        id: 'cloud-2',
        question: 'What is the primary function of a Load Balancer in distributed systems?',
        options: ['Encrypt hard drives', 'Distribute incoming network traffic across multiple healthy backend server instances', 'Backup database tables', 'Compile TypeScript code'],
        correctIndex: 1,
        explanation: 'Load balancers maximize throughput, prevent server overload, and ensure high availability across replicas.'
      }
    ]
  }
};

export function getQuizForTopic(skillOrMilestoneTitle: string): SkillQuizData {
  const lower = skillOrMilestoneTitle.toLowerCase();

  if (lower.includes('python') || lower.includes('pandas') || lower.includes('numpy')) {
    return GENERIC_FALLBACK_QUIZZES['python'];
  }
  if (lower.includes('sql') || lower.includes('database') || lower.includes('postgres') || lower.includes('dbms')) {
    return GENERIC_FALLBACK_QUIZZES['sql'];
  }
  if (lower.includes('torch') || lower.includes('neural') || lower.includes('machine learning') || lower.includes('deep learning') || lower.includes('model') || lower.includes('ai')) {
    return GENERIC_FALLBACK_QUIZZES['pytorch'];
  }
  if (lower.includes('docker') || lower.includes('container') || lower.includes('kubernetes') || lower.includes('k8s') || lower.includes('devops')) {
    return GENERIC_FALLBACK_QUIZZES['docker'];
  }
  if (lower.includes('react') || lower.includes('frontend') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('next')) {
    return GENERIC_FALLBACK_QUIZZES['react'];
  }
  if (lower.includes('algorithm') || lower.includes('dsa') || lower.includes('tree') || lower.includes('graph') || lower.includes('array') || lower.includes('structure')) {
    return GENERIC_FALLBACK_QUIZZES['data_structures'];
  }
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('gcp') || lower.includes('azure') || lower.includes('server')) {
    return GENERIC_FALLBACK_QUIZZES['cloud'];
  }

  // Default dynamic contextual quiz
  return {
    topic: skillOrMilestoneTitle,
    questions: [
      {
        id: 'generic-1',
        question: `When implementing ${skillOrMilestoneTitle} in a production environment, what is the best practice?`,
        options: [
          'Skip error handling for faster execution',
          'Implement structured logging, edge-case validation, and modular architecture',
          'Hardcode configuration parameters into client files',
          'Deploy without writing automated tests'
        ],
        correctIndex: 1,
        explanation: 'Production architectures require robust logging, boundary checks, and decoupled modular components for reliability.'
      },
      {
        id: 'generic-2',
        question: `How do you measure practical proficiency in ${skillOrMilestoneTitle}?`,
        options: [
          'By memorizing definitions without hands-on coding',
          'By building a working project, writing unit tests, and understanding trade-offs',
          'By avoiding documentation and relying only on assumptions',
          'By copying code without reviewing how it operates'
        ],
        correctIndex: 1,
        explanation: 'Real-world software engineering readiness is proven through hands-on implementation and understanding design trade-offs.'
      }
    ]
  };
}
