
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Shield, Zap, Users, BookOpen, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
                alt="Mentor AI" 
                className="h-10 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                Recursos
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                Como Funciona
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                Preços
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600">
                  Entrar
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Tecnologia IA Avançada
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Assistentes de IA para
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                Educação Personalizada
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Crie assistentes educacionais inteligentes que se adaptam ao estilo de aprendizagem de cada estudante. 
              Transforme a educação com IA personalizada e feedback em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all">
                  Criar Assistente Gratuito
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/transparency">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-slate-300 hover:border-indigo-300 hover:bg-indigo-50">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Ver Demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Recursos Avançados de IA Educacional
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tecnologia de ponta para criar experiências de aprendizado únicas e eficazes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Chat Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Conversas naturais com IA que entende contexto, oferece explicações claras e se adapta ao ritmo do aluno.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Aprendizado Adaptativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Algoritmos que identificam lacunas de conhecimento e personalizam o conteúdo para cada estudante.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Anti-Cola Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Sistema avançado que detecta tentativas de cola e direciona para aprendizado genuíno.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Simulações Interativas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Ambientes virtuais para experimentação prática em física, química, matemática e economia.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Segunda Mente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Sistema de gestão de conhecimento pessoal que organiza e conecta tudo que você aprende.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Analytics Avançados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Métricas detalhadas de progresso, identificação de padrões e insights para otimizar o aprendizado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Três passos simples para revolucionar o ensino
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Crie seu Assistente</h3>
              <p className="text-slate-600">
                Configure personalidade, matéria e upload de materiais didáticos em poucos minutos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Publique e Compartilhe</h3>
              <p className="text-slate-600">
                Torne seu assistente disponível para estudantes com um simples link de compartilhamento.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Acompanhe o Progresso</h3>
              <p className="text-slate-600">
                Monitore interações, identifique dificuldades e otimize o aprendizado com analytics avançados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Transformar a Educação?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de educadores que já estão usando IA para personalizar o aprendizado.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img 
                src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
                alt="Mentor AI" 
                className="h-8 w-auto mb-4 filter brightness-0 invert"
              />
              <p className="text-slate-400 max-w-md">
                Plataforma de IA educacional que personaliza o aprendizado e potencializa o ensino através de assistentes inteligentes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Mentor AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
