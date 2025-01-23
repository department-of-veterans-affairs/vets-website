import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import mockDraftResponse from './fixtures/message-draft-response.json';
import { Alerts, DefaultFolders } from '../../util/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('SM back navigation', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
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

    cy.get(Locators.HEADER).should('have.text', DefaultFolders.INBOX.header);
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

    GeneralFunctionsPage.verifyPageHeader(`Drafts`);
    GeneralFunctionsPage.verifyUrl(`drafts`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
