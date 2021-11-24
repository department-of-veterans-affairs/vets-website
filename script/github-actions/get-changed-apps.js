/* eslint-disable no-console */
const fs = require('fs');
const find = require('find');
const path = require('path');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/single-app-build.json');

/**
 * Gets the manifest object of the app that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {Object} Application manifest.
 */
const getManifest = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];
  const fullPath = path.join(root, `./src/applications/${appDirectory}`);

  return find
    .fileSync(/manifest\.(json|js)$/, fullPath)
    .map(file => JSON.parse(fs.readFileSync(file)))[0];
};

/**
 * Gets the entry name, relative path, or URL of the app that a file belongs to.
 * The app must be in the given allow list, otherwise returns null.
 *
 * @param {string} file - Relative file path.
 * @param {string[]} allowList - A list of application entry names.
 * @param {string} outputType - Determines what app information should be returned.
 * @returns {string|null} The app information specified in the output type. Otherwise null.
 */
const getAllowedApp = (file, allowList, outputType = 'entry') => {
  if (!file.startsWith('src/applications')) return null;

  const manifest = getManifest(file);
  const entryName = manifest?.entryName;

  if (allowList.includes(entryName)) {
    // Return the entry name, folder path, or root URL depending on the output type
    if (outputType === 'entry') {
      return entryName;
    } else if (outputType === 'folder') {
      const appFolderName = file.split('/')[2];
      return `src/applications/${appFolderName}`;
    } else if (outputType === 'url') {
      return manifest?.rootUrl;
    } else throw new Error('Invalid output type specified.');
  }

  return null;
};

/**
 * Checks if a changed apps build is possible by confirming that all
 * files are from apps on an allow list. If so, returns a comma-delimited list
 * of app entry names, relative paths, or URLs. If not, returns an empty string.
 *
 * @param {string[]} files - An array of relative file paths.
 * @param {Object} config - The changed apps build config.
 * @param {string} outputType - Determines what app information should be returned.
 * @returns {string} A comma-delimited string of app entry names, relative paths or URLs.
 */
const getChangedAppsString = (files, config, outputType = 'entry') => {
  const allowedApps = [];

  for (const file of files) {
    const allowedApp = getAllowedApp(file, config.allow, outputType);
    if (allowedApp) {
      allowedApps.push(allowedApp);
    } else {
      return '';
    }
  }

  return [...new Set(allowedApps)].join(',');
};

if (process.env.CHANGED_FILE_PATHS) {
  const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ');

  const options = commandLineArgs([
    // Use the --output-type option to specify one of the following outputs:
    // 'entry': The entry names of the changed apps.
    // 'folder': The relative path of the changed apps root folders.
    // 'url': The root URLs of the changed apps.
    { name: 'output-type', type: String, defaultValue: 'entry' },
  ]);
  const outputType = options['output-type'];

  const changedAppsString = getChangedAppsString(
    changedFiles,
    changedAppsConfig,
    outputType,
  );

  console.log(changedAppsString);
}

module.exports = {
  getChangedAppsString,
};
