const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Establece el modo de compilación
  mode: 'development',

  // Punto de entrada de tu aplicación
  entry: './src/index.js',

  // Configuración de salida
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Configuración del servidor de desarrollo
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8880,
    historyApiFallback: true,
  },

  // Configuración de módulos y loaders
  module: {
    rules: [
      {
        // Aplicar babel-loader a archivos .js y .jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // Cargar archivos CSS
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Cargar imágenes y archivos
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },

  // Resolver extensiones de archivo
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
