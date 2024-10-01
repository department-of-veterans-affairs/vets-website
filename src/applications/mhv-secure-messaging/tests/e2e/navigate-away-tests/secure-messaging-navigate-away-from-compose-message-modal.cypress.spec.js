import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientComposePage from '../pages/PatientComposePage';
import FolderLoadPage from '../pages/FolderLoadPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('SM NAVIGATE AWAY FROM MESSAGE COMPOSE', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('navigate away with no changes', () => {
    PatientInboxPage.navigateToComposePage();
    FolderLoadPage.backToInbox();
    GeneralFunctionsPage.verifyUrl(`inbox`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('navigate away with some changes', () => {
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    FolderLoadPage.backToInbox();

    cy.get(`[status="warning"]`)
      .find(`h2`)
      .should('be.visible')
      .and(`have.text`, `We can't save this message yet`);
    cy.get(`[status="warning"]`)
      .find(`[text='Edit draft']`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`have.text`, `Edit draft`);
    cy.get(`[status="warning"]`)
      .find(`[text='Delete draft']`)
      .shadow()
      .find(`.last-focusable-child`)
      .should('be.visible')
      .and(`have.text`, `Delete draft`);

    cy.get(`[status="warning"]`)
      .find(`[text='Delete draft']`)
      .shadow()
      .find(`.last-focusable-child`)
      .click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
  it('navigate away with no changes` To Inbox', () => {
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();

    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    FolderLoadPage.backToInbox();
    PatientComposePage.clickOnDeleteDraftButton();
    PatientComposePage.verifyExpectedPageOpened('Inbox');
    cy.get(Locators.ALERTS.CREATE_NEW_MESSAGE).should('be.visible');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
