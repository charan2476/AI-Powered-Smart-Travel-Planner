import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FloatingTravelAsset = ({ className = '', size = 160 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, airplaneGroup, animationFrameId;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);
      camera.position.set(0, 15, 65);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      airplaneGroup = new THREE.Group();
      scene.add(airplaneGroup);

      // Airplane Fuselage (Sleek aerodynamic cone/cylinder)
      const bodyGeo = new THREE.ConeGeometry(4, 22, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      airplaneGroup.add(body);

      // Cabin Glass (Cockpit)
      const cockpitGeo = new THREE.SphereGeometry(2.2, 12, 12);
      const cockpitMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Sky Blue glass
        emissive: 0x38bdf8,
        emissiveIntensity: 0.4,
        roughness: 0.1,
      });
      const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
      cockpit.position.set(0, 2.2, 3);
      cockpit.scale.set(0.9, 0.7, 2);
      airplaneGroup.add(cockpit);

      // Main Wings
      const wingGeo = new THREE.BoxGeometry(26, 0.6, 6);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Sky blue accent
        metalness: 0.4,
        roughness: 0.3,
      });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.set(0, 0, -1);
      airplaneGroup.add(wings);

      // Tail Wing (Vertical stabilizer)
      const tailGeo = new THREE.BoxGeometry(0.6, 6, 4);
      const tailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      tail.position.set(0, 3, -9);
      tail.rotation.x = -Math.PI / 6;
      airplaneGroup.add(tail);

      // Glowing Orbital Jet Rings
      const ringGeo = new THREE.TorusGeometry(18, 0.4, 8, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
      });
      const jetRing = new THREE.Mesh(ringGeo, ringMat);
      jetRing.rotation.x = Math.PI / 3;
      scene.add(jetRing);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x38bdf8, 2, 80);
      pointLight.position.set(10, 20, 20);
      scene.add(pointLight);

      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth flight banking and floating animation
        airplaneGroup.position.y = Math.sin(elapsedTime * 1.8) * 2.5;
        airplaneGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.15;
        airplaneGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.25;
        airplaneGroup.rotation.x = 0.2 + Math.cos(elapsedTime * 1.2) * 0.08;

        jetRing.rotation.z -= 0.008;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          renderer.dispose();
          container.removeChild(renderer.domElement);
        }
      };
    } catch (e) {
      console.warn('3D travel asset render fallback:', e);
    }
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center pointer-events-none ${className}`}>
      <div ref={mountRef} />
      <div className="absolute inset-0 bg-sky-400/15 rounded-full blur-xl pointer-events-none" />
    </div>
  );
};

export default FloatingTravelAsset;
