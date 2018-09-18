module.exports = {
  appName: 'Secure Messaging',
  entryFile: './messaging-entry.jsx',
  entryName: 'messaging',
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  }
};
