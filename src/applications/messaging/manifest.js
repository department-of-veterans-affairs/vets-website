module.exports = {
  appName: 'Secure Messaging',
  entryFile: './messaging-entry.jsx',
  entryName: 'messaging',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
