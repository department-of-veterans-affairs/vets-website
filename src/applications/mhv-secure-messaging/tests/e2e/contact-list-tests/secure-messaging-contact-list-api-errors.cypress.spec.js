import SecureMessagingSite from '../sm_site/SecureMessagingSite';
// import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT } from '../utils/constants';
// import mockMixRecipients from '../fixtures/multi-facilities-recipients-response.json';

describe('Contact list API errors', () => {
  const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles(
    'mhv_secure_messaging_edit_contact_list',
    true,
  );

  // it(`verify contact list loading error`, () => {
  //   SecureMessagingSite.login(updatedFeatureToggle);
  //
  //   cy.intercept('GET', `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`, {
  //     statusCode: 404,
  //     body: {},
  //   }).as('errorRecipients');
  //
  //   cy.visit(`${Paths.UI_MAIN}/contact-list`);

  // cy.injectAxe();
  // cy.axeCheck(AXE_CONTEXT);
  // });

  it('verify contact list saving error', () => {
    SecureMessagingSite.login(updatedFeatureToggle);
    ContactListPage.loadContactList();
    ContactListPage.selectCheckBox(`100`);
    ContactListPage.clickSaveContactListButton();

    ContactListPage.verifySaveAPIError();

    // cy.get(`va-alert`)
    //   .shadow()
    //   .find(`button`)
    //   .then(el => {
    //     return new Cypress.Promise(resolve => {
    //       setTimeout(resolve, 2000);
    //       cy.wrap(el).click();
    //     });
    //   });
    //
    // cy.get(Locators.ALERTS.ALERT_TEXT).should(`not.exist`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
