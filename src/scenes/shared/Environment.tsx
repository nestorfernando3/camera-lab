import { useMemo } from "react";

export function Environment({ backgroundDistance }: { backgroundDistance: number }) {
  const bgZ = useMemo(() => -backgroundDistance, [backgroundDistance]);
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, 2, bgZ]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#1e1e1e" />
      </mesh>
    </>
  );
}
