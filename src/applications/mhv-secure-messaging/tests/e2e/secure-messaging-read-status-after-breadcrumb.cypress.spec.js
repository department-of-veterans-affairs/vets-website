import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import threadResponseUnreadInbox from './fixtures/thread-response-unread-inbox.json';
import threadsWithUnread from './fixtures/threads-response-with-unread.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('SM Read Status - Breadcrumb Navigation', () => {
  /**
   * This test validates GitHub issue #125994: Read/unread flag not updating after opening message
   *
   * The fix (Option D) ensures that when markMessageAsReadInThread is called, it dispatches
   * MARK_THREAD_AS_READ which directly updates the thread's unreadMessages flag in Redux.
   * This means when navigating back to inbox, the updated state is immediately reflected
   * without needing to refetch from the API.
   *
   * Note: This E2E test verifies the end-to-end flow. The accordion auto-expand triggers
   * markMessageAsReadInThread which updates Redux state. When navigating back, the inbox
   * shows the correct read status from the updated Redux state.
   */
  it('should update thread read status when message is marked as read', () => {
    SecureMessagingSite.login();

    // Load inbox with unread thread
    PatientInboxPage.loadInboxMessages(threadsWithUnread);

    // Verify the unread indicator is visible on first thread
    cy.get('[data-testid="thread-list-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="thread-list-unread-icon"]').should('exist');
      });

    // Load the single thread (navigates to thread detail page)
    // This also sets up intercepts for message API calls via the page object
    PatientInboxPage.loadSingleThread(threadResponseUnreadInbox);

    // Wait for the thread detail page to load and verify first accordion is expanded
    cy.get('[data-testid="thread-expand-all"]').should('exist');
    cy.get('va-accordion-item')
      .first()
      .should('have.attr', 'open');

    // Wait for the first message API call to complete
    // This is made by loadSingleThread's intercept (@fist-message-in-thread)
    // In the real app, this call is made by markMessageAsReadInThread
    // when the accordion expands, which then updates Redux via MARK_THREAD_AS_READ
    cy.wait('@fist-message-in-thread');

    // Click back breadcrumb to navigate back to inbox
    cy.get(`[data-testid="${Locators.BACK_BREADCRUMB_DATA_TEST_ID}"]`).click({
      waitForAnimations: false,
    });

    // Wait for inbox to be visible
    cy.url().should('include', '/inbox');

    // Verify we're on the inbox page
    cy.get('[data-testid="thread-list-item"]').should('exist');

    // Verify the thread is now shown as READ (no unread indicator)
    // With Option D fix, MARK_THREAD_AS_READ updates threadList in Redux
    // so the unread icon should no longer appear
    cy.get('[data-testid="thread-list-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="thread-list-unread-icon"]').should('not.exist');
      });

    // Accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
