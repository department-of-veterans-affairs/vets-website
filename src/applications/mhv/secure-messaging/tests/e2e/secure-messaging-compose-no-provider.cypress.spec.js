import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessage from '../fixtures/message-draft-response.json';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Secure Messaging Compose with No Provider', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPageForNoProvider();
    cy.get('[data-testid="compose-message-link"]').click({ force: true });
    PatientInterstitialPage.getContinueButton().click({ force: true });

    composePage.selectRecipient('');
    composePage
      .getCategory('COVID')
      .first()
      .click();
    composePage.getMessageSubjectField().type('Test Subject');
    composePage
      .getMessageBodyField()
      .type('Test message body', { force: true });

    cy.intercept('POST', Paths.SM_API_EXTENDED, mockDraftMessage).as('message');
    cy.get('[data-testid="Send-Button"]')
      .contains('Send')
      .click();
    composePage.verifySelectRecipientErrorMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
