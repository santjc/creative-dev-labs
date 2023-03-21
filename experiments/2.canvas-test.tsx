import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

export default function Experiment() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <OrbitControls/>
      <Environment preset={'city'} background={true} />
      <mesh position={[0, 0, 0]}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial metalness={1} reflectivity={1} roughness={0} color="red" />
      </mesh>
    </Canvas>
  );
}

Experiment.Title = 'Just a Canvas Test'