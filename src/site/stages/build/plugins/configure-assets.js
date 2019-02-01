/* eslint-disable no-param-reassign */

const watch = require('metalsmith-watch');
const environments = require('../../../constants/environments');
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

    smith.use(watchMetalSmith);
    smith.use(webpackMetalsmithConnect.watchAssets(buildOptions));
  } else {
    if (assetSource !== null) {
      smith.use(downloadAssets(buildOptions));
    } else {
      smith.use(webpackMetalsmithConnect.compileAssets(buildOptions));
    }

    if (!isDevBuild) {
      smith.use(addAssetHashes(buildOptions));
    }
  }
}

module.exports = configureAssets;
