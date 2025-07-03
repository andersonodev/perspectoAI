
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
  Gem,
  Timer,
  StickyNote,
  TrendingUp,
  Menu,
  X,
  Bell,
  Settings,
  Home,
  Search,
  Heart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SuperTutorChat from '@/components/SuperTutorChat';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import MindMapGenerator from '@/components/MindMapGenerator';
import StudyTimer from '@/components/StudyTimer';
import ProgressTracker from '@/components/ProgressTracker';
import QuickNotes from '@/components/QuickNotes';
import AITutorNetwork from '@/components/AITutorNetwork';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userXP] = useState(350);
  const [userLevel] = useState(4);
  const [activeTab, setActiveTab] = useState('overview');
  const [classCode, setClassCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen modern-gradient-bg">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-secondary shadow-lg">
                <AvatarFallback className="text-white font-bold bg-gradient-to-br from-primary to-secondary">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gradient-student">Mentor IA</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-primary" />
                  {userXP} XP • Nível {userLevel}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 p-0"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mt-4 p-4 glass-card rounded-2xl border border-border/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Progresso Diário</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {userXP} XP
                  </Badge>
                </div>
                <Button onClick={handleSignOut} variant="outline" className="w-full">
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="mobile-nav px-4">
          {[
            { id: 'overview', icon: Home, label: 'Início' },
            { id: 'tools', icon: Sparkles, label: 'Ferramentas' },
            { id: 'tutor', icon: Brain, label: 'Tutor IA' },
            { id: 'progress', icon: TrendingUp, label: 'Progresso' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <Card className="feature-card bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Bem-vindo de volta! 🚀
                </h1>
                <p className="text-muted-foreground text-sm mb-4">
                  Continue sua jornada de aprendizado com IA
                </p>
                <div className="flex justify-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Trophy className="h-3 w-3 mr-1" />
                    Nível {userLevel}
                  </Badge>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    <Star className="h-3 w-3 mr-1" />
                    {userXP} XP
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="mini-feature-card text-center">
                <CardContent className="p-4">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">2h 30m</div>
                  <div className="text-xs text-muted-foreground">Hoje</div>
                </CardContent>
              </Card>
              <Card className="mini-feature-card text-center">
                <CardContent className="p-4">
                  <Target className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">5 dias</div>
                  <div className="text-xs text-muted-foreground">Sequência</div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {freemiumFeatures.map((feature, index) => (
                <Card key={index} className="feature-card mobile-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                          {feature.title}
                        </h3>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                      {feature.description}
                    </p>
                    <Button 
                      onClick={() => setActiveTab(feature.id === 'planner' ? 'tools' : feature.id)}
                      className={`w-full bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                      size="sm"
                    >
                      {feature.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium Upgrade */}
            <Card className="feature-card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-dashed border-purple-500/30">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Upgrade para Pro
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Ferramentas ilimitadas e IA avançada
                </p>
                <Button className="premium-button w-full">
                  Começar Agora
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gradient-student mb-2">
                Ferramentas de Estudo
              </h2>
              <p className="text-muted-foreground text-sm">
                Maximize seu aprendizado com IA
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudyTimer />
              <ProgressTracker />
              <QuickNotes />
              <AITutorNetwork />
            </div>
          </div>
        )}

        {/* Tutor Tab */}
        {activeTab === 'tutor' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gradient-student mb-2">
                Super-Tutor IA
              </h2>
              <p className="text-muted-foreground text-sm">
                Seu professor pessoal de IA
              </p>
            </div>
            <SuperTutorChat />
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gradient-student mb-2">
                Seu Progresso
              </h2>
              <p className="text-muted-foreground text-sm">
                Acompanhe sua evolução nos estudos
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressTracker />
              
              {/* Achievements */}
              <Card className="feature-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-success/20 border border-success/30' 
                          : 'bg-muted/50 border border-border'
                      }`}>
                        <span className="text-xl">{achievement.icon}</span>
                        <span className={`text-sm flex-1 font-medium ${
                          achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
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
              <Card className="feature-card bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sequência de Estudos</h3>
                  <div className="text-3xl font-bold mb-2">5 dias</div>
                  <p className="text-white/80 text-sm">
                    Continue estudando para manter sua sequência!
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="feature-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
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
                      className="w-full justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Entrar em turma
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('tools')}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Scan para flashcards
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tabs for Specific Tools */}
        {activeTab === 'flashcards' && <FlashcardGenerator />}
        {activeTab === 'mindmap' && <MindMapGenerator />}
      </div>

      {/* Floating Action Button */}
      <div className="floating-element">
        <Button 
          onClick={() => setActiveTab('tutor')}
          className="h-14 w-14 rounded-full student-button shadow-2xl"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
