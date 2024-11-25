import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockMessages from './fixtures/messages-response.json';
import mockThread from './fixtures/thread-response.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('SM DELETE REPLY DRAFT', () => {
  it('verify user can delete draft on reply', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
    PatientInboxPage.loadSingleThread(mockThread);

    cy.intercept(
      `GET`,
      `http://localhost:3000/my_health/v1/messaging/messages/7192838/thread?full_body=true`,
      mockThread,
    ).as(`testRequest`);
    cy.get(Locators.BUTTONS.REPLY).click();
    PatientInterstitialPage.getContinueButton().click();

    PatientReplyPage.getMessageBodyField()
      .focus()
      .clear()
      .type(`Test body`);

    PatientMessageDraftsPage.clickDeleteButton();

    cy.get(Locators.BUTTONS.DELETE_CONFIRM).click({ force: true });

    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    PatientMessageDraftsPage.verifyDraftMessageBannerTextHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
