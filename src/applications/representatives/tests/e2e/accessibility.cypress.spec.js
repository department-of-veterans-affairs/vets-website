import { generateFeatureToggles } from '../../mocks/feature-toggles';

describe('Accessibility', () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'representatives_portal_frontend', value: true }],
      },
    });
  });

  it('has accessible landing page', () => {
    cy.visit('/representatives');
    generateFeatureToggles();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('has accessible dashboard', () => {
    cy.visit('/representatives/dashboard');
    generateFeatureToggles();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('has accessible poa requests page', () => {
    cy.visit('/representatives/poa-requests');
    generateFeatureToggles();
    cy.injectAxe();
    cy.axeCheck();
  });
});
