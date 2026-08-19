import React, { useState } from 'react';
import { 
  GraduationCap, 
  Code, 
  Heart, 
  Target, 
  Briefcase, 
  Clock, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import { 
  UserProfile, 
  UserSkill, 
  SkillProficiency, 
  EducationLevel, 
  AcademicStatus, 
  ExperienceLevel, 
  LearningTime, 
  LearningStyle, 
  TargetTimeline,
  DemoPersona
} from '../types';
import { CAREER_KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { DEMO_PERSONAS } from '../data/demoPersonas';

interface OnboardingWizardProps {
  initialProfile?: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
  onCancel: () => void;
  onSelectDemoPersona: (persona: DemoPersona) => void;
}

const PRESET_SKILLS = [
  { name: 'Python', category: 'programming' },
  { name: 'JavaScript & TypeScript', category: 'programming' },
  { name: 'Java', category: 'programming' },
  { name: 'C++', category: 'programming' },
  { name: 'SQL', category: 'data' },
  { name: 'Excel & Advanced Spreadsheets', category: 'tools' },
  { name: 'Power BI / Tableau', category: 'tools' },
  { name: 'Machine Learning', category: 'ai_ml' },
  { name: 'Deep Learning & Neural Networks', category: 'ai_ml' },
  { name: 'Data Analysis & EDA', category: 'data' },
  { name: 'Cloud Computing (AWS/GCP)', category: 'cloud_devops' },
  { name: 'Docker & Containerization', category: 'cloud_devops' },
  { name: 'Networking Fundamentals (TCP/IP, DNS, OSI)', category: 'cybersecurity' },
  { name: 'Linux & Windows Security', category: 'tools' },
  { name: 'React / Frontend Framework', category: 'web' },
  { name: 'Node.js & Express', category: 'web' },
  { name: 'HTML5 & Tailwind CSS', category: 'web' },
  { name: 'Communication & Storytelling', category: 'soft' },
  { name: 'Problem Solving', category: 'soft' },
  { name: 'Git & Version Control', category: 'tools' },
] as const;

const INTEREST_OPTIONS = [
  'Artificial Intelligence',
  'Data Science',
  'Software Development',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'Business Analytics',
  'Web Development',
  'Mobile Development',
  'IoT & Embedded Systems',
  'Robotics',
  'UI/UX Design',
  'Academic Research',
  'Product Management'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  onSubmit,
  onCancel,
  onSelectDemoPersona
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState(initialProfile?.fullName || 'Alex Morgan');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(initialProfile?.educationLevel || "Bachelor's");
  const [degree, setDegree] = useState(initialProfile?.degree || 'B.S. in Computer Science');
  const [major, setMajor] = useState(initialProfile?.major || 'Computer Science');
  const [graduationYear, setGraduationYear] = useState(initialProfile?.graduationYear || '2025');
  const [academicStatus, setAcademicStatus] = useState<AcademicStatus>(initialProfile?.academicStatus || 'Currently Studying');

  // Skills
  const [skills, setSkills] = useState<UserSkill[]>(
    initialProfile?.skills || [
      { id: 's-1', name: 'Python', category: 'programming', proficiency: 'Intermediate' },
      { id: 's-2', name: 'SQL', category: 'data', proficiency: 'Beginner' }
    ]
  );
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customProficiency, setCustomProficiency] = useState<SkillProficiency>('Intermediate');

  // Interests
  const [interests, setInterests] = useState<string[]>(
    initialProfile?.interests || ['Artificial Intelligence', 'Data Science', 'Software Development']
  );

  // Career Goal
  const [careerGoal, setCareerGoal] = useState<string>(initialProfile?.careerGoal || 'Data Scientist');
  const [isGoalUndecided, setIsGoalUndecided] = useState<boolean>(initialProfile?.isGoalUndecided || false);
  const [careerSearch, setCareerSearch] = useState('');

  // Experience
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(initialProfile?.experienceLevel || 'Entry-Level / Student');
  const [internshipExperience, setInternshipExperience] = useState(initialProfile?.internshipExperience || 'None yet');
  const [projectsCompletedCount, setProjectsCompletedCount] = useState(initialProfile?.projectsCompletedCount || 2);
  const [certificationsText, setCertificationsText] = useState((initialProfile?.certifications || []).join(', '));
  const [currentJobStatus, setCurrentJobStatus] = useState(initialProfile?.currentJobStatus || 'Student');

  // Learning Preferences
  const [weeklyLearningTime, setWeeklyLearningTime] = useState<LearningTime>(initialProfile?.weeklyLearningTime || '10-15 hours');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(initialProfile?.learningStyle || 'Hands-on Projects');
  const [targetTimeline, setTargetTimeline] = useState<TargetTimeline>(initialProfile?.targetTimeline || '6 months (Standard)');

  // Target Logistics
  const [targetIndustry, setTargetIndustry] = useState(initialProfile?.targetIndustry || 'Tech & FinTech');
  const [workLocationPreference, setWorkLocationPreference] = useState<'Remote' | 'Hybrid' | 'On-site' | 'Any'>(
    initialProfile?.workLocationPreference || 'Hybrid'
  );

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleTogglePresetSkill = (presetName: string, category: any) => {
    const existing = skills.find(s => s.name === presetName);
    if (existing) {
      setSkills(skills.filter(s => s.name !== presetName));
    } else {
      setSkills([
        ...skills,
        {
          id: `skill-${Date.now()}-${Math.random()}`,
          name: presetName,
          category,
          proficiency: 'Intermediate'
        }
      ]);
    }
  };

  const updateSkillProficiency = (skillName: string, proficiency: SkillProficiency) => {
    setSkills(skills.map(s => s.name === skillName ? { ...s, proficiency } : s));
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const addCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === customSkillInput.trim().toLowerCase())) return;

    setSkills([
      ...skills,
      {
        id: `custom-skill-${Date.now()}`,
        name: customSkillInput.trim(),
        category: 'other',
        proficiency: customProficiency
      }
    ]);
    setCustomSkillInput('');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: UserProfile = {
      id: initialProfile?.id || `user-${Date.now()}`,
      fullName: fullName.trim() || 'Alex Morgan',
      educationLevel,
      degree,
      major,
      graduationYear,
      academicStatus,
      skills: skills.length > 0 ? skills : [{ id: 'default-skill', name: 'Problem Solving', category: 'soft', proficiency: 'Intermediate' }],
      interests: interests.length > 0 ? interests : ['Software Development'],
      careerGoal: isGoalUndecided ? 'Undecided' : careerGoal,
      isGoalUndecided,
      experienceLevel,
      internshipExperience,
      projectsCompletedCount: Number(projectsCompletedCount) || 0,
      certifications: certificationsText.split(',').map(c => c.trim()).filter(Boolean),
      currentJobStatus,
      weeklyLearningTime,
      learningStyle,
      targetTimeline,
      targetIndustry,
      workLocationPreference,
      createdAt: initialProfile?.createdAt || new Date().toISOString()
    };

    onSubmit(finalProfile);
  };

  const filteredCareers = CAREER_KNOWLEDGE_BASE.filter(c => {
    if (!c) return false;
    const search = (careerSearch || '').toLowerCase().trim();
    if (!search) return true;
    const title = (c.title || '').toLowerCase();
    const category = (c.category || '').toLowerCase();
    return title.includes(search) || category.includes(search);
  });

  const STEPS_CONFIG = [
    { num: 1, title: 'Education', icon: GraduationCap },
    { num: 2, title: 'Skills', icon: Code },
    { num: 3, title: 'Interests', icon: Heart },
    { num: 4, title: 'Career Goal', icon: Target },
    { num: 5, title: 'Experience', icon: Briefcase },
    { num: 6, title: 'Preferences', icon: Clock },
    { num: 7, title: 'Target', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                Career Diagnostic Assessment
              </span>
              <span className="text-xs text-slate-400">Step {step} of 7</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {STEPS_CONFIG[step - 1].title} Details
            </h1>
          </div>

          {/* Persona Shortcut Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 pl-1.5 hidden sm:inline">Or load demo:</span>
            {DEMO_PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectDemoPersona(p)}
                className="px-2 py-1 rounded-lg text-[11px] font-medium bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors shadow-2xs"
                title={p.name}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            {STEPS_CONFIG.map((s, idx) => {
              const Icon = s.icon;
              const isCurrent = step === s.num;
              const isDone = step > s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm' 
                      : isDone 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-medium hidden md:block ${
                    isCurrent ? 'text-blue-600 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Step Form Card */}
        <form onSubmit={handleFinalSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* STEP 1: EDUCATION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Educational Background</h2>
                <p className="text-xs text-slate-500 mt-0.5">Helps SkillSpire gauge academic grounding and career entry level.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Education Level</label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma / Associate</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="PhD">PhD / Doctorate</option>
                    <option value="Self-Taught / Bootcamp">Self-Taught / Coding Bootcamp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree / Certification Title</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Branch / Major</label>
                  <input
                    type="text"
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    placeholder="e.g. Data Science, Electrical, Math"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={e => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2025"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Academic Status</label>
                  <select
                    value={academicStatus}
                    onChange={e => setAcademicStatus(e.target.value as AcademicStatus)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Currently Studying">Currently Studying</option>
                    <option value="Recent Graduate (0-1 yr)">Recent Graduate (0-1 yr)</option>
                    <option value="Early Career (1-3 yrs)">Early Career (1-3 yrs)</option>
                    <option value="Career Switcher">Career Switcher</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CURRENT SKILLS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Current Technical & Soft Skills</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select skills you have used and set your current proficiency level.</p>
              </div>

              {/* Selected Skills Chips with Proficiency Buttons */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800">
                    Selected Skills ({skills.length}):
                  </span>
                  <span className="text-[11px] text-slate-400">Click level to toggle (Beginner/Inter/Adv)</span>
                </div>

                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No skills selected yet. Click from the suggestions below or add your own.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <div 
                        key={skill.name}
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs"
                      >
                        <span className="text-xs font-semibold text-slate-800 pl-1">{skill.name}</span>
                        <div className="flex rounded-md bg-slate-100 p-0.5 text-[10px]">
                          {(['Beginner', 'Intermediate', 'Advanced'] as SkillProficiency[]).map(lvl => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateSkillProficiency(skill.name, lvl)}
                              className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                                skill.proficiency === lvl 
                                  ? 'bg-blue-600 text-white font-bold shadow-xs' 
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              {lvl[0]}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.name)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preset Skill Suggestions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Quick Add Suggestions:</label>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {PRESET_SKILLS.map(preset => {
                    const isSelected = skills.some(s => s.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleTogglePresetSkill(preset.name, preset.category)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3 text-blue-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Skill Adder */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                  placeholder="Type a custom skill (e.g., PyTorch, GraphQL, Rust)..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={customProficiency}
                    onChange={e => setCustomProficiency(e.target.value as SkillProficiency)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INTERESTS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Domains & Technologies You Enjoy</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select areas that excite you to help our AI align recommendations with your passions.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {INTEREST_OPTIONS.map(interest => {
                  const isChecked = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-blue-50/80 border-blue-400 text-blue-900 font-bold shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{interest}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CAREER GOAL */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">What Career Are You Targeting?</h2>
                <p className="text-xs text-slate-500 mt-0.5">Have a specific role in mind, or want the AI to uncover your best options?</p>
              </div>

              {/* Undecided / Surprise Me Option */}
              <button
                type="button"
                onClick={() => setIsGoalUndecided(!isGoalUndecided)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isGoalUndecided 
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200 text-indigo-900 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">I don't know yet — Let AI recommend my ideal path!</p>
                    <p className="text-[11px] text-slate-500 font-normal">Our engine will rank all 16+ careers based purely on your skill match.</p>
                  </div>
                </div>
                {isGoalUndecided && <Check className="w-4 h-4 text-indigo-600" />}
              </button>

              {!isGoalUndecided && (
                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={careerSearch}
                      onChange={e => setCareerSearch(e.target.value)}
                      placeholder="Search 16+ high-demand careers (e.g. Machine Learning, DevOps, Full Stack)..."
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {filteredCareers.map(c => {
                      const isSelected = careerGoal === c.title;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCareerGoal(c.title)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold ring-1 ring-blue-300' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{c.title}</span>
                            <span className="text-[10px] text-slate-400">{c.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-normal">{c.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: EXPERIENCE */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Experience & Practical Background</h2>
                <p className="text-xs text-slate-500 mt-0.5">Captures your practical building history.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience Tier</label>
                  <select
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Entry-Level / Student">Entry-Level / Student</option>
                    <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
                    <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                    <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Projects Completed in Total</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={projectsCompletedCount}
                    onChange={e => setProjectsCompletedCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Internship / Work Experience</label>
                  <input
                    type="text"
                    value={internshipExperience}
                    onChange={e => setInternshipExperience(e.target.value)}
                    placeholder="e.g. 6 months Web Dev Intern or None yet"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Employment Status</label>
                  <input
                    type="text"
                    value={currentJobStatus}
                    onChange={e => setCurrentJobStatus(e.target.value)}
                    placeholder="e.g. Full-time Student, Freelancer, Unemployed"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  value={certificationsText}
                  onChange={e => setCertificationsText(e.target.value)}
                  placeholder="e.g. AWS Cloud Practitioner, Meta React Certificate, Coursera Python"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* STEP 6: LEARNING PREFERENCES */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Learning Commitment & Style</h2>
                <p className="text-xs text-slate-500 mt-0.5">We use this to compute realistic weekly durations and course recommendations.</p>
              </div>

              {/* Weekly Learning Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Weekly Available Study Time</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['2-5 hours', '5-10 hours', '10-15 hours', '15+ hours'] as LearningTime[]).map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setWeeklyLearningTime(time)}
                      className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                        weeklyLearningTime === time 
                          ? 'bg-blue-600 text-white font-bold shadow-xs border-blue-600' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Preferred Learning Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['Hands-on Projects', 'Interactive Coding', 'Video Courses', 'Documentation & Books', 'Mixed / Blended'] as LearningStyle[]).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLearningStyle(style)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        learningStyle === style 
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold ring-1 ring-indigo-300' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Timeline */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Target Timeline to Become Job-Ready</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['3 months (Aggressive)', '6 months (Standard)', '9-12 months (Comprehensive)', 'Flexible / Self-Paced'] as TargetTimeline[]).map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTargetTimeline(time)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        targetTimeline === time 
                          ? 'bg-slate-900 text-white font-bold border-slate-900' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: TARGET INDUSTRY & SUMMARY */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Target Industry & Preferences</h2>
                <p className="text-xs text-slate-500 mt-0.5">Final touch to personalize market relevance and project recommendations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Industry</label>
                  <select
                    value={targetIndustry}
                    onChange={e => setTargetIndustry(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Tech & FinTech">Tech & FinTech</option>
                    <option value="Modern SaaS / Startups">Modern SaaS / Startups</option>
                    <option value="Enterprise Security & Banking">Enterprise Security & Banking</option>
                    <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Gaming & Interactive Media">Gaming & Interactive Media</option>
                    <option value="Any / Open">Any / Open</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Location Preference</label>
                  <select
                    value={workLocationPreference}
                    onChange={e => setWorkLocationPreference(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>

              {/* Assessment Summary Review Box */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Ready to Run Complete Career Diagnostic</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px] pt-1">
                  <p><strong>Candidate:</strong> {fullName}</p>
                  <p><strong>Education:</strong> {educationLevel} ({academicStatus})</p>
                  <p><strong>Input Skills:</strong> {skills.length} skills recorded</p>
                  <p><strong>Target:</strong> {isGoalUndecided ? 'Undecided (AI will rank)' : careerGoal}</p>
                  <p><strong>Commitment:</strong> {weeklyLearningTime} / week</p>
                  <p><strong>Timeline:</strong> {targetTimeline}</p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                id="wizard-prev-btn"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            )}

            {step < 7 ? (
              <button
                type="button"
                id="wizard-next-btn"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                id="generate-career-path-btn"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Career Path</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
