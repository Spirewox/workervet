export type Department = string;

export const INITIAL_DEPARTMENTS: string[] = [
  'Sales & Customer Management',
  'Creative & Tech',
  'Finance',
  'Legal',
  'Business Administration'
];

export type Skill = 
  | 'Trust'
  | 'Integrity'
  | 'Accountability'
  | 'Communication'
  | 'Teamwork'
  | 'Ethics'
  | 'Confidentiality';

export const SKILLS: Skill[] = [
  'Trust', 'Integrity', 'Accountability', 'Communication', 'Teamwork', 'Ethics', 'Confidentiality'
];

export interface Question {
  id: string;
  skill: Skill;
  scenario: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  timeLimit?: number; // Added to allow setting countdown timer per question (in seconds)
  isPreset?: boolean; // Flag to identify manually added questions
  department?: Department; // Optional: specific department this question belongs to
}

export interface JobPosting {
  id: string;
  title: string;
  department: Department;
  description: string;
  requirements: string;
  location: string;
  salaryRange: string;
  createdAt: string;
  active: boolean;
}

export interface AssessmentResult {
  id: string;
  department: Department;
  jobId?: string; // Optional: link result to a specific job posting
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
    skill?: string; // Added to track performance per skill
  }[];
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  cvFileName?: string;
  targetDepartment?: Department;
  password?: string; // Added password field
  assessments: AssessmentResult[];
}