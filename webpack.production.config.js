const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  mode: 'production',
  entry: {
    "index": __dirname + '/src/js/index.js',
    "warmup": __dirname + '/src/js/warmup.js',
    "entry": __dirname + '/src/js/entry.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
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
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
          }
        ],
        exclude: '/node_modules/'
      },
      //生产环境用
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        }),
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      title: 'Hot Module Replacement',
      template: './src/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: './warmup.html',
      title: 'Hot Module Replacement',
      template: './src/warmup.html',
      chunks: ['warmup']
    }),
    new HtmlWebpackPlugin({
      filename: './entry.html',
      title: 'Hot Module Replacement',
      template: './src/entry.html',
      chunks: ['entry']
    }),
    new HtmlWebpackPlugin({
      filename: './christmas.html',
      title: 'Hot Module Replacement',
      template: './src/christmas.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: './newYear.html',
      title: 'Hot Module Replacement',
      template: './src/newYear.html',
      chunks: ['index']
    }),
    new ExtractTextPlugin({
     filename: './[name].css'
    })
  ],

};

module.exports = config;
