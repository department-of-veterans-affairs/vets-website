import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockRecipients from '../fixtures/recipients-response.json';

describe('SM Single Facility Contact list', () => {
  const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_edit_contact_list',
      value: true,
    },
  ]);
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggle);
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList();
    ContactListPage.selectAllCheckBox();
  });

  it('verify empty contact list alerts', () => {
    ContactListPage.clickGoBackButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickBackToInbox();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickGoBackButton();
    ContactListPage.clickModalSaveButton();
    ContactListPage.verifyEmptyContactListAlert();

    ContactListPage.clickSaveContactListButton();
    ContactListPage.verifyEmptyContactListAlert();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it(`user won't see the alert after saving changes`, () => {
    const selectedTeam = [`ABC`];
    const updatedRecipientsList = ContactListPage.setPreferredTeams(
      mockRecipients,
      selectedTeam,
    );
    ContactListPage.selectCheckBox(selectedTeam[0]);
    ContactListPage.saveContactList(updatedRecipientsList);
    ContactListPage.verifyContactListSavedAlert();
    ContactListPage.clickBackToInbox();
    GeneralFunctionsPage.verifyUrl(`inbox`);
    GeneralFunctionsPage.verifyPageHeader(`Inbox`);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify single contact selected', () => {
    const selectedTeam = [`100`];
    const updatedRecipientsList = ContactListPage.setPreferredTeams(
      mockRecipients,
      selectedTeam,
    );

    ContactListPage.selectCheckBox(selectedTeam[0]);

    ContactListPage.clickGoBackButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.saveContactList(updatedRecipientsList);
    ContactListPage.verifyContactListSavedAlert();
    ContactListPage.verifySingleCheckBox(selectedTeam[0], true);

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
    const selectedTeamList = [`200`, `Cardio`, `TG-7410`];
    const updatedRecipientsList = ContactListPage.setPreferredTeams(
      mockRecipients,
      selectedTeamList,
    );

    ContactListPage.selectCheckBox(selectedTeamList[0]);
    ContactListPage.selectCheckBox(selectedTeamList[1]);
    ContactListPage.selectCheckBox(selectedTeamList[2]);

    ContactListPage.clickGoBackButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.saveContactList(updatedRecipientsList);
    ContactListPage.verifyContactListSavedAlert();
    ContactListPage.verifySingleCheckBox(selectedTeamList[0], true);
    ContactListPage.verifySingleCheckBox(selectedTeamList[1], true);
    ContactListPage.verifySingleCheckBox(selectedTeamList[2], true);

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
