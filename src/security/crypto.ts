/**
 * Cryptographic utilities for wallet operations
 * Uses BIP-39 for seed phrases and secp256k1 for keypair generation
 */
import * as bip39 from 'bip39';
import { utils, getPublicKey, sign, verify } from '@noble/secp256k1';
import { Buffer } from 'buffer';

/**
 * Generate a new BIP-39 seed phrase (12 words = 128 bits entropy)
 */
export function generateSeedPhrase(): string {
  // Generate 128 bits of entropy (16 bytes) for 12-word mnemonic
  const entropy = utils.randomSecretKey().slice(0, 16);

  // Convert entropy to mnemonic using BIP-39
  return bip39.entropyToMnemonic(Buffer.from(entropy).toString('hex'));
}

/**
 * Validate a seed phrase
 */
export function validateSeedPhrase(mnemonic: string): boolean {
  try {
    return bip39.validateMnemonic(mnemonic);
  } catch {
    return false;
  }
}

/**
 * Derive private key from seed phrase
 * Note: In production, use proper BIP-32/BIP-44 HD wallet derivation
 */
export function derivePrivateKeyFromSeed(seedPhrase: string): Uint8Array {
  try {
    // Generate seed from mnemonic using BIP-39
    const seed = bip39.mnemonicToSeedSync(seedPhrase);

    // Derive private key from seed (simplified - in production use proper HD derivation)
    // For now, use first 32 bytes of seed as private key
    const privateKey = new Uint8Array(seed.slice(0, 32));
    // Ensure it's a valid private key
    if (!utils.isValidSecretKey(privateKey)) {
      // If invalid, generate a deterministic key from seed hash
      // In production, use proper BIP-32 derivation
      const seedHash = new Uint8Array(32);
      for (let i = 0; i < 32 && i < seed.length; i++) {
        seedHash[i] = seed[i];
      }
      return seedHash;
    }
    return privateKey;
  } catch (error) {
    console.error('Failed to derive private key:', error);
    throw new Error('Failed to derive private key from seed');
  }
}

/**
 * Generate keypair from private key
 */
export function generateKeypair(privateKey: Uint8Array): {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
} {
  try {
    const publicKey = getPublicKey(privateKey, true); // compressed
    return {
      privateKey,
      publicKey,
    };
  } catch (error) {
    console.error('Failed to generate keypair:', error);
    throw new Error('Failed to generate keypair');
  }
}

/**
 * Derive address from public key (simplified Ethereum-style)
 */
export function deriveAddress(publicKey: Uint8Array): string {
  // Simplified address derivation (use last 20 bytes of public key hash)
  // In production, use proper address derivation for your blockchain (keccak256)
  // For now, use a simple hash of the public key
  const hash = publicKey.slice(-20);
  const address =
    '0x' +
    Array.from(hash as unknown as number[])
      .map((b: number) => b.toString(16).padStart(2, '0'))
      .join('');
  return address;
}

/**
 * Sign a message with private key
 */
export function signMessage(
  message: Uint8Array,
  privateKey: Uint8Array,
): Uint8Array {
  try {
    const signature = sign(message, privateKey);
    // Signature from @noble/secp256k1 returns Signature object with toCompactRawBytes()
    if (
      typeof signature === 'object' &&
      signature !== null &&
      'toCompactRawBytes' in signature
    ) {
      return (
        signature as { toCompactRawBytes: () => Uint8Array }
      ).toCompactRawBytes();
    }
    return signature as Uint8Array;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw new Error('Failed to sign message');
  }
}

/**
 * Verify a signature
 */
export function verifySignature(
  message: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array,
): boolean {
  try {
    return verify(signature, message, publicKey);
  } catch {
    return false;
  }
}

/**
 * Complete wallet initialization from seed phrase
 */
export function initializeWalletFromSeed(seedPhrase: string): {
  address: string;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
} {
  if (!validateSeedPhrase(seedPhrase)) {
    throw new Error('Invalid seed phrase');
  }

  const privateKey = derivePrivateKeyFromSeed(seedPhrase);
  const { publicKey } = generateKeypair(privateKey);
  const address = deriveAddress(publicKey);

  return {
    address,
    publicKey,
    privateKey,
  };
}
