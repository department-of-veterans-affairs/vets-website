import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from './utils/constants';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';

describe('SM back navigation', () => {
  it('user navigate to inbox folder after message sent', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    composePage.selectRecipient(requestBody.recipientId);
    composePage.getCategory(requestBody.category).click();
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

    cy.get('h1').should('have.text', 'Inbox');
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/my-health/secure-messages/inbox/');
    });
  });

  it('user navigate to drafts folder after message sent', () => {
    const draftPage = new PatientMessageDraftsPage();
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadDraftMessages();
    draftPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    draftPage.sendDraftMessage(mockDraftResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('h1').should('have.text', 'Drafts');
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/my-health/secure-messages/drafts/');
    });
  });
});
