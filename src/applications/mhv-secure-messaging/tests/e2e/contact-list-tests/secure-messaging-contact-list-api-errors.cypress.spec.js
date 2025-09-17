import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

describe('SM CONTACT LIST API ERRORS', () => {
  it(`verify contact list loading error`, () => {
    SecureMessagingSite.login();

    // Simulate recipients load API failure
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`, {
      statusCode: 500,
      body: {
        errors: [{ title: 'Recipients load failure' }],
      },
    }).as('contactListLoadError');

    cy.visit(`${Paths.UI_MAIN}/contact-list`);
    cy.wait('@contactListLoadError');

    ContactListPage.verifyLoadAPIAlerts();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify contact list saving error', () => {
    SecureMessagingSite.login();

    // Load contact list successfully (handled inside loadContactList)
    ContactListPage.loadContactList();

    // Simulate save (POST preferences/recipients) failure
    cy.intercept('POST', Paths.INTERCEPT.SELECTED_RECIPIENTS, {
      statusCode: 500,
      body: {
        errors: [{ title: 'Save failure' }],
      },
    }).as('contactListSaveError');

    ContactListPage.selectCheckBox(`100`);
    ContactListPage.clickSaveContactListButton();
    cy.wait('@contactListSaveError');

    ContactListPage.verifySaveAPIAlert();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
