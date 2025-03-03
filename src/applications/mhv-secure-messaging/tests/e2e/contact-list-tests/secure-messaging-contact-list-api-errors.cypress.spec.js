import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import ContactListPage from '../pages/ContactListPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

describe('Contact list API errors', () => {
  const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_edit_contact_list',
      value: true,
    },
  ]);

  it(`verify contact list loading error`, () => {
    SecureMessagingSite.login(updatedFeatureToggle);
    cy.visit(`${Paths.UI_MAIN}/contact-list`);

    ContactListPage.verifyLoadAPIAlerts();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify contact list saving error', () => {
    SecureMessagingSite.login(updatedFeatureToggle);
    ContactListPage.loadContactList();
    ContactListPage.selectCheckBox(`100`);
    ContactListPage.clickSaveContactListButton();

    ContactListPage.verifySaveAPIAlert();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
