/* eslint-disable no-console */
const find = require('find');
const path = require('path');
const core = require('@actions/core');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/single-app-build.json');

const options = commandLineArgs([
  // Use the --app-folders option to get app directories. Entry names are the default.
  { name: 'app-folders', type: Boolean, defaultValue: false },
]);

const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ').filter(
  filePath => filePath.startsWith('src/applications'),
);

/**
 * Gets the entry name of the app that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {string} The entry name of an app.
 */
const getEntryName = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];
  const fullPath = path.join(root, `./src/applications/${appDirectory}`);

  const manifestFile = find
    .fileSync(/manifest\.(json|js)$/, fullPath)
    // eslint-disable-next-line import/no-dynamic-require
    .map(file => require(file))[0];

  return manifestFile.entryName;
};

/**
 * Gets either the entry name or relative path of the app
 * that a file belongs to. The app must be in the given allow list,
 * otherwise returns null.
 *
 * @param {string} file - Relative file path.
 * @param {string[]} allowList - A list of application entry names.
 * @returns {string|null} Either the entry name or relative path app of an app. Otherwise null.
 */
const getAllowedApp = (file, allowList) => {
  const entryName = getEntryName(file);

  if (file.startsWith('src/applications') && allowList.includes(entryName)) {
    // Return app path when 'app-folders' option is used
    if (options['app-folders']) {
      const appFolderName = file.split('/')[2];
      return `src/applications/${appFolderName}`;
    }
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
 * @returns {string} A comma-delimited string of either app entry names or relative paths.
 */
const getChangedAppsString = (files, config) => {
  const allowedApps = [];

  for (const file of files) {
    const allowedApp = getAllowedApp(file, config.allow);
    if (allowedApp) {
      allowedApps.push(allowedApp);
    } else {
      return '';
    }
  }

  return [...new Set(allowedApps)].join(',');
};

core.exportVariable(
  'CHANGED_APPS',
  getChangedAppsString(changedFiles, changedAppsConfig),
);
