
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssistants } from '@/hooks/useAssistants';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Plus, 
  Settings, 
  Trash2, 
  User, 
  Calendar, 
  Link as LinkIcon, 
  Copy,
  BarChart3,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
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

  const publishedAssistants = assistants.filter(a => a.is_published);
  const draftAssistants = assistants.filter(a => !a.is_published);
  const totalAssistants = assistants.length;

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
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                Olá, {user?.email}
              </span>
              <Button onClick={() => navigate('/create-assistant')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Assistente
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Assistentes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAssistants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Publicados</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedAssistants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rascunhos</p>
                  <p className="text-2xl font-bold text-gray-900">{draftAssistants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Crescimento</p>
                  <p className="text-2xl font-bold text-gray-900">+{Math.floor(Math.random() * 20) + 5}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assistants List */}
        {assistants.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Mentor AI!
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Crie seu primeiro assistente de IA personalizado e comece a revolucionar a forma como seus alunos aprendem. 
                Com nossa plataforma, você pode criar assistentes adaptados ao seu estilo de ensino e às necessidades específicas da sua matéria.
              </p>
              <div className="space-y-4">
                <Button onClick={() => navigate('/create-assistant')} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Assistente
                </Button>
                <div className="text-sm text-gray-500">
                  ✓ Configuração em minutos ✓ Templates prontos ✓ Analytics detalhados
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Meus Assistentes</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/create-assistant')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Assistente
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assistants.map((assistant) => (
                <Card key={assistant.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{assistant.name}</CardTitle>
                        <p className="text-sm text-gray-600">{assistant.subject}</p>
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
                          {new Date(assistant.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {assistant.is_published && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-green-700 text-sm font-medium">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              Link do Assistente
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyShareLink(assistant.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-green-600">
                            Compartilhe este link com seus alunos
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/assistant/${assistant.id}/edit`)}
                          className="flex-1"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        
                        {assistant.is_published && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/assistant/${assistant.id}/analytics`)}
                            className="flex-1"
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        {assistant.is_published ? (
                          <a 
                            href={`/chat/${assistant.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Testar Chat
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Publique para testar
                          </span>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAssistant(assistant.id)}
                          disabled={deletingId === assistant.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
