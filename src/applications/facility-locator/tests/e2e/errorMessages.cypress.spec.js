import CcpHelpers from 'applications/facility-locator/tests/ccp-helpers-cypress';
import mockFacilityDataV1 from '../../constants/mock-facility-data-v1.json';
import {
  enabledFeatures,
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
} from './featureTogglesToTest';

const featureSets = featureCombinationsTogglesToTest([
  'facilities_use_address_typeahead',
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featureSets) {
  describe(`Facility search error messages ${enabledFeatures(
    featureSet,
  )}`, () => {
    const isAddressTypeaheadEnabled = featureSet.some(
      isFeatureEnabled('facilities_use_address_typeahead'),
    );
    const isProgDiscEnabled = featureSet.some(
      isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
    );

    let addrErrorMessage = 'Please fill in a city, state, or postal code.';
    let serviceErrorMessage = 'Please search for an available service';
    if (isAddressTypeaheadEnabled || isProgDiscEnabled) {
      addrErrorMessage =
        'Enter a zip code or a city and state in the search box';
    }
    if (isProgDiscEnabled) {
      serviceErrorMessage = 'Start typing and select an available service';
    }
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: { features: featureSet },
      });
      cy.intercept('GET', '/v0/maintenance_windows', []);

      CcpHelpers.initApplicationMock('mockServices');

      cy.intercept(
        'GET',
        '/facilities_api/v2/ccp/provider?**',
        mockFacilityDataV1,
      ).as('searchFacilities');
      cy.visit('/find-locations');
    });

    afterEach(() => {
      cy.injectAxe();
      cy.axeCheck();
    });

    it('shows error message in location field on invalid search', () => {
      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.get('.usa-input-error-message').contains(addrErrorMessage);
      cy.get('#street-city-state-zip').should('be.focused');
    });

    it('shows error message on leaving location field empty', () => {
      cy.get('#street-city-state-zip').focus();
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .focus();
      if (isAddressTypeaheadEnabled) {
        cy.get('.usa-input-error-message').contains(
          'Enter a zip code or a city and state in the search box',
        );
      } else {
        cy.get('.usa-input-error-message').contains(addrErrorMessage);
      }
      cy.get('#street-city-state-zip').type('A');
      cy.get('#street-city-state-zip').type('{esc}');
      cy.get('.usa-input-error-message').should('not.exist');
    });

    it('shows error message when leaving facility type field empty', () => {
      cy.get('#street-city-state-zip').type('Austin, TX');
      cy.get('body').type('{esc}');
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .focus();
      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('.usa-error-message')
        .contains('Please choose a facility type.');
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .select('VA health');
      cy.get('.usa-input-error-message').should('not.exist');
    });

    it('shows error message when leaving service type field empty', () => {
      cy.get('#street-city-state-zip').type('Austin, TX');
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .select('Community providers (in VA’s network)');
      // Wait for services to be saved to state and input field to not be disabled
      cy.wait('@mockServices');
      cy.get('#service-type-ahead-input').should('not.be.disabled');
      cy.get('#facility-search').click({ waitForAnimations: true });

      cy.get('.usa-input-error-message').contains(serviceErrorMessage);
      cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
      cy.get('#downshift-1-item-0').click();
      cy.get('.usa-input-error-message').should('not.exist');
    });

    it('shows error message when typing in `back pain`, NOT selecting a service type, and attempting to search', () => {
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .select('Community providers (in VA’s network)');
      cy.get('#service-type-ahead-input').type('back pain');
      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.get('.usa-input-error-message').contains(serviceErrorMessage);
    });

    it('does not show error message when selecting a service type, then tab-ing/focusing back to the facility type field, then tab-ing forward to service type field', () => {
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .select('Community providers (in VA’s network)');

      cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
      cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .focus();
      cy.get('#service-type-ahead-input');

      cy.get('.usa-input-error-message').should('not.exist');
    });

    it('shows error message when deleting service after search', () => {
      cy.get('#street-city-state-zip').type('Austin, TX');
      cy.get('#facility-type-dropdown')
        .shadow()
        .find('select')
        .select('Community providers (in VA’s network)');
      cy.get('#service-type-ahead-input').type('Dentist');
      cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.get('#search-results-subheader').contains(
        'Results for "Community providers (in VA’s network)", "Dentist - Orofacial Pain" near "Austin, Texas"',
      );

      cy.get('#service-type-ahead-input').clear();
      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.get('.usa-input-error-message').contains(serviceErrorMessage);
      cy.get('#service-type-ahead-input').should('be.empty');
    });
  });
}
