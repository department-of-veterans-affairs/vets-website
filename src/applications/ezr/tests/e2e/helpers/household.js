import { INSURANCE_VIEW_FIELDS } from '../../../utils/constants';
import { goToNextPage, selectYesNoWebComponent } from '.';
import { handleOptionalServiceHistoryPage } from './handleOptionalServiceHistoryPage';

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

export const advanceFromHouseholdToReview = ({ featureFlags = {} }) => {
  handleOptionalServiceHistoryPage({
    historyEnabled: featureFlags.ezrServiceHistoryEnabled,
  });

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

  cy.fillVaMemorableDate('root_spouseDateOfBirth', dateOfBirth);
  cy.fillVaMemorableDate('root_dateOfMarriage', dateOfMarriage);
};

// Helper function to fill spouse contact information.
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

  cy.fillAddressWebComponentPattern('spouseAddress', spouseAddress);
  cy.fillVaTextInput('root_spousePhone', spousePhone);
};
