export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'recruiter';
  profilePicture?: string;
  createdAt?: string;
}

export interface SectionScore {
  name: string;
  score: number;
  feedback: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface AnalysisResult {
  overallScore?: number;
  atsScore?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  skillCategories?: SkillCategory[];
  sections?: {
    experience: SectionScore;
    education: SectionScore;
    skills: SectionScore;
    formatting: SectionScore;
    summary: SectionScore;
  };
  keywords?: string[];
  estimatedYearsExperience?: number;
  targetRoles?: string[];
  sentiment?: string;
  readabilityLevel?: string;
  detectedTone?: string;
  [key: string]: any;
}

export interface Analysis {
  _id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  inputType?: string;
  analysisType?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: AnalysisResult;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
