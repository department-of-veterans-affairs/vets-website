// export utils
export * from './fillers';
export * from './helpers';
export * from './setup';

import maxTestData from '../fixtures/data/maximal-test.json';

const { data: testData } = maxTestData;

export const acceptPrivacyAgreement = () => {
  cy.get('va-checkbox[name="privacyAgreementAccepted"]')
    .scrollIntoView()
    .shadow()
    .find('label')
    .click();
};

export const goToNextPage = pagePath => {
  // Clicks Continue button, and optionally checks destination path.
  cy.findAllByText(/continue|confirm/i, { selector: 'button' })
    .first()
    .scrollIntoView()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};

export const selectDropdownWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-select[name="root_${fieldName}"]`)
      .shadow()
      .find('select')
      .select(value);
  }
};

export const advanceToHousehold = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.location('pathname').should('include', '/check-your-personal-information');
  goToNextPage('/veteran-information/birth-information');
  goToNextPage('/veteran-information/maiden-name-information');
  goToNextPage('/veteran-information/birth-sex');
  goToNextPage('/veteran-information/demographic-information');
  goToNextPage('/veteran-information/veteran-address');
  cy.get('[name="root_view:doesMailingMatchHomeAddress"]').check('Y');

  goToNextPage('/veteran-information/contact-information');
  goToNextPage('/va-benefits/basic-information');
  cy.get('[name="root_vaCompensationType"]').check('none');
  goToNextPage('/va-benefits/pension-information');
  cy.get('[name="root_vaPensionType"]').check('No');
  goToNextPage('/military-service/service-information');
  goToNextPage('/military-service/additional-information');
  goToNextPage('/military-service/toxic-exposure');
  cy.get('[name="root_hasTeraResponse"]').check('N');
  goToNextPage('/household-information/financial-information-use');
};

export const advanceFromHouseholdToReview = () => {
  goToNextPage('/insurance-information/medicaid');
  cy.get('[name="root_isMedicaidEligible"]').check('N');

  goToNextPage('/insurance-information/medicare');
  cy.get('[name="root_isEnrolledMedicarePartA"]').check('N');

  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/general');
  cy.get('[name="root_isCoveredByHealthInsurance"]').check('N');

  goToNextPage('/insurance-information/va-facility');
  selectDropdownWebComponent(
    'view:preferredFacility_view:facilityState',
    testData['view:preferredFacility']['view:facilityState'],
  );
  cy.wait('@getFacilities');
  selectDropdownWebComponent(
    'view:preferredFacility_vaMedicalFacility',
    testData['view:preferredFacility'].vaMedicalFacility,
  );

  goToNextPage('review-and-submit');
};

export const shortFormSelfDisclosureToSubmit = () => {
  goToNextPage('/va-benefits/basic-information');
  cy.get('[name="root_vaCompensationType"]').check('highDisability');

  goToNextPage('/va-benefits/confirm-service-pay');
  cy.findByText(
    /confirm that you receive service-connected pay for a 50% or higher disability rating/i,
  )
    .first()
    .should('exist');

  cy.injectAxe();
  cy.axeCheck();
  cy.findAllByText(/confirm/i, { selector: 'button' })
    .first()
    .click();

  cy.get('[name="root_hasTeraResponse"]').check('N');
  goToNextPage('/insurance-information/medicaid');

  // medicaid page with short form message
  cy.get('[name="root_isMedicaidEligible"]').check('N');

  // insurance policies
  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/general');
  cy.get('[name="root_isCoveredByHealthInsurance"]').check('N');

  // va facility
  goToNextPage('/insurance-information/va-facility');
  selectDropdownWebComponent(
    'view:preferredFacility_view:facilityState',
    testData['view:preferredFacility']['view:facilityState'],
  );
  cy.wait('@getFacilities');
  selectDropdownWebComponent(
    'view:preferredFacility_vaMedicalFacility',
    testData['view:preferredFacility'].vaMedicalFacility,
  );

  goToNextPage('review-and-submit');

  // check review page for self disclosure of va compensation type
  cy.get('va-accordion-item')
    .contains(/^VA benefits$/)
    .click();
  cy.findByText(/Do you receive VA disability compensation?/i, {
    selector: 'dt',
  })
    .next('dd')
    .should('have.text', 'Yes (50% or higher rating)');

  acceptPrivacyAgreement();

  cy.findByText(/submit/i, { selector: 'button' }).click();
  cy.wait('@mockSubmit').then(interception => {
    // check submitted vaCompensationType value.
    cy.wrap(JSON.parse(interception.request.body.form))
      .its('vaCompensationType')
      .should('eq', 'highDisability');
  });
  cy.location('pathname').should('include', '/confirmation');
};
