/**
 * API endpoint functions
 */
import apiClient from './client';
import { API_ENDPOINTS } from '../config/constants';
import { TokenBalance, Transaction } from '../store/useWallet';

export interface BalanceResponse {
  address: string;
  balances: TokenBalance[];
  totalUsdValue: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}

export interface PricesResponse {
  prices: Record<string, number>;
}

export interface SendTransactionRequest {
  to: string;
  amount: string;
  token: string;
}

export interface SendTransactionResponse {
  success: boolean;
  txHash: string;
}

/**
 * Get wallet balance
 */
export async function getBalance(address: string): Promise<BalanceResponse> {
  const response = await apiClient.get<BalanceResponse>(API_ENDPOINTS.BALANCE, {
    params: { address },
  });
  return response.data;
}

/**
 * Get transaction history
 */
export async function getTransactions(
  address: string,
): Promise<TransactionsResponse> {
  const response = await apiClient.get<TransactionsResponse>(
    API_ENDPOINTS.TRANSACTIONS,
    {
      params: { address },
    },
  );
  return response.data;
}

/**
 * Get token prices
 */
export async function getPrices(): Promise<PricesResponse> {
  const response = await apiClient.get<PricesResponse>(API_ENDPOINTS.PRICES);
  return response.data;
}

/**
 * Send transaction (mocked - requires biometric re-auth before calling)
 */
export async function sendTransaction(
  request: SendTransactionRequest,
): Promise<SendTransactionResponse> {
  const response = await apiClient.post<SendTransactionResponse>(
    API_ENDPOINTS.SEND,
    request,
  );
  return response.data;
}
