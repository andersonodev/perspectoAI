
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box } from 'lucide-react';

interface ThreeJSSimulationProps {
  type?: string;
  title?: string;
  description?: string;
  topic?: string;
}

const ThreeJSSimulation = ({ 
  type = "simulation", 
  title = "Simulação 3D",
  description = "Visualização interativa",
  topic = "Conceito 3D" 
}: ThreeJSSimulationProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Box className="h-5 w-5" />
          <span>{title || `Simulação Visual: ${topic}`}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 text-center">
          <Box className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            (Simulação 3D será implementada em versões futuras)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeJSSimulation;
