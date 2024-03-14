import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('edit custom folder name validation', () => {
  it('verify axe check', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
  it('verify edit folder name buttons', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();

    PatientMessageCustomFolderPage.editFolderButton()
      .should('be.visible')
      .click({ waitForAnimations: true });
    PatientMessageCustomFolderPage.submitEditFolderName('updatedName');

    PatientMessageCustomFolderPage.VerifyFolderSuccesefullyRenamed();
    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('be.visible');
  });

  it('verify edit folder name error', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();

    PatientMessageCustomFolderPage.editFolderButton()
      .should('be.visible')
      .click({ waitForAnimations: true });

    PatientMessageCustomFolderPage.VerifySaveText();
    cy.get(Locators.FOLDERS.FOLDER_NAME, { timeout: 10000 })
      .shadow()
      .find('#input-error-message')
      .and('include.text', 'Folder name cannot be blank');
  });
});
