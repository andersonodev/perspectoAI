
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Brain, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SpacedRepetitionItem } from '@/types/database';

interface ReviewItem {
  id: string;
  topic: string;
  lastReviewed: Date;
  nextReview: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  streak: number;
  assistantId: string;
}

interface SpacedRepetitionCoachProps {
  assistantId: string;
  sessionId: string;
}

const SpacedRepetitionCoach = ({ assistantId, sessionId }: SpacedRepetitionCoachProps) => {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [dueReviews, setDueReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewItems();
  }, [assistantId]);

  const loadReviewItems = async () => {
    try {
      // Use type assertion to work around TypeScript type issues
      const { data, error } = await (supabase as any)
        .from('spaced_repetition_items')
        .select('*')
        .eq('assistant_id', assistantId)
        .eq('session_id', sessionId);

      if (error) throw error;

      const items = (data || []).map((item: SpacedRepetitionItem) => ({
        id: item.id,
        topic: item.topic,
        lastReviewed: new Date(item.last_reviewed),
        nextReview: new Date(item.next_review),
        difficulty: item.difficulty,
        streak: item.streak,
        assistantId: item.assistant_id
      }));

      setReviewItems(items);
      
      const due = items.filter(item => item.nextReview <= new Date());
      setDueReviews(due);
    } catch (error) {
      console.error('Error loading review items:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNextReview = (difficulty: 'easy' | 'medium' | 'hard', streak: number): Date => {
    const now = new Date();
    let daysToAdd = 1;

    // Algoritmo de revisão espaçada baseado na Curva de Ebbinghaus
    if (difficulty === 'easy') {
      daysToAdd = Math.min(30, Math.pow(2, streak));
    } else if (difficulty === 'medium') {
      daysToAdd = Math.min(21, Math.pow(1.8, streak));
    } else {
      daysToAdd = Math.min(14, Math.pow(1.5, streak));
    }

    const nextReview = new Date(now);
    nextReview.setDate(now.getDate() + daysToAdd);
    return nextReview;
  };

  const markAsReviewed = async (itemId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      const item = reviewItems.find(r => r.id === itemId);
      if (!item) return;

      const newStreak = difficulty === 'hard' ? 0 : item.streak + 1;
      const nextReview = calculateNextReview(difficulty, newStreak);

      const { error } = await (supabase as any)
        .from('spaced_repetition_items')
        .update({
          last_reviewed: new Date().toISOString(),
          next_review: nextReview.toISOString(),
          difficulty,
          streak: newStreak
        })
        .eq('id', itemId);

      if (error) throw error;

      await loadReviewItems();
      
      toast({
        title: "Revisão registrada!",
        description: `Próxima revisão em ${Math.ceil((nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias.`
      });
    } catch (error) {
      console.error('Error marking as reviewed:', error);
    }
  };

  const addTopicToReview = async (topic: string) => {
    try {
      const nextReview = calculateNextReview('medium', 0);
      
      const { error } = await (supabase as any)
        .from('spaced_repetition_items')
        .insert({
          assistant_id: assistantId,
          session_id: sessionId,
          topic,
          last_reviewed: new Date().toISOString(),
          next_review: nextReview.toISOString(),
          difficulty: 'medium',
          streak: 0
        });

      if (error) throw error;

      await loadReviewItems();
      
      toast({
        title: "Tópico adicionado ao coach de revisão!",
        description: `${topic} será revisado em 2 dias.`
      });
    } catch (error) {
      console.error('Error adding topic to review:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">Carregando coach de revisão...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          Coach de Revisão Espaçada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dueReviews.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
              <span className="font-medium text-orange-900">
                {dueReviews.length} tópico(s) para revisar hoje!
              </span>
            </div>
            <div className="space-y-2">
              {dueReviews.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <p className="font-medium">{item.topic}</p>
                    <p className="text-sm text-gray-600">
                      Sequência: {item.streak} • Última revisão: {item.lastReviewed.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsReviewed(item.id, 'hard')}
                      className="text-red-600 border-red-200"
                    >
                      Difícil
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsReviewed(item.id, 'medium')}
                      className="text-yellow-600 border-yellow-200"
                    >
                      Médio
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsReviewed(item.id, 'easy')}
                      className="text-green-600 border-green-200"
                    >
                      Fácil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Próximas Revisões</h4>
          {reviewItems.filter(item => item.nextReview > new Date()).slice(0, 5).map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div>
                <p className="font-medium">{item.topic}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>{item.nextReview.toLocaleDateString()}</span>
                  <Badge variant="outline" className="text-xs">
                    Sequência: {item.streak}
                  </Badge>
                </div>
              </div>
              <Badge variant={
                item.difficulty === 'easy' ? 'default' : 
                item.difficulty === 'medium' ? 'secondary' : 'destructive'
              }>
                {item.difficulty === 'easy' ? 'Fácil' : 
                 item.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </Badge>
            </div>
          ))}
        </div>

        {reviewItems.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhum tópico em revisão ainda.</p>
            <p className="text-sm">Continue conversando para adicionar tópicos automaticamente!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpacedRepetitionCoach;
