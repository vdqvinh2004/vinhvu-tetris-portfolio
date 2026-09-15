/**
 * Curated re-export of the Three.js APIs this app actually uses.
 *
 * `import("three")` is a dynamic import of the full namespace, which defeats
 * tree-shaking and ships ~740 kB of Three.js. Re-exporting only the used
 * constructors keeps the lazy chunk to roughly the code a scene touches, and
 * the awaited namespace keeps the same shape (`THREE.Scene`, `THREE.Mesh`, ...)
 * so scene code is unchanged.
 */
export {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
