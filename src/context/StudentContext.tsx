
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Subject, Topic, Achievement } from '@/types';
import { toast } from 'sonner';

interface StudentContextType {
  student: Student | null;
  setStudent: (student: Student) => void;
  selectedSubject: Subject | null;
  setSelectedSubject: (subject: Subject | null) => void;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => void;
  resetOnboarding: () => void;
  step: 'onboarding' | 'subject' | 'topic' | 'apiKey' | 'lesson' | 'quiz';
  setStep: (step: 'onboarding' | 'subject' | 'topic' | 'apiKey' | 'lesson' | 'quiz') => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [step, setStep] = useState<'onboarding' | 'subject' | 'topic' | 'apiKey' | 'lesson' | 'quiz'>('onboarding');

  const addAchievement = (achievement: Achievement) => {
    setAchievements(prev => {
      // Check if achievement already exists
      if (prev.find(a => a.id === achievement.id)) {
        return prev;
      }
      
      // Show toast notification
      toast.success(`Achievement unlocked: ${achievement.title}`, {
        description: achievement.description,
        duration: 5000,
      });
      
      return [...prev, achievement];
    });
  };

  const resetOnboarding = () => {
    setStudent(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setStep('onboarding');
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        selectedSubject,
        setSelectedSubject,
        selectedTopic,
        setSelectedTopic,
        apiKey,
        setApiKey,
        achievements,
        addAchievement,
        resetOnboarding,
        step,
        setStep
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
