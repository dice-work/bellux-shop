"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { products } from "@/lib/products";
import { useShop } from "@/lib/store";
import { Boutique } from "./Boutique";
import { RackItem } from "./RackItem";
import { FRONT_Z, rackX } from "./layout";

// มุมกล้อง 2 แบบ: มองทั้งร้าน และซูมเข้าหาตัวที่เลือก โดยเว้นที่ให้แผงรายละเอียดสินค้า
function CameraRig() {
  const selectedId = useShop((state) => state.selectedId);
  const look = useRef(new THREE.Vector3(0, 1.15, 0));
  const goal = useRef(new THREE.Vector3());
  const lookGoal = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const portrait = aspect < 1;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const index = products.findIndex((product) => product.id === selectedId);

    if (index >= 0) {
      const x = rackX(index);
      if (portrait) {
        const distance = 6.8;
        const y = 0.88 - distance * tan * 0.44;
        lookGoal.current.set(x, y, FRONT_Z);
        goal.current.set(x, y + 0.1, FRONT_Z + distance);
      } else {
        const distance = 3.9;
        const shift = distance * tan * aspect * 0.36;
        lookGoal.current.set(x + shift, 0.88, FRONT_Z);
        goal.current.set(x + shift, 0.98, FRONT_Z + distance);
      }
    } else {
      const halfWidth = portrait ? 2.15 : 3.3;
      const distance = Math.max(7.8, halfWidth / (tan * aspect));
      // จอแนวนอน: เลื่อนฉากลงเล็กน้อย เว้นที่ด้านบนให้หัวข้อ
      const y = portrait ? 1.15 : 1.75;
      lookGoal.current.set(0, y, 0);
      goal.current.set(state.pointer.x * 0.6, y + 0.4 + state.pointer.y * 0.2, distance);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.current.x, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.current.y, 3.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.current.z, 3.2, delta);
    look.current.x = THREE.MathUtils.damp(look.current.x, lookGoal.current.x, 3.2, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, lookGoal.current.y, 3.2, delta);
    look.current.z = THREE.MathUtils.damp(look.current.z, lookGoal.current.z, 3.2, delta);
    camera.lookAt(look.current);
  });

  return null;
}

// แจ้งหน้าเว็บเมื่อวาดเฟรมแรกเสร็จ เพื่อซ่อนข้อความกำลังโหลด
function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 2) onReady();
  });
  return null;
}

export default function Scene({ onReady }: { onReady: () => void }) {
  const select = useShop((state) => state.select);
  const browsing = useShop((state) => state.selectedId === null);
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ fov: 32, position: [0, 1.8, 11], near: 0.1, far: 60 }}
      // ตอนดูทั้งร้านให้ปัดเลื่อนหน้าได้ ตอนหมุนสินค้าให้ลากได้อย่างเดียว
      style={{ touchAction: browsing ? "pan-y" : "none" }}
      onPointerMissed={() => select(null)}
    >
      <hemisphereLight args={["#ffffff", "#0a0a0c", 0.35]} />
      <directionalLight
        castShadow
        position={[2.5, 6, 5]}
        intensity={1.6}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 20]} />
      </directionalLight>
      {/* ไฟส่องจากด้านหลัง ให้ขอบกางเกงสว่างตัดกับพื้นมืด */}
      <directionalLight position={[0, 3, -5]} intensity={1.4} />
      <Environment resolution={256} environmentIntensity={0.45}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 1.5, 0]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[5, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={2} position={[0, 1.5, 6]} scale={4} />
        {/* แผงไฟใหญ่ด้านหน้า ให้ผิวโครเมียมที่หันหาผู้ชมสะท้อนเป็นสีเงิน */}
        <Lightformer form="rect" intensity={0.8} position={[0, 3, 8]} scale={[12, 3, 1]} />
      </Environment>
      <CameraRig />
      <Ready onReady={onReady} />
      <Boutique />
      {products.map((product, index) => (
        <RackItem key={product.id} product={product} index={index} />
      ))}
    </Canvas>
  );
}
