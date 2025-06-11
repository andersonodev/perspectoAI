
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Youtube, FileText, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MagicalOnboardingProps {
  onComplete: (assistantData: any) => void;
}

const MagicalOnboarding = ({ onComplete }: MagicalOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(10);
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState<'youtube' | 'pdf' | 'text'>('youtube');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    youtubeUrl: '',
    textContent: '',
    file: null as File | null
  });

  const steps = [
    { number: 1, title: 'Bem-vindo', icon: <Sparkles className="h-4 w-4" /> },
    { number: 2, title: 'Conteúdo', icon: <Upload className="h-4 w-4" /> },
    { number: 3, title: 'Processando', icon: <FileText className="h-4 w-4" /> },
    { number: 4, title: 'Pronto!', icon: <CheckCircle className="h-4 w-4" /> }
  ];

  const handleContentSubmit = async () => {
    if (!formData.name || !formData.subject) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e matéria.",
        variant: "destructive"
      });
      return;
    }

    if (contentType === 'youtube' && !formData.youtubeUrl) {
      toast({
        title: "URL necessária",
        description: "Por favor, forneça uma URL do YouTube.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setStep(3);
    setProgress(30);

    // Simular processamento
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setStep(4);
            setProgress(100);
            setLoading(false);
            
            // Criar dados do assistente
            const assistantData = {
              name: formData.name,
              subject: formData.subject,
              personality: 'friendly',
              welcome_message: `Olá! Sou ${formData.name}, seu assistente especializado em ${formData.subject}. Como posso ajudá-lo hoje?`,
              guardrails: {
                creativityLevel: 50,
                citationMode: true,
                antiCheatMode: true,
                transparencyMode: true
              }
            };
            
            onComplete(assistantData);
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Bem-vindo ao Mentor AI!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Vamos criar seu primeiro assistente de IA em menos de 60 segundos. 
                Prepare-se para ver a mágica acontecer!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 border rounded-lg">
                <Youtube className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Vídeo YouTube</h3>
                <p className="text-xs text-gray-600">Cole um link de aula</p>
              </div>
              <div className="p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">PDF/Documento</h3>
                <p className="text-xs text-gray-600">Envie um arquivo</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Upload className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Texto Próprio</h3>
                <p className="text-xs text-gray-600">Cole seu conteúdo</p>
              </div>
            </div>

            <Button onClick={() => { setStep(2); setProgress(25); }} size="lg" className="mt-6">
              Vamos começar!
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Configuração Rápida
              </h2>
              <p className="text-gray-600">
                Só algumas informações básicas e seu conteúdo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Assistente
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Professor Carlos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matéria
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Matemática"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Escolha o tipo de conteúdo:
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  variant={contentType === 'youtube' ? 'default' : 'outline'}
                  onClick={() => setContentType('youtube')}
                  className="flex flex-col p-4 h-auto"
                >
                  <Youtube className="h-6 w-6 mb-1" />
                  <span className="text-xs">YouTube</span>
                </Button>
                <Button
                  variant={contentType === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setContentType('pdf')}
                  className="flex flex-col p-4 h-auto"
                >
                  <FileText className="h-6 w-6 mb-1" />
                  <span className="text-xs">PDF</span>
                </Button>
                <Button
                  variant={contentType === 'text' ? 'default' : 'outline'}
                  onClick={() => setContentType('text')}
                  className="flex flex-col p-4 h-auto"
                >
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-xs">Texto</span>
                </Button>
              </div>

              {contentType === 'youtube' && (
                <Input
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                />
              )}

              {contentType === 'pdf' && (
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                />
              )}

              {contentType === 'text' && (
                <Textarea
                  value={formData.textContent}
                  onChange={(e) => setFormData({...formData, textContent: e.target.value})}
                  placeholder="Cole aqui o conteúdo da sua aula..."
                  rows={4}
                />
              )}
            </div>

            <Button 
              onClick={handleContentSubmit} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              Criar Assistente Mágico ✨
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Criando sua IA especializada...
              </h2>
              <p className="text-gray-600">
                Estamos analisando seu conteúdo e criando um especialista no assunto
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-500">{Math.round(progress)}% concluído</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">O que está acontecendo:</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Processando conteúdo
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Criando base de conhecimento
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Configurando personalidade da IA
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                🎉 Assistente Criado com Sucesso!
              </h2>
              <p className="text-gray-600">
                Seu assistente {formData.name} está pronto para revolucionar o aprendizado
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Seu assistente já pode:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-gray-700">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  Responder sobre {formData.subject}
                </div>
                <div className="flex items-center text-gray-700">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  Citar fontes automaticamente
                </div>
                <div className="flex items-center text-gray-700">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  Detectar tentativas de cola
                </div>
                <div className="flex items-center text-gray-700">
                  <Badge variant="outline" className="mr-2">✓</Badge>
                  Gerar exercícios sob demanda
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">💡 Próximos passos:</h4>
              <ul className="text-sm text-yellow-800 space-y-1 text-left">
                <li>• Teste o chat com algumas perguntas</li>
                <li>• Publique para seus alunos</li>
                <li>• Monitore as análises de uso</li>
                <li>• Adicione mais conteúdo quando quiser</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step >= stepItem.number
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {stepItem.icon}
              </div>
              <div className="ml-2">
                <p className={`text-xs font-medium ${
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
        <Progress value={(step / 4) * 100} className="h-1" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {getStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default MagicalOnboarding;
