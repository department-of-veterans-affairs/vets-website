import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('create folder errors check', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();

  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
  });

  it('create folder network error check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.loadFoldersList();
    folderPage.createANewFolderButton().click({ waitForAnimations: true });
    const createFolderName = 'create folder test';
    folderPage
      .createFolderTextBox()
      .type(createFolderName, { waitforanimations: true, force: true });
    cy.intercept('POST', '/my_health/v1/messaging/folder', {
      statusCode: 400,
      body: {
        alertType: 'error',
        header: 'err.title',
        content: 'err.detail',
        response: {
          header: 'err.title',
          content: 'err.detail',
        },
      },
    }).as('folder');
    folderPage.createFolderModalButton().click();
    folderPage.verifyCreateFolderNetworkFailureMessage();
  });

  it('create blank name folder error check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.loadFoldersList();
    cy.get(Locators.BUTTONS.CREATE_FOLDER).click();
    cy.get(Locators.BUTTONS.CREATE_FOLDER).click({
      waitForAnimations: true,
      force: true,
    });
    cy.get(Locators.FOLDERS.NAME)
      .shadow()
      .find('#input-error-message')
      .should('contain', 'Folder name cannot be blank');
  });
});
