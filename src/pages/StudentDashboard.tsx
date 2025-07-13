
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
  Map,
  Clock,
  ArrowRight,
  MessageSquare,
  Menu,
  Bell,
  Moon,
  Sun,
  Home,
  Search,
  Sparkles,
  BarChart,
  TrendingUp,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Edit,
  CheckCircle2,
  Circle,
  Play,
  Pause
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SuperTutorChat from '@/components/SuperTutorChat';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarItems = [
    { id: 'home', icon: Home, label: 'Home', active: activeSection === 'home' },
    { id: 'planos', icon: BookOpen, label: 'Planos', active: activeSection === 'planos' },
    { id: 'edital', icon: FileText, label: 'Edital', active: activeSection === 'edital' },
    { id: 'disciplinas', icon: BarChart, label: 'Disciplinas', active: activeSection === 'disciplinas' },
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

  const renderSidebar = () => (
    <div className="w-64 h-screen bg-gradient-to-b from-[#4ade80] to-[#16a34a] text-white fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-2xl font-bold">Estudei</div>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-6 gap-4 mb-4 text-center">
          <div className="text-sm font-medium text-gray-600">Norte</div>
          <div className="text-sm font-medium text-gray-600">Nordeste</div>
          <div className="text-sm font-medium text-gray-600">Centro-Oeste</div>
          <div className="text-sm font-medium text-gray-600">Sul</div>
          <div className="text-sm font-medium text-gray-600">Sudeste</div>
          <div className="text-sm font-medium text-gray-600">Federal</div>
        </div>
        
        <div className="grid grid-cols-12 gap-2 mb-4 text-xs text-center">
          {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS'].map(estado => (
            <div key={estado} className="p-2 border rounded text-gray-600">{estado}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-6 text-xs">
          <div className="bg-green-500 text-white px-3 py-2 rounded text-center">Concurso Público</div>
          <div className="px-3 py-2 border rounded text-center text-gray-600">Enem</div>
          <div className="px-3 py-2 border rounded text-center text-gray-600">Vestibular</div>
          <div className="px-3 py-2 border rounded text-center text-gray-600">Residência Médica</div>
          <div className="px-3 py-2 border rounded text-center text-gray-600">OAB</div>
          <div className="px-3 py-2 border rounded text-center text-gray-600">Concurso Militar</div>
          <div className="px-3 py-2 border rounded text-center text-gray-600">Outros</div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <select className="flex-1 px-3 py-2 border rounded">
            <option>Instituições</option>
          </select>
          <select className="flex-1 px-3 py-2 border rounded">
            <option>Policial</option>
          </select>
          <input type="text" placeholder="Pesquisar..." className="flex-1 px-3 py-2 border rounded" />
          <Button className="bg-green-500 hover:bg-green-600 px-6">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Tabela de matérias */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matéria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P2</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P3</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materias.map((materia, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{materia.nome}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      {materia.situacao}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{materia.p1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{materia.p2}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{materia.p3}</td>
                  <td className="px-6 py-4">
                    {materia.star && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-500 mb-4">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p>Você não tem revisões agendadas para hoje.</p>
          </div>
        </div>
      </div>

      {/* Estudos do dia */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-right text-sm text-gray-500 mb-4">
          ESTUDO DO DIA<br />
          19/05/2023
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Você ainda não estudou hoje 😊</p>
        </div>
      </div>
    </div>
  );

  const renderPlanosContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Plano Personalizado</h2>
            <p className="text-gray-600">
              Caso não tenha encontrado seu Edital ou não queira criar um Plano a partir dos nossos Editais,
              crie um Plano personalizado para adicionar as Disciplinas e Tópicos que desejar.
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-32 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm">Selecione o edital desejado para adicionar ao seu plano de estudos.</div>
                <div className="text-xs mt-2">Você também pode criar um plano personalizado cadastrando suas próprias disciplinas.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Download className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Importar Planilha</h2>
            <p className="text-gray-600">
              Você também pode criar um Plano a partir dos dados da sua{' '}
              <span className="text-blue-500 underline">Planilha do Aprovado</span>, importe agora!
            </p>
          </div>
          <div className="ml-auto">
            <Button className="bg-green-500 hover:bg-green-600">Avançar</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlanejamentoContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planejamento</h1>
        <div className="flex gap-3">
          <Button variant="outline">Recomeçar Ciclo</Button>
          <Button className="bg-green-500 hover:bg-green-600">Editar Planejamento</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Ciclos Completos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">CICLOS COMPLETOS</h3>
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-500">{planejamentoData.ciclosCompletos}</span>
            </div>
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">PROGRESSO</h3>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              {planejamentoData.progresso.atual}min / {Math.floor(planejamentoData.progresso.total / 60)}h{planejamentoData.progresso.total % 60}min
            </div>
            <Progress value={0} className="mb-4" />
          </div>
        </div>

        {/* Ciclo - Gráfico */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">CICLO</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#f3f4f6" strokeWidth="4"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="#f9fafb" strokeWidth="2"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">19h45min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sequência de Estudos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">SEQUÊNCIA DOS ESTUDOS</h3>
        <div className="space-y-3">
          {planejamentoData.sequenciaEstudos.map((item, index) => (
            <div key={index} className={`flex items-center justify-between p-4 border-l-4 ${item.cor} bg-gray-50 rounded-r-lg`}>
              <div className="flex items-center gap-3">
                <Circle className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{item.materia}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {item.tempo}
              </div>
            </div>
          ))}
        </div>
      </div>
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
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {sidebarItems.find(item => item.id === activeSection)?.label}
            </h2>
            <p className="text-gray-600">Esta seção está em desenvolvimento.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Moon className="h-4 w-4" />
                </Button>
                <Avatar>
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Floating Action Button for Tutor */}
      {activeSection !== 'tutor' && (
        <Button
          onClick={() => setActiveSection('tutor')}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default StudentDashboard;
