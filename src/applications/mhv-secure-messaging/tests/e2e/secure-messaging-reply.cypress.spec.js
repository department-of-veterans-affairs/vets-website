import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/thread-response-new-api.json';

describe('Secure Messaging Reply Axe Check', () => {
  it('Axe Check Message Reply', () => {
    const updatedSingleThreadResponse =
      GeneralFunctionsPage.updatedThreadDates(singleThreadResponse);
    const singleMessage = { data: updatedSingleThreadResponse.data[0] };
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();

    PatientReplyPage.getMessageBodyField()
      .should('not.be.disabled')
      .clear()
      .type('Test message body', {
        force: true,
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientReplyPage.clickSendReplyMessageButton(singleMessage);

    cy.get(Locators.SPINNER).should('be.visible');

    PatientReplyPage.verifySendMessageConfirmationMessageText();

    PatientReplyPage.verifySendMessageConfirmationHasFocus();

    cy.get(Locators.SPINNER).should('not.exist');
  });
});
