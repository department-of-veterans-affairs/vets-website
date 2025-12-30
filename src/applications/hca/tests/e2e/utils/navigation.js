import { fillIdentityForm, fillVaFacility } from './fillers';
import {
  acceptPrivacyAgreement,
  goToNextPage,
  startAsGuestUser,
} from './helpers';

export const advanceToVaBenefits = (testData, props = {}) => {
  const { compensation = 'none' } = props;
  startAsGuestUser();
  fillIdentityForm(testData);

  goToNextPage('/veteran-information/birth-information');
  goToNextPage('/veteran-information/maiden-name-information');
  goToNextPage('/veteran-information/birth-sex');
  cy.selectRadio('root_gender', 'M');

  goToNextPage('/veteran-information/demographic-information');
  goToNextPage('/veteran-information/veteran-address');
  cy.fillAddress('root_veteranAddress', testData.veteranAddress);
  cy.selectRadio('root_view:doesMailingMatchHomeAddress', 'Y');

  goToNextPage('/veteran-information/contact-information');
  goToNextPage('/va-benefits/basic-information');
  cy.selectRadio('root_vaCompensationType', compensation);
};

export const advanceFromHouseholdToSubmit = (testData, props = {}) => {
  const { disclosureAssertionValue = true } = props;

  goToNextPage('/insurance-information/medicaid');
  cy.selectRadio('root_isMedicaidEligible', 'N');

  goToNextPage('/insurance-information/medicare');
  cy.selectRadio('root_isEnrolledMedicarePartA', 'N');

  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/health-insurance');
  cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', false);

  goToNextPage('/insurance-information/va-facility');
  fillVaFacility(testData['view:preferredFacility']);

  goToNextPage('review-and-submit');

  // accept the privacy agreement
  acceptPrivacyAgreement();

  // submit form
  cy.findByText(/submit/i, { selector: 'button' }).click();

  // check for correct disclosure value
  cy.wait('@mockSubmit').then(interception => {
    cy.wrap(JSON.parse(interception.request.body.form))
      .its('discloseFinancialInformation')
      .should(`be.${disclosureAssertionValue}`);
  });
  cy.location('pathname').should('include', '/confirmation');
};

export const advanceToAuthShortForm = () => {
  goToNextPage('/veteran-information/birth-information');
  goToNextPage('/veteran-information/maiden-name-information');
  goToNextPage('/veteran-information/birth-sex');
  goToNextPage('/veteran-information/demographic-information');
  goToNextPage('/veteran-information/veteran-address');
  cy.selectRadio('root_view:doesMailingMatchHomeAddress', 'Y');

  goToNextPage('/veteran-information/contact-information');
};

export const advanceFromShortFormToSubmit = testData => {
  goToNextPage('/military-service/toxic-exposure');
  cy.selectRadio('root_hasTeraResponse', 'N');

  goToNextPage('/insurance-information/medicaid');
  cy.selectRadio('root_isMedicaidEligible', 'N');

  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/health-insurance');
  cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', false);

  goToNextPage('/insurance-information/va-facility');
  fillVaFacility(testData['view:preferredFacility']);

  // Review and submit
  goToNextPage('review-and-submit');

  acceptPrivacyAgreement();

  cy.findByText(/submit/i, { selector: 'button' }).click();
  cy.wait('@mockSubmit').then(interception => {
    // check submitted `vaCompensationType` value
    cy.wrap(JSON.parse(interception.request.body.form))
      .its('vaCompensationType')
      .should('eq', 'highDisability');
  });
  cy.location('pathname').should('include', '/confirmation');
};
