import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

// Can remove this section when we deprecate the legacy wizard (show_financial_status_report_wizard)
// Legacy wizard removed; keep only static wizard tests

describe('Financial Status Report (Static Wizard)', () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: false }, // Legacy Wizard
          { name: 'show_financial_status_report', value: true },
          { name: 'fsr_wizard', value: true }, // Static Wizard
        ],
      },
    });
    cy.visit(manifest.rootUrl);
    cy.injectAxe();
  });

  it('Should show static wizard with content link', () => {
    const title = 'Request help with VA debt for overpayments and copay bills';
    cy.url().should('include', manifest.rootUrl);
    cy.get('h1').should('have.text', title);

    // Can remove these two when we deprecate the legacy wizard (show_financial_status_report_wizard)
    cy.get('.wizard-heading').should('not.exist');
    cy.findByTestId('legacy-process-list').should('not.exist');

    cy.findByTestId('static-process-list').should('exist');
    cy.findByTestId('learn-more-about-options-link')
      .shadow()
      .contains('Learn more about options for requesting help with VA debts')
      .should('have.attr', 'href')
      .and('include', '/resources/options-to-request-help-with-va-debt');

    cy.axeCheck();
  });
});
