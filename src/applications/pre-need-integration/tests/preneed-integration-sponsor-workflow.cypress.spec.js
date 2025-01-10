import testData from './fixtures/data/sponsor-test.json';
import preneedHelpers from './utils/cypress-preneed-integration-helpers';

const { applicant } = testData.data.application;
const { claimant } = testData.data.application;
const { veteran } = testData.data.application;

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
      applicant.applicantPhoneNumber,
      applicant.applicantEmail,
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
      'input[name="root_application_veteran_cityOfBirth"]',
      veteran.cityOfBirth,
    );
    cy.fill(
      'input[name="root_application_veteran_stateOfBirth"]',
      veteran.stateOfBirth,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();

    // Is Sponsor Deceased
    cy.selectRadio('root_application_veteran_isDeceased', veteran.isDeceased);
    cy.axeCheck();
    preneedHelpers.clickContinue();
    cy.fillDate('root_application_veteran_dateOfDeath', veteran.dateOfDeath);
    cy.axeCheck();
    preneedHelpers.clickContinue();

    preneedHelpers.fillVeteranDemographics(veteran);

    preneedHelpers.fillMilitaryHistory(
      veteran.militaryStatus,
      veteran.militaryServiceNumber,
      veteran.vaClaimNumber,
    );

    // Previous Names Page
    preneedHelpers.fillPreviousName(veteran);

    // Military History Page
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillServicePeriods(veteran.serviceRecords);

    // Benefit Selection Page
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.fillBenefitSelection(
      claimant.desiredCemetery,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents Page
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    preneedHelpers.validateProgressBar('7');
    preneedHelpers.clickContinue();

    // Review/Submit Page
    preneedHelpers.validateProgressBar('8');
    preneedHelpers.submitForm();
  });
});
