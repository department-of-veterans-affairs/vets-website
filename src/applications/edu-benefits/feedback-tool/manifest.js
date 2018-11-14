module.exports = {
  appName: 'GI Bill School Feedback Tool',
  entryFile: './feedback-tool-entry.jsx',
  entryName: 'feedback-tool',
  e2eTestsDisabled: true,
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  },
};
