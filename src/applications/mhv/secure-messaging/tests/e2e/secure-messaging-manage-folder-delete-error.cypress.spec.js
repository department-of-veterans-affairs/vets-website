import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import { AXE_CONTEXT } from './utils/constants';
import mockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from './fixtures/message-custom-response.json';
import mockFoldersResponse from './fixtures/folder-response.json';

describe('Secure Messaging Custom Folder Delete Error Message Validation', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const folderName = mockFoldersResponse.data.at(4).attributes.name;
  const { folderId } = mockFoldersResponse.data.at(4).attributes;

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.clickMyFoldersSideBar();
    FolderManagementPage.clickAndLoadCustomFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockCustomMessagesResponse,
    );
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
  });

  it('Axe Check Custom Folder List', () => {
    cy.get('.right-button').click({ force: true });

    cy.get('[class="modal hydrated"]')
      .shadow()
      .find('button');

    cy.get('[visible=""] > p');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.realPress(['Enter']);
  });

  it('Edit Folder Name check error on blank input', () => {
    FolderManagementPage.editFolderNameButton().click({
      force: true,
      waitforanimations: false,
    });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('input')
      .click();
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('input')
      .should('be.focused');
    cy.realPress(['Enter']);
    cy.realPress(['Tab']);
    cy.realPress(['Enter']);
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('#input-error-message')
      .should(err => {
        expect(err).to.contain('Folder name cannot be blank');
      });
  });
});
