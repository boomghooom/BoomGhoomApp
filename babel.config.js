module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/presentation/components',
            '@screens': './src/presentation/screens',
            '@navigation': './src/presentation/navigation',
            '@hooks': './src/presentation/hooks',
            '@theme': './src/presentation/theme',
            '@domain': './src/domain',
            '@data': './src/data',
            '@assets': './assets',
            '@utils': './src/utils',
            '@store': './src/presentation/store',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

