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
const {
  getDrupalCacheKey,
} = require('../src/site/stages/build/drupal/utilities-drupal');

const defaultBuildtype = ENVIRONMENTS.LOCALHOST;
const COMMAND_LINE_OPTIONS_DEFINITIONS = [
  { name: 'fetch', type: Boolean, defaultValue: false },
  { name: 'buildtype', type: String, defaultValue: defaultBuildtype },
  { name: 'unexpected', type: String, multile: true, defaultOption: true },
];
const cacheUrl = `https://s3-us-gov-west-1.amazonaws.com/vetsgov-website-builds-s3-upload/content`;

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

async function fetchCache(options) {
  global.buildtype = options.buildtype;
  const cacheDirectory = path.join('.cache', options.buildtype, 'drupal');
  const cacheEnv =
    options.buildtype === ENVIRONMENTS.LOCALHOST
      ? ENVIRONMENTS.VAGOVDEV
      : options.buildtype;
  const cacheKey = getDrupalCacheKey(cacheEnv);
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

async function createCacheFile(options) {
  global.buildtype = options.buildtype;
  const cacheDirectory = path.join('.cache', options.buildtype, 'drupal');
  const cacheOutput = path.join('.cache', 'content');
  const cacheEnv =
    options.buildtype === ENVIRONMENTS.LOCALHOST
      ? ENVIRONMENTS.VAGOVDEV
      : options.buildtype;
  const cachePath = `${cacheOutput}/${getDrupalCacheKey(cacheEnv)}.tar.bz2`;

  fs.ensureDirSync(cacheOutput);

  const { stdout, stderr } = await exec(
    `tar -C ${cacheDirectory} -cf ${cachePath} .`,
  );

  if (stderr) {
    console.error(`Error compressing cache: ${stderr}`);
  } else {
    console.log(stdout);
    console.log(`Cache file created: ${cachePath}`);
  }
}

const options = commandLineArgs(COMMAND_LINE_OPTIONS_DEFINITIONS);

if (options.fetch) {
  fetchCache(options);
} else {
  createCacheFile(options);
}
