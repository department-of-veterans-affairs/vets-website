import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PilotEnvPage from './pages/PilotEnvPage';
import { AXE_CONTEXT, Data } from './utils/constants';
import mockCernerAllUser from './fixtures/userResponse/user-cerner-all.json';
import mockCernerMixedUser from './fixtures/userResponse/user-cerner-mixed-pretransitioned.json';
import mockFacilities from './fixtures/facilityResponse/facilities-no-cerner.json';
import mockVamcEhr from './fixtures/vamc-ehr.json';

describe('SM CARE TEAM HELP PAGE', () => {
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

    it('displays correct page title, heading, reasons, and contact list link', () => {
      GeneralFunctionsPage.verifyPageHeader('find your care team?');
      GeneralFunctionsPage.verifyPageTitle(
        'Care Team Help - Start Message | Veterans Affairs',
      );
      cy.location('pathname').should('equal', Data.LINKS.CARE_TEAM_HELP);

      // Reasons list includes contact list reasons for VistA users
      cy.findByText(/They don't use messages/).should('exist');
      cy.findByText(/They're part of a different VA health care system/).should(
        'exist',
      );
      cy.findByText(/You removed them from your contact list/).should('exist');
      cy.findByText(/Your account isn't connected to them/).should('exist');

      // Name change bullet and R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByText(/Learn more about this name change/).should('exist');

      // Search suggestions
      cy.findByText(/Select a different VA health care system/).should('exist');
      cy.findByText(/Enter the first few letters of your facility/).should(
        'exist',
      );

      // Provider's name should not appear
      cy.get('.care-team-help-container').should(
        'not.contain',
        "provider's name",
      );

      // Update your contact list link should exist
      cy.get('.care-team-help-container').within(() => {
        cy.findByRole('link', { name: /Update your contact list/ }).should(
          'exist',
        );
      });

      // Should NOT have an h2 (no facility list heading for VistA-only)
      cy.get('.care-team-help-container').within(() => {
        cy.get('h2').should('not.exist');
      });

      // Phone number
      cy.get('va-telephone').should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
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

    it('displays correct content without contact list section', () => {
      GeneralFunctionsPage.verifyPageHeader('find your care team?');
      cy.location('pathname').should('equal', Data.LINKS.CARE_TEAM_HELP);

      // Reasons list for Oracle-only users
      cy.findByText(/They don't use messages/).should('exist');
      cy.findByText(/They're part of a different VA health care system/).should(
        'exist',
      );
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByText(/Learn more about this name change/).should('exist');

      // Oracle-only users should NOT see contact list reasons
      cy.get('.care-team-help-container').should(
        'not.contain',
        'You removed them from your contact list',
      );
      cy.get('.care-team-help-container').should(
        'not.contain',
        "Your account isn't connected to them",
      );

      // Oracle-only users should NOT see the Update your contact list link
      cy.get('.care-team-help-container').should(
        'not.contain',
        'Update your contact list',
      );

      // Provider's name should not appear
      cy.get('.care-team-help-container').should(
        'not.contain',
        "provider's name",
      );

      // Back button
      cy.get('va-button[text="Back"]').should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('Hybrid user (both Oracle Health(Cerner) and VistA)', () => {
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

    it('displays correct content with contact list section and facility list', () => {
      GeneralFunctionsPage.verifyPageHeader('find your care team?');
      cy.location('pathname').should('equal', Data.LINKS.CARE_TEAM_HELP);

      // Hybrid users see the h2 heading for Update your contact list
      cy.get('.care-team-help-container').within(() => {
        cy.get('h2')
          .should('exist')
          .and('contain', 'Update your contact list');
      });

      // Hybrid users see VistA facility names
      cy.findByText(/Update your contact list if you can't find/).should(
        'exist',
      );

      // Hybrid users see contact list reasons
      cy.findByText(/You removed them from your contact list/).should('exist');
      cy.findByText(/Your account isn't connected to them/).should('exist');

      // Name change bullet and R&S link
      cy.findByText(/Their name may appear different/).should('exist');
      cy.findByText(/Learn more about this name change/).should('exist');

      // Provider's name should not appear
      cy.get('.care-team-help-container').should(
        'not.contain',
        "provider's name",
      );

      // Update your contact list link
      cy.get('.care-team-help-container').within(() => {
        cy.findByRole('link', { name: /Update your contact list/ }).should(
          'exist',
        );
      });

      // Back button
      cy.get('va-button[text="Back"]').should('exist');

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
