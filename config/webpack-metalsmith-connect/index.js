
const path = require('path');
const {
  getAppManifests,
  getWebpackEntryPoints
} = require('../manifest-helpers');

const convertPathsToRelative = require('./convert-paths-to-relative');
const {
  webpackPlugin,
  webpackDevServerPlugin
} = require('./metalsmith-webpack');

const generateWebpackConfig = require('../webpack.config');
const generateWebpackDevConfig = require('../webpack.dev.config');

const manifests = getAppManifests(path.join(__dirname, '../..'));

function getEntryPoints(buildOptions) {
  let manifestsToBuild = manifests;
  if (buildOptions.entry) {
    const entryNames = buildOptions.entry.split(',').map(name => name.trim());
    manifestsToBuild = manifests
      .filter(manifest => entryNames.includes(manifest.entryName));
  }

  return getWebpackEntryPoints(manifestsToBuild);
}

function compileAssets(buildOptions) {
  return (files, metalsmith, done) => {
    const convertPathsMiddleware = convertPathsToRelative(buildOptions);
    const apps = getEntryPoints(buildOptions);
    const webpackConfig = generateWebpackConfig(buildOptions, apps);
    const webpackMiddleware = webpackPlugin(webpackConfig);

    webpackMiddleware(files, metalsmith, (err) => {
      if (err) throw err;
      convertPathsMiddleware(files, metalsmith, done);
    });
  };
}

function watchAssets(buildOptions) {
  return (files, metalsmith, done) => {
    const convertPathsMiddleware = convertPathsToRelative(buildOptions);
    const apps = getEntryPoints(buildOptions);
    const webpackConfig = generateWebpackConfig(buildOptions, apps);
    const webpackDevServerConfig = generateWebpackDevConfig(buildOptions);
    const webpackMiddleware = webpackDevServerPlugin(webpackConfig, webpackDevServerConfig);

    webpackMiddleware(files, metalsmith, (err) => {
      if (err) throw err;
      convertPathsMiddleware(files, metalsmith, done);
    });
  };
}

module.exports = {
  compileAssets,
  watchAssets
};
