import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDeletedFolderMetaResponse from './fixtures/trashResponse/folder-deleted-metadata.json';
import mockSentFolderMetaResponse from './fixtures/sentResponse/folder-sent-metadata.json';
import PatientComposePage from './pages/PatientComposePage';
import mockCustomFolderMetaResponse from './fixtures/customResponse/custom-folder-messages-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Navigate Away From `Start a new message`', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();

  it('Navigate Away From `Start a new message` To Inbox', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();

    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Inbox');
    cy.get('[data-testid="compose-message-link"]').should('be.visible');
  });

  it('Navigate Away From `Start a new message` To Draft', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();

    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Drafts');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2*',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    composePage.selectSideBarMenuOption('Drafts');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Drafts');
  });

  it('Navigate Away From `Start a new message` To Sent', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();

    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Sent');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1*',
      mockSentFolderMetaResponse,
    ).as('sentResponse');
    composePage.selectSideBarMenuOption('Sent');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Sent');
  });

  it('Navigate Away From `Start a new message` To Trash', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();

    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Trash');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3*',
      mockDeletedFolderMetaResponse,
    ).as('trashResponse');
    composePage.selectSideBarMenuOption('Trash');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Trash');
  });

  it('Navigate Away From `Start a new message` To MY Folders', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('My folders');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders?*',
      mockCustomFolderMetaResponse,
    ).as('trashResponse');

    composePage.selectSideBarMenuOption('My folders');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('My folders');
  });
});
