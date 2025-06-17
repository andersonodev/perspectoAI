
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  Shield, 
  Brain, 
  Target,
  Users,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
                alt="Mentor AI" 
                className="h-16 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-700 hover:text-indigo-600">
                  Entrar
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-8 bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Revolução na Educação com IA
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Assistentes de IA
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Personalizados
              </span>
              <br />
              para Educação
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Crie assistentes de IA únicos para suas disciplinas. Personalize personalidade, 
              conhecimento e métodos de ensino para transformar a experiência de aprendizado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                  <Bot className="h-6 w-6 mr-2" />
                  Criar Meu Primeiro Assistente
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-300 hover:border-indigo-300">
                <Users className="h-6 w-6 mr-2" />
                Ver Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                <p className="text-slate-600">Assistentes Criados</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50k+</div>
                <p className="text-slate-600">Interações de Estudantes</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-slate-600">Satisfação dos Educadores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Recursos Avançados para Educadores
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ferramentas poderosas que tornam o ensino mais eficiente e o aprendizado mais envolvente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Personalidades Únicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Crie assistentes com personalidades distintas: amigável, formal, socrático ou criativo. 
                  Cada um adaptado ao seu estilo de ensino.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Conhecimento Especializado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Carregue PDFs, documentos e materiais específicos. Seus assistentes terão acesso 
                  ao conhecimento exato da sua disciplina.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Controles Avançados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Modo anti-cola, citação de fontes, transparência da IA e controles de criatividade. 
                  Mantenha a integridade acadêmica.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Aprendizado Adaptativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Simulações interativas, mapas de conhecimento e caminhos de aprendizado personalizados 
                  que se adaptam ao ritmo do estudante.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Analytics Detalhado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Acompanhe o progresso dos estudantes, identifique lacunas de conhecimento e 
                  otimize suas estratégias de ensino com dados precisos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">Ferramentas de IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Coach de revisão espaçada, gerador de flashcards, segunda mente digital e 
                  planos de estudo inteligentes automatizados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Student Experience Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Experiência Revolucionária para Estudantes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Seus estudantes terão acesso a uma plataforma completa de aprendizado personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Chat Inteligente e Contextual</h3>
                  <p className="text-slate-600">
                    Conversas naturais com assistentes que entendem o contexto, citam fontes e 
                    fornecem explicações transparentes sobre seu raciocínio.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Ferramentas de Estudo Avançadas</h3>
                  <p className="text-slate-600">
                    Flashcards automáticos, coach de revisão espaçada, mapas mentais interativos 
                    e simulações educacionais envolventes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aprendizado Personalizado</h3>
                  <p className="text-slate-600">
                    Caminhos de aprendizado adaptativos, planos de estudo inteligentes e 
                    segunda mente digital para organizar conhecimento pessoal.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Análise de Progresso</h3>
                  <p className="text-slate-600">
                    Dashboards pessoais com métricas de aprendizado, identificação de pontos 
                    fortes e áreas que precisam de mais atenção.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="border-0 shadow-2xl bg-white p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Assistente de Física</h4>
                      <p className="text-sm text-slate-600">Online • Personalidade Socrática</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-700">
                        "Pode me explicar como funciona a lei da conservação de energia?"
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-slate-700">
                        "Excelente pergunta! Vamos descobrir juntos. Primeiro, quando você 
                        pensa em 'energia', o que vem à sua mente?"
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">💡 Método Socrático</Badge>
                        <Badge variant="outline" className="text-xs">📚 Fonte: Livro Cap. 7</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Simular
                    </Button>
                    <Button variant="outline" size="sm">
                      <Target className="h-4 w-4 mr-1" />
                      Praticar
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Revolucionar sua Sala de Aula?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de educadores que já estão transformando a experiência 
            de aprendizado com assistentes de IA personalizados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                <Sparkles className="h-6 w-6 mr-2" />
                Começar Gratuitamente
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img 
              src="/lovable-uploads/88cf8fc6-b9d1-4447-b0c5-ba3ec309066d.png" 
              alt="Mentor AI" 
              className="h-12 w-auto mx-auto mb-4 filter brightness-0 invert"
            />
            <p className="text-slate-400 mb-8">
              Transformando a educação com inteligência artificial personalizada
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Sobre</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Recursos</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Preços</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Suporte</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contato</a>
            </div>
            <p className="text-sm text-slate-400">
              © 2024 Mentor AI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
