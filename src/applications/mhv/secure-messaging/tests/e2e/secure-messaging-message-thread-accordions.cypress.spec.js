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

  before('Axe Check Message Details Page', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadSingleThread(mockThreadResponse, date);
    cy.get(`[data-testid="expand-message-button-${messageIdList[0]}"]`)
      .shadow()
      .find('[part="accordion-header"]')
      .click();
  });

  it('verify expanded messages focus', () => {
    for (let i = 0; i < messageIdList.length; i += 1) {
      cy.get(`[data-testid="expand-message-button-${messageIdList[i]}"]`)
        .shadow()
        .find('[part="accordion-header"]')
        .click()
        .should('have.focus');

      // cy.focused().then(el => {
      //   console.log(el);
      // });
    }

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
