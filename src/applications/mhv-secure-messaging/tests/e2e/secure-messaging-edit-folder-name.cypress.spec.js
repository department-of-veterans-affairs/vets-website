import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import FolderLoadPage from './pages/FolderLoadPage';

describe('edit custom folder name validation', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
  });
  it('verify axe check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('verify edit folder name buttons', () => {
    PatientMessageCustomFolderPage.loadMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.editFolderButton()
      .should('be.visible')
      .click({ waitForAnimations: true });
    PatientMessageCustomFolderPage.submitEditFolderName('updatedName');

    cy.findByTestId('alert-text')
      .should('be.visible')
      .and('contain.text', Data.FOLDER_RENAMED_SUCCESSFULLY);

    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('be.visible');
  });

  it('verify edit folder name error', () => {
    PatientMessageCustomFolderPage.loadMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.editFolderButton()
      .should('be.visible')
      .click({ waitForAnimations: true });

    // Wait for the edit form to be visible
    cy.findByTestId('edit-folder-form').should('be.visible');

    // Clear the pre-filled folder name to trigger blank validation
    cy.fillVaTextInput('new-folder-name', '');

    cy.findByTestId('save-edit-folder-button')
      .should('be.visible')
      .click({ waitForAnimations: true });

    // Check error attribute on web component (findByLabelText doesn't work for VA web components)
    cy.get('va-text-input[name="new-folder-name"]')
      .should('have.attr', 'error')
      .and('include', Data.FOLDER_NAME_CANNOT_BLANK);
  });
});
