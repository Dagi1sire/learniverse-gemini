
import { useState } from 'react';
import { useStudent } from '@/context/StudentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Key, Lock, Loader2 } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { validateApiKey } from '@/utils/geminiAPI';
import { toast } from 'sonner';

export function APIKeyInput() {
  const { setApiKey, setStep, addAchievement } = useStudent();
  const [key, setKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      toast.error('Please enter your Gemini API key');
      return;
    }
    
    setIsValidating(true);
    
    try {
      const isValid = await validateApiKey(key);
      
      if (isValid) {
        setApiKey(key);
        
        // Add achievement
        addAchievement({
          id: 'api-connected',
          title: 'AI Connected',
          description: 'You connected to the Gemini AI!',
          icon: '🤖',
          earned: true
        });
        
        setStep('lesson');
      } else {
        toast.error('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      toast.error('Error validating API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  // For demo purposes, let's add a function to use a demo key
  const useDemoKey = () => {
    setKey('demo-api-key-for-testing');
    toast.info('Using demo API key for testing purposes');
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter expression="thinking" />
          </div>
          <CardTitle className="text-2xl font-bold">Connect Gemini AI</CardTitle>
          <CardDescription>
            Enter your Gemini API key to power the learning experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Gemini API Key
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full pr-10"
                    autoFocus
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is securely handled and never stored on our servers
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full button-hover"
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Connect & Continue'
                )}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={useDemoKey}
              >
                Use Demo Key (For Testing)
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-0 pb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setStep('topic')}
            className="text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
