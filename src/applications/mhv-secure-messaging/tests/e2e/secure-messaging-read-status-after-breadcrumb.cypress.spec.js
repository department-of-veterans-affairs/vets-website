import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import SharedComponents from './pages/SharedComponents';
import threadResponseUnreadInbox from './fixtures/thread-response-unread-inbox.json';
import threadsWithUnread from './fixtures/threads-response-with-unread.json';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';

describe('SM Read Status - Breadcrumb Navigation', () => {
  it('should update thread read status when message is marked as read', () => {
    SecureMessagingSite.login();

    // Simulate API response after message is read
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
    cy.findAllByTestId('thread-list-item')
      .first()
      .within(() => {
        cy.findByTestId('thread-list-unread-icon').should('exist');
      });

    // Navigate to thread detail page
    PatientInboxPage.loadSingleThread(threadResponseUnreadInbox);

    // Verify first accordion is auto-expanded (triggers mark as read)
    cy.findByTestId(Locators.BUTTONS.THREAD_EXPAND).should('exist');
    cy.get('va-accordion-item')
      .first()
      .should('have.attr', 'open');

    // Wait for mark-as-read API call
    cy.wait('@first-message-in-thread');

    // Intercept refetch with updated (read) thread list
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      threadsAfterRead,
    ).as('refetch-threads');

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
            unreadCount: 0,
            systemFolder: true,
          },
        },
      },
    }).as('inbox-folder');

    // Navigate back to inbox using SharedComponents helper
    // (handles web component hydration timing with scrollIntoView + force: true)
    SharedComponents.clickBackBreadcrumb();

    cy.wait('@inbox-folder', { timeout: 10000 });
    cy.url().should('include', '/inbox');

    cy.findAllByTestId('thread-list-item').should('exist');

    // Verify thread is now shown as read (no unread indicator)
    cy.findAllByTestId('thread-list-item')
      .first()
      .within(() => {
        cy.findByTestId('thread-list-unread-icon').should('not.exist');
      });

    // Accessibility check
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
