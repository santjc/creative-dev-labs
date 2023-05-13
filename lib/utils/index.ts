import * as THREE from 'three';

export const getAllExperimentSlugs = async () => {
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const experimentsDir = path.resolve(process.cwd(), 'experiments');
    const files = fs.readdirSync(experimentsDir);

    files.sort(function (a, b) {
      return (
        fs.statSync(experimentsDir + '/' + a).birthtime.getTime() -
        fs.statSync(experimentsDir + '/' + b).birthtime.getTime()
      );
    });

    return files;
  }
};

export function centerGeometry(geometry: any) {
  const box = new THREE.Box3().setFromBufferAttribute(
    geometry.getAttribute('position')
  );
  const center = box.getCenter(new THREE.Vector3());

  // Translate the vertices to center the geometry
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);

    position.setXYZ(i, x - center.x, y - center.y, z - center.z);
  }
  position.needsUpdate = true;

  const rotation = new THREE.Euler(Math.PI / 2, 0, 0);
  const matrix = new THREE.Matrix4().makeRotationFromEuler(rotation);
  geometry.applyMatrix4(matrix);

  return geometry;
}
