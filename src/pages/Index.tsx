
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  Star,
  Bot,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface PublicAssistant {
  id: string;
  name: string;
  subject: string;
  personality: string;
  welcome_message: string;
  created_at: string;
}

interface Stats {
  totalAssistants: number;
  totalSessions: number;
  totalMessages: number;
  avgSatisfaction: number;
}

const Index = () => {
  const [assistants, setAssistants] = useState<PublicAssistant[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAssistants: 0,
    totalSessions: 0,
    totalMessages: 0,
    avgSatisfaction: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicAssistants();
    fetchStats();
  }, []);

  const fetchPublicAssistants = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setAssistants(data || []);
    } catch (error) {
      console.error('Error fetching assistants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Count total published assistants
      const { count: assistantCount } = await supabase
        .from('ai_assistants')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Count total sessions
      const { count: sessionCount } = await supabase
        .from('assistant_analytics')
        .select('*', { count: 'exact', head: true });

      // Sum total messages
      const { data: messagesData } = await supabase
        .from('assistant_analytics')
        .select('messages_count');

      const totalMessages = messagesData?.reduce((sum, item) => sum + item.messages_count, 0) || 0;

      // Calculate average satisfaction
      const { data: feedbackData } = await supabase
        .from('message_feedback')
        .select('feedback');

      let avgSatisfaction = 0;
      if (feedbackData && feedbackData.length > 0) {
        const positiveCount = feedbackData.filter(f => f.feedback === 1).length;
        avgSatisfaction = (positiveCount / feedbackData.length) * 100;
      }

      setStats({
        totalAssistants: assistantCount || 0,
        totalSessions: sessionCount || 0,
        totalMessages,
        avgSatisfaction: Math.round(avgSatisfaction)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredAssistants = assistants.filter(assistant =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPersonalityColor = (personality: string) => {
    const colors = {
      friendly: 'bg-green-100 text-green-800',
      formal: 'bg-blue-100 text-blue-800',
      socratic: 'bg-purple-100 text-purple-800',
      creative: 'bg-orange-100 text-orange-800'
    };
    return colors[personality as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mentor AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma de aprendizado adaptativo com assistentes de IA personalizados. 
            Transforme a educação com inteligência artificial que se adapta ao seu método de ensino.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="h-5 w-5 mr-2" />
                Criar Assistente Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => {
              document.getElementById('assistants')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <BookOpen className="h-5 w-5 mr-2" />
              Explorar Assistentes
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Impacto em Números
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalAssistants}</h3>
                <p className="text-gray-600">Assistentes Ativos</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalSessions}</h3>
                <p className="text-gray-600">Sessões de Estudo</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalMessages}</h3>
                <p className="text-gray-600">Mensagens Trocadas</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.avgSatisfaction}%</h3>
                <p className="text-gray-600">Satisfação dos Alunos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assistants Section */}
      <section id="assistants" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Assistentes Populares
            </h2>
            <p className="text-gray-600 mb-8">
              Explore assistentes criados por educadores para diferentes matérias e estilos de ensino
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por matéria ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Carregando assistentes...</p>
            </div>
          ) : filteredAssistants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssistants.map((assistant) => (
                <Card key={assistant.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{assistant.name}</CardTitle>
                        <p className="text-sm text-gray-600">{assistant.subject}</p>
                      </div>
                      <Badge className={getPersonalityColor(assistant.personality)}>
                        {getPersonalityLabel(assistant.personality)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {assistant.welcome_message || 'Um assistente especializado em ajudar alunos.'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Criado em {new Date(assistant.created_at).toLocaleDateString()}
                      </p>
                      <Link to={`/chat/${assistant.id}`}>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Conversar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum assistente encontrado' : 'Nenhum assistente disponível'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente buscar por outros termos ou explore todas as categorias.'
                  : 'Seja o primeiro a criar um assistente e compartilhar conhecimento!'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que Escolher o Mentor AI?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  IA Personalizada
                </h3>
                <p className="text-gray-600">
                  Crie assistentes com personalidades e conhecimentos específicos para suas matérias.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Analytics Detalhados
                </h3>
                <p className="text-gray-600">
                  Monitore o engajamento dos alunos e identifique oportunidades de melhoria.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Fácil Compartilhamento
                </h3>
                <p className="text-gray-600">
                  Compartilhe seus assistentes com alunos através de links simples e seguros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Revolucionar o Ensino?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie seu primeiro assistente de IA em minutos e veja como seus alunos se engajam de forma diferente.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Sparkles className="h-5 w-5 mr-2" />
              Começar Agora - É Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-gray-400">
            © 2024 Mentor AI. Transformando a educação com inteligência artificial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
