const fs = require('fs');
const path = require('path');

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
      rateLimitUnauthed: 1
    }
  };
}

/**
 * Writes a human-readable JavaScript file containing build properties available globally under `window.settings`.
 * @param {object} options The build options as passed to the build script and processed through Metalsmith.
 */
module.exports = function writeBuildSettings(options) {
  const settings = getBuildSettings(options);
  const settingsPath = path.join(options.destination, 'js/settings.js');
  const settingsContent = `window.settings = ${JSON.stringify(settings, null, ' ')};`;
  fs.writeFileSync(settingsPath, settingsContent);
};
