
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info, Shield, Lightbulb, Eye } from 'lucide-react';

interface AIControlSettingsProps {
  settings: {
    creativityLevel: number;
    citationMode: boolean;
    antiCheatMode: boolean;
    transparencyMode: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

const AIControlSettings = ({ settings, onSettingsChange }: AIControlSettingsProps) => {
  const [creativityLevel, setCreativityLevel] = useState(settings.creativityLevel);
  const [citationMode, setCitationMode] = useState(settings.citationMode);
  const [antiCheatMode, setAntiCheatMode] = useState(settings.antiCheatMode);
  const [transparencyMode, setTransparencyMode] = useState(settings.transparencyMode);

  const handleCreativityChange = (value: number[]) => {
    const newLevel = value[0];
    setCreativityLevel(newLevel);
    onSettingsChange({
      ...settings,
      creativityLevel: newLevel
    });
  };

  const getCreativityLabel = (level: number) => {
    if (level <= 30) return { label: 'Guardião do Conteúdo', color: 'bg-blue-100 text-blue-800' };
    if (level <= 70) return { label: 'Equilibrado', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Parceiro de Ideias', color: 'bg-green-100 text-green-800' };
  };

  const creativityInfo = getCreativityLabel(creativityLevel);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Controle de Comportamento da IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Termostato de Criatividade */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Termostato de Controle</Label>
              <Badge className={creativityInfo.color}>
                {creativityInfo.label}
              </Badge>
            </div>
            
            <div className="px-4">
              <Slider
                value={[creativityLevel]}
                onValueChange={handleCreativityChange}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Precisão
                </span>
                <span className="flex items-center">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Criatividade
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Como a IA se comportará:</h4>
              {creativityLevel <= 30 && (
                <p className="text-sm text-gray-700">
                  <strong>Modo Guardião:</strong> A IA se aterá estritamente ao material fornecido. 
                  Se não souber, dirá claramente que a informação não está disponível no material.
                </p>
              )}
              {creativityLevel > 30 && creativityLevel <= 70 && (
                <p className="text-sm text-gray-700">
                  <strong>Modo Equilibrado:</strong> A IA usará principalmente o material fornecido, 
                  mas pode criar analogias simples e exemplos baseados no conteúdo.
                </p>
              )}
              {creativityLevel > 70 && (
                <p className="text-sm text-gray-700">
                  <strong>Modo Parceiro:</strong> A IA pode criar analogias criativas, exemplos novos 
                  e conectar ideias usando conhecimento geral para enriquecer o aprendizado.
                </p>
              )}
            </div>
          </div>

          {/* Outras Configurações */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Citação de Fontes</Label>
                <p className="text-xs text-gray-600">
                  Mostra sempre de onde veio cada informação
                </p>
              </div>
              <Switch
                checked={citationMode}
                onCheckedChange={(checked) => {
                  setCitationMode(checked);
                  onSettingsChange({ ...settings, citationMode: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Detecção Anti-Cola</Label>
                <p className="text-xs text-gray-600">
                  Detecta questões de prova e redireciona o aprendizado
                </p>
              </div>
              <Switch
                checked={antiCheatMode}
                onCheckedChange={(checked) => {
                  setAntiCheatMode(checked);
                  onSettingsChange({ ...settings, antiCheatMode: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Modo Transparência</Label>
                <p className="text-xs text-gray-600">
                  Explica como chegou a cada resposta
                </p>
              </div>
              <Switch
                checked={transparencyMode}
                onCheckedChange={(checked) => {
                  setTransparencyMode(checked);
                  onSettingsChange({ ...settings, transparencyMode: checked });
                }}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-800 mb-2">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Controle Total</span>
            </div>
            <p className="text-xs text-blue-700">
              Essas configurações garantem que a IA se comporte exatamente como você deseja, 
              mantendo a integridade acadêmica e sua confiança.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIControlSettings;
