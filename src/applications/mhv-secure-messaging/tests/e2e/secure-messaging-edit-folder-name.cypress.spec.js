import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import FolderLoadPage from './pages/FolderLoadPage';

describe('edit custom folder name validation', () => {
  it('verify axe check', () => {
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('verify edit folder name buttons', () => {
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();

    PatientMessageCustomFolderPage.editFolderButton()
      .should('be.visible')
      .click({ waitForAnimations: true });
    PatientMessageCustomFolderPage.submitEditFolderName('updatedName');

    cy.get('[data-testid="alert-text"]')
      .should('be.visible')
      .and('contain.text', Data.FOLDER_RENAMED_SUCCESSFULLY);

    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('be.visible');
  });

  it('verify edit folder name error', () => {
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();

    PatientMessageCustomFolderPage.editFolderButton()
      .should('be.visible')
      .click({ waitForAnimations: true });

    cy.get('[text="Save"]')
      .should('be.visible')
      .click({ waitForAnimations: true });

    cy.get(Locators.FOLDERS.FOLDER_NAME, { timeout: 10000 })
      .shadow()
      .find('#input-error-message')
      .and('include.text', Data.FOLDER_NAME_CANNOT_BLANK);
  });
});
