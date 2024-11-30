const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'auto', 
  },

  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8880,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    new ModuleFederationPlugin({
      name: 'app1', 
      filename: 'remoteEntry.js', 
      exposes: {
        './Button': './src/components/Button',
        './Header': './src/components/Header',
      },
      remotes: {
        app2: 'app2@http://localhost:8881/remoteEntry.js', 
      },
      shared: {
        react: {
          singleton: true, 
        },
        'react-dom': {
          singleton: true,
          eager: true,
        },
      },
    }),
  ],
};
