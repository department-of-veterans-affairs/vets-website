import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import { AXE_CONTEXT, Locators, Data, Paths } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('create folder errors check', () => {
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
    FolderManagementPage.createANewFolderButton().click({
      waitForAnimations: true,
    });
    const createFolderName = Data.CREATE_FOLDER_TEST;
    FolderManagementPage.createFolderTextBox().type(createFolderName, {
      waitforanimations: true,
      force: true,
    });
    cy.intercept('POST', Paths.INTERCEPT.MESSAGE_FOLDER, {
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
    FolderManagementPage.createFolderModalButton().click();
    FolderManagementPage.verifyCreateFolderNetworkFailureMessage();
  });

  it('create blank name folder error check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.loadFoldersList();
    cy.get(Locators.ALERTS.CREATE_NEW_FOLDER).click();
    cy.get(Locators.BUTTONS.CREATE_FOLDER).click({
      waitForAnimations: true,
      force: true,
    });
    cy.get(Locators.FOLDER_NAME)
      .shadow()
      .find('#input-error-message')
      .should('contain', Data.FOLDER_NAME_CANNOT_BLANK);
  });
});
