/**
 * MSW setup for React Native
 * Initialize MSW in native app
 */
import { setupServer } from 'msw/native';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Start server when module loads (in development)
if (__DEV__) {
  server.listen({
    onUnhandledRequest: 'warn',
  });
}

export default server;
