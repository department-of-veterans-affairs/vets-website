import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PilotEnvPage from './pages/PilotEnvPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import mockCernerAllUser from './fixtures/userResponse/user-cerner-all.json';
import mockCernerMixedUser from './fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import mockFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';

describe('SM CARE TEAM HELP PAGE - Updated Content', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    { name: 'mhv_secure_messaging_cerner_pilot', value: true },
    { name: 'mhv_secure_messaging_curated_list_flow', value: true },
  ]);

  const navigateToCareTeamHelp = () => {
    PilotEnvPage.navigateToSelectCareTeamPage();
    cy.findByRole('link', {
      name: Data.CURATED_LIST.CANT_FIND_TEAM_LINK,
    }).click();
  };

  describe('VistA-only user', () => {
    beforeEach(() => {
      SecureMessagingSite.login(updatedFeatureToggles);
      PilotEnvPage.loadInboxMessages();
      navigateToCareTeamHelp();
    });

    it('displays updated content for VistA-only users', () => {
      // New: name change bullet with R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByText(/Learn more about this name change/)
        .should('exist')
        .closest('a')
        .should(
          'have.attr',
          'href',
          'https://www.va.gov/resources/my-healthevet-on-vagov-what-to-know/',
        );

      // Removed: provider's name no longer in search suggestions
      cy.findByText(/provider's name/).should('not.exist');

      // VistA users see contact list reasons
      cy.findByText(/You removed them from your contact list/).should('exist');
      cy.findByText(/Your account isn't connected to them/).should('exist');

      // VistA-only gets simple contact list link, no h2 facility heading
      cy.findByRole('link', { name: /Update your contact list/ })
        .should('exist')
        .and('have.attr', 'href', Data.LINKS.CONTACT_LIST);
      cy.get('.care-team-help-container h2').should('not.exist');

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });

  describe('Oracle Health-only (Cerner) user', () => {
    beforeEach(() => {
      SecureMessagingSite.login(
        updatedFeatureToggles,
        mockVamcEhr,
        true,
        mockCernerAllUser,
        mockFacilities,
      );
      PilotEnvPage.loadInboxMessages();
      navigateToCareTeamHelp();
    });

    it('displays updated content for Oracle Health-only (Cerner) users', () => {
      // New: name change bullet with R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByText(/Learn more about this name change/)
        .should('exist')
        .closest('a')
        .should(
          'have.attr',
          'href',
          'https://www.va.gov/resources/my-healthevet-on-vagov-what-to-know/',
        );

      // Removed: provider's name no longer in search suggestions
      cy.findByText(/provider's name/).should('not.exist');

      // Oracle-only users should NOT see contact list reasons
      cy.findByText(/You removed them from your contact list/).should(
        'not.exist',
      );
      cy.findByText(/Your account isn't connected to them/).should('not.exist');

      // Oracle-only users should NOT see the Update your contact list link
      cy.findByText(/Update your contact list/).should('not.exist');

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });

  describe('Hybrid user (both Oracle Health and VistA)', () => {
    beforeEach(() => {
      SecureMessagingSite.login(
        updatedFeatureToggles,
        mockVamcEhr,
        true,
        mockCernerMixedUser,
        mockFacilities,
      );
      PilotEnvPage.loadInboxMessages();
      navigateToCareTeamHelp();
    });

    it('displays updated content for Hybrid users', () => {
      // New: name change bullet with R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByText(/Learn more about this name change/)
        .should('exist')
        .closest('a')
        .should(
          'have.attr',
          'href',
          'https://www.va.gov/resources/my-healthevet-on-vagov-what-to-know/',
        );

      // Removed: provider's name no longer in search suggestions
      cy.findByText(/provider's name/).should('not.exist');

      // Hybrid users now see contact list reasons (new for hybrid)
      cy.findByText(/You removed them from your contact list/).should('exist');
      cy.findByText(/Your account isn't connected to them/).should('exist');

      // Hybrid users see h2 heading and facility list
      cy.findByRole('heading', {
        level: 2,
        name: /Update your contact list/,
      }).should('exist');
      cy.findByText(/Update your contact list if you can't find/).should(
        'exist',
      );

      // Contact list link
      cy.findByRole('link', { name: /Update your contact list/ })
        .should('exist')
        .and('have.attr', 'href', Data.LINKS.CONTACT_LIST);

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });
});
