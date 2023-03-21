import styles from '@app/lib/scss/instructions.module.scss';
import {
  Environment,
  Html,
  OrbitControls,
  ScrollControls,
  useGLTF,
  useScroll,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap, { Power2 } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Experiment() {
  return (
    <Canvas
      camera={{ position: [0, 0, 200], fov: 90 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <OrbitControls enableZoom={false} enableRotate={false} />
      <Environment preset={'dawn'} />
      <ScrollControls pages={2}>
        <Model />
        <Html fullscreen>
          <div className={styles.instructions}>
            <p>Scroll to read the label</p>
          </div>

          <div
            style={{ transform: 'translateY(280vh)' }}
            className={styles.instructions}
          >
            <p>Move mouse to left or right to rotate</p>
          </div>
        </Html>
      </ScrollControls>
    </Canvas>
  );
}

Experiment.Title = 'Rotate 3D Can on Scroll';

type GLTFResult = GLTF & {
  nodes: {
    ['Soup_Can_01_-_Default_0']: THREE.Mesh;
    ['Soup_Can_02_-_Default_0']: THREE.Mesh;
  };
  materials: {
    ['01_-_Default']: THREE.MeshStandardMaterial;
    ['02_-_Default']: THREE.MeshStandardMaterial;
  };
};

function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/can_soup-transformed.glb'
  ) as GLTFResult;

  const tl = useRef<any>();
  const modelRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const FLOOR_HEIGHT = 40;
  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    // VERTICAL ANIMATION
    tl.current.to(
      modelRef.current.position,
      {
        duration: 2,
        y: -FLOOR_HEIGHT,
      },
      0
    );
  }, []);
  useFrame(({ camera, mouse }) => {
    tl.current.seek(scroll.offset * tl.current.duration());

    gsap.to(modelRef.current.rotation, {
      duration: 0.5,
      y: THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        THREE.MathUtils.degToRad(360 * mouse.x) * scroll.offset,
        0.05
      ),
      x: THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        -THREE.MathUtils.degToRad(360) * scroll.offset,
        0.5
      ),
      ease: Power2.easeOut,
    });

    gsap.to(camera.position, {
      duration: 0.5,
      z: THREE.MathUtils.lerp(
        camera.position.z,
        200 * -scroll.offset + 250,
        0.7
      ),
    });
  });
  return (
    <group ref={modelRef} {...props} scale={0.5} dispose={null}>
      <group
        position={[-0.53, 0, 0.08]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.7, 0.7, 1]}
      >
        <mesh
          geometry={nodes['Soup_Can_01_-_Default_0'].geometry}
          material={materials['01_-_Default']}
        />
        <mesh
          geometry={nodes['Soup_Can_02_-_Default_0'].geometry}
          material={materials['02_-_Default']}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/can_soup-transformed.glb');
