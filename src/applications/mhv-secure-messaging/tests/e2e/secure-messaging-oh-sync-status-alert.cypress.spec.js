import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessages from './fixtures/threads-response.json';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';
import mockSentThreads from './fixtures/sentResponse/sent-messages-response.json';
import mockDrafts from './fixtures/drafts-response.json';
import mockOHSyncComplete from './fixtures/ohSyncStatus/oh-sync-complete.json';
import mockOHSyncIncomplete from './fixtures/ohSyncStatus/oh-sync-incomplete.json';
import { AXE_CONTEXT, Locators, Paths, Alerts } from './utils/constants';

describe('Secure Messaging OH Sync Status Alert', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
  });

  it('displays alert when syncComplete is false', () => {
    cy.intercept(
      'GET',
      Paths.INTERCEPT.OH_SYNC_STATUS,
      mockOHSyncIncomplete,
    ).as('ohSyncStatus');

    PatientInboxPage.loadInboxMessages(mockMessages, undefined, mockRecipients);

    cy.wait('@ohSyncStatus');

    // Verify alert is displayed
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('be.visible');

    // Verify alert content
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT)
      .find('h2[slot="headline"]')
      .should('contain.text', Alerts.OH_SYNC_STATUS.HEADER);

    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT)
      .find('p')
      .should('contain.text', Alerts.OH_SYNC_STATUS.BODY);

    // Verify alert type
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should(
      'have.attr',
      'status',
      'warning',
    );

    // Verify alert is closeable
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should(
      'have.attr',
      'closeable',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('does not display alert when syncComplete is true', () => {
    cy.intercept('GET', Paths.INTERCEPT.OH_SYNC_STATUS, mockOHSyncComplete).as(
      'ohSyncStatus',
    );

    PatientInboxPage.loadInboxMessages(mockMessages, undefined, mockRecipients);

    cy.wait('@ohSyncStatus');

    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('alert only displays on inbox folder, not on sent folder', () => {
    cy.intercept(
      'GET',
      Paths.INTERCEPT.OH_SYNC_STATUS,
      mockOHSyncIncomplete,
    ).as('ohSyncStatus');

    PatientInboxPage.loadInboxMessages(mockMessages, undefined, mockRecipients);

    cy.wait('@ohSyncStatus');

    // Verify alert is displayed on inbox
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('be.visible');

    // Navigate to sent folder by URL
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/-1/threads*`,
      mockSentThreads,
    ).as('sentThreads');
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1*`, {
      data: {
        id: '-1',
        type: 'folders',
        attributes: {
          folderId: -1,
          name: 'Sent',
          count: 0,
          unreadCount: 0,
          systemFolder: true,
        },
      },
    }).as('sentFolder');

    cy.visit(`${Paths.UI_MAIN}/sent/`);
    cy.wait('@sentThreads');

    // Verify alert is NOT displayed on sent folder
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('alert only displays on inbox folder, not on drafts folder', () => {
    cy.intercept(
      'GET',
      Paths.INTERCEPT.OH_SYNC_STATUS,
      mockOHSyncIncomplete,
    ).as('ohSyncStatus');

    PatientInboxPage.loadInboxMessages(mockMessages, undefined, mockRecipients);

    cy.wait('@ohSyncStatus');

    // Verify alert is displayed on inbox
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('be.visible');

    // Navigate to drafts folder by URL
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`, {
      data: {
        id: '-2',
        type: 'folders',
        attributes: {
          folderId: -2,
          name: 'Drafts',
          count: 0,
          unreadCount: 0,
          systemFolder: true,
        },
      },
    }).as('draftsFolder');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      mockDrafts,
    ).as('drafts');

    cy.visit(`${Paths.UI_MAIN}/drafts/`);
    cy.wait('@drafts');

    // Verify alert is NOT displayed on drafts folder
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('does not display alert when API call fails', () => {
    cy.intercept('GET', Paths.INTERCEPT.OH_SYNC_STATUS, {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('ohSyncStatusError');

    PatientInboxPage.loadInboxMessages(mockMessages, undefined, mockRecipients);

    cy.wait('@ohSyncStatusError');

    // Verify alert is NOT displayed when API fails
    cy.get(Locators.ALERTS.OH_SYNC_STATUS_ALERT).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
