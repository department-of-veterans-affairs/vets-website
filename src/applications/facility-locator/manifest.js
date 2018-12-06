module.exports = {
  appName: 'Facility Locator',
  entryFile: './facility-locator-entry.jsx',
  entryName: 'facilities',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
