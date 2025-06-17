
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface SimulationProps {
  type: 'pendulum' | 'orbit' | 'wave' | 'collision';
  title: string;
  description: string;
}

const PendulumSimulation = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState(Math.PI / 4);
  const [velocity, setVelocity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useFrame((state, delta) => {
    if (!isPlaying || !meshRef.current) return;

    const gravity = 9.81;
    const length = 2;
    const damping = 0.995;

    const acceleration = -(gravity / length) * Math.sin(angle);
    setVelocity(prev => prev + acceleration * delta);
    setAngle(prev => prev + velocity * delta);
    setVelocity(prev => prev * damping);

    meshRef.current.position.x = length * Math.sin(angle);
    meshRef.current.position.y = -length * Math.cos(angle);
  });

  return (
    <>
      {/* Pivot point */}
      <Sphere args={[0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial color="gray" />
      </Sphere>
      
      {/* String */}
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Pendulum bob */}
      <Sphere 
        ref={meshRef} 
        args={[0.2]} 
        position={[2 * Math.sin(angle), -2 * Math.cos(angle), 0]}
      >
        <meshStandardMaterial color="red" />
      </Sphere>
      
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
};

const OrbitSimulation = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useFrame((state, delta) => {
    if (!isPlaying || !planetRef.current) return;
    
    setTime(prev => prev + delta);
    const radius = 3;
    planetRef.current.position.x = radius * Math.cos(time);
    planetRef.current.position.z = radius * Math.sin(time);
  });

  return (
    <>
      {/* Sun */}
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={0.2} />
      </Sphere>
      
      {/* Planet */}
      <Sphere ref={planetRef} args={[0.2]} position={[3, 0, 0]}>
        <meshStandardMaterial color="blue" />
      </Sphere>
      
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3.1, 64]} />
        <meshBasicMaterial color="white" transparent opacity={0.3} />
      </mesh>
      
      <OrbitControls />
    </>
  );
};

const ThreeJSSimulation = ({ type, title, description }: SimulationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationKey, setSimulationKey] = useState(0);

  const renderSimulation = () => {
    switch (type) {
      case 'pendulum':
        return <PendulumSimulation />;
      case 'orbit':
        return <OrbitSimulation />;
      default:
        return <PendulumSimulation />;
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimulationKey(prev => prev + 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
          <Canvas
            key={simulationKey}
            camera={{ position: [0, 0, 5], fov: 75 }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {renderSimulation()}
          </Canvas>
        </div>
        
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <p>Use os controles para iniciar/parar a simulação ou resetá-la.</p>
          <p>Arraste para rotacionar a visualização 3D.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeJSSimulation;
