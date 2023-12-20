import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
// import mockBlockedRecipient from '../fixtures/recipientsResponse/blocked-recipients-response.json'

describe('No association with particular Triage Group', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  // const removedFirstRecipientsList = mockRecipients.data.slice(1);

  const threadWithNoAssociatedTG = {
    ...blockedThread,
    data: [
      {
        ...blockedThread.data[0],
        attributes: {
          ...blockedThread.data[0].attributes,
          recipientName: mockRecipients.data[0].attributes.name,
          triageGroupName: mockRecipients.data[0].attributes.name,
        },
      },
    ],
  };

  // TODO check if only one recipient disassociated
  it('inbox view', () => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockRecipients,
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    // cy.get('[close-btn-aria-label="Close notification"]')
    //   .find('h2')
    //   .should('include.text', 'not connected');
  });

  it.skip('alert message in detailed view', () => {
    site.login();

    landingPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockRecipients,
    );
    landingPage.loadSingleThread(threadWithNoAssociatedTG);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('[class="alert-expandable-title"]')
      .should('be.visible')
      .and('include.text', `You can't send messages to`);

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'closed');

    cy.get('[data-testid="blocked-triage-group-alert"]').click({
      waitForAnimations: true,
    });

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .shadow()
      .find('#alert-body')
      .should('have.class', 'open');

    cy.get('[data-testid="blocked-triage-group-alert"]')
      .find('a')
      .should('have.attr', 'href', '/find-locations/');

    cy.get(Locators.BUTTONS.REPLY).should('not.exist');
  });
});
