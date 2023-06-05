import { mockUser } from '@@profile/tests/fixtures/users/user';

import ERROR_400 from '~/applications/personalization/dashboard/utils/mocks/ERROR_400';
import { generateFeatureToggles } from '../../mocks/feature-toggles';
import vamcErc from '../fixtures/vamc-ehr.json';

describe('MyVA Dashboard - Messaging', () => {
  describe('when there is an error fetching the inbox data', () => {
    beforeEach(() => {
      cy.login(mockUser);
      cy.intercept(
        '/v0/feature_toggles*',
        generateFeatureToggles({ showMyVADashboardV2: true }),
      );
      cy.intercept('GET', '/v0/messaging/health/folders/0', {
        statusCode: 400,
        body: ERROR_400,
      });
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcErc);
    });
    it('should show the messaging link with the generic copy', () => {
      cy.visit('my-va/');
      cy.findByTestId('view-your-messages-link-from-cta').should('exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});
