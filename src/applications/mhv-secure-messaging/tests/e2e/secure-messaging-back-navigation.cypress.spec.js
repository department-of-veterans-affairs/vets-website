import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import mockDraftResponse from './fixtures/message-draft-response.json';
import { Alerts, DefaultFolders } from '../../util/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('SM back navigation', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
  });

  it('user navigate to inbox folder after message sent', () => {
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBody);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});

    cy.findByRole('heading', {
      name: `Messages: ${DefaultFolders.INBOX.header}`,
    }).should('exist');
    cy.location().should(loc => {
      expect(loc.pathname).to.eq(Paths.UI_MAIN + Paths.INBOX);
    });
  });

  it('user navigate to drafts folder after message sent', () => {
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();
    PatientMessageDraftsPage.sendDraftMessage(mockDraftResponse);
    PatientMessageDraftsPage.verifyConfirmationMessage(
      Alerts.Message.SEND_MESSAGE_SUCCESS,
    );

    GeneralFunctionsPage.verifyPageHeader(`Messages: Drafts`);
    GeneralFunctionsPage.verifyUrl(`drafts`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('user can click "Review your sent messages" link in success alert to navigate to sent folder', () => {
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBody);

    // Verify success alert is shown
    PatientMessageDraftsPage.verifyConfirmationMessage(
      Alerts.Message.SEND_MESSAGE_SUCCESS,
    );

    // Click the link to navigate to Sent folder
    cy.findByTestId('review-sent-messages-link')
      .should('be.visible')
      .click();

    // Verify navigation to Sent folder succeeded
    cy.location().should(loc => {
      expect(loc.pathname).to.eq(Paths.UI_MAIN + Paths.SENT);
    });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
