import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PilotEnvPage from './pages/PilotEnvPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import mockCernerMixedUser from './fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import mockCernerAllUser from './fixtures/userResponse/user-cerner-all.json';
import mockFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';

describe('SM CARE TEAM HELP PAGE - Cerner and Hybrid User Updates', () => {
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

    it('removes provider name from search suggestions and shows contact list reasons', () => {
      // Hybrid no longer shows "provider's name" in search suggestions
      cy.findByText(/provider\u2019s name/).should('not.exist');

      // Hybrid users now see contact list reasons (previously only VistA)
      cy.findByText(/You removed them from your contact list/).should('exist');
      cy.findByText(/Your account isn\u2019t connected to them/).should(
        'exist',
      );

      // Should show the "names may appear different" bullet with R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByRole('link', { name: /Learn more about this name change/ })
        .should('exist')
        .and(
          'have.attr',
          'href',
          'https://www.va.gov/resources/my-healthevet-on-vagov-what-to-know/',
        );

      // Contact list link
      cy.findByRole('link', { name: /Update your contact list/ })
        .should('exist')
        .and('have.attr', 'href', Data.LINKS.CONTACT_LIST);

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

    it('shows name change bullet and hides contact list reasons', () => {
      // Oracle-only should NOT show provider's name
      cy.findByText(/provider\u2019s name/).should('not.exist');

      // Oracle-only should NOT show contact list reasons
      cy.findByText(/You removed them from your contact list/).should(
        'not.exist',
      );
      cy.findByText(/Your account isn\u2019t connected to them/).should(
        'not.exist',
      );

      // Should show the "names may appear different" bullet with R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByRole('link', { name: /Learn more about this name change/ })
        .should('exist')
        .and(
          'have.attr',
          'href',
          'https://www.va.gov/resources/my-healthevet-on-vagov-what-to-know/',
        );

      // Oracle-only should NOT see the Update your contact list link
      cy.findByText(/Update your contact list/).should('not.exist');

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });
});
