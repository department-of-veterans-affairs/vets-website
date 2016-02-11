// TODO: Remove this whole file in favor of a build envrionment variable like
// used in definePlugin in webpack.config.js.

var path = require('path');

var config = require('./webpack.config');

config.output.path = path.join(__dirname, "_site_production/assets/js/generated");

module.exports = config;
