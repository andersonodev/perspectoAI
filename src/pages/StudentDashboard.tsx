import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BookOpen, 
  Calendar,
  Trophy,
  Star,
  BarChart3,
  History,
  FileText,
  Clock,
  MessageSquare,
  Menu,
  Bell,
  Home,
  Target,
  Timer,
  Zap,
  TrendingUp,
  Award,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ChevronRight,
  Flame,
  X,
  Settings,
  LogOut,
  Users,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  Circle,
  BookMarked,
  PenTool,
  Lightbulb,
  Calendar as CalendarIcon,
  Clock3,
  GraduationCap,
  BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 minutos
  const [currentStreak, setCurrentStreak] = useState(7);
  const [weeklyGoal, setWeeklyGoal] = useState(20);
  const [studiedToday, setStudiedToday] = useState(3.5);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      // Play sound or show notification
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-500' },
    { id: 'study', icon: Timer, label: 'Cronômetro', color: 'text-green-500' },
    { id: 'subjects', icon: BookOpen, label: 'Matérias', color: 'text-purple-500' },
    { id: 'calendar', icon: CalendarIcon, label: 'Cronograma', color: 'text-orange-500' },
    { id: 'flashcards', icon: Zap, label: 'Flashcards', color: 'text-yellow-500' },
    { id: 'practice', icon: Target, label: 'Simulados', color: 'text-red-500' },
    { id: 'notes', icon: PenTool, label: 'Anotações', color: 'text-indigo-500' },
    { id: 'stats', icon: BarChart3, label: 'Estatísticas', color: 'text-cyan-500' },
    { id: 'chat', icon: MessageSquare, label: 'IA Tutor', color: 'text-pink-500' }
  ];

  const subjects = [
    { name: 'Direito Constitucional', progress: 75, color: 'bg-blue-500', studiedToday: 2.5, nextReview: 'Hoje' },
    { name: 'Direito Administrativo', progress: 45, color: 'bg-green-500', studiedToday: 1.0, nextReview: 'Amanhã' },
    { name: 'Português', progress: 90, color: 'bg-purple-500', studiedToday: 0, nextReview: '2 dias' },
    { name: 'Raciocínio Lógico', progress: 60, color: 'bg-orange-500', studiedToday: 0, nextReview: 'Hoje' },
    { name: 'Informática', progress: 30, color: 'bg-red-500', studiedToday: 0, nextReview: '3 dias' }
  ];

  const todayTasks = [
    { subject: 'Direito Constitucional', task: 'Revisão dos Direitos Fundamentais', time: '1h', completed: false, priority: 'high' },
    { subject: 'Português', task: 'Exercícios de Concordância', time: '30min', completed: true, priority: 'medium' },
    { subject: 'Raciocínio Lógico', task: 'Problemas de Sequência', time: '45min', completed: false, priority: 'high' },
    { subject: 'Direito Administrativo', task: 'Atos Administrativos', time: '1h30min', completed: false, priority: 'low' }
  ];

  const weekStats = [
    { day: 'Seg', hours: 4.5, goal: 3 },
    { day: 'Ter', hours: 3.2, goal: 3 },
    { day: 'Qua', hours: 5.1, goal: 3 },
    { day: 'Qui', hours: 2.8, goal: 3 },
    { day: 'Sex', hours: 4.0, goal: 3 },
    { day: 'Sáb', hours: 6.2, goal: 4 },
    { day: 'Dom', hours: 3.5, goal: 3 }
  ];

  const renderSidebar = () => (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`
        fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:block
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PerspectoAI
                </h1>
                <p className="text-xs text-gray-500">Estudos</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? item.color : ''}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300"
                onClick={() => {}}
              >
                <Settings className="h-5 w-5" />
                <span className="text-sm">Configurações</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 dark:text-red-400"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Estudado Hoje</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{studiedToday}h</p>
              </div>
              <Clock3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Sequência</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{currentStreak}</p>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Meta Semanal</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round((studiedToday / weeklyGoal) * 100)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Rank</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">#47</p>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Timer */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-500" />
              Cronômetro Pomodoro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-4">
                {formatTime(timerSeconds)}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => setTimerActive(!timerActive)}
                  className={timerActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                >
                  {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTimerActive(false);
                    setTimerSeconds(1500);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Foco (25min)</span>
                <span>Pausa (5min)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setTimerSeconds(1500)}>25:00</Button>
                <Button variant="outline" size="sm" onClick={() => setTimerSeconds(300)}>05:00</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Tarefas de Hoje
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <button className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                        {task.task}
                      </span>
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {task.subject} • {task.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Progresso das Matérias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{subject.name}</h3>
                  <Badge variant="outline" className="text-xs">{subject.nextReview}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progresso</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Estudado hoje: {subject.studiedToday}h
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-cyan-500" />
            Estatísticas da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekStats.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-gray-500 mb-2">{day.day}</div>
                <div className="relative h-24 bg-gray-100 dark:bg-gray-800 rounded">
                  <div 
                    className={`absolute bottom-0 w-full rounded ${day.hours >= day.goal ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ height: `${Math.min((day.hours / 6) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs font-medium mt-2 text-gray-700 dark:text-gray-300">
                  {day.hours}h
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'subjects':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h2 className="text-xl font-semibold mb-2">Matérias</h2>
              <p className="text-gray-600 dark:text-gray-300">Gerencie suas matérias e conteúdos de estudo.</p>
            </CardContent>
          </Card>
        );
      case 'study':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <Timer className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-semibold mb-2">Cronômetro de Estudos</h2>
              <p className="text-gray-600 dark:text-gray-300">Use técnicas de Pomodoro para otimizar seus estudos.</p>
            </CardContent>
          </Card>
        );
      case 'calendar':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h2 className="text-xl font-semibold mb-2">Cronograma</h2>
              <p className="text-gray-600 dark:text-gray-300">Organize seu cronograma de estudos.</p>
            </CardContent>
          </Card>
        );
      case 'flashcards':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
              <p className="text-gray-600 dark:text-gray-300">Revise com flashcards inteligentes.</p>
            </CardContent>
          </Card>
        );
      case 'practice':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Simulados</h2>
              <p className="text-gray-600 dark:text-gray-300">Pratique com simulados e questões.</p>
            </CardContent>
          </Card>
        );
      case 'notes':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <PenTool className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
              <h2 className="text-xl font-semibold mb-2">Anotações</h2>
              <p className="text-gray-600 dark:text-gray-300">Organize suas anotações de estudo.</p>
            </CardContent>
          </Card>
        );
      case 'stats':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
              <h2 className="text-xl font-semibold mb-2">Estatísticas</h2>
              <p className="text-gray-600 dark:text-gray-300">Analise seu desempenho nos estudos.</p>
            </CardContent>
          </Card>
        );
      case 'chat':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-pink-500" />
              <h2 className="text-xl font-semibold mb-2">IA Tutor</h2>
              <p className="text-gray-600 dark:text-gray-300">Converse com sua IA tutora personalizada.</p>
            </CardContent>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:flex">
      {renderSidebar()}
      
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Bem-vindo de volta, {user?.email?.split('@')[0]}!
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
                <ThemeToggle />
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;