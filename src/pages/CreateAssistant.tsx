
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, Link as LinkIcon } from 'lucide-react';
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
    { value: 'friendly', label: 'Amigável e Incentivador', description: 'Tom caloroso e motivador' },
    { value: 'formal', label: 'Formal e Direto', description: 'Comunicação profissional e objetiva' },
    { value: 'socratic', label: 'Socrático', description: 'Faz perguntas para guiar o aprendizado' },
    { value: 'creative', label: 'Criativo e Divertido', description: 'Usa analogias e exemplos criativos' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const generateShareableLink = () => {
    if (!createdAssistant) return '';
    return `${window.location.origin}/chat/${createdAssistant.id}`;
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="knowledge">Material de Ensino</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Assistente</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Assistente</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Professor Bio, Assistente de História..."
                      required
                    />
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
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle>Material de Ensino</CardTitle>
                <p className="text-sm text-gray-600">
                  Adicione PDFs, slides ou textos que o assistente deve conhecer para responder às perguntas dos alunos.
                </p>
              </CardHeader>
              <CardContent>
                <KnowledgeUpload onKnowledgeChange={setKnowledge} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Como os alunos verão</CardTitle>
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

                    {knowledge.length > 0 && (
                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="text-sm font-medium text-green-700 mb-2">
                          Material disponível: {knowledge.length} item(s)
                        </div>
                        <ul className="text-sm text-green-600 space-y-1">
                          {knowledge.slice(0, 3).map((item) => (
                            <li key={item.id}>• {item.title}</li>
                          ))}
                          {knowledge.length > 3 && (
                            <li>• E mais {knowledge.length - 3} item(s)...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full" 
                      disabled={loading || !name.trim() || !subject.trim()}
                    >
                      {loading ? "Criando..." : "Criar Assistente"}
                    </Button>

                    {createdAssistant && (
                      <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          <span className="font-medium">Link para compartilhar:</span>
                        </div>
                        <div className="bg-white p-2 rounded border text-sm font-mono break-all">
                          {generateShareableLink()}
                        </div>
                        <p className="text-xs text-green-600">
                          Compartilhe este link com seus alunos para que eles possam conversar com o assistente.
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      <p><strong>Depois de criar:</strong></p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Configure regras adicionais se necessário</li>
                        <li>Teste o assistente</li>
                        <li>Publique e compartilhe com os alunos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CreateAssistant;
