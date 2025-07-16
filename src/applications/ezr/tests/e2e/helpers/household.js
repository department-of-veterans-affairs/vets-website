import { INSURANCE_VIEW_FIELDS } from '../../../utils/constants';
import { goToNextPage, selectYesNoWebComponent } from '.';

export const advanceToHouseholdSection = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.location('pathname').should(
    'include',
    '/veteran-information/personal-information',
  );
  goToNextPage('/veteran-information/mailing-address');
  selectYesNoWebComponent('view:doesMailingMatchHomeAddress', true);

  goToNextPage('/veteran-information/contact-information');

  // Skip Emergency Contacts Section
  goToNextPage('/veteran-information/emergency-contacts-summary');
  selectYesNoWebComponent('view:hasEmergencyContacts', false);

  // Skip Next of Kin Section
  goToNextPage('/veteran-information/next-of-kin-summary');
  selectYesNoWebComponent('view:hasNextOfKin', false);
};

export const advanceFromHouseholdToReview = () => {
  goToNextPage('/military-service/toxic-exposure');
  cy.get('[name="root_hasTeraResponse"]').check('N');
  goToNextPage('/insurance-information/medicaid-eligibility');
  selectYesNoWebComponent('view:isMedicaidEligible_isMedicaidEligible', false);

  goToNextPage('/insurance-information/medicare-part-a-enrollment');
  selectYesNoWebComponent(
    'view:isEnrolledMedicarePartA_isEnrolledMedicarePartA',
    false,
  );

  goToNextPage('/insurance-information/policies');
  cy.get(`[name="root_${INSURANCE_VIEW_FIELDS.add}"]`).check('N');

  goToNextPage('review-and-submit');
};

// Household section helper functions for spouse information
export const fillSpousePersonalInformation = (spouseData = {}) => {
  const {
    firstName = 'John',
    lastName = 'Doe',
    ssn = '123422222',
    dateOfBirth = '1990-1-1',
    dateOfMarriage = '2015-6-15',
  } = spouseData;

  // Fill spouse full name
  cy.fillVaTextInput('root_spouseFullName_first', firstName);
  cy.fillVaTextInput('root_spouseFullName_last', lastName);
  cy.fillVaTextInput('root_spouseSocialSecurityNumber', ssn);

  // Filling using fillDateWebComponentPattern causes Cypress to change
  // pages/introduces 'Leave site?' alert, but only on local. Use the
  // following code instead.

  // Fill spouse date of birth.
  cy.get('va-memorable-date[name="root_spouseDateOfBirth"]')
    .shadow()
    .find('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .select(dateOfBirth.split('-')[1], { force: true });
  cy.get('va-memorable-date[name="root_spouseDateOfBirth"]')
    .shadow()
    .find('va-text-input.usa-form-group--day-input')
    .shadow()
    .find('input')
    .type(dateOfBirth.split('-')[2], { force: true });
  cy.get('va-memorable-date[name="root_spouseDateOfBirth"]')
    .shadow()
    .find('va-text-input.usa-form-group--year-input')
    .shadow()
    .find('input')
    .type(dateOfBirth.split('-')[0], { force: true });

  // Fill date of marriage.
  cy.get('va-memorable-date[name="root_dateOfMarriage"]')
    .shadow()
    .find('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .select(dateOfMarriage.split('-')[1], { force: true });
  cy.get('va-memorable-date[name="root_dateOfMarriage"]')
    .shadow()
    .find('va-text-input.usa-form-group--day-input')
    .shadow()
    .find('input')
    .type(dateOfMarriage.split('-')[2], { force: true });
  cy.get('va-memorable-date[name="root_dateOfMarriage"]')
    .shadow()
    .find('va-text-input.usa-form-group--year-input')
    .shadow()
    .find('input')
    .type(dateOfMarriage.split('-')[0], { force: true });
};

// Helper function to fill spouse contact information.
// eslint-disable-next-line max-len
export const fillSpouseContactInformation = (contactData = {}) => {
  const {
    spouseAddress = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'United States',
    },
    spousePhone = '5551234567',
  } = contactData;

  // Fill spouse address.
  cy.get('va-text-input[name="root_spouseAddress_street"]')
    .shadow()
    .find('input')
    .type(spouseAddress.street, {
      force: true,
    });
  cy.get('va-text-input[name="root_spouseAddress_city"]')
    .shadow()
    .find('input')
    .type(spouseAddress.city, {
      force: true,
    });
  cy.get('va-text-input[name="root_spouseAddress_state"]')
    .shadow()
    .find('input')
    .type(spouseAddress.state, {
      force: true,
    });
  cy.get('va-text-input[name="root_spouseAddress_postalCode"]')
    .shadow()
    .find('input')
    .type(spouseAddress.postalCode, {
      force: true,
    });

  // Fill spouse phone.
  cy.get('va-text-input[name="root_spousePhone"]')
    .shadow()
    .find('input')
    .type(spousePhone, {
      force: true,
    });

  cy.get('va-select[name="root_spouseAddress_country"]')
    .shadow()
    .find('select')
    .select(spouseAddress.country);
};

// Helper function to fill spouse financial support.
export const fillSpouseFinancialSupport = (providedSupport = true) => {
  // Wait for the field to exist and be visible.
  cy.get('va-radio-option[name="root_provideSupportLastYear"]')
    .should('exist')
    .and('be.visible');
  selectYesNoWebComponent('provideSupportLastYear', providedSupport);
};

// Helper function to fill spouse additional information.
export const fillSpouseAdditionalInformation = (options = {}) => {
  const { cohabitedLastYear = false, sameAddress = false } = options;

  // Wait for the field to exist and be visible.
  cy.get('va-radio-option[name="root_cohabitedLastYear"]')
    .should('exist')
    .and('be.visible');
  // Select No for cohabited last year to trigger financial support page.
  selectYesNoWebComponent('cohabitedLastYear', cohabitedLastYear);

  // Wait for the next field.
  cy.get('va-radio-option[name="root_sameAddress"]')
    .should('exist')
    .and('be.visible');
  // Select No for same address to trigger contact information page.
  selectYesNoWebComponent('sameAddress', sameAddress);
};
