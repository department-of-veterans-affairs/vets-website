import testData from './fixtures/data/sponsor-test.json';
import preneedHelpers from './utils/cypress-preneed-integration-helpers';

const { applicant } = testData.data.application;
const { claimant } = testData.data.application;
const { veteran } = testData.data.application;

// hard coded for now; found in veteran.race
const demographicCheckboxes = ['isBlackOrAfricanAmerican', 'isOther'];

describe('Pre-need form VA 40-10007 Sponsor Workflow', () => {
  it('fills the form and navigates accordingly as a non-veteran with a sponsor', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.visitIntro();

    // Preparer Information
    preneedHelpers.fillPreparerInfo(applicant);

    // Applicant Information Page
    preneedHelpers.validateProgressBar('2');
    preneedHelpers.fillApplicantInfo(
      claimant.name,
      claimant.ssn,
      claimant.dateOfBirth,
      claimant.relationshipToVet,
    );
    preneedHelpers.fillApplicantContactInfo(
      applicant.mailingAddress,
      applicant.applicantEmail,
      applicant.applicantPhoneNumber,
    );

    cy.selectRadio('root_application_applicant_isSponsor', applicant.isSponsor);
    preneedHelpers.clickContinue();

    // Veteran/Sponsor Information Page
    preneedHelpers.validateProgressBar('3');
    cy.fillName('root_application_veteran_currentName', veteran.currentName);
    cy.fill(
      '#root_application_veteran_currentName_maiden',
      veteran.currentName.maiden,
    );
    cy.fill('input[name="root_application_veteran_ssn"]', veteran.ssn);
    cy.fillDate('root_application_veteran_dateOfBirth', veteran.dateOfBirth);
    cy.fill(
      'input[name="root_application_veteran_placeOfBirth"]',
      veteran.placeOfBirth,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-details');

    // Is Sponsor Deceased
    cy.selectRadio('root_application_veteran_isDeceased', veteran.isDeceased);
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-deceased');
    cy.fillDate('root_application_veteran_dateOfDeath', veteran.dateOfDeath);
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-date-of-death');

    preneedHelpers.fillVeteranDemographics(veteran, demographicCheckboxes);

    preneedHelpers.fillMilitaryHistory(
      veteran.militaryStatus,
      veteran.militaryServiceNumber,
      veteran.vaClaimNumber,
    );

    // Previous Names Page
    preneedHelpers.fillPreviousName(testData.data.application.veteran);
    cy.url().should('not.contain', '/sponsor-military-name');

    // Military History Page
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillServicePeriods(
      testData.data.application.veteran.serviceRecords,
    );
    cy.url().should('not.contain', '/sponsor-military-history');

    // Benefit Selection Page
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.fillBenefitSelection(
      testData.data.application.claimant.desiredCemetery.label,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents Page
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/supporting-documents');

    // Applicant/Claimant Contact Information Page
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.fillApplicantContactInfo(testData.data.application.claimant);

    // Veteran Contact Information Page
    preneedHelpers.validateProgressBar('6');
    cy.fillAddress(
      'root_application_veteran_address',
      testData.data.application.veteran.address,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.url().should('not.contain', '/sponsor-mailing-address');

    // Preparer Contact Information Page
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.fillPreparerInfo(testData.data.application.applicant);

    // Review/Submit Page
    preneedHelpers.validateProgressBar('7');
    preneedHelpers.submitForm();
  });
});
