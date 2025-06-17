
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Shuffle,
  Target,
  Brain,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FlashCard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  created_at: string;
}

interface FlashCardToolProps {
  assistantId: string;
  sessionId: string;
  chatMessages: any[];
}

const FlashCardTool = ({ assistantId, sessionId, chatMessages }: FlashCardToolProps) => {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyMode, setStudyMode] = useState<'review' | 'practice'>('review');

  useEffect(() => {
    loadFlashCards();
  }, []);

  const loadFlashCards = async () => {
    try {
      const { data, error } = await supabase
        .from('personal_knowledge')
        .select('*')
        .eq('session_id', sessionId)
        .eq('type', 'flashcard')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cards = data?.map(item => ({
        id: item.id,
        question: item.title,
        answer: item.content,
        difficulty: 'medium' as const,
        topic: item.tags?.[0] || 'Geral',
        created_at: item.created_at
      })) || [];

      setFlashCards(cards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  const generateFlashCardsFromChat = async () => {
    if (chatMessages.length === 0) {
      toast({
        title: "Conteúdo insuficiente",
        description: "Converse mais com o assistente para gerar flashcards relevantes.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const chatContent = chatMessages
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content)
        .join('\n\n');

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: `Com base no conteúdo da conversa, crie 5 flashcards educativos no formato JSON:
          
Conteúdo da conversa:
${chatContent}

Retorne APENAS um array JSON válido no formato:
[
  {
    "question": "Pergunta clara e objetiva",
    "answer": "Resposta completa e educativa",
    "topic": "Tópico principal"
  }
]

Certifique-se de que as perguntas testem conceitos importantes discutidos na conversa.`,
          assistantId,
          sessionId,
          assistantSettings: { citationMode: false, transparencyMode: false }
        }
      });

      if (error) throw error;

      // Parse response to extract JSON
      let flashCardData = [];
      try {
        const response = data.response || '';
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          flashCardData = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Error parsing flashcard data:', parseError);
        throw new Error('Formato de resposta inválido');
      }

      // Save flashcards to database
      for (const card of flashCardData) {
        await supabase
          .from('personal_knowledge')
          .insert({
            assistant_id: assistantId,
            session_id: sessionId,
            title: card.question,
            content: card.answer,
            type: 'flashcard',
            source: 'chat_generated',
            tags: [card.topic]
          });
      }

      await loadFlashCards();
      
      toast({
        title: "Flashcards criados!",
        description: `${flashCardData.length} flashcards foram gerados com base na sua conversa.`
      });

    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar os flashcards. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashCards.length);
    setShowAnswer(false);
  };

  const previousCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashCards.length) % flashCards.length);
    setShowAnswer(false);
  };

  const shuffleCards = () => {
    const shuffled = [...flashCards].sort(() => Math.random() - 0.5);
    setFlashCards(shuffled);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  if (flashCards.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Nenhum flashcard criado ainda
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Converse com o assistente sobre tópicos de estudo e depois gere flashcards automaticamente para revisar o conteúdo.
          </p>
          <Button 
            onClick={generateFlashCardsFromChat}
            disabled={isGenerating || chatMessages.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando Flashcards...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Flashcards da Conversa
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = flashCards[currentCardIndex];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Flashcards</h2>
          <p className="text-sm text-slate-600">
            {currentCardIndex + 1} de {flashCards.length} cards
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={shuffleCards}>
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateFlashCardsFromChat}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / flashCards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <Card className="min-h-[300px] border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="text-center pb-2">
          <Badge variant="outline" className="w-fit mx-auto bg-purple-100 text-purple-700 border-purple-200">
            {currentCard.topic}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-slate-900 leading-relaxed">
              {currentCard.question}
            </h3>
            
            {showAnswer && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200 animate-fade-in">
                <p className="text-slate-700 leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {!showAnswer ? (
              <Button 
                onClick={() => setShowAnswer(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Mostrar Resposta
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowAnswer(false)}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Ocultar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          onClick={previousCard}
          disabled={flashCards.length <= 1}
        >
          ← Anterior
        </Button>
        <Button 
          variant="outline" 
          onClick={nextCard}
          disabled={flashCards.length <= 1}
        >
          Próximo →
        </Button>
      </div>
    </div>
  );
};

export default FlashCardTool;
