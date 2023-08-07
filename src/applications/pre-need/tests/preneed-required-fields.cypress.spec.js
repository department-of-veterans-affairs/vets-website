import Timeouts from 'platform/testing/e2e/timeouts';
import requiredHelpers from './utils/cypress-required-field-helpers';
import testData from './schema/required-fields-test.json';
import preneedHelpers from './utils/cypress-preneed-helpers';

function errorCheck(errorList) {
  cy.get('.form-panel .usa-button-primary').click({ waitForAnimations: true });
  errorList.map(id =>
    cy.get(`#root_application_${id}-error-message`).should('be.visible'),
  );
  cy.axeCheck();
}

describe('Pre-need form VA 40-10007 Required Fields', () => {
  it('triggers validation on all required fields then completes the form with minimal data', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();
    cy.injectAxe();

    // Applicant Information
    preneedHelpers.validateProgressBar('1');
    cy.get('input[name="root_application_claimant_name_first"]');

    errorCheck(requiredHelpers.applicantInfoErrors);

    cy.fill(
      'input[name=root_application_claimant_name_first]',
      testData.data.application.claimant.name.first,
    );
    cy.fill(
      'input[name=root_application_claimant_name_last]',
      testData.data.application.claimant.name.last,
    );
    cy.fill(
      'input[name="root_application_claimant_ssn"]',
      testData.data.application.claimant.ssn,
    );
    cy.fillDate(
      'root_application_claimant_dateOfBirth',
      testData.data.application.claimant.dateOfBirth,
    );
    cy.selectRadio(
      'root_application_claimant_relationshipToVet',
      testData.data.application.claimant.relationshipToVet,
    );

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/applicant-information');

    // Veteran Information
    preneedHelpers.validateProgressBar('2');
    cy.get('input[name="root_application_veteran_currentName_first"]');

    errorCheck(requiredHelpers.veteranInfoErrors);

    cy.fill(
      'input[name=root_application_veteran_currentName_first]',
      testData.data.application.veteran.currentName.first,
    );
    cy.fill(
      'input[name=root_application_veteran_currentName_last]',
      testData.data.application.veteran.currentName.last,
    );
    cy.fill(
      'input[name="root_application_veteran_ssn"]',
      testData.data.application.veteran.ssn,
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
    cy.selectRadio(
      'root_application_veteran_isDeceased',
      testData.data.application.veteran.isDeceased,
    );

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/veteran-information');

    // Military History
    preneedHelpers.validateProgressBar('3');
    errorCheck(requiredHelpers.militaryHistoryErrors);

    cy.get(
      'input[name="root_application_veteran_serviceRecords_0_serviceBranch"]',
      { timeout: Timeouts.verySlow },
    );
    testData.data.application.veteran.serviceRecords.forEach(
      (branch, index) => {
        cy.get(
          `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
        ).click();
        cy.fill(
          `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
          branch.serviceBranch,
        );
        cy.get(
          `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
        ).trigger('keydown', { keyCode: 40 });
        cy.get(
          `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
        ).trigger('keyup', { keyCode: 40 });
        cy.get(
          `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
        ).trigger('keydown', { keyCode: 13 });
        cy.get(
          `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
        ).trigger('keyup', { keyCode: 13 });
      },
    );

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-military-history');

    // Previous Names page
    errorCheck(requiredHelpers.previousNameErrors1);

    cy.get('label[for$="hasServiceNameYes"]').should('be.visible');
    cy.selectRadio('root_application_veteran_view:hasServiceName', 'Y');
    preneedHelpers.clickContinue();

    errorCheck(requiredHelpers.previousNameErrors2);

    cy.fill(
      'input[name=root_application_veteran_serviceName_first]',
      testData.data.application.veteran.serviceName.first,
    );
    cy.fill(
      'input[name=root_application_veteran_serviceName_last]',
      testData.data.application.veteran.serviceName.last,
    );

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-military-name');

    // Benefit Selection page 1
    preneedHelpers.validateProgressBar('4');
    errorCheck(requiredHelpers.burialBenefitsErrors1);

    cy.selectRadio(
      'root_application_hasCurrentlyBuried',
      testData.data.application.hasCurrentlyBuried,
    );
    preneedHelpers.clickContinue();

    // Benefit Selection page 2
    errorCheck(requiredHelpers.burialBenefitsErrors2);

    if (testData.data.application.currentlyBuriedPersons.length) {
      testData.data.application.currentlyBuriedPersons.forEach(
        (person, index) => {
          cy.fill(
            `input[name=root_application_currentlyBuriedPersons_${index}_name_first]`,
            person.name.first,
          );
          cy.fill(
            `input[name=root_application_currentlyBuriedPersons_${index}_name_last]`,
            person.name.last,
          );
        },
      );
    }

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/burial-benefits');

    // Supporting Documents page
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Claimant Contact Information page
    preneedHelpers.validateProgressBar('6');
    cy.get('select[name="root_application_claimant_address_country"]');

    errorCheck(requiredHelpers.applicantContactInfoErrors);

    cy.fillAddress(
      'root_application_claimant_address',
      testData.data.application.claimant.address,
    );
    cy.fill('input[name$="email"]', testData.data.application.claimant.email);
    cy.fill(
      'input[name$="phoneNumber"]',
      testData.data.application.claimant.phoneNumber,
    );

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/applicant-contact-information');

    // Veteran Contact Information page
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-mailing-address');

    // Preparer information
    preneedHelpers.validateProgressBar('6');
    cy.get(
      'label[for="root_application_applicant_applicantRelationshipToClaimant_1"]',
    );

    errorCheck(requiredHelpers.preparerInfoErrors1);

    cy.selectRadio(
      'root_application_applicant_applicantRelationshipToClaimant',
      testData.data.application.applicant.applicantRelationshipToClaimant,
    );
    if (
      testData.data.application.applicant.applicantRelationshipToClaimant ===
      'Authorized Agent/Rep'
    ) {
      errorCheck(requiredHelpers.preparerInfoErrors2);

      cy.fill(
        'input[name$="root_application_applicant_view:applicantInfo_name_first"]',
        testData.data.application.applicant.name.first,
      );
      cy.fill(
        'input[name$="root_application_applicant_view:applicantInfo_name_last"]',
        testData.data.application.applicant.name.last,
      );
      cy.fillAddress(
        'root_application_applicant_view\\:applicantInfo_mailingAddress',
        testData.data.application.applicant['view:applicantInfo']
          .mailingAddress,
      );
      cy.fill(
        'input[name$="root_application_applicant_view:applicantInfo_view:contactInfo_applicantPhoneNumber"]',
        testData.data.application.applicant.phoneNumber,
      );
    }

    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/preparer');

    // Review/Submit page
    cy.get('.form-progress-buttons .usa-button-primary').click();
    cy.get('#error-message').should('be.visible');
    preneedHelpers.submitForm();
  });
});
