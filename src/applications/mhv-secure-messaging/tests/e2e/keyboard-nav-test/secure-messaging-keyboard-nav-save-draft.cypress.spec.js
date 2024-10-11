import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('SM SAVING DRAFT BY KEYBOARD', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.navigateToComposePage(true);
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();

    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`);
  });
  it('save draft without attachment', () => {
    PatientComposePage.saveDraftByKeyboard();

    PatientMessageDraftsPage.verifySavedMessageAlertText();
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should(`be.focused`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.BACK_TO).click();
  });

  it('save draft with attachment', () => {
    PatientComposePage.attachMessageFromFile();
    PatientComposePage.saveDraftByKeyboard();

    PatientMessageDraftsPage.verifySaveWithAttachmentAlert();
    cy.get(`[data-testid="quit-compose-double-dare"]`)
      .find(`[text*="without"]`)
      .click();
    cy.get(Locators.BUTTONS.SAVE_DRAFT).should(`be.focused`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.BACK_TO).click();
  });
});
