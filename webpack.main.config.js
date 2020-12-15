const path = require('path');
const rules = require('./webpack.rules');
const CopyPlugin = require('copy-webpack-plugin');

function srcPaths(src) {
  return path.join(__dirname, src);
}

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  target: 'electron-main',
  entry: './src/main/main.tsx',
  module: {
    rules
  },
  plugins: [
    new CopyPlugin(
      [
          {from: path.resolve(__dirname, 'public/favicon.ico'), to: ''}
          ]
    ),
  ],
  resolve: {
    alias: {
      '@main': srcPaths('src/main'),
      '@models': srcPaths('src/models'),
      '@renderer': srcPaths('src/renderer'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  }
};