import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  Download, 
  Share2,
  Crown,
  Zap,
  Target,
  GitBranch,
  Lightbulb
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MindMapNode {
  id: string;
  text: string;
  level: number;
  color: string;
  children: MindMapNode[];
}

const MindMapGenerator = () => {
  const [concept, setConcept] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
  const [usageCount] = useState(1); // Simulated usage count
  const [maxUsage] = useState(3); // Free tier limit

  const handleGenerate = async () => {
    if (usageCount >= maxUsage) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 3 mapas mentais no plano gratuito. Faça upgrade para continuar!",
        variant: "destructive"
      });
      return;
    }

    if (!concept.trim()) {
      toast({
        title: "Conceito necessário",
        description: "Por favor, digite um conceito para gerar o mapa mental.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated mind map
    const mockMindMap: MindMapNode = {
      id: 'root',
      text: concept,
      level: 0,
      color: 'from-blue-500 to-blue-600',
      children: [
        {
          id: '1',
          text: 'Definição',
          level: 1,
          color: 'from-green-500 to-green-600',
          children: [
            {
              id: '1.1',
              text: 'Conceito principal',
              level: 2,
              color: 'from-green-400 to-green-500',
              children: []
            },
            {
              id: '1.2',
              text: 'Características',
              level: 2,
              color: 'from-green-400 to-green-500',
              children: []
            }
          ]
        },
        {
          id: '2',
          text: 'Tipos',
          level: 1,
          color: 'from-purple-500 to-purple-600',
          children: [
            {
              id: '2.1',
              text: 'Categoria A',
              level: 2,
              color: 'from-purple-400 to-purple-500',
              children: []
            },
            {
              id: '2.2',
              text: 'Categoria B',
              level: 2,
              color: 'from-purple-400 to-purple-500',
              children: []
            }
          ]
        },
        {
          id: '3',
          text: 'Aplicações',
          level: 1,
          color: 'from-orange-500 to-orange-600',
          children: [
            {
              id: '3.1',
              text: 'Área prática 1',
              level: 2,
              color: 'from-orange-400 to-orange-500',
              children: []
            },
            {
              id: '3.2',
              text: 'Área prática 2',
              level: 2,
              color: 'from-orange-400 to-orange-500',
              children: []
            }
          ]
        },
        {
          id: '4',
          text: 'Relações',
          level: 1,
          color: 'from-red-500 to-red-600',
          children: [
            {
              id: '4.1',
              text: 'Conceito relacionado 1',
              level: 2,
              color: 'from-red-400 to-red-500',
              children: []
            },
            {
              id: '4.2',
              text: 'Conceito relacionado 2',
              level: 2,
              color: 'from-red-400 to-red-500',
              children: []
            }
          ]
        }
      ]
    };

    setMindMap(mockMindMap);
    setIsGenerating(false);
  };

  const renderNode = (node: MindMapNode, index: number = 0) => {
    const getPositionClasses = (level: number, index: number) => {
      if (level === 0) return 'mx-auto';
      if (level === 1) {
        const positions = ['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'];
        return positions[index % positions.length];
      }
      return '';
    };

    const getSizeClasses = (level: number) => {
      switch (level) {
        case 0: return 'w-48 h-16 text-lg font-bold';
        case 1: return 'w-36 h-12 text-sm font-semibold';
        case 2: return 'w-28 h-10 text-xs font-medium';
        default: return 'w-24 h-8 text-xs';
      }
    };

    return (
      <div key={node.id} className="relative">
        <div className={`
          ${getSizeClasses(node.level)}
          bg-gradient-to-r ${node.color}
          text-white rounded-lg
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          transition-all duration-300
          cursor-pointer
          group
          ${getPositionClasses(node.level, index)}
        `}>
          <span className="text-center px-2 leading-tight">
            {node.text}
          </span>
          
          {/* Connection lines for children */}
          {node.children.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {node.children.map((_, childIndex) => (
                <div
                  key={childIndex}
                  className="absolute w-px h-8 bg-gray-300 opacity-60"
                  style={{
                    left: '50%',
                    top: '100%',
                    transform: `translateX(-50%) rotate(${(childIndex - (node.children.length - 1) / 2) * 30}deg)`,
                    transformOrigin: 'top'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Render children */}
        {node.children.length > 0 && (
          <div className={`
            ${node.level === 0 ? 'grid grid-cols-2 gap-8 mt-12' : 'flex gap-4 mt-8'}
            ${node.level >= 1 ? 'justify-center' : ''}
          `}>
            {node.children.map((child, childIndex) => renderNode(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  if (isGenerating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GitBranch className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Criando seu mapa mental...
          </h3>
          <p className="text-gray-600 mb-4">
            Nossa IA está estruturando os conceitos e conexões
          </p>
          <Progress value={75} className="mb-4" />
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Analisando conceito principal</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Identificando subtópicos</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Organizando estrutura visual</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mindMap) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-purple-600" />
              Mapa Mental: {concept}
            </h3>
            <p className="text-gray-600">
              Explore as conexões e organize suas ideias
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-white">
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button variant="outline" size="sm" className="bg-white">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Mind Map Visualization */}
        <Card className="p-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-[600px] overflow-auto">
          <div className="relative w-full h-full flex items-center justify-center">
            {renderNode(mindMap)}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => {
              setMindMap(null);
              setConcept('');
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Gerar Novo Mapa
          </Button>
          <Button variant="outline" className="bg-white">
            Editar Mapa
          </Button>
        </div>

        {/* Legend */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Como usar seu mapa mental:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                <span>Conceito principal (centro)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
                <span>Definições e características</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded"></div>
                <span>Categorias e tipos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
                <span>Aplicações práticas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Usage Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-purple-600" />
            Mapa Mental Inteligente
          </h3>
          <p className="text-gray-600">
            Transforme qualquer conceito em um mapa visual estruturado
          </p>
        </div>
        <div className="text-right">
          <Badge className={`${usageCount >= maxUsage ? 'bg-red-100 text-red-800 border-red-200' : 'bg-purple-100 text-purple-800 border-purple-200'}`}>
            {usageCount}/{maxUsage} mapas hoje
          </Badge>
          {usageCount >= maxUsage && (
            <p className="text-xs text-red-600 mt-1">
              Limite atingido
            </p>
          )}
        </div>
      </div>

      {/* Input */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conceito principal
              </label>
              <Input
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ex: Fotossíntese, Segunda Guerra Mundial, Inteligência Artificial..."
                className="bg-white text-lg"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Exemplos de conceitos:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <button 
                  onClick={() => setConcept('Fotossíntese')}
                  className="text-left p-2 rounded hover:bg-white transition-colors text-gray-700"
                >
                  🌱 Fotossíntese
                </button>
                <button 
                  onClick={() => setConcept('Sistema Solar')}
                  className="text-left p-2 rounded hover:bg-white transition-colors text-gray-700"
                >
                  🪐 Sistema Solar
                </button>
                <button 
                  onClick={() => setConcept('Revolução Francesa')}
                  className="text-left p-2 rounded hover:bg-white transition-colors text-gray-700"
                >
                  🏛️ Revolução Francesa
                </button>
                <button 
                  onClick={() => setConcept('Machine Learning')}
                  className="text-left p-2 rounded hover:bg-white transition-colors text-gray-700"
                >
                  🤖 Machine Learning
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex flex-col items-center space-y-4">
        <Button 
          onClick={handleGenerate}
          disabled={usageCount >= maxUsage || !concept.trim()}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
        >
          <Zap className="h-5 w-5 mr-2" />
          Gerar Mapa Mental
        </Button>

        {usageCount >= maxUsage && (
          <Card className="max-w-md bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-orange-900 mb-1">
                Limite do Plano Gratuito
              </h4>
              <p className="text-sm text-orange-800 mb-3">
                Faça upgrade para mapas mentais ilimitados!
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Upgrade Agora
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            O que nossa IA faz:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-800">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Identifica subtópicos principais</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Organiza hierarquia visual</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Conecta conceitos relacionados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Categoriza por cores temáticas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindMapGenerator;