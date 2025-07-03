import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Target,
  Flame,
  Star,
  BookOpen,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';

interface ProgressTrackerProps {
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ className = "" }) => {
  const [weeklyGoal] = useState(20); // hours per week
  const [currentProgress] = useState(14); // current hours
  const [streak] = useState(5); // days in a row
  const [completedTasks] = useState(12);
  const [totalTasks] = useState(18);

  const progressPercentage = Math.min((currentProgress / weeklyGoal) * 100, 100);
  const taskProgress = Math.min((completedTasks / totalTasks) * 100, 100);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const studyDays = [false, true, true, true, true, true, false]; // Example data

  return (
    <Card className={`feature-card ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Progresso Semanal
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Weekly Goal Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Meta Semanal</span>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {currentProgress}h / {weeklyGoal}h
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0h</span>
            <span className="font-medium text-primary">{progressPercentage.toFixed(0)}% completo</span>
            <span>{weeklyGoal}h</span>
          </div>
        </div>

        {/* Task Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Tarefas</span>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30">
              {completedTasks} / {totalTasks}
            </Badge>
          </div>
          <Progress value={taskProgress} className="h-3" />
        </div>

        {/* Study Streak */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-foreground">Sequência</span>
            </div>
            <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
              {streak} dias
            </Badge>
          </div>
          
          {/* Week Calendar */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                  studyDays[index] 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {studyDays[index] ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">2h 30m</span>
            </div>
            <span className="text-xs text-muted-foreground">Hoje</span>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-secondary" />
              <span className="text-lg font-bold text-foreground">87%</span>
            </div>
            <span className="text-xs text-muted-foreground">Eficiência</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;