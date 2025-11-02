#!/usr/bin/env node
/**
 * Generate bundle hash at build time
 * This script computes the SHA256 hash of the JS bundle and embeds it
 * for runtime integrity verification
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple hash function (in production, use proper SHA256)
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate hash for bundle integrity check
 */
function generateBundleHash() {
  // In a real implementation, this would:
  // 1. Read the compiled JS bundle
  // 2. Compute SHA256 hash
  // 3. Write to a constants file
  
  const bundlePath = path.join(__dirname, '../android/app/build/generated/assets/react/release/index.android.bundle');
  
  let bundleHash = 'PLACEHOLDER_BUNDLE_HASH';
  
  // Try to read bundle if it exists
  if (fs.existsSync(bundlePath)) {
    const bundleContent = fs.readFileSync(bundlePath);
    bundleHash = sha256(bundleContent);
    console.log('✅ Bundle hash generated:', bundleHash.substring(0, 16) + '...');
  } else {
    console.warn('⚠️  Bundle not found, using placeholder hash');
    console.warn('   Run this script after building the app for production');
  }
  
  // Generate constants file
  const constantsPath = path.join(__dirname, '../src/config/bundle-hash.ts');
  const constantsContent = `/**
 * Bundle hash for integrity verification
 * Generated at build time - DO NOT EDIT MANUALLY
 */

export const BUILD_TIME_BUNDLE_HASH = '${bundleHash}';
`;

  fs.writeFileSync(constantsPath, constantsContent);
  console.log('✅ Bundle hash written to:', constantsPath);
  
  return bundleHash;
}

// Run if called directly
if (require.main === module) {
  generateBundleHash();
}

module.exports = { generateBundleHash };

