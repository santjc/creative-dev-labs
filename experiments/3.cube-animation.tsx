import {
  Center,
  Environment,
  Html,
  OrbitControls,
  ScrollControls,
  useScroll,
} from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap, { Power2 } from 'gsap';
import React, { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { lerp } from 'three/src/math/MathUtils';

import Fallback from '@components/Fallback';

export default function Experiment() {
  return (
    <Suspense fallback={<Fallback />}>
      <Canvas
        camera={{ position: [0, 0, 20] }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={0.5} />
        <OrbitControls enableZoom={false} />
        <Environment preset={'city'} background blur={0.5} />
        <Center />
        <ScrollControls pages={2} damping={0.25}>
          <Cubos position={[-15, 0, 0]} />
          <Cubos oneByOne={false} />
        </ScrollControls>
        <Html fullscreen>
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '1em',
              fontWeight: ' bold',
            }}
          >
            Scroll down <br></br> Drag with mouse for camera control
          </div>
        </Html>
      </Canvas>
    </Suspense>
  );
}
type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
    object_11: THREE.Mesh;
    object_11_1: THREE.Mesh;
    object_15: THREE.Mesh;
    object_15_1: THREE.Mesh;
    object_16: THREE.Mesh;
    object_16_1: THREE.Mesh;
    object_18: THREE.Mesh;
    object_18_1: THREE.Mesh;
    object_19: THREE.Mesh;
    object_19_1: THREE.Mesh;
    object_2: THREE.Mesh;
    object_2_1: THREE.Mesh;
    object_6: THREE.Mesh;
    object_6_1: THREE.Mesh;
    object_8: THREE.Mesh;
    object_8_1: THREE.Mesh;
    object_9: THREE.Mesh;
    object_9_1: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    Plastic: THREE.MeshStandardMaterial;
    ['Plastic (1)']: THREE.MeshStandardMaterial;
  };
};

type CubosProps = {
  oneByOne?: boolean;
  position?: [number, number, number];
};

export const FLOOR_HEIGHT = 2.3;
export const NB_FLOORS = 3;
function Cubos({ oneByOne = true, position = [0, 0, 0] }: CubosProps) {
  const { nodes, materials } = useGLTF(
    '/models/cubos-transformed.glb'
  ) as GLTFResult;

  const parentRef = useRef<THREE.Group>(null!);
  const groupRefs = useRef<Array<THREE.Group | null>>([]);
  const animations: GSAPTween[] = [];
  const tl = useRef<any>();
  const scroll = useScroll();

  useEffect(() => {
    // Populate the groupRefs array with refs to all the child groups
    if (parentRef.current) {
      parentRef.current.traverse((child) => {
        if (child instanceof THREE.Group) {
          groupRefs.current.push(child);
        }
      });
    }
  }, []);
  useLayoutEffect(() => {
    tl.current = gsap.timeline();
    // VERTICAL ANIMATION
    tl.current.to(
      parentRef.current.position,
      {
        duration: 2,
        y: -FLOOR_HEIGHT * (NB_FLOORS - 1),
      },
      0
    );
    groupRefs.current.forEach((ref, key) => {
      gsap.set(ref && ref.position, {
        x: 50 * key,
        y: 50 * key,
        z: 50 * key,
      });
    });
  }, []);

  useFrame(() => {
    tl.current.seek(scroll.offset * tl.current.duration());

    // Move each group to a random position
    parentRef.current.rotateOnAxis(
      new THREE.Vector3(0, 1, 0),
      scroll.offset * 0.01
    );
    if (oneByOne) {
      let chain = Promise.resolve();
      groupRefs.current.forEach((ref, key) => {
        chain = chain.then(() => {
          return new Promise((resolve) => {
            gsap.to(ref && ref?.position, {
              duration: 2,
              x: lerp(ref?.position.y || 0, position[0], 1),
              y: lerp(ref?.position.y || 0, position[1], 1),
              z: lerp(ref?.position.z || 0, position[2], 1),
              ease: Power2.easeOut,
              onComplete: resolve,
            });
          });
        });
      });
    } else {
      groupRefs.current.forEach((ref, key) => {
        const animation = gsap.to(ref && ref.position, {
          duration: 5,
          x: lerp(ref?.position.y || 0, position[0], 1),
          y: lerp(ref?.position.y || 0, position[1], 1),
          z: lerp(ref?.position.z || 0, position[2], 1),
          ease: Power2.easeOut,
        });
        animations.push(animation);
      });
    }
  });

  return (
    <group
      position={position || [0, 0, 0]}
      ref={parentRef}
      scale={0.1}
      dispose={null}
    >
      <group
        ref={(group) => (groupRefs.current[0] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.object_11.geometry}
          material={materials.Plastic}
        />
        <mesh
          geometry={nodes.object_11_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[1] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.object_15.geometry}
          material={materials.Plastic}
        />
        <mesh
          geometry={nodes.object_15_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[2] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.object_16.geometry}
          material={materials.Plastic}
        />
        <mesh
          geometry={nodes.object_16_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[3] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.object_18.geometry}
          material={materials['Plastic (1)']}
        />
        <mesh
          geometry={nodes.object_18_1.geometry}
          material={materials.Plastic}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[4] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.object_19.geometry}
          material={materials['Plastic (1)']}
        />
        <mesh
          geometry={nodes.object_19_1.geometry}
          material={materials.Plastic}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[5] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh geometry={nodes.object_2.geometry} material={materials.Plastic} />
        <mesh
          geometry={nodes.object_2_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[6] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh geometry={nodes.object_6.geometry} material={materials.Plastic} />
        <mesh
          geometry={nodes.object_6_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[7] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh geometry={nodes.object_8.geometry} material={materials.Plastic} />
        <mesh
          geometry={nodes.object_8_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
      <group
        ref={(group) => (groupRefs.current[8] = group)}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh geometry={nodes.object_9.geometry} material={materials.Plastic} />
        <mesh
          geometry={nodes.object_9_1.geometry}
          material={materials['Plastic (1)']}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/cubos-transformed.glb');
