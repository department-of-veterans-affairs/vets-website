// TODO: Remove this whole file in favor of a build envrionment variable like
// used in definePlugin in webpack.config.js.

var path = require('path');

var config = require('./webpack.config');

config.output.path = path.join(__dirname, "assets/js/generated/prod");
config.output.publicPath = "/assets/js/generated/prod/";
config.devtool = '#source-map';

module.exports = config;
