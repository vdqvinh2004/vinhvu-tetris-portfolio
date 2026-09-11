import * as THREE from "three";
import { baseCells } from "./pieces";
import type { PieceKind } from "./pieces";

/** Build a 3D tetromino cluster (one unit box per cell), centered on its centroid. */
export function createTetrominoCluster(
  kind: PieceKind,
  material: THREE.Material,
  unit = 0.9,
): THREE.Group {
  const group = new THREE.Group();
  const cells = baseCells(kind);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of cells) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const geometry = new THREE.BoxGeometry(unit, unit, unit);
  for (const [x, y] of cells) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - centerX, centerY - y, 0);
    group.add(mesh);
  }
  return group;
}

/** Dispose every geometry/material reachable from an object — safe for shared assets. */
export function disposeScene(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      if (mesh.geometry) geometries.add(mesh.geometry);
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) {
        for (const entry of material) materials.add(entry);
      } else if (material) {
        materials.add(material);
      }
    }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
}
