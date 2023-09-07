import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import customFolderMessage from './fixtures/messages-response.json';
import customFolder from './fixtures/folder-custom-metadata.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Custom Folder Delete Error Message Validation', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const folderPage = new FolderManagementPage();

  beforeEach(() => {
    site.login();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175*',
      customFolder,
    ).as('test2Folder');
    landingPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
      customFolderMessage,
    ).as('customFolder');

    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.wait('@customFolder');
    cy.wait('@test2Folder');
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
    folderPage
      .editFolderNameButton()
      .click({ force: true, waitforanimations: false });

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
