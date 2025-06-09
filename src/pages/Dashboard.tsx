import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, Settings, Trash2, User, Calendar, Link as LinkIcon, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { assistants, loading, deleteAssistant } = useAssistants();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteAssistant = async (id: string) => {
    setDeletingId(id);
    await deleteAssistant(id);
    setDeletingId(null);
  };

  const copyShareLink = (assistantId: string) => {
    const link = `${window.location.origin}/chat/${assistantId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência."
    });
  };

  if (loading) {
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">
                Meus Assistentes
              </h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600 text-sm">
                Olá, {user?.email}
              </span>
              <Button onClick={() => navigate('/create-assistant')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {assistants.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum assistente criado ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Crie seu primeiro assistente de IA para começar a ajudar seus alunos.
              </p>
              <Button onClick={() => navigate('/create-assistant')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Assistente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistants.map((assistant) => (
              <Card key={assistant.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{assistant.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{assistant.subject}</p>
                    </div>
                    <Badge variant={assistant.is_published ? "default" : "secondary"}>
                      {assistant.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>
                        {assistant.personality === 'friendly' && 'Amigável'}
                        {assistant.personality === 'formal' && 'Formal'}
                        {assistant.personality === 'socratic' && 'Socrático'}
                        {assistant.personality === 'creative' && 'Criativo'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Criado em {new Date(assistant.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {assistant.is_published && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-700 text-sm">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Link para alunos
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyShareLink(assistant.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Clique no ícone para copiar o link
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/assistant/${assistant.id}/edit`)}
                        className="flex-1"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssistant(assistant.id)}
                        disabled={deletingId === assistant.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deletingId === assistant.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
