import Timeouts from 'platform/testing/e2e/timeouts';
import { countries } from 'vets-json-schema/dist/constants.json';
import cemeteries from '../fixtures/mocks/cemeteries.json';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import { serviceLabels } from '../../utils/labels';
import { rankLabels } from '../../utils/rankLabels';

function interceptSetup() {
  cy.intercept('POST', '/simple_forms_api/v1/simple_forms', {
    data: {
      attributes: {
        confirmationNumber: '123fake-submission-id-567',
        submittedAt: '2016-05-16',
      },
    },
  });
  cy.intercept('GET', '/v0/preneeds/cemeteries', cemeteries);
  cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
}

function invalidAddressIntercept() {
  cy.intercept('POST', '/v0/profile/address_validation', {
    data: {
      errors: [
        {
          title: 'Address Validation Error',
          detail: {
            messages: [
              {
                code: 'ADDRVAL108',
                key: 'CandidateAddressNotFound',
                text: 'No Candidate Address Found',
                severity: 'INFO',
              },
            ],
          },
          code: 'VET360_AV_ERROR',
          status: '400',
        },
      ],
    },
  });
}

// The string passed to this function should reflect the number of sections of the progress bar that are expected to be complete
function validateProgressBar(index) {
  cy.get('va-segmented-progress-bar')
    .shadow()
    .find(`.usa-step-indicator__segments > li:nth-child(${index})`)
    .should('have.class', 'usa-step-indicator__segment--current');
}

// Ensures the address that autoppoulates on the unconfirmed suggested address page is as expected
function validateAddressUnconfirmed(
  street1,
  street2,
  city,
  country,
  state,
  zip,
) {
  if (country === 'USA') {
    cy.get('.blue-bar-block > p').should(
      'have.text',
      `${street1}${street2}${city}, ${state} ${zip}`,
    );
  } else {
    const cnt = countries.find(({ value }) => value === country).label;
    cy.get('.blue-bar-block > p').should(
      'have.text',
      `${street1}${street2}${city}, ${zip}${cnt}`,
    );
  }
}

// Clicks continue and then optionally checks to make sure the form page url is as expected
function clickContinue() {
  cy.get('.form-panel .usa-button-primary').click();
}

// Types a text value into an autocomplete field, presses down arrow key (40), presses enter key (13)
function autoSuggestFirstResult(field, value) {
  cy.get(field).type(value);
  cy.get(field).trigger('keydown', { keyCode: 40 });
  cy.get(field).trigger('keyup', { keyCode: 40 });
  cy.get(field).trigger('keydown', { keyCode: 13 });
  cy.get(field).trigger('keyup', { keyCode: 13 });
  cy.get('body').click();
}

// Visits the pre-need intro page, validates the title, clicks start application
function visitIntro() {
  cy.visit(
    '/burials-memorials/pre-need/form-10007-apply-for-eligibility/introduction',
  );
  cy.get('body').should('be.visible');
  cy.title().should(
    'contain',
    '40-10007 Burial pre-need eligibility determination | Veterans Affairs',
  );
  cy.get('.schemaform-title', { timeout: Timeouts.slow }).should('be.visible');
  cy.injectAxeThenAxeCheck();
  cy.get('.schemaform-start-button')
    .first()
    .click();
  cy.url().should('contain', '/preparer');
}

