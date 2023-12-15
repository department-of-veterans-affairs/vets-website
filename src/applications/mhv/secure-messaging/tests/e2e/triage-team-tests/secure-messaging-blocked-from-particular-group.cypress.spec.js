import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockMessages from '../fixtures/messages-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockBlockedRecipients from '../fixtures/recipientsResponse/blocked-recipients-response.json';
import blockedThread from '../fixtures/recipientsResponse/thread-with-blocked-group-response.json';

describe('Secure Messaging Compose', () => {
  // const featureFlag = {
  //     name: 'mhv_secure_messaging_blocked_triage_group_1_0',
  //     value: true,
  //   }
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();

    landingPage.loadInboxMessages(
      // featureFlag,
      mockMessages,
      mockSingleMessage,
      mockBlockedRecipients,
    );

    landingPage.loadSingleThread(blockedThread);

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
  });
});
