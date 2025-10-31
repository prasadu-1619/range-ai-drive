import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface TerrainProps {
  terrain: 'city' | 'highway' | 'hills';
  speed: number;
}

export const Terrain = ({ terrain, speed }: TerrainProps) => {
  const terrainRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (!terrainRef.current || speed === 0) return;
    
    // Move terrain backward to simulate car movement
    terrainRef.current.position.z += (speed / 10) * delta;
    
    // Reset terrain position when it goes too far
    if (terrainRef.current.position.z > 100) {
      terrainRef.current.position.z = 0;
    }
  });
  
  if (terrain === 'city') {
    return (
      <group ref={terrainRef}>
        {/* City buildings on both sides */}
        {Array.from({ length: 24 }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const x = side * (8 + Math.random() * 4);
          const z = (Math.floor(i / 2) * -15) - 5;
          const height = Math.random() * 12 + 6;
          const width = Math.random() * 2 + 3;
          return (
            <mesh
              key={i}
              position={[x, height / 2, z]}
              castShadow
            >
              <boxGeometry args={[width, height, width]} />
              <meshStandardMaterial 
                color="#162447"
                metalness={0.5}
                roughness={0.7}
                emissive="#0d1b2a"
                emissiveIntensity={0.1}
              />
              {/* Windows */}
              <mesh position={[0, 0, width / 2 + 0.01]}>
                <planeGeometry args={[width * 0.8, height * 0.8]} />
                <meshStandardMaterial 
                  color="#ffd700"
                  emissive="#ffd700"
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </mesh>
          );
        })}
        {/* Street lights */}
        {Array.from({ length: 20 }).map((_, i) => (
          <group key={`light-${i}`} position={[-6, 0, i * -10]}>
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[0, 6, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial 
                color="#ffff00"
                emissive="#ffff00"
                emissiveIntensity={2}
              />
            </mesh>
            <pointLight position={[0, 6, 0]} intensity={2} distance={15} color="#ffff00" />
          </group>
        ))}
      </group>
    );
  }
  
  if (terrain === 'highway') {
    return (
      <group ref={terrainRef}>
        {/* Highway road markings */}
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh key={i} position={[0, 0.01, i * -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 3]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
        
        {/* Side barriers with reflectors */}
        {Array.from({ length: 40 }).map((_, i) => (
          <group key={`barrier-${i}`}>
            <mesh position={[-6, 0.5, i * -5]} castShadow>
              <boxGeometry args={[0.3, 1, 2]} />
              <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[6, 0.5, i * -5]} castShadow>
              <boxGeometry args={[0.3, 1, 2]} />
              <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Reflectors */}
            <mesh position={[-6, 0.5, i * -5]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial 
                color="#ff0000"
                emissive="#ff0000"
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        ))}
        
        {/* Trees in the distance */}
        {Array.from({ length: 30 }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const x = side * (10 + Math.random() * 5);
          const z = i * -8;
          return (
            <group key={`tree-${i}`} position={[x, 0, z]}>
              <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
                <meshStandardMaterial color="#4a3728" />
              </mesh>
              <mesh position={[0, 3.5, 0]} castShadow>
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color="#2d5016" />
              </mesh>
            </group>
          );
        })}
      </group>
    );
  }
  
  // Hills terrain
  return (
    <group ref={terrainRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i % 4) * 10 - 15 + Math.random() * 5;
        const z = Math.floor(i / 4) * -15 - 10;
        const height = Math.random() * 5 + 3;
        const radius = Math.random() * 4 + 3;
        return (
          <mesh key={i} position={[x, height / 2, z]} castShadow>
            <coneGeometry args={[radius, height, 8]} />
            <meshStandardMaterial 
              color="#2d4a3e"
              roughness={0.9}
            />
          </mesh>
        );
      })}
      {/* Rocks */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = Math.random() * 20 - 10;
        const z = i * -10;
        return (
          <mesh key={`rock-${i}`} position={[x, 0.5, z]} castShadow>
            <dodecahedronGeometry args={[Math.random() * 0.5 + 0.3, 0]} />
            <meshStandardMaterial color="#5a5a5a" roughness={0.8} />
          </mesh>
        );
      })}
      {/* Grass patches */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh 
          key={`grass-${i}`} 
          position={[Math.random() * 20 - 10, 0.01, i * -5]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[2, 16]} />
          <meshStandardMaterial color="#3a5f30" roughness={1} />
        </mesh>
      ))}
    </group>
  );
};
