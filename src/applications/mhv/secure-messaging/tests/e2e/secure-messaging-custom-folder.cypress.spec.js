import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Custom Folder AXE Check', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadMessages();
  });
  it('Axe Check Custom Folder List', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get(Locators.HEADER).should(
      'have.text',
      mockFolders.data[mockFolders.data.length - 1].attributes.name,
    );
  });

  it('Verify folder header', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessageCustomFolderPage.verifyFolderHeader();
    // PatientMessageCustomFolderPage.verifyResponseBodyLength();
  });

  it.skip('Check sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessageCustomFolderPage.verifySorting();
  });
});
