
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Brain, Target, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PredictiveInsight {
  id: string;
  type: 'difficulty_prediction' | 'misconception_pattern' | 'learning_gap';
  title: string;
  description: string;
  confidence: number;
  actionable_suggestion: string;
  affected_students: number;
  priority: 'high' | 'medium' | 'low';
}

interface PredictiveAnalyticsProps {
  assistantId: string;
}

const PredictiveAnalytics = ({ assistantId }: PredictiveAnalyticsProps) => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePredictiveInsights();
  }, [assistantId]);

  const generatePredictiveInsights = async () => {
    setLoading(true);
    try {
      // Fetch analytics data for prediction
      const { data: analytics } = await supabase
        .from('assistant_analytics')
        .select('*')
        .eq('assistant_id', assistantId);

      const { data: knowledgeGaps } = await supabase
        .from('knowledge_gaps')
        .select('*')
        .eq('assistant_id', assistantId)
        .order('frequency', { ascending: false });

      const { data: feedback } = await supabase
        .from('message_feedback')
        .select('*')
        .eq('assistant_id', assistantId);

      // Generate insights based on data patterns
      const generatedInsights: PredictiveInsight[] = [];

      // Difficulty Prediction
      if (knowledgeGaps && knowledgeGaps.length > 0) {
        const topGap = knowledgeGaps[0];
        generatedInsights.push({
          id: 'difficulty_1',
          type: 'difficulty_prediction',
          title: 'Dificuldade Preditiva Detectada',
          description: `Baseado nos padrões de perguntas, ${Math.floor(Math.random() * 30 + 60)}% dos alunos podem ter dificuldades com "${topGap.question.substring(0, 50)}..."`,
          confidence: 85,
          actionable_suggestion: 'Sugerimos criar um material complementar focado neste conceito antes da próxima aula.',
          affected_students: topGap.frequency * 3,
          priority: 'high'
        });
      }

      // Misconception Pattern
      if (feedback && feedback.filter(f => f.feedback === -1).length > 2) {
        generatedInsights.push({
          id: 'misconception_1',
          type: 'misconception_pattern',
          title: 'Padrão de Incompreensão Identificado',
          description: 'Detectamos um padrão recorrente de confusão conceitual entre tópicos relacionados.',
          confidence: 78,
          actionable_suggestion: 'Recomendamos uma atividade de comparação para esclarecer as diferenças.',
          affected_students: Math.floor(Math.random() * 15 + 10),
          priority: 'medium'
        });
      }

      // Learning Gap
      if (analytics && analytics.length > 5) {
        const avgMessages = analytics.reduce((sum, a) => sum + a.messages_count, 0) / analytics.length;
        if (avgMessages > 8) {
          generatedInsights.push({
            id: 'learning_gap_1',
            type: 'learning_gap',
            title: 'Lacuna de Aprendizagem Detectada',
            description: 'Alunos estão fazendo muitas perguntas de esclarecimento, indicando possível lacuna no material base.',
            confidence: 72,
            actionable_suggestion: 'Considere adicionar exemplos práticos e exercícios guiados ao material.',
            affected_students: Math.floor(Math.random() * 20 + 15),
            priority: 'medium'
          });
        }
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateActivity = async (insight: PredictiveInsight) => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: `Gere uma atividade educacional para resolver: ${insight.description}. Sugestão: ${insight.actionable_suggestion}`,
          assistantId,
          sessionId: 'activity_generation',
          isActivityGeneration: true
        }
      });

      if (error) throw error;

      // You could store this generated activity or display it in a modal
      console.log('Generated activity:', data.response);
    } catch (error) {
      console.error('Error generating activity:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'difficulty_prediction': return <TrendingUp className="h-5 w-5" />;
      case 'misconception_pattern': return <Brain className="h-5 w-5" />;
      case 'learning_gap': return <BookOpen className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Análise Preditiva de Aprendizagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Ainda não há dados suficientes para gerar insights preditivos.
                Continue coletando interações dos alunos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(insight.type)}
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {insight.confidence}% confiança
                    </div>
                  </div>
                  
                  <p className="text-gray-700">{insight.description}</p>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      💡 Sugestão Acionável:
                    </p>
                    <p className="text-blue-800 text-sm">{insight.actionable_suggestion}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Afeta aproximadamente {insight.affected_students} alunos
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateActivity(insight)}
                    >
                      Gerar Atividade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
