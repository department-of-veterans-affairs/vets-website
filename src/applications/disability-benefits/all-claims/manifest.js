module.exports = {
  appName: '21-526EZ disability compensation claim form',
  entryFile: './form-entry.jsx',
  entryName: '526EZ-all-claims',
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  },
};
