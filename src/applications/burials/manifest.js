module.exports = {
  appName: '21P-530 Burials benefits form',
  entryFile: './burials-entry.jsx',
  entryName: 'burials',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
