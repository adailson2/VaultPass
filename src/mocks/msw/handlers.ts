/**
 * MSW handlers for mocking API responses
 */
import { http, HttpResponse } from 'msw';

const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

export const handlers = [
  // GET /balance
  http.get('https://api.vaultpass.demo/balance', () => {
    return HttpResponse.json({
      address: MOCK_ADDRESS,
      balances: [
        {
          symbol: 'AVAX',
          name: 'Avalanche',
          balance: '125.5',
          usdValue: '3125.75',
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: '5000.0',
          usdValue: '5000.0',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: '2.5',
          usdValue: '6250.0',
        },
      ],
      totalUsdValue: '14375.75',
    });
  }),

  // GET /transactions
  http.get('https://api.vaultpass.demo/transactions', () => {
    return HttpResponse.json({
      transactions: [
        {
          id: '0x1234...5678',
          from: MOCK_ADDRESS,
          to: '0x9876...4321',
          amount: '10.5',
          token: 'AVAX',
          timestamp: Date.now() - 3600000, // 1 hour ago
          status: 'confirmed',
        },
        {
          id: '0xabcd...efgh',
          from: '0x1111...2222',
          to: MOCK_ADDRESS,
          amount: '500.0',
          token: 'USDC',
          timestamp: Date.now() - 7200000, // 2 hours ago
          status: 'confirmed',
        },
        {
          id: '0x9876...5432',
          from: MOCK_ADDRESS,
          to: '0x3333...4444',
          amount: '0.5',
          token: 'ETH',
          timestamp: Date.now() - 86400000, // 1 day ago
          status: 'confirmed',
        },
      ],
    });
  }),

  // GET /prices
  http.get('https://api.vaultpass.demo/prices', () => {
    return HttpResponse.json({
      prices: {
        AVAX: 24.91,
        ETH: 2500.0,
        USDC: 1.0,
      },
    });
  }),

  // POST /send (mocked - always succeeds)
  http.post('https://api.vaultpass.demo/send', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      txHash: `0x${Math.random().toString(16).slice(2)}`,
      ...body,
    });
  }),
];
