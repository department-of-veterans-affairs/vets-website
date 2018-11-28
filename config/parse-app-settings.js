const path = require('path');
const fs = require('fs');

/**
 * Helper functions for reading js/settings.js, a file containing app information generated during the Metalsmith build.
 */
const parsedAppSettings = {
  /**
   * Stores a reference to the settings via the build arguments.
   * @param {object} buildOptions The build-options passed along throughout Metalsmith middleware.
   */
  parseFromBuildOptions(buildOptions) {
    this.buildSettings = buildOptions.settings;
  },

  /**
   * Parses js/settings.js from the file system.
   * @param {string} root The directory of the generated website build
   */
  parseFromBuildDir(root) {
    const buildSettingsFileName = path.resolve(root, 'js/settings.js');
    const buildSettingsFile = fs.readFileSync(buildSettingsFileName);

    let contents = buildSettingsFile.toString();
    contents = contents.replace('window.settings = ', '');
    contents = contents.slice(0, -';'.length);

    this.buildSettings = JSON.parse(contents);
  },

  /**
   * Uses the settings.js to return a list of all paths containing an entry-name.
   */
  getAllApplicationRoutes() {
    const applicationSettings = this.buildSettings.applications;
    const routes = [];

    for (const entryName of Object.keys(applicationSettings)) {
      const contentProps = applicationSettings[entryName].contentProps;

      contentProps
        .map(file => file.path)
        .forEach(filePath => routes.push(`/${filePath}`));
    }

    return routes;
  },
};

module.exports = parsedAppSettings;
