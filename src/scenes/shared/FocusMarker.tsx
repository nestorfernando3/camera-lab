export function FocusMarker({ distanceM, label }: { distanceM: number; label: string }) {
  return (
    <group position={[0, 0, -distanceM]}>
      <mesh>
        <ringGeometry args={[0.15, 0.18, 32]} />
        <meshBasicMaterial color="#e8d44d" side={2} transparent opacity={0.9} />
      </mesh>
      {/* label is for accessibility; rendered as text in DOM overlay, not 3D text */}
      <span style={{ display: "none" }}>{label}</span>
    </group>
  );
}
