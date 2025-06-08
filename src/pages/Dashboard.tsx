
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistants } from '@/hooks/useAssistants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Plus, Settings, Users, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { assistants, loading } = useAssistants();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPersonalityLabel = (personality: string) => {
    const labels = {
      friendly: 'Amigável',
      formal: 'Formal',
      socratic: 'Socrático',
      creative: 'Criativo'
    };
    return labels[personality as keyof typeof labels] || personality;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Mentor IA</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Assistentes</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assistants.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assistentes Publicados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assistants.filter(a => a.is_published).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assistants.filter(a => !a.is_published).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Meus Assistentes</h2>
          <Button onClick={() => navigate('/create-assistant')}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Novo Assistente
          </Button>
        </div>

        {/* Assistants Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando assistentes...</p>
          </div>
        ) : assistants.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum assistente criado ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando seu primeiro assistente de IA personalizado
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{assistant.name}</CardTitle>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assistant.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assistant.is_published ? 'Publicado' : 'Rascunho'}
                    </div>
                  </div>
                  <CardDescription>{assistant.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Personalidade:</span>
                      <span className="font-medium">{getPersonalityLabel(assistant.personality)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Criado em:</span>
                      <span className="font-medium">{formatDate(assistant.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/assistant/${assistant.id}/edit`)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    {assistant.is_published && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/assistant/${assistant.id}/analytics`)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    )}
                  </div>
                  
                  {assistant.is_published && (
                    <div className="mt-3 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-700 mb-1">Link para compartilhar:</p>
                      <code className="text-xs text-blue-800 break-all">
                        {window.location.origin}/chat/{assistant.id}
                      </code>
                    </div>
                  )}
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
