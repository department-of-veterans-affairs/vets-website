import mockUserAiq from './fixtures/mockUserAiq';
import minTestData from './fixtures/schema/minimal-test.json';

const mockUserAttrs = mockUserAiq.data.attributes;
const testData = minTestData.data;

export const goToNextPage = pagePath => {
  // Clicks Continue button, and optionally checks destination path.
  cy.findAllByText(/continue/i, { selector: 'button' })
    .first()
    .scrollIntoView()
    .click();
  if (pagePath) {
    cy.location('pathname').should('include', pagePath);
  }
};
export const advanceToAiqPage = () => {
  cy.findAllByText(/start.+application/i, { selector: 'button' })
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
  goToNextPage('/veteran-information/american-indian');
};
export const advanceFromAiqToReviewPage = () => {
  goToNextPage('/veteran-information/veteran-address');
  cy.get('[type=radio]')
    .first()
    .scrollIntoView()
    .check('Y');
  goToNextPage('/veteran-information/contact-information');
  cy.wait('@mockSip');
  cy.get('[name*="emailConfirmation"]')
    .scrollIntoView()
    .type(mockUserAttrs.profile.email);
  goToNextPage('/va-benefits/basic-information');
  cy.get('[name="root_vaCompensationType"]').check('none');
  goToNextPage('/va-benefits/pension-information');
  cy.get('[name="root_vaPensionType"]').check('No');
  goToNextPage('/military-service/service-information');
  goToNextPage('/military-service/additional-information');
  goToNextPage('/household-information/financial-disclosure');
  cy.get('[name="root_discloseFinancialInformation"]').check('N');
  goToNextPage('/household-information/marital-status');
  cy.get('select#root_maritalStatus').select(testData.maritalStatus);
  goToNextPage('/insurance-information/medicaid');
  cy.get('[name="root_isMedicaidEligible"]').check('N');
  goToNextPage('/insurance-information/medicare');
  cy.get('[name="root_isEnrolledMedicarePartA"]').check('N');
  goToNextPage('/insurance-information/general');
  cy.get('[name="root_isCoveredByHealthInsurance"]').check('N');
  goToNextPage('/insurance-information/va-facility');
  cy.get('[name="root_view:preferredFacility_view:facilityState"]').select(
    testData['view:preferredFacility']['view:facilityState'],
  );
  cy.wait('@mockSip');
  cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]').select(
    testData['view:preferredFacility'].vaMedicalFacility,
  );
  goToNextPage('review-and-submit');
};

export const advanceToServiceInfoPage = () => {
  cy.findAllByText(/start.+application/i, { selector: 'button' })
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

  goToNextPage('/veteran-information/american-indian');
  cy.get('#root_sigiIsAmericanIndianNo[type="radio"]').check();

  goToNextPage('/veteran-information/veteran-address');
  cy.get('[type=radio]')
    .first()
    .scrollIntoView()
    .check('Y');

  goToNextPage('/veteran-information/contact-information');
  cy.wait('@mockSip');
  cy.get('[name*="emailConfirmation"]')
    .scrollIntoView()
    .type(mockUserAttrs.profile.email);

  goToNextPage('/va-benefits/basic-information');
  cy.get('[name="root_vaCompensationType"]').check('none');
  goToNextPage('/va-benefits/pension-information');
  cy.get('[name="root_vaPensionType"]').check('No');

  goToNextPage('/military-service/service-information');
};

export const shortFormAdditionalHelpAssertion = () => {
  cy.get('va-alert-expandable')
    .shadow()
    .findByText(/you’re filling out a shortened application!/i)
    .first()
    .should('exist');
};

export const shortFormSelfDisclosureToSubmit = () => {
  goToNextPage('/va-benefits/basic-information');
  cy.get('[type=radio]#root_vaCompensationType_1')
    .first()
    .scrollIntoView()
    .check('highDisability');

  goToNextPage('/va-benefits/confirm-service-pay');
  cy.findByText(
    /confirm that you receive service-connected pay for a 50% or higher disability rating./i,
  )
    .first()
    .should('exist');

  cy.injectAxe();
  cy.axeCheck();
  cy.findAllByText(/confirm/i, { selector: 'button' })
    .first()
    .click();

  // medicaid page with short form message
  shortFormAdditionalHelpAssertion();

  cy.get('[type=radio]#root_isMedicaidEligibleNo')
    .first()
    .scrollIntoView()
    .check('N');

  // general insurance
  goToNextPage('/insurance-information/general');
  shortFormAdditionalHelpAssertion();

  cy.get('[type=radio]#root_isCoveredByHealthInsuranceNo')
    .first()
    .scrollIntoView()
    .check('N');

  // va facility
  goToNextPage('/insurance-information/va-facility');
  shortFormAdditionalHelpAssertion();

  cy.get('[name="root_view:preferredFacility_view:facilityState"]').select(
    testData['view:preferredFacility']['view:facilityState'],
  );

  cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]').select(
    testData['view:preferredFacility'].vaMedicalFacility,
  );

  goToNextPage('review-and-submit');

  // check review page for self disclosure of va compensation type
  cy.get(`button.usa-button-unstyled`)
    .contains(/^VA benefits$/)
    .click();
  cy.findByText(/Do you receive VA disability compensation?/i, {
    selector: 'dt',
  })
    .next('dd')
    .should('have.text', 'Yes (50% or higher rating)');

  cy.get('[name="privacyAgreementAccepted"]')
    .scrollIntoView()
    .check();
  cy.findByText(/submit/i, { selector: 'button' }).click();
  cy.wait('@mockSubmit').then(interception => {
    // check submitted vaCompensationType value.
    cy.wrap(JSON.parse(interception.request.body.form))
      .its('vaCompensationType')
      .should('eq', 'highDisability');
  });
  cy.location('pathname').should('include', '/confirmation');
};
