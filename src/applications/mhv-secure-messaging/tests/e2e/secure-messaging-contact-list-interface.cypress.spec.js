import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import ContactListPage from './pages/ContactListPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Contact list', () => {
  it('verify base web-elements', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    ContactListPage.loadContactList();

    ContactListPage.verifyHeaders();

    ContactListPage.verifyAllCheckboxes(true);

    ContactListPage.clickSelectAllCheckBox();

    ContactListPage.verifyAllCheckboxes(false);

    ContactListPage.verifyButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify saving changes alert', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    ContactListPage.loadContactList();
    ContactListPage.clickSelectAllCheckBox();
    cy.get(`[text="Cancel"]`).click({ force: true });
    cy.get(`#heading`).should(`include.text`, `Save changes`);
    ContactListPage.verifyButtons();
    cy.get(`.first-focusable-child`).click();

    cy.get(`.sm-breadcrumb-list-item`).click();
    cy.get(`#heading`).should(`include.text`, `Save changes`);
    ContactListPage.verifyButtons();

    cy.get(`va-modal.hydrated > [text="Save and exit"]`).click();
    cy.get(`[data-testid="alert-text"]`).should(
      `include.text`,
      `Contact list changes saved`,
    );
  });
});
