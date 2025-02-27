
import { useEffect, useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { LessonContent } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Book, FilePlus, Play, List, Award, GraduationCap, Brain } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { generateLesson } from '@/utils/geminiAPI';
import { toast } from 'sonner';

export function LessonGenerator() {
  const { student, selectedSubject, selectedTopic, apiKey, setStep, addAchievement } = useStudent();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intro');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    if (student && selectedSubject && selectedTopic && apiKey) {
      generateLesson(apiKey, student, selectedSubject, selectedTopic)
        .then((response) => {
          if (response.error) {
            toast.error(response.error);
            return;
          }
          
          setLesson(response.content as LessonContent);
          
          // Add achievement
          addAchievement({
            id: 'first-lesson',
            title: 'First Lesson Completed',
            description: `You completed your first lesson on ${selectedTopic.name}!`,
            icon: '📘',
            earned: true
          });
        })
        .catch((error) => {
          console.error('Error generating lesson:', error);
          toast.error('Failed to generate lesson. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [student, selectedSubject, selectedTopic, apiKey, addAchievement]);

  const handleQuizStart = () => {
    setStep('quiz');
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-8">
              <AnimatedCharacter expression="thinking" />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Generating Your Lesson</h2>
              <p className="text-muted-foreground">
                Creating a personalized lesson just for you...
              </p>
            </div>
            <div className="space-y-6 max-w-2xl mx-auto">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <AnimatedCharacter expression="default" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Unable to Generate Lesson</h2>
            <p className="mb-6">There was a problem creating your lesson. Please try again.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setStep('topic')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Topics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => setStep('topic')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.print()}
            className="hidden sm:flex"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Print Lesson
          </Button>
          <Button onClick={handleQuizStart}>
            <Play className="h-4 w-4 mr-2" />
            Take Quiz
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-6 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-center mb-4 mt-2">
                <AnimatedCharacter size="sm" />
              </div>
              
              <h3 className="font-semibold text-lg mb-4 text-center">Lesson Contents</h3>
              
              <nav className="space-y-1">
                <Button 
                  variant={activeTab === 'intro' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('intro')}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Introduction
                </Button>
                
                {lesson.sections.map((section, index) => (
                  <Button 
                    key={index}
                    variant={activeTab === `section-${index}` ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(`section-${index}`);
                      setCurrentSectionIndex(index);
                    }}
                  >
                    <List className="h-4 w-4 mr-2" />
                    {section.title}
                  </Button>
                ))}
                
                <Button 
                  variant={activeTab === 'summary' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('summary')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Summary
                </Button>
                
                <Button 
                  variant={activeTab === 'related' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('related')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Related Topics
                </Button>
              </nav>
              
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={handleQuizStart}>
                  <Award className="h-4 w-4 mr-2" />
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="shadow-lg border-2 border-primary/10">
            <CardContent className="p-6">
              <div className="mb-5">
                <h1 className="text-3xl font-bold mb-2 text-primary">{lesson.title}</h1>
                <p className="text-muted-foreground mb-6">
                  A personalized lesson for {student?.name}, Grade {student?.grade}
                </p>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="intro" className="animate-fade-in space-y-4">
                    <div className="prose max-w-none">
                      {renderContent(lesson.introduction)}
                    </div>
                  </TabsContent>
                  
                  {lesson.sections.map((section, index) => (
                    <TabsContent key={index} value={`section-${index}`} className="animate-fade-in space-y-4">
                      <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                      <div className="prose max-w-none">
                        {renderContent(section.content)}
                      </div>
                      
                      {section.example && (
                        <div className="bg-secondary/50 p-4 rounded-lg my-4 border-l-4 border-primary">
                          <h3 className="font-medium mb-2">Example:</h3>
                          <p>{section.example}</p>
                        </div>
                      )}
                      
                      {section.activity && (
                        <div className="bg-accent/20 p-4 rounded-lg my-4 border border-accent">
                          <h3 className="font-medium mb-2">Activity:</h3>
                          <p>{section.activity.description}</p>
                          
                          {section.activity.solution && (
                            <details className="mt-3">
                              <summary className="cursor-pointer font-medium text-primary">View Solution</summary>
                              <p className="mt-2 pl-4 border-l-2 border-primary/30">
                                {section.activity.solution}
                              </p>
                            </details>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-6 pt-4">
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            if (index === 0) {
                              setActiveTab('intro');
                            } else {
                              setActiveTab(`section-${index - 1}`);
                              setCurrentSectionIndex(index - 1);
                            }
                          }}
                          disabled={index === 0}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            if (index === lesson.sections.length - 1) {
                              setActiveTab('summary');
                            } else {
                              setActiveTab(`section-${index + 1}`);
                              setCurrentSectionIndex(index + 1);
                            }
                          }}
                        >
                          Next
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                  
                  <TabsContent value="summary" className="animate-fade-in space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                    <div className="prose max-w-none">
                      {renderContent(lesson.summary)}
                    </div>
                    
                    <div className="bg-primary/10 p-4 rounded-lg my-6 border border-primary/20">
                      <h3 className="font-medium mb-2">What you've learned:</h3>
                      <ul className="space-y-2 pl-5 list-disc">
                        {lesson.sections.map((section, index) => (
                          <li key={index}>{section.title}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <Button onClick={handleQuizStart} size="lg" className="button-hover">
                        <Award className="h-5 w-5 mr-2" />
                        Take the Quiz to Test Your Knowledge
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="related" className="animate-fade-in space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Related Topics</h2>
                    <p>Explore these related topics to expand your understanding:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {lesson.relatedTopics.map((topic, index) => (
                        <Card key={index} className="subject-card">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg">{topic}</h3>
                            <p className="text-sm text-muted-foreground">
                              Continue your learning journey
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
