/* eslint-disable no-console */
const fs = require('fs');
const find = require('find');
const path = require('path');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/changed-apps-build.json');

/**
 * Gets the manifest of all apps in the root app folder that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {Object[]} Application manifests.
 */
const getManifests = filePath => {
  const root = path.join(__dirname, '../..');
  const rootAppFolder = filePath.split('/')[2];
  const fullAppPath = path.join(root, './src/applications', rootAppFolder);

  return find
    .fileSync(/manifest\.(json|js)$/, fullAppPath)
    .map(file => JSON.parse(fs.readFileSync(file)));
};

/**
 * Gets the sliced manifest(s) of a file's root app folder. The app's entry
 * name or root folder must be on the given allow list, otherwise returns null.
 *
 * @param {string} filePath - Relative file path.
 * @param {Object} allow - Lists of entry names and root app folders to check against.
 * @returns {Object[]|null} Sliced manifests of allowed apps. Otherwise null.
 */
const getAllowedApps = (filePath, allow) => {
  const appsDirectory = 'src/applications';

  if (!filePath.startsWith(appsDirectory)) return null;

  const rootAppFolder = filePath.split('/')[2];
  const rootAppPath = path.join(appsDirectory, rootAppFolder);
  const manifests = getManifests(filePath);

  const isAllowed =
    allow.rootAppFolders.includes(rootAppFolder) ||
    (manifests.length === 1 &&
      allow.entryNames.includes(manifests[0].entryName));

  if (isAllowed) {
    return manifests.map(({ entryName, rootUrl }) => ({
      entryName,
      rootUrl,
      rootPath: rootAppPath,
    }));
  }

  return null;
};

/**
 * Checks if a changed apps build is possible by confirming that all
 * files are from apps on an allow list. If so, returns a comma-delimited string
 * of app entry names, relative paths, or URLs; otherwise returns an empty string.
 *
 * @param {string[]} filePaths - An array of relative file paths.
 * @param {Object} config - The changed apps build config.
 * @param {string} outputType - Determines what app information should be returned.
 * @returns {string} A comma-delimited string of app entry names, relative paths or URLs.
 */
const getChangedAppsString = (filePaths, config, outputType = 'entry') => {
  const appStrings = [];

  for (const filePath of filePaths) {
    const allowedApps = getAllowedApps(filePath, config.allow);

    if (allowedApps) {
      allowedApps.forEach(app => {
        if (outputType === 'entry') {
          appStrings.push(app.entryName);
        } else if (outputType === 'folder') {
          appStrings.push(app.rootPath);
        } else if (outputType === 'url') {
          if (app.rootUrl) appStrings.push(app.rootUrl);
        } else throw new Error('Invalid output type specified.');
      });
    } else return '';
  }

  return [...new Set(appStrings)].join(',');
};

if (process.env.CHANGED_FILE_PATHS) {
  const changedFilePaths = process.env.CHANGED_FILE_PATHS.split(' ');

  const options = commandLineArgs([
    // Use the --output-type option to specify one of the following outputs:
    // 'entry': The entry names of the changed apps.
    // 'folder': The relative path of the changed apps root folders.
    // 'url': The root URLs of the changed apps.
    { name: 'output-type', type: String, defaultValue: 'entry' },
  ]);
  const outputType = options['output-type'];

  const changedAppsString = getChangedAppsString(
    changedFilePaths,
    changedAppsConfig,
    outputType,
  );

  console.log(changedAppsString);
}

module.exports = {
  getChangedAppsString,
};
