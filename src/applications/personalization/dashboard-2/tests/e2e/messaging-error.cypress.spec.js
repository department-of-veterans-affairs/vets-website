import { mockFolderErrorResponse } from '~/applications/personalization/dashboard-2/utils/mocks/messaging/folder';
import { mockFeatureToggles } from './helpers';

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
      // login() calls cy.server() so we can now mock routes
      cy.intercept(
        'GET',
        '/v0/messaging/health/folders/0',
        mockFolderErrorResponse,
      );
      mockFeatureToggles();
    });
    it('should show the messaging link with the generic copy', () => {
      cy.visit('my-va/');
      cy.findByRole('link', {
        name: /Send a secure message to your health care team/i,
      }).should('exist');
    });
  });
});
