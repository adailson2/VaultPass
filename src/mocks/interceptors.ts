/**
 * Axios interceptors for mocking API responses in React Native
 * This replaces MSW which uses BroadcastChannel (not available in RN)
 */
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';

const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

// Mock responses
const mockResponses = {
  [API_ENDPOINTS.BALANCE]: {
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
  },
  [API_ENDPOINTS.TRANSACTIONS]: {
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
  },
  [API_ENDPOINTS.PRICES]: {
    prices: {
      AVAX: 24.91,
      ETH: 2500.0,
      USDC: 1.0,
    },
  },
};

/**
 * Check if URL should be mocked
 */
function shouldMock(url: string, baseURL: string): boolean {
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
  return fullUrl.includes(API_BASE_URL);
}

/**
 * Get mock response for a URL
 * Exported for use in axios adapter
 */
export function getMockResponse(url: string, method: string = 'get', data?: any) {
  const endpoint = Object.keys(mockResponses).find(e => url.includes(e));
  
  if (endpoint) {
    return mockResponses[endpoint];
  }
  
  // Handle POST /send
  if (url.includes(API_ENDPOINTS.SEND) && method === 'post') {
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).slice(2)}`,
      ...data,
    };
  }
  
  return null;
}

/**
 * Setup axios interceptors for mocking
 * Only enabled in development mode
 * Uses request interceptor to mark requests for mocking,
 * and response interceptor to return mock data when network fails
 */
export function setupMockInterceptors() {
  if (!__DEV__) {
    return; // Disable mocks in production
  }

  // Request interceptor - mark requests that should be mocked
  axios.interceptors.request.use(
    config => {
      const url = config.url || '';
      const baseURL = config.baseURL || API_BASE_URL;
      
      if (shouldMock(url, baseURL)) {
        const mockData = getMockResponse(
          `${baseURL}${url}`,
          config.method || 'get',
          config.data,
        );
        
        if (mockData) {
          // Mark this request to be mocked
          (config as any).__shouldMock = true;
          (config as any).__mockData = mockData;
        }
      }
      
      return config;
    },
    error => Promise.reject(error),
  );

  // Response interceptor - return mock data when network request fails
  // This works because the API endpoint doesn't exist, so requests will fail
  // and we catch them here to return mock responses
  axios.interceptors.response.use(
    response => response,
    error => {
      const config = error.config;
      
      // If this request should be mocked and network failed, return mock data
      if (config && (config as any).__shouldMock && (config as any).__mockData) {
        return Promise.resolve({
          data: (config as any).__mockData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      }
      
      return Promise.reject(error);
    },
  );
}

/**
 * Alternative: Direct axios adapter approach
 */
export function createMockAdapter() {
  if (!__DEV__) {
    return null;
  }

  // Create a custom adapter for axios
  return async (config: any) => {
    const url = config.url || '';
    const baseURL = config.baseURL || API_BASE_URL;
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

    // Check for matching endpoints
    for (const [endpoint, mockResponse] of Object.entries(mockResponses)) {
      if (fullUrl.includes(endpoint)) {
        return Promise.resolve({
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
      }
    }

    // For POST /send
    if (fullUrl.includes(API_ENDPOINTS.SEND) && config.method === 'post') {
      return Promise.resolve({
        data: {
          success: true,
          txHash: `0x${Math.random().toString(16).slice(2)}`,
          ...config.data,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    }

    // No match - let axios handle normally
    return config;
  };
}

