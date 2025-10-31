import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface CarProps {
  speed: number;
  isEngineOn: boolean;
  terrain: 'city' | 'highway' | 'hills';
}

export const Car = ({ speed, isEngineOn, terrain }: CarProps) => {
  const carRef = useRef<Group>(null);
  const wheelsRef = useRef<Mesh[]>([]);
  
  useFrame((state, delta) => {
    if (!carRef.current) return;
    
    // Calculate terrain-based position for hills
    let baseY = 0.5;
    if (terrain === 'hills' && isEngineOn && speed > 0) {
      // Simulate going up and down hills
      baseY = 0.5 + Math.sin(state.clock.elapsedTime * (speed / 50)) * 1.5;
    }
    
    // Subtle hovering animation
    carRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    
    // Rotate wheels based on speed and engine state
    if (isEngineOn && speed > 0) {
      const rotationSpeed = (speed / 50) * delta * 10;
      wheelsRef.current.forEach(wheel => {
        if (wheel) {
          wheel.rotation.x += rotationSpeed;
        }
      });
      
      // Add tilt based on terrain and speed
      if (terrain === 'hills') {
        carRef.current.rotation.x = Math.sin(state.clock.elapsedTime * (speed / 50)) * 0.15 - speed * 0.001;
      } else {
        carRef.current.rotation.x = -speed * 0.001;
      }
    }
  });
  
  return (
    <group ref={carRef} position={[0, 0.5, 0]}>
      {/* Car body */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          metalness={0.8}
          roughness={0.2}
          emissive="#00d9ff"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Car cabin */}
      <mesh position={[0, 0.6, -0.5]} castShadow>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial 
          color="#001a33"
          metalness={0.9}
          roughness={0.1}
          emissive="#00d9ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Wheels */}
      {[
        [-0.8, -0.3, 1.2],
        [0.8, -0.3, 1.2],
        [-0.8, -0.3, -1.2],
        [0.8, -0.3, -1.2],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          ref={(el) => {
            if (el) wheelsRef.current[i] = el;
          }}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Headlights */}
      <pointLight position={[0, 0, 2.2]} intensity={1} color="#ffffff" distance={10} />
      <mesh position={[-0.6, 0, 2.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.6, 0, 2.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-0.6, 0, -2.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.6, 0, -2.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};
