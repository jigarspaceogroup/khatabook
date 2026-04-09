module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/navigation': './src/navigation',
          '@/store': './src/store',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/hooks': './src/hooks',
          '@/theme': './src/theme',
          '@/types': './src/types',
          '@/constants': './src/constants',
        },
      },
    ],
  ],
};
