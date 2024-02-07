import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import { Alerts, DefaultFolders } from '../../util/constants';

describe('SM back navigation', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('user navigate to inbox folder after message sent', () => {
    const composePage = new PatientComposePage();
    landingPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click();
    composePage.getMessageSubjectField().type(`${requestBody.subject}`);
    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });
    composePage.sendMessage(requestBody);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.HEADER).should('have.text', DefaultFolders.INBOX.header);
    cy.location().should(loc => {
      expect(loc.pathname).to.eq(Paths.UI_MAIN + Paths.INBOX);
    });
  });

  it('user navigate to drafts folder after message sent', () => {
    const draftPage = new PatientMessageDraftsPage();
    draftPage.loadDraftMessages();
    draftPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    draftPage.sendDraftMessage(mockDraftResponse);
    draftPage.verifyConfirmationMessage(Alerts.Message.SEND_MESSAGE_SUCCESS);

    cy.injectAxe();

    cy.get(Locators.HEADER).should('have.text', DefaultFolders.DRAFTS.header);
    cy.location().should(loc => {
      expect(loc.pathname).to.eq(Paths.UI_MAIN + Paths.DRAFTS);
    });
  });
});
