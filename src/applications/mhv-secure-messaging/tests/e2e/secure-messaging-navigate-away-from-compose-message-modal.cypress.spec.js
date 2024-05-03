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

  it('Navigate Away From `Start a new message` To Inbox', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();
    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    PatientComposePage.selectSideBarMenuOption('Inbox');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Inbox');
    cy.get(Locators.ALERTS.CREATE_NEW_MESSAGE).should('be.visible');
  });

  it('Navigate Away From `Start a new message` To Draft', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();
    PatientComposePage.selectSideBarMenuOption('Drafts');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`,
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    PatientComposePage.selectSideBarMenuOption('Drafts');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Drafts');
  });

  it('Navigate Away From `Start a new message` To Sent', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();
    PatientComposePage.selectSideBarMenuOption('Sent');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-1*`,
      mockSentFolderMetaResponse,
    ).as('sentResponse');
    PatientComposePage.selectSideBarMenuOption('Sent');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Sent');
  });

  it('Navigate Away From `Start a new message` To Trash', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();
    PatientComposePage.selectSideBarMenuOption('Trash');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-3*`,
      mockDeletedFolderMetaResponse,
    ).as('trashResponse');
    PatientComposePage.selectSideBarMenuOption('Trash');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Trash');
  });

  it('Navigate Away From `Start a new message` To MY Folders', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();
    PatientComposePage.selectSideBarMenuOption('My folders');
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}?*`,
      mockCustomFolderMetaResponse,
    ).as('trashResponse');

    PatientComposePage.selectSideBarMenuOption('My folders');
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('My folders');
  });
});
