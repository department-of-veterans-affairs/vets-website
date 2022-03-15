import manifest from '../../manifest.json';
// import { proxyRewriteWhitelist as whitelist } from '../../proxy-rewrite-whitelist.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });
});
