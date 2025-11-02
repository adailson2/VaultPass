/**
 * Wallet flow navigator
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/wallet/HomeScreen';
import SendScreen from '../features/wallet/SendScreen';
import TxListScreen from '../features/wallet/TxListScreen';
import SettingsScreen from '../features/wallet/SettingsScreen';

export type WalletStackParamList = {
  Home: undefined;
  Send: undefined;
  TxList: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<WalletStackParamList>();

function WalletNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a1a' },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'VaultPass' }}
      />
      <Stack.Screen
        name="Send"
        component={SendScreen}
        options={{ title: 'Send' }}
      />
      <Stack.Screen
        name="TxList"
        component={TxListScreen}
        options={{ title: 'Transactions' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

export default WalletNavigator;
