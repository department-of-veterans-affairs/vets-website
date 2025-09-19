/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import manifest from '../manifest.json';

describe(manifest.appName, () => {
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  it('is accessible', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
  });

  it('loads the playground page successfully', () => {
    cy.visit(manifest.rootUrl);
    cy.get('h1').should('contain.text', 'VA Design System Component Demos');
  });
});
