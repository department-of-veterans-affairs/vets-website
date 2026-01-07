import { PROFILE_PATHS } from '@@profile/constants';
import mockPatient from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '@@profile/tests/e2e/helpers';

registerCypressHelpers();

describe('VA Profile ID Initialization - ProfileWrapper', () => {
  describe('LOA3 user without existing VA Profile ID', () => {
    beforeEach(() => {
      // Mock all standard Profile APIs
      mockNotificationSettingsAPIs();

      // Mock user without VA Profile ID (will be initialized)
      cy.intercept('POST', '/v0/profile/initialize_vet360_id', {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              transactionId: 'test-transaction-123',
              transactionStatus: 'COMPLETED_SUCCESS',
              vet360Id: 'new-profile-id-123',
            },
          },
        },
        delay: 100,
      }).as('initializeVAProfileID');
    });

    it('should initialize VA Profile ID when accessing Notification Settings directly', () => {
      cy.login(mockPatient);

      // Mock communication preferences endpoint
      cy.intercept('GET', '/v0/profile/communication_preferences', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'hashes',
            attributes: {
              communicationGroups: [],
            },
          },
        },
      }).as('getCommunicationPreferences');

      // Visit Notification Settings directly (first Profile page accessed)
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // Page should load successfully
      cy.findByRole('heading', { name: /Notification settings/i }).should(
        'exist',
      );

      // Verify no error messages
      cy.contains(/system error/i).should('not.exist');
      cy.contains(/something went wrong/i).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should initialize VA Profile ID when accessing Military Information directly', () => {
      cy.login(mockPatient);

      // Visit Military Information directly
      cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);

      // Page should load successfully
      cy.findByRole('heading', { name: /Military information/i }).should(
        'exist',
      );

      // Verify no error messages
      cy.contains(/system error/i).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('LOA3 user with existing VA Profile ID', () => {
    beforeEach(() => {
      mockNotificationSettingsAPIs();

      // User already has VA Profile ID - initialization returns immediately
      cy.intercept('POST', '/v0/profile/initialize_vet360_id', {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              transactionId: 'existing-transaction',
              transactionStatus: 'COMPLETED_SUCCESS',
              vet360Id: 'existing-profile-id-456',
            },
          },
        },
      }).as('initializeVAProfileID');
    });

    it('should not cause errors when initialization is already complete', () => {
      cy.login(mockPatient);

      cy.intercept('GET', '/v0/profile/communication_preferences', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'hashes',
            attributes: {
              communicationGroups: [],
            },
          },
        },
      });

      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // Page loads normally
      cy.findByRole('heading', { name: /Notification settings/i }).should(
        'exist',
      );

      // No double-initialization or errors
      cy.contains(/system error/i).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Regression tests - Notification Settings and Military Information', () => {
    beforeEach(() => {
      mockNotificationSettingsAPIs();

      cy.intercept('POST', '/v0/profile/initialize_vet360_id', {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              transactionId: 'test-transaction-123',
              transactionStatus: 'COMPLETED_SUCCESS',
              vet360Id: 'new-profile-id-123',
            },
          },
        },
      }).as('initializeVAProfileID');
    });

    it('should fix the Notification Settings error for new users', () => {
      cy.login(mockPatient);

      cy.intercept('GET', '/v0/profile/communication_preferences', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'hashes',
            attributes: {
              communicationGroups: [],
            },
          },
        },
      });

      // This used to fail with system error before the ProfileWrapper fix
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      // Now it should work
      cy.findByRole('heading', { name: /Notification settings/i }).should(
        'exist',
      );
      cy.contains(/system error/i).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should fix the Military Information error for new users', () => {
      cy.login(mockPatient);

      // This used to fail with system error before the ProfileWrapper fix
      cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);

      // Now it should work
      cy.findByRole('heading', { name: /Military information/i }).should(
        'exist',
      );
      cy.contains(/system error/i).should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
