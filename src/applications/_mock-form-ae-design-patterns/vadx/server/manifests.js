const fs = require('fs').promises;
const path = require('path');

let cachedManifests = [];

async function findManifestFiles(dir) {
  const manifests = [];

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
            // eslint-disable-next-line no-console
            console.error(`Error reading manifest at ${filePath}:`, err);
          }
        }
      }

      await Promise.all(dirPromises);
      manifests.push(...(await Promise.all(manifestPromises)));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error reading directory ${currentDir}:`, err);
    }
  }

  await searchDir(dir);
  return manifests;
}

// Initialize manifests when server starts
async function initializeManifests() {
  try {
    const applicationsPath = path.resolve(__dirname, '..', '..', '..');
    cachedManifests = await findManifestFiles(applicationsPath);
    // eslint-disable-next-line no-console
    console.log(`Loaded ${cachedManifests.length} manifests at startup`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading manifests at startup:', error);
    cachedManifests = [];
  }
}

const getManifests = (req, res) => {
  res.json({
    success: true,
    count: cachedManifests.length,
    manifests: cachedManifests,
  });
};

module.exports = {
  getManifests,
  initializeManifests,
};
