
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { useKnowledge } from '@/hooks/useKnowledge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, Trash2, Plus, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EditAssistant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assistants, updateAssistant, loading: assistantsLoading } = useAssistants();
  const { knowledge, uploadPDF, addKnowledge, deleteKnowledge, loading: knowledgeLoading } = useKnowledge(id || '');
  
  const [assistant, setAssistant] = useState<any>(null);
  const [textKnowledge, setTextKnowledge] = useState('');
  const [textTitle, setTextTitle] = useState('');

  useEffect(() => {
    if (assistants && id) {
      const found = assistants.find(a => a.id === id);
      if (found) {
        setAssistant(found);
      }
    }
  }, [assistants, id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Erro",
        description: "Apenas arquivos PDF são suportados.",
        variant: "destructive"
      });
      return;
    }

    await uploadPDF(file);
    event.target.value = '';
  };

  const handleAddTextKnowledge = async () => {
    if (!textTitle.trim() || !textKnowledge.trim()) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    await addKnowledge({
      content_type: 'text',
      title: textTitle,
      content: textKnowledge
    });

    setTextTitle('');
    setTextKnowledge('');
  };

  const handleUpdateAssistant = async (updates: any) => {
    if (!id) return;
    await updateAssistant(id, updates);
  };

  if (assistantsLoading || !assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-xl font-semibold text-gray-900">
              Editando: {assistant.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="knowledge" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="knowledge">Conhecimento</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="test">Testar</TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload PDF */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload de PDF
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Faça upload de PDFs com o material da sua aula. O conteúdo será extraído e usado pelo assistente.
                    </p>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span>
                          </p>
                          <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          disabled={knowledgeLoading}
                        />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Text Knowledge */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Adicionar Texto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="textTitle">Título</Label>
                      <Input
                        id="textTitle"
                        value={textTitle}
                        onChange={(e) => setTextTitle(e.target.value)}
                        placeholder="Ex: Capítulo 1 - Introdução"
                      />
                    </div>
                    <div>
                      <Label htmlFor="textContent">Conteúdo</Label>
                      <Textarea
                        id="textContent"
                        value={textKnowledge}
                        onChange={(e) => setTextKnowledge(e.target.value)}
                        placeholder="Cole aqui o texto do material..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={handleAddTextKnowledge} className="w-full">
                      Adicionar Conhecimento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Knowledge List */}
            <Card>
              <CardHeader>
                <CardTitle>Material Adicionado ({knowledge.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {knowledge.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum material adicionado ainda. Faça upload de PDFs ou adicione texto acima.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {knowledge.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">
                              {item.content_type === 'file' ? 'PDF' : 'Texto'} • {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteKnowledge(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Assistente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={assistant.is_published ? "default" : "secondary"}>
                        {assistant.is_published ? "Publicado" : "Rascunho"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateAssistant({ is_published: !assistant.is_published })}
                      >
                        {assistant.is_published ? "Despublicar" : "Publicar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Testar Assistente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Em breve você poderá testar seu assistente aqui antes de publicá-lo.
                </p>
                <Button disabled className="w-full">
                  Chat de Teste (Em desenvolvimento)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EditAssistant;
