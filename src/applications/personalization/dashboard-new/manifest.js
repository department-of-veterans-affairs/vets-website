module.exports = {
  appName: 'Dashboard Preview',
  entryFile: './dashboard-entry.jsx',
  entryName: 'dashboard-new',
  rootUrl: '/dashboard2', // Default value for teamsite
  receiveContentProps({ path }) {
    this.rootUrl = `/${path}`;
  },
  production: true,
  contentPage: 'dashboard2/index.md',
  hideInvitation: true,
};
