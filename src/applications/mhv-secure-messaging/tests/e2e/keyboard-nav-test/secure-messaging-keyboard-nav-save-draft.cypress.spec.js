import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('SM SAVING DRAFT BY KEYBOARD', () => {
  it('verify draft saved', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.navigateToComposePage(true);
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();

    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`);

    PatientComposePage.saveDraftByKeyboard();

    PatientMessageDraftsPage.verifySavedMessageAlertText();

    cy.get(Locators.BUTTONS.SAVE_DRAFT).should(`be.focused`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.BACK_TO).click();
  });
});
