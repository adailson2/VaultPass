/**
 * API client with TLS pinning support
 * Note: TLS pinning implementation would require native modules
 * For now, this is a standard axios client ready for pinning integration
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import { setupMockInterceptors } from '../mocks/interceptors';
import { initializeTLSPinning } from '../security/tlsPinning';

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
} else {
  // Initialize TLS pinning in production
  initializeTLSPinning();
}

// Request interceptor (for TLS pinning in production)
// Note: react-native-cert-pinner handles pinning at native level
// This interceptor can be used for additional validation
apiClient.interceptors.request.use(
  config => {
    // TLS pinning is handled natively by react-native-cert-pinner
    // Additional validation can be added here if needed
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
