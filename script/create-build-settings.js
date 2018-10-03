/* eslint-disable no-continue, no-param-reassign */

/**
 * The result of this function will become globally available under window.settings in a totally static file at /js/settings.js.
 * Post-build, it can be edited in {build_directory}/js/settings.js.
 * @param {object} options
 */
function getBuildSettings(options) {
  return {
    type: options.buildtype,
    brandConsolidationEnabled: !!options['brand-consolidation-enabled'],
    vic: {
      rateLimitAuthed: 1,
      rateLimitUnauthed: 1,
    },
    applications: {},
  };
}

/**
 * Writes a human-readable JavaScript file containing build properties available globally under `window.settings`.
 * @param {object} options The build options as passed to the build script and processed through Metalsmith.
 */
function createBuildSettings(options) {
  return (files, metalsmith, done) => {
    const settings = getBuildSettings(options);

    for (const fileName of Object.keys(files)) {
      const file = files[fileName];
      const { entryname: entryName } = file;

      if (!entryName) continue;

      const validTypes = ['string', 'boolean', 'number'];
      const frontmatter = {};

      for (const dataKey of Object.keys(file)) {
        const data = file[dataKey];
        if (validTypes.includes(typeof data)) {
          frontmatter[dataKey] = data;
        }
      }

      let application = settings.applications[entryName];
      if (!application) {
        application = {};
        settings.applications[entryName] = application;
      }

      application.contentProps = application.contentProps || [];
      application.contentProps.push(frontmatter);
    }

    const settingsPath = 'js/settings.js';

    files[settingsPath] = {
      path: settingsPath,
      contents: `window.settings = ${JSON.stringify(settings, null, ' ')};`,
    };

    options.settings = settings;

    done();
  };
}

module.exports = createBuildSettings;
