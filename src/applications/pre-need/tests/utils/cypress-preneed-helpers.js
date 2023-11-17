import Timeouts from 'platform/testing/e2e/timeouts';
import cemeteries from '../fixtures/mocks/cemeteries.json';
import featureToggles from '../fixtures/mocks/feature-toggles.json';

function interceptSetup() {
  cy.intercept('POST', '/v0/preneeds/burial_forms', {
    data: {
      attributes: {
        confirmationNumber: '123fake-submission-id-567',
        submittedAt: '2016-05-16',
      },
    },
  });
  cy.intercept('POST', '/v0/preneeds/preneed_attachments', {
    data: {
      attributes: {
        attachmentId: '1',
        name: 'VA40-10007.pdf',
        confirmationCode: 'e2128ec4-b2fc-429c-bad2-e4b564a80d20',
      },
    },
  });
  cy.intercept('GET', '/v0/preneeds/cemeteries', cemeteries);
  cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
}

// The string passed to this function should reflect the number of sections of the progress bar that are expected to be complete
function validateProgressBar(index) {
  cy.get('va-segmented-progress-bar')
    .shadow()
    .find(`.progress-bar-segmented div.progress-segment:nth-child(${index})`)
    .should('have.class', 'progress-segment-complete');
}

function clickContinue() {
  cy.get('.form-panel .usa-button-primary').click();
}

// Visits the pre-need intro page, validates the title, clicks start application
function visitIntro() {
  cy.visit('/burials-and-memorials/pre-need/form-10007-apply-for-eligibility');
  cy.get('body').should('be.visible');
  cy.title().should(
    'contain',
    'Apply online for pre-need determination of eligibility in a VA National Cemetery | Veterans Affairs',
  );
  cy.get('.schemaform-title', { timeout: Timeouts.slow }).should('be.visible');
  cy.injectAxeThenAxeCheck();
  cy.get('.schemaform-start-button')
    .first()
    .click();
  cy.url().should('not.contain', '/introduction');
}

// Fills all fields on the Applicant Information page , performs axe check, continues to next page
function fillApplicantInfo(name, ssn, dob, relationship, placeOfBirth) {
  validateProgressBar('1');

  cy.selectRadio('root_application_claimant_relationshipToVet', relationship);
  clickContinue();
  cy.url().should(
    'not.contain',
    '/form-10007-apply-for-eligibility/applicant-relationship-to-vet',
  );

  cy.fillName('root_application_claimant_name', name);
  cy.fill('#root_application_claimant_name_maiden', name.maiden);
  cy.fill('input[name="root_application_claimant_ssn"]', ssn);
  cy.fillDate('root_application_claimant_dateOfBirth', dob);

  if (relationship === '1') {
    cy.fill(
      'input[name="root_application_veteran_placeOfBirth"]',
      placeOfBirth,
    );
  }

  clickContinue();
  cy.url().should(
    'not.contain',
    '/form-10007-apply-for-eligibility/applicant-details',
  );
}

// Fills in any existing military history data, performs axe check, continues to next page
function fillMilitaryHistory(serviceRecord) {
  serviceRecord.forEach((tour, index) => {
    cy.fillDate(
      `root_application_veteran_serviceRecords_${index}_dateRange_from`,
      tour.dateRange.from,
    );
    cy.fillDate(
      `root_application_veteran_serviceRecords_${index}_dateRange_to`,
      tour.dateRange.to,
    );
    cy.get(
      `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
    ).click();
    cy.fill(
      `input[name="root_application_veteran_serviceRecords_${index}_serviceBranch"]`,
      'ALLIED FORCES',
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

    cy.fill(
      `input[name="root_application_veteran_serviceRecords_${index}_highestRank"]`,
      tour.highestRank,
    );
    cy.get(
      `#root_application_veteran_serviceRecords_${index}_dischargeType`,
    ).select(tour.dischargeType);

    // Keep adding them until we're finished.
    if (index < serviceRecord.length - 1) {
      cy.get('.usa-button-secondary.va-growable-add-btn').click();
    }
  });
  cy.axeCheck();
  clickContinue();
}

// Fills in previous name information if the veteran has it, performs axe check, continues to next page
function fillPreviousName(veteran) {
  if (veteran['view:hasServiceName']) {
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

// Fills both benefit selection pages, performs axe checks on each, continues to next page
function fillBenefitSelection(
  desiredCemetery,
  hasCurrentlyBuried,
  currentlyBuriedPersons,
) {
  // Page 1
  cy.fill(
    'input[name="root_application_claimant_desiredCemetery"]',
    desiredCemetery,
  );
  cy.get('.autosuggest-item', { timeout: Timeouts.slow }).should('exist');
  cy.get('body').click();
  cy.selectRadio('root_application_hasCurrentlyBuried', hasCurrentlyBuried);
  cy.axeCheck();
  clickContinue();

  // Page 2
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
    cy.url().should('not.contain', '/burial-benefits');
  }
}

// Fills Applicant Contact Information page, performs axe check, continues to next page
function fillApplicantContactInfo(contact) {
  cy.fillAddress('root_application_claimant_address', contact.address);
  cy.fill('input[name$="email"]', contact.email);
  cy.fill('input[name$="phoneNumber"]', contact.phoneNumber);
  cy.axeCheck();
  clickContinue();
  cy.url().should('not.contain', '/applicant-contact-information');
}

// Fills Preparer Contact Information page performs axe check, continues to next page.
// Fills Preparer Deatils and Preparer Mailing address conditional pages if the preparer is not the applicant.
function fillPreparerInfo(preparer) {
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
      preparer['view:applicantInfo'].name.first,
    );
    cy.fill(
      'input[name="root_application_applicant_name_last"]',
      preparer['view:applicantInfo'].name.last,
    );
    cy.axeCheck();
    clickContinue();
    // Preparer Mailing address
    cy.url().should('not.contain', '/preparer-details');

    cy.fillAddress(
      'root_application_applicant_view\\:applicantInfo_mailingAddress',
      preparer['view:applicantInfo'].mailingAddress,
    );
    cy.fill(
      'input[name="root_application_applicant_view:applicantInfo_mailingAddress_state"]',
      preparer.state,
    );
    cy.fill(
      'input[name$="applicantPhoneNumber"]',
      preparer['view:applicantInfo']['view:contactInfo'].applicantPhoneNumber,
    );
    cy.axeCheck();
    clickContinue();
  }
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
  cy.url().should('not.contain', '/review-and-submit');

  cy.get('.js-test-location', { timeout: Timeouts.slow })
    .invoke('attr', 'data-location')
    .should('not.contain', '/review-and-submit');

  cy.get('.confirmation-page-title').should('be.visible');
  cy.axeCheck();
}

module.exports = {
  clickContinue,
  interceptSetup,
  visitIntro,
  validateProgressBar,
  fillApplicantInfo,
  fillMilitaryHistory,
  fillPreviousName,
  fillBenefitSelection,
  fillApplicantContactInfo,
  fillPreparerInfo,
  submitForm,
};
