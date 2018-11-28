module.exports = {
  appName: '21-22 Appoint Veteran Service Officer as Representative',
  entryFile: './veteran-representative-entry.jsx',
  entryName: 'veteran-representative',
  e2eTestsDisabled: true,
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  },
};
