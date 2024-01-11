import { Text } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, ShaderMaterial } from 'three';

export default function Experiment() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <color attach="background" args={['#17181C']} />
      <TextComponent />
    </Canvas>
  );
}
Experiment.Title = 'Shader: Text Spotlight';

const TextComponent = () => {
  const { raycaster, mouse, camera, scene, viewport } = useThree();
  const shaderMaterial = new ShaderMaterial({
    uniforms: {
      mousePosition: { value: { x: 0, y: 0 } },
      textColor: { value: new Color(0x2b8cff) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec2 mousePosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec2 mousePosition;
      uniform vec3 textColor;
  
      float vDistance(vec2 p1, vec2 p2) {
        vec2 diff = p1 - p2;
        return sqrt(diff.x * diff.x + (diff.y * diff.y) * 0.25);
      }

      void main() {      
        float radius = 0.05;
        float distanceFromMouse = vDistance(vUv, mousePosition);

        if(distanceFromMouse < radius + 0.1){
          float intensity = 1.0 - (distanceFromMouse - radius) * 10.0;
          gl_FragColor = vec4(textColor, intensity);
        }
      }
      `,
  });
  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene, true);
    if (intersects.length > 0) {
      if (intersects[0].object.name === 'shaderTextComponent') {
        shaderMaterial.uniforms.mousePosition.value = intersects[0].uv;
      }
    }
  });

  return (
    <>
      <Text
        anchorX="center"
        anchorY="top"
        position={[0, 2.5, 0]}
        maxWidth={viewport.width}
        name={'shaderTextComponent'}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        material={shaderMaterial}
        fontSize={viewport.width / 25}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text>
    </>
  );
};
