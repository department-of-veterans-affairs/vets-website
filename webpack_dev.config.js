// TODO: Remove this whole file in favor of a build envrionment variable like
// used in definePlugin in webpack.config.js.

var path = require('path');

var config = require('./webpack.config');

config.output.path = path.join(__dirname, "_webpack/public/assets/js/generated");
config.devtool = '#cheap-module-eval-source-map';
config.entry = "./_webpack/public/fake-entry.js",

module.exports = config;
