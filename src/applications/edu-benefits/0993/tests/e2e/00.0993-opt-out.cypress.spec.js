import Timeouts from '~/platform/testing/e2e/timeouts';
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
    cy.findByRole('textbox', { name: /Your first name/i })
      .should('be.visible')
      .clear();
    cy.findByRole('textbox', { name: /Your first name/i }).type(
      testData.claimantFullName.first,
    );

    cy.findByRole('textbox', { name: /Your middle name/i })
      .should('be.visible')
      .clear();
    cy.findByRole('textbox', { name: /Your middle name/i }).type(
      testData.claimantFullName.middle,
    );

    cy.findByRole('textbox', { name: /Your last name/i })
      .should('be.visible')
      .clear();
    cy.findByRole('textbox', { name: /Your last name/i }).type(
      testData.claimantFullName.last,
    );

    cy.findByRole('checkbox', {
      name: /I don’t have a Social Security number/i,
    })
      .should('exist')
      .check();
    cy.findByRole('textbox', { name: /VA file number/i })
      .should('be.visible')
      .clear();
    cy.findByRole('textbox', { name: /VA file number/i }).type(
      testData.vaFileNumber,
    );

    cy.findByRole('button', { name: /Continue/i }).click();

    // Review and submit page
    cy.url({ timeout: Timeouts.submission }).should(
      'contain',
      '/review-and-submit',
    );

    cy.injectAxeThenAxeCheck();

    cy.get('[name="privacyAgreementAccepted"]')
      .find('label[for="checkbox-element"]')
      .should('be.visible');

    cy.get('[name="privacyAgreementAccepted"]')
      .find('[type="checkbox"]')
      .check({
        force: true,
      });

    cy.findByRole('button', { name: /Submit application/i }).click();

    // Confirmation page
    cy.url({ timeout: Timeouts.submission }).should('contain', '/confirmation');
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', {
      name: /Your opt-out form has been submitted/i,
    }).should('exist');
  });
});
