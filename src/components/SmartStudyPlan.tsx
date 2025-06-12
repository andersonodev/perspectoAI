
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, Target, BookOpen, CalendarPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StudyPlan as DBStudyPlan } from '@/types/database';

interface StudyTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  completed: boolean;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  chapter?: string;
}

interface StudyPlan {
  id: string;
  examDate: Date;
  subject: string;
  chapters: string[];
  tasks: StudyTask[];
  totalEstimatedHours: number;
  completedHours: number;
}

interface SmartStudyPlanProps {
  assistantId: string;
  sessionId: string;
}

const SmartStudyPlan = ({ assistantId, sessionId }: SmartStudyPlanProps) => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [creating, setCreating] = useState(false);
  const [newPlan, setNewPlan] = useState({
    subject: '',
    examDate: '',
    chapters: '',
    studyHoursPerDay: 2
  });

  useEffect(() => {
    loadStudyPlans();
  }, [assistantId]);

  const loadStudyPlans = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('study_plans')
        .select('*')
        .eq('assistant_id', assistantId)
        .eq('session_id', sessionId);

      if (error) throw error;

      const plans = (data || []).map((plan: DBStudyPlan) => ({
        id: plan.id,
        examDate: new Date(plan.exam_date),
        subject: plan.subject,
        chapters: plan.chapters,
        totalEstimatedHours: plan.total_estimated_hours || 0,
        completedHours: plan.completed_hours || 0,
        tasks: JSON.parse(plan.tasks as string || '[]').map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }))
      }));

      setStudyPlans(plans);
    } catch (error) {
      console.error('Error loading study plans:', error);
    }
  };

  const generateStudyPlan = async () => {
    if (!newPlan.subject || !newPlan.examDate || !newPlan.chapters) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para gerar o plano.",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);

    try {
      const examDate = new Date(newPlan.examDate);
      const today = new Date();
      const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExam <= 0) {
        throw new Error('A data do exame deve ser no futuro');
      }

      const chapters = newPlan.chapters.split(',').map(c => c.trim()).filter(Boolean);
      const totalStudyHours = chapters.length * 3;
      const availableStudyDays = Math.max(1, daysUntilExam - 1);
      
      const tasks: StudyTask[] = [];
      let currentDate = new Date(today);
      
      chapters.forEach((chapter, index) => {
        const dayOffset = Math.floor((index * availableStudyDays) / chapters.length);
        const taskDate = new Date(currentDate);
        taskDate.setDate(currentDate.getDate() + dayOffset);

        tasks.push({
          id: `read-${index}`,
          title: `Ler e resumir ${chapter}`,
          description: `Leitura completa do capítulo com criação de resumo`,
          estimatedTime: 90,
          completed: false,
          dueDate: taskDate,
          priority: 'high',
          chapter
        });

        const exerciseDate = new Date(taskDate);
        exerciseDate.setDate(taskDate.getDate() + 1);
        
        tasks.push({
          id: `exercise-${index}`,
          title: `Exercícios de ${chapter}`,
          description: `Resolver exercícios e problemas do capítulo`,
          estimatedTime: 60,
          completed: false,
          dueDate: exerciseDate,
          priority: 'medium',
          chapter
        });
      });

      const reviewDate = new Date(examDate);
      reviewDate.setDate(examDate.getDate() - 1);
      
      tasks.push({
        id: 'final-review',
        title: 'Revisão Final',
        description: 'Revisão geral de todos os capítulos e simulado',
        estimatedTime: 180,
        completed: false,
        dueDate: reviewDate,
        priority: 'high'
      });

      const studyPlan: StudyPlan = {
        id: Date.now().toString(),
        examDate,
        subject: newPlan.subject,
        chapters,
        tasks,
        totalEstimatedHours: totalStudyHours,
        completedHours: 0
      };

      const { error } = await (supabase as any)
        .from('study_plans')
        .insert({
          id: studyPlan.id,
          assistant_id: assistantId,
          session_id: sessionId,
          subject: studyPlan.subject,
          exam_date: studyPlan.examDate.toISOString(),
          chapters: studyPlan.chapters,
          tasks: JSON.stringify(studyPlan.tasks),
          total_estimated_hours: studyPlan.totalEstimatedHours,
          completed_hours: 0
        });

      if (error) throw error;

      setStudyPlans(prev => [...prev, studyPlan]);
      
      setNewPlan({
        subject: '',
        examDate: '',
        chapters: '',
        studyHoursPerDay: 2
      });

      toast({
        title: "Plano de estudos criado!",
        description: `${tasks.length} tarefas foram geradas para otimizar seus estudos.`
      });

    } catch (error) {
      console.error('Error generating study plan:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível gerar o plano de estudos.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleTaskCompletion = async (planId: string, taskId: string) => {
    try {
      const plan = studyPlans.find(p => p.id === planId);
      if (!plan) return;

      const updatedTasks = plan.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });

      const completedHours = updatedTasks
        .filter(task => task.completed)
        .reduce((total, task) => total + task.estimatedTime / 60, 0);

      const { error } = await (supabase as any)
        .from('study_plans')
        .update({
          tasks: JSON.stringify(updatedTasks),
          completed_hours: completedHours
        })
        .eq('id', planId);

      if (error) throw error;

      setStudyPlans(prev => prev.map(p => 
        p.id === planId 
          ? { ...p, tasks: updatedTasks, completedHours }
          : p
      ));

    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const exportToCalendar = (plan: StudyPlan) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:Mentor AI Study Plan',
      ...plan.tasks.map(task => [
        'BEGIN:VEVENT',
        `DTSTART:${task.dueDate.toISOString().replace(/[:-]/g, '').split('.')[0]}Z`,
        `SUMMARY:${task.title}`,
        `DESCRIPTION:${task.description} (${task.estimatedTime} min)`,
        `UID:${task.id}@mentorai.com`,
        'END:VEVENT'
      ]).flat(),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-estudos-${plan.subject}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Calendário exportado!",
      description: "O arquivo foi baixado. Importe-o no seu aplicativo de calendário."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Plano de Estudos Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Criar Novo Plano de Estudos</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Matéria</Label>
              <Input
                id="subject"
                value={newPlan.subject}
                onChange={(e) => setNewPlan(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Ex: Biologia, Matemática..."
              />
            </div>
            <div>
              <Label htmlFor="examDate">Data da Prova</Label>
              <Input
                id="examDate"
                type="date"
                value={newPlan.examDate}
                onChange={(e) => setNewPlan(prev => ({ ...prev, examDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="chapters">Capítulos (separados por vírgula)</Label>
            <Textarea
              id="chapters"
              value={newPlan.chapters}
              onChange={(e) => setNewPlan(prev => ({ ...prev, chapters: e.target.value }))}
              placeholder="Ex: Cap 1 - Células, Cap 2 - DNA, Cap 3 - Mitose..."
              rows={3}
            />
          </div>

          <Button 
            onClick={generateStudyPlan} 
            disabled={creating}
            className="w-full"
          >
            {creating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Gerando plano inteligente...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Gerar Plano de Estudos
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {studyPlans.map(plan => {
            const progressPercentage = (plan.completedHours / plan.totalEstimatedHours) * 100;
            const daysUntilExam = Math.ceil((plan.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={plan.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.subject}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCalendar(plan)}
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>📅 Prova: {plan.examDate.toLocaleDateString()}</span>
                    <span>⏰ {daysUntilExam} dias restantes</span>
                    <span>📚 {plan.chapters.length} capítulos</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{plan.completedHours.toFixed(1)}h / {plan.totalEstimatedHours}h</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">Próximas Tarefas</h5>
                    {plan.tasks
                      .filter(task => !task.completed)
                      .slice(0, 3)
                      .map(task => {
                        const isOverdue = task.dueDate < new Date();
                        const isToday = task.dueDate.toDateString() === new Date().toDateString();
                        
                        return (
                          <div 
                            key={task.id} 
                            className={`flex items-center justify-between p-3 rounded border ${
                              isOverdue ? 'border-red-200 bg-red-50' :
                              isToday ? 'border-yellow-200 bg-yellow-50' :
                              'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTaskCompletion(plan.id, task.id)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className={`h-4 w-4 ${task.completed ? 'text-green-600' : 'text-gray-400'}`} />
                              </Button>
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <span>{task.dueDate.toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{task.estimatedTime} min</span>
                                  {task.chapter && (
                                    <>
                                      <span>•</span>
                                      <span>{task.chapter}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={
                                task.priority === 'high' ? 'destructive' :
                                task.priority === 'medium' ? 'default' : 'secondary'
                              }
                            >
                              {task.priority === 'high' ? 'Alta' :
                               task.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {studyPlans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum plano de estudos criado ainda.</p>
              <p className="text-sm">Crie seu primeiro plano para organizar seus estudos!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartStudyPlan;
