/**
 * Transaction list screen
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useWallet } from '../../store/useWallet';

function TxListScreen() {
  const { transactions } = useWallet();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderTransaction = ({ item }: { item: (typeof transactions)[0] }) => (
    <View style={styles.txCard}>
      <View style={styles.txHeader}>
        <Text style={styles.txHash}>{item.id.substring(0, 10)}...</Text>
        <Text
          style={[
            styles.txStatus,
            item.status === 'confirmed' && styles.txStatusConfirmed,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.txAddress}>To: {item.to.substring(0, 10)}...</Text>
      <Text style={styles.txAmount}>
        {item.amount} {item.token || 'AVAX'}
      </Text>
      <Text style={styles.txDate}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  list: {
    padding: 16,
  },
  txCard: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txHash: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  txStatus: {
    fontSize: 12,
    color: '#888888',
    textTransform: 'uppercase',
  },
  txStatusConfirmed: {
    color: '#34c759',
  },
  txAddress: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  txAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: '#666666',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
  },
});

export default TxListScreen;
