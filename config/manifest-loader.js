/**
 * A loader that injects code at the bottom of a manifest to automatically execute an optional receiveContentProps function,
 * passing along the frontmatter of content-files of a matching entry-name.
 * @param {string} source The manifest.js file content
 */
function manifestLoader(source) {
  return `
    ${source}
    (function() {
      if (module.exports.receiveContentProps) {
        const applicationSettings = window.settings.applications[module.exports.entryName];
        module.exports.receiveContentProps.apply(module.exports, applicationSettings.contentProps);
      }
    })();
  `;
}

module.exports = manifestLoader;
