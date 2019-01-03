const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  mode: 'development',
  entry: {
    "mock": __dirname + '/src/js/mock.js',
    "index": __dirname + '/src/js/index.js'
   
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  devtool: 'inline-source-map',
  devServer: {
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                }
              }]
            ]
          }
        },
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ],
        exclude: '/node_modules/'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true
            },
            
          }
        ],
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      title: 'Hot Module Replacement',
      template: './src/index.html',
      chunks: ['mock','index']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
     filename: './[name].css'
    })
  ],

};

module.exports = config;
