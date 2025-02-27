
import { useEffect, useState } from 'react';
import { StudentProvider, useStudent } from '@/context/StudentContext';
import { OnboardingForm } from '@/components/OnboardingForm';
import { SubjectSelection } from '@/components/SubjectSelection';
import { APIKeyInput } from '@/components/APIKeyInput';
import { LessonGenerator } from '@/components/LessonGenerator';
import { Quiz } from '@/components/Quiz';
import { Topic } from '@/types';

// Topics for demo purposes
const topics: Record<string, Topic[]> = {
  math: [
    {
      id: 'fractions',
      subjectId: 'math',
      name: 'Fractions',
      description: 'Understanding parts of a whole',
      difficulty: 'beginner'
    },
    {
      id: 'algebra',
      subjectId: 'math',
      name: 'Basic Algebra',
      description: 'Introduction to variables and equations',
      difficulty: 'intermediate'
    }
  ],
  science: [
    {
      id: 'plants',
      subjectId: 'science',
      name: 'Plant Life Cycles',
      description: 'How plants grow, reproduce, and survive',
      difficulty: 'beginner'
    },
    {
      id: 'solarsystem',
      subjectId: 'science',
      name: 'The Solar System',
      description: 'Exploring the planets and our sun',
      difficulty: 'intermediate'
    }
  ],
  english: [
    {
      id: 'grammar',
      subjectId: 'english',
      name: 'Grammar Fundamentals',
      description: 'Building blocks of effective writing',
      difficulty: 'beginner'
    },
    {
      id: 'poetry',
      subjectId: 'english',
      name: 'Introduction to Poetry',
      description: 'Understanding rhythm, rhyme, and meaning',
      difficulty: 'intermediate'
    }
  ],
  history: [
    {
      id: 'ancient',
      subjectId: 'history',
      name: 'Ancient Civilizations',
      description: 'Exploring early human societies',
      difficulty: 'beginner'
    },
    {
      id: 'revolutions',
      subjectId: 'history',
      name: 'Industrial Revolution',
      description: 'How technology changed the world',
      difficulty: 'intermediate'
    }
  ],
  art: [
    {
      id: 'colors',
      subjectId: 'art',
      name: 'Color Theory',
      description: 'Understanding how colors work together',
      difficulty: 'beginner'
    },
    {
      id: 'drawing',
      subjectId: 'art',
      name: 'Basic Drawing Techniques',
      description: 'Learn to sketch and shade',
      difficulty: 'intermediate'
    }
  ],
  music: [
    {
      id: 'rhythm',
      subjectId: 'music',
      name: 'Rhythm Basics',
      description: 'Understanding beats and timing',
      difficulty: 'beginner'
    },
    {
      id: 'instruments',
      subjectId: 'music',
      name: 'Musical Instruments',
      description: 'Exploring different types of instruments',
      difficulty: 'intermediate'
    }
  ],
  coding: [
    {
      id: 'algorithms',
      subjectId: 'coding',
      name: 'Intro to Algorithms',
      description: 'Step-by-step problem solving',
      difficulty: 'beginner'
    },
    {
      id: 'webdev',
      subjectId: 'coding',
      name: 'Web Development Basics',
      description: 'Creating simple websites',
      difficulty: 'intermediate'
    }
  ]
};

function LearningApp() {
  const { student, selectedSubject, step, setStep, setSelectedTopic } = useStudent();
  
  // For demo purposes, automatically select a topic when a subject is chosen
  useEffect(() => {
    if (selectedSubject && step === 'subject') {
      const subjectTopics = topics[selectedSubject.id];
      if (subjectTopics && subjectTopics.length > 0) {
        // Select the first topic for the demo
        setSelectedTopic(subjectTopics[0]);
        setStep('apiKey');
      }
    }
  }, [selectedSubject, step, setSelectedTopic, setStep]);
  
  return (
    <div className="min-h-screen">
      {step === 'onboarding' && <OnboardingForm />}
      {step === 'subject' && <SubjectSelection />}
      {step === 'apiKey' && <APIKeyInput />}
      {step === 'lesson' && <LessonGenerator />}
      {step === 'quiz' && <Quiz />}
    </div>
  );
}

const Index = () => {
  return (
    <StudentProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-4 pb-16">
        <LearningApp />
      </div>
    </StudentProvider>
  );
};

export default Index;
