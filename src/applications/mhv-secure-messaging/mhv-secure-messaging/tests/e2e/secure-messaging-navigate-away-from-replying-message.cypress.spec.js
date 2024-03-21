import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    const testMessage = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, testMessage);
    messageDetailsPage.loadMessageDetails(testMessage);
    messageDetailsPage.loadReplyPageDetails(testMessage);
    PatientInterstitialPage.getContinueButton().click({
      waitForAnimations: true,
    });
    PatientReplyPage.getMessageBodyField().type('Test message body', {
      force: true,
    });

    cy.get(Locators.FOLDERS.INBOX).click();
    // this test is temporarily commented-out because this functionality
    // has been removed from the frontend. The modal design needs revision by design/ucd
    // and will be reintroduced later
    // cy.get('[data-testid="reply-form"]')
    //   .find('h1')
    //   .should('have.text', "We can't save this message yet");
    // cy.get('[data-testid="reply-form"]')
    //   .find('va-button')
    //   .should('have.attr', 'text', 'Continue editing');
    // cy.get('[data-testid="reply-form"]')
    //   .find('va-button[secondary]')
    //   .should('have.attr', 'text', 'Delete draft');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
