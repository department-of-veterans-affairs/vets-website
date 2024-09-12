import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM Single Facility Contact list', () => {
  const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles(
    'mhv_secure_messaging_edit_contact_list',
    true,
  );
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggle);
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList();
    ContactListPage.selectAllCheckBox();
  });

  it('verify empty contact list alerts', () => {
    ContactListPage.clickCancelButton();

    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickBackToInbox();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickSaveContactListButton();
    ContactListPage.verifyEmptyContactListAlert();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`user won't see the alert after saving changes`, () => {
    ContactListPage.selectCheckBox(`ABC`);
    ContactListPage.clickSaveContactListButton();
    ContactListPage.verifyContactListSavedAlert();
    ContactListPage.clickBackToInbox();
    GeneralFunctionsPage.verifyPageHeader(`Inbox`);
  });

  it('verify single contact selected', () => {
    ContactListPage.selectCheckBox(`100`);

    ContactListPage.clickCancelButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickSaveContactListButton();
    ContactListPage.verifyContactListSavedAlert();

    cy.wait('@savedList')
      .its('request.body')
      .then(req => {
        const selected = req.updatedTriageTeams.filter(el =>
          el.name.includes(`100`),
        );

        cy.wrap(selected).each(el => {
          expect(el.preferredTeam).to.eq(true);
        });
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`verify few contacts selected`, () => {
    ContactListPage.selectCheckBox(`200`);
    ContactListPage.selectCheckBox(`Cardio`);
    ContactListPage.selectCheckBox(`TG-7410`);

    ContactListPage.clickCancelButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickSaveContactListButton();
    ContactListPage.verifyContactListSavedAlert();

    cy.wait('@savedList')
      .its('request.body')
      .then(req => {
        const selected = req.updatedTriageTeams.filter(
          el =>
            el.name.includes(`200`) ||
            el.name.includes(`Cardio`) ||
            el.name.includes(`TG-7410`),
        );

        cy.wrap(selected).each(el => {
          expect(el.preferredTeam).to.eq(true);
        });

        cy.injectAxe();
        cy.axeCheck(AXE_CONTEXT);
      });
  });
});
