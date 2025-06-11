
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Map, Zap, Star, Lock, Eye, TreePine } from 'lucide-react';

interface KnowledgeNode {
  id: string;
  title: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  mastery: number; // 0-100
  unlocked: boolean;
  connections: string[]; // IDs of connected nodes
  position: { x: number; y: number };
  prerequisites: string[];
}

interface KnowledgeMapProps {
  assistantId: string;
  sessionId: string;
  subject: string;
}

const KnowledgeMap = ({ assistantId, sessionId, subject }: KnowledgeMapProps) => {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [totalMastery, setTotalMastery] = useState(0);

  useEffect(() => {
    generateKnowledgeMap();
  }, [subject]);

  const generateKnowledgeMap = () => {
    // Gerar mapa baseado na matéria
    const subjectMaps: Record<string, KnowledgeNode[]> = {
      'Biologia': [
        {
          id: 'células-básico',
          title: 'Células Básicas',
          category: 'Citologia',
          level: 'beginner',
          mastery: 85,
          unlocked: true,
          connections: ['células-organelas', 'tipos-células'],
          position: { x: 100, y: 200 },
          prerequisites: []
        },
        {
          id: 'células-organelas',
          title: 'Organelas Celulares',
          category: 'Citologia',
          level: 'intermediate',
          mastery: 60,
          unlocked: true,
          connections: ['células-básico', 'respiração-celular'],
          position: { x: 250, y: 150 },
          prerequisites: ['células-básico']
        },
        {
          id: 'tipos-células',
          title: 'Tipos de Células',
          category: 'Citologia',
          level: 'intermediate',
          mastery: 40,
          unlocked: true,
          connections: ['células-básico', 'tecidos'],
          position: { x: 250, y: 250 },
          prerequisites: ['células-básico']
        },
        {
          id: 'respiração-celular',
          title: 'Respiração Celular',
          category: 'Bioquímica',
          level: 'advanced',
          mastery: 20,
          unlocked: false,
          connections: ['células-organelas', 'fotossíntese'],
          position: { x: 400, y: 100 },
          prerequisites: ['células-organelas']
        },
        {
          id: 'fotossíntese',
          title: 'Fotossíntese',
          category: 'Bioquímica',
          level: 'advanced',
          mastery: 0,
          unlocked: false,
          connections: ['respiração-celular'],
          position: { x: 550, y: 100 },
          prerequisites: ['respiração-celular']
        },
        {
          id: 'tecidos',
          title: 'Tecidos',
          category: 'Histologia',
          level: 'intermediate',
          mastery: 30,
          unlocked: true,
          connections: ['tipos-células', 'órgãos'],
          position: { x: 400, y: 250 },
          prerequisites: ['tipos-células']
        },
        {
          id: 'órgãos',
          title: 'Órgãos e Sistemas',
          category: 'Anatomia',
          level: 'advanced',
          mastery: 0,
          unlocked: false,
          connections: ['tecidos'],
          position: { x: 550, y: 250 },
          prerequisites: ['tecidos']
        }
      ],
      'Matemática': [
        {
          id: 'números-naturais',
          title: 'Números Naturais',
          category: 'Aritmética',
          level: 'beginner',
          mastery: 90,
          unlocked: true,
          connections: ['números-inteiros'],
          position: { x: 100, y: 200 },
          prerequisites: []
        },
        {
          id: 'números-inteiros',
          title: 'Números Inteiros',
          category: 'Aritmética',
          level: 'beginner',
          mastery: 75,
          unlocked: true,
          connections: ['números-naturais', 'números-racionais'],
          position: { x: 250, y: 200 },
          prerequisites: ['números-naturais']
        },
        {
          id: 'números-racionais',
          title: 'Números Racionais',
          category: 'Aritmética',
          level: 'intermediate',
          mastery: 55,
          unlocked: true,
          connections: ['números-inteiros', 'equações-1grau'],
          position: { x: 400, y: 200 },
          prerequisites: ['números-inteiros']
        },
        {
          id: 'equações-1grau',
          title: 'Equações 1º Grau',
          category: 'Álgebra',
          level: 'intermediate',
          mastery: 40,
          unlocked: true,
          connections: ['números-racionais', 'equações-2grau'],
          position: { x: 400, y: 100 },
          prerequisites: ['números-racionais']
        },
        {
          id: 'equações-2grau',
          title: 'Equações 2º Grau',
          category: 'Álgebra',
          level: 'advanced',
          mastery: 10,
          unlocked: false,
          connections: ['equações-1grau', 'funções'],
          position: { x: 550, y: 100 },
          prerequisites: ['equações-1grau']
        },
        {
          id: 'funções',
          title: 'Funções',
          category: 'Álgebra',
          level: 'advanced',
          mastery: 0,
          unlocked: false,
          connections: ['equações-2grau'],
          position: { x: 700, y: 100 },
          prerequisites: ['equações-2grau']
        }
      ]
    };

    const mapNodes = subjectMaps[subject] || subjectMaps['Biologia'];
    setNodes(mapNodes);

    // Calcular masteria total
    const total = mapNodes.reduce((sum, node) => sum + node.mastery, 0) / mapNodes.length;
    setTotalMastery(total);
  };

  const updateNodeMastery = (nodeId: string, newMastery: number) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, mastery: newMastery };
        
        // Verificar se deve desbloquear nós dependentes
        if (newMastery >= 70) {
          // Desbloquear nós que dependem deste
          return updateDependentNodes(prev, nodeId);
        }
        
        return updatedNode;
      }
      return node;
    }));
  };

  const updateDependentNodes = (currentNodes: KnowledgeNode[], unlockedNodeId: string) => {
    return currentNodes.map(node => {
      if (node.prerequisites.includes(unlockedNodeId) && !node.unlocked) {
        // Verificar se todos os pré-requisitos estão completos
        const allPrereqsMet = node.prerequisites.every(prereqId => {
          const prereqNode = currentNodes.find(n => n.id === prereqId);
          return prereqNode && prereqNode.mastery >= 70;
        });
        
        if (allPrereqsMet) {
          return { ...node, unlocked: true };
        }
      }
      return node;
    });
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'bg-green-500';
    if (mastery >= 60) return 'bg-yellow-500';
    if (mastery >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      default: return '⭐';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Map className="h-5 w-5 mr-2 text-green-600" />
            Meu Mapa de Conhecimento - {subject}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <TreePine className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{totalMastery.toFixed(0)}% dominado</span>
          </div>
        </div>
        <Progress value={totalMastery} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa Visual */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 h-80 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full">
                {/* Conexões */}
                {nodes.map(node => 
                  node.connections.map(connectionId => {
                    const connectedNode = nodes.find(n => n.id === connectionId);
                    if (!connectedNode) return null;
                    
                    return (
                      <line
                        key={`${node.id}-${connectionId}`}
                        x1={node.position.x}
                        y1={node.position.y}
                        x2={connectedNode.position.x}
                        y2={connectedNode.position.y}
                        stroke={node.unlocked && connectedNode.unlocked ? '#10b981' : '#d1d5db'}
                        strokeWidth="2"
                        strokeDasharray={node.unlocked && connectedNode.unlocked ? '0' : '5,5'}
                      />
                    );
                  })
                )}
              </svg>

              {/* Nós */}
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    node.unlocked ? 'hover:scale-110' : 'opacity-50'
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y
                  }}
                  onClick={() => node.unlocked && setSelectedNode(node)}
                >
                  <div className={`relative w-16 h-16 rounded-full border-4 ${
                    node.unlocked ? 'border-white shadow-lg' : 'border-gray-300'
                  } ${getMasteryColor(node.mastery)} flex items-center justify-center`}>
                    {node.unlocked ? (
                      <span className="text-2xl">{getLevelIcon(node.level)}</span>
                    ) : (
                      <Lock className="h-6 w-6 text-white" />
                    )}
                    
                    {/* Barra de progresso circular */}
                    {node.unlocked && (
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="28"
                          fill="none"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="28"
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeDasharray={`${(node.mastery / 100) * 175.929} 175.929`}
                          className="transition-all duration-500"
                        />
                      </svg>
                    )}
                  </div>
                  
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                    <span className="text-xs font-medium text-gray-700 text-center block max-w-20">
                      {node.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Painel de Detalhes */}
          <div className="space-y-4">
            {selectedNode ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">{getLevelIcon(selectedNode.level)}</span>
                    {selectedNode.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedNode.category}</Badge>
                    <Badge variant={
                      selectedNode.level === 'beginner' ? 'default' :
                      selectedNode.level === 'intermediate' ? 'secondary' : 'destructive'
                    }>
                      {selectedNode.level === 'beginner' ? 'Básico' :
                       selectedNode.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Domínio</span>
                      <span>{selectedNode.mastery}%</span>
                    </div>
                    <Progress value={selectedNode.mastery} className="h-2" />
                  </div>

                  {selectedNode.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Pré-requisitos:</h4>
                      <div className="space-y-1">
                        {selectedNode.prerequisites.map(prereqId => {
                          const prereqNode = nodes.find(n => n.id === prereqId);
                          if (!prereqNode) return null;
                          
                          return (
                            <div key={prereqId} className="flex items-center space-x-2 text-sm">
                              <span className={prereqNode.mastery >= 70 ? '✅' : '❌'}</span>
                              <span>{prereqNode.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => updateNodeMastery(selectedNode.id, Math.min(selectedNode.mastery + 10, 100))}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Estudar Tópico
                    </Button>
                    
                    {selectedNode.mastery >= 70 && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Star className="h-4 w-4 mr-2" />
                        Revisar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Clique em um tópico desbloqueado para ver os detalhes</p>
                </CardContent>
              </Card>
            )}

            {/* Estatísticas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tópicos desbloqueados:</span>
                  <span className="font-medium">{nodes.filter(n => n.unlocked).length}/{nodes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tópicos dominados (>80%):</span>
                  <span className="font-medium">{nodes.filter(n => n.mastery >= 80).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximo desbloqueio:</span>
                  <span className="font-medium text-blue-600">
                    {nodes.find(n => !n.unlocked)?.title || 'Todos desbloqueados!'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeMap;
