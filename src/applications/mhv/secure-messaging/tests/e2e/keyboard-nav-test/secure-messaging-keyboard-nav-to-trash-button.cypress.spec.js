import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import customFolderMessage from '../fixtures/messages-response.json';
import customFolder from '../fixtures/folder-custom-metadata.json';

describe('Navigate to Trash button', () => {
  it('confirm button the in custem folder', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${
        customFolder.data.attributes.folderId
      }`,
      customFolder,
    ).as('test2Folder');
    landingPage.loadInboxMessages();
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${
        customFolder.data.attributes.folderId
      }/threads?pageSize=100&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC`,
      customFolderMessage,
    ).as('customFolder');

    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.contains('TEST2').click();
    cy.wait('@customFolder');
    cy.wait('@test2Folder');
    cy.tabToElement('[data-testid="remove-folder-button"]');
    cy.get('[data-testid="remove-folder-button"]').should('have.focus');
    cy.realPress(['Enter']);
    cy.get('[class="modal hydrated"]')
      .shadow()
      .find('button');
    cy.get('[visible=""] > p');
    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/folders/${
        customFolder.data.attributes.folderId
      }`,
      {
        statusCode: 204,
      },
    ).as('deleteFolder');
    cy.tabToElement('[text="Remove"]');
    cy.realPress(['Enter']);
    cy.get('.vads-u-margin-bottom--1').should('have.focus');
    cy.injectAxe();
    cy.axeCheck();
  });
});
