
import { useEffect, useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { QuizQuestion, QuizResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Award, RotateCcw, BookOpen } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { AchievementBadge } from './AchievementBadge';
import { generateQuiz } from '@/utils/geminiAPI';
import { toast } from 'sonner';

export function Quiz() {
  const { student, selectedSubject, selectedTopic, apiKey, setStep, addAchievement } = useStudent();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (student && selectedSubject && selectedTopic && apiKey) {
      generateQuiz(apiKey, student, selectedSubject, selectedTopic)
        .then((response) => {
          if (response.error) {
            toast.error(response.error);
            return;
          }
          
          setQuestions(response.content as QuizQuestion[]);
          setAnswers(new Array((response.content as QuizQuestion[]).length).fill(''));
        })
        .catch((error) => {
          console.error('Error generating quiz:', error);
          toast.error('Failed to generate quiz. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [student, selectedSubject, selectedTopic, apiKey]);

  const handleAnswerChange = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
    
    const score = (correctCount / questions.length) * 100;
    
    // Generate feedback based on score
    let feedback = '';
    if (score >= 90) {
      feedback = 'Outstanding! You have an excellent understanding of this topic.';
    } else if (score >= 75) {
      feedback = 'Great job! You have a good grasp of the material.';
    } else if (score >= 60) {
      feedback = 'Good effort! Keep practicing to strengthen your understanding.';
    } else {
      feedback = 'Keep learning! Review the lesson and try again to improve your score.';
    }
    
    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      score: score,
      feedback: feedback
    };
    
    setQuizResult(result);
    
    // Award achievement based on score
    if (score >= 80) {
      addAchievement({
        id: 'quiz-master',
        title: 'Quiz Master',
        description: 'You scored 80% or higher on a quiz!',
        icon: '🏆',
        earned: true
      });
    } else if (score >= 50) {
      addAchievement({
        id: 'quiz-completed',
        title: 'Quiz Completed',
        description: 'You completed your first quiz!',
        icon: '✅',
        earned: true
      });
    }
    
    setIsSubmitting(false);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(''));
    setQuizResult(null);
  };

  const handleReturnToLesson = () => {
    setStep('lesson');
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-8">
              <AnimatedCharacter expression="thinking" />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Preparing Your Quiz</h2>
              <p className="text-muted-foreground">
                Creating questions based on what you've learned...
              </p>
            </div>
            <div className="space-y-6 max-w-2xl mx-auto">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <AnimatedCharacter expression="default" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Unable to Generate Quiz</h2>
            <p className="mb-6">There was a problem creating your quiz. Please try again or return to the lesson.</p>
            <div className="flex justify-center">
              <Button onClick={handleReturnToLesson}>
                <BookOpen className="h-4 w-4 mr-2" />
                Return to Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="w-full shadow-lg border-2 border-primary/10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <AnimatedCharacter 
                expression={quizResult.score >= 60 ? "excited" : "thinking"} 
              />
            </div>
            <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
            <CardDescription>
              Let's see how well you understood the material
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2 px-6">
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="text-6xl font-bold text-primary">{Math.round(quizResult.score)}%</div>
                <p className="text-muted-foreground">Your Score</p>
              </div>
              
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="flex justify-center mb-1">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-3xl font-semibold">{quizResult.correctAnswers}</div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-1">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-3xl font-semibold">{quizResult.incorrectAnswers}</div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-1">
                    <Award className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="text-3xl font-semibold">{quizResult.totalQuestions}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="text-center font-medium">{quizResult.feedback}</p>
            </div>
            
            <div className="mt-8">
              {quizResult.score >= 80 && (
                <div className="flex justify-center mb-6">
                  <AchievementBadge 
                    title="Quiz Master" 
                    description="You scored 80% or higher on a quiz!" 
                    icon="🏆" 
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-0 pb-6">
            <Button 
              variant="outline" 
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Quiz
            </Button>
            <Button 
              onClick={handleReturnToLesson}
              className="w-full sm:w-auto"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Return to Lesson
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReturnToLesson}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Lesson
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          
          <CardTitle className="text-xl sm:text-2xl mt-4">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-2 pb-6">
          <div className="space-y-4">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <RadioGroup 
                value={answers[currentQuestionIndex]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 rounded-md border hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer font-normal text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'true-false' && currentQuestion.options && (
              <RadioGroup 
                value={answers[currentQuestionIndex]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 rounded-md border hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer font-normal text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'short-answer' && (
              <div className="space-y-2">
                <Label htmlFor="short-answer">Your Answer:</Label>
                <Input
                  id="short-answer"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestionIndex]?.toString() || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              </div>
            )}
            
            {showExplanation && (
              <div className="mt-4 bg-secondary/30 p-4 rounded-lg border border-secondary">
                <h3 className="font-medium mb-1">Explanation:</h3>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between pt-0 pb-4">
          <Button 
            variant="ghost" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowExplanation(!showExplanation)}
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestionIndex]}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
