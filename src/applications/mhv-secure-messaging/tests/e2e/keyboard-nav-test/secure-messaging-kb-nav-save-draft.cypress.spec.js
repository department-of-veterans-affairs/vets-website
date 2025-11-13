import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import requestBody from '../fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from '../utils/constants';
import SharedComponents from '../pages/SharedComponents';

describe('SM SAVING DRAFT BY KEYBOARD', () => {
  it('verify draft saved', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.navigateToComposePage(true);
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();

    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`);

    // temporarily using save button to save draft
    PatientComposePage.saveNewDraft(requestBody.category, requestBody.subject);

    PatientMessageDraftsPage.verifySavedMessageAlertText();

    // Wait for the breadcrumb element to be fully loaded and visible
    SharedComponents.clickBackBreadcrumb();

    cy.findByTestId('route-guard-secondary-button')
      .should('be.visible')
      .click();

    cy.findByText('Messages: Inbox').should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
