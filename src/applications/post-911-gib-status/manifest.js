module.exports = {
  appName: 'Post 9/11 GI Bill Status',
  entryFile: './post-911-gib-status-entry.jsx',
  entryName: 'post-911-gib-status',
  receiveContentProps({ path: rootUrl }) {
    this.rootUrl = `/${rootUrl}`;
  }
};
