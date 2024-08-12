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
});
