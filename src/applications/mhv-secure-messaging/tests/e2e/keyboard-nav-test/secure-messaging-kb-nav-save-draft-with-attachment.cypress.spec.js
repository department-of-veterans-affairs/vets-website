import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from '../utils/constants';
import SharedComponents from '../pages/SharedComponents';

describe('SM SAVING DRAFT WITH ATTACHMENT BY KEYBOARD', () => {
  it('verify draft saved without attachment', () => {
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

    SharedComponents.clickBackBreadcrumb();

    cy.findByTestId('route-guard-secondary-button')
      .should('be.visible')
      .click();

    cy.findByText('Messages: Inbox').should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
