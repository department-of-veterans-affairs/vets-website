import { fillIdentityForm, fillVaFacility } from './fillers';
import {
  acceptPrivacyAgreement,
  goToNextPage,
  startAsAuthUser,
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

export const advanceToTERA = (testData, props = {}) => {
  const {
    birthdate = testData.veteranDateOfBirth,
    entryDate = testData.lastEntryDate,
    dischargeDate = testData.lastDischargeDate,
  } = props;

  startAsGuestUser();
  fillIdentityForm({ ...testData, veteranDateOfBirth: birthdate });

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
  cy.selectRadio('root_vaCompensationType', 'none');

  goToNextPage('/va-benefits/pension-information');
  cy.selectRadio('root_vaPensionType', 'No');

  goToNextPage('/military-service/service-information');
  cy.get('[name="root_lastServiceBranch"]').select(testData.lastServiceBranch);
  cy.fillDate('root_lastEntryDate', entryDate);
  cy.fillDate('root_lastDischargeDate', dischargeDate);
  cy.get('[name="root_dischargeType"]').select(testData.dischargeType);

  goToNextPage('/military-service/additional-information');
  goToNextPage('/military-service/toxic-exposure');
  cy.selectRadio('root_hasTeraResponse', 'Y');
};

export const advanceToHousehold = () => {
  startAsAuthUser();

  goToNextPage('/veteran-information/birth-information');
  goToNextPage('/veteran-information/maiden-name-information');
  goToNextPage('/veteran-information/birth-sex');
  goToNextPage('/veteran-information/demographic-information');
  goToNextPage('/veteran-information/veteran-address');
  cy.selectRadio('root_view:doesMailingMatchHomeAddress', 'Y');

  goToNextPage('/veteran-information/contact-information');
  goToNextPage('/va-benefits/basic-information');
  cy.selectRadio('root_vaCompensationType', 'none');

  goToNextPage('/va-benefits/pension-information');
  cy.selectRadio('root_vaPensionType', 'No');

  goToNextPage('/military-service/service-information');
  goToNextPage('/military-service/additional-information');
  goToNextPage('/military-service/toxic-exposure');
  cy.selectRadio('root_hasTeraResponse', 'N');

  goToNextPage('/household-information/financial-information-use');
};

export const advanceFromHouseholdToReview = testData => {
  goToNextPage('/insurance-information/medicaid');
  cy.selectRadio('root_isMedicaidEligible', 'N');

  goToNextPage('/insurance-information/medicare');
  cy.selectRadio('root_isEnrolledMedicarePartA', 'N');

  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/general');
  cy.selectRadio('root_isCoveredByHealthInsurance', 'N');

  goToNextPage('/insurance-information/va-facility');
  fillVaFacility(testData['view:preferredFacility']);

  goToNextPage('review-and-submit');
};

export const advanceToHealthInsurance = testData => {
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
  cy.selectRadio('root_vaCompensationType', 'highDisability');

  goToNextPage('/va-benefits/confirm-service-pay');
  goToNextPage('/military-service/toxic-exposure');
  cy.selectRadio('root_hasTeraResponse', 'N');

  goToNextPage('/insurance-information/medicaid');
  cy.selectRadio('root_isMedicaidEligible', 'N');

  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/health-insurance');
};

export const shortFormSelfDisclosureToSubmit = testData => {
  goToNextPage('/va-benefits/basic-information');
  cy.selectRadio('root_vaCompensationType', 'highDisability');

  goToNextPage('/va-benefits/confirm-service-pay');
  goToNextPage('/military-service/toxic-exposure');
  cy.selectRadio('root_hasTeraResponse', 'N');

  goToNextPage('/insurance-information/medicaid');
  cy.selectRadio('root_isMedicaidEligible', 'N');

  goToNextPage('/insurance-information/your-health-insurance');
  goToNextPage('/insurance-information/general');
  cy.selectRadio('root_isCoveredByHealthInsurance', 'N');

  goToNextPage('/insurance-information/va-facility');
  fillVaFacility(testData['view:preferredFacility']);

  // Review and submit
  goToNextPage('review-and-submit');

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
