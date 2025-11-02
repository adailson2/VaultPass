/**
 * Keychain/Keystore wrapper for secure storage
 * Uses hardware-backed storage with biometric authentication
 */
import * as Keychain from 'react-native-keychain';

export interface KeychainOptions {
  requireBiometrics?: boolean;
  accessible?: Keychain.ACCESSIBLE;
  accessControl?: Keychain.ACCESS_CONTROL;
}

const DEFAULT_OPTIONS: KeychainOptions = {
  requireBiometrics: true,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  accessControl:
    Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
};

/**
 * Store sensitive data securely with hardware-backed encryption
 */
export async function storeSecureValue(
  key: string,
  value: string,
  options: KeychainOptions = DEFAULT_OPTIONS,
): Promise<boolean> {
  try {
    const keychainOptions = {
      accessible: options.accessible || DEFAULT_OPTIONS.accessible!,
      accessControl: options.accessControl || DEFAULT_OPTIONS.accessControl!,
      // iOS: Store in Secure Enclave when possible
      // Android: Use hardware-backed keystore
    };

    const result = await Keychain.setGenericPassword(
      key,
      value,
      keychainOptions,
    );
    // Result can be false or a Result object - convert to boolean
    return typeof result === 'boolean' ? result : result !== null;
  } catch (error) {
    console.error('Failed to store secure value:', error);
    return false;
  }
}

/**
 * Retrieve secure value with biometric authentication
 */
export async function getSecureValue(
  key: string,
  options: { promptMessage?: string } = {},
): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      authenticationPrompt: {
        title: options.promptMessage || 'Authenticate to access wallet',
        subtitle: 'Use biometrics to unlock',
        description: '',
      },
    });

    if (credentials && credentials !== false && 'password' in credentials) {
      // Return the actual stored value (password field contains the value)
      return credentials.password;
    }

    return null;
  } catch (error) {
    console.error('Failed to retrieve secure value:', error);
    return null;
  }
}

/**
 * Check if credentials exist for a key
 */
export async function hasSecureValue(key: string): Promise<boolean> {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials !== false && credentials.username === key;
  } catch {
    return false;
  }
}

/**
 * Delete secure value
 */
export async function deleteSecureValue(key: string): Promise<boolean> {
  try {
    return await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Failed to delete secure value:', error);
    return false;
  }
}

/**
 * Check if biometric authentication is available
 */
export async function isBiometricAvailable(): Promise<{
  available: boolean;
  biometryType?: Keychain.BIOMETRY_TYPE;
}> {
  try {
    const biometryType = await Keychain.getSupportedBiometryType();
    return {
      available: biometryType !== null,
      biometryType: biometryType || undefined,
    };
  } catch {
    return { available: false };
  }
}

/**
 * Store seed phrase securely (hardware-backed, biometric-protected)
 */
export async function storeSeedPhrase(seedPhrase: string): Promise<boolean> {
  return storeSecureValue('wallet_seed', seedPhrase, {
    requireBiometrics: true,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    accessControl:
      Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
  });
}

/**
 * Retrieve seed phrase with biometric authentication
 */
export async function getSeedPhrase(): Promise<string | null> {
  return getSecureValue('wallet_seed', {
    promptMessage: 'Authenticate to access your seed phrase',
  });
}

/**
 * Check if wallet is initialized (seed exists)
 */
export async function isWalletInitialized(): Promise<boolean> {
  return hasSecureValue('wallet_seed');
}

/**
 * Wipe all wallet data
 */
export async function wipeWallet(): Promise<boolean> {
  try {
    await deleteSecureValue('wallet_seed');
    return true;
  } catch {
    return false;
  }
}
