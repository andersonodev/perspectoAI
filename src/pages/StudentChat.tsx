import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, MessageSquare, ThumbsUp, ThumbsDown, Download, RotateCcw, Gamepad2, FileText, Bookmark } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LearningProfile from '@/components/LearningProfile';
import AdaptiveLearningPaths from '@/components/AdaptiveLearningPaths';
import AdvancedExport from '@/components/AdvancedExport';

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
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [showProfile, setShowProfile] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchAssistant();
      loadChatHistory();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchAssistant = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching assistant:', error);
        throw error;
      }

      setAssistant(data);
      
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

  const detectCheatAttempt = (message: string): boolean => {
    if (!assistant?.guardrails?.antiCheatMode) return false;
    
    // Detectar padrões de questões de prova
    const cheatPatterns = [
      /questão \d+/i,
      /alternativa [a-e]/i,
      /verdadeiro ou falso/i,
      /complete a frase/i,
      /resolva o exercício/i,
      /resposta da prova/i
    ];
    
    return cheatPatterns.some(pattern => pattern.test(message));
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || !assistant || loading) return;

    // Detectar tentativa de cola
    if (detectCheatAttempt(textToSend)) {
      const antiCheatMessage: Message = {
        role: 'assistant',
        content: "🎓 Percebi que esta parece ser uma questão de avaliação. Seria mais produtivo para o seu aprendizado se explorássemos juntos o conceito por trás dela. Qual parte do tópico você gostaria de revisar para resolver essa questão sozinho?",
        timestamp: new Date(),
        suggestions: [
          'Vamos revisar os conceitos básicos',
          'Preciso entender a teoria primeiro',
          'Pode me dar dicas para resolver sozinho?'
        ]
      };
      
      setMessages(prev => [...prev, antiCheatMessage]);
      setInputMessage('');
      return;
    }

    // Handle special commands
    if (textToSend === '/resumo') {
      generateSummary();
      setInputMessage('');
      return;
    }

    if (textToSend.startsWith('/praticar')) {
      const topic = textToSend.replace('/praticar', '').trim() || assistant.subject;
      generatePracticeExercise(topic);
      setInputMessage('');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: textToSend,
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

      trackAnalytics();

      if (data.response?.includes('não sei') || data.response?.includes('não tenho informação')) {
        trackKnowledgeGap(textToSend);
      }

      if (messages.length > 4 && Math.random() > 0.7) {
        setShowPaths(true);
      }

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

  const generateSummary = async () => {
    if (messages.length < 2) {
      toast({
        title: "Resumo",
        description: "Não há conversa suficiente para gerar um resumo.",
        variant: "default"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: 'Por favor, faça um resumo dos pontos principais desta conversa.',
          assistantId: assistant?.id,
          sessionId,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          isCommand: true
        }
      });

      if (error) throw error;

      const summaryMessage: Message = {
        role: 'assistant',
        content: `📋 **Resumo da Conversa:**\n\n${data.response}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, summaryMessage]);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o resumo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePracticeExercise = async (topic: string) => {
    setLoading(true);
    setPracticeMode(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: `Gere um exercício prático sobre ${topic}. Inclua: 1) Uma pergunta desafiadora, 2) Dicas para resolução, 3) A resposta correta com explicação detalhada.`,
          assistantId: assistant?.id,
          sessionId,
          conversationHistory: [],
          isPracticeMode: true
        }
      });

      if (error) throw error;

      const exerciseMessage: Message = {
        role: 'assistant',
        content: `🎯 **Exercício Prático - ${topic}:**\n\n${data.response}`,
        timestamp: new Date(),
        suggestions: ['Preciso de uma dica', 'Mostrar resposta', 'Novo exercício']
      };

      setMessages(prev => [...prev, exerciseMessage]);
    } catch (error) {
      console.error('Error generating exercise:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o exercício.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const trackAnalytics = async () => {
    try {
      await supabase
        .from('assistant_analytics')
        .insert({
          assistant_id: assistant?.id,
          session_id: sessionId,
          messages_count: messages.length + 1
        });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const trackKnowledgeGap = async (question: string) => {
    try {
      const { data: existing } = await supabase
        .from('knowledge_gaps')
        .select('*')
        .eq('assistant_id', assistant?.id)
        .eq('question', question)
        .single();

      if (existing) {
        await supabase
          .from('knowledge_gaps')
          .update({
            frequency: existing.frequency + 1,
            last_asked: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('knowledge_gaps')
          .insert({
            assistant_id: assistant?.id,
            question,
            frequency: 1
          });
      }
    } catch (error) {
      console.error('Error tracking knowledge gap:', error);
    }
  };

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `**${msg.role === 'user' ? 'Você' : assistant?.name}** (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`
    ).join('');

    const blob = new Blob([conversationText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-${assistant?.name}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Conversa exportada",
      description: "O arquivo foi baixado com sucesso!"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  };

  const handlePathSelection = (path: any) => {
    const pathMessage = `Vamos seguir o caminho: ${path.title}. ${path.description}`;
    sendMessage(pathMessage);
    setShowPaths(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando assistente...</p>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Assistente não encontrado
            </h3>
            <p className="text-gray-600">
              O assistente que você está procurando não foi encontrado ou não está publicado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{assistant.name}</h1>
                <p className="text-sm text-gray-600">Assistente de {assistant.subject}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {assistant.personality === 'friendly' && 'Amigável'}
                  {assistant.personality === 'formal' && 'Formal'}
                  {assistant.personality === 'socratic' && 'Socrático'}
                  {assistant.personality === 'creative' && 'Criativo'}
                </Badge>
                {assistant.guardrails?.citationMode && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    Cita fontes
                  </Badge>
                )}
                {assistant.guardrails?.antiCheatMode && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                    Anti-cola
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
              >
                Perfil
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExport(!showExport)}
                disabled={messages.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChatHistory}
                disabled={messages.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {showProfile && (
              <LearningProfile sessionId={sessionId} assistantId={assistant.id} />
            )}
            
            {showPaths && (
              <AdaptiveLearningPaths
                currentTopic={assistant.subject}
                studentLevel="intermediate"
                onSelectPath={handlePathSelection}
              />
            )}

            {showExport && (
              <AdvancedExport
                messages={messages}
                assistantName={assistant.name}
                subject={assistant.subject}
              />
            )}
            
            <Card>
              <CardContent className="p-4">
                <Button
                  variant={practiceMode ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setPracticeMode(!practiceMode);
                    if (!practiceMode) {
                      generatePracticeExercise(assistant.subject);
                    }
                  }}
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  {practiceMode ? 'Sair do Modo Prática' : 'Modo Prática'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat com {assistant.name}
                  {practiceMode && (
                    <Badge variant="default" className="ml-2 bg-purple-600">
                      Modo Prática
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0">
                {/* Messages */}
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`p-2 rounded-full ${
                          message.role === 'user' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <div 
                              className="text-sm whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                            />
                            <p className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>

                          {/* Citations */}
                          {message.citations && message.citations.length > 0 && (
                            <div className="bg-blue-50 p-2 rounded text-xs">
                              <p className="font-medium text-blue-900 mb-1">📚 Fontes:</p>
                              {message.citations.map((citation, idx) => (
                                <p key={idx} className="text-blue-700">• {citation}</p>
                              ))}
                            </div>
                          )}

                          {/* Reasoning (Transparency Mode) */}
                          {assistant.guardrails?.transparencyMode && message.reasoning && (
                            <div className="bg-yellow-50 p-2 rounded text-xs">
                              <p className="font-medium text-yellow-900 mb-1">🤔 Como cheguei a esta resposta:</p>
                              <p className="text-yellow-800">{message.reasoning}</p>
                            </div>
                          )}
                          
                          {/* Feedback buttons for assistant messages */}
                          {message.role === 'assistant' && (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => submitFeedback(index, 1)}
                                className={`h-8 w-8 p-0 ${
                                  message.feedback === 1 ? 'bg-green-100 text-green-600' : ''
                                }`}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => submitFeedback(index, -1)}
                                className={`h-8 w-8 p-0 ${
                                  message.feedback === -1 ? 'bg-red-100 text-red-600' : ''
                                }`}
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          
                          {/* Suggestion buttons */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => sendMessage(suggestion)}
                                  className="text-xs"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="p-3 rounded-lg bg-gray-200">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua pergunta, /resumo para resumir, ou /praticar [tópico] para exercícios..."
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button 
                      onClick={() => sendMessage()} 
                      disabled={!inputMessage.trim() || loading}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Pressione Enter para enviar • Digite /resumo para resumir • /praticar [tópico] para exercícios
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
