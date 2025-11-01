import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Car } from './Car';
import { Terrain } from './Terrain';

interface EVSceneProps {
  speed: number;
  terrain: 'city' | 'highway' | 'hills';
  isEngineOn: boolean;
  timeOfDay: 'day' | 'night';
  headlightsOn: boolean;
}

export const EVScene = ({ speed, terrain, isEngineOn, timeOfDay, headlightsOn }: EVSceneProps) => {
  const isDaytime = timeOfDay === 'day';
  
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[-8, 4, 8]} />
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        {/* Lighting */}
        <ambientLight intensity={isDaytime ? 0.6 : 0.2} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={isDaytime ? 1.2 : 0.3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color={isDaytime ? '#ffffff' : '#4a5a8a'}
        />
        <pointLight 
          position={[-10, 10, -10]} 
          intensity={isDaytime ? 0.5 : 0.3} 
          color={isDaytime ? '#00d9ff' : '#1a2550'} 
        />
        
        {/* Environment */}
        <Environment preset={isDaytime ? 'sunset' : 'night'} />
        
        {/* Scene objects */}
        <Terrain terrain={terrain} speed={speed} />
        <Car speed={speed} isEngineOn={isEngineOn} terrain={terrain} headlightsOn={headlightsOn} />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={isDaytime ? '#2a2a3e' : '#0a0a1e'} />
        </mesh>
      </Canvas>
    </div>
  );
};
