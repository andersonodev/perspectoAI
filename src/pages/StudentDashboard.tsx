
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userXP] = useState(350);
  const [userLevel] = useState(4);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const freemiumFeatures = [
    {
      icon: Brain,
      title: "Super-Tutor IA",
      description: "Tire dúvidas de qualquer matéria com explicações passo a passo",
      status: "Grátis",
      action: "Usar agora",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      title: "Gerador de Flashcards",
      description: "Tire foto das suas anotações e gere flashcards automáticos",
      status: "3/mês grátis",
      action: "Criar flashcards",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Map,
      title: "Mapas Mentais IA",
      description: "Crie mapas mentais visuais de qualquer conceito",
      status: "2/mês grátis",
      action: "Gerar mapa",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Calendar,
      title: "Plano de Estudos",
      description: "IA cria cronograma personalizado para suas provas",
      status: "Básico grátis",
      action: "Criar plano",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const achievements = [
    { icon: "🎯", name: "Primeira Pergunta", earned: true },
    { icon: "📚", name: "Estudante Dedicado", earned: true },
    { icon: "🔥", name: "Sequência de 7 dias", earned: false },
    { icon: "🧠", name: "Mestre dos Flashcards", earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-blue-900">Mentor IA</h1>
                  <p className="text-sm text-blue-700">Estudante</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">{userXP} XP</span>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1 rounded-full">
                  <Trophy className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-900">Nível {userLevel}</span>
                </div>
              </div>
              
              <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-emerald-500">
                <AvatarFallback className="text-white text-sm bg-gradient-to-br from-blue-500 to-emerald-500">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button variant="ghost" onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao seu espaço de estudos! 🚀
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Acelere seus estudos com ferramentas de IA. Comece gratuitamente e descubra como a inteligência artificial pode potencializar seu aprendizado.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Features */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Ferramentas Inteligentes
              </h2>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                Freemium
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {freemiumFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {feature.status}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {feature.description}
                    </p>
                    
                    <Button 
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
            <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Desbloqueie Todo o Potencial
                </h3>
                <p className="text-gray-600 mb-4">
                  Crie assistentes personalizados, upload ilimitado, funcionalidades avançadas e muito mais!
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white">
                  Upgrade para Pro
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-blue-50 border-blue-200">
                  <Users className="h-4 w-4 mr-2" />
                  Entrar em uma turma
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-emerald-50 border-emerald-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar assistente pessoal
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50 border-purple-200">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan para flashcards
                </Button>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-900">
                  <Trophy className="h-5 w-5 mr-2 text-emerald-600" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg ${achievement.earned ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                      <span className="text-lg">{achievement.icon}</span>
                      <span className={`text-sm flex-1 ${achievement.earned ? 'text-emerald-800' : 'text-gray-500'}`}>
                        {achievement.name}
                      </span>
                      {achievement.earned && (
                        <Star className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">3 dias seguidos</h3>
                <p className="text-orange-100 text-sm">Continue estudando para manter sua sequência!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
