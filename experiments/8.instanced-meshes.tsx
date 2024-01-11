import { centerGeometry } from '@app/lib/utils';
import { Physics, useCylinder, usePlane } from '@react-three/cannon';
import {
  Html,
  Instance,
  Instances,
  OrbitControls,
  Stage,
  useGLTF,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Color, InstancedMesh, Mesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Experiment() {
  const [playAnimation, setPlayAnimation] = useState(false);
  return (
    <Canvas
      camera={{ position: [0, 10, 30], zoom: 15 }}
      orthographic
      style={{ width: '100vw', height: '100vh' }}
      shadows
    >
      <color attach="background" args={['lightblue']} />
      <Stage
        preset={'portrait'}
        intensity={0.8}
        adjustCamera={false}
        shadows="contact"
      >
        <OrbitControls />
        <Physics gravity={[0, -30, 0]}>
          <Coins playAnimation={playAnimation} />
          <Model />
        </Physics>
      </Stage>
      <Html fullscreen>
        <button
          style={{
            display: 'flex',
            width: '200px',
            padding: '8px',
            background: ' #fff',
            border: '1px solid black',
            margin: '16px auto',
            cursor: 'pointer',
            borderRadius: '8px',
          }}
          onClick={() => setPlayAnimation(true)}
        >
          <p
            style={{
              color: '#000',
              fontWeight: 'bold',
              margin: 'auto',
              textTransform: 'uppercase',
            }}
          >
            Play Animation
          </p>
        </button>
      </Html>
    </Canvas>
  );
}
Experiment.Title = 'Instanced Meshes';

type GLTFResult = GLTF & {
  nodes: {
    coin_01: THREE.Mesh;
  };
  materials: {
    ['Plastic (5)']: THREE.MeshStandardMaterial;
  };
};
type CoinProps = {
  position?: [number, number, number];
  playAnimation?: boolean;
};

function Coins({ playAnimation = false }: { playAnimation?: boolean }) {
  const { nodes, materials } = useGLTF(
    '/models/coin-processed.glb'
  ) as unknown as GLTFResult;

  const createCoinInstances = useMemo(() => {
    const coinsPositions = [
      { x: 5, y: 1, z: 10, number: 10 },
      { x: 10, y: 1, z: 8, number: 4 },
      { x: 2, y: 1, z: 5, number: 7 },
      { x: -3, y: 1, z: 3, number: 6 },
      { x: 0, y: 1, z: 10, number: 11 },
    ];
    const totalCoins = coinsPositions.reduce(
      (sum, coin) => sum + coin.number,
      0
    );
    const coinGeometry = centerGeometry(nodes.coin_01.geometry.clone());
    const material = materials['Plastic (5)'];
    material.roughness = 0.8;
    material.metalness = 0.5;
    material.color = new Color('#8b783d');
    material.emissiveIntensity = 0.7;

    return { coinsPositions, totalCoins, coinGeometry, material };
  }, []);

  const { coinsPositions, totalCoins, coinGeometry, material } =
    createCoinInstances;

  const deltaY = 1.2;

  return (
    <Instances
      range={totalCoins}
      castShadow
      receiveShadow
      geometry={coinGeometry}
      material={material}
    >
      {coinsPositions.map((stack) =>
        Array.from({ length: stack.number }, (_, i) => (
          <Coin
            playAnimation={playAnimation}
            position={[stack.x, i !== 0 ? deltaY * i : 1, stack.z]}
            key={i}
          />
        ))
      )}
    </Instances>
  );
}

function Coin({ position = [0, 0, 0], playAnimation = false }: CoinProps) {
  const [ref, api] = useCylinder<InstancedMesh>(() => ({
    mass: 1,
    args: [1.9, 1.9, 0.7, 8],
    position: [position[0], position[1], position[2]],
    rotation: [0, 0, 0],
    allowSleep: true,
    sleepSpeedLimit: 1,
  }));
  useEffect(() => {
    api.sleep();
  }, []);
  useEffect(() => {
    if (playAnimation) {
      api.wakeUp();
    }
  }, [playAnimation]);

  return <Instance scale={2} ref={ref} />;
}

type GLTFResultSmartphone = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
    Phone_1: THREE.Mesh;
    Phone_2: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    ['Plastic (2)']: THREE.MeshStandardMaterial;
    Metal: THREE.MeshStandardMaterial;
  };
};

function Model() {
  const { nodes, materials } = useGLTF(
    '/models/smartphone-processed.glb'
  ) as unknown as GLTFResultSmartphone;
  const modelRef = useRef<THREE.Group>(null!);

  const [planeRef] = usePlane<Mesh>(() => ({
    mass: 0,
    position: [0, 0.5, 0],
    rotation: [-Math.PI / 2, 0, Math.PI / 6],

    args: [0.1, 0.1],
  }));

  const phoneMaterial = useMemo(() => {
    const phoneMaterial = materials['Plastic (2)'];
    phoneMaterial.color = new Color('#3f3f40');
    phoneMaterial.emissive = new Color('#000000');
    phoneMaterial.emissiveIntensity = 0.5;
    return phoneMaterial;
  }, []);

  return (
    <group ref={modelRef}>
      <group rotation={[Math.PI / 2, 0, -Math.PI / 6]}>
        <mesh
          receiveShadow
          geometry={nodes.Phone_1.geometry}
          material={phoneMaterial}
        />
        <mesh
          receiveShadow
          geometry={nodes.Phone_2.geometry}
          material={materials.Metal}
        />
      </group>
      <group>
        <mesh ref={planeRef}></mesh>
      </group>
    </group>
  );
}

useGLTF.preload('/models/smartphone-processed.glb');
useGLTF.preload('/models/coin-processed.glb');
