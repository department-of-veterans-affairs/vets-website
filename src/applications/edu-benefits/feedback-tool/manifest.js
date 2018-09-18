module.exports = {
  appName: 'GI Bill School Feedback Tool',
  entryFile: './feedback-tool-entry.jsx',
  entryName: 'feedback-tool',
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  }
};
