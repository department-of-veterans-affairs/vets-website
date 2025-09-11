import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('SM SAVING DRAFT WITH ATTACHMENT BY KEYBOARD', () => {
  it.skip('verify draft saved without attachment', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.navigateToComposePage(true);
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();

    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`);
    PatientComposePage.attachMessageFromFile();

    PatientComposePage.saveDraftByKeyboard();

    PatientMessageDraftsPage.verifySaveWithAttachmentAlert();

    PatientComposePage.clickSaveDraftWithoutAttachmentBtn();
    cy.findByTestId('sm-breadcrumbs-back')
      .should('be.visible')
      .click();

    PatientComposePage.clickSaveDraftWithoutAttachmentBtn();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
