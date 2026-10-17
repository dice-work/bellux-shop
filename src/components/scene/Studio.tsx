"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { products } from "@/lib/products";
import { useShop } from "@/lib/store";
import { FRONT_Z, rackX } from "./layout";
import { studioTexture } from "./textures";

// ยีนส์ส่วนใหญ่สีเข้ม พอหยิบมาดูใกล้ๆ บนฉากมืดจะมองไม่เห็นรายละเอียด
// จึงค่อยๆ เปิดฉากหลังสีเทาอ่อนกับไฟด้านหน้าเหมือนสตูดิโอถ่ายสินค้า เฉพาะตอนเลือกสินค้า
export function Studio() {
  const selectedId = useShop((state) => state.selectedId);
  const index = products.findIndex((product) => product.id === selectedId);
  const backdrop = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const top = useRef<THREE.SpotLight>(null);
  const map = useMemo(() => studioTexture(), []);

  useFrame((_, delta) => {
    const on = index >= 0 ? 1 : 0;
    if (material.current && backdrop.current) {
      material.current.opacity = THREE.MathUtils.damp(material.current.opacity, on, 4, delta);
      backdrop.current.visible = material.current.opacity > 0.01;
      if (index >= 0) backdrop.current.position.x = THREE.MathUtils.damp(backdrop.current.position.x, rackX(index), 5, delta);
    }
    if (fill.current) fill.current.intensity = THREE.MathUtils.damp(fill.current.intensity, on * 1.6, 4, delta);
    if (top.current) {
      top.current.intensity = THREE.MathUtils.damp(top.current.intensity, on * 40, 4, delta);
      if (index >= 0) {
        top.current.position.x = rackX(index);
        top.current.target.position.set(rackX(index), 0.8, FRONT_Z);
        // target ไม่ได้อยู่ในฉาก จึงต้องอัปเดต matrix เอง
        top.current.target.updateMatrixWorld();
      }
    }
  });

  return (
    <>
      {/* อยู่ระหว่างราวแขวน (z = 0) กับตัวที่หยิบออกมา (FRONT_Z) จึงบังราวและตัวอื่นไว้ด้านหลัง */}
      <mesh ref={backdrop} position={[0, 1.4, 0.55]} visible={false}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial ref={material} map={map} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* ไฟส่องด้านหน้า ให้เห็นลายผ้า ตะเข็บ และหมุดชัดขึ้น */}
      <directionalLight ref={fill} position={[0, 1.2, 6]} intensity={0} />
      <spotLight ref={top} position={[0, 4, FRONT_Z + 2]} angle={0.5} penumbra={0.8} intensity={0} decay={1.5} />
    </>
  );
}
