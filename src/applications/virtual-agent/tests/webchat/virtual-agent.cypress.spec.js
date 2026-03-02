import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  it('is accessible', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();
  });
});
