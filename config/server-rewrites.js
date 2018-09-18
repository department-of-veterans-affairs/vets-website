const path = require('path');
const fs = require('fs');

function getRoutes(buildSettings) {
  const applicationSettings = buildSettings.applications;
  const routes = [];

  for (const entryName of Object.keys(applicationSettings)) {
    const contentFiles = applicationSettings[entryName];
    contentFiles
      // .filter(file => file.production)
      .map(file => file.path)
      .forEach(filePath => routes.push(`/${filePath}`));
  }

  return routes;
}

function getAppRoutesFromGeneratedSettingsFile(root) {
  const buildSettingsFileName = path.resolve(root, 'js/settings.js');
  const buildSettingsFile = fs.readFileSync(buildSettingsFileName);

  let contents = buildSettingsFile.toString();
  contents = contents.replace('window.settings = ', '');
  contents = contents.slice(0, -';'.length);

  const buildSettings = JSON.parse(contents);
  return getRoutes(buildSettings);
}

module.exports = {
  getRoutes,
  getAppRoutesFromGeneratedSettingsFile
};
