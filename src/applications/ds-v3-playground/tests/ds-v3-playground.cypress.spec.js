/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import manifest from '../manifest.json';

describe(`${manifest.appName} - General`, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('page is accessible', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();
  });

  it('loads the playground page successfully', () => {
    cy.visit(manifest.rootUrl);
    cy.get('h1').should('contain.text', 'V3 Without Formation Demo');
  });
});
