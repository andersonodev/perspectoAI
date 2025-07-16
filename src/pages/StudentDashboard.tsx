
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Filter,
  Plus,
  Download,
  RefreshCw,
  Circle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SuperTutorChat from '@/components/SuperTutorChat';
import ThemeToggle from '@/components/ThemeToggle';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home', active: activeSection === 'home' },
    { id: 'planos', icon: BookOpen, label: 'Planos', active: activeSection === 'planos' },
    { id: 'edital', icon: FileText, label: 'Edital', active: activeSection === 'edital' },
    { id: 'disciplinas', icon: Brain, label: 'Disciplinas', active: activeSection === 'disciplinas' },
    { id: 'planejamento', icon: Calendar, label: 'Planejamento', active: activeSection === 'planejamento' },
    { id: 'revisoes', icon: RefreshCw, label: 'Revisões', active: activeSection === 'revisoes' },
    { id: 'historico', icon: History, label: 'Histórico', active: activeSection === 'historico' },
    { id: 'estatisticas', icon: BarChart3, label: 'Estatísticas', active: activeSection === 'estatisticas' }
  ];

  const materias = [
    { nome: 'Direito Administrativo', situacao: 'BAIXO', p1: 572, p2: 178, p3: 793, star: true },
    { nome: 'Direito Constitucional', situacao: 'BAIXO', p1: 409, p2: 178, p3: 596, star: false },
    { nome: 'Ética', situacao: 'BAIXO', p1: 226, p2: 178, p3: 283, star: true },
    { nome: 'Legislação', situacao: 'BAIXO', p1: 1084, p2: 178, p3: 863, star: false },
    { nome: 'Português', situacao: 'BAIXO', p1: 874, p2: 178, p3: 1323, star: true }
  ];

  const planejamentoData = {
    ciclosCompletos: 0,
    progresso: { atual: 0, total: 19 * 60 + 45 },
    sequenciaEstudos: [
      { materia: 'Direito Civil', tempo: '0min / 1h00min', cor: 'border-l-red-400' },
      { materia: 'Direito Empresarial', tempo: '0min / 1h00min', cor: 'border-l-blue-400' },
      { materia: 'Direito Penal', tempo: '0min / 1h15min', cor: 'border-l-purple-400' },
      { materia: 'Direito Empresarial', tempo: '0min / 1h00min', cor: 'border-l-blue-400' },
      { materia: 'Direito Penal', tempo: '0min / 1h00min', cor: 'border-l-purple-400' }
    ]
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const renderSidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-green-500 to-green-600 
        text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:block lg:w-64
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="text-xl font-bold">Estudei</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="lg:hidden text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  closeSidebar();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  item.active 
                    ? 'bg-white/20 text-white font-medium' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );

  const renderHomeContent = () => (
    <div className="space-y-4">
      {/* Header com filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4 text-center text-xs">
            <div className="text-gray-600">Norte</div>
            <div className="text-gray-600">Nordeste</div>
            <div className="text-gray-600">C-Oeste</div>
            <div className="text-gray-600">Sul</div>
            <div className="text-gray-600">Sudeste</div>
            <div className="text-gray-600">Federal</div>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1 mb-4 text-xs text-center">
            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS'].map(estado => (
              <div key={estado} className="p-2 border rounded text-gray-600 hover:bg-gray-50 cursor-pointer">
                {estado}
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            <div className="bg-green-500 text-white px-3 py-2 rounded cursor-pointer">Concurso Público</div>
            <div className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50 cursor-pointer">Enem</div>
            <div className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50 cursor-pointer">Vestibular</div>
            <div className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50 cursor-pointer">OAB</div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <select className="flex-1 px-3 py-2 border rounded text-sm">
              <option>Instituições</option>
            </select>
            <select className="flex-1 px-3 py-2 border rounded text-sm">
              <option>Policial</option>
            </select>
            <input type="text" placeholder="Pesquisar..." className="flex-1 px-3 py-2 border rounded text-sm" />
            <Button className="bg-green-500 hover:bg-green-600 whitespace-nowrap">
              <Filter className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de matérias */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matéria</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P1</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P3</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {materias.map((materia, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{materia.nome}</td>
                    <td className="px-4 py-3">
                      <Badge variant="destructive" className="text-xs">
                        {materia.situacao}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{materia.p1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{materia.p2}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{materia.p3}</td>
                    <td className="px-4 py-3">
                      {materia.star && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Você não tem revisões agendadas para hoje.</p>
          </div>
        </CardContent>
      </Card>

      {/* Estudos do dia */}
      <Card>
        <CardContent className="p-4">
          <div className="text-right text-sm text-gray-500 mb-4">
            ESTUDO DO DIA<br />
            19/05/2023
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Você ainda não estudou hoje 😊</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlanosContent = () => (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Plano Personalizado</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Caso não tenha encontrado seu Edital ou não queira criar um Plano a partir dos nossos Editais,
                crie um Plano personalizado para adicionar as Disciplinas e Tópicos que desejar.
              </p>
              <Button className="bg-green-500 hover:bg-green-600">Criar Plano</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Importar Planilha</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Você também pode criar um Plano a partir dos dados da sua{' '}
                <span className="text-blue-500 underline cursor-pointer">Planilha do Aprovado</span>, importe agora!
              </p>
              <Button className="bg-green-500 hover:bg-green-600">Importar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlanejamentoContent = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Planejamento</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Button variant="outline" size="sm">Recomeçar Ciclo</Button>
          <Button className="bg-green-500 hover:bg-green-600" size="sm">Editar Planejamento</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ciclos Completos */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase">Ciclos Completos</h3>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-xl font-bold text-green-500">{planejamentoData.ciclosCompletos}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progresso */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase">Progresso</h3>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-2">
                {planejamentoData.progresso.atual}min / {Math.floor(planejamentoData.progresso.total / 60)}h{planejamentoData.progresso.total % 60}min
              </div>
              <Progress value={0} className="mb-2" />
            </div>
          </CardContent>
        </Card>

        {/* Ciclo */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase">Ciclo</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">19h45min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sequência de Estudos */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase">Sequência dos Estudos</h3>
          <div className="space-y-2">
            {planejamentoData.sequenciaEstudos.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 border-l-4 ${item.cor} bg-gray-50 dark:bg-gray-800 rounded-r-lg`}>
                <div className="flex items-center gap-3">
                  <Circle className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.materia}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {item.tempo}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'home':
        return renderHomeContent();
      case 'planos':
        return renderPlanosContent();
      case 'planejamento':
        return renderPlanejamentoContent();
      case 'tutor':
        return <SuperTutorChat />;
      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Esta seção está em desenvolvimento.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:flex">
      {renderSidebar()}
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {renderMainContent()}
        </main>
      </div>

      {/* Floating Action Button for Tutor */}
      {activeSection !== 'tutor' && (
        <Button
          onClick={() => setActiveSection('tutor')}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-40"
          size="sm"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default StudentDashboard;
