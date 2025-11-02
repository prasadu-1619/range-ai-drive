import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface CarProps {
  speed: number;
  isEngineOn: boolean;
  terrain: 'city' | 'highway' | 'hills';
  headlightsOn: boolean;
}

export const Car = ({ speed, isEngineOn, terrain, headlightsOn }: CarProps) => {
  const carRef = useRef<Group>(null);
  const wheelsRef = useRef<Mesh[]>([]);
  
  useFrame((state, delta) => {
    if (!carRef.current) return;
    
    // Calculate terrain-based position for hills with smoother transitions
    let baseY = 0.5;
    let tiltAngle = 0;
    
    if (terrain === 'hills' && isEngineOn) {
      // Smoother hill simulation with gradual slopes
      const hillPhase = state.clock.elapsedTime * (speed / 80);
      const hillHeight = Math.sin(hillPhase * 0.8) * 1.2 + Math.cos(hillPhase * 0.5) * 0.8;
      baseY = 0.5 + hillHeight;
      
      // Calculate tilt based on hill slope
      const slope = Math.cos(hillPhase * 0.8) * 0.8 * 0.8 - Math.sin(hillPhase * 0.5) * 0.8 * 0.5;
      tiltAngle = slope * 0.15;
    }
    
    // Apply position with subtle hovering
    carRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    
    // Rotate wheels based on speed - FORWARD direction (negative rotation)
    if (isEngineOn && speed > 0) {
      const rotationSpeed = (speed / 50) * delta * 10;
      wheelsRef.current.forEach(wheel => {
        if (wheel) {
          wheel.rotation.x -= rotationSpeed; // Negative for forward motion
        }
      });
      
      // Apply tilt based on terrain
      if (terrain === 'hills') {
        carRef.current.rotation.x = tiltAngle;
      } else {
        carRef.current.rotation.x = -speed * 0.0008; // Slight forward lean
      }
    }
  });
  
  return (
    <group ref={carRef} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]}>
      {/* Modern EV Body - Sleek aerodynamic design */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.9, 0.6, 4.2]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          metalness={0.9}
          roughness={0.1}
          emissive="#00d9ff"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Aerodynamic front bumper */}
      <mesh position={[0, -0.15, 2.2]} castShadow>
        <boxGeometry args={[1.9, 0.3, 0.3]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Hood details - sporty lines */}
      <mesh position={[0, 0.31, 1.5]} castShadow>
        <boxGeometry args={[1.6, 0.02, 1.2]} />
        <meshStandardMaterial 
          color="#0099cc" 
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      
      {/* Modern cabin with curved roof */}
      <mesh position={[0, 0.5, -0.3]} castShadow>
        <boxGeometry args={[1.8, 0.7, 2.2]} />
        <meshStandardMaterial 
          color="#0a1929"
          metalness={0.8}
          roughness={0.2}
          emissive="#001a33"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.65, 0.8]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 0.6, 0.1]} />
        <meshStandardMaterial 
          color="#1a3d5c"
          metalness={0.5}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.6, -1.3]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 0.5, 0.1]} />
        <meshStandardMaterial 
          color="#1a3d5c"
          metalness={0.5}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Side mirrors */}
      <mesh position={[-1.0, 0.4, 0.5]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.2]} />
        <meshStandardMaterial color="#0a1929" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.0, 0.4, 0.5]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.2]} />
        <meshStandardMaterial color="#0a1929" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Wheels - Modern EV style */}
      {[
        [-0.85, -0.25, 1.3],
        [0.85, -0.25, 1.3],
        [-0.85, -0.25, -1.3],
        [0.85, -0.25, -1.3],
      ].map((pos, i) => (
        <group key={i}>
          {/* Tire */}
          <mesh
            position={pos as [number, number, number]}
            rotation={[0, 0, Math.PI / 2]}
            ref={(el) => {
              if (el) wheelsRef.current[i] = el;
            }}
            castShadow
          >
            <cylinderGeometry args={[0.38, 0.38, 0.35, 20]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Rim */}
          <mesh
            position={pos as [number, number, number]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.25, 0.25, 0.36, 20]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* Headlights */}
      {headlightsOn && (
        <>
          <pointLight position={[0, 0, 2.2]} intensity={3} color="#ffffff" distance={15} />
          <spotLight 
            position={[-0.6, 0, 2.1]}
            angle={0.6}
            penumbra={0.5}
            intensity={2}
            distance={20}
            color="#ffffff"
            target-position={[-2, 0, 10] as any}
          />
          <spotLight 
            position={[0.6, 0, 2.1]}
            angle={0.6}
            penumbra={0.5}
            intensity={2}
            distance={20}
            color="#ffffff"
            target-position={[2, 0, 10] as any}
          />
        </>
      )}
      <mesh position={[-0.6, 0, 2.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={headlightsOn ? 3 : 0.5} 
        />
      </mesh>
      <mesh position={[0.6, 0, 2.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={headlightsOn ? 3 : 0.5} 
        />
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
