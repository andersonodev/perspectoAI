
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Calculator, TrendingUp, History } from 'lucide-react';

interface SimulationProps {
  type: 'physics' | 'economics' | 'history' | 'math';
  topic: string;
  description: string;
  onClose: () => void;
}

const InteractiveSimulator = ({ type, topic, description, onClose }: SimulationProps) => {
  const [params, setParams] = useState<Record<string, number>>({});

  const renderPhysicsSimulation = () => {
    const angle = params.angle || 45;
    const velocity = params.velocity || 20;
    
    // Cálculo simplificado da trajetória
    const range = (velocity * velocity * Math.sin(2 * angle * Math.PI / 180)) / 9.8;
    const maxHeight = (velocity * velocity * Math.sin(angle * Math.PI / 180) * Math.sin(angle * Math.PI / 180)) / (2 * 9.8);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Ângulo (°)</label>
            <Slider
              value={[angle]}
              onValueChange={([value]) => setParams(prev => ({ ...prev, angle: value }))}
              min={0}
              max={90}
              step={1}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{angle}°</span>
          </div>
          <div>
            <label className="text-sm font-medium">Velocidade (m/s)</label>
            <Slider
              value={[velocity]}
              onValueChange={([value]) => setParams(prev => ({ ...prev, velocity: value }))}
              min={5}
              max={50}
              step={1}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{velocity} m/s</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="relative h-40 bg-gradient-to-b from-blue-100 to-green-100 rounded border-2">
            <div 
              className="absolute bottom-0 left-4 w-2 h-2 bg-red-600 rounded-full"
              style={{
                transform: `translate(${range * 2}px, -${maxHeight * 4}px)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            />
            <div className="absolute bottom-2 left-2 text-xs text-gray-600">
              Origem
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Alcance:</span> {range.toFixed(1)} m
            </div>
            <div>
              <span className="font-medium">Altura máxima:</span> {maxHeight.toFixed(1)} m
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEconomicsSimulation = () => {
    const price = params.price || 10;
    const baseDemand = 100;
    const demand = Math.max(0, baseDemand - price * 3);

    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Preço (R$)</label>
          <Slider
            value={[price]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, price: value }))}
            min={1}
            max={30}
            step={0.5}
            className="mt-2"
          />
          <span className="text-sm text-gray-600">R$ {price.toFixed(2)}</span>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Demanda</span>
            <span className="text-lg font-bold">{demand.toFixed(0)} unidades</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(demand / baseDemand) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <strong>Lei da Demanda:</strong> Quando o preço aumenta, a demanda diminui!
          </div>
        </div>
      </div>
    );
  };

  const renderHistorySimulation = () => {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Cenário Histórico</h4>
          <p className="text-sm text-yellow-800 mb-4">{description}</p>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full text-left">
              Opção A: Cruzar o Rubicão (Avançar para Roma)
            </Button>
            <Button variant="outline" size="sm" className="w-full text-left">
              Opção B: Dissolver o exército e retornar como cidadão
            </Button>
            <Button variant="outline" size="sm" className="w-full text-left">
              Opção C: Negociar com o Senado
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderMathSimulation = () => {
    const a = params.a || 1;
    const b = params.b || 0;
    const c = params.c || -4;

    // Cálculo das raízes da equação quadrática
    const discriminant = b * b - 4 * a * c;
    const hasRealRoots = discriminant >= 0;
    
    let roots = [];
    if (hasRealRoots) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      roots = [root1, root2];
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">a</label>
            <Slider
              value={[a]}
              onValueChange={([value]) => setParams(prev => ({ ...prev, a: value }))}
              min={-5}
              max={5}
              step={0.1}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{a.toFixed(1)}</span>
          </div>
          <div>
            <label className="text-sm font-medium">b</label>
            <Slider
              value={[b]}
              onValueChange={([value]) => setParams(prev => ({ ...prev, b: value }))}
              min={-10}
              max={10}
              step={0.1}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{b.toFixed(1)}</span>
          </div>
          <div>
            <label className="text-sm font-medium">c</label>
            <Slider
              value={[c]}
              onValueChange={([value]) => setParams(prev => ({ ...prev, c: value }))}
              min={-10}
              max={10}
              step={0.1}
              className="mt-2"
            />
            <span className="text-sm text-gray-600">{c.toFixed(1)}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-center mb-4">
            <p className="text-lg font-mono">
              {a.toFixed(1)}x² + {b.toFixed(1)}x + {c.toFixed(1)} = 0
            </p>
          </div>
          
          {hasRealRoots ? (
            <div className="space-y-2">
              <p className="font-medium text-green-700">✓ A equação tem raízes reais:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded text-center">
                  x₁ = {roots[0].toFixed(2)}
                </div>
                <div className="bg-white p-2 rounded text-center">
                  x₂ = {roots[1].toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <p className="font-medium text-red-700">✗ A equação não tem raízes reais (Δ menor que 0)</p>
          )}
        </div>
      </div>
    );
  };

  const getIcon = () => {
    switch (type) {
      case 'physics': return <Calculator className="h-5 w-5" />;
      case 'economics': return <TrendingUp className="h-5 w-5" />;
      case 'history': return <History className="h-5 w-5" />;
      case 'math': return <Calculator className="h-5 w-5" />;
      default: return <Gamepad2 className="h-5 w-5" />;
    }
  };

  const renderSimulation = () => {
    switch (type) {
      case 'physics': return renderPhysicsSimulation();
      case 'economics': return renderEconomicsSimulation();
      case 'history': return renderHistorySimulation();
      case 'math': return renderMathSimulation();
      default: return <div>Simulação não implementada</div>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {getIcon()}
            <span className="ml-2">Simulador Interativo</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{topic}</Badge>
          <Badge variant="outline">{type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderSimulation()}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>💡 Dica:</strong> Experimente alterar os parâmetros e veja como eles afetam o resultado! 
            Isso ajuda a entender a relação entre as variáveis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveSimulator;
