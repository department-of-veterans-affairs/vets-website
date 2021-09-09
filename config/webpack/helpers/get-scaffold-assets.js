/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

/**
 * Creates a mapping of scaffold asset filenames to file contents.
 * Tries first to read from a local content-build by default and
 * falls back to downloading from a remote content-build.
 *
 * @return {Object} - Map of scaffold asset filenames to file contents.
 */
async function getScaffoldAssets() {
  const LOCAL_CONTENT_BUILD_ROOT = '../content-build';

  const REMOTE_CONTENT_BUILD_ROOT =
    'https://raw.githubusercontent.com/department-of-veterans-affairs/content-build/master';

  const loadAsset = async contentBuildPath => {
    const filename = path.basename(contentBuildPath);
    const localPath = path.join(LOCAL_CONTENT_BUILD_ROOT, contentBuildPath);

    if (fs.existsSync(localPath)) {
      console.log(`Found local asset at ${localPath}.`);
      return [filename, fs.readFileSync(localPath)];
    }

    const fileUrl = new URL(
      path.join(REMOTE_CONTENT_BUILD_ROOT, contentBuildPath),
    );

    console.log(`Downloading asset from ${fileUrl.toString()}.`);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${fileUrl}.\n\n${response.status}: ${
          response.statusText
        }`,
      );
    }

    const fileContents = await response.text();
    console.log(`Successfully downloaded ${filename}.`);
    return [filename, fileContents];
  };

  const inlineScripts = [
    'incompatible-browser.js',
    'record-event.js',
    'static-page-widgets.js',
  ].map(filename => path.join('src/site/assets/js', filename));

  const appRegistry = path.join('src/applications', 'registry.json');

  const loadedAssets = await Promise.all(
    [...inlineScripts, appRegistry].map(loadAsset),
  );

  return Object.fromEntries(loadedAssets);
}

module.exports.getScaffoldAssets = getScaffoldAssets;
