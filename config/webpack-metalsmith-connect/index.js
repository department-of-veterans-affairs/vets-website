const path = require('path');
const {
  getAppManifests,
  getWebpackEntryPoints,
} = require('../manifest-helpers');

const convertPathsToRelative = require('./convert-paths-to-relative');
const {
  webpackPlugin,
  webpackDevServerPlugin,
} = require('./metalsmith-webpack');

const generateWebpackConfig = require('../webpack.config');
const generateWebpackDevConfig = require('../webpack.dev.config');

const manifests = getAppManifests(path.join(__dirname, '../..'));

function getEntryPoints(buildOptions) {
  let manifestsToBuild = manifests;
  if (buildOptions.entry) {
    const entryNames = buildOptions.entry.split(',').map(name => name.trim());
    manifestsToBuild = manifests.filter(manifest =>
      entryNames.includes(manifest.entryName),
    );
  }

  return getWebpackEntryPoints(manifestsToBuild);
}

function compileAssets(buildOptions) {
  let compileMiddleware = null;
  let convertPathsMiddleware = null;

  return (files, metalsmith, done) => {
    if (!compileMiddleware) {
      const apps = getEntryPoints(buildOptions);
      const webpackConfig = generateWebpackConfig(buildOptions, apps);
      compileMiddleware = webpackPlugin(webpackConfig);
      convertPathsMiddleware = convertPathsToRelative(buildOptions);
    }

    compileMiddleware(files, metalsmith, err => {
      if (err) throw err;
      convertPathsMiddleware(files, metalsmith, done);
    });
  };
}

function watchAssets(buildOptions) {
  let devServerMiddleware = null;
  let convertPathsMiddleware = null;

  return (files, metalsmith, done) => {
    if (!devServerMiddleware) {
      const apps = getEntryPoints(buildOptions);
      const webpackConfig = generateWebpackConfig(buildOptions, apps);
      const webpackDevServerConfig = generateWebpackDevConfig(buildOptions);
      devServerMiddleware = webpackDevServerPlugin(
        webpackConfig,
        webpackDevServerConfig,
      );
      convertPathsMiddleware = convertPathsToRelative(buildOptions);
    }

    devServerMiddleware(files, metalsmith, err => {
      if (err) throw err;
      convertPathsMiddleware(files, metalsmith, done);
    });
  };
}

module.exports = {
  compileAssets,
  watchAssets,
};
