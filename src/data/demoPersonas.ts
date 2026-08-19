import { DemoPersona } from '../types';

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'persona-data-science',
    name: 'Aarav Patel',
    tagline: 'Computer Science Undergrad seeking Data Science transition',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profile: {
      id: 'demo-aarav',
      fullName: 'Aarav Patel',
      educationLevel: "Bachelor's",
      degree: 'B.S. in Computer Science',
      major: 'Artificial Intelligence & Systems',
      graduationYear: '2025',
      academicStatus: 'Currently Studying',
      skills: [
        { id: 's-py', name: 'Python', category: 'programming', proficiency: 'Advanced' },
        { id: 's-sql', name: 'SQL', category: 'data', proficiency: 'Intermediate' },
        { id: 's-pandas', name: 'Data Analysis & EDA', category: 'data', proficiency: 'Intermediate' },
        { id: 's-ml', name: 'Machine Learning', category: 'ai_ml', proficiency: 'Beginner' },
        { id: 's-git', name: 'Git & Version Control', category: 'tools', proficiency: 'Intermediate' },
        { id: 's-prob', name: 'Problem Solving', category: 'soft', proficiency: 'Intermediate' }
      ],
      interests: ['Data Science', 'Artificial Intelligence', 'Machine Learning', 'Research'],
      careerGoal: 'Data Scientist',
      isGoalUndecided: false,
      experienceLevel: 'Entry-Level / Student',
      internshipExperience: 'Academic Lab Assistant (6 months)',
      projectsCompletedCount: 2,
      certifications: ['Coursera Python Specialization'],
      currentJobStatus: 'Full-time Student',
      weeklyLearningTime: '10-15 hours',
      learningStyle: 'Hands-on Projects',
      targetTimeline: '6 months (Standard)',
      targetIndustry: 'Tech & FinTech',
      workLocationPreference: 'Hybrid',
      createdAt: new Date().toISOString()
    }
  },
  {
    id: 'persona-web-dev',
    name: 'Maya Lin',
    tagline: 'Frontend Developer aiming to master Full Stack engineering',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    profile: {
      id: 'demo-maya',
      fullName: 'Maya Lin',
      educationLevel: 'Self-Taught / Bootcamp',
      degree: 'Frontend Web Immersive',
      major: 'Interactive Media',
      graduationYear: '2024',
      academicStatus: 'Recent Graduate (0-1 yr)',
      skills: [
        { id: 's-js', name: 'JavaScript & TypeScript', category: 'programming', proficiency: 'Advanced' },
        { id: 's-react', name: 'React / Frontend Framework', category: 'web', proficiency: 'Advanced' },
        { id: 's-htmlcss', name: 'HTML5 & Tailwind CSS', category: 'web', proficiency: 'Advanced' },
        { id: 's-git', name: 'Git & Version Control', category: 'tools', proficiency: 'Intermediate' },
        { id: 's-uiux', name: 'UI/UX Design Sensitivity', category: 'soft', proficiency: 'Intermediate' },
        { id: 's-node', name: 'Node.js & Express', category: 'web', proficiency: 'Beginner' }
      ],
      interests: ['Web Development', 'Software Development', 'Cloud Computing', 'UI/UX'],
      careerGoal: 'Full Stack Developer',
      isGoalUndecided: false,
      experienceLevel: 'Junior (1-2 yrs)',
      internshipExperience: 'Freelance UI Developer (9 months)',
      projectsCompletedCount: 4,
      certifications: ['Meta Frontend Developer Professional Certificate'],
      currentJobStatus: 'Junior Web Designer',
      weeklyLearningTime: '15+ hours',
      learningStyle: 'Interactive Coding',
      targetTimeline: '3 months (Aggressive)',
      targetIndustry: 'Modern SaaS / Startups',
      workLocationPreference: 'Remote',
      createdAt: new Date().toISOString()
    }
  },
  {
    id: 'persona-cybersecurity',
    name: 'Marcus Vance',
    tagline: 'IT Support technician pivoting to Cybersecurity Analyst',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    profile: {
      id: 'demo-marcus',
      fullName: 'Marcus Vance',
      educationLevel: 'Diploma',
      degree: 'Network Systems Administration',
      major: 'Information Technology',
      graduationYear: '2023',
      academicStatus: 'Career Switcher',
      skills: [
        { id: 's-net', name: 'Networking Fundamentals (TCP/IP, DNS, OSI)', category: 'cybersecurity', proficiency: 'Intermediate' },
        { id: 's-linux', name: 'Linux & Windows Security', category: 'tools', proficiency: 'Intermediate' },
        { id: 's-pysec', name: 'Python for Security Automation', category: 'programming', proficiency: 'Beginner' },
        { id: 's-prob', name: 'Problem Solving & Debugging', category: 'soft', proficiency: 'Intermediate' },
        { id: 's-comm', name: 'Communication & Storytelling', category: 'soft', proficiency: 'Intermediate' }
      ],
      interests: ['Cybersecurity', 'Cloud Computing', 'DevOps', 'IoT'],
      careerGoal: 'Cybersecurity Analyst',
      isGoalUndecided: false,
      experienceLevel: 'Junior (1-2 yrs)',
      internshipExperience: 'Tier 1 IT Helpdesk Specialist (1.5 yrs)',
      projectsCompletedCount: 1,
      certifications: ['CompTIA Network+'],
      currentJobStatus: 'IT Support Technician',
      weeklyLearningTime: '5-10 hours',
      learningStyle: 'Mixed / Blended',
      targetTimeline: '6 months (Standard)',
      targetIndustry: 'Enterprise Security & Banking',
      workLocationPreference: 'Any',
      createdAt: new Date().toISOString()
    }
  }
];
