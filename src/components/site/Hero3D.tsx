import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function LabRoom() {
  const group = useRef<THREE.Group>(null);
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const { mouse } = useThree();
  const reduceMotion = useReducedMotion();
  const lowPower = useLowPowerDevice();

  useFrame((state, delta) => {
    if (group.current) {
      const motionScale = reduceMotion || lowPower ? 0.25 : 1;
      group.current.rotation.y += delta * 0.08 * motionScale;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.12 * motionScale, 0.04);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, mouse.x * 0.06 * motionScale, 0.04);
    }

    if (camera.current) {
      const motionScale = reduceMotion || lowPower ? 0.2 : 1;
      camera.current.position.x = THREE.MathUtils.lerp(camera.current.position.x, mouse.x * 0.45 * motionScale, 0.04);
      camera.current.position.y = THREE.MathUtils.lerp(camera.current.position.y, 0.25 + mouse.y * 0.25 * motionScale, 0.04);
      camera.current.lookAt(0, 0, 0);
    }
  });

  const columns = useMemo(
    () => [
      [-3.2, -1.2, -3.4],
      [3.2, -1.2, -3.4],
      [-3.2, -1.2, 3.4],
      [3.2, -1.2, 3.4],
    ] as const,
    [],
  );

  const curvePoints = useMemo(
    () =>
      Array.from({ length: 61 }, (_, index) => {
        const x = -4 + index * (8 / 60);
        const normalized = (x + 4) / 8;
        const y = Math.sin(Math.PI * normalized) + 0.1102;
        return new THREE.Vector3(x, y, 0.12);
      }),
    [],
  );

  const derivativePoints = useMemo(
    () =>
      Array.from({ length: 61 }, (_, index) => {
        const x = -4 + index * (8 / 60);
        const normalized = (x + 4) / 8;
        const y = Math.cos(Math.PI * normalized) * 0.9 - 1.0;
        return new THREE.Vector3(x, y, 0.2);
      }),
    [],
  );

  return (
    <>
      <fog attach="fog" args={["#f8fafc", 6, 14]} />
      <perspectiveCamera ref={camera} makeDefault position={[0, 0.25, 7]} fov={42} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 6, 6]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#e11d48" />
      <pointLight position={[0, 1, 4]} intensity={1.4} color="#0f172a" />
      <spotLight position={[0, 6, 4]} angle={0.55} penumbra={1} intensity={2.5} color="#f8fafc" castShadow />

      <group ref={group}>
        <mesh position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#dbe4f0" roughness={0.92} metalness={0.05} />
        </mesh>
        <mesh position={[0, 2.3, -4.9]}>
          <planeGeometry args={[14, 8]} />
          <meshStandardMaterial color="#eff6ff" roughness={0.8} metalness={0.02} transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, 0.4, -6]}>
          <planeGeometry args={[14, 7]} />
          <meshStandardMaterial color="#eef2ff" roughness={0.95} metalness={0.02} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, 0.02, 0.15]}>
          <planeGeometry args={[8.8, 3.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0} transparent opacity={0.9} />
        </mesh>
        <gridHelper args={[8.8, 18, "#cbd5e1", "#e2e8f0"]} position={[0, 0.03, 0.22]} />
        <mesh position={[0, -1.35, 0.28]}>
          <boxGeometry args={[8.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[-3.95, 0.55, 0.28]}>
          <boxGeometry args={[0.02, 3.0, 0.02]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {columns.map((position, index) => (
          <mesh key={index} position={position}>
            <cylinderGeometry args={[0.18, 0.25, 4.8, 32]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#cbd5e1" : "#e2e8f0"} roughness={0.7} metalness={0.05} />
          </mesh>
        ))}

        <Float speed={reduceMotion || lowPower ? 0.35 : 1.1} rotationIntensity={reduceMotion || lowPower ? 0.18 : 0.6} floatIntensity={reduceMotion || lowPower ? 0.25 : 0.9}>
          <group position={[-0.2, 0.05, 0.45]}>
            <Line points={curvePoints} color="#e11d48" lineWidth={3} />
            {[-3, -1.5, 0, 1.5, 3].map((x) => {
              const normalized = (x + 4) / 8;
              const y = Math.sin(Math.PI * normalized) + 0.1102;
              return (
                <mesh key={x} position={[x, y / 2 - 1.35, 0.02]}>
                  <boxGeometry args={[0.35, Math.max(0.2, y + 1.35), 0.28]} />
                  <meshStandardMaterial color="#fecdd3" emissive="#fb7185" emissiveIntensity={0.08} transparent opacity={0.9} />
                </mesh>
              );
            })}
            <mesh position={[-3.35, 1.15, 0.26]}>
              <boxGeometry args={[1.9, 0.45, 0.05]} />
              <meshStandardMaterial color="#fff1f2" />
            </mesh>
            <mesh position={[-3.35, 1.15, 0.31]}>
              <boxGeometry args={[1.88, 0.43, 0.02]} />
              <meshStandardMaterial color="#e11d48" transparent opacity={0.95} />
            </mesh>
          </group>
        </Float>

        <Float speed={reduceMotion || lowPower ? 0.22 : 0.7} rotationIntensity={reduceMotion || lowPower ? 0.08 : 0.3} floatIntensity={reduceMotion || lowPower ? 0.18 : 0.55}>
          <group position={[0.15, -1.15, 0.78]}>
            <Line points={derivativePoints} color="#0f172a" lineWidth={2} />
          </group>
        </Float>

        {!reduceMotion && (
          <Sparkles count={lowPower ? 20 : 80} scale={10} size={lowPower ? 1.2 : 1.8} speed={0.35} color="#e11d48" />
        )}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.55}
      />
    </>
  );
}

export function Hero3D() {
  const reduceMotion = useReducedMotion();
  const lowPower = useLowPowerDevice();
  const dpr = lowPower ? [1, 1.1] : [1, 1.75];
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(225,29,72,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.12),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(241,245,249,0.96))] shadow-[var(--shadow-elegant)] sm:h-[380px] lg:h-[420px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_36%,rgba(15,23,42,0.12)_100%)]" />
      <Canvas
        dpr={dpr}
        gl={{ antialias: !lowPower, powerPreference: lowPower ? "low-power" : "high-performance" }}
        camera={{ position: [0, 0.25, 7], fov: 42 }}
      >
        <LabRoom />
      </Canvas>
      {reduceMotion && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Reduced motion mode
        </div>
      )}
    </div>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useLowPowerDevice() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    setLowPower(memory <= 4 || cores <= 4 || smallScreen);
  }, []);

  return lowPower;
}
