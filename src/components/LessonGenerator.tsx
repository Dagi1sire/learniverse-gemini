import { useEffect, useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { LessonContent, LessonImage, LessonWorksheet, LessonSection } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Book, FilePlus, Play, List, Award, GraduationCap, Brain, AlertCircle, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { generateLesson } from '@/utils/geminiAPI';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
export function LessonGenerator() {
  const {
    student,
    selectedSubject,
    selectedTopic,
    apiKey,
    setStep,
    addAchievement,
    selectedProviders
  } = useStudent();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intro');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  useEffect(() => {
    if (!student || !selectedSubject || !selectedTopic) {
      setError('Missing required information. Please go back and complete all steps.');
      setIsLoading(false);
      return;
    }
    if (!apiKey) {
      setError('No API key provided. Please go back and enter your API key.');
      setIsLoading(false);
      return;
    }
    console.log('LessonGenerator - Starting lesson generation with:', {
      student: student?.name,
      subject: selectedSubject?.name,
      topic: selectedTopic?.name,
      apiKey: apiKey ? 'API Key present' : 'No API Key',
      providers: selectedProviders
    });
    setIsLoading(true);
    setError(null);

    // Use the first selected provider
    const provider = selectedProviders.length > 0 ? selectedProviders[0] : 'gemini';
    generateLesson(apiKey, student, selectedSubject, selectedTopic, provider).then(response => {
      console.log('Lesson generation response:', response);
      if (response.error) {
        console.error('Error in lesson generation:', response.error);
        setError(response.error);
        toast.error(`Error: ${response.error}`);
        return;
      }
      if (!response.content || Object.keys(response.content).length === 0) {
        setError('Received empty lesson content. Please try again.');
        toast.error('Received empty lesson content');
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
      toast.success('Lesson generated successfully!');
    }).catch(error => {
      console.error('Exception in lesson generation:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to generate lesson. Please try again.');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [student, selectedSubject, selectedTopic, apiKey, addAchievement, selectedProviders]);
  const handleQuizStart = () => {
    setStep('quiz');
  };
  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompletedSections = [...completedSections, sectionId];
      setCompletedSections(newCompletedSections);

      // Calculate progress percentage
      if (lesson) {
        // +2 for intro and summary
        const totalSections = lesson.sections.length + 2;
        const newProgress = Math.round(newCompletedSections.length / totalSections * 100);
        setProgress(newProgress);

        // Award achievement if completed all sections
        if (newCompletedSections.length === totalSections) {
          addAchievement({
            id: 'completed-lesson',
            title: 'Knowledge Master',
            description: `Completed the entire ${lesson.title} lesson!`,
            icon: '🏆',
            earned: true
          });
          toast.success("Congratulations! You've completed the entire lesson!");
        }
      }
    }
  };
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => <p key={index} className="mb-4">{paragraph}</p>);
  };
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);

    // Re-attempt to generate the lesson
    if (student && selectedSubject && selectedTopic && apiKey) {
      const provider = selectedProviders.length > 0 ? selectedProviders[0] : 'gemini';
      generateLesson(apiKey, student, selectedSubject, selectedTopic, provider).then(response => {
        if (response.error) {
          setError(response.error);
          toast.error(`Error: ${response.error}`);
          return;
        }
        setLesson(response.content as LessonContent);
        toast.success('Lesson generated successfully!');
      }).catch(error => {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        toast.error('Failed to generate lesson. Please try again.');
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setError('Missing required information. Please go back and complete all steps.');
      setIsLoading(false);
    }
  };

  // Interactive activity component
  const InteractiveActivity = ({
    section
  }: {
    section: LessonSection;
  }) => {
    const [showSolution, setShowSolution] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    if (!section.activity) return null;
    const checkAnswer = () => {
      setShowSolution(true);

      // Simple check - just see if the user attempted an answer
      if (userAnswer.trim().length > 0) {
        setIsCorrect(true);
        toast.success("Great effort! Check the solution to see how you did.");
      } else {
        setIsCorrect(false);
        toast.error("Please try answering before checking the solution.");
      }
    };
    return <div className="bg-accent/20 p-6 rounded-lg my-4 border border-accent animate-fade-in">
        <h3 className="font-medium text-lg mb-3">Try It Yourself:</h3>
        <p className="mb-4">{section.activity.description}</p>
        
        <div className="mb-4">
          <textarea className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary" rows={3} placeholder="Enter your answer here..." value={userAnswer} onChange={e => setUserAnswer(e.target.value)} disabled={showSolution} />
        </div>
        
        {!showSolution ? <Button onClick={checkAnswer}>Check Answer</Button> : <div className="mt-4 bg-background p-4 rounded-md border">
            <h4 className="font-medium mb-2">Solution:</h4>
            <div className="pl-4 border-l-2 border-primary/30">
              {section.activity.solution}
            </div>
          </div>}
        
        {isCorrect !== null && <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? "Great job attempting this problem! Compare your answer with the solution." : "Please try answering the question before viewing the solution."}
          </div>}
      </div>;
  };
  if (isLoading) {
    return <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-8">
              <AnimatedCharacter expression="thinking" />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Generating Your Lesson</h2>
              <p className="text-muted-foreground">
                Creating a personalized interactive lesson just for you...
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
      </div>;
  }
  if (error) {
    return <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-destructive/10">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <AnimatedCharacter expression="sad" />
            </div>
            <div className="text-destructive mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Unable to Generate Lesson</h2>
            <p className="mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" onClick={() => setStep('apiKey')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change API Key
              </Button>
              <Button onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  if (!lesson) {
    return <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <AnimatedCharacter expression="default" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Unable to Generate Lesson</h2>
            <p className="mb-6">There was a problem creating your lesson. Please try again.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setStep('apiKey')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  const renderWorksheets = (worksheets: LessonWorksheet[] | undefined) => {
    if (!worksheets || worksheets.length === 0) {
      return <div className="text-center py-8">
          <p className="text-muted-foreground">No worksheets available for this lesson.</p>
        </div>;
    }
    return <div className="space-y-8">
        {worksheets.map((worksheet, index) => <div key={index} className="border rounded-lg p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-2">{worksheet.title}</h3>
            <p className="text-muted-foreground mb-4">{worksheet.description}</p>
            
            <div className="space-y-4">
              {worksheet.problems.map((problem, problemIndex) => <div key={problemIndex} className="border p-4 rounded-md bg-background">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary font-semibold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {problemIndex + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{problem.question}</p>
                      
                      {problem.difficulty && <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${problem.difficulty === 'easy' ? 'bg-green-100 text-green-700' : problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </span>
                        </div>}
                      
                      {problem.answer && <details className="mt-3">
                          <summary className="cursor-pointer text-primary font-medium">View Answer</summary>
                          <div className="mt-2 pl-3 border-l-2 border-primary/20">
                            {problem.answer}
                          </div>
                        </details>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>)}
      </div>;
  };
  const renderImages = (images: LessonImage[] | undefined) => {
    if (!images || images.length === 0) {
      return <div className="text-center py-8">
          <p className="text-muted-foreground">No images available for this lesson.</p>
        </div>;
    }
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => <div key={index} className="border rounded-lg overflow-hidden bg-card/50">
            {image.url ? <img src={image.url} alt={image.alt} className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-secondary/20 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>}
            <div className="p-4">
              <p className="text-sm">{image.description}</p>
            </div>
          </div>)}
      </div>;
  };
  return <div className="container max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => setStep('apiKey')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()} className="hidden sm:flex">
            <FilePlus className="h-4 w-4 mr-2" />
            Print Lesson
          </Button>
          <Button onClick={handleQuizStart}>
            <Play className="h-4 w-4 mr-2" />
            Take Quiz
          </Button>
        </div>
      </div>
      
      {/* Progress tracking bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Your progress</span>
          <span className="text-sm font-medium">{progress}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
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
                <Button variant={activeTab === 'intro' ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => {
                setActiveTab('intro');
                markSectionComplete('intro');
              }}>
                  <div className="flex items-center w-full">
                    <Book className="h-4 w-4 mr-2" />
                    <span className="flex-grow text-left">Introduction</span>
                    {completedSections.includes('intro') && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </Button>
                
                {lesson.sections.map((section, index) => <Button key={index} variant={activeTab === `section-${index}` ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => {
                setActiveTab(`section-${index}`);
                setCurrentSectionIndex(index);
                markSectionComplete(`section-${index}`);
              }}>
                    <div className="flex items-center w-full">
                      <List className="h-4 w-4 mr-2" />
                      <span className="flex-grow text-left truncate">{section.title}</span>
                      {completedSections.includes(`section-${index}`) && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </Button>)}
                
                <Button variant={activeTab === 'summary' ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => {
                setActiveTab('summary');
                markSectionComplete('summary');
              }}>
                  <div className="flex items-center w-full">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span className="flex-grow text-left">Summary</span>
                    {completedSections.includes('summary') && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </Button>
                
                {lesson.worksheets && lesson.worksheets.length > 0 && <Button variant={activeTab === 'worksheets' ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => setActiveTab('worksheets')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Worksheets
                  </Button>}
                
                {lesson.images && lesson.images.length > 0 && <Button variant={activeTab === 'images' ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => setActiveTab('images')}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Images
                  </Button>}
                
                <Button variant={activeTab === 'related' ? 'default' : 'ghost'} className="w-full justify-start" onClick={() => setActiveTab('related')}>
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
                  A personalized Khan Academy-style lesson for {student?.name}, Grade {student?.grade}
                </p>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="intro" className="animate-fade-in space-y-4">
                    <div className="prose max-w-none">
                      {renderContent(lesson.introduction)}
                    </div>
                    
                    {lesson.images && lesson.images.length > 0 && lesson.images[0].url && <div className="my-6">
                        <img src={lesson.images[0].url} alt={lesson.images[0].alt} className="rounded-md max-h-96 mx-auto" />
                      </div>}
                    
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => {
                      setActiveTab(`section-0`);
                      setCurrentSectionIndex(0);
                      markSectionComplete(`section-0`);
                    }}>
                        Start Learning
                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {lesson.sections.map((section, index) => <TabsContent key={index} value={`section-${index}`} className="animate-fade-in space-y-4">
                      <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                      
                      <div className="prose max-w-none">
                        {renderContent(section.content)}
                      </div>
                      
                      {section.example && <div className="bg-secondary/50 p-4 rounded-lg my-6 border-l-4 border-primary">
                          <h3 className="font-medium mb-2 text-lg">Example:</h3>
                          <div className="space-y-2">
                            {section.example.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                          </div>
                        </div>}
                      
                      {/* Interactive activity component */}
                      {section.activity && <InteractiveActivity section={section} />}
                      
                      <div className="flex justify-between mt-8 pt-4 border-t">
                        <Button variant="outline" onClick={() => {
                      if (index === 0) {
                        setActiveTab('intro');
                        markSectionComplete('intro');
                      } else {
                        setActiveTab(`section-${index - 1}`);
                        setCurrentSectionIndex(index - 1);
                        markSectionComplete(`section-${index - 1}`);
                      }
                    }}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        
                        <Button onClick={() => {
                      if (index === lesson.sections.length - 1) {
                        setActiveTab('summary');
                        markSectionComplete('summary');
                      } else {
                        setActiveTab(`section-${index + 1}`);
                        setCurrentSectionIndex(index + 1);
                        markSectionComplete(`section-${index + 1}`);
                      }
                    }} className="bg-primary hover:bg-primary/90">
                          Next
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Button>
                      </div>
                    </TabsContent>)}
                  
                  <TabsContent value="summary" className="animate-fade-in space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                    <div className="prose max-w-none">
                      {renderContent(lesson.summary)}
                    </div>
                    
                    <div className="bg-primary/10 p-6 rounded-lg my-6 border border-primary/20">
                      <h3 className="font-medium text-lg mb-4">What you've learned:</h3>
                      <ul className="space-y-3 pl-5 list-disc">
                        {lesson.sections.map((section, index) => <li key={index} className="text-primary-foreground">
                            <span className="font-medium">{section.title}</span>
                          </li>)}
                      </ul>
                    </div>
                    
                    <div className="flex justify-center mt-8">
                      <Button onClick={handleQuizStart} size="lg" className="button-hover">
                        <Award className="h-5 w-5 mr-2" />
                        Take the Quiz to Test Your Knowledge
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {lesson.worksheets && <TabsContent value="worksheets" className="animate-fade-in space-y-4">
                      <h2 className="text-2xl font-semibold mb-4">Worksheets</h2>
                      <p className="mb-4">Practice what you've learned with these worksheets:</p>
                      {renderWorksheets(lesson.worksheets)}
                    </TabsContent>}
                  
                  {lesson.images && <TabsContent value="images" className="animate-fade-in space-y-4">
                      <h2 className="text-2xl font-semibold mb-4">Educational Images</h2>
                      <p className="mb-4">Visual aids to help understand {selectedTopic?.name}:</p>
                      {renderImages(lesson.images)}
                    </TabsContent>}
                  
                  <TabsContent value="related" className="animate-fade-in space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Related Topics</h2>
                    <p>Explore these related topics to expand your understanding:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {lesson.relatedTopics.map((topic, index) => <Card key={index} className="subject-card">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg">{topic}</h3>
                            <p className="text-sm text-muted-foreground">
                              Continue your learning journey
                            </p>
                          </CardContent>
                        </Card>)}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}