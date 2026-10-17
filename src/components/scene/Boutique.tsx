"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { products } from "@/lib/products";
import { useShop } from "@/lib/store";
import { FRONT_Z, RACK_Y, SPACING } from "./layout";
import { beamTexture, floorLinesTexture, glowTexture } from "./textures";

const chrome = { color: "#e4e4e8", roughness: 0.16, metalness: 1, envMapIntensity: 3 };
const matte = { color: "#111113", roughness: 0.6, metalness: 0.2 };

function archShape(width: number, height: number) {
  const r = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-r, 0);
  shape.lineTo(-r, height - r);
  shape.absarc(0, height - r, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.closePath();
  return shape;
}

// ดาว 4 แฉกขอบโค้งเว้า อัดเป็นก้อนนูนแบบโครเมียม
function starGeometry() {
  const shape = new THREE.Shape();
  const tips = [0, 1, 2, 3].map((i) => {
    const angle = Math.PI / 2 + (i * Math.PI) / 2;
    return new THREE.Vector2(Math.cos(angle), Math.sin(angle));
  });
  shape.moveTo(tips[0].x, tips[0].y);
  tips.forEach((tip, i) => {
    const next = tips[(i + 1) % 4];
    const mid = tip.clone().add(next).normalize().multiplyScalar(0.16);
    shape.quadraticCurveTo(mid.x, mid.y, next.x, next.y);
  });
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.08,
    bevelSegments: 8,
    curveSegments: 24,
  });
  geometry.center();
  return geometry;
}

function Stars() {
  const geometry = useMemo(() => starGeometry(), []);
  const stars: [number, number, number, number][] = [
    [2.5, 2.2, -0.5, 0.45],
    [3.05, 1.6, -0.2, 0.22],
    [-2.55, 1.95, -0.6, 0.3],
  ];
  return (
    <>
      {stars.map(([x, y, z, scale], i) => (
        <Float key={i} speed={1.2 + i * 0.3} rotationIntensity={0.6} floatIntensity={0.5}>
          <mesh castShadow geometry={geometry} position={[x, y, z]} scale={scale} rotation={[0.2, -0.4 + i * 0.5, 0]}>
            {/* ผิวหน้าแบนสะท้อนฉากมืดจนดำ จึงผสมสีเงินแบบด้านเข้าไปให้ยังดูเป็นโครเมียม */}
            <meshPhysicalMaterial color="#d4d4d8" metalness={0.65} roughness={0.22} clearcoat={1} envMapIntensity={3} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Rack() {
  const half = ((products.length - 1) / 2) * SPACING + 0.5;
  return (
    <group>
      <mesh castShadow position-y={RACK_Y} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.016, 0.016, half * 2, 24]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      {[-half, half].map((x) => (
        <group key={x} position-x={x}>
          <mesh castShadow position-y={RACK_Y / 2}>
            <cylinderGeometry args={[0.018, 0.018, RACK_Y, 24]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh castShadow position-y={0.015} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.018, 0.018, 0.7, 24]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh position-y={RACK_Y}>
            <sphereGeometry args={[0.03, 24, 24]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Plinth() {
  return (
    <group position={[-2.55, 0, 0.9]} rotation-y={0.5}>
      <RoundedBox castShadow receiveShadow args={[0.55, 0.55, 0.55]} radius={0.03} position-y={0.275}>
        <meshStandardMaterial {...matte} />
      </RoundedBox>
      <mesh castShadow position-y={0.77}>
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
    </group>
  );
}

function Podium() {
  return (
    <group position={[2.45, 0, 1.15]}>
      <mesh castShadow receiveShadow position-y={0.2}>
        <cylinderGeometry args={[0.44, 0.44, 0.4, 64]} />
        <meshStandardMaterial {...matte} />
      </mesh>
      <mesh position-y={0.4} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.44, 0.008, 12, 64]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      {[0, 1, 2].map((i) => products[i % products.length]).map((product, i) => (
        <RoundedBox
          key={i}
          castShadow
          args={[0.44, 0.065, 0.3]}
          radius={0.025}
          position={[0, 0.435 + i * 0.068, 0]}
          rotation-y={0.25 + i * 0.12}
        >
          <meshStandardMaterial color={product.color} roughness={0.92} />
        </RoundedBox>
      ))}
    </group>
  );
}

export function Boutique() {
  // ของตกแต่งที่อยู่หน้าฉากสตูดิโอจะโผล่ข้างตัวที่หยิบมาดู จึงซ่อนไว้ระหว่างดูสินค้า
  const focused = useShop((state) => state.selectedId !== null);
  const arch = useMemo(() => archShape(3.6, 3.3), []);
  const lines = useMemo(() => floorLinesTexture(), []);
  const beam = useMemo(() => beamTexture(), []);
  const glow = useMemo(() => glowTexture(), []);

  return (
    <group>
      <mesh receiveShadow position-y={-0.08}>
        <cylinderGeometry args={[3.7, 3.7, 0.16, 96]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position-y={0.002} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[3.68, 96]} />
        <meshBasicMaterial map={lines} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position-y={0} rotation-x={Math.PI / 2}>
        <torusGeometry args={[3.7, 0.006, 8, 160]} />
        <meshBasicMaterial color="#9a9aa2" />
      </mesh>
      {/* แสงบนพื้นตรงจุดที่หยิบกางเกงออกมาหมุนดู */}
      <mesh position={[0, 0.004, FRONT_Z]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial map={glow} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh receiveShadow position={[0, 0, -1.3]}>
        <extrudeGeometry args={[arch, { depth: 0.12, bevelEnabled: false, curveSegments: 48 }]} />
        <meshStandardMaterial color="#0f0f12" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, -1.16]}>
        <planeGeometry args={[1.5, 3]} />
        <meshBasicMaterial map={beam} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <Rack />
      <Stars />
      <group visible={!focused}>
        <Plinth />
        <Podium />
      </group>
    </group>
  );
}
