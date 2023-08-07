import Timeouts from 'platform/testing/e2e/timeouts';
import testData from './schema/maximal-test.json';
import preneedHelpers from './utils/cypress-preneed-helpers';

describe('Pre-need form VA 40-10007 Sponsor Workflow', () => {
  it('fills the form and navigates accordingly as a non-veteran with a sponsor', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();

    // Applicant Information
    preneedHelpers.fillApplicantInfo(
      testData.data.application.claimant.name,
      testData.data.application.claimant.ssn,
      testData.data.application.claimant.dateOfBirth,
      testData.data.application.claimant.relationshipToVet,
    );

    // Veteran Information
    cy.get('input[name="root_application_veteran_currentName_first"]');
    preneedHelpers.validateProgressBar('2');

    cy.fillName(
      'root_application_veteran_currentName',
      testData.data.application.veteran.currentName,
    );
    cy.fill(
      'input[name="root_application_veteran_ssn"]',
      testData.data.application.veteran.ssn,
    );
    cy.fill(
      'input[name="root_application_veteran_militaryServiceNumber"]',
      testData.data.application.veteran.militaryServiceNumber,
    );
    cy.fillDate(
      'root_application_veteran_dateOfBirth',
      testData.data.application.veteran.dateOfBirth,
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
    cy.selectRadio(
      'root_application_veteran_isDeceased',
      testData.data.application.veteran.isDeceased,
    );
    cy.fillDate(
      'root_application_veteran_dateOfDeath',
      testData.data.application.veteran.dateOfDeath,
    );

    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/veteran-information');

    // Military History
    cy.get(
      'input[name="root_application_veteran_serviceRecords_0_serviceBranch"]',
      { timeout: Timeouts.verySlow },
    );
    preneedHelpers.validateProgressBar('3');
    preneedHelpers.fillMilitaryHistory(
      testData.data.application.veteran.serviceRecords,
    );
    cy.url().should('not.contain', '/sponsor-military-history');

    // Previous Names page
    preneedHelpers.fillPreviousName(
      testData.data.application.veteran.serviceName,
    );
    cy.url().should('not.contain', '/sponsor-military-name');

    // Benefit Selection page
    cy.get('label[for="root_application_claimant_desiredCemetery"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.fillBenefitSelection(
      testData.data.application.claimant.desiredCemetery.label,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents page
    cy.get('label[for="root_application_preneedAttachments"]');
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Claimant Contact Information page
    cy.get('select[name="root_application_claimant_address_country"]');
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.fillApplicantContactInfo(testData.data.application.claimant);

    // Veteran Contact Information page
    cy.get('select[name="root_application_veteran_address_country"]');
    preneedHelpers.validateProgressBar('6');
    cy.fillAddress(
      'root_application_veteran_address',
      testData.data.application.veteran.address,
    );

    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-mailing-address');

    // Preparer Contact Information page
    cy.get(
      'label[for="root_application_applicant_applicantRelationshipToClaimant_1"]',
    );
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.fillPreparerInfo(testData.data.application.applicant);

    // Review/Submit Page
    preneedHelpers.validateProgressBar('7');
    preneedHelpers.submitForm();
  });
});
