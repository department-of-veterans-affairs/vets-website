import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

describe('SM CONTACT LIST API ERRORS', () => {
  it(`verify contact list loading error`, () => {
    SecureMessagingSite.login();
    cy.visit(`${Paths.UI_MAIN}/contact-list`);

    ContactListPage.verifyLoadAPIAlerts();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify contact list saving error', () => {
    SecureMessagingSite.login();
    ContactListPage.loadContactList();
    ContactListPage.selectCheckBox(`100`);
    ContactListPage.clickSaveContactListButton();

    ContactListPage.verifySaveAPIAlert();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
