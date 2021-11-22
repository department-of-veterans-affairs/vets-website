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
 * @returns {string} The entry name of an app.
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
 * Gets either the entry name or relative path of the app
 * that a file belongs to. The app must be in the given allow list,
 * otherwise returns null.
 *
 * @param {string} file - Relative file path.
 * @param {string[]} allowList - A list of application entry names.
 * @param {string} outputType - Determines whether the app's path or entry name should be returned.
 * @returns {string|null} Either the entry name or relative path app of an app. Otherwise null.
 */
const getAllowedApp = (file, allowList, outputType = 'entry') => {
  if (!file.startsWith('src/applications')) return null;

  const manifest = getManifest(file);
  const entryName = manifest?.entryName;

  if (allowList.includes(entryName)) {
    // Return either app path, entry name, or root URL depending on output type
    if (outputType === 'folder') {
      const appFolderName = file.split('/')[2];
      return `src/applications/${appFolderName}`;
    } else if (outputType === 'url') return manifest?.rootUrl;
    return entryName;
  }

  return null;
};

/**
 * Checks if an only changed apps build is possible by confirming that all
 * files are from apps on an allow list. If so, returns a comma-delimited
 * list of app entry names or relative paths. If not, returns an empty string.
 *
 * @param {string[]} files - An array of relative file paths.
 * @param {Object} config - The changed apps build config.
 * @param {string} outputType - Determines whether app paths or entries should be returned.
 * @returns {string} A comma-delimited string of either app entry names or relative paths.
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
  // Filter changed files for testing
  const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ').filter(
    filePath => filePath.startsWith('src/applications'),
  );

  const options = commandLineArgs([
    // Use the --output-type option to specify output type.
    // 'entry': The entry names of the changed apps.
    // 'folder': The relative path of the changed apps root folders.
    // 'url': The root URL of the changed apps.
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
