import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockThreadResponse from './fixtures/thread-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Thread Details', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const date = new Date();
  const messageIdList = mockThreadResponse.data.map(
    el => el.attributes.messageId,
  );

  // TODO find the problem - when click on first message focus will back to header
  // TODO find the alternate for 'cy.wait()'
  it('verify expanded messages focus', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadSingleThread(mockThreadResponse, date);
    // cy.wait(500);

    for (let i = 1; i < messageIdList.length; i += 1) {
      cy.get(`[data-testid="expand-message-button-${messageIdList[i]}"]`)
        .shadow()
        .find('[part="accordion-header"]')
        .click()
        .should('have.focus');
    }

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
