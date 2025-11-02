const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration with Terser for obfuscation
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      buffer: require.resolve('buffer'),
    },
  },
  transformer: {
    // Enable minification in production builds
    minifierPath: require.resolve('metro-minify-terser'),
    minifierConfig: {
      // Terser options for code obfuscation
      ecma: 8,
      keep_classnames: false,
      keep_fnames: false,
      module: true,
      mangle: {
        module: true,
        keep_classnames: false,
        keep_fnames: false,
      },
      compress: {
        // Aggressive compression for production
        dead_code: true,
        drop_console: true, // Remove console logs in production (controlled by __DEV__ check)
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Get transform options
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
