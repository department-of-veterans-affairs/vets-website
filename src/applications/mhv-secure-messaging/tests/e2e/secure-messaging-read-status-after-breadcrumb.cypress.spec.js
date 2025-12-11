import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import threadResponseUnreadInbox from './fixtures/thread-response-unread-inbox.json';
import threadsWithUnread from './fixtures/threads-response-with-unread.json';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';

describe('SM Read Status - Breadcrumb Navigation', () => {
  /**
   * This test validates GitHub issue #125994: Read/unread flag not updating after opening message
   *
   * The fix ensures that when markMessageAsReadInThread is called, it dispatches
   * setThreadRefetchRequired(true) which triggers a refetch of the thread list from the API.
   * This means when navigating back to inbox, the updated state is fetched fresh from the
   * server, ensuring accurate read status (since a thread may have multiple unread messages).
   *
   * Note: This E2E test verifies the end-to-end flow. The accordion auto-expand triggers
   * markMessageAsReadInThread which sets the refetch flag. When navigating back, the inbox
   * refetches threads and shows the correct read status from the API.
   */
  it('should update thread read status when message is marked as read', () => {
    SecureMessagingSite.login();

    // Create modified thread list where the first thread is now read
    // This simulates the API returning updated read status after the message was read
    const threadsAfterRead = {
      ...threadsWithUnread,
      data: threadsWithUnread.data.map(
        (thread, index) =>
          index === 0
            ? {
                ...thread,
                attributes: { ...thread.attributes, unreadMessages: false },
              }
            : thread,
      ),
    };

    // Load inbox with unread thread
    PatientInboxPage.loadInboxMessages(threadsWithUnread);

    // Verify the unread indicator is visible on first thread
    cy.get('[data-testid="thread-list-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="thread-list-unread-icon"]').should('exist');
      });

    // Load the single thread (navigates to thread detail page)
    PatientInboxPage.loadSingleThread(threadResponseUnreadInbox);

    // Wait for the thread detail page to load and verify first accordion is expanded
    cy.get('[data-testid="thread-expand-all"]').should('exist');
    cy.get('va-accordion-item')
      .first()
      .should('have.attr', 'open');

    // Wait for the first message API call to complete
    // This is made by loadSingleThread's intercept (@fist-message-in-thread)
    // In the real app, this call is made by markMessageAsReadInThread
    // when the accordion expands, which sets refetchRequired to true
    cy.wait('@fist-message-in-thread');

    // Set up intercept for the refetch call that will happen when navigating back
    // The loadInboxMessages intercept is already set up - we need to override it
    // to return the updated (read) thread list
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      threadsAfterRead,
    ).as('refetch-threads');

    // Also intercept the inbox folder metadata call
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/0*`, {
      statusCode: 200,
      body: {
        data: {
          id: '0',
          type: 'folders',
          attributes: {
            folderId: 0,
            name: 'Inbox',
            count: 2,
            unreadCount: 0, // Updated to reflect read status
            systemFolder: true,
          },
        },
      },
    }).as('inbox-folder');

    // Click back breadcrumb to navigate back to inbox
    cy.get(`[data-testid="${Locators.BACK_BREADCRUMB_DATA_TEST_ID}"]`).click({
      waitForAnimations: false,
    });

    // Wait for inbox folder to load (always happens on navigation)
    cy.wait('@inbox-folder', { timeout: 10000 });

    // Wait for inbox to be visible
    cy.url().should('include', '/inbox');

    // Verify we're on the inbox page
    cy.get('[data-testid="thread-list-item"]').should('exist');

    // Verify the thread is now shown as READ (no unread indicator)
    // The refetch mechanism gets fresh data from the API
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
