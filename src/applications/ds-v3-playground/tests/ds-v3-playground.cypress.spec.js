/* eslint-disable @department-of-veterans-affairs/axe-check-required */

describe('DS V3 Playground', () => {
  // before(() => {
  //   if (Cypress.env('CI')) this.skip();
  // });

  it('is accessible', () => {
    cy.visit('/ds-v3-playground');
    cy.injectAxeThenAxeCheck();
  });

  it('loads the playground page successfully', () => {
    cy.visit('/ds-v3-playground');
    cy.get('h1').should('contain.text', 'VA Design System Component Demos');
  });
});
