import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Calculator,
  Globe,
  Atom,
  FileText,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  subject?: string;
}

const SuperTutorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu Super-Tutor de IA 🤖✨\n\nPosso te ajudar com qualquer matéria! Só lembrar que vou te explicar o processo para você aprender, não dar a resposta direta 😉\n\nQual é sua dúvida hoje?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const subjects = [
    { icon: Calculator, name: 'Matemática', color: 'from-blue-500 to-blue-600' },
    { icon: Globe, name: 'Geografia', color: 'from-green-500 to-green-600' },
    { icon: Atom, name: 'Física', color: 'from-purple-500 to-purple-600' },
    { icon: FileText, name: 'História', color: 'from-orange-500 to-orange-600' },
    { icon: BookOpen, name: 'Literatura', color: 'from-red-500 to-red-600' },
  ];

  const quickQuestions = [
    "Como resolver uma equação de 2º grau?",
    "Explique a fotossíntese",
    "O que foi a Revolução Industrial?",
    "Como calcular a velocidade média?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date(),
        subject: detectSubject(inputMessage),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const detectSubject = (message: string): string => {
    const keywords = {
      'Matemática': ['equação', 'calcular', 'número', 'fórmula', 'soma', 'multiplicação'],
      'Física': ['velocidade', 'força', 'energia', 'movimento', 'luz'],
      'Química': ['elemento', 'reação', 'molécula', 'átomo'],
      'História': ['guerra', 'revolução', 'século', 'império'],
      'Geografia': ['país', 'continente', 'clima', 'relevo']
    };

    for (const [subject, words] of Object.entries(keywords)) {
      if (words.some(word => message.toLowerCase().includes(word))) {
        return subject;
      }
    }
    return '';
  };

  const generateAIResponse = (question: string): string => {
    // This would be replaced with actual AI integration
    const responses = [
      "Ótima pergunta! Vou te explicar passo a passo para que você entenda o conceito...\n\n🔍 **Primeiro**, vamos entender o que está sendo perguntado.\n\n📝 **Segundo**, vou te mostrar o método para resolver.\n\n💡 **Terceiro**, você pode tentar aplicar em um exemplo similar!\n\nQue tal começar? O que você já sabe sobre esse tópico?",
      
      "Interessante! Esse é um conceito fundamental. Deixe-me quebrar isso em partes menores:\n\n🎯 **Conceito principal**: [explicação básica]\n\n🔗 **Como se conecta**: com outros tópicos que você já estudou\n\n🏃‍♂️ **Próximo passo**: vamos praticar juntos!\n\nVocê consegue me dizer onde já viu algo parecido?",
      
      "Excelente dúvida! Vou usar uma analogia para ficar mais claro:\n\n🌟 **Imagine que..** [analogia do dia a dia]\n\n📋 **Os passos são**:\n1. Identificar os dados\n2. Aplicar o conceito\n3. Verificar o resultado\n\nQual parte você gostaria que eu detalhe mais?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/🔍|📝|💡|🎯|🔗|🏃‍♂️|🌟|📋/g, '<span class="text-lg">$&</span>')
      .split('\n')
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
      ));
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-emerald-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Super-Tutor IA</h3>
            <p className="text-sm text-gray-600">Seu assistente pessoal de estudos</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Online
        </Badge>
      </div>

      {/* Subject Pills */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs bg-white hover:bg-gray-50"
            >
              <subject.icon className="h-3 w-3 mr-1" />
              {subject.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={message.isUser ? 'bg-blue-500 text-white' : 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'}>
                    {message.isUser ? 'Eu' : <Brain className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`rounded-lg p-3 ${
                  message.isUser 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900 border'
                }`}>
                  {message.subject && (
                    <Badge className="mb-2 bg-blue-100 text-blue-800 border-blue-200">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {message.subject}
                    </Badge>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {message.isUser ? message.content : formatMessageContent(message.content)}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3 border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">💡 Perguntas sugeridas:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs bg-white hover:bg-blue-50 text-left"
                onClick={() => handleQuickQuestion(question)}
              >
                <MessageSquare className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          🛡️ Nosso tutor explica o processo para você aprender, não dá respostas diretas
        </p>
      </div>
    </div>
  );
};

export default SuperTutorChat;