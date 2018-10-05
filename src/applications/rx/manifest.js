module.exports = {
  appName: 'Prescription Refill',
  entryFile: './rx-entry.jsx',
  entryName: 'rx',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  },
};
