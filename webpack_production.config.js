var path = require('path');

var config = require ('./webpack.config');

config.output.path = path.join(__dirname, "_site_production/assets/js/generated");

module.exports = config;
