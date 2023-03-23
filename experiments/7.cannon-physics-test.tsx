import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { Color, InstancedMesh, Mesh } from 'three';
import * as THREE from 'three';

export default function Experiment() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 50 }}
      style={{ width: '100vw', height: '100vh' }}
      shadows
    >
      <color attach="background" args={['lightblue']} />

      <Stage adjustCamera={false} shadows="contact">
        <OrbitControls />
        <Physics>
          <Cubes number={200} />
          <Plane />
        </Physics>
      </Stage>
    </Canvas>
  );
}
Experiment.Title = 'Cannon.JS Physics Test';
type CubesProps = {
  number: number;
};
function Plane() {
  const [ref] = usePlane<Mesh>(() => ({
    mass: 0,
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <shadowMaterial attach="material" color="#171717" opacity={0.5} />
    </mesh>
  );
}
function Cubes({ number }: CubesProps) {
  const [ref, api] = useBox<InstancedMesh>(() => ({
    mass: 1,
    args: [0.1, 0.1, 0.1],
    position: [Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5],
  }));
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  useLayoutEffect(() => {
    if (materialRef.current) {
      const meshMaterial = materialRef.current;
      meshMaterial.color = new Color('red');
      meshMaterial.roughness = 0.5;
      meshMaterial.metalness = 0.7;
      meshMaterial.emissiveIntensity = 0.5;
    }
  }, [number]);

  useFrame(() =>
    api
      .at(Math.floor(Math.random() * number))
      .position.set(0, Math.random() * 2, 0)
  );

  return (
    <instancedMesh
      receiveShadow
      castShadow
      ref={ref}
      args={[geometryRef.current, materialRef.current, number]}
    >
      <boxBufferGeometry
        ref={geometryRef}
        attach="geometry"
        args={[0.1, 0.1, 0.1]}
      ></boxBufferGeometry>
      <meshPhysicalMaterial ref={materialRef} />
    </instancedMesh>
  );
}
