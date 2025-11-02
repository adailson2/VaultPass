/**
 * Send screen with biometric re-authentication
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getSeedPhrase } from '../../security/keychain';
import { sendTransaction } from '../../api/endpoints';
import { useWallet } from '../../store/useWallet';
import { canProceedWithSensitiveOperation } from '../../security/platform';

function SendScreen() {
  const { address } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!toAddress || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check device security
    const securityCheck = await canProceedWithSensitiveOperation();
    if (!securityCheck.allowed) {
      Alert.alert('Security Warning', securityCheck.reason);
      return;
    }

    setLoading(true);
    try {
      // Require biometric re-authentication
      const seedPhrase = await getSeedPhrase();
      if (!seedPhrase) {
        Alert.alert(
          'Authentication Failed',
          'Biometric authentication required',
        );
        setLoading(false);
        return;
      }

      // Send transaction (mocked)
      const result = await sendTransaction({
        to: toAddress,
        amount,
        token: 'AVAX',
      });

      if (result.success) {
        Alert.alert('Success', `Transaction sent!\nTx Hash: ${result.txHash}`);
        setToAddress('');
        setAmount('');
      }
    } catch (error) {
      console.error('Send error:', error);
      Alert.alert('Error', 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.address}>{address}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>To Address</Text>
          <TextInput
            style={styles.input}
            value={toAddress}
            onChangeText={setToAddress}
            placeholder="0x..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.0"
            placeholderTextColor="#666"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Send (Requires Biometric)</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.info}>
          You will be prompted for biometric authentication before sending.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  form: {
    flex: 1,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SendScreen;
