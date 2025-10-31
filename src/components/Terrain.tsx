import { useRef } from 'react';
import { Mesh } from 'three';

interface TerrainProps {
  terrain: 'city' | 'highway' | 'hills';
}

export const Terrain = ({ terrain }: TerrainProps) => {
  const buildingRefs = useRef<Mesh[]>([]);
  
  if (terrain === 'city') {
    return (
      <group position={[0, 0, -10]}>
        {/* City buildings */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = (i % 4) * 8 - 12;
          const z = Math.floor(i / 4) * -10 - 5;
          const height = Math.random() * 8 + 4;
          return (
            <mesh
              key={i}
              position={[x, height / 2, z]}
              castShadow
              ref={(el) => {
                if (el) buildingRefs.current[i] = el;
              }}
            >
              <boxGeometry args={[3, height, 3]} />
              <meshStandardMaterial 
                color="#162447"
                metalness={0.5}
                roughness={0.7}
              />
            </mesh>
          );
        })}
      </group>
    );
  }
  
  if (terrain === 'highway') {
    return (
      <group>
        {/* Highway lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={i} position={[0, 0.01, i * -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
        
        {/* Side barriers */}
        {Array.from({ length: 20 }).map((_, i) => (
          <group key={`barrier-${i}`}>
            <mesh position={[-5, 0.5, i * -5]} castShadow>
              <boxGeometry args={[0.2, 1, 2]} />
              <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[5, 0.5, i * -5]} castShadow>
              <boxGeometry args={[0.2, 1, 2]} />
              <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  
  // Hills terrain
  return (
    <group>
      {Array.from({ length: 8 }).map((_, i) => {
        const x = (i % 3) * 12 - 12;
        const z = Math.floor(i / 3) * -12 - 10;
        const height = Math.random() * 3 + 2;
        return (
          <mesh key={i} position={[x, height / 2, z]} castShadow>
            <coneGeometry args={[4, height, 8]} />
            <meshStandardMaterial color="#2d4a3e" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};
