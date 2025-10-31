import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Car } from './Car';
import { Terrain } from './Terrain';

interface EVSceneProps {
  speed: number;
  terrain: 'city' | 'highway' | 'hills';
}

export const EVScene = ({ speed, terrain }: EVSceneProps) => {
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
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00d9ff" />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* Scene objects */}
        <Terrain terrain={terrain} />
        <Car speed={speed} />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </Canvas>
    </div>
  );
};
