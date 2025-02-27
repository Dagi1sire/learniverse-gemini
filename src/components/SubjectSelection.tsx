
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Subject } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Calculator, Globe, Microscope, Palette, Music, Code } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';

const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Numbers, patterns, and problem-solving',
    icon: 'Calculator',
    color: 'bg-pink-100 border-pink-300 text-pink-600'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discover how the world works',
    icon: 'Microscope',
    color: 'bg-blue-100 border-blue-300 text-blue-600'
  },
  {
    id: 'english',
    name: 'English',
    description: 'Reading, writing, and communication',
    icon: 'BookOpen',
    color: 'bg-purple-100 border-purple-300 text-purple-600'
  },
  {
    id: 'history',
    name: 'History',
    description: 'Explore the past and its impact',
    icon: 'Globe',
    color: 'bg-amber-100 border-amber-300 text-amber-600'
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Express yourself through creativity',
    icon: 'Palette',
    color: 'bg-green-100 border-green-300 text-green-600'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Explore rhythm, melody, and sound',
    icon: 'Music',
    color: 'bg-teal-100 border-teal-300 text-teal-600'
  },
  {
    id: 'coding',
    name: 'Coding',
    description: 'Learn to program and build apps',
    icon: 'Code',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-600'
  }
];

const IconMap: Record<string, React.ElementType> = {
  'Calculator': Calculator,
  'Microscope': Microscope,
  'BookOpen': BookOpen,
  'Globe': Globe,
  'Palette': Palette,
  'Music': Music,
  'Code': Code
};

export function SubjectSelection() {
  const { student, setSelectedSubject, setStep, resetOnboarding, addAchievement } = useStudent();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedId(subject.id);
    
    // Add a slight delay for visual feedback before proceeding
    setTimeout(() => {
      setSelectedSubject(subject);
      
      // Add achievement
      addAchievement({
        id: 'subject-selected',
        title: 'Subject Explorer',
        description: `You selected your first subject: ${subject.name}!`,
        icon: '📚',
        earned: true
      });
      
      setStep('topic');
    }, 500);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter expression="happy" />
          </div>
          <CardTitle className="text-2xl font-bold">Choose a Subject</CardTitle>
          <CardDescription>
            {student?.name ? `Hello ${student.name}! ` : ''}
            Select a subject you'd like to learn about today
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const Icon = IconMap[subject.icon];
              
              return (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject)}
                  className={`text-left subject-card ${subject.color} ${
                    selectedId === subject.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="mb-3 p-2 rounded-full w-12 h-12 flex items-center justify-center bg-white/80">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">{subject.name}</h3>
                  <p className="text-sm opacity-80">{subject.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-4">
          <Button 
            variant="ghost" 
            onClick={resetOnboarding}
            className="text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
