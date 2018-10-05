module.exports = {
  appName: 'Letters',
  entryFile: './letters-entry.jsx',
  entryName: 'letters',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
