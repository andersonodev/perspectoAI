
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import MagicalOnboarding from '@/components/MagicalOnboarding';

const CreateAssistant = () => {
  const navigate = useNavigate();
  const { createAssistant } = useAssistants();
  const [showMagicalOnboarding, setShowMagicalOnboarding] = useState(true);

  const handleOnboardingComplete = async (assistantData: any) => {
    try {
      const result = await createAssistant(assistantData);
      if (result) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
    }
  };

  if (showMagicalOnboarding) {
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
          <MagicalOnboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              Onboarding Mágico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Use nosso novo onboarding mágico para criar seu assistente em menos de 60 segundos!
            </p>
            <Button onClick={() => setShowMagicalOnboarding(true)}>
              Começar Onboarding Mágico
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssistant;
