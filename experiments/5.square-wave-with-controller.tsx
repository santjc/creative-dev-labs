import { roundedSquareWave } from '@app/lib/utils/math';
import {
  Environment,
  OrbitControls,
  ScrollControls,
  useGLTF,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Experiment() {
  const { frequency, size } = useControls({
    frequency: { value: 1, min: 0, max: 15, step: 0.1 },
    size: { value: 5, min: 0, max: 50, step: 1 },
  });

  return (
    <Canvas
      camera={{ position: [50, 0, 200], fov: 90 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <OrbitControls enabled={true} />
      <Environment preset={'city'} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color={'#ff0000'} />
      <pointLight position={[0, -40, 40]} intensity={0.7} color={'#fff'} />

      <ScrollControls pages={0}>
        <Model frequency={frequency} size={size} />
      </ScrollControls>
    </Canvas>
  );
}

Experiment.Title = 'Square Wave Motion with Controllers';
type GLTFResult = GLTF & {
  nodes: {
    ['9']: THREE.Mesh;
    ['8']: THREE.Mesh;
    ['18']: THREE.Mesh;
    ['6']: THREE.Mesh;
    ['21']: THREE.Mesh;
    ['27']: THREE.Mesh;
    ['24']: THREE.Mesh;
    ['19']: THREE.Mesh;
    ['25']: THREE.Mesh;
    ['22']: THREE.Mesh;
    ['23']: THREE.Mesh;
    ['26']: THREE.Mesh;
    ['20']: THREE.Mesh;
    ['12']: THREE.Mesh;
    ['15']: THREE.Mesh;
    ['10']: THREE.Mesh;
    ['16']: THREE.Mesh;
    ['13']: THREE.Mesh;
    ['14']: THREE.Mesh;
    ['17']: THREE.Mesh;
    ['11']: THREE.Mesh;
    ['3']: THREE.Mesh;
    ['1']: THREE.Mesh;
    ['7']: THREE.Mesh;
    ['4']: THREE.Mesh;
    ['5']: THREE.Mesh;
    ['2']: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    Plastic: THREE.MeshStandardMaterial;
  };
};
type ModelProps = {
  frequency?: number;
  random?: number;
  size?: number;
};
function Model({ size = 1, frequency = 1 }: ModelProps) {
  const { nodes, materials } = useGLTF(
    '/models/cubes-transformed.glb'
  ) as unknown as GLTFResult;

  const parentRef = useRef<THREE.Group>(null);
  const groupRefs = useRef<Array<THREE.Mesh | null>>([]);

  useEffect(() => {
    // Populate the groupRefs array with refs to all the child groups
    if (parentRef.current) {
      parentRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          groupRefs.current.push(child);
        }
      });
    }
  }, []);

  useFrame(({ clock }) => {
    groupRefs.current.forEach((ref, key) => {
      if (ref) {
        const time = (clock.elapsedTime + key) * 0.1 + key;
        const posScale = roundedSquareWave(
          time * frequency,
          size,
          size * size,
          frequency
        );
        ref.position.set(posScale, -posScale, posScale);
      }
    });
  });
  return (
    <group position={[0, 0, 0]} ref={parentRef} dispose={null}>
      <mesh
        geometry={nodes['27'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['26'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['25'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['24'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['23'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['22'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['21'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['20'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['19'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['18'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['17'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['16'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['15'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['14'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['13'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['12'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['11'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['10'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['9'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['8'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['7'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['6'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <mesh
        geometry={nodes['5'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['4'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['3'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['2'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes['1'].geometry}
        material={materials.Plastic}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
useGLTF.preload('/models/cubes-transformed.glb');
