module.exports = {
  appName: 'Veteran ID Card V2',
  entryFile: './veteran-id-card-entry.jsx',
  entryName: 'vic-v2',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  }
};
