import testData from './schema/maximal-test.json';
import preneedHelpers from './utils/cypress-preneed-helpers';

describe('Pre-need form VA 40-10007 Veteran Workflow', () => {
  it('fills the form and navigates accordingly as a veteran', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();

    // Applicant Information Page
    preneedHelpers.fillApplicantInfo(
      testData.data.application.veteran.currentName,
      testData.data.application.veteran.ssn,
      testData.data.application.veteran.dateOfBirth,
      testData.data.application.veteran.relationshipToVet,
      testData.data.application.veteran.placeOfBirth,
    );

    // Veteran Information Page
    preneedHelpers.validateProgressBar('1');
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
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/applicant-demographics');

    cy.fill(
      'input[name="root_application_veteran_militaryServiceNumber"]',
      testData.data.application.veteran.militaryServiceNumber,
    );
    cy.fill(
      'input[name="root_application_veteran_vaClaimNumber"]',
      testData.data.application.veteran.vaClaimNumber,
    );
    cy.get('#root_application_veteran_militaryStatus').select(
      testData.data.application.veteran.militaryStatus,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/applicant-military-details');

    // Military History Page
    preneedHelpers.validateProgressBar('2');
    preneedHelpers.fillMilitaryHistory(
      testData.data.application.veteran.serviceRecords,
    );
    cy.url().should('not.contain', '/applicant-military-history');

    // Previous Names Page
    preneedHelpers.fillPreviousName(testData.data.application.veteran);
    cy.url().should('not.contain', '/applicant-military-name');

    // Benefit Selection Page
    preneedHelpers.validateProgressBar('3');
    preneedHelpers.fillBenefitSelection(
      testData.data.application.veteran.desiredCemetery.label,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents Page
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Veteran Contact Information Page
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillApplicantContactInfo(testData.data.application.veteran);

    // Preparer Contact Information Page
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillPreparerInfo(testData.data.application.applicantForeign);

    // Review/Submit Page
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.submitForm();
  });
});
