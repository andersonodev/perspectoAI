
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, BookOpen, PlayCircle, PenTool, Users, Target } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  type: 'advance' | 'practice' | 'explore' | 'collaborate';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  prerequisites?: string[];
  icon: React.ReactNode;
}

interface AdaptiveLearningPathsProps {
  currentTopic: string;
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
  onSelectPath: (path: LearningPath) => void;
}

const AdaptiveLearningPaths = ({ 
  currentTopic, 
  studentLevel, 
  onSelectPath 
}: AdaptiveLearningPathsProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const generatePaths = (): LearningPath[] => {
    const basePaths: LearningPath[] = [
      {
        id: 'advance',
        title: `Avançar para o Próximo Conceito`,
        description: `Você demonstrou um bom entendimento sobre ${currentTopic}. Vamos para o próximo nível!`,
        type: 'advance',
        difficulty: studentLevel === 'beginner' ? 'medium' : 'hard',
        estimatedTime: '15-20 min',
        icon: <ChevronRight className="h-5 w-5" />
      },
      {
        id: 'practice',
        title: `Exercícios Práticos: ${currentTopic}`,
        description: 'Consolide seu conhecimento com exercícios personalizados e feedback imediato.',
        type: 'practice',
        difficulty: studentLevel === 'advanced' ? 'medium' : 'easy',
        estimatedTime: '10-15 min',
        icon: <PenTool className="h-5 w-5" />
      },
      {
        id: 'explore',
        title: `Contexto Histórico e Aplicações`,
        description: `Explore as origens e aplicações práticas de ${currentTopic} no mundo real.`,
        type: 'explore',
        difficulty: 'medium',
        estimatedTime: '12-18 min',
        icon: <BookOpen className="h-5 w-5" />
      }
    ];

    // Add collaboration path for intermediate/advanced students
    if (studentLevel !== 'beginner') {
      basePaths.push({
        id: 'collaborate',
        title: 'Sala de Estudo Colaborativa',
        description: 'Participe de uma discussão guiada com outros alunos sobre este tópico.',
        type: 'collaborate',
        difficulty: 'medium',
        estimatedTime: '20-30 min',
        prerequisites: ['Compreensão básica do tópico'],
        icon: <Users className="h-5 w-5" />
      });
    }

    return basePaths;
  };

  const paths = generatePaths();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'advance': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-purple-100 text-purple-800';
      case 'explore': return 'bg-orange-100 text-orange-800';
      case 'collaborate': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Trilhas de Aprendizagem Adaptativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Com base no seu progresso em <strong>{currentTopic}</strong>, aqui estão os próximos passos recomendados:
          </div>
          
          {paths.map((path) => (
            <div
              key={path.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPath === path.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPath(path.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                  {path.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{path.title}</h4>
                    <div className="flex space-x-2">
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <Badge className={getTypeColor(path.type)}>
                        {path.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>⏱️ {path.estimatedTime}</span>
                      {path.prerequisites && (
                        <span>📋 {path.prerequisites.length} pré-requisito(s)</span>
                      )}
                    </div>
                    
                    {selectedPath === path.id && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPath(path);
                        }}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Começar
                      </Button>
                    )}
                  </div>
                  
                  {path.prerequisites && selectedPath === path.id && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-xs font-medium text-yellow-800 mb-1">Pré-requisitos:</p>
                      <ul className="text-xs text-yellow-700">
                        {path.prerequisites.map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">💡 Como funciona a adaptação:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• As trilhas se ajustam ao seu nível de conhecimento atual</li>
            <li>• O sistema aprende com suas preferências e desempenho</li>
            <li>• Cada caminho é otimizado para maximizar seu aprendizado</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveLearningPaths;
