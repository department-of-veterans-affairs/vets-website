const template = (source) => `
${source}
(() => {
  if (module.exports.receiveMetadata) {
    const metadata = window.settings.applications[module.exports.entryName];
    module.exports.receiveMetadata(...metadata);
  }
})();
`;

function manifestLoader(source) {
  return template(source);
}

module.exports = manifestLoader;
