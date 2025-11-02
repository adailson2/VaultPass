/**
 * @format
 */

// Import crypto polyfill FIRST before any other imports
import './src/security/crypto-polyfill';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
