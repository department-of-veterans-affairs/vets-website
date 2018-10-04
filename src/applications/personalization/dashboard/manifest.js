module.exports = {
  appName: 'Dashboard',
  entryFile: './dashboard-entry.jsx',
  entryName: 'dashboard',
  rootUrl: '/my-va', // Default value for teamsite
  receiveContentProps({ path }) {
    this.rootUrl = `/${path}`;
  },
  production: true,
  contentPage: 'my-va/index.md',
  hideInvitation: true,
};
