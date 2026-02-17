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
import mockSomeBlockedRecipients from '../fixtures/multi-facilities-some-blocked-recipients-response.json';
import mockFacilityBlockedRecipients from '../fixtures/multi-facility-blocked-recipients-response.json';
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

  it(`tracks selected team count in accordion`, () => {
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
    ContactListPage.verifyAccordionSubheader('4 teams selected');

    ContactListPage.selectFirstCheckBox('Select all 4 teams');
    ContactListPage.verifyAccordionSubheader('0 teams selected');
    ContactListPage.verifyAccordionSubheader('4 teams selected');

    ContactListPage.selectCheckBox('TG-7410');
    ContactListPage.verifySingleCheckBox('TG-7410', true);
    ContactListPage.verifyAccordionSubheader('1 team selected');
    ContactListPage.verifyAccordionSubheader('4 teams selected');

    ContactListPage.accordionByHeader('VA Indiana health care').click();
    ContactListPage.selectCheckBox('SLC4 PCMM');
    ContactListPage.verifySingleCheckBox('SLC4 PCMM', false);
    ContactListPage.verifyAccordionSubheader('1 team selected');
    ContactListPage.verifyAccordionSubheader('3 teams selected');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`tracks selected team count when blocked`, () => {
    SecureMessagingSite.login(
      mockToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    ContactListPage.loadContactList(mockSomeBlockedRecipients);

    ContactListPage.verifyHeaders();

    ContactListPage.verifyAllCheckboxes(true);
    ContactListPage.verifyAccordionSubheader('3 teams selected');
    ContactListPage.verifyAccordionSubheader('4 teams selected');

    ContactListPage.selectFirstCheckBox('Select all 3 teams');
    ContactListPage.verifyAccordionSubheader('0 teams selected');
    ContactListPage.verifyAccordionSubheader('4 teams selected');

    ContactListPage.accordionByHeader('VA Indiana health care').click();
    ContactListPage.selectCheckBox('SLC4 PCMM');
    ContactListPage.verifySingleCheckBox('SLC4 PCMM', false);
    ContactListPage.verifyAccordionSubheader('0 teams selected');
    ContactListPage.verifyAccordionSubheader('3 teams selected');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`renders conditional hr when stacked alerts`, () => {
    SecureMessagingSite.login(
      mockToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    ContactListPage.loadContactList(mockFacilityBlockedRecipients);

    cy.findByTestId('contact-list-hr').should('not.exist');
    cy.findByTestId('contact-list-save').click();
    cy.findByTestId('contact-list-hr').should('exist');

    cy.get('va-alert')
      .shadow()
      .find('button.va-alert-close')
      .click({ waitForAnimations: true, force: true });
    cy.findByTestId('contact-list-hr').should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`does not render conditional hr when only one alert`, () => {
    SecureMessagingSite.login(
      mockToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    ContactListPage.loadContactList(mockMixRecipients);

    cy.findByTestId('contact-list-hr').should('not.exist');
    cy.findByTestId('contact-list-save').click();
    cy.findByTestId('contact-list-hr').should('not.exist');

    cy.get('va-alert')
      .shadow()
      .find('button.va-alert-close')
      .click({ waitForAnimations: true, force: true });
    cy.findByTestId('contact-list-hr').should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify contact list wit plain TG names`, () => {
    const updatedMockRecipientsResponse =
      GeneralFunctionsPage.updateTGSuggestedName(
        mockRecipients,
        'TG | Type | Name',
      );

    SecureMessagingSite.login();
    ContactListPage.loadContactList(updatedMockRecipientsResponse);

    cy.get(
      `[data-testid="contact-list-select-team-${updatedMockRecipientsResponse.data[0].attributes.triageTeamId}"]`,
    )
      .find(`[part="label"]`, { includeShadowDom: true })
      .should(
        `have.text`,
        `${updatedMockRecipientsResponse.data[0].attributes.suggestedNameDisplay}`,
      );
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`displays loading indicator when saving contact list`, () => {
    SecureMessagingSite.login();
    ContactListPage.loadContactList();

    // Intercept save but delay response to observe loading state
    cy.intercept('POST', '/my_health/v1/messaging/preferences/recipients', {
      statusCode: 200,
      body: {},
      delay: 500,
    }).as('saveContactList');

    // Click save button
    cy.findByTestId('contact-list-save').click();

    // Loading indicator should appear during save
    cy.findByTestId('contact-list-saving-indicator')
      .should('exist')
      .and('have.attr', 'message', 'Saving your contact list...');

    // Wait for save to complete
    cy.wait('@saveContactList');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
