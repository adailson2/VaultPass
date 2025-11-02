/**
 * Settings screen with security status
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getSecurityStatus } from '../../security/platform';
import { performIntegrityChecks } from '../../security/integrity';
import { getOWASPComplianceStatus } from '../../config/owasp';
import { useSession } from '../../store/useSession';
import { wipeWallet } from '../../security/keychain';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { lock } = useSession();
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [integrityStatus, setIntegrityStatus] = useState<any>(null);

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  const loadSecurityStatus = async () => {
    const platformStatus = await getSecurityStatus();
    const integrity = await performIntegrityChecks();
    setSecurityStatus(platformStatus);
    setIntegrityStatus(integrity);
  };

  const handleWipeWallet = () => {
    Alert.alert(
      'Wipe Wallet',
      'This will delete all wallet data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Wipe',
          style: 'destructive',
          onPress: async () => {
            await wipeWallet();
            lock();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ],
    );
  };

  const owaspStatus = getOWASPComplianceStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Status</Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Device Status:</Text>
          <Text
            style={[
              styles.statusValue,
              securityStatus?.isSecureDevice
                ? styles.statusOk
                : styles.statusError,
            ]}
          >
            {securityStatus?.isSecureDevice ? 'Secure' : 'Compromised'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Rooted/Jailbroken:</Text>
          <Text
            style={[
              styles.statusValue,
              !securityStatus?.isRooted && !securityStatus?.isJailbroken
                ? styles.statusOk
                : styles.statusError,
            ]}
          >
            {securityStatus?.isRooted || securityStatus?.isJailbroken
              ? 'Yes'
              : 'No'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Bundle Integrity:</Text>
          <Text
            style={[
              styles.statusValue,
              integrityStatus?.allPassed ? styles.statusOk : styles.statusError,
            ]}
          >
            {integrityStatus?.allPassed ? 'OK' : 'Failed'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>TLS Pinning:</Text>
          <Text style={[styles.statusValue, styles.statusOk]}>Enabled</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OWASP Compliance</Text>
        {owaspStatus.map((item, index) => (
          <View key={index} style={styles.owaspItem}>
            <Text
              style={[
                styles.owaspIndicator,
                item.compliant ? styles.owaspOk : styles.owaspError,
              ]}
            >
              {item.compliant ? '✓' : '✗'}
            </Text>
            <View style={styles.owaspContent}>
              <Text style={styles.owaspCategory}>{item.category}</Text>
              <Text style={styles.owaspNotes}>{item.notes}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleWipeWallet}
        >
          <Text style={styles.buttonText}>Wipe Wallet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#888888',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusOk: {
    color: '#34c759',
  },
  statusError: {
    color: '#ff3b30',
  },
  owaspItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  owaspIndicator: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  owaspOk: {
    color: '#34c759',
  },
  owaspError: {
    color: '#ff3b30',
  },
  owaspContent: {
    flex: 1,
  },
  owaspCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  owaspNotes: {
    fontSize: 12,
    color: '#888888',
  },
  button: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
