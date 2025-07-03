
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  BookOpen, 
  Users, 
  Plus, 
  Sparkles, 
  Target, 
  Calendar,
  Trophy,
  Star,
  Zap,
  FileText,
  Camera,
  Map,
  Clock,
  ArrowRight,
  MessageSquare,
  GitBranch,
  Crown,
  Gem
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SuperTutorChat from '@/components/SuperTutorChat';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import MindMapGenerator from '@/components/MindMapGenerator';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userXP] = useState(350);
  const [userLevel] = useState(4);
  const [activeTab, setActiveTab] = useState('overview');
  const [classCode, setClassCode] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleJoinClass = () => {
    if (classCode.trim()) {
      // Logic to join class
      console.log('Joining class:', classCode);
    }
  };

  const freemiumFeatures = [
    {
      id: 'tutor',
      icon: Brain,
      title: "Super-Tutor IA",
      description: "Tire dúvidas de qualquer matéria com explicações passo a passo",
      status: "Grátis",
      action: "Usar agora",
      color: "from-primary to-primary/80",
      bgColor: "from-primary/10 to-primary/5"
    },
    {
      id: 'flashcards',
      icon: FileText,
      title: "Gerador de Flashcards",
      description: "Tire foto das suas anotações e gere flashcards automáticos",
      status: "3/mês grátis",
      action: "Criar flashcards",
      color: "from-secondary to-secondary/80",
      bgColor: "from-secondary/10 to-secondary/5"
    },
    {
      id: 'mindmap',
      icon: Map,
      title: "Mapas Mentais IA",
      description: "Crie mapas mentais visuais de qualquer conceito",
      status: "3/mês grátis",
      action: "Gerar mapa",
      color: "from-primary to-secondary",
      bgColor: "from-accent/20 to-accent/10"
    },
    {
      id: 'planner',
      icon: Calendar,
      title: "Plano de Estudos",
      description: "IA cria cronograma personalizado para suas provas",
      status: "Básico grátis",
      action: "Criar plano",
      color: "from-secondary to-warning",
      bgColor: "from-warning/10 to-warning/5"
    }
  ];

  const achievements = [
    { icon: "🎯", name: "Primeira Pergunta", earned: true },
    { icon: "📚", name: "Estudante Dedicado", earned: true },
    { icon: "🔥", name: "Sequência de 7 dias", earned: false },
    { icon: "🧠", name: "Mestre dos Flashcards", earned: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Mentor IA</h1>
                  <p className="text-sm text-muted-foreground">Estudante</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{userXP} XP</span>
                </div>
                <div className="flex items-center space-x-2 bg-secondary/20 px-3 py-1 rounded-full border border-secondary/30">
                  <Trophy className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Nível {userLevel}</span>
                </div>
              </div>
              
              <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-secondary">
                <AvatarFallback className="text-white text-sm bg-gradient-to-br from-primary to-secondary">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo ao seu espaço de estudos! 🚀
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Acelere seus estudos com ferramentas de IA. Comece gratuitamente e descubra como a inteligência artificial pode potencializar seu aprendizado.
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Target className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="tutor" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              Super-Tutor
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="data-[state=active]:bg-accent data-[state=active]:text-foreground">
              <Map className="h-4 w-4 mr-2" />
              Mapas Mentais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Features */}
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Ferramentas Inteligentes
                  </h2>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    Freemium
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {freemiumFeatures.map((feature, index) => (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border">
                            {feature.status}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {feature.description}
                        </p>
                        
                        <Button 
                          onClick={() => setActiveTab(feature.id)}
                          className={`w-full bg-gradient-to-r ${feature.color} hover:shadow-lg transition-all duration-300`}
                          size="sm"
                        >
                          {feature.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Premium Upgrade */}
                <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Desbloqueie Todo o Potencial
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Crie assistentes personalizados, upload ilimitado, funcionalidades avançadas e muito mais!
                    </p>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                      Upgrade para Pro
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-foreground">
                      <Target className="h-5 w-5 mr-2 text-primary" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Input
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Código da turma"
                        className="bg-background border-border"
                      />
                      <Button 
                        onClick={handleJoinClass}
                        variant="outline" 
                        className="w-full justify-start bg-card hover:bg-accent border-border text-foreground"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Entrar em uma turma
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full justify-start bg-card hover:bg-accent border-border text-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar assistente pessoal
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('flashcards')}
                      variant="outline" 
                      className="w-full justify-start bg-card hover:bg-accent border-border text-foreground"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Scan para flashcards
                    </Button>
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card className="bg-card/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-foreground">
                      <Trophy className="h-5 w-5 mr-2 text-secondary" />
                      Conquistas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.map((achievement, index) => (
                        <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg border ${achievement.earned ? 'bg-success/20 border-success/30' : 'bg-muted/50 border-border'}`}>
                          <span className="text-lg">{achievement.icon}</span>
                          <span className={`text-sm flex-1 ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {achievement.name}
                          </span>
                          {achievement.earned && (
                            <Star className="h-4 w-4 text-success" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Study Streak */}
                <Card className="bg-gradient-to-br from-secondary to-warning text-white border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">3 dias seguidos</h3>
                    <p className="text-white/80 text-sm">Continue estudando para manter sua sequência!</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tutor">
            <SuperTutorChat />
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashcardGenerator />
          </TabsContent>

          <TabsContent value="mindmap">
            <MindMapGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
