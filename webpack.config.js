const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const env = process.env.NODE_ENV === 'production' ? (
  new webpack.EnvironmentPlugin({ ...process.env })
) : (
  new Dotenv()
)

console.log(__dirname)

module.exports = webpackEnv => {
  const publicPath = webpackEnv.NODE_ENV === 'local' ? {
    publicPath: '/'
  } : {}
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve('.'),
      ...publicPath
    },
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.s(a|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        { test: /\.less$/i, loader: "less-loader" },
        { test: /\.(png|jpe?g|gif)$/i, use: 'file-loader' },
        // { test: /\.svg$/, use: ['babel-loader', '@svgr/webpack'] },
        { test: /\.svg$/, use: ['babel-loader', '@svgr/webpack', 'file-loader']}
        // { test: /\.svg$/, use: 'svg-url-loader'},
        // { test: /\.svg$/, use: 'svg-loader'}
        // {
        //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
        //   type: 'asset/resource',
        // }
      ]
    },
    devServer: {
      publicPath: '/',
      contentBase: path.resolve('src'),
      hot: true,
      open: true,
      port: 8000,
      watchContentBase: true,
      historyApiFallback: true
    },
    plugins: [
      new Dotenv({
        path: path.resolve(__dirname, '../.env')
      }),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body'
      }),
      env
    ]
  }
}
