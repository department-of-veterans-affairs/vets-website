import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT } from '../utils/constants';
import mockToggles from '../fixtures/toggles-response.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockMixRecipients from '../fixtures/multi-facilities-recipients-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import PatientComposePage from '../pages/PatientComposePage';

describe('SM CONTACT LIST', () => {
  it('verify contact list link', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.openRecipientsDropdown();
    ContactListPage.verifyContactListLink();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify base web-elements - single facility', () => {
    SecureMessagingSite.login();
    ContactListPage.loadContactList();

    ContactListPage.verifyHeaders();
    ContactListPage.verifyAllCheckboxes(true);
    ContactListPage.selectAllCheckBox();
    ContactListPage.verifyAllCheckboxes(false);
    ContactListPage.verifyButtons();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify base web-elements - multi facilities`, () => {
    SecureMessagingSite.login(
      mockToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    ContactListPage.loadContactList(mockMixRecipients);

    ContactListPage.verifyHeaders();
    ContactListPage.verifyAllCheckboxes(true);
    ContactListPage.selectAllCheckBox();
    ContactListPage.verifyAllCheckboxes(false);
    ContactListPage.verifyButtons();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify contact list wit plain TG names`, () => {
    const updatedMockRecipientsResponse = GeneralFunctionsPage.updateTGSuggestedName(
      mockRecipients,
      'TG | Type | Name',
    );

    SecureMessagingSite.login();
    ContactListPage.loadContactList(updatedMockRecipientsResponse);

    cy.get(
      `[data-testid="contact-list-select-team-${
        updatedMockRecipientsResponse.data[0].attributes.triageTeamId
      }"]`,
    )
      .find(`[part="label"]`, { includeShadowDom: true })
      .should(
        `have.text`,
        `${
          updatedMockRecipientsResponse.data[0].attributes.suggestedNameDisplay
        }`,
      );
  });
});
