module.exports = {
  appName: '28-8832 Vocational Rehab Chapter 36 form',
  entryFile: './chapter36-entry.jsx',
  entryName: 'chapter36-vre',
  receiveContentProps({ path: rootUrl, production }) {
    this.rootUrl = `/${rootUrl}`;
    this.production = production;
  },
};
