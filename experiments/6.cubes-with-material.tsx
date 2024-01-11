import { Stage, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap, { Power1 } from 'gsap';
import { Power2 } from 'gsap';
import { useEffect, useRef } from 'react';
import { BasicShadowMap, Group, Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { degToRad } from 'three/src/math/MathUtils';

export default function Experiment() {
  return (
    <Canvas
      camera={{ position: [0, 5, 100], fov: 50 }}
      style={{ width: '100vw', height: '100vh' }}
      shadows={{ type: BasicShadowMap }}
    >
      <Stage intensity={0.1} adjustCamera={false} shadows="contact">
        <Model />
      </Stage>
    </Canvas>
  );
}
Experiment.Title = 'Chained Cubes - Material Change';

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
    object_12_1: THREE.Mesh;
    object_12_2: THREE.Mesh;
    object_13_1: THREE.Mesh;
    object_13_2: THREE.Mesh;
    object_16_1: THREE.Mesh;
    object_16_2: THREE.Mesh;
    object_24: THREE.Mesh;
    object_41_1: THREE.Mesh;
    object_41_2: THREE.Mesh;
    object_42_1: THREE.Mesh;
    object_42_2: THREE.Mesh;
    object_43_1: THREE.Mesh;
    object_43_2: THREE.Mesh;
    object_44: THREE.Mesh;
    object_45: THREE.Mesh;
    object_46: THREE.Mesh;
    object_48_1: THREE.Mesh;
    object_48_2: THREE.Mesh;
    object_49_1: THREE.Mesh;
    object_49_2: THREE.Mesh;
    object_50_1: THREE.Mesh;
    object_50_2: THREE.Mesh;
    object_51: THREE.Mesh;
    object_52_1: THREE.Mesh;
    object_52_2: THREE.Mesh;
    object_53: THREE.Mesh;
    object_54: THREE.Mesh;
    object_55: THREE.Mesh;
    object_56: THREE.Mesh;
    object_57_1: THREE.Mesh;
    object_57_2: THREE.Mesh;
    object_58_1: THREE.Mesh;
    object_58_2: THREE.Mesh;
    object_59_1: THREE.Mesh;
    object_59_2: THREE.Mesh;
    object_60_1: THREE.Mesh;
    object_60_2: THREE.Mesh;
    object_61: THREE.Mesh;
    object_62_1: THREE.Mesh;
    object_62_2: THREE.Mesh;
    object_63_1: THREE.Mesh;
    object_63_2: THREE.Mesh;
    object_66: THREE.Mesh;
    object_67: THREE.Mesh;
    object_8: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    Plastic: THREE.MeshStandardMaterial;
    ['Plastic (1)']: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/chained-cubes-02-transformed.glb'
  ) as unknown as GLTFResult;
  const parentRef = useRef<Group>(null!);
  const groupRefs = useRef<Array<Mesh | Group | null>>([]);
  const connectionRefs = useRef<Array<Mesh | Group | null>>([]);

  const tl = useRef<GSAPTimeline>();

  const onMaterial = new MeshStandardMaterial({
    color: 'cyan',
    roughness: 0.5,
    metalness: 1,
    emissiveIntensity: 0.3,
    emissive: 'cyan',
  });

  const offMaterial = new MeshStandardMaterial({
    color: 'cyan',
    roughness: 0.5,
    metalness: 0.5,
    emissiveIntensity: 0,
    emissive: 'black',
    transparent: true,
    opacity: 0.2,
  });

  useEffect(() => {
    tl.current = gsap.timeline({
      delay: 1,
      paused: false,
      repeat: -1,
      repeatDelay: 3,
      yoyo: true,
    });
    parentRef.current.position.set(0, 0, 0);
    parentRef.current.rotation.set(0, -0.5, 0);
    groupRefs.current.forEach((ref) => {
      gsap.set(ref && ref.position, {
        x: 200 * Math.cos(degToRad(45)),
        y: 200 * Math.sin(degToRad(45)),
      });
      gsap.set(ref && ref.rotation, {
        z: degToRad(45),
        y: degToRad(45),
      });
    });
    if (parentRef.current) {
      parentRef.current.traverse((child) => {
        if (child instanceof Group) {
          child.traverse((_child) => {
            if (_child instanceof Mesh) {
              _child.castShadow = false;
              _child.receiveShadow = false;
              _child.material.emissiveIntensity = 0;
            }
          });
        }
      });
    }

    if (connectionRefs.current) {
      connectionRefs.current.map((item) => {
        if (item instanceof Mesh) {
          item.material = offMaterial;
        }
      });
    }
    groupRefs.current.reverse().forEach((group) => {
      if (group) {
        tl.current?.add('start').to(
          group.rotation,
          {
            duration: 0.7,
            z: 0,
            y: 0,
            ease: Power1.easeInOut,
            delay: 0.3,
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
    const connectionAnimations: GSAPAnimation[] = [];

    connectionRefs.current.forEach((item) => {
      if (item instanceof Mesh) {
        const animation = gsap.to(item, {
          duration: 0.2,
          delay: 0.5,
          material: onMaterial,
          ease: Power1.easeInOut,
        });
        connectionAnimations.push(animation);
      }
    });
    const cameraRotate = gsap.to(parentRef.current.rotation, {
      duration: 1,
      y: -0.3,
      ease: Power1.easeInOut,
    });
    const cameraMove = gsap.to(parentRef.current.position, {
      duration: 1,
      z: 20,
      ease: Power1.easeInOut,
    });
    tl.current?.add(cameraRotate, 'start');
    tl.current?.add(cameraMove, 'start');

    tl.current?.add(connectionAnimations, 'connection');
  }, []);

  useFrame((state) => {
    state.camera.position.y = 50;
    state.camera.lookAt(parentRef?.current?.position);
  });
  return (
    <>
      <group {...props} ref={parentRef} rotation={[0, 0, 0]} dispose={null}>
        <group
          ref={(group) => (groupRefs.current[0] = group)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            geometry={nodes.object_12_1.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[7] = mesh)}
          />
          <mesh
            castShadow
            geometry={nodes.object_12_2.geometry}
            material={materials['Plastic (1)']}
          />
        </group>
        <group
          ref={(group) => (groupRefs.current[1] = group)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            geometry={nodes.object_13_1.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[8] = mesh)}
          />
          <mesh
            castShadow
            geometry={nodes.object_13_2.geometry}
            material={materials['Plastic (1)']}
          />
        </group>
        <group
          ref={(group) => (groupRefs.current[2] = group)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            geometry={nodes.object_63_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_63_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[10] = mesh)}
          />
        </group>
        <group
          ref={(group) => (groupRefs.current[3] = group)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            geometry={nodes.object_62_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_62_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[11] = mesh)}
          />
        </group>
        <group
          rotation={[Math.PI / 2, 0, 0]}
          ref={(group) => (groupRefs.current[4] = group)}
        >
          <mesh
            castShadow
            geometry={nodes.object_53.geometry}
            material={materials['Plastic (1)']}
          />
        </group>
        <group
          rotation={[Math.PI / 2, 0, 0]}
          ref={(group) => (groupRefs.current[5] = group)}
        >
          <mesh
            castShadow
            geometry={nodes.object_61.geometry}
            material={materials['Plastic (1)']}
          />
        </group>
        <group
          rotation={[Math.PI / 2, 0, 0]}
          ref={(group) => (groupRefs.current[6] = group)}
        >
          <mesh
            castShadow
            geometry={nodes.object_67.geometry}
            material={materials['Plastic (1)']}
          />
        </group>
        <group
          ref={(group) => (groupRefs.current[7] = group)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <mesh
            castShadow
            geometry={nodes.object_16_1.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[9] = mesh)}
          />
          <mesh
            castShadow
            geometry={nodes.object_16_2.geometry}
            material={materials['Plastic (1)']}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_60_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            ref={(mesh) => (connectionRefs.current[0] = mesh)}
            castShadow
            geometry={nodes.object_60_2.geometry}
            material={materials.Plastic}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_59_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_59_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[1] = mesh)}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_58_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_58_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[2] = mesh)}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_57_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_57_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[3] = mesh)}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_50_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_50_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[4] = mesh)}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_48_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_48_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[5] = mesh)}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_41_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_41_2.geometry}
            material={materials.Plastic}
            ref={(mesh) => (connectionRefs.current[6] = mesh)}
          />
        </group>
        <group>
          <mesh
            castShadow
            geometry={nodes.Cube.geometry}
            material={materials.Material}
          />
        </group>

        <group>
          <mesh
            castShadow
            geometry={nodes.object_24.geometry}
            material={materials.Plastic}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>

        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_42_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_42_2.geometry}
            material={materials.Plastic}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_43_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_43_2.geometry}
            material={materials.Plastic}
          />
        </group>
        <group>
          <mesh
            castShadow
            geometry={nodes.object_44.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
        <group>
          <mesh
            castShadow
            geometry={nodes.object_45.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
        <group>
          <mesh
            castShadow
            geometry={nodes.object_46.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>

        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_49_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_49_2.geometry}
            material={materials.Plastic}
          />
        </group>

        <group>
          <mesh
            castShadow
            geometry={nodes.object_51.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            geometry={nodes.object_52_1.geometry}
            material={materials['Plastic (1)']}
          />
          <mesh
            castShadow
            geometry={nodes.object_52_2.geometry}
            material={materials.Plastic}
          />
        </group>

        <group>
          <mesh
            castShadow
            geometry={nodes.object_54.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
        <group>
          <mesh
            castShadow
            geometry={nodes.object_55.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
        <group>
          <mesh
            castShadow
            geometry={nodes.object_56.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>

        <group>
          <mesh
            castShadow
            geometry={nodes.object_66.geometry}
            material={materials['Plastic (1)']}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('/models/chained-cubes-02-transformed.glb');
