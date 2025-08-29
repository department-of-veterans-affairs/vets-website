import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import PatientComposePage from '../pages/PatientComposePage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

/**
 * E2E: Contact list breadcrumb Back navigation
 *
 * Scenarios covered:
 * 1. From Inbox -> Contact List -> Back returns to Inbox (previous location)
 * 2. From Compose (interstitial or classic compose) -> Contact List -> Back returns to Compose
 *
 * These satisfy the acceptance criterion that the Back breadcrumb returns the user
 * to their previous location when on /contact-list.
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
    cy.findByTestId('sm-breadcrumbs-back')
      .should('have.text', 'Back')
      .click();

    // Verify returned to Inbox
    GeneralFunctionsPage.verifyPageHeader('Messages: Inbox');
    cy.location('pathname').should('include', Paths.INBOX);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('returns to Compose when arriving from Compose', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    // Navigate to compose page (classic or curated start depending on feature flags)
    PatientInboxPage.navigateToComposePage();

    // Basic sanity check we are on a compose-related page
    cy.location('pathname').should('include', Paths.COMPOSE);

    // Open recipients dropdown (ensures component mounts fully)
    PatientComposePage.openRecipientsDropdown?.();

    // Now navigate to Contact List
    ContactListPage.loadContactList();

    GeneralFunctionsPage.verifyPageHeader('Messages: Contact list');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.findByTestId('sm-breadcrumbs-back')
      .should('have.text', 'Back')
      .click();

    // Expect to land back on compose (interstitial or start message path)
    cy.location('pathname').should('include', Paths.COMPOSE);

    // Header can vary (Start message vs older compose), so just assert path & key element
    cy.get('[data-testid="secure-messaging"]').should('exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
