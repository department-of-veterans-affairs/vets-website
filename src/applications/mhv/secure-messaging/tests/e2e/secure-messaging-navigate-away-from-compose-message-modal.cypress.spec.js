import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDeletedFolderMetaResponse from './fixtures/folder-deleted-metadata.json';
import mockSentFolderMetaResponse from './fixtures/folder-sent-metadata.json';
import PatientComposePage from './pages/PatientComposePage';

describe('Secure Messaging Navigate Away From `Start a new message`', () => {
  it('Navigate Away From `Start a new message` To Inbox', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.enterComposeMessageDetails('General');
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComosePageValuesRetainedAfterContinueEditing();

    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Inbox');
    cy.get('[data-testid="compose-message-link"]').should('be.visible');
  });

  it('Navigate Away From `Start a new message` To Draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.enterComposeMessageDetails('General');
    PatientComposePage.selectSideBarMenuOption('Drafts');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComosePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    PatientComposePage.selectSideBarMenuOption('Drafts');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Drafts');
  });

  it('Navigate Away From `Start a new message` To Sent', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.enterComposeMessageDetails('General');
    PatientComposePage.selectSideBarMenuOption('Sent');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComosePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolderMetaResponse,
    ).as('sentResponse');
    PatientComposePage.selectSideBarMenuOption('Sent');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Sent messages');
  });

  it('Navigate Away From `Start a new message` To Trash', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.enterComposeMessageDetails('General');
    PatientComposePage.selectSideBarMenuOption('Trash');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComosePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3',
      mockDeletedFolderMetaResponse,
    ).as('trashResponse');
    PatientComposePage.selectSideBarMenuOption('Trash');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Trash');
  });

  it('Navigate Away From `Start a new message` To MY Folders', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    PatientComposePage.enterComposeMessageDetails('General');
    PatientComposePage.selectSideBarMenuOption('My folders');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComosePageValuesRetainedAfterContinueEditing();

    PatientComposePage.selectSideBarMenuOption('My folders');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('My folders');
  });
});
