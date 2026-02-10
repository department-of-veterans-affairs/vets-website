import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Alerts, Locators } from './utils/constants';
import defaultThreadResponse from './fixtures/thread-response-new-api.json';
import migratingUserFixture from './fixtures/userResponse/user-migrating-facility.json';
import migrationThreadResponse from './fixtures/thread-response-migration-phase.json';
import migrationInboxMessages from './fixtures/threads-response-migration-phase.json';

/**
 * E2E Test Plan: Migration Phase Handling in MessageThreadHeader and ReplyForm
 *
 * Purpose:
 * Test that threads with Oracle Health (OH) migration phases p3, p4, and p5
 * correctly hide the reply button to prevent users from attempting to reply.
 *
 * Test Scenarios:
 * 1. When thread has ohMigrationPhase = 'p3', 'p4', or 'p5' (blocking phases):
 *    - Reply button is hidden
 *    - CannotReplyAlert is hidden (migration alert takes precedence)
 * 2. When thread has ohMigrationPhase = 'p2' (non-blocking phase):
 *    - Reply button is visible
 * 3. When thread has no migration phase (null or undefined):
 *    - Reply button is visible
 *
 * Note: MigratingFacilitiesAlerts display is covered by unit tests because it
 * requires platform-level Redux state injection for migrationSchedules that is
 * complex to configure in E2E tests. See:
 * - tests/components/MessageThreadComponents/MessageThreadHeader.unit.spec.jsx
 * - tests/components/Reply/ReplyForm.unit.spec.jsx
 */

/**
 * Helper function to update migration phase in thread and inbox fixtures
 * @param {Object} threadData - The thread response fixture
 * @param {Object} inboxData - The inbox messages fixture
 * @param {string} phase - The migration phase ('p3', 'p4', 'p5')
 * @returns {Object} - Object with updated thread and inbox data
 */
const updateMigrationPhase = (threadData, inboxData, phase) => {
  const currentDate = new Date();
  const updatedThread = {
    ...threadData,
    data: threadData.data.map((item, i) => {
      const newSentDate = new Date(currentDate);
      newSentDate.setDate(currentDate.getDate() - i);
      return {
        ...item,
        attributes: {
          ...item.attributes,
          sentDate: newSentDate.toISOString(),
          ohMigrationPhase: phase,
        },
      };
    }),
  };

  const updatedInbox = {
    ...inboxData,
    data: inboxData.data.map(item => ({
      ...item,
      attributes: {
        ...item.attributes,
        sentDate: currentDate.toISOString(),
        ohMigrationPhase: phase,
      },
    })),
  };

  return { updatedThread, updatedInbox };
};

describe('SM Migration Phase - MigratingFacilitiesAlerts Display', () => {
  describe('No Migration Phase', () => {
    it('does not display MigratingFacilitiesAlerts when ohMigrationPhase is null', () => {
      // Use default thread without migration phase
      const updatedThread = GeneralFunctionsPage.updatedThreadDates(
        defaultThreadResponse,
      );

      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      PatientMessageDetailsPage.loadSingleThread(updatedThread);

      // Verify MigratingFacilitiesAlerts h2 is NOT displayed
      cy.get('h2')
        .contains(Alerts.MIGRATION_ALERT_H2)
        .should('not.exist');

      // Verify Reply button is visible (normal thread)
      cy.get(Locators.BUTTONS.REPLY).should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Migration Phase P3 - Blocking Replies', () => {
    it('hides reply button when ohMigrationPhase is p3', () => {
      const { updatedThread, updatedInbox } = updateMigrationPhase(
        migrationThreadResponse,
        migrationInboxMessages,
        'p3',
      );

      // Login with user that has migrationSchedules in profile
      SecureMessagingSite.login(
        undefined,
        undefined,
        true,
        migratingUserFixture,
      );
      PatientInboxPage.loadInboxMessages(updatedInbox);
      PatientMessageDetailsPage.loadSingleThread(updatedThread, updatedInbox);

      // Verify Reply button is hidden during migration phase p3
      cy.get(Locators.BUTTONS.REPLY).should('not.exist');

      // Verify CannotReplyAlert is NOT displayed (migration alert takes precedence)
      cy.get('[data-testid="cannot-reply-alert"]').should('not.exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Migration Phase P4 - Blocking Replies', () => {
    it('hides reply button when ohMigrationPhase is p4', () => {
      const { updatedThread, updatedInbox } = updateMigrationPhase(
        migrationThreadResponse,
        migrationInboxMessages,
        'p4',
      );

      // Login with user that has migrationSchedules in profile
      SecureMessagingSite.login(
        undefined,
        undefined,
        true,
        migratingUserFixture,
      );
      PatientInboxPage.loadInboxMessages(updatedInbox);
      PatientMessageDetailsPage.loadSingleThread(updatedThread, updatedInbox);

      // Verify Reply button is hidden during migration phase p4
      cy.get(Locators.BUTTONS.REPLY).should('not.exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Migration Phase P5 - Blocking Replies', () => {
    it('hides reply button when ohMigrationPhase is p5', () => {
      const { updatedThread, updatedInbox } = updateMigrationPhase(
        migrationThreadResponse,
        migrationInboxMessages,
        'p5',
      );

      // Login with user that has migrationSchedules in profile
      SecureMessagingSite.login(
        undefined,
        undefined,
        true,
        migratingUserFixture,
      );
      PatientInboxPage.loadInboxMessages(updatedInbox);
      PatientMessageDetailsPage.loadSingleThread(updatedThread, updatedInbox);

      // Verify Reply button is hidden during migration phase p5
      cy.get(Locators.BUTTONS.REPLY).should('not.exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Migration Phase P2 - Not Blocking Replies', () => {
    it('shows reply button when ohMigrationPhase is p2 (non-blocking phase)', () => {
      const { updatedThread, updatedInbox } = updateMigrationPhase(
        migrationThreadResponse,
        migrationInboxMessages,
        'p2',
      );

      SecureMessagingSite.login(
        undefined,
        undefined,
        true,
        migratingUserFixture,
      );
      PatientInboxPage.loadInboxMessages(updatedInbox);
      PatientMessageDetailsPage.loadSingleThread(updatedThread, updatedInbox);

      // Verify Reply button is visible (p2 does not block replies)
      cy.get(Locators.BUTTONS.REPLY).should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
