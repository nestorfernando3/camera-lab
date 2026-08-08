import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function PedagogicalCamera({
  fovDeg,
  subjectDistanceM,
}: {
  fovDeg: number;
  subjectDistanceM: number;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fovDeg;
      camera.updateProjectionMatrix();
    }
  }, [camera, fovDeg]);

  // Discrete camera positions based on subject distance
  const z = subjectDistanceM * 2.5;
  useEffect(() => {
    camera.position.set(0, 1.6, z);
    camera.lookAt(0, 0.8, 0);
  }, [camera, z]);

  return null;
}
