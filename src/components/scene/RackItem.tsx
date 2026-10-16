"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { displayName, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/shop";
import { useShop } from "@/lib/store";
import { Jeans, jeansHeight } from "./Jeans";
import { FRONT_Z, WAIST_Y, rackX } from "./layout";

const TAU = Math.PI * 2;

export function RackItem({ product, index }: { product: Product; index: number }) {
  const group = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const dragging = useRef(false);
  const [hovered, setHovered] = useState(false);
  const selected = useShop((state) => state.selectedId === product.id);
  const anySelected = useShop((state) => state.selectedId !== null);
  const select = useShop((state) => state.select);
  const canvas = useThree((state) => state.gl.domElement);
  const x = rackX(index);
  const height = jeansHeight(product.fit);

  // ลากที่ไหนก็ได้บนฉากเพื่อหมุนตัวที่เลือกอยู่
  useEffect(() => {
    if (!selected) return;
    let lastX = 0;
    const down = (event: PointerEvent) => {
      dragging.current = true;
      lastX = event.clientX;
    };
    const move = (event: PointerEvent) => {
      if (!dragging.current) return;
      angle.current += (event.clientX - lastX) * 0.012;
      lastX = event.clientX;
    };
    const up = () => {
      dragging.current = false;
    };
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      dragging.current = false;
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [selected, canvas]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const lift = hovered && !selected ? 0.04 : 0;
    node.position.x = THREE.MathUtils.damp(node.position.x, x, 6, delta);
    node.position.y = THREE.MathUtils.damp(node.position.y, WAIST_Y + lift + (selected ? 0.08 : 0), 6, delta);
    node.position.z = THREE.MathUtils.damp(node.position.z, selected ? FRONT_Z : 0, 5, delta);

    if (selected) {
      if (!dragging.current) angle.current += delta * 0.35;
    } else {
      angle.current = THREE.MathUtils.damp(angle.current, Math.round(angle.current / TAU) * TAU, 6, delta);
    }
    node.rotation.y = angle.current;
    node.rotation.z = selected ? 0 : Math.sin(state.clock.elapsedTime * 1.1 + index * 1.7) * 0.012;
  });

  return (
    <group
      ref={group}
      position={[x, WAIST_Y, 0]}
      onClick={(event) => {
        event.stopPropagation();
        // ลากหมุนแล้วปล่อยบนตัวข้างๆ ไม่นับเป็นการเลือก
        if (event.delta > 6) return;
        select(product.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Jeans product={product} />
      {/* พื้นที่กดที่ใหญ่กว่าตัวกางเกง ให้แตะง่ายบนมือถือ */}
      <mesh position-y={-height / 2 + 0.08}>
        <boxGeometry args={[0.56, height + 0.2, 0.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {hovered && !anySelected && (
        <Html center position={[0, -height - 0.16, 0]} className="pointer-events-none">
          <div className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs text-fg backdrop-blur">
            {displayName(product)} · {formatPrice(product.price)}
          </div>
        </Html>
      )}
    </group>
  );
}
