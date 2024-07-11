import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe('save draft feature tests', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  it('save new draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory('OTHER');
    PatientComposePage.getMessageSubjectField().type(`test subject`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(`test body`, { force: true });
    PatientComposePage.saveNewDraft('OTHER', 'test subject');
    cy.get(Locators.ALERTS.SAVE_DRAFT).should('contain', 'message was saved');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('re-save existing draft', () => {
    const draftsPage = new PatientMessageDraftsPage();
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse);

    PatientComposePage.selectCategory('COVID');
    PatientComposePage.getMessageSubjectField().type(`-updated`, {
      force: true,
    });

    PatientComposePage.saveExistingDraft('COVID', 'test subject-updated');

    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'contain',
      `message was saved on ${currentDate}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
