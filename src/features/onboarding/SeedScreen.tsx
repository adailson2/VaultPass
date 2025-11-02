/**
 * Seed phrase generation and display screen
 * FLAG_SECURE should be enabled for this screen (prevents screenshots)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { generateSeedPhrase } from '../../security/crypto';
import { Platform } from 'react-native';
import { enableScreenshotProtection, disableScreenshotProtection } from '../../security/flagsSecure';

type SeedScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'Seed'
>;

function SeedScreen() {
  const navigation = useNavigation<SeedScreenNavigationProp>();
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate seed phrase on mount
    const newSeed = generateSeedPhrase();
    setSeedPhrase(newSeed);

    // Enable screenshot protection
    enableScreenshotProtection();

    // Disable when component unmounts
    return () => {
      disableScreenshotProtection();
    };
  }, []);

  const handleContinue = () => {
    if (!seedPhrase) {
      Alert.alert('Error', 'Seed phrase not generated');
      return;
    }
    navigation.navigate('ConfirmSeed', { seedPhrase });
  };

  // Prevent clipboard access for security
  const handleCopy = () => {
    Alert.alert(
      'Security Notice',
      'For your security, seed phrases should never be copied to clipboard. Please write it down manually.',
      [{ text: 'OK' }],
    );
  };

  const words = seedPhrase.split(' ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          Write down these 12 words in order. Keep them safe and never share
          them.
        </Text>
      </View>

      <View style={styles.seedContainer}>
        {words.map((word, index) => (
          <View key={index} style={styles.seedWord}>
            <Text style={styles.seedWordNumber}>{index + 1}.</Text>
            <Text style={styles.seedWordText}>{word}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>I've Written It Down</Text>
      </TouchableOpacity>

      <Text style={styles.warning}>
        ⚠️ Never share your seed phrase. Anyone with access can steal your
        funds.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 20,
  },
  seedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  seedWord: {
    flexDirection: 'row',
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  seedWordNumber: {
    fontSize: 14,
    color: '#888888',
    marginRight: 8,
    width: 24,
  },
  seedWordText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  warning: {
    fontSize: 12,
    color: '#ff9500',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SeedScreen;
