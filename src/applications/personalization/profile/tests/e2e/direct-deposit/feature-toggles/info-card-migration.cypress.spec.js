import { PROFILE_PATHS } from '@@profile/constants';

import mockUserInEVSS from '@@profile/tests/fixtures/users/user-36.json';
import mockDD4CNPEnrolled from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-set-up.json';
import mockDD4EDUEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';
import { checkForLegacyLoadingIndicator } from '~/applications/personalization/common/e2eHelpers';
import { generateFeatureToggles } from '~/applications/personalization/profile/mocks/endpoints/feature-toggles';
import { mockGETEndpoints } from '../../helpers';

describe('Direct Deposit - Info Card Feature toggle', () => {
  beforeEach(() => {
    cy.login(mockUserInEVSS);
    cy.intercept('GET', 'v0/ppiu/payment_information', mockDD4CNPEnrolled);
    cy.intercept('GET', 'v0/profile/ch33_bank_accounts', mockDD4EDUEnrolled);
    mockGETEndpoints([
      'v0/profile/personal_information',
      'v0/profile/service_history',
      'v0/profile/full_name',
      'v0/profile/status',
      'v0/mhv_account',
      '/v0/disability_compensation_form/rating_info',
    ]);
  });
  describe('when `profileUseInfoCard` feature is TRUE', () => {
    it('should show new profile info card', () => {
      cy.intercept(
        'GET',
        'v0/feature_toggles*',
        generateFeatureToggles({ profileUseInfoCard: true }),
      );
      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      checkForLegacyLoadingIndicator();

      // check for new component
      cy.get('.profile-info-card').should('have.length', 3);

      // check for legacy component
      cy.get('.profile-info-table').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('when `profileUseInfoCard` feature is FALSE', () => {
    it('should show legacy profile info table', () => {
      cy.intercept(
        'GET',
        'v0/feature_toggles*',
        generateFeatureToggles({ profileUseInfoCard: false }),
      );

      cy.visit(PROFILE_PATHS.DIRECT_DEPOSIT);

      checkForLegacyLoadingIndicator();

      // check for new component
      cy.get('.profile-info-card').should('not.exist');

      // check for legacy component
      cy.get('.profile-info-table').should('have.length', 3);

      cy.injectAxeThenAxeCheck();
    });
  });
});
