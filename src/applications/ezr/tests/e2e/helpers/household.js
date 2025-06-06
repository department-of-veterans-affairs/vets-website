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
