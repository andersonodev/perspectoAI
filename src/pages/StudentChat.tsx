import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RotateCcw, 
  Settings, 
  Brain, 
  Calendar,
  Map,
  Folder,
  Target,
  Sparkles,
  MessageCircle,
  CreditCard,
  Download,
  BarChart3,
  Zap
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
import FlashCardTool from '@/components/FlashCardTool';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useI18n } from '@/hooks/useI18n';
import { useAssistantMemory } from '@/hooks/useAssistantMemory';
import { useAITransparency } from '@/hooks/useAITransparency';
import XPWidget from '@/components/XPWidget';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import TransparencyPanel from '@/components/TransparencyPanel';
import ThreeJSSimulation from '@/components/ThreeJSSimulation';

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
  const [activeTab, setActiveTab] = useState('chat');
  
  const [practiceMode, setPracticeMode] = useState(false);
  const [simulatorProps, setSimulatorProps] = useState<any>(null);

  const { awardXP } = useXPSystem();
  const { t } = useI18n();
  const { saveMemory, analyzeUserPreferences } = useAssistantMemory(id || '', sessionId);
  const { logDecision } = useAITransparency(id || '', sessionId);
  
  const [currentMessageId, setCurrentMessageId] = useState<string>('');

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

    // Handle special commands
    if (messageText.startsWith('/simular')) {
      handleSimulationCommand(messageText);
      return;
    }

    if (messageText.startsWith('/conectar')) {
      handleConnectionCommand(messageText);
      return;
    }

    if (messageText.startsWith('/criar_plano')) {
      setActiveTab('study-plan');
      return;
    }

    if (messageText === '/segunda_mente') {
      setActiveTab('second-brain');
      return;
    }

    if (messageText === '/mapa') {
      setActiveTab('knowledge-map');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    const messageId = Math.random().toString(36).substring(7);
    setCurrentMessageId(messageId);

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Award XP for sending message
      await awardXP(10, 'message_sent', { message_length: messageText.length });

      // Analyze user preferences from recent messages
      await analyzeUserPreferences([...messages, userMessage]);

      // Log AI decision about response style
      const userMemory = await saveMemory('recent_interaction', 'last_message', {
        content: messageText,
        timestamp: new Date().toISOString(),
        length: messageText.length
      });

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

      // Log AI reasoning for transparency
      await logDecision(
        messageId,
        'response_generation',
        `Generated response based on user message "${messageText.substring(0, 50)}..." using assistant personality: ${assistant.personality}`,
        0.85,
        {
          message_length: messageText.length,
          assistant_personality: assistant.personality,
          guardrails_active: Object.keys(assistant.guardrails).length > 0
        }
      );

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
      onClose: () => setActiveTab('chat')
    });
    
    setActiveTab('simulator');
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
              alt="Mentor AI" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {assistant?.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('chat')} • {assistant?.subject}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* XP Widget */}
            <div className="hidden md:block w-64">
              <XPWidget />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700">
                  {assistant?.personality === 'friendly' && '😊 Amigável'}
                  {assistant?.personality === 'formal' && '🎓 Formal'}
                  {assistant?.personality === 'socratic' && '🤔 Socrático'}
                  {assistant?.personality === 'creative' && '🎨 Criativo'}
                </Badge>
                {practiceMode && (
                  <Badge className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700">
                    <Target className="h-3 w-3 mr-1" />
                    Modo Prática
                  </Badge>
                )}
              </div>
              
              <ThemeToggle />
              <LanguageSelector />
              
              <Button variant="ghost" size="sm" onClick={clearChatHistory}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 grid grid-cols-9 w-fit bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>{t('chat')}</span>
            </TabsTrigger>
            <TabsTrigger value="revision-coach">
              <Brain className="h-4 w-4 mr-1" />
              Coach
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              <CreditCard className="h-4 w-4 mr-1" />
              {t('flashcards')}
            </TabsTrigger>
            <TabsTrigger value="second-brain">
              <Folder className="h-4 w-4 mr-1" />
              Segunda Mente
            </TabsTrigger>
            <TabsTrigger value="study-plan">
              <Calendar className="h-4 w-4 mr-1" />
              {t('study_plan')}
            </TabsTrigger>
            <TabsTrigger value="knowledge-map">
              <Map className="h-4 w-4 mr-1" />
              {t('knowledge_map')}
            </TabsTrigger>
            <TabsTrigger value="simulation">
              <Zap className="h-4 w-4 mr-1" />
              Simulação
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-1" />
              Export
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full mt-0">
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={sendMessage}
                    onFeedback={submitFeedback}
                    loading={loading}
                    assistantName={assistant?.name || ''}
                    assistantSubject={assistant?.subject || ''}
                    practiceMode={practiceMode}
                  />
                </div>

                {/* Transparency Panel */}
                {currentMessageId && (
                  <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <TransparencyPanel
                      assistantId={assistant?.id || ''}
                      sessionId={sessionId}
                      messageId={currentMessageId}
                    />
                  </div>
                )}

                {/* Practice Mode Toggle */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-center">
                    <Button
                      variant={practiceMode ? "default" : "outline"}
                      onClick={() => setPracticeMode(!practiceMode)}
                      className={practiceMode ? "bg-purple-600 hover:bg-purple-700" : ""}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {practiceMode ? 'Sair do Modo Prática' : 'Modo Prática'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="simulation" className="h-full mt-0 overflow-y-auto">
              <div className="p-6">
                <ThreeJSSimulation
                  type="pendulum"
                  title="Simulação de Pêndulo"
                  description="Observe o movimento oscilatório de um pêndulo simples com física realista"
                />
                
                <div className="mt-6">
                  <ThreeJSSimulation
                    type="orbit"
                    title="Sistema Solar Simplificado"
                    description="Visualize o movimento orbital de um planeta ao redor do sol"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="revision-coach" className="h-full mt-0 overflow-y-auto">
              <SpacedRepetitionCoach 
                assistantId={assistant?.id || ''} 
                sessionId={sessionId} 
              />
            </TabsContent>

            <TabsContent value="flashcards" className="h-full mt-0 overflow-y-auto">
              <FlashCardTool
                assistantId={assistant?.id || ''}
                sessionId={sessionId}
                chatMessages={messages}
              />
            </TabsContent>

            <TabsContent value="second-brain" className="h-full mt-0 overflow-y-auto">
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
            </TabsContent>

            <TabsContent value="study-plan" className="h-full mt-0 overflow-y-auto">
              <SmartStudyPlan
                assistantId={assistant?.id || ''}
                sessionId={sessionId}
              />
            </TabsContent>

            <TabsContent value="knowledge-map" className="h-full mt-0 overflow-y-auto">
              <KnowledgeMap
                assistantId={assistant?.id || ''}
                sessionId={sessionId}
                subject={assistant?.subject || 'Geral'}
              />
            </TabsContent>

            <TabsContent value="analytics" className="h-full mt-0 overflow-y-auto">
              <LearningProfile sessionId={sessionId} assistantId={assistant?.id || ''} />
            </TabsContent>

            <TabsContent value="export" className="h-full mt-0 overflow-y-auto">
              <AdvancedExport
                messages={messages}
                assistantName={assistant?.name || ''}
                subject={assistant?.subject || ''}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentChat;
