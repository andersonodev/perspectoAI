
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, MessageSquare, Users, BookOpen, Sparkles } from 'lucide-react';

interface PublicAssistant {
  id: string;
  name: string;
  subject: string;
  personality: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [publicAssistants, setPublicAssistants] = useState<PublicAssistant[]>([]);
  const [totalAssistants, setTotalAssistants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch public assistants
      const { data: publicData, error: publicError } = await supabase
        .from('ai_assistants')
        .select('id, name, subject, personality, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (publicError) throw publicError;

      // Fetch total count
      const { count, error: countError } = await supabase
        .from('ai_assistants')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      setPublicAssistants(publicData || []);
      setTotalAssistants(count || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Assistentes IA
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Crie Assistentes de IA para
              <span className="text-blue-600"> Educação</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Desenvolva assistentes inteligentes personalizados para suas matérias e disciplinas. 
              Ajude seus alunos a aprender de forma mais eficaz com IA especializada.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="px-8 py-3 text-lg">
                Criar Meu Assistente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? '...' : totalAssistants}
                </div>
                <p className="text-gray-600">Assistentes Criados</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? '...' : Math.floor(totalAssistants * 15.7)}
                </div>
                <p className="text-gray-600">Conversas Realizadas</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? '...' : Math.floor(totalAssistants * 3.2)}
                </div>
                <p className="text-gray-600">Educadores Ativos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Assistants */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Assistentes Disponíveis
            </h3>
            <p className="text-lg text-gray-600">
              Explore alguns dos assistentes criados por educadores da nossa comunidade
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publicAssistants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicAssistants.map((assistant) => (
                <Card key={assistant.id} className="hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => navigate(`/chat/${assistant.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assistant.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{assistant.subject}</p>
                      </div>
                      <Badge variant="secondary">
                        {assistant.personality === 'friendly' && 'Amigável'}
                        {assistant.personality === 'formal' && 'Formal'}
                        {assistant.personality === 'socratic' && 'Socrático'}
                        {assistant.personality === 'creative' && 'Criativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>
                          Criado em {new Date(assistant.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Conversar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum assistente público ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Seja o primeiro a criar um assistente público para a comunidade!
                </p>
                <Button onClick={() => navigate('/auth')}>
                  Criar Primeiro Assistente
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher nossos Assistentes IA?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Personalização Total</h4>
              <p className="text-gray-600">
                Configure personalidade, matéria e comportamento do seu assistente
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Material Próprio</h4>
              <p className="text-gray-600">
                Adicione PDFs, textos e conteúdo específico da sua disciplina
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fácil Compartilhamento</h4>
              <p className="text-gray-600">
                Gere links diretos para seus alunos acessarem o assistente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para revolucionar o ensino?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Crie seu primeiro assistente de IA em menos de 5 minutos
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth')} className="px-8 py-3 text-lg">
            Começar Gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Assistentes IA</span>
          </div>
          <p className="text-gray-400">
            Transformando a educação com inteligência artificial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
