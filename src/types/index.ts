
export interface Student {
  name: string;
  age: number;
  grade: number;
  interests: string[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface LessonContent {
  title: string;
  introduction: string;
  sections: LessonSection[];
  summary: string;
  relatedTopics: string[];
}

export interface LessonSection {
  title: string;
  content: string;
  example?: string;
  activity?: LessonActivity;
}

export interface LessonActivity {
  type: 'question' | 'exercise' | 'experiment';
  description: string;
  solution?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  feedback: string;
}

export interface GeminiAPIResponse {
  content: LessonContent | QuizQuestion[];
  error?: string;
}
