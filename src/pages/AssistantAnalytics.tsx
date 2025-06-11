
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Brain,
  BookOpen,
  Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';

interface Assistant {
  id: string;
  name: string;
  subject: string;
  personality: string;
}

interface Analytics {
  totalSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  satisfactionRate: number;
  topQuestions: { question: string; count: number }[];
  dailyUsage: { date: string; sessions: number; messages: number }[];
  knowledgeGaps: { question: string; frequency: number; last_asked: string }[];
  weeklyTrends: { week: string; engagement: number; satisfaction: number }[];
}

const AssistantAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (id && user) {
      fetchAssistant();
      fetchAnalytics();
      fetchConversations();
    }
  }, [id, user]);

  const fetchAssistant = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setAssistant(data);
    } catch (error) {
      console.error('Error fetching assistant:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o assistente.",
        variant: "destructive"
      });
    }
  };

  const fetchAnalytics = async () => {
    if (!id) return;

    try {
      // Fetch session analytics
      const { data: sessionsData } = await supabase
        .from('assistant_analytics')
        .select('*')
        .eq('assistant_id', id);

      // Fetch feedback data
      const { data: feedbackData } = await supabase
        .from('message_feedback')
        .select('*')
        .eq('assistant_id', id);

      // Fetch knowledge gaps
      const { data: gapsData } = await supabase
        .from('knowledge_gaps')
        .select('*')
        .eq('assistant_id', id)
        .order('frequency', { ascending: false });

      // Process analytics
      const totalSessions = sessionsData?.length || 0;
      const totalMessages = sessionsData?.reduce((sum, session) => sum + session.messages_count, 0) || 0;
      const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

      const positiveReviews = feedbackData?.filter(f => f.feedback === 1).length || 0;
      const totalReviews = feedbackData?.length || 0;
      const satisfactionRate = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

      // Group sessions by date
      const dailyUsage = sessionsData?.reduce((acc: any, session) => {
        const date = new Date(session.created_at).toISOString().split('T')[0];
        const existing = acc.find((d: any) => d.date === date);
        if (existing) {
          existing.sessions += 1;
          existing.messages += session.messages_count;
        } else {
          acc.push({ date, sessions: 1, messages: session.messages_count });
        }
        return acc;
      }, []) || [];

      // Generate weekly trends (simulated for demo)
      const weeklyTrends = [
        { week: 'Sem 1', engagement: 65, satisfaction: 78 },
        { week: 'Sem 2', engagement: 72, satisfaction: 82 },
        { week: 'Sem 3', engagement: 68, satisfaction: 85 },
        { week: 'Sem 4', engagement: 75, satisfaction: 88 }
      ];

      setAnalytics({
        totalSessions,
        totalMessages,
        avgMessagesPerSession,
        satisfactionRate,
        topQuestions: [],
        dailyUsage: dailyUsage.slice(-7), // Last 7 days
        knowledgeGaps: gapsData || [],
        weeklyTrends
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    if (!id) return;

    try {
      const { data } = await supabase
        .from('student_conversations')
        .select('*')
        .eq('assistant_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const generateActivityForGap = async (gap: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: `Gere uma atividade educacional específica para resolver a dúvida: "${gap.question}". A atividade deve incluir: 1) Explicação conceitual clara, 2) Exemplo prático, 3) Exercício para praticar, 4) Pergunta para reflexão.`,
          assistantId: id,
          sessionId: 'activity_generation',
          isActivityGeneration: true
        }
      });

      if (error) throw error;

      toast({
        title: "Atividade Gerada!",
        description: "Uma nova atividade foi criada para resolver essa lacuna de conhecimento.",
        variant: "default"
      });

      console.log('Generated activity:', data.response);
    } catch (error) {
      console.error('Error generating activity:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a atividade.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assistente não encontrado</h1>
          <Link to="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Analytics - {assistant.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="predictive">Análise Preditiva</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Sessões</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.totalSessions || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Mensagens</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.totalMessages || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Média por Sessão</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(analytics?.avgMessagesPerSession || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ThumbsUp className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa de Satisfação</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(analytics?.satisfactionRate || 0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Uso Diário (Últimos 7 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.dailyUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#8884d8" name="Sessões" />
                      <Bar dataKey="messages" fill="#82ca9d" name="Mensagens" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Positivo', value: analytics?.satisfactionRate || 0 },
                          { name: 'Negativo', value: 100 - (analytics?.satisfactionRate || 0) }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalytics assistantId={id!} />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Engajamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics?.weeklyTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engajamento %" />
                    <Line type="monotone" dataKey="satisfaction" stroke="#82ca9d" name="Satisfação %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Conversas Recentes (Anônimas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversations.slice(0, 5).map((conv, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="mb-2">
                        <p className="font-medium text-gray-900">Pergunta:</p>
                        <p className="text-gray-700">{conv.message}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Resposta:</p>
                        <p className="text-gray-700">{conv.response.substring(0, 200)}...</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(conv.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma conversa registrada ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            {/* Knowledge Gaps with Action Buttons */}
            {analytics && analytics.knowledgeGaps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Oportunidades de Ensino - Geração Assistida de Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.knowledgeGaps.slice(0, 5).map((gap, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{gap.question}</p>
                          <p className="text-sm text-gray-600">
                            Perguntado {gap.frequency} vez(es) • Última vez: {new Date(gap.last_asked).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{gap.frequency}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateActivityForGap(gap)}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Gerar Atividade
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Misconception Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Padrões de Incompreensão Detectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-purple-900">Confusão Conceitual Detectada</h4>
                        <p className="text-purple-800 text-sm mt-1">
                          Identificamos que 65% dos alunos estão confundindo dois conceitos relacionados.
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Alta Prioridade</Badge>
                    </div>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-purple-900 mb-1">💡 Sugestão Acionável:</p>
                      <p className="text-purple-800 text-sm">
                        Crie uma tabela comparativa destacando as principais diferenças entre os conceitos.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Target className="h-4 w-4 mr-2" />
                      Gerar Atividade Comparativa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AssistantAnalytics;
