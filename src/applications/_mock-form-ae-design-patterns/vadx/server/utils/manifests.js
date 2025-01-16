const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const paths = require('./paths');

/**
 * @typedef {Object} ManifestFile
 * @property {string} path - file path to the manifest.json
 * @property {string} entryName - name of the entry file
 * @property {string} rootUrl - root url of the app
 * @property {string} appName - name of the app
 * @property {string} [productId] - product id of the app
 */

/** @type {ManifestFile[]} */
let _cachedManifests = [];

/**
 * Searches a directory for manifest.json files
 * @param {string} dir - Dir path to search
 * @returns {Promise<ManifestFile[]>} Array of manifest objects
 */
async function findManifestFiles(dir) {
  const manifests = [];

  /**
   * Recursively searches directories for manifest files
   * @param {string} currentDir - Current directory being searched
   * @returns {Promise<void>}
   */
  async function searchDir(currentDir) {
    try {
      const files = await fs.readdir(currentDir);
      const fileStats = await Promise.all(
        files.map(file => {
          const filePath = path.join(currentDir, file);
          return fs.stat(filePath).then(stat => ({ file, filePath, stat }));
        }),
      );

      const dirPromises = [];
      const manifestPromises = [];

      for (const { file, filePath, stat } of fileStats) {
        // there were a few files called manifest.json in the node_modules folder
        // so we need to filter them out
        if (file !== 'node_modules') {
          if (stat.isDirectory()) {
            dirPromises.push(searchDir(filePath));
          } else if (file === 'manifest.json') {
            try {
              manifestPromises.push(
                fs.readFile(filePath, 'utf8').then(content => ({
                  path: filePath,
                  ...JSON.parse(content),
                })),
              );
            } catch (err) {
              logger.error(`Error reading manifest at ${filePath}:`, err);
            }
          }
        }
      }

      // using Promise.all to run all promises in parallel and not wait for each one
      await Promise.all(dirPromises);
      manifests.push(...(await Promise.all(manifestPromises)));
    } catch (err) {
      logger.error(`Error reading directory ${currentDir}:`, err);
    }
  }

  await searchDir(dir);
  return manifests;
}

/**
 * Returns the currently cached manifests.
 * Used because just accessing the `_cachedManifests` variable directly
 * will only return the initial value `[]`
 * @returns {ManifestFile[]} Array of cached manifest objects
 */
const getCachedManifests = () => _cachedManifests;

/**
 * Creates the manifest cache.
 * Used during vadx startup
 * @returns {Promise<void>}
 * @throws {Error} If there is an error reading the manifests
 */
async function initializeManifests() {
  try {
    logger.debug('Scanning for manifests in:', paths.applications);
    _cachedManifests = await findManifestFiles(paths.applications);
    logger.info(`Loaded ${_cachedManifests.length} manifests at startup`);
  } catch (error) {
    logger.error('Error loading manifests at startup:', error);
    _cachedManifests = [];
  }
}

module.exports = {
  initializeManifests,
  getCachedManifests,
};
