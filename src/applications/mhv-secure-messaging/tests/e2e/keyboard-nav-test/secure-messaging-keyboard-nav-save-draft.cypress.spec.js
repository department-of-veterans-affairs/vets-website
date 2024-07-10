import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Check confirmation message after save draft', () => {
  it('Check confirmation message after save draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.navigateToComposePage(true);
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);

    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });
    PatientComposePage.saveDraftByKeyboard();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientComposePage.verifyDraftSaveButtonOnFocus();
    cy.get('.sm-breadcrumb-list-item')
      .find('a')
      .click();
  });
});
