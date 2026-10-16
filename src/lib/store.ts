"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "./products";

export type CartItem = { productId: string; size: string; qty: number };
// key เปลี่ยนทุกครั้งที่เพิ่มของ ให้ toast เริ่มนับเวลาใหม่แม้เพิ่มไซซ์เดิมซ้ำ
export type CartToast = { key: number; productId: string; size: string };

type ShopState = {
  selectedId: string | null;
  cartOpen: boolean;
  items: CartItem[];
  toast: CartToast | null;
  select: (id: string | null) => void;
  setCartOpen: (open: boolean) => void;
  addItem: (productId: string, size: string) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
  dismissToast: () => void;
};

const same = (item: CartItem, productId: string, size: string) =>
  item.productId === productId && item.size === size;

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      selectedId: null,
      cartOpen: false,
      items: [],
      toast: null,
      select: (selectedId) => set({ selectedId }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      addItem: (productId, size) =>
        set((state) => ({
          toast: { key: Date.now(), productId, size },
          items: state.items.some((item) => same(item, productId, size))
            ? state.items.map((item) =>
                same(item, productId, size) ? { ...item, qty: item.qty + 1 } : item,
              )
            : [...state.items, { productId, size, qty: 1 }],
        })),
      setQty: (productId, size, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((item) => !same(item, productId, size))
              : state.items.map((item) =>
                  same(item, productId, size) ? { ...item, qty } : item,
                ),
        })),
      clear: () => set({ items: [] }),
      dismissToast: () => set({ toast: null }),
    }),
    {
      name: "denim-atelier-cart",
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => ({
        ...current,
        items: ((persisted as Partial<ShopState> | undefined)?.items ?? []).filter((item) =>
          products.some((product) => product.id === item.productId),
        ),
      }),
      // rehydrate หลัง mount เพื่อไม่ให้ HTML ฝั่ง server กับ client ต่างกัน
      skipHydration: true,
    },
  ),
);
