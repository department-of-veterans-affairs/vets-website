import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockToggles from '../fixtures/toggles-response.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockMixRecipients from '../fixtures/multi-facilities-recipients-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM MULTI FACILITY CONTACT LIST', () => {
  beforeEach(() => {
    SecureMessagingSite.login(
      mockToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList(mockMixRecipients);
  });

  it('verify empty contact list alerts', () => {
    ContactListPage.accordionByHeader('VA Indiana health care').click();
    ContactListPage.selectAllCheckBox();
    ContactListPage.clickGoBackButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.clickBackToInbox();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    // this is a bug
    ContactListPage.clickGoBackButton();
    ContactListPage.clickModalSaveButton();
    ContactListPage.verifyEmptyContactListAlert();

    ContactListPage.clickSaveContactListButton();
    ContactListPage.verifyEmptyContactListAlert();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`user won't see the alert after saving changes`, () => {
    const selectedTeam = [`***TG 100_SLC4%`, `TG-7410`];
    const updatedRecipientsList = ContactListPage.setPreferredTeams(
      mockMixRecipients,
      selectedTeam,
    );
    ContactListPage.selectCheckBox(selectedTeam[0]);
    ContactListPage.selectCheckBox(selectedTeam[1]);
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
      mockMixRecipients,
      selectedTeam,
    );

    ContactListPage.selectAllCheckBox();
    ContactListPage.selectCheckBox(selectedTeam[0]);

    ContactListPage.clickGoBackButton();
    ContactListPage.verifySaveAlert();
    ContactListPage.closeSaveModal();

    ContactListPage.saveContactList(updatedRecipientsList);
    ContactListPage.verifyContactListSavedAlert();
    ContactListPage.verifySingleCheckBox(selectedTeam[0], true);

    cy.get('@savedList')
      .its('request.body')
      .then(req => {
        const selected = req.updatedTriageTeams.filter(el =>
          el.name.includes(selectedTeam[0]),
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
      mockMixRecipients,
      selectedTeamList,
    );
    ContactListPage.selectAllCheckBox();
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

    cy.get('@savedList')
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

        cy.injectAxeThenAxeCheck(AXE_CONTEXT);
      });
  });
  it('excludes OH care teams from contact list', () => {
    ContactListPage.validateCheckBoxDoesNotExist('OH TG GROUP 002');
    cy.findByTestId('White-City-VA-Medical-Center-facility-group').should(
      'not.exist',
    );
    cy.findByTestId('VA-Indiana-health-care-facility-group').should('exist');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
