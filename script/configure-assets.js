/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const fetch = require('node-fetch');
const watch = require('metalsmith-watch');
const environments = require('./constants/environments');
const buckets = require('./constants/buckets');
const webpackMetalsmithConnect = require('../config/webpack-metalsmith-connect');
const addAssetHashes = require('./add-asset-hashes');

function downloadAssets(buildOptions) {
  return async (files, smith, done) => {
    const bucket = buckets[buildOptions.buildtype];
    const fileManifestPath = 'generated/file-manifest.json';
    const fileManifestRequest = await fetch(`${bucket}/${fileManifestPath}`);
    const fileManifest = await fileManifestRequest.json();

    files[fileManifestPath] = {
      contents: new Buffer(fileManifest),
    };

    let entryNames = Object.keys(fileManifest);
    if (buildOptions.entry) {
      const designatedEntries = buildOptions.entry;
      entryNames = entryNames.filter(entryName =>
        designatedEntries.includes(entryName),
      );
    }

    const downloads = entryNames.map(async entryName => {
      let bundleFileName = fileManifest[entryName];
      const bundleUrl = `${bucket}${bundleFileName}`;
      const bundleRequest = await fetch(bundleUrl);

      if (!bundleRequest.ok) {
        console.error(`Failed to download asset: ${bundleUrl}`);
        return;
      }

      if (bundleFileName.startsWith('/'))
        bundleFileName = bundleFileName.slice(1);

      files[bundleFileName] = {
        contents: await bundleRequest.arrayBuffer(),
      };

      console.log(`Successfully downloaded asset: ${bundleUrl}`);
    });

    await downloads;
    done();
  };
}

function configureAssets(buildOptions) {
  let alreadyRegistered = false;

  return (files, smith, done) => {
    if (alreadyRegistered) {
      done();
      return;
    }

    const isContentDeployment = buildOptions['content-deployment'];
    const isDevBuild = [
      environments.DEVELOPMENT,
      environments.VAGOVDEV,
    ].includes(buildOptions.buildtype);

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

      if (!isDevBuild) smith.use(addAssetHashes(buildOptions));
    }

    alreadyRegistered = true;
    done();
  };
}

module.exports = configureAssets;
