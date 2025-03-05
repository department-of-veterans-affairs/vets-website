import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessagesSentPage from './pages/PatientMessageSentPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import ContactListPage from './pages/ContactListPage';

describe('SM UPDATED PAGE HEADER, TITLE AND BREADCRUMB', () => {
  beforeEach(() => {
    const updatedFeatureTogglesResponse = GeneralFunctionsPage.updateFeatureToggles(
      [
        {
          name: 'mhv_secure_messaging_remove_landing_page',
          value: true,
        },
        {
          name: 'mhv_secure_messaging_edit_contact_list',
          value: true,
        },
      ],
    );
    SecureMessagingSite.login(updatedFeatureTogglesResponse);
    PatientInboxPage.loadInboxMessages();
  });

  it('verify Inbox folder details', () => {
    GeneralFunctionsPage.verifyPageHeader(`Messages: Inbox`);
    GeneralFunctionsPage.verifyLastBreadCrumb(`Messages: Inbox`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Sent folder details', () => {
    PatientMessagesSentPage.loadMessages();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Sent`);
    GeneralFunctionsPage.verifyLastBreadCrumb(`Messages: Sent`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Drafts folder details', () => {
    PatientMessageDraftsPage.loadDrafts();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Drafts`);
    GeneralFunctionsPage.verifyLastBreadCrumb(`Messages: Drafts`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Trash folder details', () => {
    PatientMessageTrashPage.loadMessages();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Trash`);
    GeneralFunctionsPage.verifyLastBreadCrumb(`Messages: Trash`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Custom folder details', () => {
    PatientMessageCustomFolderPage.loadMessages();

    GeneralFunctionsPage.verifyPageHeader(`Messages: TESTAGAIN`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify single thread page details`, () => {
    PatientInboxPage.loadSingleThread();
    cy.get(`h1`).should(`contain.text`, `Messages:`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify contact list page details`, () => {
    ContactListPage.loadContactList();

    GeneralFunctionsPage.verifyPageHeader(`Messages: Contact list`);
    GeneralFunctionsPage.verifyPageTitle(`Messages:`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
