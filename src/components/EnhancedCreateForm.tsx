
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, FileText, Shield, Eye, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AIControlSettings from '@/components/AIControlSettings';
import MultipleKnowledgeUpload from '@/components/MultipleKnowledgeUpload';

interface KnowledgeSource {
  id: string;
  type: 'file' | 'text' | 'youtube' | 'url';
  title: string;
  content?: string;
  file?: File;
  url?: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
}

interface FormData {
  name: string;
  subject: string;
  personality: 'friendly' | 'formal' | 'socratic' | 'creative';
  welcome_message: string;
  instructions: string;
  is_published: boolean;
}

interface AISettings {
  creativityLevel: number;
  citationMode: boolean;
  antiCheatMode: boolean;
  transparencyMode: boolean;
}

interface EnhancedCreateFormProps {
  onSubmit: (data: {
    formData: FormData;
    aiSettings: AISettings;
    knowledgeSources: KnowledgeSource[];
  }) => Promise<void>;
  loading?: boolean;
}

const EnhancedCreateForm = ({ onSubmit, loading = false }: EnhancedCreateFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    personality: 'friendly',
    welcome_message: '',
    instructions: '',
    is_published: false
  });

  const [aiSettings, setAiSettings] = useState<AISettings>({
    creativityLevel: 50,
    citationMode: true,
    antiCheatMode: true,
    transparencyMode: true
  });

  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAISettingsChange = (newSettings: AISettings) => {
    setAiSettings(newSettings);
  };

  const handleKnowledgeChange = (sources: KnowledgeSource[]) => {
    setKnowledgeSources(sources);
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

    await onSubmit({
      formData,
      aiSettings,
      knowledgeSources
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Criar Assistente Completo</h2>
          <p className="text-gray-600">Configure todos os aspectos do seu assistente de IA</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.is_published}
            onCheckedChange={(checked) => handleInputChange('is_published', checked)}
          />
          <Label className="text-sm">Publicado</Label>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="basic" className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Básico
          </TabsTrigger>
          <TabsTrigger value="ai-control" className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            IA
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            Base
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Configurações Básicas */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Básicas</CardTitle>
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
          <MultipleKnowledgeUpload
            onKnowledgeChange={handleKnowledgeChange}
            initialSources={knowledgeSources}
          />
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Assistente</CardTitle>
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
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {knowledgeSources.length} fontes de conhecimento
                  </span>
                </div>

                {knowledgeSources.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Fontes de Conhecimento:</h4>
                    <div className="space-y-1">
                      {knowledgeSources.map(source => (
                        <div key={source.id} className="text-xs text-gray-600 flex items-center">
                          {source.type === 'file' && <FileText className="h-3 w-3 mr-1" />}
                          {source.type === 'youtube' && <Eye className="h-3 w-3 mr-1" />}
                          {source.type === 'text' && <FileText className="h-3 w-3 mr-1" />}
                          <span>{source.title || `${source.type} sem título`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading} size="lg">
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
      </div>
    </div>
  );
};

export default EnhancedCreateForm;
