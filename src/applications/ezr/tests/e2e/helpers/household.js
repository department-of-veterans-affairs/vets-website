import { INSURANCE_VIEW_FIELDS } from '../../../utils/constants';
import {
  goToNextPage,
  selectYesNoWebComponent,
  fillAddressWebComponentPattern,
} from '.';

export const advanceToHouseholdSection = testData => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.location('pathname').should(
    'include',
    '/veteran-information/personal-information',
  );
  goToNextPage('/veteran-information/mailing-address');
  fillAddressWebComponentPattern('veteranAddress', testData.veteranAddress);
  selectYesNoWebComponent('view:doesMailingMatchHomeAddress', true);

  goToNextPage('/veteran-information/contact-information');
};

export const advanceFromHouseholdToReview = () => {
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
