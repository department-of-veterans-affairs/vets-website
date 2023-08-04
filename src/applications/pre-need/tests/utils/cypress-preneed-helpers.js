import Timeouts from 'platform/testing/e2e/timeouts';
import cemeteries from '../fixtures/mocks/cemeteries.json';
import featureToggles from '../fixtures/mocks/feature-toggles.json';

function interceptSetup() {
  cy.intercept('POST', '/v0/preneeds/burial_forms', {
    data: {
      attributes: {
        confirmationNumber: '123fake-submission-id-567',
        submittedAt: '2016-05-16',
      },
    },
  });
  cy.intercept('POST', '/v0/preneeds/preneed_attachments', {
    data: {
      attributes: {
        attachmentId: '1',
        name: 'VA40-10007.pdf',
        confirmationCode: 'e2128ec4-b2fc-429c-bad2-e4b564a80d20',
      },
    },
  });
  cy.intercept('GET', '/v0/preneeds/cemeteries', cemeteries);
  cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
}

// The string passed to this function should reflect the number of sections of the progress bar that are expected to be complete
function validateProgressBar(index) {
  cy.get('va-segmented-progress-bar')
    .shadow()
    .find(`.progress-bar-segmented div.progress-segment:nth-child(${index})`)
    .should('have.class', 'progress-segment-complete');
}

function clickContinue() {
  cy.get('.form-panel .usa-button-primary').click();
}

// Visits the pre-need intro page, validates the title, clicks start application
function visitIntro() {
  cy.visit('/burials-and-memorials/pre-need/form-10007-apply-for-eligibility');
  cy.get('body').should('be.visible');
  cy.title().should(
    'contain',
    'Apply online for pre-need determination of eligibility in a VA National Cemetery | Veterans Affairs',
  );
  cy.get('.schemaform-title', { timeout: Timeouts.slow }).should('be.visible');
  cy.get('.schemaform-start-button')
    .first()
    .click();

  cy.url().should('not.contain', '/introduction');
}

// Fills all fields on the Applicant Information page
function fillApplicantInfo(name, ssn, dob, relationship) {
  cy.get('input[name="root_application_claimant_name_first"]');
  validateProgressBar('1');
  cy.fillName('root_application_claimant_name', name);
  cy.fill('input[name="root_application_claimant_ssn"]', ssn);
  cy.fillDate('root_application_claimant_dateOfBirth', dob);
  cy.selectRadio('root_application_claimant_relationshipToVet', relationship);

  cy.injectAxeThenAxeCheck();
  clickContinue();
  cy.url().should(
    'not.contain',
    '/form-10007-apply-for-eligibility/applicant-information',
  );
}

module.exports = {
  clickContinue,
  interceptSetup,
  visitIntro,
  validateProgressBar,
  fillApplicantInfo,
};
