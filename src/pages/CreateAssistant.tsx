
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { useKnowledge } from '@/hooks/useKnowledge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Brain, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import KnowledgeUpload from '@/components/KnowledgeUpload';

interface KnowledgeItem {
  id: string;
  type: 'file' | 'text';
  title: string;
  content: string;
  file?: File;
}

const CreateAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [personality, setPersonality] = useState<'friendly' | 'formal' | 'socratic' | 'creative'>('friendly');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdAssistant, setCreatedAssistant] = useState<any>(null);
  
  const { createAssistant } = useAssistants();
  const { uploadPDF, addKnowledge } = useKnowledge(createdAssistant?.id || '');
  const navigate = useNavigate();

  const personalityOptions = [
    { 
      value: 'friendly', 
      label: 'Amigável e Incentivador', 
      description: 'Tom caloroso, motivador e encorajador',
      icon: '😊'
    },
    { 
      value: 'formal', 
      label: 'Formal e Profissional', 
      description: 'Comunicação objetiva e respeitosa',
      icon: '🎓'
    },
    { 
      value: 'socratic', 
      label: 'Socrático e Reflexivo', 
      description: 'Faz perguntas para guiar o aprendizado',
      icon: '🤔'
    },
    { 
      value: 'creative', 
      label: 'Criativo e Divertido', 
      description: 'Usa analogias e exemplos criativos',
      icon: '🎨'
    }
  ];

  const steps = [
    { number: 1, title: 'Informações Básicas', description: 'Nome, matéria e personalidade' },
    { number: 2, title: 'Material de Ensino', description: 'PDFs, textos e conteúdo' },
    { number: 3, title: 'Finalização', description: 'Revisão e criação' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const canProceedStep1 = name.trim() && subject.trim();
  const canCreateAssistant = canProceedStep1;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canCreateAssistant) return;
    
    setLoading(true);

    try {
      // First create the assistant
      const assistant = await createAssistant({
        name,
        subject,
        personality,
        welcome_message: welcomeMessage || `Olá! Eu sou o ${name}, seu assistente de ${subject}. Como posso te ajudar hoje?`,
        guardrails: {
          focus_only_provided_content: true,
          no_direct_answers_to_exercises: true,
          stay_in_subject: true
        }
      });

      if (!assistant) {
        throw new Error('Falha ao criar assistente');
      }

      setCreatedAssistant(assistant);

      // Then upload knowledge if any
      if (knowledge.length > 0) {
        toast({
          title: "Carregando material...",
          description: "Processando arquivos e textos adicionados."
        });

        for (const item of knowledge) {
          if (item.type === 'file' && item.file) {
            await uploadPDF(item.file);
          } else if (item.type === 'text') {
            await addKnowledge({
              content_type: 'text',
              title: item.title,
              content: item.content
            });
          }
        }
      }

      toast({
        title: "Sucesso!",
        description: "Assistente criado com sucesso!"
      });

      navigate(`/assistant/${assistant.id}/edit`);
    } catch (error) {
      console.error('Error creating assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o assistente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">Nome do Assistente *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Professor Bio, Assistente de História..."
                className="text-lg p-4"
                required
              />
              <p className="text-sm text-gray-600">
                Escolha um nome amigável que seus alunos reconhecerão facilmente
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-medium">Matéria/Disciplina *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Biologia Celular, História do Brasil..."
                className="text-lg p-4"
                required
              />
              <p className="text-sm text-gray-600">
                Seja específico para melhores resultados
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Personalidade do Assistente</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalityOptions.map((option) => (
                  <Card 
                    key={option.value} 
                    className={`cursor-pointer transition-all ${
                      personality === option.value 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setPersonality(option.value as any)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{option.label}</h4>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        {personality === option.value && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome" className="text-base font-medium">Mensagem de Boas-vindas (Opcional)</Label>
              <Textarea
                id="welcome"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Personalize a primeira mensagem que os alunos verão..."
                rows={3}
                className="resize-none"
              />
              <p className="text-sm text-gray-600">
                Se não preenchido, será gerada uma mensagem automática
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Adicione Material de Ensino</h3>
              <p className="text-gray-600">
                O assistente usará este conteúdo para responder às perguntas dos alunos.
                Você pode adicionar mais material depois.
              </p>
            </div>
            <KnowledgeUpload onKnowledgeChange={setKnowledge} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Revisão Final</h3>
              <p className="text-gray-600">
                Confira as informações antes de criar seu assistente
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Informações do Assistente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium">Nome:</span> {name}
                </div>
                <div>
                  <span className="font-medium">Matéria:</span> {subject}
                </div>
                <div>
                  <span className="font-medium">Personalidade:</span>{' '}
                  {personalityOptions.find(p => p.value === personality)?.label}
                </div>
                {welcomeMessage && (
                  <div>
                    <span className="font-medium">Mensagem de boas-vindas:</span>
                    <p className="mt-1 p-3 bg-gray-50 rounded text-sm">
                      {welcomeMessage}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Material adicionado:</span> {knowledge.length} item(s)
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              size="lg"
              disabled={loading || !canCreateAssistant}
            >
              {loading ? "Criando..." : "Criar Assistente"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Brain className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Criar Novo Assistente</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <span className="text-sm text-gray-600">
              Passo {currentStep} de {steps.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button 
              onClick={handleNext}
              disabled={currentStep === 1 && !canProceedStep1}
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default CreateAssistant;
