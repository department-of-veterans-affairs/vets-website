
const path = require('path');
const {
  getAppManifests,
  getWebpackEntryPoints
} = require('./manifest-helpers');

const convertPathsToRelative = require('./convert-paths-to-relative');
const {
  webpackPlugin,
  webpackDevServerPlugin
} = require('./metalsmith-webpack').webpackPlugin;

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

function connectToMetalsmith(webpackMiddleware) {
  const convertPathsMiddleware = convertPathsToRelative();
  return (files, metalsmith, done) => {
    webpackMiddleware(files, metalsmith, (err) => {
      if (err) throw err;
      convertPathsMiddleware(files, metalsmith, done);
    });
  };
}

function compileAssets(buildOptions) {
  const apps = getEntryPoints();
  const webpackConfig = generateWebpackConfig(buildOptions, apps);
  const webpackMiddleware = webpackPlugin(webpackConfig);
  return connectToMetalsmith(webpackMiddleware);
}

function watchAssets(buildOptions) {
  const apps = getEntryPoints();
  const webpackConfig = generateWebpackConfig(buildOptions, apps);
  const webpackDevServerConfig = generateWebpackDevConfig(buildOptions, manifests);
  const webpackMiddleware = webpackDevServerPlugin(webpackConfig, webpackDevServerConfig);
  return connectToMetalsmith(webpackMiddleware);
}

module.exports = {
  compileAssets,
  watchAssets
};
