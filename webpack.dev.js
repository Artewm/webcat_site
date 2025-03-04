const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { type } = require('os');

module.exports = {
  mode: 'development',
  entry: {
    filename: path.resolve(__dirname, 'src/index.js') // путь на входной файл
  },

  output: {
    path: path.resolve(__dirname, 'dist'), // путь на выходной файл
    filename: 'index.js', // Имя выходного файла сборки
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.(mov|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.(usdz|glb)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'models/[name][ext]'
        }
      },
      {
        test: /\.(ttf|woff2|woff|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },

  devServer: {
    port: 25565,
    host: '0.0.0.0',
    compress: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist')
    },
    open: true,
  }
};