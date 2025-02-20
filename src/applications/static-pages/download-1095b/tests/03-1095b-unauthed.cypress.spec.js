import { featureToggles } from './e2e/fixtures/mocks/mocks';

describe('Unauthenticated 1095-B Form Download PDF', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggles).as(
      'featureToggles',
    );

    cy.visit('/health-care/download-1095b/');
    cy.wait(['@featureToggles']);
  });

  it('displays the va-alert-sign-in', () => {
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should('contain', '1095B Download | Veterans Affairs');
    cy.get('.usa-content').should('be.visible');

    cy.axeCheck();

    cy.get('va-alert-sign-in[variant="signInRequired"]').should('be.visible');

    cy.axeCheck();
  });
});
