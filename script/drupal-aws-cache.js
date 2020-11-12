/* eslint-disable no-console */

/*
 * Script for creating and fetching cached sets of content from Drupal
 *
 * With no arguments, this script will create a cache file for vagovdev,
 * based on what's currently in your drupal cache
 *
 * Run with --fetch to pull content from Drupal
 *
 * Use --buildtype to set a build type to use
 */
const commandLineArgs = require('command-line-args');
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const https = require('https');
const fs = require('fs-extra');
const decompress = require('decompress');

const ENVIRONMENTS = require('../src/site/constants/environments');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'fetch', type: Boolean, defaultValue: false },
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
];
const cacheUrl = `https://s3-us-gov-west-1.amazonaws.com/vetsgov-website-builds-s3-upload/content`;
const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);
const cacheDirectory = path.join('.cache', options.buildtype, 'drupal');

// Load up the flags into `global` before requiring getDrupalCacheKey,
// which uses the flags from `global`.
//
// Setting the query flags to {} so they always evaluate to falsey
// when constructing the cache key. This means the query will be built
// the same way regardless of the query flag state. The query flag
// state _shouldn't_ matter when looking up the cache because it's
// saved in the cache itself in feature-flags.json.
require('../src/site/stages/build/drupal/load-saved-flags').useFlags({}, false);
const {
  getDrupalCacheKey,
} = require('../src/site/stages/build/drupal/utilities-drupal');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, response => {
        if (response.statusCode >= 300) {
          reject(
            new Error(`HTTP error fetching archive: ${response.statusCode}`),
          );
        } else {
          response.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }
      })
      .on('error', err => {
        fs.unlink(dest);
        reject(new Error(err.message));
      });
  });
}

async function fetchCache() {
  global.buildtype = options.buildtype;
  const cacheEnv =
    options.buildtype === ENVIRONMENTS.LOCALHOST
      ? ENVIRONMENTS.VAGOVDEV
      : options.buildtype;
  const cacheKey = await getDrupalCacheKey(cacheEnv);
  const fullCacheUrl = `${cacheUrl}/${cacheKey}.tar.bz2`;
  const downloadPath = path.join(cacheDirectory, `${cacheKey}.tar.bz2`);

  fs.ensureDirSync(cacheDirectory);

  try {
    await downloadFile(fullCacheUrl, downloadPath);
    await decompress(downloadPath, cacheDirectory);

    console.log(`Downloaded ${fullCacheUrl}`);
    console.log(`Cache stored in ${cacheDirectory}`);
  } catch (e) {
    console.log(
      `No cached content found for that environment and query: ${fullCacheUrl}`,
    );
  }
}

/**
 * Compresses everything in .cache/{buildtype}/drupal/ and puts it in
 *  .cache/content/{buildtype}_{query-hash}.tar.bz2
 */
async function createCacheFile() {
  global.buildtype = options.buildtype;
  const cacheOutput = path.join('.cache', 'content');
  const cacheEnv =
    options.buildtype === ENVIRONMENTS.LOCALHOST
      ? ENVIRONMENTS.VAGOVDEV
      : options.buildtype;
  const cacheKey = await getDrupalCacheKey(cacheEnv);
  const cachePath = `${cacheOutput}/${cacheKey}.tar.bz2`;

  fs.ensureDirSync(cacheOutput);

  const tarCmd = `tar -C ${cacheDirectory} -cf ${cachePath} .`;

  console.log('running tar cmd', tarCmd);

  const { stdout, stderr } = exec(tarCmd);

  if (stderr) {
    console.error(`Error compressing cache: ${stderr}`);
  } else {
    console.log(stdout);
    console.log(`Cache file created: ${cachePath}`);
  }
}

if (options.fetch) {
  fetchCache().catch(error => {
    console.error(`Error in fetchCache: ${error}`);
    process.exit(1);
  });
} else {
  createCacheFile().catch(error => {
    console.error(`Error in createCacheFile: ${error}`);
    process.exit(1);
  });
}
