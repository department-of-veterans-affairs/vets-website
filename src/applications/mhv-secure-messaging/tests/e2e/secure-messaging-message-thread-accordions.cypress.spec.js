import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockThreadResponse from './fixtures/thread-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Thread Details', () => {
  const date = new Date();
  const messageIdList = mockThreadResponse.data.map(
    el => el.attributes.messageId,
  );

  it('verify expanded messages focus', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadSingleThread(mockThreadResponse, date);

    for (let i = 1; i < messageIdList.length; i += 1) {
      cy.get(
        `[data-testid="expand-message-button-${messageIdList[i]}"]`,
      ).click();

      cy.get(`[data-testid="expand-message-button-${messageIdList[i]}"]`)
        .shadow()
        .find('button')
        .should('have.attr', 'aria-expanded', 'true');
    }

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
