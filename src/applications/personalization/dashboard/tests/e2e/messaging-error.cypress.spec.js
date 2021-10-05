import ERROR_400 from '~/applications/personalization/dashboard/utils/mocks/ERROR_400';

import {
  makeUserObject,
  mockLocalStorage,
} from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

describe('MyVA Dashboard - Messaging', () => {
  describe('when there is an error fetching the inbox data', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        messaging: true,
        rx: true,
        isPatient: true,
      });

      cy.login(mockUser);
      cy.intercept('GET', '/v0/messaging/health/folders/0', {
        statusCode: 400,
        body: ERROR_400,
      });
    });
    it('should show the messaging link with the generic copy', () => {
      cy.visit('my-va/');
      cy.findByRole('link', {
        name: /Send a secure message to your health care team/i,
      }).should('exist');
    });
  });
});
