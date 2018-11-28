module.exports = {
  appName: 'Claims Status',
  entryFile: './discharge-wizard-entry.jsx',
  entryName: 'discharge-upgrade-instructions',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
