
import { useEffect, useState } from 'react';

const characterExpressions = {
  default: "https://api.dicebear.com/7.x/thumbs/svg?seed=Felix&shirt=variant03&shirtColor=85c5f5&eyes=variant04&eyebrows=variant01&backgroundColor=b6e3f4",
  happy: "https://api.dicebear.com/7.x/thumbs/svg?seed=Felix&shirt=variant03&shirtColor=85c5f5&eyes=variant06&eyebrows=variant10&mouth=variant03&backgroundColor=b6e3f4",
  thinking: "https://api.dicebear.com/7.x/thumbs/svg?seed=Felix&shirt=variant03&shirtColor=85c5f5&eyes=variant07&eyebrows=variant06&mouth=variant08&backgroundColor=b6e3f4",
  excited: "https://api.dicebear.com/7.x/thumbs/svg?seed=Felix&shirt=variant03&shirtColor=85c5f5&eyes=variant10&eyebrows=variant10&mouth=variant02&backgroundColor=b6e3f4"
};

type CharacterExpression = keyof typeof characterExpressions;

interface AnimatedCharacterProps {
  expression?: CharacterExpression;
  size?: 'sm' | 'md' | 'lg';
  autoAnimate?: boolean;
}

export const AnimatedCharacter = ({ 
  expression = 'default', 
  size = 'md',
  autoAnimate = true 
}: AnimatedCharacterProps) => {
  const [currentExpression, setCurrentExpression] = useState<CharacterExpression>(expression);

  useEffect(() => {
    if (!autoAnimate) {
      setCurrentExpression(expression);
      return;
    }

    const expressions: CharacterExpression[] = ['default', 'happy', 'thinking', 'excited'];
    
    const intervalId = setInterval(() => {
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      setCurrentExpression(randomExpression);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [autoAnimate, expression]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden animate-bounce-subtle`}>
      <img
        src={characterExpressions[currentExpression]}
        alt="Learning Assistant"
        className="w-full h-full object-cover transition-opacity duration-300"
      />
    </div>
  );
};
