/**
 * NeuralLattice.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed fullscreen Three.js background.
 *
 * Interactions:
 *   • Mouse move   → smooth camera parallax (the scene drifts toward the cursor)
 *   • Scroll       → scene tilts and shifts on Y-axis for a parallax depth feel
 *   • Organic idle → each cylinder breathes with independent sine-wave offsets
 *                    PLUS a slow turbulence drift so no two frames look the same
 */

import React, { useEffect, useRef } from "react";

const NeuralLattice = () => {
  const containerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/BokehShader.js",
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/BokehPass.js",
    ];

    const loadedScripts = [];
    const loadSequentially = (i) => {
      if (i >= scripts.length) {
        if (mountedRef.current) init();
        return;
      }
      if (document.querySelector(`script[src="${scripts[i]}"]`)) {
        loadSequentially(i + 1);
        return;
      }
      const s = document.createElement("script");
      s.src = scripts[i];
      s.async = false;
      s.onload = () => loadSequentially(i + 1);
      document.head.appendChild(s);
      loadedScripts.push(s);
    };

    // ── Interaction state ──────────────────────────────────────────────────
    // Mouse: normalised -1 → +1
    const mouse = { x: 0, y: 0 }; // target
    const smoothM = { x: 0, y: 0 }; // lerped
    // Scroll
    let scrollY = 0;
    let smoothScroll = 0;

    let scene, camera, renderer, composer, bloomPass, bokehPass;
    let cylinderGroup, animId;
    const elements = [];

    function init() {
      if (!mountedRef.current) return;
      const THREE = window.THREE;
      const el = containerRef.current;
      if (!el) return;

      // ── Scene ──────────────────────────────────────────────────────────
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      camera = new THREE.PerspectiveCamera(
        75,
        el.clientWidth / el.clientHeight,
        0.01,
        100,
      );
      camera.position.set(0, 0, 0.1);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.toneMapping = THREE.LinearToneMapping;
      el.appendChild(renderer.domElement);

      // ── L-System ────────────────────────────────────────────────────────
      const mat = new THREE.MeshStandardMaterial({
        color: 0x010101,
        roughness: 0.03,
        metalness: 1.0,
      });
      cylinderGroup = new THREE.Group();

      const layers = [
        {
          seeds: 150,
          radius: [0.5, 1.2],
          length: 0.3,
          iterations: 4,
          thickness: 0.02,
        },
        {
          seeds: 200,
          radius: [1.2, 2.5],
          length: 0.5,
          iterations: 6,
          thickness: 0.015,
        },
        {
          seeds: 250,
          radius: [2.5, 4.5],
          length: 0.7,
          iterations: 8,
          thickness: 0.008,
        },
      ];

      layers.forEach((layer) => {
        for (let i = 0; i < layer.seeds; i++) {
          const sr =
            layer.radius[0] +
            Math.random() * (layer.radius[1] - layer.radius[0]);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          let pos = new THREE.Vector3(
            sr * Math.sin(phi) * Math.cos(theta),
            sr * Math.sin(phi) * Math.sin(theta),
            sr * Math.cos(phi),
          );

          for (let j = 0; j < layer.iterations; j++) {
            const dir = new THREE.Vector3(
              Math.random() - 0.5,
              Math.random() - 0.5,
              Math.random() - 0.5,
            ).normalize();
            const radial = pos.clone().normalize();
            dir.projectOnPlane(radial).normalize();
            dir.addScaledVector(radial, 0.3).normalize();

            const len = layer.length * (0.8 + Math.random() * 0.4);
            const next = pos.clone().addScaledVector(dir, len);
            const tk = layer.thickness * (1 - j * 0.2);

            const mesh = new THREE.Mesh(
              new THREE.CylinderGeometry(tk, tk, len, 6),
              mat,
            );
            const mid = new THREE.Vector3()
              .addVectors(pos, next)
              .multiplyScalar(0.5);
            mesh.position.copy(mid);
            mesh.lookAt(next);
            mesh.rotateX(Math.PI / 2);

            // Each cylinder gets 2 sine waves for complex organic breathing
            elements.push({
              mesh,
              initialPos: mesh.position.clone(),
              // primary breath
              phase1: Math.random() * Math.PI * 2,
              speed1: 0.3 + Math.random() * 0.5,
              amp1: 0.018 + Math.random() * 0.025,
              // secondary turbulence (slower, smaller)
              phase2: Math.random() * Math.PI * 2,
              speed2: 0.08 + Math.random() * 0.12,
              amp2: 0.008 + Math.random() * 0.012,
              // slow drift direction (random unit vector)
              driftDir: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5,
              ).normalize(),
              driftPhase: Math.random() * Math.PI * 2,
              driftSpeed: 0.05 + Math.random() * 0.08,
              driftAmp: 0.005 + Math.random() * 0.01,
            });

            cylinderGroup.add(mesh);
            pos.copy(next);
          }
        }
      });
      scene.add(cylinderGroup);

      // ── Lights ──────────────────────────────────────────────────────────
      const spotlight = new THREE.SpotLight(
        0xffffff,
        80,
        50,
        Math.PI / 3,
        0.4,
        1,
      );
      spotlight.position.set(0, 3, 5);
      spotlight.target.position.set(0, 0, 0);
      scene.add(spotlight);
      scene.add(spotlight.target);

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      orb.position.copy(spotlight.position);
      scene.add(orb);
      scene.add(new THREE.AmbientLight(0xffffff, 0.23));

      // ── Post-processing ─────────────────────────────────────────────────
      composer = new THREE.EffectComposer(renderer);
      composer.addPass(new THREE.RenderPass(scene, camera));

      bokehPass = new THREE.BokehPass(scene, camera, {
        focus: 2.0,
        aperture: 0.25,
        maxblur: 0.2,
        width: el.clientWidth,
        height: el.clientHeight,
      });
      composer.addPass(bokehPass);

      bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(el.clientWidth, el.clientHeight),
        1.5,
        0.4,
        0.1,
      );
      composer.addPass(bloomPass);

      // ── Event listeners ──────────────────────────────────────────────────
      const onMouseMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1; // -1 → +1
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      };

      const onScroll = () => {
        scrollY = window.scrollY;
      };

      const onResize = () => {
        if (!el) return;
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
        composer.setSize(el.clientWidth, el.clientHeight);
        if (bokehPass.uniforms.aspect)
          bokehPass.uniforms.aspect.value = camera.aspect;
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });

      // ── Animation loop ──────────────────────────────────────────────────
      const clock = new THREE.Clock();
      const LERP = (a, b, t) => a + (b - a) * t;

      function animate() {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // 1) Smooth mouse & scroll
        smoothM.x = LERP(smoothM.x, mouse.x, 0.04);
        smoothM.y = LERP(smoothM.y, mouse.y, 0.04);
        smoothScroll = LERP(smoothScroll, scrollY, 0.06);

        // 2) Organic cylinder breathing (2-frequency + drift)
        elements.forEach((c) => {
          const breath =
            Math.sin(t * c.speed1 + c.phase1) * c.amp1 +
            Math.sin(t * c.speed2 + c.phase2) * c.amp2;
          const drift = Math.sin(t * c.driftSpeed + c.driftPhase) * c.driftAmp;
          const radial = c.initialPos.clone().normalize();

          c.mesh.position
            .copy(c.initialPos)
            .addScaledVector(radial, breath)
            .addScaledVector(c.driftDir, drift);
        });

        // 3) Slow base rotation (always on)
        cylinderGroup.rotation.y += 0.00012;
        cylinderGroup.rotation.x += 0.000045;

        // 4) Mouse parallax → tilt the whole group gently
        //    (feels like the lattice is a lens reacting to your gaze)
        cylinderGroup.rotation.y += smoothM.x * 0.0008;
        cylinderGroup.rotation.x += smoothM.y * 0.0005;

        // 5) Scroll parallax → push group back and tilt on X
        const scrollFactor = smoothScroll * 0.0006;
        cylinderGroup.position.z = -scrollFactor * 1.2;
        cylinderGroup.rotation.x += scrollFactor * 0.0004;

        // 6) Camera subtle drift driven by mouse (parallax layer 2)
        camera.position.x = LERP(camera.position.x, smoothM.x * 0.15, 0.04);
        camera.position.y = LERP(camera.position.y, -smoothM.y * 0.1, 0.04);
        camera.lookAt(0, 0, 0);

        composer.render();
      }
      animate();

      containerRef._cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (el.contains(renderer.domElement))
          el.removeChild(renderer.domElement);
      };
    }

    loadSequentially(0);

    return () => {
      mountedRef.current = false;
      if (containerRef._cleanup) containerRef._cleanup();
      loadedScripts.forEach((s) => s.parentNode?.removeChild(s));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        background: "#000",
        pointerEvents: "none" /* pass all events through to page */,
      }}
    />
  );
};

export default NeuralLattice;
