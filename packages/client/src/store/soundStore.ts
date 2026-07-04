import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SoundState {
  muted: boolean;
  toggleMuted: () => void;
}

export const useSoundStore = create<SoundState>()(
  devtools(
    (set): SoundState => ({
      muted: false,
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
    })
  )
);
