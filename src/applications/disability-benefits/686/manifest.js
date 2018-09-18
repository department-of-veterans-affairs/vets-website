module.exports = {
  appName: '686 Dependent-status form',
  entryFile: './686-entry.jsx',
  entryName: '686-dependent-status',
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  }
};
