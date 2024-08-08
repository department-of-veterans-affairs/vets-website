import mockFeedbackPost from './fixtures/mocks/feedback-post.json';
import mockFeedbackGet from './fixtures/mocks/feedback-1234.json';
import testData from './schema/maximal-test.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

describe('Feedback Tool Test', () => {
  it('Fills the form and navigates accordingly', () => {
    cy.intercept('POST', '/v0/gi_bill_feedbacks', { body: mockFeedbackPost });
    cy.intercept('GET', '/v0/gi_bill_feedbacks/1234', mockFeedbackGet);

    cy.visit('/education/submit-school-feedback');
    cy.get('body').should('be.visible');
    cy.get('.schemaform-title').should('be.visible', {
      timeout: Timeouts.slow,
    });
    cy.get('.schemaform-start-button')
      .first()
      .click();

    cy.url().should('not.contain', '/introduction');
    // Applicant relationship
    cy.get('va-radio-option[value="Myself"]').should('exist');
    cy.injectAxeThenAxeCheck();
    cy.get('va-radio-option[value="Myself"]').click();
    // cy.selectRadio('root_onBehalfOf', testData.data.onBehalfOf);
    // cy.get('.usa-alert.usa-alert-info.background-color-only', {
    //   timeout: Timeouts.slow,
    // }).should('be.visible');

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/applicant-relationship');

    // Applicant information
    cy.get('input[name="root_fullName_first').should('exist');
    cy.axeCheck();

    cy.fillName('root_fullName', testData.data.fullName);
    cy.get('#root_serviceAffiliation').select(testData.data.serviceAffiliation);

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/applicant-information');

    // Service Information
    cy.get('select[name="root_serviceBranch"]').should('exist');
    cy.axeCheck();

    cy.fillDate(
      'root_serviceDateRange_from',
      testData.data.serviceDateRange.from,
    );
    cy.fillDate('root_serviceDateRange_to', testData.data.serviceDateRange.to);
    cy.get('#root_serviceBranch').select(testData.data.serviceBranch);

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/service-information');

    // Contact information
    cy.get('select[name="root_address_country"]').should('exist');
    cy.axeCheck();

    cy.fillAddress('root_address', testData.data.address);
    cy.fill('input[name="root_applicantEmail"]', testData.data.applicantEmail);
    cy.fill(
      'input[name="root_view:applicantEmailConfirmation"]',
      testData.data['view:applicantEmailConfirmation'],
    );
    cy.fill('input[name="root_phone"]', testData.data.phone);

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/contact-information');

    // Benefit information
    cy.get('input[name="root_educationDetails_programs_chapter33"]').should(
      'exist',
    );
    cy.axeCheck();

    cy.get('#root_educationDetails_programs_chapter33').click();

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/benefits-information');

    // School information
    cy.get('input[type="checkbox"]').should('exist');
    cy.axeCheck();

    // Select checkbox to enter information manually
    cy.get('label[id="option-label"]').click();
    cy.get(
      'input[name="root_educationDetails_school_view:manualSchoolEntry_name"]',
      { timeout: Timeouts.slow },
    ).should('be.visible');
    cy.fill(
      'input[name="root_educationDetails_school_view:manualSchoolEntry_name"]',
      testData.data.educationDetails.school['view:manualSchoolEntry'].name,
    );
    cy.fillAddress(
      'root_educationDetails_school_view\\:manualSchoolEntry_address',
      testData.data.educationDetails.school['view:manualSchoolEntry'].address,
    );

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/school-information');

    // Feedback information
    cy.get('input[name="root_issue_recruiting"]').should('exist');
    cy.axeCheck();

    cy.get('#root_issue_other').click();
    cy.get('textarea[id="root_issueDescription"]').type(
      testData.data.issueDescription,
    );
    cy.get('textarea[id="root_issueResolution"]').type(
      testData.data.issueResolution,
    );

    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.url().should('not.contain', '/feedback-information');

    // Review and submit page
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

    cy.get('.js-test-location', { timeout: Timeouts.slow })
      .invoke('attr', 'data-location')
      .should('not.contain', '/review-and-submit');

    cy.get('.confirmation-page-title').should('be.visible');
    cy.axeCheck();
  });
});
