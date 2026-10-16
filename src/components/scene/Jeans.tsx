"use client";

import { useGLTF } from "@react-three/drei";
import { Component, Suspense, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import type { Fit, Product } from "@/lib/products";

const WAIST_H = 0.045;
const HIP_H = 0.24;
const TOP_H = WAIST_H + HIP_H;
const FLAT = 0.46;

export const jeansHeight = (fit: Fit) => TOP_H + fit.length - 0.03;

let denimTexture: THREE.CanvasTexture | null = null;

// ลายทอเฉียงของผ้าเดนิม วาดลง canvas ครั้งเดียวแล้วใช้ร่วมกันทุกตัว
function getDenimTexture() {
  if (denimTexture) return denimTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ededed";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 3200; i++) {
    const light = Math.random() > 0.5;
    ctx.fillStyle = `rgba(${light ? "255,255,255" : "0,0,0"},${Math.random() * 0.14})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 2);
  }
  ctx.strokeStyle = "rgba(0,0,0,0.09)";
  ctx.lineWidth = 1;
  for (let i = -size; i < size; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
  denimTexture = new THREE.CanvasTexture(canvas);
  denimTexture.wrapS = denimTexture.wrapT = THREE.RepeatWrapping;
  denimTexture.repeat.set(6, 8);
  denimTexture.colorSpace = THREE.SRGBColorSpace;
  return denimTexture;
}

function legGeometry(fit: Fit) {
  const steps = 14;
  const kneeAt = 0.45;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const radius =
      t < kneeAt
        ? THREE.MathUtils.lerp(fit.hem, fit.knee, THREE.MathUtils.smoothstep(t, 0, kneeAt))
        : THREE.MathUtils.lerp(fit.knee, fit.thigh, THREE.MathUtils.smoothstep(t, kneeAt, 1));
    return new THREE.Vector2(radius, -fit.length + t * fit.length);
  });
  return new THREE.LatheGeometry(points, 28);
}

function ProceduralJeans({ product }: { product: Product }) {
  const { fit, color, stitch } = product;
  const map = useMemo(() => getDenimTexture(), []);
  const leg = useMemo(() => legGeometry(fit), [fit]);
  const lining = useMemo(
    () => new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.45),
    [color],
  );

  const hipR = fit.thigh * 1.94;
  const waistR = hipR * 0.88;
  const legX = fit.thigh;
  const legTop = -TOP_H + 0.03;

  const denim = (
    <meshStandardMaterial color={color} map={map} roughness={0.92} side={THREE.DoubleSide} />
  );
  const thread = <meshStandardMaterial color={stitch} roughness={0.8} />;
  const brass = <meshStandardMaterial color="#b89b6a" roughness={0.35} metalness={0.3} />;

  return (
    <group>
      <mesh castShadow position-y={-WAIST_H / 2} scale={[1, 1, FLAT]}>
        <cylinderGeometry args={[waistR, waistR, WAIST_H, 32]} />
        {denim}
      </mesh>
      <mesh castShadow position-y={-WAIST_H - HIP_H / 2} scale={[1, 1, FLAT]}>
        <cylinderGeometry args={[waistR, hipR, HIP_H, 32]} />
        {denim}
      </mesh>
      {/* ก้นกางเกงโค้งมน เชื่อมสะโพกกับขาไม่ให้เห็นเป็นขั้น */}
      <mesh castShadow position-y={-TOP_H} scale={[1, 0.18, FLAT]}>
        <sphereGeometry args={[hipR, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        {denim}
      </mesh>

      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * legX, legTop, 0]}
          rotation-z={side * 0.025}
          scale={[1, 1, 0.9]}
        >
          <mesh castShadow geometry={leg}>
            {denim}
          </mesh>
          {fit.cuff ? (
            <mesh castShadow position-y={-fit.length + 0.035}>
              <cylinderGeometry args={[fit.hem * 1.07, fit.hem * 1.07, 0.07, 28, 1, true]} />
              <meshStandardMaterial color={lining} map={map} roughness={0.92} side={THREE.DoubleSide} />
            </mesh>
          ) : (
            <mesh position-y={-fit.length + 0.022} rotation-x={Math.PI / 2}>
              <torusGeometry args={[fit.hem * 1.005, 0.003, 6, 32]} />
              {thread}
            </mesh>
          )}
        </group>
      ))}

      {/* ด้านหน้า: กระดุม ซิป หมุด */}
      <mesh position={[0, -WAIST_H / 2, waistR * FLAT]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.013, 0.013, 0.012, 16]} />
        {brass}
      </mesh>
      <mesh position={[0.028, -WAIST_H - 0.075, hipR * FLAT * 0.93]}>
        <boxGeometry args={[0.004, 0.13, 0.02]} />
        {thread}
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * hipR * 0.62, -WAIST_H - 0.05, hipR * FLAT * 0.74]}>
          <sphereGeometry args={[0.006, 10, 10]} />
          {brass}
        </mesh>
      ))}

      {/* ด้านหลัง: กระเป๋าและป้ายหนัง */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * hipR * 0.46, -WAIST_H - 0.125, -hipR * FLAT * 0.81]}
          rotation-y={-side * 0.4}
        >
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.11, 0.008]} />
            {denim}
          </mesh>
          <mesh position={[0, 0.045, -0.005]}>
            <boxGeometry args={[0.092, 0.004, 0.002]} />
            {thread}
          </mesh>
        </group>
      ))}
      <mesh
        position={[Math.sin(Math.PI - 0.5) * waistR, -WAIST_H / 2, Math.cos(Math.PI - 0.5) * waistR * FLAT * 1.03]}
        rotation-y={Math.PI - 0.5}
      >
        <boxGeometry args={[0.05, 0.032, 0.006]} />
        <meshStandardMaterial color="#b98f60" roughness={0.7} />
      </mesh>

      {[0.65, -0.65, Math.PI, Math.PI - 1, Math.PI + 1].map((angle) => (
        <mesh
          key={angle}
          position={[Math.sin(angle) * waistR * 1.01, -WAIST_H / 2, Math.cos(angle) * waistR * FLAT * 1.04]}
          rotation-y={angle}
        >
          <boxGeometry args={[0.014, WAIST_H + 0.012, 0.008]} />
          {denim}
        </mesh>
      ))}
    </group>
  );
}

// โมเดลจริง (.glb): ปรับขนาดให้สูงเท่าตัวชั่วคราว และจัดขอบเอวให้อยู่ที่ y = 0
function GlbJeans({ url, height }: { url: string; height: number }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = height / size.y;
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -box.max.y * scale, -center.z * scale);
    clone.traverse((child) => {
      child.castShadow = true;
    });
    return clone;
  }, [scene, height]);
  return <primitive object={object} />;
}

// ถ้าไฟล์ .glb หายหรือเสีย ให้กลับไปใช้โมเดลชั่วคราว แทนที่ฉากทั้งฉากจะพัง
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Hanger() {
  const brass = <meshStandardMaterial color="#e4e4e8" roughness={0.16} metalness={1} envMapIntensity={3} />;
  return (
    <group>
      <mesh castShadow position-y={0.03}>
        <boxGeometry args={[0.36, 0.016, 0.016]} />
        {brass}
      </mesh>
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} castShadow position={[x, 0.008, 0]}>
          <boxGeometry args={[0.03, 0.05, 0.03]} />
          {brass}
        </mesh>
      ))}
      <mesh position-y={0.068}>
        <cylinderGeometry args={[0.005, 0.005, 0.07, 8]} />
        {brass}
      </mesh>
      <mesh position-y={0.135}>
        <torusGeometry args={[0.034, 0.005, 8, 24, Math.PI * 1.5]} />
        {brass}
      </mesh>
    </group>
  );
}

export function Jeans({ product }: { product: Product }) {
  const fallback = <ProceduralJeans product={product} />;
  return (
    <group>
      <Hanger />
      {product.model ? (
        <ModelBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <GlbJeans url={product.model} height={jeansHeight(product.fit)} />
          </Suspense>
        </ModelBoundary>
      ) : (
        fallback
      )}
    </group>
  );
}
