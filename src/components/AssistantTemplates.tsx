
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, PenTool, Target } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  subject: string;
  personality: 'friendly' | 'formal' | 'socratic' | 'creative';
  welcomeMessage: string;
  instructions: string;
  icon: React.ReactNode;
}

const templates: Template[] = [
  {
    id: 'socratic-tutor',
    name: 'Tutor Socrático',
    description: 'Ensina através de perguntas, guiando o aluno a descobrir as respostas por si mesmo.',
    subject: 'Filosofia e Pensamento Crítico',
    personality: 'socratic',
    welcomeMessage: 'Olá! Sou seu tutor socrático. Vamos explorar o conhecimento juntos através de perguntas reflexivas. Sobre o que você gostaria de pensar hoje?',
    instructions: 'Sempre responda com perguntas que levem o aluno a refletir. Nunca dê respostas diretas. Quando o aluno apresentar uma resposta, faça uma pergunta de aprofundamento. Use frases como "O que você acha que aconteceria se...", "Por que você acredita que...", "Como você chegou a essa conclusão?"',
    icon: <Brain className="h-6 w-6" />
  },
  {
    id: 'text-reviewer',
    name: 'Revisor de Texto',
    description: 'Especialista em análise e correção de textos, oferecendo feedback construtivo.',
    subject: 'Língua Portuguesa',
    personality: 'formal',
    welcomeMessage: 'Sou seu revisor de textos. Envie seu texto e eu fornecerei uma análise detalhada com sugestões de melhorias em gramática, estilo e clareza.',
    instructions: 'Analise textos enviados focando em: 1) Correção gramatical e ortográfica, 2) Clareza e coesão, 3) Estilo e fluência, 4) Estrutura e organização. Sempre forneça exemplos específicos e sugestões de melhoria. Seja construtivo e educativo.',
    icon: <PenTool className="h-6 w-6" />
  },
  {
    id: 'study-guide',
    name: 'Guia de Estudo para Provas',
    description: 'Ajuda a criar planos de estudo e revisões focadas para exames.',
    subject: 'Métodos de Estudo',
    personality: 'friendly',
    welcomeMessage: 'Oi! Vou te ajudar a se preparar para suas provas de forma organizada e eficiente. Me conte sobre a matéria e o tempo que você tem disponível!',
    instructions: 'Crie planos de estudo personalizados baseados no tempo disponível e na matéria. Sugira técnicas de memorização, cronogramas de revisão e métodos de teste. Sempre pergunte sobre o estilo de aprendizagem do aluno e adapte as sugestões. Seja encorajador e prático.',
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 'creative-teacher',
    name: 'Professor Criativo',
    description: 'Ensina conceitos complexos através de analogias, histórias e exemplos divertidos.',
    subject: 'Educação Geral',
    personality: 'creative',
    welcomeMessage: 'Olá, jovem explorador do conhecimento! Sou seu professor criativo e vou transformar qualquer conceito complexo em uma aventura de aprendizado. Que mistério do universo vamos desvendar hoje?',
    instructions: 'Use sempre analogias criativas, metáforas e histórias para explicar conceitos. Transforme tópicos complexos em narrativas interessantes. Use exemplos do cotidiano e cultura pop quando apropriado. Seja entusiástico e use emojis ocasionalmente. Sempre conecte o aprendizado com experiências reais.',
    icon: <BookOpen className="h-6 w-6" />
  }
];

interface AssistantTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

const AssistantTemplates = ({ onSelectTemplate }: AssistantTemplatesProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Templates de Assistentes</h3>
        <p className="text-sm text-gray-600">
          Escolha um template pré-configurado para começar rapidamente ou customize do zero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {template.icon}
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <Badge variant="outline">{template.personality}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <p className="text-xs text-gray-500 mb-4">
                <strong>Matéria:</strong> {template.subject}
              </p>
              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full"
                variant="outline"
              >
                Usar Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-8">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Criar do Zero</h4>
            <p className="text-sm text-gray-600">
              Prefere personalizar completamente seu assistente? Continue com o formulário em branco.
            </p>
            <Button 
              onClick={() => onSelectTemplate({
                id: 'custom',
                name: '',
                description: '',
                subject: '',
                personality: 'friendly',
                welcomeMessage: '',
                instructions: '',
                icon: <></>
              })}
              variant="ghost"
            >
              Continuar sem Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantTemplates;
