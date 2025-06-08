
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mentor IA</h1>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Crie o assistente de ensino que a sua turma{' '}
            <span className="text-blue-600">merece</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforme seu material de aula em um assistente de IA personalizado. 
            Seus alunos terão suporte 24/7 baseado exclusivamente no seu conteúdo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-4">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Baseado no seu material</h3>
            <p className="text-gray-600">Upload de PDFs, slides e links para criar a base de conhecimento</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Suporte 24/7</h3>
            <p className="text-gray-600">Seus alunos podem tirar dúvidas a qualquer hora, onde estiverem</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuração simples</h3>
            <p className="text-gray-600">Crie seu assistente em minutos, sem conhecimento técnico</p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">IA personalizada</h3>
            <p className="text-gray-600">Defina a personalidade e regras do seu assistente</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Por que usar o Mentor IA?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Economize tempo</h4>
                    <p className="text-gray-600">Pare de responder as mesmas perguntas repetidas vezes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Aumente o engajamento</h4>
                    <p className="text-gray-600">Alunos se sentem mais à vontade para tirar dúvidas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Controle total</h4>
                    <p className="text-gray-600">Respostas baseadas apenas no seu material de aula</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Insights valiosos</h4>
                    <p className="text-gray-600">Veja quais são as dúvidas mais comuns da turma</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Comece hoje mesmo!</h3>
              <p className="mb-6">
                Crie seu primeiro assistente gratuitamente e veja como pode transformar 
                sua forma de ensinar.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => navigate('/auth')}
                className="text-blue-600"
              >
                Criar Minha Conta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <h3 className="text-xl font-bold">Mentor IA</h3>
          </div>
          <p className="text-gray-400">
            Transformando a educação com inteligência artificial personalizada
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
