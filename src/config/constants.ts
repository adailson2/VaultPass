/**
 * App constants and configuration
 */

export const APP_NAME = 'VaultPass';

// Security settings
export const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
export const BIOMETRIC_PROMPT_TIMEOUT = 30000; // 30 seconds

// API endpoints (mocked with MSW)
export const API_BASE_URL = 'https://api.vaultpass.demo';
export const API_ENDPOINTS = {
  BALANCE: '/balance',
  TRANSACTIONS: '/transactions',
  PRICES: '/prices',
  SEND: '/send', // POST only - mocked
};

// OWASP compliance flags
export const OWASP_CONFIG = {
  REQUIRE_BIO_ON_SENSITIVE: true,
  BLOCK_SCREENSHOTS: true,
  CHECK_INTEGRITY: true,
  CHECK_ROOT_JAILBREAK: true,
  TLS_PINNING: true,
  NO_CLIPBOARD_SEED: true,
} as const;

