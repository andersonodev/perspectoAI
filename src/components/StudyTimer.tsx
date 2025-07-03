import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Target,
  Coffee,
  BookOpen,
  Timer,
  TrendingUp
} from 'lucide-react';

interface StudyTimerProps {
  className?: string;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        setSessionsCompleted(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        setMode('work');
        setTimeLeft(25 * 60); // Back to 25 minutes
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <Card className={`feature-card ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <Timer className="h-5 w-5 text-primary" />
          Timer Pomodoro
        </CardTitle>
        <div className="flex justify-center gap-2">
          <Badge 
            variant={mode === 'work' ? 'default' : 'secondary'}
            className={mode === 'work' ? 'bg-primary text-white' : 'bg-secondary text-white'}
          >
            {mode === 'work' ? (
              <>
                <BookOpen className="h-3 w-3 mr-1" />
                Foco
              </>
            ) : (
              <>
                <Coffee className="h-3 w-3 mr-1" />
                Pausa
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {/* Timer Display */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-muted flex items-center justify-center relative overflow-hidden">
            <div 
              className={`absolute inset-0 rounded-full ${mode === 'work' ? 'bg-primary/20' : 'bg-secondary/20'}`}
              style={{
                background: `conic-gradient(${mode === 'work' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} ${progress * 3.6}deg, transparent 0deg)`
              }}
            />
            <div className="relative z-10 text-2xl font-bold text-foreground">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={toggleTimer}
            size="sm"
            className={mode === 'work' ? 'student-button' : 'excellence-button'}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{sessionsCompleted} sessões</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{(sessionsCompleted * 25)} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimer;