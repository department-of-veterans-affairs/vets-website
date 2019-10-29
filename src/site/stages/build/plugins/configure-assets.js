/* eslint-disable no-param-reassign */

const watch = require('metalsmith-watch');
const assetSources = require('../../../constants/assetSources');
const webpackMetalsmithConnect = require('../webpack');
const downloadAssets = require('./download-assets');

function configureAssets(smith, buildOptions) {
  const assetSource = buildOptions['asset-source'];

  if (buildOptions.watch) {
    const watchMetalSmith = watch({
      paths: buildOptions.watchPaths,
      livereload: true,
    });

    smith.use(watchMetalSmith, 'Watch Metalsmith');
    smith.use(
      webpackMetalsmithConnect.watchAssets(buildOptions),
      'Build and watch Webpack assets',
    );
  } else if (assetSource !== assetSources.LOCAL) {
    smith.use(downloadAssets(buildOptions), 'Download assets');
  } else {
    smith.use(
      webpackMetalsmithConnect.compileAssets(buildOptions),
      'Build Webpack assets',
    );
  }
}

module.exports = configureAssets;
