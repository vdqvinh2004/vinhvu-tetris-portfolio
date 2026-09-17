import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { pieceKinds } from "../../game/pieces";
import { scheduleIdle, cancelIdle, yieldToMain } from "../../game/scene-boot";

const GRAYS = [0x111111, 0x333333, 0x555555, 0x777777, 0x999999, 0x222222, 0x666666];

/**
 * Ambient monochrome backdrop for /portfolio: wireframe tetrominoes drifting
 * behind the reading content, gently steered by page scroll. Decorative only —
 * the ghost-board demo next to it remains the interactive showcase.
 */
export function PortfolioScene() {
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

      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reducedMotion = media.matches;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }

      // Phase 1: renderer, camera, canvas mount, resize wiring.
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 13);
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

      // Phase 2: twelve wireframe tetrominoes spread edge-to-edge and
      // top-to-bottom so the whole page carries ambient motion.
      const drift = new THREE.Group();
      const members = Array.from({ length: 12 }, (_, index) => {
        const kind = pieceKinds[index % pieceKinds.length];
        const cluster = createTetrominoCluster(
          kind,
          new THREE.MeshBasicMaterial({
            color: GRAYS[index % GRAYS.length],
            wireframe: true,
            transparent: true,
            opacity: index % 2 === 0 ? 0.16 : 0.1,
          }),
          1.1,
        );
        const member = {
          cluster,
          baseX: -8 + index * (16 / 11),
          baseY: 6.5 - (index % 6) * 2.4,
          baseZ: -2 - (index % 4) * 1.8,
          spinX: 0.0012 + (index % 4) * 0.0006,
          spinY: 0.0018 + (index % 3) * 0.0007,
          bobSpeed: 0.35 + (index % 5) * 0.09,
          bobPhase: index * 1.7,
        };
        cluster.position.set(member.baseX, member.baseY, member.baseZ);
        cluster.scale.setScalar(0.9 + (index % 3) * 0.22);
        rotationSeed(cluster, index);
        drift.add(cluster);
        return member;
      });
      scene.add(drift);

      if (cancelled) {
        disposeAll();
        return;
      }
      await yieldToMain();

      // Phase 3: dust, scroll wiring, first paint, render loop.
      const dustCount = 170;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let index = 0; index < dustCount; index += 1) {
        dustPositions[index * 3] = (Math.random() - 0.5) * 26;
        dustPositions[index * 3 + 1] = (Math.random() - 0.5) * 16;
        dustPositions[index * 3 + 2] = -2 - Math.random() * 8;
      }
      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dust = new THREE.Points(
        dustGeometry,
        new THREE.PointsMaterial({
          color: 0x090909,
          size: 0.05,
          transparent: true,
          opacity: 0.22,
        }),
      );
      scene.add(dust);

      let scrollTarget = 0;
      let scrollCurrent = 0;
      const onScroll = () => {
        scrollTarget = window.scrollY * 0.00045;
      };
      if (!reducedMotion) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      }

      let frameId = 0;
      const render = (time: number) => {
        const t = time * 0.0004;
        scrollCurrent += (scrollTarget - scrollCurrent) * 0.05;
        drift.rotation.y = scrollCurrent;
        drift.position.y = Math.sin(t * 0.8) * 0.25;
        for (const member of members) {
          member.cluster.rotation.x += member.spinX;
          member.cluster.rotation.y += member.spinY;
          member.cluster.position.y =
            member.baseY + Math.sin(t * 2 * member.bobSpeed + member.bobPhase) * 0.45;
        }
        dust.rotation.y = t * 0.03;
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      renderer.render(scene, camera);
      if (!reducedMotion) frameId = window.requestAnimationFrame(render);

      teardown = () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("scroll", onScroll);
        disposeAll();
      };
    };

    const idleId = scheduleIdle(() => void startScene());

    return () => {
      cancelled = true;
      cancelIdle(idleId);
      teardown?.();
    };
  }, []);

  return <div aria-hidden="true" className="portfolio-scene" ref={mountRef} />;
}

function rotationSeed(cluster: THREE.Group, index: number): void {
  cluster.rotation.set(index * 0.7, index * 1.1, index * 0.4);
}
