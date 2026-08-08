import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "../shared/Environment";

export function RunnerScene({
  backgroundDistanceM = 12,
  reducedMotion = false,
}: {
  backgroundDistanceM?: number;
  reducedMotion?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.x = Math.sin(t * 0.6) * 3;
  });

  return (
    <group>
      <Environment backgroundDistance={backgroundDistanceM} />
      {/* Track */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Runner low-poly */}
      <group ref={groupRef} position={[0, 0.2, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#d0b090" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <capsuleGeometry args={[0.18, 0.4, 4, 8]} />
          <meshStandardMaterial color="#e85d4d" />
        </mesh>
        <mesh position={[-0.12, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0.12, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
      {/* Background blocks */}
      <mesh position={[-4, 0.6, -8]}>
        <boxGeometry args={[1, 1.2, 1]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[0, 0.8, -10]}>
        <boxGeometry args={[1.2, 1.6, 1]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[4, 0.5, -9]}>
        <boxGeometry args={[0.9, 1, 0.9]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  );
}
