import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('SM UPDATED PAGE HEADER, TITLE AND BREADCRUMB', () => {
  beforeEach(() => {
    const updatedFeatureTogglesResponse = GeneralFunctionsPage.updateFeatureToggles(
      'mhv_secure_messaging_remove_landing_page',
      true,
    );
    SecureMessagingSite.login(updatedFeatureTogglesResponse);
  });

  it('verify Inbox folder details', () => {
    PatientInboxPage.loadInboxMessages();
    GeneralFunctionsPage.verifyPageHeader(`Messages: Inbox`);
    cy.get(`.usa-breadcrumb__link`)
      .last()
      .should(`have.text`, `Messages: Inbox`);
    cy.title().should(`contain`, `Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Sent folder details', () => {
    PatientInboxPage.loadInboxMessages();
    PatientMessagesSentPage.loadMessages();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Sent`);
    cy.get(`.usa-breadcrumb__link`)
      .last()
      .should(`have.text`, `Messages: Sent`);
    cy.title().should(`contain`, `Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Drafts folder details', () => {
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDrafts();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Drafts`);
    cy.get(`.usa-breadcrumb__link`)
      .last()
      .should(`have.text`, `Messages: Drafts`);
    cy.title().should(`contain`, `Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Trash folder details', () => {
    PatientInboxPage.loadInboxMessages();
    PatientMessageTrashPage.loadMessages();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Trash`);
    cy.get(`.usa-breadcrumb__link`)
      .last()
      .should(`have.text`, `Messages: Trash`);

    cy.title().should(`contain`, `Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify custom folder details', () => {
    PatientInboxPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadMessages();

    GeneralFunctionsPage.verifyPageHeader(`Messages: TESTAGAIN`);
    cy.get(`.usa-breadcrumb__link`)
      .last()
      .should(`have.text`, `Messages: TESTAGAIN`);

    cy.title().should(`contain`, `Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
