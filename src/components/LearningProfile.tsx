
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Brain, BookOpen, Target, TrendingUp } from 'lucide-react';

interface LearningProfile {
  id: string;
  session_id: string;
  learning_style: 'visual' | 'practical' | 'theoretical' | 'socratic';
  preferred_pace: 'fast' | 'medium' | 'slow';
  interaction_patterns: {
    asks_followup_questions: boolean;
    prefers_examples: boolean;
    responds_to_analogies: boolean;
    needs_encouragement: boolean;
  };
  knowledge_areas: {
    strong: string[];
    developing: string[];
    needs_work: string[];
  };
  engagement_level: number; // 0-100
  last_updated: string;
}

interface LearningProfileProps {
  sessionId: string;
  assistantId: string;
}

const LearningProfile = ({ sessionId, assistantId }: LearningProfileProps) => {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateLearningProfile();
  }, [sessionId]);

  const generateLearningProfile = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would analyze conversation patterns
      // For now, we'll simulate with realistic data
      const simulatedProfile: LearningProfile = {
        id: Math.random().toString(36).substring(7),
        session_id: sessionId,
        learning_style: ['visual', 'practical', 'theoretical', 'socratic'][Math.floor(Math.random() * 4)] as any,
        preferred_pace: ['fast', 'medium', 'slow'][Math.floor(Math.random() * 3)] as any,
        interaction_patterns: {
          asks_followup_questions: Math.random() > 0.5,
          prefers_examples: Math.random() > 0.3,
          responds_to_analogies: Math.random() > 0.4,
          needs_encouragement: Math.random() > 0.6
        },
        knowledge_areas: {
          strong: ['Conceitos básicos', 'Aplicação prática'],
          developing: ['Teoria avançada', 'Resolução de problemas'],
          needs_work: ['Conexões conceituais']
        },
        engagement_level: Math.floor(Math.random() * 40) + 60,
        last_updated: new Date().toISOString()
      };

      setProfile(simulatedProfile);
    } catch (error) {
      console.error('Error generating learning profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStyleDescription = (style: string) => {
    switch (style) {
      case 'visual': return 'Aprende melhor com diagramas e exemplos visuais';
      case 'practical': return 'Prefere exemplos práticos e aplicações do mundo real';
      case 'theoretical': return 'Gosta de entender a teoria por trás dos conceitos';
      case 'socratic': return 'Responde bem a perguntas que guiam o raciocínio';
      default: return 'Estilo de aprendizagem em análise';
    }
  };

  const getPaceDescription = (pace: string) => {
    switch (pace) {
      case 'fast': return 'Gosta de avançar rapidamente pelos tópicos';
      case 'medium': return 'Prefere um ritmo equilibrado de aprendizagem';
      case 'slow': return 'Precisa de mais tempo para processar informações';
      default: return 'Ritmo em análise';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Continue interagindo para que possamos criar seu perfil de aprendizagem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Perfil de Aprendizagem Adaptativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Engagement Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Nível de Engajamento</span>
              <span className="text-sm text-gray-600">{profile.engagement_level}%</span>
            </div>
            <Progress value={profile.engagement_level} className="h-2" />
          </div>

          {/* Learning Style */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Estilo de Aprendizagem
            </h4>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Badge variant="secondary" className="mb-2">
                {profile.learning_style.charAt(0).toUpperCase() + profile.learning_style.slice(1)}
              </Badge>
              <p className="text-sm text-blue-800">
                {getStyleDescription(profile.learning_style)}
              </p>
            </div>
          </div>

          {/* Preferred Pace */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ritmo Preferido
            </h4>
            <div className="bg-green-50 p-3 rounded-lg">
              <Badge variant="secondary" className="mb-2">
                {profile.preferred_pace.charAt(0).toUpperCase() + profile.preferred_pace.slice(1)}
              </Badge>
              <p className="text-sm text-green-800">
                {getPaceDescription(profile.preferred_pace)}
              </p>
            </div>
          </div>

          {/* Interaction Patterns */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Padrões de Interação
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(profile.interaction_patterns).map(([pattern, value]) => (
                <div key={pattern} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-600">
                    {pattern === 'asks_followup_questions' && 'Faz perguntas de acompanhamento'}
                    {pattern === 'prefers_examples' && 'Prefere exemplos'}
                    {pattern === 'responds_to_analogies' && 'Responde a analogias'}
                    {pattern === 'needs_encouragement' && 'Precisa de encorajamento'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Areas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Áreas de Conhecimento</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-green-700">Pontos Fortes:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.knowledge_areas.strong.map((area, index) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-yellow-700">Em Desenvolvimento:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.knowledge_areas.developing.map((area, index) => (
                    <Badge key={index} variant="default" className="bg-yellow-100 text-yellow-800">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-red-700">Precisa Melhorar:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.knowledge_areas.needs_work.map((area, index) => (
                    <Badge key={index} variant="default" className="bg-red-100 text-red-800">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningProfile;
