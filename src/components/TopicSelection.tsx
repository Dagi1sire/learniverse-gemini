
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookText, Star, Award } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';

// Topics for each subject
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

export function TopicSelection() {
  const { student, selectedSubject, setSelectedTopic, setStep, addAchievement } = useStudent();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!selectedSubject) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AnimatedCharacter expression="sad" />
            </div>
            <CardTitle className="text-2xl font-bold">No Subject Selected</CardTitle>
            <CardDescription>Please go back and select a subject first</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-2 pb-4">
            <Button 
              variant="default" 
              onClick={() => setStep('subject')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Select a Subject
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const subjectTopics = topics[selectedSubject.id] || [];

  const handleTopicSelect = (topic: Topic) => {
    setSelectedId(topic.id);
    
    // Add a slight delay for visual feedback before proceeding
    setTimeout(() => {
      setSelectedTopic(topic);
      
      // Add achievement
      addAchievement({
        id: 'topic-selected',
        title: 'Topic Navigator',
        description: `You selected your first topic: ${topic.name}!`,
        icon: '📝',
        earned: true
      });
      
      setStep('apiKey');
    }, 500);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter expression="excited" />
          </div>
          <CardTitle className="text-2xl font-bold">Choose a Topic in {selectedSubject.name}</CardTitle>
          <CardDescription>
            {student?.name ? `Good choice, ${student.name}! ` : ''}
            Select a topic you'd like to learn about
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectTopics.map((topic) => {
              const DifficultyIcon = topic.difficulty === 'beginner' ? BookText : topic.difficulty === 'intermediate' ? Star : Award;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className={`text-left p-4 rounded-lg border-2 ${
                    selectedSubject.color
                  } transition-all hover:scale-[1.02] ${
                    selectedId === topic.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full w-10 h-10 flex items-center justify-center bg-white/80">
                      <DifficultyIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{topic.name}</h3>
                      <p className="text-sm opacity-80">{topic.description}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          topic.difficulty === 'beginner' 
                            ? 'bg-green-100 text-green-800' 
                            : topic.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {topic.difficulty === 'beginner' ? 'Beginner' : topic.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep('subject')}
            className="text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
