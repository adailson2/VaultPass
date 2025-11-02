/**
 * Wallet store - manages wallet address, balances, and transactions
 */
import { create } from 'zustand';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
}

interface WalletState {
  address: string | null;
  balances: TokenBalance[];
  transactions: Transaction[];
  setAddress: (address: string) => void;
  setBalances: (balances: TokenBalance[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  clearWallet: () => void;
}

export const useWallet = create<WalletState>(set => ({
  address: null,
  balances: [],
  transactions: [],

  setAddress: address => {
    set({ address });
  },

  setBalances: balances => {
    set({ balances });
  },

  setTransactions: transactions => {
    set({ transactions });
  },

  addTransaction: transaction => {
    set(state => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  clearWallet: () => {
    set({
      address: null,
      balances: [],
      transactions: [],
    });
  },
}));
