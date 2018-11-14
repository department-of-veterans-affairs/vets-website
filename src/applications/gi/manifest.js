module.exports = {
  appName: 'GI Bill Comparison Tool',
  entryFile: './gi-entry.jsx',
  entryName: 'gi',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
