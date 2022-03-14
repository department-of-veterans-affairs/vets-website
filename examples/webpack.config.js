const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = 'webpack-output';

// Dynamically find all the examples. Note: This only works for one level deep
// and a root file name of index.jsx.
const entries = fs
  .readdirSync(path.resolve(__dirname), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .filter((dirent) => dirent.name !== outputDirectory)
  .reduce(
    (compiledList, dirent) => ({
      ...compiledList,
      [dirent.name]: path.resolve(__dirname, `${dirent.name}/index.jsx`),
    }),
    {}
  );
entries.root = path.resolve(__dirname, 'index.jsx');

const config = {
  mode: 'development',
  entry: entries,
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: '[name]/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: {
      '@department-of-veterans-affairs/va-forms-system-core': path.resolve(
        __dirname,
        '../src'
      ),
      // So npm- / yarn-linked packages don't give us a hooks problem
      react: path.resolve(__dirname, '../node_modules/react/'),
    },
  },
  plugins: [new CleanWebpackPlugin()],
};

// Generate a separate HTML file per entry. Note: This only works one level
// deep. That is, `examples/path/to/my/deeply/nested/thing/index.jsx` won't
// generate the JS / HTML at that path.
Object.entries(entries).forEach(([name, indexPath]) => {
  config.plugins.push(
    new HtmlWebpackPlugin({
      chunks: [name],
      template: path.resolve(__dirname, 'template.html'),
      filename: name === 'root' ? 'index.html' : `${name}/index.html`,
    })
  );
});

module.exports = config;
