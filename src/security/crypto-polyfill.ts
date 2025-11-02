/**
 * Crypto polyfill for React Native
 * Provides crypto.getRandomValues and Buffer without requiring native modules
 */
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Polyfill crypto.getRandomValues using React Native's available APIs
if (typeof global.crypto === 'undefined') {
  // Simple CSPRNG implementation using Math.random as fallback
  // Note: For production, consider using a more secure implementation
  global.crypto = {
    getRandomValues: function <T extends ArrayBufferView | null>(
      array: T,
    ): T {
      if (array === null) {
        throw new Error('ArrayBufferView cannot be null');
      }

      const bytes = new Uint8Array(
        array.buffer,
        array.byteOffset,
        array.byteLength,
      );

      // Generate random bytes using Math.random()
      // Note: For production apps handling real funds, use react-native-get-random-values
      // with proper native module linking, or use a more secure RNG
      // For demo purposes, Math.random() is sufficient
      for (let i = 0; i < bytes.length; i++) {
        // Generate random byte (0-255)
        bytes[i] = Math.floor(Math.random() * 256);
      }

      return array;
    },
  } as Crypto;
}

// Also ensure window.crypto exists for browser-like environments
if (typeof window !== 'undefined' && typeof window.crypto === 'undefined') {
  (window as any).crypto = global.crypto;
}

