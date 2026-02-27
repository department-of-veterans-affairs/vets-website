import SecureMessagingSite from './sm_site/SecureMessagingSite';
import ContactListPage from './pages/ContactListPage';
import { AXE_CONTEXT, Alerts, Locators } from './utils/constants';
import mockUser from './fixtures/userResponse/user.json';

/**
 * Helper to create a migrating-user fixture from the base user fixture.
 * Adds OH migration schedule data with the specified phase, avoiding the
 * need for a separate full-response fixture file.
 *
 * @param {string} phase - The current migration phase (e.g. 'p6')
 * @param {Array} facilities - Array of { facilityId, facilityName } objects
 * @returns {Object} Modified user fixture with migration data
 */
const createMigratingUser = (
  phase = 'p6',
  facilities = [
    { facilityId: '553', facilityName: 'VA Detroit Healthcare System' },
    { facilityId: '655', facilityName: 'VA Saginaw Healthcare System' },
  ],
) => {
  const migrationSchedule = {
    migrationDate: 'February 15, 2026',
    facilities,
    migrationStatus: 'ACTIVE',
    phases: {
      current: phase,
      p0: 'December 15, 2025',
      p1: 'December 30, 2025',
      p2: 'January 14, 2026',
      p3: 'February 7, 2026',
      p4: 'February 10, 2026',
      p5: 'February 13, 2026',
      p6: 'February 15, 2026',
      p7: 'March 17, 2026',
      p8: 'April 1, 2026',
      p9: 'April 16, 2026',
    },
  };

  return {
    ...mockUser,
    data: {
      ...mockUser.data,
      attributes: {
        ...mockUser.data.attributes,
        profile: {
          ...mockUser.data.attributes.profile,
          userFacilityMigratingToOh: true,
          migrationSchedules: [migrationSchedule],
        },
        vaProfile: {
          ...mockUser.data.attributes.vaProfile,
          facilities: facilities.map(f => ({
            facilityId: f.facilityId,
            isCerner: false,
          })),
          ohMigrationInfo: {
            userAtPretransitionedOhFacility: false,
            userFacilityReadyForInfoAlert: false,
            userFacilityMigratingToOh: true,
            migrationSchedules: [migrationSchedule],
          },
        },
      },
    },
  };
};

/**
 * E2E Test: Contact List Migration Alert (Issue #132291)
 *
 * Purpose:
 * Test that the Contact List page displays the post-migration alert for users
 * whose facilities have completed Oracle Health migration (phase p6).
 *
 * Test Scenarios:
 * 1. User with facility in phase p6 → POST_MIGRATION alert displayed
 * 2. User without migration schedules → No alert displayed
 * 3. Alert is closeable
 * 4. Accessibility check
 */

describe('SM Contact List Migration Alert', () => {
  const ALERT_TESTID = Locators.ALERTS.CONTACT_LIST_MIGRATION;
  const {
    HEADLINE: ALERT_HEADLINE,
    BODY: ALERT_BODY,
  } = Alerts.CONTACT_LIST_MIGRATION.POST_MIGRATION;

  describe('POST_MIGRATION variant (phase p6)', () => {
    beforeEach(() => {
      SecureMessagingSite.login(
        undefined,
        undefined,
        true,
        createMigratingUser(),
      );
      ContactListPage.loadContactList();
    });

    it('displays the post-migration alert', () => {
      cy.findByTestId(ALERT_TESTID).should('exist');
      cy.findByText(ALERT_HEADLINE).should('be.visible');
      cy.findByText(ALERT_BODY).should('be.visible');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('displays migrating facility names', () => {
      cy.findByTestId(ALERT_TESTID).within(() => {
        cy.findByText('VA Detroit Healthcare System').should('exist');
        cy.findByText('VA Saginaw Healthcare System').should('exist');
      });
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('displays the reassurance message', () => {
      cy.findByTestId(ALERT_TESTID).within(() => {
        cy.contains(
          'You can still send messages to care teams at these facilities',
        ).should('exist');
        cy.contains('the care team names will be different').should('exist');
      });
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('is closeable', () => {
      cy.injectAxe();
      cy.findByTestId(ALERT_TESTID).should('exist');
      cy.axeCheck(AXE_CONTEXT);

      // Close the alert via the VA web component close button
      cy.findByTestId(ALERT_TESTID)
        .shadow()
        .find('button.va-alert-close')
        .click({ force: true });

      cy.findByTestId(ALERT_TESTID).should('not.exist');
    });

    it('passes accessibility check', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('User without migration schedules', () => {
    beforeEach(() => {
      SecureMessagingSite.login(undefined, undefined, true, mockUser);
      ContactListPage.loadContactList();
    });

    it('does NOT display the contact list migration alert', () => {
      cy.findByTestId(ALERT_TESTID).should('not.exist');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('passes accessibility check', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
