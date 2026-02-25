import SecureMessagingSite from './sm_site/SecureMessagingSite';
import ContactListPage from './pages/ContactListPage';
import { AXE_CONTEXT } from './utils/constants';
import mockUserP6 from './fixtures/userResponse/user-migrating-facility-p6.json';
import mockUser from './fixtures/userResponse/user.json';

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
  const ALERT_TESTID = 'contact-list-migration-alert';

  describe('POST_MIGRATION variant (phase p6)', () => {
    const ALERT_HEADLINE = 'We updated your contact list';
    const ALERT_BODY =
      'We removed care teams from these facilities from your contact list:';

    beforeEach(() => {
      SecureMessagingSite.login(undefined, undefined, true, mockUserP6);
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
