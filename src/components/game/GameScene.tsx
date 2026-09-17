import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { pieceKinds } from "../../game/pieces";
import type { PieceKind } from "../../game/pieces";
import { scheduleIdle, cancelIdle, yieldToMain } from "../../game/scene-boot";

interface GameSceneProps {
  reducedMotion: boolean;
  rewardsUnlocked: number;
}

const VIVID: Record<PieceKind, number> = {
  I: 0x22d3ee,
  O: 0xfacc15,
  T: 0xc084fc,
  S: 0x4ade80,
  Z: 0xf87171,
  J: 0x60a5fa,
  L: 0xfb923c,
};

const FIELD_COLORS = [0x22d3ee, 0xfacc15, 0xc084fc, 0x4ade80, 0xf87171, 0x60a5fa, 0xfb923c];

export function GameScene({ reducedMotion, rewardsUnlocked }: GameSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || import.meta.env.MODE === "test") return undefined;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    // Three.js loads lazily via the curated barrel (kept tree-shakeable and out
    // of the critical bundle). Construction starts on idle and is split into
    // phases with main-thread yields so no single task blocks input for long.
    const startScene = async () => {
      const [THREE, { createTetrominoCluster, disposeScene }] = await Promise.all([
        import("../../game/three-core"),
        import("../../game/tetrominoes3d"),
      ]);
      if (cancelled || !mountRef.current) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }

      // Phase 1: renderer, camera, canvas mount, resize wiring.
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 11);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      const resize = () => {
        const width = Math.max(mount.clientWidth, 1);
        const height = Math.max(mount.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      const observer =
        typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(resize);
      observer?.observe(mount);

      let disposed = false;
      const disposeAll = () => {
        if (disposed) return;
        disposed = true;
        disposeScene(scene);
        observer?.disconnect();
        renderer.dispose();
        renderer.domElement.remove();
      };

      if (cancelled) {
        disposeAll();
        return;
      }
      await yieldToMain();

      // Phase 2: static drifting field + distant starfield.
      const group = new THREE.Group();
      const geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      const colors = FIELD_COLORS;
      const blocks = Array.from({ length: 34 }, (_, index) => {
        const block = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({
            color: colors[index % colors.length],
            wireframe: index % 3 === 0,
          }),
        );
        block.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 4,
        );
        block.rotation.set(Math.random(), Math.random(), 0);
        group.add(block);
        return block;
      });
      scene.add(group);

      const starCount = 240;
      const starPositions = new Float32Array(starCount * 3);
      for (let index = 0; index < starCount; index += 1) {
        starPositions[index * 3] = (Math.random() - 0.5) * 30;
        starPositions[index * 3 + 1] = (Math.random() - 0.5) * 18;
        starPositions[index * 3 + 2] = -3 - Math.random() * 9;
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.05,
          transparent: true,
          opacity: 0.75,
        }),
      );
      scene.add(stars);

      if (cancelled) {
        disposeAll();
        return;
      }
      await yieldToMain();

      // Phase 3: floating tetromino fleet (geometry-heavy cluster builds).
      const fleet = new THREE.Group();
      const fleetMembers = pieceKinds.map((kind, index) => {
        const cluster = createTetrominoCluster(
          kind,
          new THREE.MeshBasicMaterial({ color: VIVID[kind], wireframe: index % 2 === 1 }),
        );
        const angle = (index / pieceKinds.length) * Math.PI * 2;
        const member = {
          cluster,
          baseX: Math.cos(angle) * 6.4,
          baseY: Math.sin(angle) * 3.4,
          baseZ: -2.5 - (index % 3) * 1.7,
          spinX: 0.0022 + (index % 4) * 0.0009,
          spinY: 0.0031 + (index % 3) * 0.0011,
          bobSpeed: 0.5 + (index % 5) * 0.14,
          bobPhase: index * 1.1,
        };
        cluster.position.set(member.baseX, member.baseY, member.baseZ);
        cluster.scale.setScalar(0.85 + (index % 3) * 0.18);
        fleet.add(cluster);
        return member;
      });
      scene.add(fleet);

      if (cancelled) {
        disposeAll();
        return;
      }
      await yieldToMain();

      // Phase 4: tunnel rings, reward shockwave, particle burst.
      const ringGeometry = new THREE.TorusGeometry(2.6, 0.025, 8, 72);
      const tunnel = new THREE.Group();
      const rings = Array.from({ length: 5 }, (_, index) => {
        const ring = new THREE.Mesh(
          ringGeometry,
          new THREE.MeshBasicMaterial({ color: colors[index], transparent: true, opacity: 0.42 }),
        );
        ring.position.z = -index * 3 - 2;
        ring.rotation.set(index * 0.38, index * 0.24, 0);
        tunnel.add(ring);
        return ring;
      });
      scene.add(tunnel);

      const shockwave = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.05, 8, 72),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }),
      );
      shockwave.position.z = -1;
      scene.add(shockwave);

      const particleGeometry = new THREE.SphereGeometry(0.06, 8, 8);
      const burst = new THREE.Group();
      const particles = Array.from({ length: 100 }, (_, index) => {
        const particle = new THREE.Mesh(
          particleGeometry,
          new THREE.MeshBasicMaterial({ color: colors[index % colors.length] }),
        );
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12,
          -Math.random() * 0.08,
        );
        particle.position.set(0, 0, 0);
        burst.add(particle);
        return particle;
      });
      burst.scale.setScalar(0.001);
      scene.add(burst);

      // Phase 5: interaction wiring, first paint, render loop.
      const pointer = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      };
      if (!reducedMotion) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      }

      let frameId = 0;
      const renderStart = performance.now();
      const render = (time: number) => {
        const elapsed = time - renderStart;
        const t = time * 0.0004;
        group.rotation.z = t * 0.4;
        group.rotation.x = Math.sin(t) * 0.12;
        group.position.y = Math.sin(t * 1.7) * 0.35;
        blocks.forEach((block, index) => {
          block.rotation.x += 0.004 + (index % 4) * 0.001;
          block.rotation.y += 0.005 + (index % 3) * 0.001;
        });
        for (const member of fleetMembers) {
          member.cluster.rotation.x += member.spinX;
          member.cluster.rotation.y += member.spinY;
          member.cluster.position.y =
            member.baseY + Math.sin(t * 2.2 * member.bobSpeed + member.bobPhase) * 0.5;
          member.cluster.position.x =
            member.baseX + Math.cos(t * 1.4 * member.bobSpeed + member.bobPhase) * 0.35;
        }
        stars.rotation.z = t * 0.05;
        rings.forEach((ring, index) => {
          ring.rotation.z += 0.003 + index * 0.001;
          ring.position.z += 0.045 + index * 0.005;
          if (ring.position.z > 4) ring.position.z = -14;
        });

        // Reward celebration: shockwave expansion, particle burst, camera punch.
        const celebration = rewardsUnlocked > 0 ? Math.min(elapsed / 950, 1) : 1;
        const shockMaterial = shockwave.material as THREE.MeshBasicMaterial;
        if (rewardsUnlocked > 0 && celebration < 1) {
          shockwave.scale.setScalar(0.5 + celebration * 9);
          shockMaterial.opacity = 0.85 * (1 - celebration);
        } else {
          shockMaterial.opacity = 0;
        }
        burst.rotation.z -= 0.018;
        burst.scale.setScalar(rewardsUnlocked > 0 ? Math.min(elapsed / 850, 1) : 0.001);
        particles.forEach((particle) => {
          particle.position.add(particle.userData.velocity as THREE.Vector3);
        });
        const punch = rewardsUnlocked > 0 ? Math.max(0, 1 - elapsed / 900) : 0;

        camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.045;
        camera.position.y += (pointer.y * 0.8 - camera.position.y) * 0.045;
        camera.position.z = 11 - punch * 1.3;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      renderer.render(scene, camera);
      if (!reducedMotion) frameId = window.requestAnimationFrame(render);

      teardown = () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("pointermove", onPointerMove);
        disposeAll();
      };
    };

    const idleId = scheduleIdle(() => void startScene());

    return () => {
      cancelled = true;
      cancelIdle(idleId);
      teardown?.();
    };
  }, [reducedMotion, rewardsUnlocked]);

  return <div aria-hidden="true" className="game-scene" ref={mountRef} />;
}
