module.exports = {
  appName: 'Dashboard',
  entryFile: './dashboard-entry.jsx',
  entryName: 'dashboard',
  receiveContentProps() {
    // pulled from isBrandConsolidationEnabled helper
    // manifest is used during node build which is not babel transformed-
    // this prevents importing the helper
    this.rootUrl = window.settings && window.settings.brandConsolidationEnabled ? '/my-va' : '/dashboard';
  },
  production: true,
  contentPage: 'my-va/index.md',
  hideInvitation: true
};
