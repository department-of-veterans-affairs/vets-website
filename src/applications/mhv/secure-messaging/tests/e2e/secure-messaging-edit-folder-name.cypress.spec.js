import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('Secure Messaging Custom Folder Edit Folder Name Message Validation', () => {
  it('Axe Check Custom Folder List', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();
    cy.get('[data-testid="edit-folder-button"]').click({ force: true });
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('[id="inputField"]')
      .type('Testing');
    cy.get('[visible=""] > [secondary=""]').click();
    cy.focused({ timeout: 5000 }).should(
      'have.attr',
      'data-testid',
      'edit-folder-button',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
  });
});
