/**
 * Onboarding flow navigator
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SeedScreen from '../features/onboarding/SeedScreen';
import ConfirmSeedScreen from '../features/onboarding/ConfirmSeedScreen';

export type OnboardingStackParamList = {
  Seed: undefined;
  ConfirmSeed: { seedPhrase: string };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Seed" component={SeedScreen} />
      <Stack.Screen name="ConfirmSeed" component={ConfirmSeedScreen} />
    </Stack.Navigator>
  );
}

export default OnboardingNavigator;
