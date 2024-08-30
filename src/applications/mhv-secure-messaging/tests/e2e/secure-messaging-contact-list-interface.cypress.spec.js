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
    ContactListPage.selectAllCheckBox();
    ContactListPage.verifyAllCheckboxes(false);
    ContactListPage.verifyButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify saving changes alerts', () => {
    ContactListPage.selectAllCheckBox();
    ContactListPage.clickCancelButton();
    ContactListPage.verifySaveAlertHeader();
    ContactListPage.verifyButtons();
    ContactListPage.closeSaveModal();

    ContactListPage.clickBackToInbox();
    ContactListPage.verifySaveAlertHeader();
    ContactListPage.verifyButtons();
    ContactListPage.closeSaveModal();

    ContactListPage.clickSaveAndExitButton();
    ContactListPage.verifyEmptyContactListAlert();

    ContactListPage.selectCheckBox(`100`);

    ContactListPage.clickSaveAndExitButton();
    ContactListPage.verifyContactListSavedAlert();

    cy.wait('@savedList')
      .its('request.body')
      .then(req => {
        const obj = req.updatedTriageTeams.find(el => el.name.includes(`100`));
        expect(obj.preferredTeam).to.eq(true);
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify contact saving request', () => {
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
