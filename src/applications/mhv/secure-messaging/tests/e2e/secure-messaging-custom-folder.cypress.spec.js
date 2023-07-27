import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Verify folder heade', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessageCustomFolderPage.verifyFolderHeader();
    PatientMessageCustomFolderPage.verifyResponseBodyLength();
  });
});
