module.exports = {
  appName: '28-1900 Vocational Rehab Chapter 31 form',
  entryFile: './chapter31-entry.jsx',
  entryName: 'chapter31-vre',
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  },
};
