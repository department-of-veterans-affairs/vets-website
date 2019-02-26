/* eslint-disable no-param-reassign */

const fs = require('fs');
const path = require('path');
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

    smith.use(watchMetalSmith);
    smith.use(webpackMetalsmithConnect.watchAssets(buildOptions));
  } else {
    if (assetSource !== assetSources.LOCAL) {
      smith.use(downloadAssets(buildOptions));
      smith.use((files, metalsmith, done) => {
        metalsmith.originalManifest = JSON.parse(
          fs.readFileSync(
            path.join(
              __dirname,
              `../../../../../build/${
                buildOptions.buildtype
              }/generated/file-manifest.json`,
            ),
            'utf8',
          ),
        );
        done();
      });
      smith.use(webpackMetalsmithConnect.compileAssets(buildOptions));
      smith.use((files, metalsmith, done) => {
        const newManifest = JSON.parse(
          fs.readFileSync(
            path.join(
              __dirname,
              `../../../../../build/${
                buildOptions.buildtype
              }/generated/file-manifest.json`,
            ),
            'utf8',
          ),
        );
        fs.writeFileSync(
          path.join(
            __dirname,
            `../../../../../build/${
              buildOptions.buildtype
            }/generated/file-manifest.json`,
          ),
          JSON.stringify(
            Object.assign({}, metalsmith.originalManifest, newManifest),
          ),
        );
        done();
      });
    } else {
      smith.use(webpackMetalsmithConnect.compileAssets(buildOptions));
    }

    if (!isDevBuild) {
      smith.use(addAssetHashes(buildOptions));
    }
  }
}

module.exports = configureAssets;
