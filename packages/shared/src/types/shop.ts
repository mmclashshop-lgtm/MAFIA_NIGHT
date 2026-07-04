export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'avatar_frame' | 'title' | 'icon' | 'other';
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'frame_gold', name: 'Gold Frame', description: 'A golden border for your avatar', price: 500, icon: '🖼️', category: 'avatar_frame' },
  { id: 'frame_blood', name: 'Blood Frame', description: 'A crimson blood border', price: 800, icon: '🔴', category: 'avatar_frame' },
  { id: 'frame_shadow', name: 'Shadow Frame', description: 'A dark shadowy aura', price: 1200, icon: '🌑', category: 'avatar_frame' },
  { id: 'title_mafia', name: 'Mafia Title', description: 'Unlock "The Mafia" title', price: 300, icon: '🎭', category: 'title' },
  { id: 'title_detective', name: 'Detective Title', description: 'Unlock "The Detective" title', price: 300, icon: '🔍', category: 'title' },
  { id: 'title_legend', name: 'Legend Title', description: 'Unlock "Legend" title', price: 2000, icon: '👑', category: 'title' },
  { id: 'icon_skull', name: 'Skull Icon', description: 'A menacing skull icon', price: 150, icon: '💀', category: 'icon' },
  { id: 'icon_rose', name: 'Rose Icon', description: 'A beautiful rose icon', price: 150, icon: '🌹', category: 'icon' },
  { id: 'icon_crown', name: 'Crown Icon', description: 'A royal crown icon', price: 1000, icon: '👑', category: 'icon' },
];
