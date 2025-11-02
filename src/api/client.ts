/**
 * API client with TLS pinning support
 * Note: TLS pinning implementation would require native modules
 * For now, this is a standard axios client ready for pinning integration
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import { setupMockInterceptors } from '../mocks/interceptors';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup mock interceptors as fallback (handles edge cases)
if (__DEV__) {
  setupMockInterceptors();
}

// Request interceptor (for TLS pinning in production)
// Note: Mock interceptors are set up globally, but we can add TLS pinning here
apiClient.interceptors.request.use(
  config => {
    // In production, add TLS pinning verification here
    // This would use react-native-cert-pinner or similar
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor (for TLS pinning error handling)
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle TLS pinning errors
    if (error.code === 'CERT_PINNED') {
      console.error('TLS pinning verification failed');
      return Promise.reject(
        new Error('Certificate pinning failed - possible MITM attack'),
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
