import Timeouts from 'platform/testing/e2e/timeouts';
import testData from './schema/maximal-test.json';
import preneedHelpers from './utils/cypress-preneed-helpers';

describe('Pre-need form VA 40-10007 Veteran Workflow', () => {
  it('fills the form and navigates accordingly', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();

    // Applicant Information
    preneedHelpers.fillApplicantInfo(
      testData.data.application.veteran.currentName,
      testData.data.application.veteran.ssn,
      testData.data.application.veteran.dateOfBirth,
      testData.data.application.veteran.relationshipToVet,
    );

    // Veteran Information
    cy.get('input[name="root_application_veteran_militaryServiceNumber"]');
    preneedHelpers.validateProgressBar('1');
    cy.fill(
      'input[name="root_application_veteran_militaryServiceNumber"]',
      testData.data.application.veteran.militaryServiceNumber,
    );
    cy.fill(
      'input[name="root_application_veteran_vaClaimNumber"]',
      testData.data.application.veteran.vaClaimNumber,
    );
    cy.fill(
      'input[name="root_application_veteran_placeOfBirth"]',
      testData.data.application.veteran.placeOfBirth,
    );
    cy.get(
      'input[name="root_application_veteran_race_isSpanishHispanicLatino"]',
    ).click();
    cy.selectRadio(
      'root_application_veteran_gender',
      testData.data.application.veteran.gender,
    );
    cy.selectRadio(
      'root_application_veteran_maritalStatus',
      testData.data.application.veteran.maritalStatus,
    );
    cy.get('#root_application_veteran_militaryStatus').select(
      testData.data.application.veteran.militaryStatus,
    );

    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/veteran-information');

    // Military History
    cy.get(
      'input[name="root_application_veteran_serviceRecords_0_serviceBranch"]',
      { timeout: Timeouts.verySlow },
    );
    preneedHelpers.validateProgressBar('2');
    preneedHelpers.fillMilitaryHistory(
      testData.data.application.veteran.serviceRecords,
    );
    cy.url().should('not.contain', '/applicant-military-history');

    // Previous Names page
    preneedHelpers.fillPreviousName(
      testData.data.application.veteran.serviceName,
    );
    cy.url().should('not.contain', '/applicant-military-name');

    // Benefit Selection page
    cy.get('label[for="root_application_claimant_desiredCemetery"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('3');
    preneedHelpers.fillBenefitSelection(
      testData.data.application.veteran.desiredCemetery.label,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents page
    cy.get('label[for="root_application_preneedAttachments"]');

    preneedHelpers.validateProgressBar('4');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Veteran Contact Information page
    cy.get('select[name="root_application_claimant_address_country"]');
    preneedHelpers.validateProgressBar('5');
    cy.fillAddress(
      'root_application_claimant_address',
      testData.data.application.veteran.address,
    );
    cy.fill('input[name$="email"]', testData.data.application.veteran.email);
    cy.fill(
      'input[name$="phoneNumber"]',
      testData.data.application.veteran.phoneNumber,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/applicant-contact-information');

    // Preparer Contact Information page
    cy.get(
      'label[for="root_application_applicant_applicantRelationshipToClaimant_1"]',
    );
    preneedHelpers.validateProgressBar('5');
    cy.selectRadio(
      'root_application_applicant_applicantRelationshipToClaimant',
      testData.data.application.applicantForeign
        .applicantRelationshipToClaimant,
    );
    if (
      testData.data.application.applicantForeign
        .applicantRelationshipToClaimant === 'Authorized Agent/Rep'
    ) {
      cy.fillName(
        'root_application_applicant_view:applicantInfo_name',
        testData.data.application.applicantForeign['view:applicantInfo'].name,
      );
      cy.fillAddress(
        'root_application_applicant_view\\:applicantInfo_mailingAddress',
        testData.data.application.applicantForeign['view:applicantInfo']
          .mailingAddress,
      );
      cy.fill(
        'input[name="root_application_applicant_view:applicantInfo_mailingAddress_state"]',
        testData.data.application.applicantForeign.state,
      );
      cy.fill(
        'input[name$="applicantPhoneNumber"]',
        testData.data.application.applicantForeign['view:applicantInfo'][
          'view:contactInfo'
        ].applicantPhoneNumber,
      );

      cy.axeCheck();
      preneedHelpers.clickContinue();
      cy.url().should('not.contain', '/preparer');

      cy.get('[name="privacyAgreementAccepted"]')
        .find('label[for="checkbox-element"]')
        .should('be.visible');
      preneedHelpers.validateProgressBar('6');
      cy.get('[name="privacyAgreementAccepted"]')
        .find('[type="checkbox"]')
        .check({
          force: true,
        });

      cy.axeCheck();
      cy.get('.form-progress-buttons .usa-button-primary').click();
      cy.url().should('not.contain', '/review-and-submit');

      cy.get('.js-test-location', { timeout: Timeouts.slow })
        .invoke('attr', 'data-location')
        .should('not.contain', '/review-and-submit');

      cy.get('.confirmation-page-title');
      cy.axeCheck();
    }
  });
});
