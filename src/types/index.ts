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

export type ApiProvider = 'gemini' | 'deepseek';

export interface LessonContent {
  title: string;
  introduction: string;
  sections: LessonSection[];
  summary: string;
  relatedTopics: string[];
  worksheets?: LessonWorksheet[];
  images?: LessonImage[];
  interactiveExercises?: InteractiveExercise[];
  videoReferences?: VideoReference[];
}

export interface LessonSection {
  title: string;
  content: string;
  example?: string;
  activity?: LessonActivity;
}

export interface LessonActivity {
  type: 'question' | 'exercise' | 'experiment' | 'interactive';
  description: string;
  solution?: string;
  hints?: string[];
}

export interface LessonWorksheet {
  title: string;
  description: string;
  problems: LessonWorksheetProblem[];
}

export interface LessonWorksheetProblem {
  question: string;
  answer?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface LessonImage {
  description: string;
  url?: string;
  alt: string;
}

export interface InteractiveExercise {
  id: string;
  type: 'drag-and-drop' | 'fill-in-the-blank' | 'matching' | 'sequence';
  title: string;
  description: string;
  data: any; // Specific data structure based on exercise type
}

export interface VideoReference {
  title: string;
  description: string;
  url: string;
  durationMinutes: number;
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
