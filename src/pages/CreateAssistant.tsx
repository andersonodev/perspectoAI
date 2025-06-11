
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import MagicalOnboarding from '@/components/MagicalOnboarding';
import EnhancedCreateForm from '@/components/EnhancedCreateForm';

const CreateAssistant = () => {
  const navigate = useNavigate();
  const { createAssistant } = useAssistants();
  const [creationMode, setCreationMode] = useState<'choice' | 'magical' | 'complete'>('choice');
  const [loading, setLoading] = useState(false);

  const handleMagicalOnboardingComplete = async (assistantData: any) => {
    try {
      const result = await createAssistant(assistantData);
      if (result) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
    }
  };

  const handleCompleteFormSubmit = async (data: {
    formData: any;
    aiSettings: any;
    knowledgeSources: any[];
  }) => {
    setLoading(true);
    try {
      const assistantData = {
        name: data.formData.name,
        subject: data.formData.subject,
        personality: data.formData.personality,
        welcome_message: data.formData.welcome_message || `Olá! Sou ${data.formData.name}, seu assistente especializado em ${data.formData.subject}. Como posso ajudá-lo hoje?`,
        is_published: data.formData.is_published,
        guardrails: {
          instructions: data.formData.instructions,
          creativityLevel: data.aiSettings.creativityLevel,
          citationMode: data.aiSettings.citationMode,
          antiCheatMode: data.aiSettings.antiCheatMode,
          transparencyMode: data.aiSettings.transparencyMode,
          behavior: `Atue como um assistente especializado em ${data.formData.subject} com personalidade ${data.formData.personality}. ${data.formData.instructions}`
        }
      };

      const result = await createAssistant(assistantData);
      if (result) {
        // TODO: Aqui você pode adicionar lógica para processar as múltiplas fontes de conhecimento
        // Por exemplo, fazer upload dos arquivos, processar URLs do YouTube, etc.
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (creationMode === 'magical') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setCreationMode('choice')}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">Onboarding Mágico</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <MagicalOnboarding onComplete={handleMagicalOnboardingComplete} />
        </div>
      </div>
    );
  }

  if (creationMode === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setCreationMode('choice')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Criar Assistente Completo</h1>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <EnhancedCreateForm onSubmit={handleCompleteFormSubmit} loading={loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Como você gostaria de criar seu assistente?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha a experiência que melhor se adequa ao seu tempo e necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Onboarding Mágico */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Onboarding Mágico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Crie seu assistente em menos de 60 segundos! Apenas forneça um conteúdo 
                  (PDF, YouTube ou texto) e deixe a mágica acontecer.
                </p>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">✨ Perfeito para:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Professores que querem testar rapidamente</li>
                    <li>• Primeira experiência com IA educacional</li>
                    <li>• Quando você tem pressa</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setCreationMode('magical')}
                  className="w-full"
                >
                  Começar Onboarding Mágico
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Criação Completa */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                Criação Completa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Controle total! Configure personalidade, múltiplas fontes de conhecimento, 
                  controles de IA e todas as configurações avançadas.
                </p>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">🎯 Perfeito para:</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Professores experientes</li>
                    <li>• Múltiplas fontes de conhecimento</li>
                    <li>• Controle total sobre comportamento da IA</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setCreationMode('complete')}
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  Criar com Controle Total
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Dica: Você pode sempre editar e ajustar seu assistente depois de criá-lo
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAssistant;
