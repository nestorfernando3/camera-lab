import { Environment } from "../shared/Environment";

export function DepthScene({ backgroundDistanceM = 10 }: { backgroundDistanceM?: number }) {
  return (
    <group>
      <Environment backgroundDistance={backgroundDistanceM} />
      {/* Foreground at 1m */}
      <mesh position={[0, 0.3, -1]}>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color="#8a6be0" />
      </mesh>
      {/* Primary at 2m */}
      <mesh position={[0.6, 0.4, -2]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#e0c36b" />
      </mesh>
      {/* Background at 4m */}
      <mesh position={[-0.6, 0.35, -4]}>
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial color="#6be0a0" />
      </mesh>
      {/* Architecture plane at 10m is Environment bg */}
    </group>
  );
}
