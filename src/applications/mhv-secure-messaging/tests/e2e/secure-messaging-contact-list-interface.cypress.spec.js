import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import ContactListPage from './pages/ContactListPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Contact list', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList();
  });

  it('verify base web-elements', () => {
    ContactListPage.verifyHeaders();
    ContactListPage.verifyAllCheckboxes(true);
    ContactListPage.clickSelectAllCheckBox();
    ContactListPage.verifyAllCheckboxes(false);
    ContactListPage.verifyButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify saving changes alert', () => {
    ContactListPage.clickSelectAllCheckBox();
    ContactListPage.clickSaveModalCancelButton();
    ContactListPage.verifySaveAlertHeader();
    ContactListPage.verifyButtons();
    ContactListPage.closeSaveModal();

    ContactListPage.clickBackToInbox();
    ContactListPage.verifySaveAlertHeader();
    ContactListPage.verifyButtons();

    ContactListPage.clickSaveAndExitButton();
    ContactListPage.verifyContactListSavedAlert();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  // mock response will be amended in further updates
  it('verify contact saving request', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/preferences/recipients',
      '200',
    ).as('savedList');

    ContactListPage.clickSaveAndExitButton();
    ContactListPage.verifyContactListSavedAlert();

    cy.wait('@savedList')
      .its('request.body')
      .then(req => {
        cy.wrap(req.updatedTriageTeams).each(el => {
          expect(el.preferredTeam).to.eq(true);
        });
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
