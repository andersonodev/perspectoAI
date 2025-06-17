import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  RotateCcw, 
  Settings, 
  Brain, 
  Calendar,
  Map,
  Folder,
  Zap,
  BookOpen,
  Target,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ChatInterface from '@/components/ChatInterface';
import LearningProfile from '@/components/LearningProfile';
import AdaptiveLearningPaths from '@/components/AdaptiveLearningPaths';
import AdvancedExport from '@/components/AdvancedExport';
import SpacedRepetitionCoach from '@/components/SpacedRepetitionCoach';
import InteractiveSimulator from '@/components/InteractiveSimulator';
import SecondBrainBuilder from '@/components/SecondBrainBuilder';
import SmartStudyPlan from '@/components/SmartStudyPlan';
import KnowledgeMap from '@/components/KnowledgeMap';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: number;
  suggestions?: string[];
  citations?: string[];
  reasoning?: string;
}

interface Assistant {
  id: string;
  name: string;
  subject: string;
  personality: string;
  welcome_message: string | null;
  is_published: boolean;
  guardrails: {
    creativityLevel?: number;
    citationMode?: boolean;
    antiCheatMode?: boolean;
    transparencyMode?: boolean;
  };
}

const StudentChat = () => {
  const { id } = useParams<{ id: string }>();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  // Sidebar states
  const [showProfile, setShowProfile] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSpacedRepetition, setShowSpacedRepetition] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showSecondBrain, setShowSecondBrain] = useState(false);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false);
  
  const [practiceMode, setPracticeMode] = useState(false);
  const [simulatorProps, setSimulatorProps] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchAssistant();
      loadChatHistory();
    }
  }, [id]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const fetchAssistant = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      const typedAssistant: Assistant = {
        ...data,
        guardrails: (data.guardrails as any) || {}
      };

      setAssistant(typedAssistant);
      
      if (data.welcome_message && messages.length === 0) {
        const welcomeMessage: Message = {
          role: 'assistant',
          content: data.welcome_message,
          timestamp: new Date(),
          suggestions: ['Como você pode me ajudar?', 'Quais tópicos você domina?', 'Vamos começar!']
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error fetching assistant:', error);
      toast({
        title: "Erro",
        description: "Assistente não encontrado ou não está publicado.",
        variant: "destructive"
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const loadChatHistory = () => {
    if (!id) return;
    
    const historyKey = `chat_history_${id}`;
    const savedHistory = localStorage.getItem(historyKey);
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const messagesWithDates = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  };

  const saveChatHistory = () => {
    if (!id) return;
    
    const historyKey = `chat_history_${id}`;
    localStorage.setItem(historyKey, JSON.stringify(messages));
  };

  const clearChatHistory = () => {
    if (!id) return;
    
    const historyKey = `chat_history_${id}`;
    localStorage.removeItem(historyKey);
    
    if (assistant?.welcome_message) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: assistant.welcome_message,
        timestamp: new Date(),
        suggestions: ['Como você pode me ajudar?', 'Quais tópicos você domina?', 'Vamos começar!']
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages([]);
    }
    
    toast({
      title: "Conversa limpa",
      description: "O histórico da conversa foi removido."
    });
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !assistant || loading) return;

    // Handle special commands (keep existing logic)
    if (messageText.startsWith('/simular')) {
      handleSimulationCommand(messageText);
      return;
    }

    if (messageText.startsWith('/conectar')) {
      handleConnectionCommand(messageText);
      return;
    }

    if (messageText.startsWith('/criar_plano')) {
      setShowStudyPlan(true);
      return;
    }

    if (messageText === '/segunda_mente') {
      setShowSecondBrain(true);
      return;
    }

    if (messageText === '/mapa') {
      setShowKnowledgeMap(true);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: messageText,
          assistantId: assistant.id,
          sessionId,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          assistantSettings: assistant.guardrails,
          learningProfile: {
            style: 'adaptive',
            pace: 'medium',
            preferences: ['examples', 'analogies']
          }
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        citations: data.citations || [],
        reasoning: data.reasoning || ''
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationCommand = (command: string) => {
    const topic = command.replace('/simular', '').trim();
    
    let simulationType: 'physics' | 'economics' | 'history' | 'math' = 'physics';
    
    if (topic.includes('preço') || topic.includes('demanda') || topic.includes('economia')) {
      simulationType = 'economics';
    } else if (topic.includes('história') || topic.includes('decisão') || topic.includes('guerra')) {
      simulationType = 'history';
    } else if (topic.includes('equação') || topic.includes('função') || topic.includes('matemática')) {
      simulationType = 'math';
    }

    setSimulatorProps({
      type: simulationType,
      topic: topic || assistant?.subject || 'Simulação',
      description: `Simulação interativa sobre ${topic}`,
      onClose: () => setShowSimulator(false)
    });
    
    setShowSimulator(true);
  };

  const handleConnectionCommand = (command: string) => {
    const topic = command.replace('/conectar', '').trim();
    
    const connectionMessage: Message = {
      role: 'assistant',
      content: `🔗 **Conectando com a Vida Real: ${topic || 'conceito atual'}**\n\nVou mostrar como isso se aplica no seu dia a dia! ${topic ? `Sobre ${topic}:` : ''}\n\n• **No trabalho:** Como profissionais usam isso\n• **Em casa:** Aplicações práticas no cotidiano\n• **Na tecnologia:** Como isso está presente nos dispositivos que você usa\n• **No futuro:** Oportunidades de carreira relacionadas\n\nQuer explorar alguma dessas conexões específicas?`,
      timestamp: new Date(),
      suggestions: [
        'Como isso me ajuda profissionalmente?',
        'Onde vejo isso no dia a dia?',
        'Que carreiras usam isso?',
        'Mostre um exemplo prático'
      ]
    };

    setMessages(prev => [...prev, connectionMessage]);
  };

  const submitFeedback = async (messageIndex: number, feedback: number) => {
    try {
      await supabase
        .from('message_feedback')
        .insert({
          assistant_id: assistant?.id,
          session_id: sessionId,
          message_index: messageIndex,
          feedback
        });

      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, feedback } : msg
      ));

      toast({
        title: "Obrigado!",
        description: "Seu feedback foi registrado.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando assistente...</p>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Assistente não encontrado
            </h3>
            <p className="text-slate-600">
              O assistente que você está procurando não foi encontrado ou não está publicado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-md border-r border-slate-200/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center justify-between mb-4">
            <img 
              src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
              alt="Mentor AI" 
              className="h-8 w-auto"
            />
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatHistory}
                disabled={messages.length === 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {assistant.personality === 'friendly' && '😊 Amigável'}
              {assistant.personality === 'formal' && '🎓 Formal'}
              {assistant.personality === 'socratic' && '🤔 Socrático'}
              {assistant.personality === 'creative' && '🎨 Criativo'}
            </Badge>
            {assistant.guardrails?.citationMode && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                📚 Cita Fontes
              </Badge>
            )}
            {assistant.guardrails?.antiCheatMode && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                🛡️ Anti-Cola
              </Badge>
            )}
          </div>
        </div>

        {/* Tools Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* AI Tools */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-indigo-600" />
                  Ferramentas de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => setShowSpacedRepetition(!showSpacedRepetition)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Coach de Revisão
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => setShowSecondBrain(!showSecondBrain)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Segunda Mente
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => setShowStudyPlan(!showStudyPlan)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Plano de Estudos
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => setShowKnowledgeMap(!showKnowledgeMap)}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Mapa de Conhecimento
                </Button>
              </CardContent>
            </Card>

            {/* Practice Mode */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <Button
                  variant={practiceMode ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPracticeMode(!practiceMode)}
                >
                  <Target className="h-4 w-4 mr-2" />
                  {practiceMode ? 'Sair do Modo Prática' : 'Modo Prática'}
                </Button>
              </CardContent>
            </Card>

            {/* Export */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowExport(!showExport)}
                  disabled={messages.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Conversa
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Conditional Components */}
          {showSpacedRepetition && (
            <div className="mt-6">
              <SpacedRepetitionCoach 
                assistantId={assistant?.id || ''} 
                sessionId={sessionId} 
              />
            </div>
          )}

          {showProfile && (
            <div className="mt-6">
              <LearningProfile sessionId={sessionId} assistantId={assistant?.id || ''} />
            </div>
          )}
          
          {showPaths && (
            <div className="mt-6">
              <AdaptiveLearningPaths
                currentTopic={assistant?.subject || ''}
                studentLevel="intermediate"
                onSelectPath={(path) => {
                  const pathMessage = `Vamos seguir o caminho: ${path.title}. ${path.description}`;
                  sendMessage(pathMessage);
                  setShowPaths(false);
                }}
              />
            </div>
          )}

          {showExport && (
            <div className="mt-6">
              <AdvancedExport
                messages={messages}
                assistantName={assistant?.name || ''}
                subject={assistant?.subject || ''}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Special Components */}
        {showSimulator && simulatorProps && (
          <div className="p-6 border-b border-slate-200/50">
            <InteractiveSimulator {...simulatorProps} />
          </div>
        )}

        {showSecondBrain && (
          <div className="p-6 border-b border-slate-200/50">
            <SecondBrainBuilder
              assistantId={assistant?.id || ''}
              sessionId={sessionId}
              onKnowledgeUpdate={() => {
                toast({
                  title: "Segunda Mente Atualizada!",
                  description: "Seu banco de conhecimento pessoal foi enriquecido."
                });
              }}
            />
          </div>
        )}

        {showStudyPlan && (
          <div className="p-6 border-b border-slate-200/50">
            <SmartStudyPlan
              assistantId={assistant?.id || ''}
              sessionId={sessionId}
            />
          </div>
        )}

        {showKnowledgeMap && (
          <div className="p-6 border-b border-slate-200/50">
            <KnowledgeMap
              assistantId={assistant?.id || ''}
              sessionId={sessionId}
              subject={assistant?.subject || 'Geral'}
            />
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            onFeedback={submitFeedback}
            loading={loading}
            assistantName={assistant.name}
            assistantSubject={assistant.subject}
            practiceMode={practiceMode}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
