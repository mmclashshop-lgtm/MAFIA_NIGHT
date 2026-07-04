import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ShopItem } from '@mafia/shared';

interface ShopState {
  items: ShopItem[];
  inventory: string[];
  coins: number;
  loading: boolean;
  setItems: (items: ShopItem[]) => void;
  setInventory: (inventory: string[], coins: number) => void;
  setLoading: (loading: boolean) => void;
  addToInventory: (itemId: string) => void;
  setCoins: (coins: number) => void;
}

export const useShopStore = create<ShopState>()(
  devtools(
    (set): ShopState => ({
      items: [],
      inventory: [],
      coins: 0,
      loading: false,
      setItems: (items) => set({ items }),
      setInventory: (inventory, coins) => set({ inventory, coins }),
      setLoading: (loading) => set({ loading }),
      addToInventory: (itemId) => set((s) => ({ inventory: [...s.inventory, itemId] })),
      setCoins: (coins) => set({ coins }),
    })
  )
);
