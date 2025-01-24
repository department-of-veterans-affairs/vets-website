import testData from './fixtures/data/sponsor-test.json';
import preneedHelpers from './utils/cypress-preneed-integration-helpers';

const { applicant } = testData.data.application;
const { claimant } = testData.data.application;
const { veteran } = testData.data.application;

describe('Pre-need form VA 40-10007 Sponsor Workflow', () => {
  it('fills the form and navigates accordingly as a non-veteran with a sponsor', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.invalidAddressIntercept();
    preneedHelpers.visitIntro();

    // Preparer Information
    preneedHelpers.fillPreparerInfo(applicant);

    // Applicant Information
    preneedHelpers.validateProgressBar('2');
    preneedHelpers.fillApplicantInfo(
      claimant.name,
      claimant.ssn,
      claimant.dateOfBirth,
      claimant.relationshipToVet,
    );

    // Applicant Details
    preneedHelpers.fillApplicantContactInfo(
      claimant.address,
      claimant.phoneNumber,
      claimant.email,
    );

    // Are you the applicant's sponsor?
    cy.selectRadio('root_application_applicant_isSponsor', applicant.isSponsor);
    cy.axeCheck();
    preneedHelpers.clickContinue();

    // Sponsor Details
    // Ensuring all contact information autocompletes when indicating that the preparer is the applicant's sponsor
    preneedHelpers.validateProgressBar('3');
    cy.get('#root_application_veteran_currentName_first').should(
      'have.value',
      applicant.name.first,
    );
    cy.get('#root_application_veteran_currentName_last').should(
      'have.value',
      applicant.name.last,
    );
    cy.get('#root_application_veteran_currentName_suffix').select(
      veteran.currentName.suffix,
    );
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

    // Sponsor Mailing Address/Contact Details
    cy.get('#root_application_veteran_address_country').should(
      'have.value',
      applicant.mailingAddress.country,
    );
    cy.get('#root_application_veteran_address_street').should(
      'have.value',
      applicant.mailingAddress.street,
    );
    cy.get('#root_application_veteran_address_street2').should(
      'have.value',
      applicant.mailingAddress.street2,
    );
    cy.get('#root_application_veteran_address_city').should(
      'have.value',
      applicant.mailingAddress.city,
    );
    cy.get('#root_application_veteran_address_state').should(
      'have.value',
      applicant.mailingAddress.state,
    );
    cy.get('#root_application_veteran_address_postalCode').should(
      'have.value',
      applicant.mailingAddress.postalCode,
    );
    cy.get('#root_application_veteran_phoneNumber').should(
      'have.value',
      applicant.applicantPhoneNumber,
    );
    cy.get('#root_application_veteran_email').should(
      'have.value',
      applicant.applicantEmail,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();

    // Address Validation
    preneedHelpers.validateAddressUnconfirmed(
      applicant.mailingAddress.street,
      applicant.mailingAddress.street2,
      applicant.mailingAddress.city,
      applicant.mailingAddress.country,
      applicant.mailingAddress.state,
      applicant.mailingAddress.postalCode,
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();

    // Sponsor Demographics
    preneedHelpers.fillVeteranDemographics(veteran);

    // Sponsor Military Details
    preneedHelpers.fillMilitaryHistory(
      veteran.militaryStatus,
      veteran.militaryServiceNumber,
      veteran.vaClaimNumber,
    );

    // Previous Names
    preneedHelpers.fillPreviousName(veteran);

    // Military History
    preneedHelpers.validateProgressBar('5');
    preneedHelpers.fillServicePeriods(veteran.serviceRecords);

    // Previously Buried Person(s)
    preneedHelpers.validateProgressBar('6');
    preneedHelpers.fillBenefitSelection(
      claimant.desiredCemetery,
      testData.data.application.hasCurrentlyBuried,
      testData.data.application.currentlyBuriedPersons,
    );

    // Supporting Documents
    preneedHelpers.validateProgressBar('7');
    cy.get('label[for="root_application_preneedAttachments"]').should(
      'be.visible',
    );
    cy.axeCheck();
    preneedHelpers.clickContinue();

    // Review/Submit
    preneedHelpers.validateProgressBar('8');
    preneedHelpers.submitForm();
  });
});
