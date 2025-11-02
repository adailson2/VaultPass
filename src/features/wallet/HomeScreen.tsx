/**
 * Home screen - displays wallet balances and quick actions
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';
import { WalletStackParamList } from '../../navigation/WalletNavigator';
import { useWallet } from '../../store/useWallet';
import { useSession } from '../../store/useSession';
import { getBalance, getTransactions } from '../../api/endpoints';
import { useQuery } from '@tanstack/react-query';

type HomeScreenNavigationProp = StackNavigationProp<
  WalletStackParamList,
  'Home'
>;

function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { address, balances, setBalances, setTransactions } = useWallet();
  const { lock } = useSession();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: balanceData, refetch: refetchBalance } = useQuery({
    queryKey: ['balance', address],
    queryFn: () => (address ? getBalance(address) : null),
    enabled: !!address,
  });

  const { data: txData, refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions', address],
    queryFn: () => (address ? getTransactions(address) : null),
    enabled: !!address,
  });

  useEffect(() => {
    if (balanceData) {
      setBalances(balanceData.balances);
    }
  }, [balanceData, setBalances]);

  useEffect(() => {
    if (txData) {
      setTransactions(txData.transactions);
    }
  }, [txData, setTransactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchBalance(), refetchTransactions()]);
    setRefreshing(false);
  };

  const totalValue = balanceData?.totalUsdValue || '0';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.addressLabel}>Wallet Address</Text>
        <Text style={styles.address}>{address || 'Loading...'}</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>${totalValue}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assets</Text>
        {balances.length > 0 ? (
          balances.map((token, index) => (
            <View key={index} style={styles.tokenCard}>
              <View>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
              <View style={styles.tokenBalance}>
                <Text style={styles.tokenAmount}>{token.balance}</Text>
                <Text style={styles.tokenUsd}>${token.usdValue}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No assets found</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Send')}
        >
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TxList')}
        >
          <Text style={styles.actionButtonText}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.lockButton]}
          onPress={lock}
        >
          <Text style={styles.actionButtonText}>Lock Wallet</Text>
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
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  addressLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  balanceCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    margin: 16,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  tokenCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  tokenName: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  tokenBalance: {
    alignItems: 'flex-end',
  },
  tokenAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  tokenUsd: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    padding: 20,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  lockButton: {
    backgroundColor: '#ff3b30',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
