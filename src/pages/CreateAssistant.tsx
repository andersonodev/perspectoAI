
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Brain } from 'lucide-react';

const CreateAssistant = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [personality, setPersonality] = useState<'friendly' | 'formal' | 'socratic' | 'creative'>('friendly');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createAssistant } = useAssistants();
  const navigate = useNavigate();

  const personalityOptions = [
    { value: 'friendly', label: 'Amigável e Incentivador', description: 'Tom caloroso e motivador' },
    { value: 'formal', label: 'Formal e Direto', description: 'Comunicação profissional e objetiva' },
    { value: 'socratic', label: 'Socrático', description: 'Faz perguntas para guiar o aprendizado' },
    { value: 'creative', label: 'Criativo e Divertido', description: 'Usa analogias e exemplos criativos' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

    if (assistant) {
      navigate(`/assistant/${assistant.id}/edit`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Assistente</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Professor Bio, Assistente de História..."
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Este será o nome que os alunos verão
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Matéria/Disciplina</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Biologia Celular, História do Brasil..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personality">Personalidade</Label>
                  <Select value={personality} onValueChange={(value: any) => setPersonality(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome">Mensagem de Boas-vindas (Opcional)</Label>
                  <Textarea
                    id="welcome"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Personalize a primeira mensagem que os alunos verão..."
                    rows={3}
                  />
                  <p className="text-sm text-gray-600">
                    Se deixar em branco, será gerada automaticamente
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando..." : "Criar Assistente"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-blue-900">
                    {name || "Nome do Assistente"}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Assistente de {subject || "Sua Matéria"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Mensagem de boas-vindas:
                  </div>
                  <p className="text-gray-900">
                    {welcomeMessage || 
                     (name && subject ? 
                      `Olá! Eu sou o ${name}, seu assistente de ${subject}. Como posso te ajudar hoje?` :
                      "Sua mensagem de boas-vindas aparecerá aqui..."
                     )
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Personalidade selecionada:
                  </div>
                  <p className="text-gray-900">
                    {personalityOptions.find(p => p.value === personality)?.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    {personalityOptions.find(p => p.value === personality)?.description}
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Próximos passos:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Adicionar material de ensino (PDFs, slides, textos)</li>
                    <li>Configurar regras e limites</li>
                    <li>Testar o assistente</li>
                    <li>Publicar e compartilhar com os alunos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateAssistant;
