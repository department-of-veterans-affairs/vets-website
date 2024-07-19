import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Navigate Away From `Start a new message`', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Navigate Away From `Start a new message` To Inbox', () => {
    PatientInboxPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();

    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Inbox');
    cy.get(Locators.ALERTS.CREATE_NEW_MESSAGE).should('be.visible');
  });
});
