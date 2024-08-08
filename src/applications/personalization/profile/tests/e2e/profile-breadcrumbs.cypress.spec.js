import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import error500 from '@@profile/tests/fixtures/500.json';

import { mockUser } from '../fixtures/users/user';
import { PROFILE_PATHS, PROFILE_PATHS_WITH_NAMES } from '../../constants';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';

describe('Profile Breadcrumbs', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/profile/personal_information', error500);
    cy.intercept('/v0/mhv_account', error500);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });

  PROFILE_PATHS_WITH_NAMES.forEach(({ path, name }) => {
    // skip the edit path
    if (path === PROFILE_PATHS.EDIT) {
      return;
    }
    it('render the active page name in the breadcrumbs', () => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.visit(`${path}/`);
      cy.get('va-breadcrumbs')
        .shadow()
        .findByText(name)
        .should('exist');

      cy.url().should('eq', `${Cypress.config('baseUrl')}${path}/`);
      cy.injectAxeThenAxeCheck();
    });
  });
});
