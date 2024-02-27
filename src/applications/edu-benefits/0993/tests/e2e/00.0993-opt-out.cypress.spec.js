import Timeouts from 'platform/testing/e2e/timeouts';
import applicationSubmit from './fixtures/mocks/application-submit.json';
import testData from './fixtures/test-data.json';

describe('Opt Out Test', () => {
  it('Fills out the form and submits', () => {
    cy.intercept(
      'POST',
      '/v0/education_benefits_claims/0993',
      applicationSubmit,
    ).as('optOutClaim');

    cy.visit('/education/opt-out-information-sharing/opt-out-form-0993/');
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();

    // Claimant information
    cy.get('input[name="root_claimantFullName_first"]');

    cy.fillName('root_claimantFullName', testData.claimantFullName);
    cy.get('input[name="root_view:noSSN"]').click();
    cy.get('input[name="root_vaFileNumber"]', {
      timeout: Timeouts.slow,
    }).click();
    cy.fill('input[name="root_vaFileNumber"]', testData.vaFileNumber);
    cy.get('.form-progress-buttons .usa-button-primary').click();

    // Review and submit page
    cy.url({ timeout: Timeouts.slow }).should(
      'not.contain',
      '/claimant-information',
    );

    cy.get('[name="privacyAgreementAccepted"]')
      .find('label[for="checkbox-element"]')
      .should('be.visible');

    cy.get('[name="privacyAgreementAccepted"]')
      .find('[type="checkbox"]')
      .check({
        force: true,
      });

    cy.axeCheck();
    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.wait('@optOutClaim');
    cy.url({ timeout: Timeouts.submission }).should(
      'not.contain',
      '/review-and-submit',
    );

    // Confirmation Page
    cy.get('.confirmation-page-title').should('be.visible');
    cy.axeCheck();
  });
});
