import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('Secure Messaging Custom Folder Edit Folder Name Message Validation', () => {
  it('verify edit folder name buttons', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();

    cy.get('[data-testid="edit-folder-button"]')
      .should('be.visible')
      .click({ force: true });
    cy.get('[name="new-folder-name"]')
      .should('be.visible')
      .shadow()
      .find('[id="inputField"]')
      .type('Testing');

    cy.get('[text="Save"]')
      .should('be.visible')
      .click();

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

  it('verify edit folder name error', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();

    cy.get('[data-testid="edit-folder-button"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('[text="Save"]')
      .should('be.visible')
      .click();

    cy.get('[label="Folder name"]')
      .shadow()
      .find('#input-error-message')
      .should('be.visible')
      .and('include.text', 'Folder name cannot be blank');

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
