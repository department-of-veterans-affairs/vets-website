/* eslint-disable no-continue, no-param-reassign */

/**
 * Writes a human-readable JavaScript file containing build properties available globally under `window.settings`.
 * @param {object} options The build options as passed to the build script and processed through Metalsmith.
 */
function createBuildSettings(options) {
  const settingsPath = 'js/settings.js';

  return (files, metalsmith, done) => {
    const settings = {
      type: options.buildtype,
      applications: {},
    };

    for (const file of Object.values(files)) {
      const { entryname: entryName } = file;

      if (!entryName) continue;

      const application = settings.applications[entryName];
      if (!application) {
        settings.applications[entryName] = {};
      }
    }

    files[settingsPath] = {
      path: settingsPath,
      contents: `window.settings = ${JSON.stringify(settings, null, ' ')};`,
    };

    options.settings = settings;

    done();
  };
}

module.exports = createBuildSettings;
