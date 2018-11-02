module.exports = {
  appName: 'Facility Locator',
  entryFile: './facility-locator-entry.jsx',
  entryName: 'facilities',
  rootUrl: '/facilities',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = rootUrl;
  },
};
