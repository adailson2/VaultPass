/**
 * OWASP Mobile Top 10 compliance checklist and policies
 */
import { OWASP_CONFIG } from './constants';

export enum OWASPCategory {
  IMPROPER_PLATFORM_USAGE = 'M1: Improper Platform Usage',
  INSECURE_DATA_STORAGE = 'M2: Insecure Data Storage',
  INSECURE_COMMUNICATION = 'M3: Insecure Communication',
  INSECURE_AUTHENTICATION = 'M4: Insecure Authentication',
  INSUFFICIENT_CRYPTOGRAPHY = 'M5: Insufficient Cryptography',
  INSECURE_AUTHORIZATION = 'M6: Insecure Authorization',
  POOR_CODE_QUALITY = 'M7: Poor Code Quality',
  CODE_TAMPERING = 'M8: Code Tampering',
  REVERSE_ENGINEERING = 'M9: Reverse Engineering',
  EXTRANEOUS_FUNCTIONALITY = 'M10: Extraneous Functionality',
}

export interface OWASPComplianceStatus {
  category: OWASPCategory;
  compliant: boolean;
  notes: string;
}

/**
 * Get OWASP compliance status for all categories
 */
export function getOWASPComplianceStatus(): OWASPComplianceStatus[] {
  return [
    {
      category: OWASPCategory.IMPROPER_PLATFORM_USAGE,
      compliant: true,
      notes:
        'Uses Keychain/Keystore with correct access control, hardware-backed storage',
    },
    {
      category: OWASPCategory.INSECURE_DATA_STORAGE,
      compliant: true,
      notes:
        'No AsyncStorage for secrets; all sensitive data in hardware-backed Keychain/Keystore',
    },
    {
      category: OWASPCategory.INSECURE_COMMUNICATION,
      compliant: OWASP_CONFIG.TLS_PINNING,
      notes: OWASP_CONFIG.TLS_PINNING
        ? 'TLS pinning enabled for all network requests'
        : 'TLS pinning not enabled',
    },
    {
      category: OWASPCategory.INSECURE_AUTHENTICATION,
      compliant: OWASP_CONFIG.REQUIRE_BIO_ON_SENSITIVE,
      notes: 'Biometric authentication required for sensitive operations',
    },
    {
      category: OWASPCategory.INSUFFICIENT_CRYPTOGRAPHY,
      compliant: true,
      notes: 'Uses standard cryptographic libraries (BIP-39, secp256k1)',
    },
    {
      category: OWASPCategory.INSECURE_AUTHORIZATION,
      compliant: true,
      notes: 'Local authorization guards, biometric gates on sensitive actions',
    },
    {
      category: OWASPCategory.POOR_CODE_QUALITY,
      compliant: true,
      notes: 'TypeScript strict mode, error boundaries, crash guards',
    },
    {
      category: OWASPCategory.CODE_TAMPERING,
      compliant: OWASP_CONFIG.CHECK_INTEGRITY,
      notes: OWASP_CONFIG.CHECK_INTEGRITY
        ? 'Bundle integrity checks enabled'
        : 'Bundle integrity checks disabled',
    },
    {
      category: OWASPCategory.REVERSE_ENGINEERING,
      compliant: true,
      notes: 'Hermes bytecode, R8/ProGuard obfuscation, symbol stripping',
    },
    {
      category: OWASPCategory.EXTRANEOUS_FUNCTIONALITY,
      compliant: true,
      notes: 'No dev menus in release builds, feature flags locked',
    },
  ];
}
