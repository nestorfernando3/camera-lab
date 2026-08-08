import { Environment } from "../shared/Environment";

export function PortraitScene({ backgroundDistanceM = 10 }: { backgroundDistanceM?: number }) {
  return (
    <group>
      <Environment backgroundDistance={backgroundDistanceM} />
      {/* Stylized bust */}
      <group position={[0, 0.9, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#c9a99c" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.7, 12]} />
          <meshStandardMaterial color="#4a6fa5" />
        </mesh>
      </group>
      {/* Foreground reference object */}
      <mesh position={[-0.8, 0.2, 1]}>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshStandardMaterial color="#6b6b6b" />
      </mesh>
      {/* Background reference */}
      <mesh position={[1.2, 0.5, -backgroundDistanceM + 2]}>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}
