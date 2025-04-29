import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

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
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    PatientComposePage.selectCategory('COVID');
    PatientComposePage.getMessageSubjectField().type(`-updated`, {
      force: true,
    });

    PatientMessageDraftsPage.saveExistingDraft(
      'COVID',
      'newSavedDraft-updated',
    );

    cy.get(Locators.ALERTS.SAVE_ALERT).should(
      'contain',
      `message was saved on ${currentDate}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
