const template = (source) => `
${source}
(() => {
  if (module.exports.receiveContentProps) {
    const applicationSettings = window.settings.applications[module.exports.entryName];
    module.exports.receiveContentProps(...applicationSettings.contentProps);
  }
})();
`;

function manifestLoader(source) {
  return template(source);
}

module.exports = manifestLoader;
