# 🔐 VaultPass — Secure React Native Wallet Demo (TypeScript)

VaultPass is a **React Native CLI** demo app that showcases **mobile security best practices**
for Web3 and fintech use cases — similar to what you'd find in a **non-custodial crypto wallet**.

The app focuses on:

- **Hardware-backed key storage**
- **Biometric authentication**
- **Bundle & runtime protection**
- **OWASP Mobile Top 10 compliance**
- **Mocked blockchain data via MSW or interceptors**

---

## 🧱 Tech Stack

| Layer               | Tools                                                                       |
| ------------------- | --------------------------------------------------------------------------- |
| **Language**        | TypeScript                                                                  |
| **Framework**       | React Native 0.73 (React Navigation, Zustand, React Query)                  |
| **Security**        | `react-native-keychain`, biometrics, Android R8 + ProGuard, Hermes + Terser |
| **Mock APIs**       | Axios + Mock Service Worker (or simple interceptors)                        |
| **Native Security** | iOS Keychain / Android Keystore (TEE / StrongBox)                           |
| **Testing**         | Jest (unit), Detox (E2E)                                                    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20 (check with `node --version`)
- **npm** or **yarn** package manager
- For **iOS**: macOS with Xcode (latest version recommended)
- For **Android**: Android Studio with Android SDK configured
- **Java Development Kit (JDK)** for Android development

### 1. Clone & install

```bash
git clone https://github.com/adailson2/VaultPass.git
cd vaultpass
npm install
```

### 2. iOS Setup

Install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

### 3. Running the App

#### Run on iOS Simulator

```bash
npm run ios
```

Or specify a specific simulator:

```bash
npx react-native run-ios --simulator="iPhone 15"
```

#### Run on Android Emulator

Make sure you have:

- An Android emulator running, or
- A physical Android device connected with USB debugging enabled

Then run:

```bash
npm run android
```

#### Start Metro Bundler

In a separate terminal, you can start the Metro bundler:

```bash
npm start
```

This will start the Metro bundler which serves the JavaScript bundle to your app.

### 4. Troubleshooting

- **iOS**: If you encounter build issues, try cleaning the build:

  ```bash
  cd ios
  xcodebuild clean
  pod deintegrate && pod install
  cd ..
  ```

- **Android**: Clean and rebuild:

  ```bash
  cd android
  ./gradlew clean
  cd ..
  ```

- **Metro Cache**: Clear Metro bundler cache:
  ```bash
  npm start -- --reset-cache
  ```
