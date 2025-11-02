/**
 * Platform security checks: Root/Jailbreak detection, debugger detection
 */
import { Platform } from 'react-native';
import JailMonkey from 'jail-monkey';
import DeviceInfo from 'react-native-device-info';

export interface SecurityStatus {
  isRooted: boolean;
  isJailbroken: boolean;
  isDebuggerAttached: boolean;
  isEmulator: boolean;
  isSecureDevice: boolean;
}

/**
 * Check if device is rooted (Android) or jailbroken (iOS)
 */
export function isDeviceCompromised(): boolean {
  try {
    if (Platform.OS === 'android') {
      return JailMonkey.isJailBroken();
    } else {
      return JailMonkey.isJailBroken();
    }
  } catch {
    // Fail secure - assume compromised if check fails
    return true;
  }
}

/**
 * Check if running on emulator/simulator
 */
export async function isEmulator(): Promise<boolean> {
  try {
    return await DeviceInfo.isEmulator();
  } catch {
    return false;
  }
}

/**
 * Check if debugger is attached (basic check)
 * Note: More sophisticated checks can be added with native modules
 */
export function isDebuggerAttached(): boolean {
  // Basic check - in production, use native module for stronger checks
  if (__DEV__) {
    return true;
  }

  // Runtime debugger detection can be enhanced with native code
  // This is a placeholder for more sophisticated checks
  return false;
}

/**
 * Get comprehensive security status
 */
export async function getSecurityStatus(): Promise<SecurityStatus> {
  const isRooted = Platform.OS === 'android' && JailMonkey.isJailBroken();
  const isJailbroken = Platform.OS === 'ios' && JailMonkey.isJailBroken();
  const isEmulatorDevice = await isEmulator();
  const isDebuggerAttachedValue = isDebuggerAttached();

  const isSecureDevice =
    !isRooted && !isJailbroken && !isEmulatorDevice && !isDebuggerAttachedValue;

  return {
    isRooted,
    isJailbroken,
    isDebuggerAttached: isDebuggerAttachedValue,
    isEmulator: isEmulatorDevice,
    isSecureDevice,
  };
}

/**
 * Check if device should be allowed to proceed with sensitive operations
 */
export async function canProceedWithSensitiveOperation(): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const status = await getSecurityStatus();

  if (status.isRooted || status.isJailbroken) {
    return {
      allowed: false,
      reason: 'Device is compromised (rooted/jailbroken)',
    };
  }

  if (status.isDebuggerAttached && !__DEV__) {
    return {
      allowed: false,
      reason: 'Debugger detected in release build',
    };
  }

  return { allowed: true };
}
