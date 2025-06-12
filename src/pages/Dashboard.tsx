
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
  EyeOff,
  Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { assistants, loading, deleteAssistant, updateAssistant } = useAssistants();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handleDeleteAssistant = async (id: string) => {
    setDeletingId(id);
    await deleteAssistant(id);
    setDeletingId(null);
  };

  const handleTogglePublish = async (assistant: any) => {
    setPublishingId(assistant.id);
    await updateAssistant(assistant.id, { is_published: !assistant.is_published });
    setPublishingId(null);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 text-sm font-medium">
                Olá, {user?.email}
              </span>
              <Button 
                onClick={() => navigate('/create-assistant')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Assistente
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total de Assistentes</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{totalAssistants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Publicados</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{publishedAssistants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Rascunhos</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{draftAssistants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assistants List */}
        {assistants.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                Bem-vindo ao Mentor AI!
              </h3>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Crie seu primeiro assistente de IA personalizado e comece a revolucionar a forma como seus alunos aprendem. 
                Com nossa plataforma, você pode criar assistentes adaptados ao seu estilo de ensino e às necessidades específicas da sua matéria.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/create-assistant')} 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Assistente
                </Button>
                <div className="text-sm text-slate-500 flex items-center justify-center space-x-6">
                  <span className="flex items-center">✓ Configuração em minutos</span>
                  <span className="flex items-center">✓ Templates prontos</span>
                  <span className="flex items-center">✓ Analytics detalhados</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Meus Assistentes</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/create-assistant')}
                className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Assistente
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assistants.map((assistant) => (
                <Card key={assistant.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 hover:scale-[1.02]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 font-semibold text-slate-900">{assistant.name}</CardTitle>
                        <p className="text-sm text-slate-600 font-medium">{assistant.subject}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant={assistant.is_published ? "default" : "secondary"}
                          className={assistant.is_published ? 
                            "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm" : 
                            "bg-slate-100 text-slate-700"
                          }
                        >
                          {assistant.is_published ? "Publicado" : "Rascunho"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(assistant)}
                          disabled={publishingId === assistant.id}
                          className={`h-8 w-8 p-0 ${assistant.is_published ? 
                            'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 
                            'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={assistant.is_published ? "Despublicar" : "Publicar"}
                        >
                          {publishingId === assistant.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : assistant.is_published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Globe className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {assistant.personality === 'friendly' && 'Amigável'}
                          {assistant.personality === 'formal' && 'Formal'}
                          {assistant.personality === 'socratic' && 'Socrático'}
                          {assistant.personality === 'creative' && 'Criativo'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(assistant.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {assistant.is_published && (
                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-emerald-700 text-sm font-medium">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              Link do Assistente
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyShareLink(assistant.id)}
                              className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-emerald-600">
                            Compartilhe este link com seus alunos
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/assistant/${assistant.id}/edit`)}
                          className="flex-1 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        
                        {assistant.is_published && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/assistant/${assistant.id}/analytics`)}
                            className="flex-1 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        {assistant.is_published ? (
                          <a 
                            href={`/chat/${assistant.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors duration-200"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Testar Chat
                          </a>
                        ) : (
                          <span className="text-sm text-slate-500">
                            Publique para testar
                          </span>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAssistant(assistant.id)}
                          disabled={deletingId === assistant.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 transition-all duration-200"
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
