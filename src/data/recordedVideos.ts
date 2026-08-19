import { RecordedVideoLesson } from '../types';

export const RECORDED_VIDEO_LESSONS_DATABASE: RecordedVideoLesson[] = [
  // 0. SkillSpire AI Original Micro-Learning Masterclasses
  {
    id: 'skillspire-original-java-01',
    batchName: 'SkillSpire AI Originals',
    instructor: 'SkillSpire AI Interactive Faculty',
    instructorTitle: 'AI Curriculum Engine',
    title: 'Java Fundamentals — Introduction for Beginners (60s Micro-Learning)',
    skillCovered: 'Java & Object-Oriented Programming',
    category: 'programming',
    durationMinutes: 1,
    isSkillSpireOriginal: true,
    originalVideoType: 'motion_graphics',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    isFlagshipMasterclass: false,
    whyRecommended: 'Original 60-second micro-learning motion graphics lesson covering core Java architecture, the 4 pillars, Main.java execution, and the learning roadmap.',
    chapters: [
      { id: 'ch-1', title: 'Welcome to SkillSpire AI & Lesson Intro', timestamp: '00:00', seconds: 0, summary: 'Introduction to Java Fundamentals on SkillSpire AI.' },
      { id: 'ch-2', title: 'What is Java? (Cross-Platform & Applications)', timestamp: '00:07', seconds: 7, summary: 'Java is an object-oriented language used for enterprise backends, mobile apps, and cloud systems.' },
      { id: 'ch-3', title: '4 Core Pillars: Platform Independent, OOP, Secure, Robust', timestamp: '00:18', seconds: 18, summary: 'JVM bytecode portability, object-oriented modularity, memory safety, and garbage collection.' },
      { id: 'ch-4', title: 'First Java Program (Main.java & println)', timestamp: '00:30', seconds: 30, summary: 'Line-by-line breakdown of public class Main, the main method entry point, and println output.' },
      { id: 'ch-5', title: 'Your Java Journey Roadmap (Basics → OOP → Collections → Exceptions → DSA)', timestamp: '00:45', seconds: 45, summary: '5-step learning path from syntax fundamentals to advanced data structures.' },
      { id: 'ch-6', title: 'Next Steps: Java OOP & Outro', timestamp: '00:54', seconds: 54, summary: 'Preparation for the next micro-lesson on Object-Oriented Programming.' }
    ],
    keyFormulasAndNotes: [
      'Java Structure: Every Java program must have at least one class definition: public class Main { ... }.',
      'Entry Point: public static void main(String[] args) is the exact signature the JVM looks for to start program execution.',
      'Console Output: System.out.println("Hello, SkillSpire!"); outputs text followed by a new line.',
      '4 Pillars: Platform Independent (via JVM bytecode), Object-Oriented (encapsulation, abstraction, inheritance, polymorphism), Secure (bytecode verifier & sandbox), Robust (automatic garbage collection & exception handling).',
      'Roadmap Order: Java Basics → OOP → Collections → Exception Handling → DSA.'
    ],
    quiz: [
      {
        id: 'q-micro-java-1',
        question: 'What is the starting point of execution for every Java program?',
        options: [
          'The public static void main(String[] args) method',
          'The System.out.println() statement',
          'The import java.util.* statement',
          'The class constructor'
        ],
        correctIndex: 0,
        explanation: 'In Java, the JVM starts executing instructions inside the main method: public static void main(String[] args).'
      },
      {
        id: 'q-micro-java-2',
        question: 'Which of the following is NOT one of the 4 core pillars highlighted in the lesson?',
        options: [
          'Platform Independent',
          'Object-Oriented',
          'Manual Pointer Arithmetic',
          'Robust'
        ],
        correctIndex: 2,
        explanation: 'Java eliminates raw pointer arithmetic to remain Secure and Robust, relying on automatic garbage collection.'
      },
      {
        id: 'q-micro-java-3',
        question: 'In the Java learning roadmap, what topic immediately follows Java Basics?',
        options: [
          'OOP (Object-Oriented Programming)',
          'Machine Learning',
          'DSA Graphs',
          'Database Sharding'
        ],
        correctIndex: 0,
        explanation: 'The SkillSpire AI roadmap sequence progresses from Java Basics directly into OOP (Object-Oriented Programming).'
      }
    ]
  },
  // 1. Java & DSA Placement Series
  {
    id: 'rec-java-dsa-01',
    batchName: 'Java & DSA Placement Masterclass',
    instructor: 'Senior SDE & Algorithms Mentor',
    instructorTitle: 'Staff Software Engineer',
    title: 'Java Core & OOP — From Zero to Hero',
    skillCovered: 'Data Structures & Algorithms',
    category: 'programming',
    durationMinutes: 145,
    youtubeVideoId: 'yRpLlJmRo2w', // Popular Java full course embed
    embedUrl: 'https://www.youtube.com/embed/yRpLlJmRo2w',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    isFlagshipMasterclass: true,
    whyRecommended: 'Foundational language fundamentals, memory heap/stack architecture, and class design required for Tier-1 placement interviews.',
    chapters: [
      { id: 'ch-1', title: 'JDK, JVM, JRE Architecture & Bytecode Execution', timestamp: '00:00', seconds: 0, summary: 'How Java achieves platform independence via Java Virtual Machine.' },
      { id: 'ch-2', title: 'Data Types, Primitives vs Non-Primitives & Typecasting', timestamp: '24:15', seconds: 1455, summary: 'Memory allocation and range limits for integers, floats, doubles, chars.' },
      { id: 'ch-3', title: 'Control Flow, Conditionals & Loops Optimization', timestamp: '48:30', seconds: 2910, summary: 'For, while, and do-while loops with break/continue execution patterns.' },
      { id: 'ch-4', title: 'OOP Core 4 Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism', timestamp: '01:18:00', seconds: 4680, summary: 'Deep dive into abstract classes, interfaces, and virtual method invocation.' },
      { id: 'ch-5', title: 'Memory Management, Garbage Collection & String Pool', timestamp: '01:52:00', seconds: 6720, summary: 'String immutability, StringBuilder efficiency, and heap generational GC.' }
    ],
    keyFormulasAndNotes: [
      'JVM Bytecode: .java source code is compiled by javac into .class bytecode, interpreted or JIT-compiled by the JVM.',
      '4 Pillars of OOP: Encapsulation (data hiding with private fields + getters/setters), Abstraction (hiding implementation via abstract class/interface), Inheritance (extends keyword for code reuse), Polymorphism (Compile-time via overloading, runtime via overriding).',
      'String Constant Pool: String literals are stored in the PermGen/Metaspace heap pool. Use StringBuilder when concatenating > 3 times in a loop to avoid O(N^2) memory allocations.',
      'Big-O Baseline: Primitive arithmetic is O(1). Array access by index arr[i] is O(1) due to direct memory offset calculation: base_address + (i * element_size).'
    ],
    quiz: [
      {
        id: 'q-java-1',
        question: 'Why are Strings immutable in Java?',
        options: [
          'For security, synchronization thread-safety, and String Constant Pool caching',
          'Because Java does not support pointers',
          'To restrict heap size to 64MB',
          'Strings are actually mutable in Java 17+'
        ],
        correctIndex: 0,
        explanation: 'String immutability enables String Constant Pool reuse, safe parameter passing in network/database connections, and inherent thread safety.'
      },
      {
        id: 'q-java-2',
        question: 'Which area of JVM memory stores local variables declared inside a method?',
        options: ['Stack Memory', 'Heap Memory', 'Method Area / Metaspace', 'Native Method Stack'],
        correctIndex: 0,
        explanation: 'Stack memory stores method frames, primitive local variables, and object references; the actual object instance lives on the Heap.'
      }
    ]
  },
  {
    id: 'rec-java-dsa-02',
    batchName: 'Java & DSA Placement Masterclass',
    instructor: 'Competitive Programming Lead',
    instructorTitle: 'Master Specialist in Algorithms',
    title: 'Arrays & Strings — Problem Solving',
    skillCovered: 'Data Structures & Algorithms',
    category: 'programming',
    durationMinutes: 160,
    youtubeVideoId: '8hly31xKli0',
    embedUrl: 'https://www.youtube.com/embed/8hly31xKli0',
    lectureNumber: 2,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    isFlagshipMasterclass: true,
    whyRecommended: 'The #1 asked algorithmic pattern in FAANG & Product company online assessments (OA).',
    chapters: [
      { id: 'ch-1', title: 'Dynamic Arrays & Memory Resizing Analysis', timestamp: '00:00', seconds: 0, summary: 'Amortized O(1) push_back mechanics and 1.5x/2x growth factor.' },
      { id: 'ch-2', title: 'Two-Pointer Technique on Sorted Arrays', timestamp: '32:10', seconds: 1930, summary: 'Solving Pair Sum, 3Sum, and Trapping Rain Water in O(N) linear time.' },
      { id: 'ch-3', title: 'Fixed vs Variable Sized Sliding Window', timestamp: '01:05:00', seconds: 3900, summary: 'Maximum subarray of size K and longest substring without repeating characters.' },
      { id: 'ch-4', title: 'Prefix Sum & Kadane’s Maximum Subarray Algorithm', timestamp: '01:40:00', seconds: 6000, summary: 'Range query optimization and dynamic programming state transitions.' }
    ],
    keyFormulasAndNotes: [
      'Kadanes Algorithm Formula: current_max = max(arr[i], current_max + arr[i]); global_max = max(global_max, current_max). Time: O(N), Space: O(1).',
      'Sliding Window Template: Expand right pointer until window is invalid; shrink left pointer until validity is restored; record optimal result.',
      'Two-Pointer Convergence: If array is sorted, comparing arr[L] + arr[R] against target dictates moving L (sum too small) or R (sum too large) in O(N).'
    ],
    quiz: [
      {
        id: 'q-dsa-1',
        question: 'What is the time complexity of Kadane’s algorithm for finding maximum subarray sum?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
        correctIndex: 0,
        explanation: 'Kadane’s algorithm operates in a single linear pass O(N) using constant O(1) auxiliary space.'
      }
    ]
  },

  // 2. Full Stack Web Development Bootcamp
  {
    id: 'rec-web-sigma-01',
    batchName: 'Full Stack Web Development Bootcamp',
    instructor: 'Engineering Faculty & UI Architect',
    instructorTitle: 'Senior Full Stack Architect',
    title: 'Modern HTML5, Semantic DOM & Responsive Tailwind CSS Architecture',
    skillCovered: 'HTML5 & Tailwind CSS',
    category: 'web',
    durationMinutes: 120,
    youtubeVideoId: 'mJgBOIoGihA',
    embedUrl: 'https://www.youtube.com/embed/mJgBOIoGihA',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    isFlagshipMasterclass: true,
    whyRecommended: 'Essential responsive layout mechanics, utility-first CSS, and modern browser rendering pipeline.',
    chapters: [
      { id: 'ch-1', title: 'Semantic Web & DOM Tree Construction', timestamp: '00:00', seconds: 0, summary: 'Header, main, section, article, nav, aside tag ergonomics for accessibility.' },
      { id: 'ch-2', title: 'CSS Box Model, Flexbox & CSS Grid Deep Dive', timestamp: '28:40', seconds: 1720, summary: 'Margin collapse, padding math, flex-direction, align-items, grid template areas.' },
      { id: 'ch-3', title: 'Tailwind CSS Utility-First Styling & Custom Design Tokens', timestamp: '01:02:00', seconds: 3720, summary: 'PurgeCSS, responsive prefixes (sm, md, lg), and custom theme extensions.' }
    ],
    keyFormulasAndNotes: [
      'Box Model Sizing: box-sizing: border-box ensures width = content + padding + border without accidental horizontal overflow.',
      'Flexbox vs Grid: Use Flexbox for 1-dimensional alignment (row or column); use CSS Grid for 2-dimensional structural application frames.',
      'Tailwind Responsive Principle: Mobile-first styling (e.g., p-4 md:p-8 means 16px padding on mobile, 32px on screens >= 768px).'
    ],
    quiz: [
      {
        id: 'q-web-1',
        question: 'In Tailwind CSS, what does a class like `lg:grid-cols-3` specify?',
        options: [
          'Applies 3 grid columns only on large screens (1024px and wider)',
          'Limits grid to 3 rows on all devices',
          'Forces responsive zoom of 300%',
          'Shrinks images to 33%'
        ],
        correctIndex: 0,
        explanation: 'Tailwind uses mobile-first media query breakpoints; `lg:` targets screen widths 1024px and above.'
      }
    ]
  },
  {
    id: 'rec-web-sigma-02',
    batchName: 'Full Stack Web Development Bootcamp',
    instructor: 'Frontend Tech Lead',
    instructorTitle: 'Principal UI Engineer',
    title: 'React 18+ Deep Dive — Hooks, State Management & Custom Hooks',
    skillCovered: 'React / Frontend Framework',
    category: 'web',
    durationMinutes: 175,
    youtubeVideoId: 'bMknfKXIFA8',
    embedUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
    lectureNumber: 2,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    isFlagshipMasterclass: true,
    whyRecommended: 'Master reactive component lifecycles, useState, useEffect dependency arrays, useMemo, and clean UI architecture.',
    chapters: [
      { id: 'ch-1', title: 'Virtual DOM, Fiber Reconciler & JSX Transpilation', timestamp: '00:00', seconds: 0, summary: 'How React diffs state mutations before committing to the browser DOM.' },
      { id: 'ch-2', title: 'useState, State Batching & Derived State Patterns', timestamp: '35:20', seconds: 2120, summary: 'Preventing unnecessary state variables by calculating derived metrics in render.' },
      { id: 'ch-3', title: 'useEffect Lifecycle, Cleanups & Dependency Traps', timestamp: '01:15:00', seconds: 4500, summary: 'Avoiding infinite re-renders and handling asynchronous race conditions.' },
      { id: 'ch-4', title: 'useMemo, useCallback & Performance Profiling', timestamp: '02:00:00', seconds: 7200, summary: 'Stabilizing function references and memoizing heavy computational filters.' }
    ],
    keyFormulasAndNotes: [
      'React Hook Rules: Only call hooks at top level (never in loops/conditions); only call hooks from React function components or custom hooks.',
      'Derived State Rule: Never duplicate state in useState if it can be computed during render from existing props/state.',
      'Fiber Tree Reconciliation: React maintains current and workInProgress trees, comparing keys to preserve DOM node identity.'
    ],
    quiz: [
      {
        id: 'q-react-1',
        question: 'What happens if you pass an empty array `[]` as the second argument to `useEffect`?',
        options: [
          'The effect runs only once after the initial component mount',
          'The effect never executes',
          'The effect re-runs on every render',
          'The component unmounts immediately'
        ],
        correctIndex: 0,
        explanation: 'An empty dependency array `[]` indicates the effect has no reactive dependencies and only triggers once after mounting.'
      }
    ]
  },
  {
    id: 'rec-web-sigma-03',
    batchName: 'Full Stack Web Development Bootcamp',
    instructor: 'Backend Systems Architect',
    instructorTitle: 'Cloud & Distributed Systems Specialist',
    title: 'Node.js, Express REST APIs, JWT Auth & PostgreSQL Integration',
    skillCovered: 'Node.js & Express',
    category: 'web',
    durationMinutes: 190,
    youtubeVideoId: 'Oe421EPjeBE',
    embedUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
    lectureNumber: 3,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    isFlagshipMasterclass: true,
    whyRecommended: 'Complete backend foundation covering route handlers, middleware chains, token security, and database ORMs.',
    chapters: [
      { id: 'ch-1', title: 'Node.js Non-Blocking Event Loop & Libuv Architecture', timestamp: '00:00', seconds: 0, summary: 'Timers, I/O polling, check phase, and Microtask queues.' },
      { id: 'ch-2', title: 'Express Middleware Pattern & Error Handling Pipeline', timestamp: '42:15', seconds: 2535, summary: 'CORS, express.json(), auth guards, and centralized error handler.' },
      { id: 'ch-3', title: 'JSON Web Tokens (JWT) & Password Hashing with Bcrypt', timestamp: '01:20:00', seconds: 4800, summary: 'Access vs refresh tokens, signing secrets, and HTTP-only cookie storage.' },
      { id: 'ch-4', title: 'Relational Database Queries & Schema Migrations', timestamp: '02:10:00', seconds: 7800, summary: 'Connecting to PostgreSQL with connection pools and parameterized queries.' }
    ],
    keyFormulasAndNotes: [
      'Event Loop Phases: Timers (setTimeout/setInterval) -> Pending callbacks -> Idle/Prepare -> Poll (I/O) -> Check (setImmediate) -> Close callbacks.',
      'JWT Structure: Header.Payload.Signature (HMAC-SHA256 encoded). Never put sensitive secrets or passwords in payload.',
      'SQL Injection Protection: Always use parameterized queries (e.g., db.query("SELECT * FROM users WHERE id = $1", [id])) instead of string concatenation.'
    ],
    quiz: [
      {
        id: 'q-node-1',
        question: 'Why should password hashes use salts and key-stretching (like bcrypt) instead of plain SHA-256?',
        options: [
          'To defeat pre-computed rainbow table lookups and brute-force GPU hardware attacks',
          'Because SHA-256 is deprecated in Node.js',
          'Bcrypt automatically decrypts passwords on login',
          'To make passwords shorter'
        ],
        correctIndex: 0,
        explanation: 'Salting prevents rainbow table attacks by generating a unique cryptographic salt per user; bcrypt work factor slows down brute-force crackers.'
      }
    ]
  },

  // 3. Data Science & Machine Learning Masterclass
  {
    id: 'rec-ds-ml-01',
    batchName: 'Data Science & AI Masterclass',
    instructor: 'Senior AI Research Scientist',
    instructorTitle: 'Lead Data Scientist',
    title: 'Python for Data Science, NumPy Vectors & Advanced Pandas EDA',
    skillCovered: 'Data Analysis & EDA',
    category: 'data',
    durationMinutes: 155,
    youtubeVideoId: 'vmEHCJofslg',
    embedUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    isFlagshipMasterclass: true,
    whyRecommended: 'Vectorized mathematical operations, missing data imputation, grouping, and statistical data transformations.',
    chapters: [
      { id: 'ch-1', title: 'NumPy Ndarray Vectorization vs Python Lists', timestamp: '00:00', seconds: 0, summary: 'Contiguous memory storage, broadcasting rules, and SIMD hardware acceleration.' },
      { id: 'ch-2', title: 'Pandas Series & DataFrames Indexing', timestamp: '35:00', seconds: 2100, summary: 'loc vs iloc, boolean masking, and memory dtype downcasting.' },
      { id: 'ch-3', title: 'Handling Missing Values, Duplicates & Outliers', timestamp: '01:10:00', seconds: 4200, summary: 'IQR method, Z-score thresholds, and KNN/Median imputation.' },
      { id: 'ch-4', title: 'GroupBy Aggregations & Pivot Tables', timestamp: '01:45:00', seconds: 6300, summary: 'Split-Apply-Combine pattern, custom lambda transforms, and multi-index tables.' }
    ],
    keyFormulasAndNotes: [
      'NumPy Broadcasting Rule: Two dimensions are compatible when they are equal, or one of them is 1.',
      'IQR Outlier Detection: IQR = Q3 - Q1. Lower Bound = Q1 - 1.5 * IQR, Upper Bound = Q3 + 1.5 * IQR.',
      'Pandas Vectorization: Always favor df["col"].apply() or native vectorized operations over iterating with for loops (100x speedup).'
    ],
    quiz: [
      {
        id: 'q-ds-1',
        question: 'What is the main advantage of NumPy vectorized operations over Python `for` loops?',
        options: [
          'Operations run in compiled C/Fortran code utilizing contiguous memory and CPU cache lines',
          'NumPy does not consume RAM',
          'It automatically converts code into SQL',
          'It prevents integer overflow'
        ],
        correctIndex: 0,
        explanation: 'NumPy executes vector calculations in contiguous C arrays without Python bytecode interpreter overhead.'
      }
    ]
  },
  {
    id: 'rec-ds-ml-02',
    batchName: 'Data Science & AI Masterclass',
    instructor: 'Machine Learning Strategist',
    instructorTitle: 'Principal ML Engineer',
    title: 'Supervised Machine Learning — Linear Models, Trees & Ensemble Boosting',
    skillCovered: 'Machine Learning',
    category: 'ai_ml',
    durationMinutes: 180,
    youtubeVideoId: 'i_LwzRVP7bg',
    embedUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg',
    lectureNumber: 2,
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    isFlagshipMasterclass: true,
    whyRecommended: 'Core ML algorithms tested in every technical machine learning and data science interview.',
    chapters: [
      { id: 'ch-1', title: 'Cost Functions, Gradient Descent & Learning Rates', timestamp: '00:00', seconds: 0, summary: 'MSE loss, convexity, learning rate scheduling, and momentum.' },
      { id: 'ch-2', title: 'Logistic Regression & Classification Decision Boundaries', timestamp: '40:00', seconds: 2400, summary: 'Sigmoid function, log-loss cross-entropy, precision, recall, and ROC-AUC curve.' },
      { id: 'ch-3', title: 'Decision Trees, Gini Impurity & Information Gain', timestamp: '01:15:00', seconds: 4500, summary: 'Splitting criteria, tree pruning, and controlling overfitting.' },
      { id: 'ch-4', title: 'Random Forests (Bagging) vs XGBoost/LightGBM (Boosting)', timestamp: '02:00:00', seconds: 7200, summary: 'Variance reduction via bootstrapping vs bias reduction via sequential gradient boosting.' }
    ],
    keyFormulasAndNotes: [
      'Bias-Variance Tradeoff: Total Error = Bias^2 + Variance + Irreducible Error. Bagging reduces variance; Boosting reduces bias.',
      'ROC-AUC Metric: Measures the true positive rate (Sensitivity) vs false positive rate (1 - Specificity) across all classification thresholds.',
      'L1 (Lasso) vs L2 (Ridge) Regularization: L1 adds sum(|w|) encouraging sparse feature selection; L2 adds sum(w^2) shrinking weights smoothly.'
    ],
    quiz: [
      {
        id: 'q-ml-1',
        question: 'Which ensemble technique builds trees sequentially to correct the residuals of previous trees?',
        options: ['Gradient Boosting (e.g. XGBoost)', 'Random Forest (Bagging)', 'Bootstrap Aggregation', 'K-Means Clustering'],
        correctIndex: 0,
        explanation: 'Boosting algorithms iteratively fit new estimators on the residual errors of the existing ensemble.'
      }
    ]
  },

  // 4. SQL & Database Placement Masterclass
  {
    id: 'rec-sql-mastery-01',
    batchName: 'SQL & Database Placement Masterclass',
    instructor: 'Database Systems Specialist',
    instructorTitle: 'Data Engineering Lead',
    title: 'Complete SQL from Basics to Window Functions & CTEs',
    skillCovered: 'SQL',
    category: 'data',
    durationMinutes: 140,
    youtubeVideoId: 'HXV3zeRRBAc',
    embedUrl: 'https://www.youtube.com/embed/HXV3zeRRBAc',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    isFlagshipMasterclass: true,
    whyRecommended: 'From basic SELECT queries to advanced analytical functions asked in product analytics assessments.',
    chapters: [
      { id: 'ch-1', title: 'Relational Database Schema Design & Normalization (1NF to 3NF)', timestamp: '00:00', seconds: 0, summary: 'Primary keys, foreign keys, eliminating update/deletion anomalies.' },
      { id: 'ch-2', title: 'INNER, LEFT, RIGHT, FULL OUTER & CROSS Joins', timestamp: '30:00', seconds: 1800, summary: 'Join Venn diagrams and performance execution plans on indexed foreign keys.' },
      { id: 'ch-3', title: 'Common Table Expressions (CTEs) & Subqueries', timestamp: '01:00:00', seconds: 3600, summary: 'WITH clause modularity and recursive CTEs for hierarchical tree structures.' },
      { id: 'ch-4', title: 'Window Functions: ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG', timestamp: '01:30:00', seconds: 5400, summary: 'OVER (PARTITION BY ... ORDER BY ...) for running totals and top-N category ranking.' }
    ],
    keyFormulasAndNotes: [
      'SQL Order of Execution: FROM -> ON -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.',
      'RANK vs DENSE_RANK: For values [100, 100, 90], RANK assigns [1, 1, 3] (skips rank), while DENSE_RANK assigns [1, 1, 2].',
      'Indexes: B-Tree indexes speed up WHERE column = val and range searches from O(N) sequential scan to O(log N) index scan.'
    ],
    quiz: [
      {
        id: 'q-sql-1',
        question: 'In SQL execution order, which clause is evaluated before `HAVING` but after `WHERE`?',
        options: ['GROUP BY', 'SELECT', 'ORDER BY', 'LIMIT'],
        correctIndex: 0,
        explanation: 'SQL first filters individual rows with WHERE, then groups rows with GROUP BY, then filters aggregate groups with HAVING.'
      }
    ]
  },

  // 5. Cloud, DevOps & System Design
  {
    id: 'rec-cloud-devops-01',
    batchName: 'Cloud & DevOps Master Bootcamp',
    instructor: 'Cloud Solutions Architect',
    instructorTitle: 'DevOps & SRE Veteran',
    title: 'Docker Containerization, Multi-Stage Builds & Kubernetes Pods',
    skillCovered: 'Docker & Containerization',
    category: 'cloud_devops',
    durationMinutes: 135,
    youtubeVideoId: 'fqMOX6JJhGo',
    embedUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    level: 'Intermediate',
    isFlagshipMasterclass: true,
    whyRecommended: 'Essential production standard for deploying microservices, isolating runtime dependencies, and CI/CD.',
    chapters: [
      { id: 'ch-1', title: 'Containers vs Virtual Machines (Namespaces & Cgroups)', timestamp: '00:00', seconds: 0, summary: 'Kernel isolation without guest OS hypervisor overhead.' },
      { id: 'ch-2', title: 'Writing Optimized Dockerfiles & Layer Caching', timestamp: '30:00', seconds: 1800, summary: 'Order of instructions, Alpine images, and preventing cache invalidation.' },
      { id: 'ch-3', title: 'Multi-Stage Builds to Reduce Image Size by 80%', timestamp: '01:05:00', seconds: 3900, summary: 'Compiling in builder stage and copying only binary artifacts to runtime image.' },
      { id: 'ch-4', title: 'Docker Compose & Multi-Container Networking', timestamp: '01:35:00', seconds: 5700, summary: 'Connecting web containers to Postgres and Redis with custom bridge networks.' }
    ],
    keyFormulasAndNotes: [
      'Docker Layer Caching: Docker re-uses cached layers for instructions that have not changed. Put package.json before source files to avoid re-running npm install.',
      'Multi-Stage Build Pattern: FROM node:18 AS builder -> build app -> FROM nginx:alpine -> COPY --from=builder /app/dist /usr/share/nginx/html.',
      'Container Security: Never run containers as root user; declare USER node or custom non-privileged UID in production images.'
    ],
    quiz: [
      {
        id: 'q-docker-1',
        question: 'What is the primary benefit of multi-stage Docker builds?',
        options: [
          'Drastically smaller production image size and enhanced security by omitting build tools',
          'Allows running Windows containers on Linux without emulation',
          'Guarantees zero RAM usage',
          'Eliminates the need for a Dockerfile'
        ],
        correctIndex: 0,
        explanation: 'Multi-stage builds allow compiling in heavy environments (with compilers, SDKs) and copying only the finished artifact into a lean runtime image.'
      }
    ]
  },

  // 6. Generative AI, RAG & LLMs Masterclass
  {
    id: 'rec-genai-rag-01',
    batchName: 'Generative AI & LLM Systems Masterclass',
    instructor: 'AI Research & Applications Team',
    instructorTitle: 'Applied Generative AI Scientist',
    title: 'LLMs Architecture, Embeddings, Vector Search & RAG Systems',
    skillCovered: 'LLMs & Prompt Engineering',
    category: 'ai_ml',
    durationMinutes: 165,
    youtubeVideoId: 'bc6uFV9CJGg',
    embedUrl: 'https://www.youtube.com/embed/bc6uFV9CJGg',
    lectureNumber: 1,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    level: 'Advanced',
    isFlagshipMasterclass: true,
    whyRecommended: 'High-value modern AI engineering skills for building RAG applications and LLM agent pipelines.',
    chapters: [
      { id: 'ch-1', title: 'Transformer Attention Mechanism & Tokenization', timestamp: '00:00', seconds: 0, summary: 'Self-attention, query-key-value projections, and Byte-Pair Encoding.' },
      { id: 'ch-2', title: 'High-Dimensional Vector Embeddings & Cosine Similarity', timestamp: '38:00', seconds: 2280, summary: 'Mathematical distance metrics in semantic vector spaces.' },
      { id: 'ch-3', title: 'Retrieval Augmented Generation (RAG) Architecture', timestamp: '01:10:00', seconds: 4200, summary: 'Chunking, indexing into vector databases, top-K retrieval, and prompt synthesis.' },
      { id: 'ch-4', title: 'Evaluating Hallucinations & Production Guardrails', timestamp: '01:50:00', seconds: 6600, summary: 'Faithfulness, context relevance metrics, and semantic caching.' }
    ],
    keyFormulasAndNotes: [
      'Cosine Similarity: cos(theta) = (A • B) / (||A|| * ||B||). Ranges from -1 to 1; measures directional alignment regardless of vector magnitude.',
      'RAG Triad Metrics: 1) Context Relevance (retrieved chunks match query), 2) Groundedness / Faithfulness (answer strictly derived from retrieved text), 3) Answer Relevance.',
      'Chunking Strategies: Recursive character splitting with 10-20% overlap prevents sentences from being clipped across token boundaries.'
    ],
    quiz: [
      {
        id: 'q-rag-1',
        question: 'In RAG systems, what does the "Overlap" parameter in text chunking prevent?',
        options: [
          'Loss of context and semantic meaning at chunk boundaries',
          'Token generation from freezing',
          'Vector database from running out of disk space',
          'Overclocking the GPU'
        ],
        correctIndex: 0,
        explanation: 'Chunk overlap ensures that key phrases or sentences that cross boundary splits are preserved together in at least one chunk.'
      }
    ]
  }
];

