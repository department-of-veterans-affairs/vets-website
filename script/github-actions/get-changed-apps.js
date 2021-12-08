/* eslint-disable no-console */
const fs = require('fs');
const find = require('find');
const path = require('path');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/single-app-build.json');

/**
 * Gets the manifest of all apps in the root app folder that a file belongs to.
 *
 * @param {string} filePath - Relative file path.
 * @returns {Array} Application manifests.
 */
const getManifests = filePath => {
  const root = path.join(__dirname, '../..');
  const appDirectory = filePath.split('/')[2];
  const fullPath = path.join(root, `./src/applications/${appDirectory}`);

  return find
    .fileSync(/manifest\.(json|js)$/, fullPath)
    .map(file => JSON.parse(fs.readFileSync(file)));
};

/**
 * Gets the sliced manifest(s) of a file's root app folder. The app or
 * root app folder must be on the given allow list, otherwise returns null.
 *
 * @param {string} file - Relative file path.
 * @param {Object} allowList - Lists of entry names and root app paths to check against.
 * @returns {Array|null} Sliced manifests of apps that are allowed. Otherwise null.
 */
const getAllowedApps = (file, allowList) => {
  if (!file.startsWith('src/applications')) return null;

  const manifests = getManifests(file);
  const rootAppPath = `src/applications/${file.split('/')[2]}`;

  if (
    allowList.groupedAppsFolders.includes(rootAppPath) ||
    (manifests.length === 1 &&
      allowList.entryNames.includes(manifests[0].entryName))
  ) {
    return manifests.map(manifest => ({
      entryName: manifest.entryName,
      rootUrl: manifest.rootUrl,
    }));
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
  const outputTypeStrings = [];

  for (const file of files) {
    const allowedApps = getAllowedApps(file, config.allow);

    if (allowedApps) {
      allowedApps.forEach(app => {
        if (outputType === 'entry') {
          outputTypeStrings.push(app.entryName);
        } else if (outputType === 'folder') {
          outputTypeStrings.push(`src/applications/${file.split('/')[2]}`);
        } else if (outputType === 'url') {
          if (app.rootUrl) outputTypeStrings.push(app.rootUrl);
        } else throw new Error('Invalid output type specified.');
      });
    } else return '';
  }

  return [...new Set(outputTypeStrings)].join(',');
};

if (process.env.CHANGED_FILE_PATHS) {
  const changedFiles = process.env.CHANGED_FILE_PATHS.split(' ').filter(
    filePath => filePath.startsWith('src/applications'),
  );

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