// Fills Preparer Contact Information page performs axe check, continues to next page.
// Fills Preparer Deatils and Preparer Mailing address conditional pages if the preparer is not the applicant.
function fillPreparerInfo(preparer) {
  validateProgressBar('1');
  cy.selectRadio(
    'root_application_applicant_applicantRelationshipToClaimant',
    preparer.applicantRelationshipToClaimant,
  );
  cy.axeCheck();
  clickContinue();
  if (preparer.applicantRelationshipToClaimant === 'Authorized Agent/Rep') {
    // Preparer Details
    cy.fill(
      'input[name="root_application_applicant_name_first"]',
      preparer.name.first,
    );
    cy.fill(
      'input[name="root_application_applicant_name_last"]',
      preparer.name.last,
    );
    cy.axeCheck();
    clickContinue();

    // Preparer Mailing address
    cy.fillAddress(
      'root_application_applicant_view\\:applicantInfo_mailingAddress',
      preparer.mailingAddress,
    );
    cy.fill(
      'input[name="root_application_applicant_view:applicantInfo_mailingAddress_state"]',
      preparer.state,
    );
    cy.fill(
      'input[name$="applicantPhoneNumber"]',
      preparer.applicantPhoneNumber,
    );
    cy.fill(
      'input[name="root_application_applicant_view\\:contactInfo_applicantEmail"]',
      preparer.applicantEmail,
    );
    cy.axeCheck();
    clickContinue();

    // Address validation page
    validateAddressUnconfirmed(
      preparer.mailingAddress.street,
      preparer.mailingAddress.street2,
      preparer.mailingAddress.city,
      preparer.mailingAddress.country,
      preparer.mailingAddress.state,
      preparer.mailingAddress.postalCode,
    );
    cy.axeCheck();
    clickContinue();
  }
}

// Fills all fields on the Applicant Information page , performs axe check, continues to next page
function fillApplicantInfo(name, ssn, dob, relationship, city, state) {
  cy.get('#root_application_claimant_relationshipToVet').select(relationship);
  cy.axeCheck();
  clickContinue();

  cy.fillName('root_application_claimant_name', name);
  cy.fill('#root_application_claimant_name_maiden', name.maiden);
  cy.fill('input[name="root_application_claimant_ssn"]', ssn);
  cy.fillDate('root_application_claimant_dateOfBirth', dob);

  if (relationship === 'veteran') {
    cy.fill('input[name="root_application_veteran_cityOfBirth"]', city);
    cy.fill('input[name="root_application_veteran_stateOfBirth"]', state);
  }
  cy.axeCheck();
  clickContinue();
}

// Fills Applicant Contact Information page, performs axe check, continues to next page
function fillApplicantContactInfo(address, phone, email) {
  cy.fillAddress('root_application_claimant_address', address);
  cy.fill('input[name$="phoneNumber"]', phone);
  cy.fill('input[name$="email"]', email);
  cy.axeCheck();
  clickContinue();
  validateAddressUnconfirmed(
    address.street,
    address.street2,
    address.city,
    address.country,
    address.state,
    address.postalCode,
  );
  cy.axeCheck();
  clickContinue();
}

// Checks if sponsor is deceased and if so fills in the date of death
function fillSponsorDeceased(deceased, dod) {
  cy.selectRadio('root_application_veteran_isDeceased', deceased);
  cy.axeCheck();
  clickContinue();
  if (deceased === 'yes') {
    cy.fillDate('root_application_veteran_dateOfDeath', dod);
    cy.axeCheck();
    clickContinue();
  }
}

// Selects Demographics radio buttons, coninues to next page and selects race radio/checkboxes
// Optionally fills in the Other text box if that checkbox is selected
function fillVeteranDemographics(veteran) {
  cy.selectRadio('root_application_veteran_gender', veteran.gender);
  cy.selectRadio(
    'root_application_veteran_maritalStatus',
    veteran.maritalStatus,
  );
  cy.axeCheck();
  clickContinue();

  cy.selectRadio('root_application_veteran_ethnicity', veteran.ethnicity);
  Object.keys(veteran.race).map(checkbox =>
    cy.selectVaCheckbox(`root_application_veteran_race_${checkbox}`, true),
  );
  if (veteran.race.isOther) {
    cy.get('#root_application_veteran_raceComment').type(veteran.raceComment);
  }
  cy.axeCheck();
  clickContinue();
}

// Selects Military Status drop-down and fills Military Service and VA Claim number text fields
function fillMilitaryHistory(status, serviceNumber, claimNumber) {
  cy.selectVaSelect('root_application_veteran_militaryStatus', status);
  cy.fill(
    'input[name="root_application_veteran_militaryServiceNumber"]',
    serviceNumber,
  );
  cy.fill('input[name="root_application_veteran_vaClaimNumber"]', claimNumber);
  cy.axeCheck();
  clickContinue();
}

