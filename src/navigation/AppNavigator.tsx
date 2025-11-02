/**
 * Main app navigator with secure navigation guards
 */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '../store/useSession';
import LockScreen from '../features/auth/LockScreen';
import OnboardingNavigator from './OnboardingNavigator';
import WalletNavigator from './WalletNavigator';

export type RootStackParamList = {
  Lock: undefined;
  Onboarding: undefined;
  Wallet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isUnlocked, hasSeed, initialize } = useSession();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Determine initial route
  const getInitialRoute = () => {
    if (!hasSeed) {
      return 'Onboarding';
    }
    if (!isUnlocked) {
      return 'Lock';
    }
    return 'Wallet';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Lock" component={LockScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Wallet" component={WalletNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
