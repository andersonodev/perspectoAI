
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye, 
  Compass, 
  Layers, 
  Lightbulb, 
  Brain, 
  Target,
  ArrowRight,
  Star,
  Check,
  MessageSquare,
  BarChart3,
  Zap,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Sparkles,
  Bot,
  Shield,
  CheckCircle
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">PerspectoAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="relative z-10">
          <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-800 border-indigo-200">
            🔮 Nova Era da Educação - IA com Perspectiva Única
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme sua
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"> Perspectiva </span>
            de aprendizado
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            PerspectoAI revoluciona a educação com IA que compreende múltiplas perspectivas. 
            Crie assistentes inteligentes que veem além do óbvio e expandem horizontes de conhecimento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                Expandir Minha Perspectiva
                <Compass className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-purple-300 hover:border-purple-400">
              Ver PerspectoAI em Ação
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">15k+</div>
              <div className="text-gray-600">Mentes Expandidas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">75k+</div>
              <div className="text-gray-600">Perspectivas Criadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">99%</div>
              <div className="text-gray-600">Transformação Cognitiva</div>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Por que PerspectoAI é único?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como nossa IA revolucionária amplia sua visão de mundo através de múltiplas perspectivas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Visão Multidimensional</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Nossa IA analisa conteúdos sob diferentes ângulos, oferecendo perspectivas únicas que expandem sua compreensão.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Análise Profunda</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Processamento avançado que vai além da superfície, revelando conexões ocultas e insights profundos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Insights Iluminadores</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Gere descobertas surpreendentes e momentos "eureka" através de conexões inteligentes entre conceitos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Navegação Intuitiva</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Interface que se adapta ao seu modo de pensar, guiando você através de jornadas de descoberta personalizadas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Cognição Ampliada</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Potencialize sua capacidade cognitiva com IA que complementa e expande seu processo natural de pensamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Foco Preciso</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Direcionamento inteligente que identifica exatamente o que você precisa saber no momento certo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Unique Value Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
                A Revolução PerspectoAI
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Veja além do que seus olhos podem alcançar
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                PerspectoAI não é apenas mais uma ferramenta de IA. É um expansor de consciência que 
                revela camadas ocultas de conhecimento e conecta ideias de formas inesperadas.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Perspectiva 360°</h3>
                    <p className="text-gray-600">Visualize qualquer tópico sob todos os ângulos possíveis, descobrindo conexões invisíveis.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Insights Revolucionários</h3>
                    <p className="text-gray-600">Desvende padrões ocultos e gere insights que transformam sua compreensão fundamental.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">PerspectoAI - Filosofia</div>
                    <div className="text-sm text-purple-500">Expandindo horizontes...</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">Você: Como diferentes culturas veem a felicidade?</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>PerspectoAI:</strong> Fascinante pergunta! Vou mostrar 7 perspectivas únicas:
                      <br/>🇯🇵 Ikigai japonês - propósito de vida
                      <br/>🇩🇰 Hygge dinamarquês - conforto acolhedor
                      <br/>E mais 5 perspectivas surpreendentes...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Pronto para expandir sua perspectiva?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Junte-se à revolução cognitiva. Descubra o que está além do horizonte do conhecimento convencional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Iniciar Jornada PerspectoAI
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg">
              Explorar Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold">PerspectoAI</span>
              </div>
              <p className="text-gray-400">
                Expandindo horizontes através da perspectiva multidimensional da inteligência artificial.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Perspectivas</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">Visão 360°</Link></li>
                <li><Link to="#" className="hover:text-white">Análise Profunda</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Expansão</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">Jornadas</Link></li>
                <li><Link to="#" className="hover:text-white">Descobertas</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Universo PerspectoAI</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white">Manifesto</Link></li>
                <li><Link to="#" className="hover:text-white">Comunidade</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PerspectoAI. Expandindo perspectivas, transformando mentes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
