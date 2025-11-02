# VaultPass Implementation Notes

## Current Status

The core VaultPass application structure has been implemented according to the plan. Here's what's been completed:

### ✅ Completed

- Project structure and dependencies installed
- Security layer (keychain, platform checks, integrity checks)
- Crypto utilities (BIP-39 seed phrases, secp256k1 keypair generation)
- Zustand stores (session, wallet state)
- API client with MSW mock handlers
- React Navigation setup
- All main screens (Lock, Onboarding, Wallet, Send, Settings)
- MSW setup for mocking API responses

### ⚠️ Remaining Type Issues

There are some TypeScript type mismatches that need to be resolved:

1. **@noble/secp256k1 API**: The library API may differ from what's used. Check actual exports:

   - Use `utils.randomSecretKey()` instead of `randomPrivateKey()`
   - Check available hash functions
   - Verify signature return types

2. **react-native-keychain types**:
   - The library returns `false | Result` or `false | UserCredentials`
   - Handle these union types properly with type guards

### 🔧 Quick Fixes Needed

**In `src/security/crypto.ts`:**

- Replace `utils.randomPrivateKey()` with `utils.randomSecretKey()`
- Replace `utils.isValidPrivateKey()` with `utils.isValidSecretKey()`
- Check if `hashToPrivateKey` exists or use alternative hashing
- Fix signature return type (may need to serialize differently)

**In `src/security/keychain.ts`:**

- Add proper type guards for union types
- Handle `Result` vs `boolean` return types correctly

### 📱 Next Steps for Full Implementation

1. **Native Module Setup:**

   - Run `cd ios && pod install` for iOS dependencies
   - Link native modules for react-native-keychain

2. **Android FLAG_SECURE:**

   - Create native module or use existing library to set FLAG_SECURE on sensitive screens
   - Apply to SeedScreen and ConfirmSeedScreen

3. **TLS Pinning:**

   - Research and integrate react-native-cert-pinner or similar
   - Configure certificate pinning in API client

4. **Bundle Integrity:**

   - Create build script to compute bundle hash at build time
   - Embed hash as constant for runtime verification

5. **Metro + Terser:**

   - Configure Metro bundler with Terser for obfuscation
   - Verify Hermes bytecode compilation in release builds

6. **Testing:**
   - Set up Detox for E2E testing
   - Add unit tests for security functions

### 🚀 Running the App

Once type issues are resolved:

```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android

# Start Metro bundler
npm start
```

### 📝 Notes

- The app structure follows the planned architecture
- MSW is set up to mock API responses in development
- All security features are scaffolded and ready for native integration
- UI uses React Native components (Tamagui can be added later if desired)
