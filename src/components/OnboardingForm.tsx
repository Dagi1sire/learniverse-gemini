import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Sparkles } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { toast } from 'sonner';

export function OnboardingForm() {
  const { setStudent, setStep, addAchievement } = useStudent();
  const [name, setName] = useState('');
  const [age, setAge] = useState(10);
  const [grade, setGrade] = useState(5);
  const [interest, setInterest] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [formStep, setFormStep] = useState(0);

  const handleAddInterest = () => {
    if (interest.trim() && !interests.includes(interest.trim())) {
      setInterests(prev => [...prev, interest.trim()]);
      setInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(prev => prev.filter(i => i !== interestToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleAgeChange = (value: number) => {
    const newAge = Math.min(Math.max(value, 5), 18);
    setAge(newAge);
  };

  const handleGradeChange = (value: number) => {
    const newGrade = Math.min(Math.max(value, 1), 12);
    setGrade(newGrade);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 0) {
      if (!name) {
        toast.error('Please enter your name');
        return;
      }
      setFormStep(1);
      return;
    }
    
    if (formStep === 1) {
      if (interests.length === 0) {
        toast.error('Please add at least one interest');
        return;
      }
      
      const student: Student = {
        name,
        age,
        grade,
        interests
      };
      
      setStudent(student);
      
      addAchievement({
        id: 'profile-created',
        title: 'Profile Created',
        description: 'You created your student profile!',
        icon: '🎓',
        earned: true
      });
      
      setStep('subject');
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to LearnIverse</CardTitle>
          <CardDescription>
            Let's personalize your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            {formStep === 0 ? (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="name">What's your name?</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">How old are you?</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="age-slider"
                      min={5}
                      max={18}
                      step={1}
                      value={[age]}
                      onValueChange={(value) => setAge(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="age"
                      type="number"
                      min={5}
                      max={18}
                      value={age}
                      onChange={(e) => handleAgeChange(parseInt(e.target.value) || 10)}
                      className="w-16 text-center"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade">What grade are you in?</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="grade-slider"
                      min={1}
                      max={12}
                      step={1}
                      value={[grade]}
                      onValueChange={(value) => setGrade(value[0])}
                      className="flex-1"
                    />
                    <Input
                      id="grade"
                      type="number"
                      min={1}
                      max={12}
                      value={grade}
                      onChange={(e) => handleGradeChange(parseInt(e.target.value) || 5)}
                      className="w-16 text-center"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="interests">What are you interested in?</Label>
                  <div className="flex gap-2">
                    <Input
                      id="interests"
                      placeholder="Add your interests"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                      autoFocus
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddInterest}
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map((item, index) => (
                      <Badge key={index} className="flex items-center gap-1 py-1.5 pl-3 pr-1.5">
                        {item}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full hover:bg-primary/20"
                          onClick={() => handleRemoveInterest(item)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6">
              <Button type="submit" className="w-full group relative overflow-hidden button-hover">
                <span className="relative z-10">
                  {formStep === 0 ? 'Next' : 'Start Learning'}
                </span>
                <span className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-100"></span>
                {formStep === 1 && (
                  <Sparkles className="h-4 w-4 ml-2 animate-pulse-subtle" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-0 pb-4">
          <p className="text-xs text-muted-foreground">
            {formStep === 0 
              ? 'Step 1 of 2: Basic Information' 
              : 'Step 2 of 2: Your Interests'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
