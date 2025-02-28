
import { useEffect, useState } from 'react';
import { StudentProvider, useStudent } from '@/context/StudentContext';
import { OnboardingForm } from '@/components/OnboardingForm';
import { SubjectSelection } from '@/components/SubjectSelection';
import { TopicSelection } from '@/components/TopicSelection';
import { APIKeyInput } from '@/components/APIKeyInput';
import { LessonGenerator } from '@/components/LessonGenerator';
import { Quiz } from '@/components/Quiz';
import { toast } from 'sonner';

function LearningApp() {
  const { student, selectedSubject, step, setStep } = useStudent();
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  
  // Debug information
  useEffect(() => {
    // Log the current state for debugging
    console.log('Current state:', { student, selectedSubject, step });
    
    if (!student && step !== 'onboarding') {
      setDebugMessage('No student information. Please complete the onboarding first.');
    } else if (!selectedSubject && step !== 'onboarding' && step !== 'subject') {
      setDebugMessage('No subject selected. Please select a subject first.');
    } else {
      setDebugMessage(null);
    }
  }, [student, selectedSubject, step]);
  
  return (
    <div className="min-h-screen">
      {debugMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          {debugMessage}
        </div>
      )}
      
      {step === 'onboarding' && <OnboardingForm />}
      {step === 'subject' && <SubjectSelection />}
      {step === 'topic' && <TopicSelection />}
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
