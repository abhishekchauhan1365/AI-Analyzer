export interface SectionScore {
  name: string;
  score: number; // 0-100
  feedback: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  atsScore: number; // 0-100
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skillCategories: SkillCategory[];
  sections: {
    experience: SectionScore;
    education: SectionScore;
    skills: SectionScore;
    formatting: SectionScore;
    summary: SectionScore;
  };
  keywords: string[];
  estimatedYearsExperience: number;
  targetRoles: string[];
}

export interface IAnalysis {
  _id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: AnalysisResult;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
