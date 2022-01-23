module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: [
          '__labelImage',
          '__scanBarcode',
          '__scanQRCodes',
          '__recognizeText',
          '__scanFaces',
          '__scanCodes',
        ],
      },
    ],
  ],
};
