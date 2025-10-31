import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface TerrainProps {
  terrain: 'city' | 'highway' | 'hills';
  speed: number;
}

export const Terrain = ({ terrain, speed }: TerrainProps) => {
  const terrainRef = useRef<Group>(null);
  const groundRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (!terrainRef.current || speed === 0) return;
    
    // Move terrain backward to simulate car movement
    terrainRef.current.position.z += (speed / 10) * delta;
    
    // Reset terrain position when it goes too far
    if (terrainRef.current.position.z > 100) {
      terrainRef.current.position.z = 0;
    }
  });
  
  // Create dynamic ground elevation for hills
  const getGroundHeight = (z: number) => {
    if (terrain !== 'hills') return 0;
    // Create wavy terrain for hills
    return Math.sin(z * 0.1) * 3 + Math.cos(z * 0.15) * 2;
  };
  
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
  
  // Hills terrain with actual elevation
  return (
    <group ref={terrainRef}>
      {/* Create wavy ground segments */}
      {Array.from({ length: 50 }).map((_, i) => {
        const z = i * -2;
        const height = getGroundHeight(z);
        const nextHeight = getGroundHeight(z - 2);
        const avgHeight = (height + nextHeight) / 2;
        const slope = (nextHeight - height) / 2;
        
        return (
          <mesh 
            key={`ground-${i}`} 
            position={[0, avgHeight, z - 1]} 
            rotation={[-Math.PI / 2 + slope * 0.3, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 2, 4, 4]} />
            <meshStandardMaterial 
              color="#3a5f30"
              roughness={0.9}
            />
          </mesh>
        );
      })}
      
      {/* Hills on sides */}
      {Array.from({ length: 20 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * (8 + Math.random() * 4);
        const z = i * -10 - 10;
        const groundHeight = getGroundHeight(z);
        const height = Math.random() * 8 + 5;
        const radius = Math.random() * 5 + 4;
        
        return (
          <mesh key={i} position={[x, groundHeight + height / 2, z]} castShadow>
            <coneGeometry args={[radius, height, 8]} />
            <meshStandardMaterial 
              color="#2d5a3e"
              roughness={0.85}
            />
          </mesh>
        );
      })}
      
      {/* Rocks on terrain */}
      {Array.from({ length: 25 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 18;
        const z = i * -8;
        const groundHeight = getGroundHeight(z);
        return (
          <mesh key={`rock-${i}`} position={[x, groundHeight + 0.3, z]} castShadow>
            <dodecahedronGeometry args={[Math.random() * 0.6 + 0.3, 0]} />
            <meshStandardMaterial color="#5a5a5a" roughness={0.8} />
          </mesh>
        );
      })}
      
      {/* Trees scattered on hills */}
      {Array.from({ length: 15 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * (6 + Math.random() * 3);
        const z = i * -12;
        const groundHeight = getGroundHeight(z);
        
        return (
          <group key={`tree-${i}`} position={[x, groundHeight, z]}>
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
};
