import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import PatientComposePage from '../pages/PatientComposePage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import SharedComponents from '../pages/SharedComponents';

/**
 * E2E: Contact list breadcrumb Back navigation
 *
 * Scenarios covered:
 * 1. From Inbox -> Contact List -> Back returns to Inbox (previous location)
 * 2. From Compose -> Contact List (via direct visit) -> Back returns to Inbox (fallback behavior)
 *
 * Note: The second test uses cy.visit() to navigate to contact list, which doesn't
 * properly set the previousUrl in Redux state. This simulates direct navigation
 * (bookmark/URL entry) and tests the fallback behavior where users are safely
 * returned to inbox when navigation history is incomplete.
 *
 * For real UI navigation flows with proper previousUrl tracking, see the
 * curated list breadcrumb tests which use actual button clicks.
 */

describe('SM CONTACT LIST BREADCRUMB BACK NAVIGATION', () => {
  it('returns to Inbox when arriving from Inbox', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    // Navigate to contact list (page object visit sets intercepts and visits URL)
    ContactListPage.loadContactList();

    // Verify we are on Contact list
    GeneralFunctionsPage.verifyPageHeader('Messages: Contact list');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Ensure Back breadcrumb visible and clickable
    SharedComponents.backBreadcrumb().should('have.attr', 'text', 'Back');
    SharedComponents.clickBackBreadcrumb();

    // Verify returned to Inbox
    GeneralFunctionsPage.verifyPageHeader('Messages: Inbox');
    cy.location('pathname').should('include', Paths.INBOX);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('returns to Inbox when arriving from Compose (no active draft)', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    // Navigate to compose page (classic or curated start depending on feature flags)
    PatientInboxPage.navigateToComposePage();

    // Basic sanity check we are on a compose-related page
    cy.location('pathname').should('include', Paths.COMPOSE);

    // Open recipients dropdown (ensures component mounts fully)
    PatientComposePage.openRecipientsDropdown?.();

    // Now navigate to Contact List via direct visit (simulates bookmark/direct navigation)
    // This doesn't set previousUrl properly, so behavior falls back to inbox
    ContactListPage.loadContactList();

    GeneralFunctionsPage.verifyPageHeader('Messages: Contact list');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    SharedComponents.backBreadcrumb().should('have.attr', 'text', 'Back');
    SharedComponents.clickBackBreadcrumb();

    // When no active draft and previousUrl isn't properly set, falls back to inbox
    GeneralFunctionsPage.verifyPageHeader('Messages: Inbox');
    cy.location('pathname').should('include', Paths.INBOX);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
