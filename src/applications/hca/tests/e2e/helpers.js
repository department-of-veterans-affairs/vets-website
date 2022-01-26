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
  goToNextPage('/veteran-information/birth-sex');
  goToNextPage('/veteran-information/marital-status');
  cy.get('select#root_maritalStatus').select(testData.maritalStatus);
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
  goToNextPage('/military-service/service-information');
  goToNextPage('/military-service/additional-information');
  goToNextPage('/va-benefits/basic-information');
  cy.get('[name="root_vaCompensationType"]').check('none');
  goToNextPage('/va-benefits/pension-information');
  cy.get('[name="root_vaPensionType"]').check('No');
  goToNextPage('/household-information/financial-disclosure');
  cy.get('[name="root_discloseFinancialInformation"]').check('N');
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

export const advanceToServiceInfoPage = dob => {
  cy.findAllByText(/start.+application/i, { selector: 'button' })
    .first()
    .click();
  cy.wait('@mockSip');
  cy.location('pathname').should(
    'include',
    '/veteran-information/personal-information',
  );

  goToNextPage('/veteran-information/birth-information');
  // birth month
  cy.get('#root_veteranDateOfBirthMonth').select(dob.month);

  // birth day
  cy.get('#root_veteranDateOfBirthDay').select(dob.day);

  // birth year
  cy.get('#root_veteranDateOfBirthYear')
    .clear()
    .type(dob.year);

  goToNextPage('/veteran-information/birth-sex');

  goToNextPage('/veteran-information/marital-status');
  cy.get('select#root_maritalStatus').select(testData.maritalStatus);

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

  goToNextPage('/military-service/service-information');
};
