
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TopicSelection() {
  const { student, selectedSubject, setSelectedTopic, setStep, addAchievement } = useStudent();
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleTopicSubmit = () => {
    if (!customTopic.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Create a custom topic object
    const topic: Topic = {
      id: customTopic.toLowerCase().replace(/\s+/g, '-'),
      subjectId: selectedSubject.id,
      name: customTopic.trim(),
      description: `Custom topic about ${customTopic} in ${selectedSubject.name}`,
      difficulty: 'beginner' // Default difficulty
    };
    
    // Add achievement
    addAchievement({
      id: 'custom-topic-created',
      title: 'Topic Explorer',
      description: `You created a custom topic: ${topic.name}!`,
      icon: '🔍',
      earned: true
    });
    
    // Set the selected topic and move to the next step
    setTimeout(() => {
      setSelectedTopic(topic);
      setStep('apiKey');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter expression="excited" />
          </div>
          <CardTitle className="text-2xl font-bold">What would you like to learn about in {selectedSubject.name}?</CardTitle>
          <CardDescription>
            {student?.name ? `${student.name}, enter any topic you're interested in!` : 'Enter any topic you\'re interested in!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Your Topic</Label>
              <div className="flex space-x-2">
                <Input
                  id="topic"
                  placeholder={`e.g. Fractions, Algebra, Geometry...`}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customTopic.trim()) {
                      handleTopicSubmit();
                    }
                  }}
                  className={`flex-grow ${selectedSubject.color}`}
                />
                <Button 
                  type="button" 
                  onClick={handleTopicSubmit} 
                  disabled={!customTopic.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2">⌛</span>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <span>Submit</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Be specific with your topic to get the most relevant lesson. For example, instead of "Math", try "Adding Fractions" or "Quadratic Equations".
              </p>
            </div>
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
