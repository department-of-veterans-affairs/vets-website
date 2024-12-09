const fs = require('fs').promises;
const path = require('path');

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

const getManifests = async (req, res) => {
  try {
    const applicationsPath = path.resolve(__dirname, '..', '..', '..');
    const manifests = await findManifestFiles(applicationsPath);

    res.json({
      success: true,
      count: manifests.length,
      manifests,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting manifests:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getManifests,
};
