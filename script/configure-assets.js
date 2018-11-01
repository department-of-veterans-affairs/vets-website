/* eslint-disable no-param-reassign */

const watch = require('metalsmith-watch');
const environments = require('./constants/environments');
const webpackMetalsmithConnect = require('../config/webpack-metalsmith-connect');
const downloadAssets = require('./download-assets');
const addAssetHashes = require('./add-asset-hashes');

function configureAssets(smith, buildOptions) {
  const isContentDeployment = buildOptions['content-deployment'];
  const isDevBuild = [environments.DEVELOPMENT, environments.VAGOVDEV].includes(
    buildOptions.buildtype,
  );

  if (buildOptions.watch) {
    const watchPaths = {
      [`${buildOptions.contentRoot}/**/*`]: '**/*.{md,html}',
      [`${buildOptions.contentPagesRoot}/**/*`]: '**/*.{md,html}',
    };

    const watchMetalSmith = watch({ paths: watchPaths, livereload: true });

    smith.use(watchMetalSmith);
    smith.use(webpackMetalsmithConnect.watchAssets(buildOptions));
  } else {
    if (isContentDeployment) {
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
