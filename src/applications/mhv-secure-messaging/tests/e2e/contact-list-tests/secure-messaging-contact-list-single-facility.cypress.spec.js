import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';

describe('SM MULTI FACILITY CONTACT LIST NAVIGATE AWAY', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList();
    ContactListPage.selectAllCheckBox();
  });

  it('verify empty contact list alerts', () => {
    ContactListPage.accordionByHeader('VA Kansas City health care').click();
    ContactListPage.accordionByHeader('VA Puget Sound health care').click();
    ContactListPage.accordionByHeader(
      'VA Northern Arizona health care',
    ).click();
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

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`user won't see the alert after saving changes`, () => {
    const selectedTeam = [`###ABC_XYZ_TRIAGE_TEAM###`];
    const updatedRecipientsList = ContactListPage.setPreferredTeams(
      mockRecipients,
      selectedTeam,
    );
    ContactListPage.selectCheckBox(selectedTeam[0]);
    ContactListPage.saveContactList(updatedRecipientsList);
    ContactListPage.verifyContactListSavedAlert();
    ContactListPage.clickBackToInbox();
    GeneralFunctionsPage.verifyUrl(`inbox`);
    GeneralFunctionsPage.verifyPageHeader(`Messages: Inbox`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify single contact selected', () => {
    const selectedTeam = [`***TG 100_SLC4%`];
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

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify few contacts selected`, () => {
    const selectedTeamList = [
      `***TG 200_APPT_SLC4%`,
      `Jeasmitha-Cardio-Clinic`,
      `TG-7410`,
    ];
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
        const selected = req.updatedTriageTeams.filter(el =>
          selectedTeamList.some(team => el.name.includes(team)),
        );

        cy.wrap(selected).each(el => {
          expect(el.preferredTeam).to.eq(true);
        });

        cy.injectAxeThenAxeCheck(AXE_CONTEXT);
      });
  });
});
