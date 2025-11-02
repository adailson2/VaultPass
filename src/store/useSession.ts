/**
 * Session store - manages app lock/unlock state
 */
import { create } from 'zustand';
import { isWalletInitialized } from '../security/keychain';

interface SessionState {
  isUnlocked: boolean;
  hasSeed: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  unlock: () => void;
  lock: () => void;
}

export const useSession = create<SessionState>(set => ({
  isUnlocked: false,
  hasSeed: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const hasSeedValue = await isWalletInitialized();
      set({ hasSeed: hasSeedValue, isInitialized: true });
    } catch (error) {
      console.error('Failed to initialize session:', error);
      set({ isInitialized: true });
    }
  },

  unlock: () => {
    set({ isUnlocked: true });
  },

  lock: () => {
    set({ isUnlocked: false });
  },
}));
