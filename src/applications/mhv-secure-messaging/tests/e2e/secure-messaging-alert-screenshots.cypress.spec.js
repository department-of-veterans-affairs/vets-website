/**
 * Screenshot capture for alert positioning review.
 * Captures evidence that AlertBackgroundBox renders BELOW H1 per accessibility requirements.
 */
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientReplyPage from './pages/PatientReplyPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import FolderManagementPage from './pages/FolderManagementPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import FolderLoadPage from './pages/FolderLoadPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import mockFolders from './fixtures/folder-response.json';
import requestBody from './fixtures/message-compose-request-body.json';
import singleThreadResponse from './fixtures/thread-response-new-api.json';
import { AXE_CONTEXT, Data } from './utils/constants';

describe('Alert Position Screenshots', () => {
  const updatedFolders = {
    ...mockFolders,
    data: [...mockFolders.data, createdFolderResponse.data],
  };

  it('Screenshot: Compose - Message sent success alert below H1', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();

    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });

    PatientComposePage.sendMessage(requestBody);

    // Wait for spinner then verify alert - matching original compose test pattern
    cy.get('.loading-indicator').should('be.visible');

    cy.get('[data-testid="alert-text"]')
      .should('be.visible')
      .and('contain.text', Data.SECURE_MSG_SENT_SUCCESSFULLY);

    // Take screenshot immediately - may miss due to 1-second navigation
    cy.screenshot('01-compose-sent-success-alert', { capture: 'viewport' });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Screenshot: Reply - Reply sent success alert below H1', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    const singleMessage = { data: updatedSingleThreadResponse.data[0] };

    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
    PatientReplyPage.clickReplyButton(updatedSingleThreadResponse);
    PatientInterstitialPage.getContinueButton().click();

    PatientReplyPage.getMessageBodyField()
      .clear()
      .type('Test reply message body', { force: true });

    PatientReplyPage.clickSendReplyMessageButton(singleMessage);

    // Wait for spinner then verify alert
    cy.get('.loading-indicator').should('be.visible');

    cy.get('[data-testid="alert-text"]')
      .should('be.visible')
      .and('contain.text', Data.SECURE_MSG_SENT_SUCCESSFULLY);

    // Take screenshot immediately
    cy.screenshot('02-reply-sent-success-alert', { capture: 'viewport' });
  });

  it('Screenshot: Move message to new folder - Success alert below H1', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadSingleThread();

    FolderManagementPage.selectFolderFromModal(`Create new folder`);
    FolderManagementPage.moveMessageToNewFolder(updatedFolders);
    FolderManagementPage.backToInbox();

    cy.get('[data-testid="alert-text"]').should('be.visible');
    cy.get('h1').should('have.focus');
    cy.screenshot('03-move-message-success-alert', { capture: 'viewport' });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Screenshot: Folder create - Success alert below H1', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();

    PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);

    FolderManagementPage.verifyFolderActionMessage(
      Data.FOLDER_CREATED_SUCCESSFULLY,
    );

    cy.get('h1').should('have.focus');
    cy.screenshot('04-folder-create-success-alert', { capture: 'viewport' });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Screenshot: Folder delete - Success alert below H1', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();

    PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);
    PatientMessageCustomFolderPage.loadCustomFolderWithNoMessages();
    cy.findByText('There are no messages in this folder.').should('be.visible');

    FolderManagementPage.clickDeleteFolderButton();
    PatientMessageCustomFolderPage.deleteCustomFolder();

    FolderManagementPage.verifyFolderActionMessage(
      Data.FOLDER_REMOVED_SUCCESSFULLY,
    );

    cy.get('h1').should('have.focus');
    cy.screenshot('05-folder-delete-success-alert', { capture: 'viewport' });
  });
});
