
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  Bot, 
  Users, 
  BarChart3, 
  Settings, 
  Share2, 
  Eye,
  EyeOff,
  Trash2,
  Edit,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistants } from '@/hooks/useAssistants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: assistants, isLoading, refetch } = useAssistants(user?.id);
  const [updatingAssistant, setUpdatingAssistant] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleTogglePublish = async (assistantId: string, currentlyPublished: boolean) => {
    setUpdatingAssistant(assistantId);
    try {
      const { error } = await supabase
        .from('ai_assistants')
        .update({ is_published: !currentlyPublished })
        .eq('id', assistantId);

      if (error) throw error;

      toast({
        title: currentlyPublished ? "Assistente despublicado" : "Assistente publicado",
        description: currentlyPublished 
          ? "Seu assistente não está mais visível para estudantes." 
          : "Seu assistente está agora disponível para estudantes!",
      });

      refetch();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de publicação.",
        variant: "destructive"
      });
    } finally {
      setUpdatingAssistant(null);
    }
  };

  const handleDeleteAssistant = async (assistantId: string, assistantName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o assistente "${assistantName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ai_assistants')
        .delete()
        .eq('id', assistantId);

      if (error) throw error;

      toast({
        title: "Assistente excluído",
        description: `O assistente "${assistantName}" foi excluído com sucesso.`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o assistente.",
        variant: "destructive"
      });
    }
  };

  const copyShareLink = (assistantId: string, assistantName: string) => {
    const shareUrl = `${window.location.origin}/chat/${assistantId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiado!",
      description: `Link de compartilhamento do assistente "${assistantName}" copiado para a área de transferência.`,
    });
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'friendly': return '😊';
      case 'formal': return '🎓';
      case 'socratic': return '🤔';
      case 'creative': return '🎨';
      default: return '🤖';
    }
  };

  const getPersonalityLabel = (personality: string) => {
    switch (personality) {
      case 'friendly': return 'Amigável';
      case 'formal': return 'Formal';
      case 'socratic': return 'Socrático';
      case 'creative': return 'Criativo';
      default: return 'Padrão';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
                alt="Mentor AI" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600">
                  <AvatarFallback className="text-white text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user?.email}</p>
                  <p className="text-slate-600">Educador</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleSignOut} className="text-slate-600">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo ao seu Dashboard! 👋
          </h1>
          <p className="text-slate-600">
            Gerencie seus assistentes de IA e acompanhe o progresso dos estudantes.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total de Assistentes</p>
                  <p className="text-2xl font-bold">{assistants?.length || 0}</p>
                </div>
                <Bot className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Publicados</p>
                  <p className="text-2xl font-bold">
                    {assistants?.filter(a => a.is_published).length || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Interações Hoje</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Taxa de Satisfação</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assistants List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Meus Assistentes</h2>
              <Link to="/create-assistant">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Assistente
                </Button>
              </Link>
            </div>

            {assistants && assistants.length > 0 ? (
              <div className="space-y-4">
                {assistants.map((assistant) => (
                  <Card key={assistant.id} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600">
                            <AvatarFallback className="text-white font-semibold">
                              {getPersonalityIcon(assistant.personality)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 truncate">
                                {assistant.name}
                              </h3>
                              <Badge 
                                variant={assistant.is_published ? "default" : "secondary"}
                                className={assistant.is_published 
                                  ? "bg-green-100 text-green-700 border-green-200" 
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                                }
                              >
                                {assistant.is_published ? (
                                  <>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Publicado
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Rascunho
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            <p className="text-slate-600 mb-3">{assistant.subject}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                {getPersonalityLabel(assistant.personality)}
                              </Badge>
                              
                              {assistant.guardrails?.citationMode && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  📚 Cita Fontes
                                </Badge>
                              )}
                              
                              {assistant.guardrails?.antiCheatMode && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  🛡️ Anti-Cola
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(assistant.id, assistant.is_published)}
                            disabled={updatingAssistant === assistant.id}
                            className="text-slate-600 hover:text-indigo-600"
                          >
                            {assistant.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          
                          {assistant.is_published && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyShareLink(assistant.id, assistant.name)}
                              className="text-slate-600 hover:text-green-600"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Link to={`/assistant/${assistant.id}/analytics`}>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-purple-600">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Link to={`/assistant/${assistant.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssistant(assistant.id, assistant.name)}
                            className="text-slate-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Nenhum assistente criado ainda
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Crie seu primeiro assistente de IA para começar a personalizar a experiência de aprendizado dos seus estudantes.
                  </p>
                  <Link to="/create-assistant">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Assistente
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/create-assistant" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Assistente
                  </Button>
                </Link>
                <Link to="/transparency" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Transparência da IA
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-slate-600">23 interações nos últimos 7 dias</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-slate-600">2 novos feedbacks positivos</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-slate-600">1 assistente publicado hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-amber-900">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Dica do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800">
                  💡 Use o modo "transparência" para que os estudantes vejam como a IA chegou às respostas, promovendo maior confiança e aprendizado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
