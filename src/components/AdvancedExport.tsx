
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Brain, Bookmark, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

interface AdvancedExportProps {
  messages: Message[];
  assistantName: string;
  subject: string;
}

const AdvancedExport = ({ messages, assistantName, subject }: AdvancedExportProps) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportToMarkdown = () => {
    const conversationText = messages.map(msg => 
      `**${msg.role === 'user' ? 'Você' : assistantName}** (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`
    ).join('');

    downloadFile(conversationText, `conversa-${assistantName}-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
  };

  const exportToFlashcards = () => {
    setExporting('flashcards');
    
    // Extrair pares pergunta-resposta para flashcards
    const flashcards: string[] = [];
    
    for (let i = 0; i < messages.length - 1; i++) {
      if (messages[i].role === 'user' && messages[i + 1].role === 'assistant') {
        const question = messages[i].content.replace(/[,\n]/g, ' ').trim();
        const answer = messages[i + 1].content.replace(/[,\n]/g, ' ').trim();
        
        // Formato CSV para Anki
        flashcards.push(`"${question}","${answer}"`);
      }
    }

    const csvContent = 'Frente,Verso\n' + flashcards.join('\n');
    downloadFile(csvContent, `flashcards-${subject}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    
    setTimeout(() => setExporting(null), 1000);
  };

  const exportToStudyGuide = () => {
    setExporting('study-guide');
    
    const studyGuide = `
# Guia de Estudo - ${subject}
**Gerado por:** ${assistantName}  
**Data:** ${new Date().toLocaleDateString('pt-BR')}

---

## 📚 Resumo da Sessão de Estudos

Esta sessão de estudos cobriu os seguintes tópicos em ${subject}:

${generateTopicsSummary()}

---

## 💬 Conversa Completa

${messages.map((msg, index) => `
### ${msg.role === 'user' ? '🎓 Pergunta do Estudante' : '🤖 Resposta do ' + assistantName}
*${msg.timestamp.toLocaleString()}*

${msg.content}

${msg.citations ? `
**Fontes consultadas:**
${msg.citations.map(citation => `- ${citation}`).join('\n')}
` : ''}

---
`).join('')}

## 🎯 Pontos-Chave Para Revisar

${generateKeyPoints()}

## 📝 Sugestões de Estudos Adicionais

${generateStudySuggestions()}

---

*Guia gerado automaticamente pelo Mentor AI - Continue seus estudos!*
`;

    downloadFile(studyGuide, `guia-estudo-${subject}-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    
    setTimeout(() => setExporting(null), 1500);
  };

  const generateTopicsSummary = () => {
    const userQuestions = messages.filter(msg => msg.role === 'user');
    const topics = userQuestions.slice(0, 5).map((msg, index) => 
      `${index + 1}. ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`
    );
    return topics.join('\n');
  };

  const generateKeyPoints = () => {
    const assistantResponses = messages.filter(msg => msg.role === 'assistant');
    const keyPoints = assistantResponses.slice(0, 3).map((msg, index) => {
      const firstSentence = msg.content.split('.')[0] + '.';
      return `${index + 1}. ${firstSentence}`;
    });
    return keyPoints.join('\n');
  };

  const generateStudySuggestions = () => {
    return `
- Revise os conceitos principais identificados nesta conversa
- Pratique exercícios relacionados aos tópicos discutidos
- Procure exemplos adicionais dos conceitos aprendidos
- Faça resumos dos pontos mais importantes
- Teste seu conhecimento com os flashcards gerados
`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Arquivo baixado!",
      description: `${filename} foi salvo com sucesso.`
    });
  };

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Comece uma conversa para poder exportar o conteúdo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 mr-2 text-blue-600" />
          Exportações Avançadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Markdown Export */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-medium text-gray-900">Conversa Simples</h3>
              </div>
              <Badge variant="outline">Markdown</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Exporta a conversa em formato texto simples para arquivo ou cópia
            </p>
            <Button 
              onClick={exportToMarkdown}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar .md
            </Button>
          </div>

          {/* Flashcards Export */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Bookmark className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="font-medium text-gray-900">Flashcards</h3>
              </div>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Anki/Quizlet
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Converte perguntas e respostas em flashcards para revisão espaçada
            </p>
            <Button 
              onClick={exportToFlashcards}
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={exporting === 'flashcards'}
            >
              {exporting === 'flashcards' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Gerar Flashcards
                </>
              )}
            </Button>
          </div>

          {/* Study Guide Export */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-gray-900">Guia de Estudo</h3>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                PDF Completo
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Cria um guia de estudos formatado com resumos, pontos-chave e sugestões
            </p>
            <Button 
              onClick={exportToStudyGuide}
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={exporting === 'study-guide'}
            >
              {exporting === 'study-guide' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Criar Guia
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <div className="flex items-center text-blue-800 mb-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="font-medium">Integração Perfeita</span>
          </div>
          <p className="text-xs text-blue-700">
            Os arquivos gerados são compatíveis com as principais ferramentas de estudo: 
            Anki, Quizlet, Notion, Obsidian e muito mais.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedExport;
