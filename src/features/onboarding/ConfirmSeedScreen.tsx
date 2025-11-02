/**
 * Seed phrase confirmation screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { validateSeedPhrase } from '../../security/crypto';
import { storeSeedPhrase } from '../../security/keychain';
import { initializeWalletFromSeed } from '../../security/crypto';
import { useSession } from '../../store/useSession';
import { useWallet } from '../../store/useWallet';
import { RootStackParamList } from '../../navigation/AppNavigator';

type ConfirmSeedScreenNavigationProp = StackNavigationProp<
  RootStackParamList | OnboardingStackParamList,
  'ConfirmSeed' | 'Wallet'
>;
type RouteParams = {
  seedPhrase: string;
};

function ConfirmSeedScreen() {
  const navigation = useNavigation<ConfirmSeedScreenNavigationProp>();
  const route = useRoute();
  const { seedPhrase: originalSeed } = route.params as RouteParams;
  const [confirmedWords, setConfirmedWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const { unlock } = useSession();
  const { setAddress } = useWallet();

  // Shuffle words for confirmation
  const words = originalSeed.split(' ');
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  const handleWordSelect = (word: string) => {
    if (confirmedWords.length >= words.length) return;

    const nextIndex = confirmedWords.length;
    if (word === words[nextIndex]) {
      const newConfirmed = [...confirmedWords, word];
      setConfirmedWords(newConfirmed);
      setSelectedWord(null);

      // If all words confirmed, validate and store
      if (newConfirmed.length === words.length) {
        const confirmedSeed = newConfirmed.join(' ');
        if (
          confirmedSeed === originalSeed &&
          validateSeedPhrase(confirmedSeed)
        ) {
          handleComplete(confirmedSeed);
        } else {
          Alert.alert(
            'Error',
            'Seed phrase confirmation failed. Please try again.',
          );
          setConfirmedWords([]);
        }
      }
    } else {
      Alert.alert('Wrong Word', 'Please select words in the correct order.');
      setConfirmedWords([]);
    }
  };

  const handleComplete = async (seed: string) => {
    try {
      // Store seed securely
      const stored = await storeSeedPhrase(seed);
      if (!stored) {
        throw new Error('Failed to store seed phrase');
      }

      // Initialize wallet
      const wallet = initializeWalletFromSeed(seed);
      setAddress(wallet.address);

      // Unlock session
      unlock();

      // Navigate to wallet
      navigation.reset({
        index: 0,
        routes: [{ name: 'Wallet' }],
      });
    } catch (error) {
      console.error('Wallet initialization error:', error);
      Alert.alert('Error', 'Failed to initialize wallet. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Your Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          Tap the words in the correct order to confirm you've saved them.
        </Text>
      </View>

      <View style={styles.confirmedContainer}>
        {words.map((_, index) => (
          <View key={index} style={styles.confirmedWordSlot}>
            <Text style={styles.confirmedWordNumber}>{index + 1}</Text>
            <Text style={styles.confirmedWordText}>
              {confirmedWords[index] || '___'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.wordsGrid}>
        {shuffledWords.map((word, index) => {
          const isSelected =
            confirmedWords.includes(word) &&
            confirmedWords.indexOf(word) === words.indexOf(word);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.wordButton,
                isSelected && styles.wordButtonSelected,
              ]}
              onPress={() => handleWordSelect(word)}
              disabled={isSelected}
            >
              <Text
                style={[
                  styles.wordButtonText,
                  isSelected && styles.wordButtonTextSelected,
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  confirmedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  confirmedWordSlot: {
    flexDirection: 'row',
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  confirmedWordNumber: {
    fontSize: 14,
    color: '#888888',
    marginRight: 8,
    width: 24,
  },
  confirmedWordText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
  },
  wordButtonSelected: {
    backgroundColor: '#007AFF',
  },
  wordButtonText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  wordButtonTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default ConfirmSeedScreen;
