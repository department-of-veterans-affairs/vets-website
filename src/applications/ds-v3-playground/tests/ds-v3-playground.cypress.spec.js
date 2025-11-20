/* eslint-disable @department-of-veterans-affairs/axe-check-required */

describe('DS V3 Playground', () => {
  beforeEach(() => {
    // Force a fresh page load to ensure clean state
    cy.visit('/ds-v3-playground', { timeout: 10000 });
  });

  it('is accessible', () => {
    cy.visit('/ds-v3-playground');
    cy.injectAxeThenAxeCheck();
  });

  it('loads the playground page successfully', () => {
    cy.visit('/ds-v3-playground');
    cy.get('h1').should('contain.text', 'VA Design System Component Demos');
  });
});
