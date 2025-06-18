
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, Brain, Sparkles, Target } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'educator' | 'student') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Mentor IA</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Como você quer usar nossa plataforma?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha seu perfil para ter uma experiência personalizada com ferramentas de IA educacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Educador */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-900">Sou Educador</CardTitle>
              <p className="text-blue-700 font-medium">Quero criar assistentes e turmas</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Criar assistentes de IA personalizados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Gerenciar turmas e estudantes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Analytics avançadas de aprendizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Upload de materiais didáticos</span>
                </div>
              </div>
              <Button 
                onClick={() => onRoleSelect('educator')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Começar como Educador
              </Button>
            </CardContent>
          </Card>

          {/* Estudante */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-emerald-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-emerald-900">Sou Estudante</CardTitle>
              <p className="text-emerald-700 font-medium">Quero aprender e usar ferramentas de estudo</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Super-tutor pessoal com IA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Criar assistentes de estudo personalizados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Flashcards e mapas mentais automáticos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Participar de turmas</span>
                </div>
              </div>
              <Button 
                onClick={() => onRoleSelect('student')}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Começar como Estudante
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Já tem uma conta? 
            <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
