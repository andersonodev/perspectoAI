
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles,
  Brain,
  Zap,
  MessageCircle,
  BookOpen,
  Target
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: number;
  suggestions?: string[];
  citations?: string[];
  reasoning?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onFeedback: (messageIndex: number, feedback: number) => void;
  loading: boolean;
  assistantName: string;
  assistantSubject: string;
  practiceMode?: boolean;
}

const ChatInterface = ({
  messages,
  onSendMessage,
  onFeedback,
  loading,
  assistantName,
  assistantSubject,
  practiceMode = false
}: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || loading) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/s, '<ul class="list-disc space-y-1">$1</ul>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600">
              <AvatarFallback className="text-white font-semibold">
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{assistantName}</h1>
              <p className="text-sm text-slate-600">Especialista em {assistantSubject}</p>
            </div>
            {practiceMode && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                <Target className="h-3 w-3 mr-1" />
                Modo Prática
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Olá! Como posso ajudar você hoje?
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Faça perguntas sobre {assistantSubject} ou use comandos especiais como /simular, /conectar ou /criar_plano
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <Avatar className={`h-10 w-10 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  <AvatarFallback className="text-white">
                    {message.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col space-y-2 flex-1">
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white ml-8'
                      : 'bg-white border border-slate-200 text-slate-900 mr-8'
                  }`}>
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                    />
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mr-8">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <p className="font-medium text-blue-900 text-sm">Fontes Consultadas</p>
                      </div>
                      {message.citations.map((citation, idx) => (
                        <p key={idx} className="text-blue-700 text-sm">• {citation}</p>
                      ))}
                    </div>
                  )}

                  {/* Reasoning */}
                  {message.reasoning && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mr-8">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="h-4 w-4 text-amber-600" />
                        <p className="font-medium text-amber-900 text-sm">Processo de Raciocínio</p>
                      </div>
                      <p className="text-amber-800 text-sm">{message.reasoning}</p>
                    </div>
                  )}
                  
                  {/* Feedback and Suggestions */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center justify-between mr-8">
                      {/* Feedback Buttons */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFeedback(index, 1)}
                          className={`h-8 w-8 p-0 hover:bg-green-100 ${
                            message.feedback === 1 ? 'bg-green-100 text-green-600' : 'text-slate-400'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFeedback(index, -1)}
                          className={`h-8 w-8 p-0 hover:bg-red-100 ${
                            message.feedback === -1 ? 'bg-red-100 text-red-600' : 'text-slate-400'
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Suggestion Buttons */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mr-8">
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => onSendMessage(suggestion)}
                          className="text-xs bg-white hover:bg-slate-50 border-slate-300 text-slate-700"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600">
                  <AvatarFallback className="text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 mr-8">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta ou use comandos como /simular, /conectar..."
                className="pr-12 h-12 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputMessage.trim() || loading}
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 bg-indigo-600 hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            💡 <strong>Comandos especiais:</strong> /simular [tópico] • /conectar [conceito] • /criar_plano • /segunda_mente • /mapa
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
