import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Sparkles, Globe as GlobeIcon } from 'lucide-react';

export const InteractiveGlobe = ({ className = '', size = 320 }) => {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, globeGroup, animationFrameId;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.0015, y: 0.002 };

    try {
      // 1. Scene & Camera setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.z = 240;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // 2. Globe Group
      globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // Inner Core Sphere
      const sphereGeometry = new THREE.SphereGeometry(70, 36, 36);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x0f172a, // Dark Navy
        emissive: 0x0284c7, // Sky Blue subtle glow
        emissiveIntensity: 0.15,
        shininess: 30,
        transparent: true,
        opacity: 0.9,
      });
      const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      globeGroup.add(coreSphere);

      // Outer Wireframe / Lat-Long Grid
      const wireframeGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(71, 20, 16));
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
      });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      globeGroup.add(wireframe);

      // Coordinate helper to convert Lat/Lng to Vector3 on sphere
      const latLngToVector3 = (lat, lng, radius = 72) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -(radius * Math.sin(phi) * Math.cos(theta)),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      };

      // Destination Pins
      const destinations = [
        { name: 'Goa', lat: 15.2993, lng: 74.124 },
        { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
        { name: 'Paris', lat: 48.8566, lng: 2.3522 },
        { name: 'New York', lat: 40.7128, lng: -74.006 },
        { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
        { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
      ];

      destinations.forEach((dest) => {
        const pinPos = latLngToVector3(dest.lat, dest.lng, 71.5);
        
        // Pin marker
        const pinGeo = new THREE.SphereGeometry(1.8, 12, 12);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(pinPos);
        globeGroup.add(pinMesh);

        // Pin Glow Aura
        const auraGeo = new THREE.SphereGeometry(3.2, 12, 12);
        const auraMat = new THREE.MeshBasicMaterial({
          color: 0x0284c7,
          transparent: true,
          opacity: 0.45,
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.position.copy(pinPos);
        globeGroup.add(auraMesh);
      });

      // Ambient & Directional Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x7dd3fc, 1.8);
      dirLight.position.set(100, 100, 150);
      scene.add(dirLight);

      // Atmospheric Ring
      const ringGeo = new THREE.RingGeometry(78, 81, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      scene.add(ringMesh);

      // Mouse drag interaction
      const handleMouseDown = (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // Touch support
      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      };

      const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };

      const handleTouchEnd = () => {
        isDragging = false;
      };

      container.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isDragging) {
          globeGroup.rotation.y += rotationVelocity.y;
        }

        ringMesh.rotation.z += 0.001;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);

        if (renderer && renderer.domElement) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn('WebGL initialization failed, rendering SVG fallback:', err);
      setHasWebGL(false);
    }
  }, [size]);

  if (!hasWebGL) {
    return (
      <div className={`flex items-center justify-center p-6 bg-slate-900/40 rounded-full border border-sky-500/20 shadow-glow ${className}`}>
        <GlobeIcon className="w-24 h-24 text-sky-400 animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}>
      <div ref={mountRef} className="relative z-10" />
      <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default InteractiveGlobe;
