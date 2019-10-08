/* eslint-disable no-param-reassign */

const watch = require('metalsmith-watch');
const environments = require('../../../constants/environments');
const assetSources = require('../../../constants/assetSources');
const webpackMetalsmithConnect = require('../webpack');
const downloadAssets = require('./download-assets');
const addAssetHashes = require('./add-asset-hashes');

function configureAssets(smith, buildOptions) {
  const assetSource = buildOptions['asset-source'];
  const isDevBuild = [environments.LOCALHOST, environments.VAGOVDEV].includes(
    buildOptions.buildtype,
  );

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
  } else {
    if (assetSource !== assetSources.LOCAL) {
      smith.use(downloadAssets(buildOptions), 'Download assets');
    } else {
      smith.use(
        webpackMetalsmithConnect.compileAssets(buildOptions),
        'Build Webpack assets',
      );
    }

    if (!isDevBuild) {
      smith.use(addAssetHashes(), 'Add asset hashes');
    }
  }
}

module.exports = configureAssets;
