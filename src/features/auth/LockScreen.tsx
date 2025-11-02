/**
 * Lock screen with biometric authentication
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSession } from '../../store/useSession';
import { getSeedPhrase, isBiometricAvailable } from '../../security/keychain';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type LockScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Lock'>;

function LockScreen() {
  const navigation = useNavigation<LockScreenNavigationProp>();
  const { unlock } = useSession();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    handleBiometricAuth();
  }, []);

  const handleBiometricAuth = async () => {
    setLoading(true);
    try {
      const biometricStatus = await isBiometricAvailable();

      if (!biometricStatus.available) {
        Alert.alert(
          'Biometrics Unavailable',
          'Biometric authentication is not available on this device.',
          [{ text: 'OK' }],
        );
        setLoading(false);
        return;
      }

      // Attempt to retrieve seed with biometric prompt
      const seedPhrase = await getSeedPhrase();

      if (seedPhrase) {
        unlock();
        navigation.replace('Wallet');
      } else {
        Alert.alert(
          'Authentication Failed',
          'Failed to authenticate. Please try again.',
          [{ text: 'OK', onPress: handleBiometricAuth }],
        );
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      Alert.alert('Error', 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔐 VaultPass</Text>
        <Text style={styles.subtitle}>Secure Wallet</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
            <Text style={styles.buttonText}>Unlock with Biometrics</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LockScreen;
