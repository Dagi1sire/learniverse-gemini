
import { Card, CardContent } from '@/components/ui/card';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ 
  title, 
  description, 
  icon, 
  size = 'md' 
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: {
      card: 'max-w-[180px]',
      icon: 'text-3xl',
      title: 'text-sm',
      description: 'text-xs'
    },
    md: {
      card: 'max-w-[250px]',
      icon: 'text-5xl',
      title: 'text-base',
      description: 'text-xs'
    },
    lg: {
      card: 'max-w-[300px]',
      icon: 'text-6xl',
      title: 'text-lg',
      description: 'text-sm'
    }
  };

  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-primary/10 overflow-hidden ${sizeClasses[size].card}`}>
      <CardContent className="p-4 text-center">
        <div className={`${sizeClasses[size].icon} mb-2 animate-pulse-subtle`}>{icon}</div>
        <h3 className={`font-bold ${sizeClasses[size].title}`}>{title}</h3>
        <p className={`text-muted-foreground ${sizeClasses[size].description}`}>{description}</p>
      </CardContent>
    </Card>
  );
}
