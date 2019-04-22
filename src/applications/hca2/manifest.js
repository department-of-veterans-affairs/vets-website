module.exports = {
  appName: '1010ez Health Care Application form',
  entryFile: './hca-entry.jsx',
  entryName: 'hca2',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
