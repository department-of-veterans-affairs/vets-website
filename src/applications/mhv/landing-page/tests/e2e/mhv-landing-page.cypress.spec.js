import { appName, rootUrl } from '../../manifest.json';

describe(appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  beforeEach(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('is accessible', () => {
    cy.visit(rootUrl);
    cy.injectAxeThenAxeCheck();
  });
});
