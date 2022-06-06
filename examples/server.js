/* eslint-disable */
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const history = require('connect-history-api-fallback');
const devMiddleware = require('webpack-dev-middleware');
const hotReload = require('webpack-hot-middleware');

const app = express();
const port = 3000;
const compiler = webpack(config);

app.use(history());
app.use(devMiddleware(compiler, 
  { 
    publicPath: config.output.publicPath
  }
));
app.use(hotReload(compiler));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
