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

export const fillGulfWarDateRange = () => {
  const { gulfWarStartDate, gulfWarEndDate } = testData[
    'view:gulfWarServiceDates'
  ];
  const [startYear, startMonth] = gulfWarStartDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  const [endYear, endMonth] = gulfWarEndDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarStartDateMonth"]').select(
    startMonth,
  );
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarStartDateYear"]').type(
    startYear,
  );
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarEndDateMonth"]').select(
    endMonth,
  );
  cy.get('[name="root_view:gulfWarServiceDates_gulfWarEndDateYear"]').type(
    endYear,
  );
};

export const fillToxicExposureDateRange = () => {
  const { toxicExposureStartDate, toxicExposureEndDate } = testData[
    'view:toxicExposureDates'
  ];
  const [startYear, startMonth] = toxicExposureStartDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  const [endYear, endMonth] = toxicExposureEndDate
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get(
    '[name="root_view:toxicExposureDates_toxicExposureStartDateMonth"]',
  ).select(startMonth);
  cy.get(
    '[name="root_view:toxicExposureDates_toxicExposureStartDateYear"]',
  ).type(startYear);
  cy.get(
    '[name="root_view:toxicExposureDates_toxicExposureEndDateMonth"]',
  ).select(endMonth);
  cy.get('[name="root_view:toxicExposureDates_toxicExposureEndDateYear"]').type(
    endYear,
  );
};

export const advanceToHousehold = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.wait('@mockSip');
  cy.location('pathname').should(
    'include',
    '/veteran-information/personal-information',
  );
  goToNextPage('/veteran-information/birth-information');
  goToNextPage('/veteran-information/maiden-name-information');
  goToNextPage('/veteran-information/birth-sex');
  goToNextPage('/veteran-information/demographic-information');
  goToNextPage('/veteran-information/veteran-address');
  cy.get('[name="root_view:doesMailingMatchHomeAddress"]').check('Y');

  goToNextPage('/veteran-information/contact-information');
  cy.wait('@mockSip');
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
  cy.get('[name="root_view:preferredFacility_view:facilityState"]').select(
    testData['view:preferredFacility']['view:facilityState'],
  );
  cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]').select(
    testData['view:preferredFacility'].vaMedicalFacility,
  );

  goToNextPage('review-and-submit');
};

export const fillDependentBasicInformation = dependent => {
  const {
    fullName,
    dateOfBirth,
    becameDependent,
    dependentRelation,
    socialSecurityNumber,
  } = dependent;

  cy.get('#root_fullName_first').type(fullName.first);
  cy.get('#root_fullName_middle').type(fullName.middle);
  cy.get('#root_fullName_last').type(fullName.last);
  cy.get('#root_fullName_suffix').type(fullName.suffix);
  cy.get('#root_dependentRelation').select(dependentRelation);
  cy.get('#root_socialSecurityNumber').type(socialSecurityNumber);

  const [birthYear, birthMonth, birthDay] = dateOfBirth
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get('#root_dateOfBirthMonth').select(birthMonth);
  cy.get('#root_dateOfBirthDay').select(birthDay);
  cy.get('#root_dateOfBirthYear').type(birthYear);

  const [dependentYear, dependentMonth, dependentDay] = becameDependent
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get('#root_becameDependentMonth').select(dependentMonth);
  cy.get('#root_becameDependentDay').select(dependentDay);
  cy.get('#root_becameDependentYear').type(dependentYear);
};

export const fillSpousalBasicInformation = () => {
  const {
    spouseDateOfBirth,
    spouseFullName,
    spouseSocialSecurityNumber,
    dateOfMarriage,
  } = testData;

  cy.get('#root_spouseFullName_first').type(spouseFullName.first);
  cy.get('#root_spouseFullName_middle').type(spouseFullName.middle);
  cy.get('#root_spouseFullName_last').type(spouseFullName.last);
  cy.get('#root_spouseFullName_suffix').type(spouseFullName.suffix);
  cy.get('#root_spouseSocialSecurityNumber').type(spouseSocialSecurityNumber);

  const [birthYear, birthMonth, birthDay] = spouseDateOfBirth
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get('#root_spouseDateOfBirthMonth').select(birthMonth);
  cy.get('#root_spouseDateOfBirthDay').select(birthDay);
  cy.get('#root_spouseDateOfBirthYear').type(birthYear);

  const [maritalYear, maritalMonth, maritalDay] = dateOfMarriage
    .split('-')
    .map(dateComponent => parseInt(dateComponent, 10).toString());
  cy.get('#root_dateOfMarriageMonth').select(maritalMonth);
  cy.get('#root_dateOfMarriageDay').select(maritalDay);
  cy.get('#root_dateOfMarriageYear').type(maritalYear);
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
  cy.get('[name="root_view:preferredFacility_view:facilityState"]').select(
    testData['view:preferredFacility']['view:facilityState'],
  );
  cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]').select(
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

// Keyboard-only pattern helpers
export const fillAddressWithKeyboard = (fieldName, value) => {
  cy.typeInIfDataExists(`[name="root_${fieldName}_street"]`, value.street);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street2"]`, value.street2);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street3"]`, value.street3);
  cy.typeInIfDataExists(`[name="root_${fieldName}_city"]`, value.city);
  cy.tabToElement(`[name="root_${fieldName}_state"]`);
  cy.chooseSelectOptionUsingValue(value.state);
  cy.typeInIfDataExists(
    `[name="root_${fieldName}_postalCode"]`,
    value.postalCode,
  );
};

export const fillDateWithKeyboard = (fieldName, value) => {
  const [year, month, day] = value
    .split('-')
    .map(num => parseInt(num, 10).toString());
  cy.tabToElement(`[name="root_${fieldName}Month"]`);
  cy.chooseSelectOptionUsingValue(month);
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(day)) {
    cy.tabToElement(`[name="root_${fieldName}Day"]`);
    cy.chooseSelectOptionUsingValue(day);
  }
  cy.typeInIfDataExists(`[name="root_${fieldName}Year"]`, year);
};

export const fillNameWithKeyboard = (fieldName, value) => {
  cy.typeInIfDataExists(`[name="root_${fieldName}_first"]`, value.first);
  cy.typeInIfDataExists(`[name="root_${fieldName}_middle"]`, value.middle);
  cy.typeInIfDataExists(`[name="root_${fieldName}_last"]`, value.last);
  if (value.suffix) {
    cy.tabToElement(`[name="root_${fieldName}_suffix"]`);
    cy.chooseSelectOptionUsingValue(value.suffix);
  }
};

export const selectDropdownWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.chooseSelectOptionUsingValue(value);
};

export const selectRadioWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.findOption(value);
  cy.realPress('Space');
};

// single field web component fill helpers
export const fillTextWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(`va-text-input[name="root_${fieldName}"]`)
      .shadow()
      .find('input')
      .type(value);
  }
};

export const selectRadioWebComponent = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    cy.get(
      `va-radio-option[name="root_${fieldName}"][value="${value}"]`,
    ).click();
  }
};

export const selectYesNoWebComponent = (fieldName, value) => {
  const selection = value ? 'Y' : 'N';
  selectRadioWebComponent(fieldName, selection);
};
