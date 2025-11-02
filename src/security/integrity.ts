/**
 * Bundle integrity verification
 * Compares runtime bundle hash with build-time embedded hash
 */

import { BUILD_TIME_BUNDLE_HASH } from '../config/bundle-hash';

/**
 * Compute SHA-256 hash of a string
 * Note: In production, this should use native crypto for better performance
 */
async function sha256(text: string): Promise<string> {
  // Simple hash function for demo
  // In production, use react-native-crypto or native crypto module
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to hex string (simplified)
  return Math.abs(hash).toString(16);
}

/**
 * Get bundle hash at runtime
 * Note: In a real implementation, this would read the actual JS bundle
 */
async function getRuntimeBundleHash(): Promise<string> {
  // This is a placeholder - in production, you would:
  // 1. Read the bundled JS bundle file
  // 2. Compute its hash
  // 3. Compare with embedded hash

  // For now, return a mock hash
  const mockBundleContent = 'mock-bundle-content';
  return sha256(mockBundleContent);
}

/**
 * Verify bundle integrity
 */
export async function verifyBundleIntegrity(): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // Skip integrity check in development
  if (__DEV__) {
    return { isValid: true };
  }

  if (
    !BUILD_TIME_BUNDLE_HASH ||
    BUILD_TIME_BUNDLE_HASH === 'PLACEHOLDER_BUNDLE_HASH'
  ) {
    console.warn('Bundle hash not embedded at build time');
    // In production, this should fail
    return {
      isValid: false,
      error: 'Bundle integrity check not configured',
    };
  }

  try {
    const runtimeHash = await getRuntimeBundleHash();

    if (runtimeHash !== BUILD_TIME_BUNDLE_HASH) {
      return {
        isValid: false,
        error: 'Bundle integrity check failed - bundle may be tampered',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Integrity check error: ${error}`,
    };
  }
}

/**
 * Check if debugger is attached (additional to platform.ts)
 */
export function isDebuggerAttached(): boolean {
  // Enhanced debugger detection
  // In production, implement native checks
  return __DEV__;
}

/**
 * Perform all integrity checks
 */
export async function performIntegrityChecks(): Promise<{
  bundleIntegrity: boolean;
  debuggerCheck: boolean;
  allPassed: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  const bundleCheck = await verifyBundleIntegrity();
  const debuggerAttached = isDebuggerAttached();

  if (!bundleCheck.isValid) {
    errors.push(bundleCheck.error || 'Bundle integrity failed');
  }

  if (debuggerAttached && !__DEV__) {
    errors.push('Debugger detected in release build');
  }

  return {
    bundleIntegrity: bundleCheck.isValid,
    debuggerCheck: !debuggerAttached || __DEV__,
    allPassed: errors.length === 0,
    errors,
  };
}
