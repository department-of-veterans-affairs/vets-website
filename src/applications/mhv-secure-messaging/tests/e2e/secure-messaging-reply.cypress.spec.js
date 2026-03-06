import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import mockSignature from './fixtures/signature-response.json';

describe('Secure Messaging Reply Axe Check', () => {
  it('Axe Check Message Reply', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    const singleMessage = { data: updatedSingleThreadResponse.data[0] };
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();

    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.SIGNATURE,
      mockSignature,
    ).as('signature');
    cy.wait('@signature');

    // Wait for reply form to be fully loaded before interacting
    PatientReplyPage.verifyReplyHeader();

    PatientReplyPage.getMessageBodyField()
      .should('be.visible')
      .and('not.be.disabled');
    PatientReplyPage.getMessageBodyField().clear();
    PatientReplyPage.getMessageBodyField().should('have.value', '');
    PatientReplyPage.getMessageBodyField().type('Test message body', {
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
