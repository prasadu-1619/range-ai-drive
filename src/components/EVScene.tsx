import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Car } from './Car';
import { Terrain } from './Terrain';

interface EVSceneProps {
  speed: number;
  terrain: 'city' | 'highway' | 'hills';
  isEngineOn: boolean;
  timeOfDay: 'day' | 'night';
  headlightsOn: boolean;
  weather: string;
}

export const EVScene = ({ speed, terrain, isEngineOn, timeOfDay, headlightsOn, weather }: EVSceneProps) => {
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
        
        {/* Sun for sunny weather */}
        {weather === 'sunny' && isDaytime && (
          <>
            <mesh position={[50, 40, -50]}>
              <sphereGeometry args={[8, 32, 32]} />
              <meshStandardMaterial 
                color="#ffff00"
                emissive="#ffff00"
                emissiveIntensity={2}
              />
            </mesh>
            <pointLight position={[50, 40, -50]} intensity={2} distance={200} color="#ffff00" />
          </>
        )}
        
        {/* Environment */}
        <Environment preset={isDaytime ? 'sunset' : 'night'} />
        
        {/* Weather Effects */}
        <WeatherEffects weather={weather} />
        
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

// Weather Effects Component
const WeatherEffects = ({ weather }: { weather: string }) => {
  if (weather !== 'rainy') return null;
  
  return (
    <group>
      {/* Rain particles */}
      {Array.from({ length: 500 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 40;
        const y = Math.random() * 30 + 10;
        const z = (Math.random() - 0.5) * 40;
        const speed = Math.random() * 0.5 + 0.5;
        
        return (
          <RainDrop key={i} position={[x, y, z]} speed={speed} />
        );
      })}
    </group>
  );
};

// Individual rain drop
const RainDrop = ({ position, speed }: { position: [number, number, number]; speed: number }) => {
  const ref = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y -= speed;
    if (ref.current.position.y < 0) {
      ref.current.position.y = 30;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
      <meshStandardMaterial 
        color="#4a90e2"
        transparent
        opacity={0.6}
        emissive="#4a90e2"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};
