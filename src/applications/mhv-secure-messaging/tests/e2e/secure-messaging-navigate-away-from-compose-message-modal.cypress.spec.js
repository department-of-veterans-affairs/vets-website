import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Navigate Away From `Start a new message`', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
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

    FolderLoadPage.backToFolder('inbox');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    FolderLoadPage.backToFolder('inbox');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Inbox');
    cy.get(Locators.ALERTS.CREATE_NEW_MESSAGE).should('be.visible');
  });
});
