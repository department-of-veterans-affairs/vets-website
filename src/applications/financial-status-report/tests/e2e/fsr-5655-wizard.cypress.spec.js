import { WIZARD_STATUS_NOT_STARTED } from 'platform/site-wide/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

// Can remove this section when we deprecate the legacy wizard (show_financial_status_report_wizard)
describe('Financial Status Report (Wizard)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_NOT_STARTED);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true }, // Legacy Wizard
          { name: 'show_financial_status_report', value: true },
          { name: 'fsr_wizard', value: false }, // Static Wizard
        ],
      },
    });
    cy.intercept('GET', '/v0/in_progress_forms/5655', {
      statusCode: 200,
    });
    cy.visit(manifest.rootUrl);
    cy.injectAxe();
  });

  it('Should navigate the wizard and start the form', () => {
    const title = 'Request help with VA debt for overpayments and copay bills';
    const heading = 'Is this the form I need?';
    cy.url().should('include', manifest.rootUrl);
    cy.get('h1').should('have.text', title);
    cy.get('.wizard-heading').should('have.text', heading);

    cy.get('va-radio-option[value="request"]').click();
    cy.get('va-radio-option[value="recipients"]').click();
    cy.get('va-radio-option[value="veteran"]').click();
    cy.get('.vads-c-action-link--green')
      .first()
      .click();
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.axeCheck();
  });

  it('Should show process list when wizard is complete', () => {
    cy.get('va-radio-option[value="request"]').click();
    cy.get('va-radio-option[value="recipients"]').click();
    cy.get('va-radio-option[value="veteran"]').click();
    cy.get('.vads-c-action-link--green')
      .first()
      .click();
    cy.checkStorage(WIZARD_STATUS, 'complete');

    cy.findByTestId('legacy-process-list').should('exist');
    cy.findByTestId('static-process-list').should('not.exist');
    cy.axeCheck();
  });
});

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
