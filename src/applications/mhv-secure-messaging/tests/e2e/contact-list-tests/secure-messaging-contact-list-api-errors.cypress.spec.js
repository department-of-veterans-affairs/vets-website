import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

describe('SM CONTACT LIST API ERRORS', () => {
  it('verify contact list loading error', () => {
    SecureMessagingSite.login();
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`, {
      statusCode: 500,
      body: {},
    }).as('allRecipientsFail');

    cy.visit(`${Paths.UI_MAIN}/contact-list`);
    cy.wait('@allRecipientsFail');

    ContactListPage.verifyLoadAPIAlerts();
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify contact list saving error', () => {
    SecureMessagingSite.login();
    ContactListPage.loadContactList();

    cy.intercept('POST', Paths.INTERCEPT.SELECTED_RECIPIENTS, {
      statusCode: 500,
      body: {},
    }).as('saveRecipientsFail');

    ContactListPage.selectCheckBox('***TG 100_SLC4%');
    ContactListPage.clickSaveContactListButton();
    cy.wait('@saveRecipientsFail');

    ContactListPage.verifySaveAPIAlert();
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
