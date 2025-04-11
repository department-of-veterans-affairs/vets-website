/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');

const changedAppsConfig = require('../../config/changed-apps-build.json');

/**
 * Helper function to chunk an array.
 *
 * @param {Array} array - The array to chunk.
 * @param {number} chunkSize - The size of each chunk.
 * @returns {Array[]} An array of chunks.
 */
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Gets the manifests of all apps in the root app folder that a file belongs to.
 *
 * @param {string} filePath - The file path.
 * @returns {Object[]} The manifests of the apps.
 */
function getManifests(filePath) {
  const root = path.join(__dirname, '../..');
  const rootAppFolderName = filePath.split('/')[2];
  const fullAppPath = path.join(root, './src/applications', rootAppFolderName);

  if (!fs.existsSync(fullAppPath)) return [];

  return fs
    .readdirSync(fullAppPath)
    .filter(file => file.match(/manifest\.(json|js)$/))
    .map(file => JSON.parse(fs.readFileSync(path.join(fullAppPath, file))));
}

/**
 * Gets the manifests of allowed apps for a given file path.
 *
 * @param {string} filePath - The file path.
 * @param {Object[]} allowedApps - The list of allowed apps.
 * @returns {Object[]} The manifests of allowed apps.
 */
function getAllowedApps(filePath, allowedApps) {
  const appsDirectory = 'src/applications';

  if (!filePath.startsWith(appsDirectory)) return [];

  const manifests = getManifests(filePath);
  const rootAppFolderName = filePath.split('/')[2];
  const allowedApp = allowedApps.find(
    app => app.rootFolder === rootAppFolderName,
  );

  if (allowedApp) {
    const { slackGroup, continuousDeployment } = allowedApp;
    return manifests.map(({ entryName, rootUrl }) => ({
      entryName,
      rootUrl,
      rootPath: path.join(appsDirectory, rootAppFolderName),
      slackGroup,
      continuousDeployment,
    }));
  }

  return [];
}

/**
 * Gets the changed apps as a delimited string or writes them to chunked files.
 *
 * @param {string[]} filePaths - A list of changed file paths.
 * @param {Object} config - The changed apps configuration.
 * @param {string} outputType - The type of output to generate.
 * @param {string} delimiter - The delimiter for the output string.
 * @param {boolean} chunkOutput - Whether to chunk the output into files.
 * @returns {string|null} A delimited string of changed apps (if not chunking).
 */
function getChangedAppsString(
  filePaths,
  config,
  outputType = 'entry',
  delimiter = ' ',
  chunkOutput = false,
) {
  const appStrings = [];

  for (const filePath of filePaths) {
    const allowedApps = getAllowedApps(filePath, config.apps);

    if (allowedApps.length) {
      allowedApps.forEach(app => {
        if (outputType === 'entry') {
          appStrings.push(app.entryName);
        } else if (outputType === 'folder') {
          appStrings.push(app.rootPath);
        } else if (outputType === 'slack-group') {
          if (app.slackGroup) appStrings.push(app.slackGroup);
        } else if (outputType === 'url') {
          if (app.rootUrl) appStrings.push(app.rootUrl);
        } else throw new Error('Invalid output type specified.');
      });
    }
  }

  const uniqueAppStrings = [...new Set(appStrings)];

  if (chunkOutput) {
    const chunkSize = 100; // Define the chunk size
    const chunks = chunkArray(uniqueAppStrings, chunkSize);

    chunks.forEach((chunk, index) => {
      const fileName = `changed_apps_chunk_${index + 1}.txt`;
      fs.writeFileSync(fileName, chunk.join(delimiter), 'utf8');
      console.log(`Chunk ${index + 1} written to ${fileName}`);
    });

    console.log(`Total chunks created: ${chunks.length}`);
    return null; // No single string output when chunking
  }

  return uniqueAppStrings.join(delimiter);
}

// Main script logic
if (process.env.CHANGED_FILE_PATHS) {
  const changedFilePaths = process.env.CHANGED_FILE_PATHS.split(' ');

  const options = commandLineArgs([
    { name: 'output-type', type: String, defaultValue: 'entry' },
    { name: 'delimiter', alias: 'd', type: String, defaultValue: ' ' },
    { name: 'chunk-output', type: Boolean, defaultValue: false },
  ]);

  const result = getChangedAppsString(
    changedFilePaths,
    changedAppsConfig,
    options['output-type'],
    options.delimiter,
    options['chunk-output'],
  );

  if (result) {
    console.log(result);
  }
}

module.exports = {
  getChangedAppsString,
};
