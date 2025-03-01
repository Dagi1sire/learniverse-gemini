
import { useState, useEffect } from 'react';
import { useStudent } from '@/context/StudentContext';
import { ApiProvider } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Key, ArrowRight, Check } from 'lucide-react';
import { AnimatedCharacter } from './AnimatedCharacter';
import { validateApiKey } from '@/utils/geminiAPI';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function APIKeyInput() {
  const { student, selectedSubject, selectedTopic, apiKey, setApiKey, setStep, addAchievement, selectedProviders, setSelectedProviders } = useStudent();
  const [isValidating, setIsValidating] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [currentProvider, setCurrentProvider] = useState<ApiProvider>('gemini');
  const [apiKeys, setApiKeys] = useState<Record<ApiProvider, string>>({
    gemini: '',
    deepseek: ''
  });

  // Load any saved API keys from localStorage on component mount
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini-api-key');
    const savedDeepseekKey = localStorage.getItem('deepseek-api-key');
    
    if (savedGeminiKey) {
      setApiKeys(prev => ({ ...prev, gemini: savedGeminiKey }));
    }
    
    if (savedDeepseekKey) {
      setApiKeys(prev => ({ ...prev, deepseek: savedDeepseekKey }));
    }
  }, []);

  const handleAddProvider = async () => {
    if (!tempApiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsValidating(true);

    try {
      // Validate the API key
      const isValid = await validateApiKey(tempApiKey);
      
      if (isValid) {
        // Save the API key for the current provider
        setApiKeys(prev => ({ ...prev, [currentProvider]: tempApiKey }));
        
        // Save to localStorage for future sessions
        localStorage.setItem(`${currentProvider}-api-key`, tempApiKey);
        
        // Add to selected providers
        if (!selectedProviders.includes(currentProvider)) {
          setSelectedProviders([...selectedProviders, currentProvider]);
        }
        
        // Reset the input
        setTempApiKey('');
        
        // Show success message
        toast.success(`${currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)} API key added successfully`);
        
        // Achievement for adding an API provider
        addAchievement({
          id: `api-provider-${currentProvider}`,
          title: 'AI Explorer',
          description: `You added a ${currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)} API key!`,
          icon: '🔑',
          earned: true
        });
      } else {
        toast.error(`Invalid ${currentProvider} API key. Please check and try again.`);
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error('Error validating API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleContinue = () => {
    // Check if at least one provider is selected
    if (selectedProviders.length === 0) {
      toast.error('Please add at least one API provider');
      return;
    }
    
    // Set the first provider's API key as the active one
    setApiKey(apiKeys[selectedProviders[0]]);
    
    // Move to the next step
    setStep('lesson');
  };

  const removeProvider = (provider: ApiProvider) => {
    setSelectedProviders(selectedProviders.filter(p => p !== provider));
    toast.info(`${provider.charAt(0).toUpperCase() + provider.slice(1)} API provider removed`);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="w-full shadow-lg border-2 border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter expression="happy" />
          </div>
          <CardTitle className="text-2xl font-bold">Connect Your AI Providers</CardTitle>
          <CardDescription>
            {student?.name 
              ? `${student.name}, add API keys for the AI providers you want to use for your learning experience.` 
              : 'Add API keys for the AI providers you want to use for your learning experience.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-secondary/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Why do we need API keys?</h3>
            <p className="text-sm text-muted-foreground">
              This app uses AI services to create personalized lessons and quizzes. Your API keys let us access these services while keeping your data private. We never store your keys on our servers.
            </p>
          </div>
          
          {/* Provider selection */}
          <div className="space-y-2">
            <Label htmlFor="provider-selection">Select AI Provider to Add</Label>
            <RadioGroup 
              value={currentProvider} 
              onValueChange={(value) => setCurrentProvider(value as ApiProvider)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              id="provider-selection"
            >
              <div className={`border rounded-lg p-3 ${currentProvider === 'gemini' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="gemini" id="gemini" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="gemini" className="font-medium cursor-pointer">Gemini API</Label>
                    <p className="text-sm text-muted-foreground">
                      Google's advanced multimodal AI model
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`border rounded-lg p-3 ${currentProvider === 'deepseek' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="deepseek" id="deepseek" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="deepseek" className="font-medium cursor-pointer">DeepSeek API</Label>
                    <p className="text-sm text-muted-foreground">
                      Advanced language model with strong reasoning capabilities
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {/* API key input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">{currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)} API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="password"
                placeholder={`Enter your ${currentProvider} API key`}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleAddProvider} 
                disabled={isValidating || !tempApiKey.trim()}
              >
                {isValidating ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">⌛</span>
                    <span>Validating...</span>
                  </div>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    <span>Add</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentProvider === 'gemini' ? (
                <>Get your Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></>
              ) : (
                <>Get your DeepSeek API key from <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DeepSeek Platform</a></>
              )}
            </p>
          </div>
          
          {/* Selected providers */}
          {selectedProviders.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Providers</Label>
              <div className="space-y-2">
                {selectedProviders.map((provider) => (
                  <div key={provider} className="flex items-center justify-between bg-secondary/20 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{provider.charAt(0).toUpperCase() + provider.slice(1)} API</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeProvider(provider)}
                      className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="font-semibold">Instructions:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Select an AI provider you want to add</li>
              <li>Enter your API key for that provider</li>
              <li>Click "Add" to validate and save the key</li>
              <li>Repeat for any other providers you want to use</li>
              <li>Click "Continue" when you're ready</li>
            </ol>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 pb-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep('topic')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={selectedProviders.length === 0}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
