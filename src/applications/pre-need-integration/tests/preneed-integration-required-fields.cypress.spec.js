import requiredHelpers from './utils/cypress-integration-required-field-helpers';
import testData from './fixtures/data/required-test.json';
import preneedHelpers from './utils/cypress-preneed-integration-helpers';
import { serviceLabels } from '../utils/labels';

const { applicant } = testData.data.application;
const { claimant } = testData.data.application;
const { veteran } = testData.data.application;
const { serviceRecords } = testData.data.application.veteran;
const { currentlyBuriedPersons } = testData.data.application;

// Clicks continue, checks for any expected error messages, performs an axe check
function errorCheck(errorList) {
  cy.get('.form-panel .usa-button-primary').click({ waitForAnimations: true });
  errorList?.map(id =>
    cy.get(`#root_application_${id}-error-message`).should('be.visible'),
  );
  cy.axeCheck();
}

describe('Pre-need form VA 40-10007 Required Fields', () => {
  // will add back in once URL is updated
  it.skip('triggers validation on all required fields then completes the form with minimal data', () => {
    preneedHelpers.interceptSetup();
    preneedHelpers.invalidAddressIntercept();
    preneedHelpers.visitIntro();

    // Preparer Information Page 1
    preneedHelpers.validateProgressBar('1');
    errorCheck(requiredHelpers.preparerInfoErrors1);
    cy.selectRadio(
      'root_application_applicant_applicantRelationshipToClaimant',
      applicant.applicantRelationshipToClaimant,
    );
    preneedHelpers.clickContinue();

    // Preparer Information Page 2
    if (applicant.applicantRelationshipToClaimant === 'Authorized Agent/Rep') {
      errorCheck(requiredHelpers.preparerInfoErrors2);
      cy.fill(
        'input[name$="root_application_applicant_name_first"]',
        applicant.name.first,
      );
      cy.fill(
        'input[name$="root_application_applicant_name_last"]',
        applicant.name.last,
      );
      preneedHelpers.clickContinue();

      // Preparer Information Page 3
      errorCheck(requiredHelpers.preparerInfoErrors3);
      cy.fillAddress(
        'root_application_applicant_view\\:applicantInfo_mailingAddress',
        applicant.mailingAddress,
      );
      cy.get(
        '#root_application_applicant_view\\:contactInfo_applicantPhoneNumber',
      ).type(applicant.applicantPhoneNumber);
      cy.get(
        '#root_application_applicant_view\\:contactInfo_applicantEmail',
      ).type(applicant.applicantEmail);
    }
    preneedHelpers.clickContinue();

    // Address Validation
    preneedHelpers.clickContinue();

    // Applicant Information Page 1
    preneedHelpers.validateProgressBar('2');
    errorCheck(requiredHelpers.applicantRelationshipToVetErrors);
    cy.get('#root_application_claimant_relationshipToVet').select(
      claimant.relationshipToVet,
    );
    preneedHelpers.clickContinue();

    // Applicant Information Page 2
    errorCheck(requiredHelpers.applicantDetailsErrors);
    cy.fill(
      'input[name=root_application_claimant_name_first]',
      claimant.name.first,
    );
    cy.fill(
      'input[name=root_application_claimant_name_last]',
      claimant.name.last,
    );
    cy.fill('input[name="root_application_claimant_ssn"]', claimant.ssn);
    cy.fillDate('root_application_claimant_dateOfBirth', claimant.dateOfBirth);

    preneedHelpers.clickContinue();

    // Applicant Information Page 3
    errorCheck(requiredHelpers.applicantContactInfoErrors);
    cy.fillAddress('root_application_claimant_address', claimant.address);
    cy.fill('input[name$="phoneNumber"]', claimant.phoneNumber);
    cy.fill('input[name$="email"]', claimant.email);
    preneedHelpers.clickContinue();

    // Address Validation
    preneedHelpers.clickContinue();

    // Are you the sponsor
    preneedHelpers.validateProgressBar('3');
    errorCheck(requiredHelpers.veteranDetailsErrors1);
    cy.selectRadio('root_application_applicant_isSponsor', applicant.isSponsor);
    preneedHelpers.clickContinue();

    // Sponsor Information
    errorCheck(requiredHelpers.veteranDetailsErrors2);
    cy.get('#root_application_veteran_currentName_first').type(
      veteran.currentName.first,
    );
    cy.get('#root_application_veteran_currentName_last').type(
      veteran.currentName.last,
    );
    cy.fill('input[name="root_application_veteran_ssn"]', veteran.ssn);
    preneedHelpers.clickContinue();

    // Is Sponsor Deceased
    errorCheck(requiredHelpers.veteranDeceasedErrors);
    preneedHelpers.fillSponsorDeceased(veteran.isDeceased, veteran.dateOfDeath);

    // Sponsor Demographics Page 1
    errorCheck(requiredHelpers.veteranDemographicsErrors1);
    cy.selectRadio('root_application_veteran_gender', veteran.gender);
    cy.selectRadio(
      'root_application_veteran_maritalStatus',
      veteran.maritalStatus,
    );
    preneedHelpers.clickContinue();

    // Sponsor Demographics Page 2
    errorCheck(requiredHelpers.veteranDemographicsErrors2);
    cy.get('#checkbox-error-message')
      .should('contain', 'Please provide a response.')
      .should('be.visible');
    cy.selectRadio('root_application_veteran_ethnicity', veteran.ethnicity);
    cy.selectVaCheckbox('root_application_veteran_race_na', true);
    cy.selectVaCheckbox('root_application_veteran_race_isOther', true);
    errorCheck(requiredHelpers.veteranDemographicsErrors3);
    cy.get('#checkbox-error-message')
      .should(
        'contain',
        'When selecting Prefer not to answer, you can’t have another option.',
      )
      .should('be.visible');
    cy.selectVaCheckbox('root_application_veteran_race_na', false);
    cy.selectVaCheckbox('root_application_veteran_race_isOther', false);
    Object.keys(veteran.race).map(checkbox =>
      cy.selectVaCheckbox(`root_application_veteran_race_${checkbox}`, true),
    );
    if (veteran.race.isOther) {
      cy.get('#root_application_veteran_raceComment').type(veteran.raceComment);
    }
    preneedHelpers.clickContinue();

    // Military History Page 1
    preneedHelpers.validateProgressBar('4');
    preneedHelpers.clickContinue();
    cy.get('#input-error-message')
      .should('contain', 'You must provide a response')
      .should('be.visible');
    cy.axeCheck();
    cy.selectVaSelect(
      'root_application_veteran_militaryStatus',
      veteran.militaryStatus,
    );
    preneedHelpers.clickContinue();

    // Military History Page 2
    errorCheck(requiredHelpers.previousNameErrors1);
    if (veteran.serviceName.first) {
      cy.selectRadio('root_application_veteran_view:hasServiceName', 'Y');
      preneedHelpers.clickContinue();
    } else {
      cy.selectRadio('root_application_veteran_view:hasServiceName', 'N');
      preneedHelpers.clickContinue();
    }

    // Military History Page 3
    errorCheck(requiredHelpers.previousNameErrors2);
    cy.fill(
      'input[name=root_application_veteran_serviceName_first]',
      veteran.serviceName.first,
    );
    cy.fill(
      'input[name=root_application_veteran_serviceName_last]',
      veteran.serviceName.last,
    );
    preneedHelpers.clickContinue();

    // Service Records
    preneedHelpers.clickContinue();
    veteran.serviceRecords.forEach((tour, index) => {
      // Trigger Sponsor's Service Branch error message and check for it
      cy.get('.form-panel .usa-button-primary').click({
        waitForAnimations: true,
      });
      cy.get('#root_serviceBranch-error-message').should('be.visible');
      cy.axeCheck();
      preneedHelpers.autoSuggestFirstResult(
        '#root_serviceBranch',
        serviceLabels[tour.serviceBranch],
      );
      preneedHelpers.clickContinue();
      // Trigger Additional Service Peridos error message and check for it
      cy.get('.form-panel .usa-button-primary').click({
        waitForAnimations: true,
      });
      cy.contains(
        'Select yes if you have another service period to add',
      ).should('be.visible');
      cy.axeCheck();

      // Keep adding them until we're finished.
      if (index < serviceRecords.length - 1) {
        cy.selectRadio('root_view:hasServicePeriods', 'Y');
        preneedHelpers.clickContinue();
      } else {
        cy.selectRadio('root_view:hasServicePeriods', 'N');
      }
    });
    preneedHelpers.clickContinue();

    // Previously Buried Person(s) Page 1
    preneedHelpers.validateProgressBar('6');
    errorCheck(requiredHelpers.burialBenefitsErrors);
    cy.selectRadio(
      'root_application_hasCurrentlyBuried',
      testData.data.application.hasCurrentlyBuried,
    );
    preneedHelpers.clickContinue();

    // Previously Buried Person(s) Page 1
    currentlyBuriedPersons.forEach((person, index) => {
      errorCheck([
        `currentlyBuriedPersons_${index}_name_first`,
        `currentlyBuriedPersons_${index}_name_last`,
      ]);
      cy.fill(
        `input[name=root_application_currentlyBuriedPersons_${index}_name_first]`,
        person.name.first,
      );
      cy.fill(
        `input[name=root_application_currentlyBuriedPersons_${index}_name_last]`,
        person.name.last,
      );
      if (index < currentlyBuriedPersons.length - 1) {
        cy.get('.usa-button-secondary.va-growable-add-btn').click();
      }
    });
    preneedHelpers.clickContinue();

    // Desired Cemetery
    cy.get('#root_application_claimant_desiredCemetery').type(
      'AAAAAAAAAAAAAAAA',
    );
    errorCheck(preneedHelpers.preferredCemeteryErrors);
    cy.get('#root_application_claimant_desiredCemetery').clear();
    preneedHelpers.clickContinue();

    // Supporting Documents Page
    preneedHelpers.validateProgressBar('7');
    preneedHelpers.clickContinue();

    // Review/Submit Page
    preneedHelpers.submitForm();
  });
});
