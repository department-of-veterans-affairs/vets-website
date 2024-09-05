import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import ContactListPage from './pages/ContactListPage';
import { AXE_CONTEXT } from './utils/constants';
import mockEhrData from './fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockMixedCernerFacilitiesUser from './fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from './fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockMixRecipients from './fixtures/multi-facilities-recipients-response.json';

describe('SM Single Facility Contact list', () => {
  beforeEach(() => {
    SecureMessagingSite.login(
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList(mockMixRecipients);
  });

  it('verify contact list alerts', () => {
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify single contact selected', () => {
    ContactListPage.selectAllCheckBox();
    ContactListPage.selectCheckBox(`100`);

    ContactListPage.clickSaveAndExitButton();
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
    ContactListPage.selectAllCheckBox();
    ContactListPage.selectCheckBox(`100`);
    ContactListPage.selectCheckBox(`Cardio`);
    ContactListPage.selectCheckBox(`TG-7410`);
    ContactListPage.clickSaveAndExitButton();

    ContactListPage.verifyContactListSavedAlert();

    cy.wait('@savedList')
      .its('request.body')
      .then(req => {
        const selected = req.updatedTriageTeams.filter(
          el =>
            el.name.includes(`100`) ||
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
