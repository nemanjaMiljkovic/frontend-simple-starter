/*eslint-disable*/
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Sprite = require('webpack-spritesmith');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const modernizrFeatures = [
  // 'css/flexbox',
  // 'canvas',
];


const config = {
  entry: {
    // vendors: [],
    bundle: './app/src/js/index.js'
  },
  output: {
    path: path.join(__dirname, 'app', 'build'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: process.env.NODE_ENV === 'production' ? true : false,
                sourceMap: process.env.NODE_ENV === 'production' ? true : false,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                require('precss'),
                require('autoprefixer'),
                require('postcss-uncss')({
                  html: ['app/index.html'],
                }),
                require('postcss-sprites')({
                  spritePath: './app/src/assets/sprites/'
                }),
              ],
                parser: require('postcss-scss'),
              }
            }
          ],
        }),
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        use: 'file-loader?name=i/[hash].[ext]'
      },

    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new Sprite({
      src: {
        cwd: path.resolve(__dirname, 'app/src/assets/images/'),
        glob: '*.png',
      },
      target: {
        image: path.resolve('app/src/assets/sprites/sprite.png'),
        css: path.resolve('app/src/assets/sprites/_sprite.css'),
      }
    }),
    new HtmlWebpackPlugin({
        template: 'app/index.html',
        minify: process.env.NODE_ENV === 'production' ? {
          collapseWhitespace: true
        } : false
      }),
  ],
}

if(modernizrFeatures.length > 0) {
  config.plugins.push(
    new ModernizrWebpackPlugin({
      'filename': 'modernizr',
      'minify': 'true',
      'options': [
        'setClasses'
      ],
      'feature-detects': modernizrFeatures
    })
  )
}

if(config.entry.vendors) {
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'manifest'],
    })
  )
}

if(process.env.NODE_ENV !== 'production') {
  config.devServer = {
    contentBase: path.join(__dirname, 'app'),
    port: 3000,
    open: true,
  }
}







module.exports = config;