// Fills in previous name information if the veteran has it, performs axe check, continues to next page
function fillPreviousName(veteran) {
  if (veteran.serviceName.first) {
    cy.selectRadio('root_application_veteran_view:hasServiceName', 'Y');
    cy.axeCheck();
    clickContinue();
    cy.fillName('root_application_veteran_serviceName', veteran.serviceName);
  } else {
    cy.selectRadio('root_application_veteran_view:hasServiceName', 'N');
  }
  cy.axeCheck();
  clickContinue();
}

// Fills in any existing military history data, performs axe check, continues to next page
function fillServicePeriods(serviceRecord) {
  cy.axeCheck();
  clickContinue();

  serviceRecord.forEach((tour, index) => {
    cy.get('h3').should('be.focused');
    autoSuggestFirstResult(
      '#root_serviceBranch',
      serviceLabels[tour.serviceBranch],
    );
    cy.fillDate('root_dateRange_from', tour.dateRange.from);
    cy.fillDate('root_dateRange_to', tour.dateRange.to);
    autoSuggestFirstResult('#root_highestRank', rankLabels[tour.highestRank]);
    cy.get('#root_dischargeType').select(tour.dischargeType);
    clickContinue();
    // Keep adding them until we're finished.
    if (index < serviceRecord.length - 1) {
      cy.selectRadio('root_view:hasServicePeriods', 'Y');
      clickContinue();
    } else {
      cy.selectRadio('root_view:hasServicePeriods', 'N');
    }
  });
  cy.axeCheck();
  clickContinue();
}

// Fills both previous name pages and the desired cemetery page, performs axe checks on each, continues to next page
function fillBenefitSelection(
  desiredCemetery,
  hasCurrentlyBuried,
  currentlyBuriedPersons,
) {
  // Previous Name Page 1
  cy.selectRadio('root_application_hasCurrentlyBuried', hasCurrentlyBuried);
  cy.axeCheck();
  clickContinue();

  // Previous Name Page 2
  if (hasCurrentlyBuried === '1') {
    if (currentlyBuriedPersons.length) {
      currentlyBuriedPersons.forEach((person, index) => {
        cy.get(
          `input#root_application_currentlyBuriedPersons_${index}_name_first`,
        ).type(person.name.first);
        cy.get(
          `input#root_application_currentlyBuriedPersons_${index}_name_last`,
        ).type(person.name.last);

        if (index < currentlyBuriedPersons.length - 1) {
          cy.get('.usa-button-secondary.va-growable-add-btn').click();
        }
      });
    }
    cy.axeCheck();
    clickContinue();
  }

  // Desired Cemetery Page
  autoSuggestFirstResult(
    '#root_application_claimant_desiredCemetery',
    cemeteries.data.find(({ id }) => id === desiredCemetery).attributes.name,
  );
  cy.axeCheck();
  clickContinue();
}

// Submit Form
function submitForm() {
  cy.get('[name="privacyAgreementAccepted"]')
    .find('[type="checkbox"]')
    .check({
      force: true,
    });

  cy.axeCheck();
  cy.get('.form-progress-buttons .usa-button-primary').click();
  cy.url().should('contain', '/confirmation');

  cy.get('.js-test-location', { timeout: Timeouts.slow })
    .invoke('attr', 'data-location')
    .should('contain', '/confirmation');

  cy.get('.usa-width-two-thirds > :nth-child(4) > :nth-child(1)').should(
    'contain',
    'You’ve submitted your application',
  );
  cy.axeCheck();
}

module.exports = {
  interceptSetup,
  invalidAddressIntercept,
  validateProgressBar,
  validateAddressUnconfirmed,
  clickContinue,
  autoSuggestFirstResult,
  visitIntro,
  fillPreparerInfo,
  fillApplicantInfo,
  fillApplicantContactInfo,
  fillSponsorDeceased,
  fillVeteranDemographics,
  fillMilitaryHistory,
  fillPreviousName,
  fillServicePeriods,
  fillBenefitSelection,
  submitForm,
};
