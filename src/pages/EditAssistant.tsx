import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Settings, FileText, Shield, Eye, Globe, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import KnowledgeUpload from '@/components/KnowledgeUpload';
import AIControlSettings from '@/components/AIControlSettings';
import MultipleKnowledgeUpload from '@/components/MultipleKnowledgeUpload';

interface Assistant {
  id: string;
  name: string;
  subject: string;
  personality: 'friendly' | 'formal' | 'socratic' | 'creative';
  welcome_message: string | null;
  is_published: boolean;
  guardrails: {
    instructions?: string;
    creativityLevel?: number;
    citationMode?: boolean;
    antiCheatMode?: boolean;
    transparencyMode?: boolean;
  };
}

const EditAssistant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assistants, updateAssistant } = useAssistants();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishingLoading, setPublishingLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    personality: 'friendly' as 'friendly' | 'formal' | 'socratic' | 'creative',
    welcome_message: '',
    instructions: '',
    is_published: false
  });
  const [aiSettings, setAiSettings] = useState({
    creativityLevel: 50,
    citationMode: true,
    antiCheatMode: true,
    transparencyMode: true
  });

  useEffect(() => {
    if (id && assistants.length > 0) {
      const foundAssistant = assistants.find(a => a.id === id);
      if (foundAssistant) {
        setAssistant(foundAssistant);
        setFormData({
          name: foundAssistant.name,
          subject: foundAssistant.subject,
          personality: foundAssistant.personality,
          welcome_message: foundAssistant.welcome_message || '',
          instructions: foundAssistant.guardrails?.instructions || '',
          is_published: foundAssistant.is_published
        });
        setAiSettings({
          creativityLevel: foundAssistant.guardrails?.creativityLevel || 50,
          citationMode: foundAssistant.guardrails?.citationMode || true,
          antiCheatMode: foundAssistant.guardrails?.antiCheatMode || true,
          transparencyMode: foundAssistant.guardrails?.transparencyMode || true
        });
      }
    }
  }, [id, assistants]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAISettingsChange = (newSettings: typeof aiSettings) => {
    setAiSettings(newSettings);
  };

  const handleTogglePublish = async () => {
    if (!assistant) return;

    setPublishingLoading(true);
    try {
      const newPublishState = !formData.is_published;
      await updateAssistant(assistant.id, { is_published: newPublishState });
      setFormData(prev => ({ ...prev, is_published: newPublishState }));
      
      toast({
        title: newPublishState ? "Assistente publicado!" : "Assistente despublicado!",
        description: newPublishState ? 
          "Seu assistente está agora disponível para os alunos." :
          "Seu assistente não está mais visível para os alunos."
      });
    } catch (error) {
      console.error('Error toggling publish state:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de publicação.",
        variant: "destructive"
      });
    } finally {
      setPublishingLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!assistant) return;

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
      const updateData = {
        name: formData.name,
        subject: formData.subject,
        personality: formData.personality,
        welcome_message: formData.welcome_message || `Olá! Sou ${formData.name}, seu assistente de ${formData.subject}. Como posso ajudá-lo hoje?`,
        is_published: formData.is_published,
        guardrails: {
          instructions: formData.instructions,
          creativityLevel: aiSettings.creativityLevel,
          citationMode: aiSettings.citationMode,
          antiCheatMode: aiSettings.antiCheatMode,
          transparencyMode: aiSettings.transparencyMode,
          behavior: `Atue como um assistente especializado em ${formData.subject} com personalidade ${formData.personality}. ${formData.instructions}`
        }
      };

      await updateAssistant(assistant.id, updateData);
      
      toast({
        title: "Sucesso!",
        description: "Assistente atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o assistente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="mr-4 hover:bg-slate-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Editar: {assistant.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                />
                <Label className="text-sm font-medium">Publicado</Label>
              </div>
              <Button
                onClick={handleTogglePublish}
                disabled={publishingLoading}
                variant={formData.is_published ? "destructive" : "default"}
                className={formData.is_published ? 
                  "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" :
                  "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                }
              >
                {publishingLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : formData.is_published ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Globe className="h-4 w-4 mr-2" />
                )}
                {formData.is_published ? 'Despublicar' : 'Publicar'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-white shadow-sm border border-slate-200">
            <TabsTrigger value="basic" className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-1" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="ai-control" className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-1" />
              IA
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-1" />
              Base
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Configurações Básicas */}
          <TabsContent value="basic">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Configurações Básicas</CardTitle>
              </CardHeader>
              <CardContent>
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
                        onValueChange={(value: 'friendly' | 'formal' | 'socratic' | 'creative') => handleInputChange('personality', value)}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Controle da IA */}
          <TabsContent value="ai-control">
            <AIControlSettings
              settings={aiSettings}
              onSettingsChange={handleAISettingsChange}
            />
          </TabsContent>

          {/* Base de Conhecimento */}
          <TabsContent value="knowledge">
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Base de Conhecimento Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeUpload assistantId={assistant.id} />
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Adicionar Múltiplas Fontes</CardTitle>
                </CardHeader>
                <CardContent>
                  <MultipleKnowledgeUpload
                    onKnowledgeChange={(sources) => {
                      console.log('New sources to add:', sources);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Preview do Assistente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{formData.name || 'Nome do Assistente'}</h3>
                      <p className="text-sm text-gray-600">Especialista em {formData.subject || 'Sua Matéria'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {formData.welcome_message || `Olá! Sou ${formData.name || 'seu assistente'}, especializado em ${formData.subject || 'sua matéria'}. Como posso ajudá-lo hoje?`}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {formData.personality === 'friendly' && 'Amigável'}
                      {formData.personality === 'formal' && 'Formal'}
                      {formData.personality === 'socratic' && 'Socrático'}
                      {formData.personality === 'creative' && 'Criativo'}
                    </span>
                    {aiSettings.citationMode && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Cita fontes
                      </span>
                    )}
                    {aiSettings.antiCheatMode && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        Anti-cola
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão de Salvar */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAssistant;
