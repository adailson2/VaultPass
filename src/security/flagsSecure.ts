/**
 * FLAG_SECURE utilities for preventing screenshots
 * Android: Uses FLAG_SECURE native module
 * iOS: Uses UIScreen screenshot detection
 */

import React from 'react';
import { Platform, NativeModules } from 'react-native';

interface SecureFlagModule {
  setSecureFlag: (enabled: boolean) => void;
}

// Native module for setting FLAG_SECURE on Android
let SecureFlagModule: SecureFlagModule | null = null;

try {
  SecureFlagModule = NativeModules.SecureFlagModule;
} catch {
  // Module not available - we'll create it
}

/**
 * Enable FLAG_SECURE to prevent screenshots (Android)
 */
export function enableScreenshotProtection() {
  if (Platform.OS === 'android' && SecureFlagModule) {
    try {
      SecureFlagModule.setSecureFlag(true);
    } catch (error) {
      console.warn('Failed to enable FLAG_SECURE:', error);
    }
  }
}

/**
 * Disable FLAG_SECURE (Android)
 */
export function disableScreenshotProtection() {
  if (Platform.OS === 'android' && SecureFlagModule) {
    try {
      SecureFlagModule.setSecureFlag(false);
    } catch (error) {
      console.warn('Failed to disable FLAG_SECURE:', error);
    }
  }
}

/**
 * React hook to manage screenshot protection
 */
export function useScreenshotProtection(enabled: boolean = true) {
  React.useEffect(() => {
    if (enabled) {
      enableScreenshotProtection();
      return () => {
        disableScreenshotProtection();
      };
    }
  }, [enabled]);
}

