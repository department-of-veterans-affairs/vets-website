import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import threadResponse from './fixtures/thread-response-new-api.json';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('SM THREAD SINGLE MESSAGE DETAILED VIEW', () => {
  const date = new Date();
  threadResponse.data[0].attributes.sentDate = date.toISOString();

  it('verify expanded message details', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread();

    PatientMessageDetailsPage.verifyExpandedMessageFrom(threadResponse);
    PatientMessageDetailsPage.verifyExpandedMessageId(threadResponse);

    PatientMessageDetailsPage.verifyExpandedMessageDate(threadResponse);
    PatientMessageDetailsPage.verifyMessageAttachment(threadResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  context('without Custom Folders Redesign', () => {
    it('moves folders with ease', () => {
      cy.intercept('**/v1/messaging/threads/7176615/move?folder_id=*', {
        statusCode: 200,
      }).as('mockMoveThread');

      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      PatientMessageDetailsPage.loadSingleThread();

      PatientMessageDetailsPage.openMoveToButtonModal();

      cy.get('[data-testid="folder-header"]').should('be.visible');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  context('with Custom Folders Redesign', () => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_custom_folders_redesign',
        value: true,
      },
    ]);

    it('moves folders with ease', () => {
      cy.intercept('**/v1/messaging/threads/7176615/move?folder_id=*', {
        statusCode: 200,
      }).as('mockMoveThread');

      SecureMessagingSite.login(updatedFeatureToggles);
      PatientInboxPage.loadInboxMessages();
      PatientMessageDetailsPage.loadSingleThread();

      PatientMessageDetailsPage.openMoveToButtonModal();

      cy.get('[data-testid="folder-header"]').should('be.visible');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
