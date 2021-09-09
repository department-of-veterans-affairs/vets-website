/* eslint-disable no-console */
require('core-js/stable');
require('regenerator-runtime/runtime');

// System requires
const path = require('path');
const webpack = require('webpack');

// Require Webpack plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

// Require local helpers
const { generateHtmlFiles } = require('./helpers/generate-html-files');
const { getEntryPoints } = require('./helpers/get-entry-points');
const { getEntryManifests } = require('./helpers/get-entry-manifests');

// Local data and settings
const BUCKETS = require('../../src/site/constants/buckets');
const ENVIRONMENTS = require('../../src/site/constants/environments');
const { setEntryFiles } = require('./settings/set-entry-files');
const { setBaseConfig } = require('./settings/set-base-config');

// Cached variables
const { VAGOVSTAGING, VAGOVPROD, LOCALHOST } = ENVIRONMENTS;

module.exports = async (env = {}) => {
  const { buildtype = LOCALHOST } = env;
  const buildOptions = {
    api: '',
    buildtype,
    host: LOCALHOST,
    port: 3001,
    scaffold: false,
    watch: false,
    destination: buildtype,
    ...env,
  };

  const isOptimizedBuild = [VAGOVSTAGING, VAGOVPROD].includes(buildtype);
  const apps = getEntryPoints(buildOptions.entry);
  const entryFiles = Object.assign({}, apps, setEntryFiles);

  // enable css sourcemaps for all non-localhost builds
  // or if build options include local-css-sourcemaps or entry
  const enableCSSSourcemaps =
    buildtype !== LOCALHOST ||
    buildOptions['local-css-sourcemaps'] ||
    !!buildOptions.entry;

  const buildPath = path.resolve(
    __dirname,
    '../../',
    'build',
    buildOptions.destination,
  );

  // Generate base configuration options
  const baseConfig = setBaseConfig(
    buildOptions,
    buildPath,
    buildtype,
    entryFiles,
    isOptimizedBuild,
    enableCSSSourcemaps,
  );

  const scaffoldedHtml = await generateHtmlFiles(buildPath);
  baseConfig.plugins.push(...scaffoldedHtml);

  if (!buildOptions.watch) {
    baseConfig.plugins.push(
      new WebpackManifestPlugin({
        fileName: 'file-manifest.json',
        filter: ({ isChunk }) => isChunk,
      }),
    );
  }

  if (buildOptions.open) {
    baseConfig.devServer.open = true;
    baseConfig.devServer.openPage =
      buildOptions.openTo || buildOptions.entry
        ? // Assumes the first in the list has a rootUrl
          getEntryManifests(buildOptions.entry)[0].rootUrl
        : '';
  }

  if (isOptimizedBuild) {
    const bucket = BUCKETS[buildtype];

    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        append: `\n//# sourceMappingURL=${bucket}/generated/[url]`,
        filename: '[file].map',
      }),
    );

    baseConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
    baseConfig.mode = 'production';
  } else {
    baseConfig.devtool = '#eval-source-map';

    // The eval-source-map devtool doesn't seem to work for CSS, so we
    // add a separate plugin for CSS source maps.
    baseConfig.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        test: /\.css$/,
      }),
    );
  }

  if (buildOptions.analyzer) {
    baseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
      }),
    );
  }

  return baseConfig;
};
