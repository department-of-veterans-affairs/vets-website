const template = (source) => `
${source}
(() => {
  if (module.exports.receiveContentProps) {
    const metadata = window.settings.applications[module.exports.entryName];
    module.exports.receiveContentProps(...metadata);
  }
})();
`;

function manifestLoader(source) {
  return template(source);
}

module.exports = manifestLoader;
