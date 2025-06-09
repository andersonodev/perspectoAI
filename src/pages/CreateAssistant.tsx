
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Brain, FileText, Settings, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AssistantTemplates from '@/components/AssistantTemplates';
import KnowledgeUpload from '@/components/KnowledgeUpload';

interface FormData {
  name: string;
  subject: string;
  personality: 'friendly' | 'formal' | 'socratic' | 'creative';
  welcome_message: string;
  instructions: string;
}

const CreateAssistant = () => {
  const navigate = useNavigate();
  const { createAssistant } = useAssistants();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    personality: 'friendly',
    welcome_message: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [createdAssistantId, setCreatedAssistantId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Template', icon: <Sparkles className="h-4 w-4" /> },
    { number: 2, title: 'Configuração', icon: <Settings className="h-4 w-4" /> },
    { number: 3, title: 'Conhecimento', icon: <FileText className="h-4 w-4" /> },
    { number: 4, title: 'Finalização', icon: <Brain className="h-4 w-4" /> }
  ];

  const handleTemplateSelect = (template: any) => {
    if (template.id !== 'custom') {
      setFormData({
        name: template.name,
        subject: template.subject,
        personality: template.personality,
        welcome_message: template.welcomeMessage,
        instructions: template.instructions
      });
    }
    setStep(2);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.subject) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e matéria.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const assistantData = {
        name: formData.name,
        subject: formData.subject,
        personality: formData.personality,
        welcome_message: formData.welcome_message || `Olá! Sou ${formData.name}, seu assistente de ${formData.subject}. Como posso ajudá-lo hoje?`,
        guardrails: {
          instructions: formData.instructions,
          behavior: `Atue como um assistente especializado em ${formData.subject} com personalidade ${formData.personality}. ${formData.instructions}`
        }
      };

      const result = await createAssistant(assistantData);
      if (result) {
        setCreatedAssistantId(result.id);
        setStep(3);
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha um Template</h2>
              <p className="text-gray-600">Comece com um template otimizado ou crie do zero</p>
            </div>
            <AssistantTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração do Assistente</h2>
              <p className="text-gray-600">Defina as características básicas do seu assistente</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Assistente *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Professor Carlos"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Matéria/Área *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Ex: Matemática, História, Programação"
                  />
                </div>

                <div>
                  <Label htmlFor="personality">Personalidade</Label>
                  <Select 
                    value={formData.personality} 
                    onValueChange={(value: any) => handleInputChange('personality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Amigável - Caloroso e acessível</SelectItem>
                      <SelectItem value="formal">Formal - Profissional e direto</SelectItem>
                      <SelectItem value="socratic">Socrático - Ensina através de perguntas</SelectItem>
                      <SelectItem value="creative">Criativo - Usa analogias e exemplos divertidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="welcome_message">Mensagem de Boas-vindas</Label>
                  <Textarea
                    id="welcome_message"
                    value={formData.welcome_message}
                    onChange={(e) => handleInputChange('welcome_message', e.target.value)}
                    placeholder="Como o assistente irá cumprimentar os alunos..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Instruções Especiais</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Instruções específicas sobre como o assistente deve se comportar..."
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ex: "Sempre cite as fontes", "Peça para o aluno explicar com suas palavras", etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Base de Conhecimento</h2>
              <p className="text-gray-600">Adicione materiais para enriquecer as respostas do assistente</p>
            </div>

            {createdAssistantId ? (
              <KnowledgeUpload assistantId={createdAssistantId} />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">
                    Primeiro você precisa criar o assistente para adicionar conhecimento.
                  </p>
                  <Button onClick={() => setStep(2)} className="mt-4">
                    Voltar para Configuração
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assistente Criado!</h2>
              <p className="text-gray-600">Seu assistente está pronto para ajudar os alunos</p>
            </div>

            <Card>
              <CardContent className="text-center py-8">
                <div className="space-y-4">
                  <Brain className="h-16 w-16 text-green-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">{formData.name}</h3>
                  <p className="text-gray-600">Assistente de {formData.subject}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Próximos passos:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Publique o assistente no dashboard</li>
                      <li>• Compartilhe o link com seus alunos</li>
                      <li>• Monitore as análises de uso</li>
                      <li>• Atualize a base de conhecimento conforme necessário</li>
                    </ul>
                  </div>

                  <Button onClick={handleFinish} className="mt-6">
                    Ir para Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Criar Assistente</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepItem, index) => (
              <div
                key={stepItem.number}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {stepItem.icon}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step >= stepItem.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {getStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        {step !== 1 && step !== 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {step === 2 ? (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Assistente
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={step === 4}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAssistant;
