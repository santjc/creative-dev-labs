import styles from '@app/styles/experiments/7.chained-cubes.module.scss';
import {
  Environment,
  Html,
  ScrollControls,
  useGLTF,
  useScroll,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap, { Power1 } from 'gsap';
import { Power2 } from 'gsap';
import { useEffect, useRef } from 'react';
import { Group, Mesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { lerp } from 'three/src/math/MathUtils';
import { degToRad } from 'three/src/math/MathUtils';

export default function Experiment() {
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 50 }}
      style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}
    >
      <Environment preset="forest" />
      <pointLight position={[10, 10, 10]} color={'red'}/>
      <pointLight position={[-10, 0, 30]} intensity={0.5} color={'white'}/>
      <ScrollControls pages={2}>
        <group>
          <Model />
        </group>
      </ScrollControls>
    </Canvas>
  );
}
Experiment.Title = 'Chain Cubes on Scroll';
type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
    cubo_4: THREE.Mesh;
    object_2: THREE.Mesh;
    object_2_1: THREE.Mesh;
    object_7: THREE.Mesh;
    object_7_1: THREE.Mesh;
    object_8: THREE.Mesh;
    object_8_1: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    ['Plastic (1)']: THREE.MeshStandardMaterial;
    Plastic: THREE.MeshStandardMaterial;
  };
};

function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/chained-cubes-transformed.glb'
  ) as GLTFResult;
  const groupRefs = useRef<Array<Group>>([]);
  const parentRef = useRef<Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();
  const tl = useRef<GSAPTimeline>();

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true, delay: 2 });
    if (parentRef.current) {
      parentRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          child.traverse((_child) => {
            if (_child instanceof Group) {
              groupRefs.current.push(_child);
            }
          });
        }
      });
    }

    groupRefs.current.forEach((group, key) => {
      if (group) {
        group.position.set(-200 * Math.cos(key), -50 * Math.sin(key), 0);
        group.rotation.y = Math.PI;
        group.rotation.z = Math.PI;
      }
    });

    groupRefs.current.forEach((group) => {
      if (group) {
        tl.current?.add('start').to(
          group.rotation,
          {
            duration: 1,
            z: 0,
            y: 0,
            ease: Power1.easeInOut,
          },
          'start'
        );
        tl.current?.to(
          group.position,
          {
            duration: 1,
            x: 0,
            y: 0,
            ease: Power2.easeInOut,
          },
          'start'
        );
      }
    });
  }, []);

  useFrame(({ camera }) => {
    if (camera.position.z > 25) {
      tl.current?.play();
    } else {
      if (camera.position.z < 5) {
        tl.current?.seek(0);
      }
    }

    gsap.to(camera.position, {
      duration: 0.5,
      z: lerp(camera.position.z, scroll.offset * 75, 0.7),
    });
    gsap.to(camera.rotation, {
      duration: 0.5,
      z: lerp(camera.rotation.z, scroll.offset * degToRad(45), 0.7),
    });

    gsap.to(htmlRef.current, {
      duration: 1,
      scale: lerp(1.3, 0, scroll.offset),
      opacity: lerp(1, 0, scroll.offset),
    });
  });

  return (
    <>
      <Html fullscreen position={[0, 0, 200]}>
        <div ref={htmlRef} className={styles.container}>
          <h1>Welcome to Kelsus Labs</h1>
          <h3>Scroll down!</h3>
        </div>
      </Html>
      <group ref={parentRef} {...props} dispose={null}>
        <mesh>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.cubo_4.geometry}
              material={materials['Plastic (1)']}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object_2.geometry}
              material={materials['Plastic (1)']}
            />
            <mesh
              geometry={nodes.object_2_1.geometry}
              material={materials.Plastic}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object_8.geometry}
              material={materials.Plastic}
            />
            <mesh
              geometry={nodes.object_8_1.geometry}
              material={materials['Plastic (1)']}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.object_7.geometry}
              material={materials['Plastic (1)']}
            />
            <mesh
              geometry={nodes.object_7_1.geometry}
              material={materials.Plastic}
            />
          </group>
        </mesh>
      </group>
    </>
  );
}

useGLTF.preload('/models/chained-cubes-transformed.glb');
