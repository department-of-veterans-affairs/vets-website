import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDeletedFolderMetaResponse from './fixtures/trashResponse/folder-deleted-metadata.json';
import mockSentFolderMetaResponse from './fixtures/sentResponse/folder-sent-metadata.json';
import PatientComposePage from './pages/PatientComposePage';
import mockCustomFolderMetaResponse from './fixtures/customResponse/custom-folder-messages-response.json';
import { AXE_CONTEXT, Locators, Paths } from './utils/constants';

describe('Secure Messaging Navigate Away From `Start a new message`', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();

  it('Navigate Away From `Start a new message` To Inbox', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
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
    cy.get(Locators.ALERTS.CREATE_NEW_MESSAGE).should('be.visible');
  });

  it('Navigate Away From `Start a new message` To Draft', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Drafts');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`,
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
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Sent');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1*`,
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
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('Trash');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3*`,
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
    cy.axeCheck(AXE_CONTEXT, {});
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.enterDataToMessageSubject();
    composePage.enterDataToMessageBody();
    composePage.selectSideBarMenuOption('My folders');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}?*`,
      mockCustomFolderMetaResponse,
    ).as('trashResponse');

    composePage.selectSideBarMenuOption('My folders');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('My folders');
  });
});
