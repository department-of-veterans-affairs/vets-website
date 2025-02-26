import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import CcpHelpers from '../ccp-helpers-cypress';
import {
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} from './featureTogglesToTest';

const CC_PROVIDER = 'Community providers (in VA’s network)';
const NON_VA_URGENT_CARE = 'In-network community urgent care';
const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
  'facilities_use_address_typeahead',
]);

for (const featureSet of featureSetsToTest) {
  const isProgDiscEnabled = featureSet.some(
    isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
  );

  const facilityDropdown = '#facility-type-dropdown';
  const serviceDropdown = isProgDiscEnabled
    ? '.service-type-dropdown-desktop'
    : '.service-type-dropdown-tablet';
  describe(`Provider search - ${enabledFeatures(featureSet)}`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: featureSet,
        },
      });
      cy.intercept('GET', '/v0/maintenance_windows', []);
      CcpHelpers.initApplicationMock('1223X2210X', 'searchDentistsProvider');
      CcpHelpers.initApplicationMock('261QE0002X', 'searchFacilitiesProvider');
      CcpHelpers.initApplicationMock('261QU0200X', 'searchUrgentCare');
      cy.intercept('GET', '/geocoding/**/*', mockGeocodingData);
    });

    it('renders "Search for available service" prompt', () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX{esc}', {
        waitForAnimations: true,
      });
      cy.get(facilityDropdown)
        .shadow()
        .find('select')
        .select('Community providers (in VA’s network)');
      cy.wait('@mockServices');
      // Wait for services to be saved to state and input field to not be disabled
      cy.get('#service-type-ahead-input')
        .should('not.be.disabled')
        .focus();

      if (!isProgDiscEnabled) {
        cy.get('#search-available-service-prompt').should('exist');
      }

      cy.get('#service-type-ahead-input').type('D');

      if (!isProgDiscEnabled) {
        cy.get('#search-available-service-prompt').should('exist');
      }

      cy.get('#service-type-ahead-input').type('De'); // 2nd and 3rd character -
      cy.get('#search-available-service-prompt').should('not.exist');
    });

    it("renders `We couldn't find that, please try another service ` prompt", () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX{esc}');
      cy.get(facilityDropdown)
        .shadow()
        .find('select')
        .select('Community providers (in VA’s network)');
      cy.wait('@mockServices');
      cy.get('#service-type-ahead-input').type('djf');
      cy.get('#could-not-find-service-prompt').should('exist');
    });

    it('finds community dentists', () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX{esc}');
      cy.get(facilityDropdown)
        .shadow()
        .find('select')
        .select(CC_PROVIDER);
      cy.wait('@mockServices');
      cy.get('#service-type-ahead-input').type('Dentist');
      cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.wait('@searchDentistsProvider');

      cy.get('#search-results-subheader').contains(
        `results for "${CC_PROVIDER}", "Dentist - Orofacial Pain" near "Austin, Texas"`,
      );
      cy.get('#other-tools').should('exist');

      cy.get('.facility-result h3').contains('Kerr, Max Olen');

      cy.get('.va-pagination').should('not.exist');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('finds community urgent care - Clinic/Center', () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX{esc}', {
        waitForAnimations: true,
      });
      cy.get(facilityDropdown)
        .shadow()
        .find('select')
        .select(CC_PROVIDER);
      cy.wait('@mockServices');
      cy.get('#service-type-ahead-input').type('Clinic/Center - Urgent Care');
      cy.get('#downshift-1-item-0').click({ waitForAnimations: true });

      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.wait('@searchUrgentCare'); // only CCP Urgent care this way
      cy.get('#search-results-subheader').contains(
        `results for "${CC_PROVIDER}", "Clinic/Center - Urgent Care" near "Austin, Texas"`,
      );
      cy.get('#other-tools').should('exist');

      cy.get('.facility-result h3').contains('MinuteClinic');
      cy.get('.va-pagination').should('not.exist');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('finds community urgent care', () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX{esc}');
      cy.get(facilityDropdown)
        .shadow()
        .find('select')
        .select('Urgent care');
      cy.get(serviceDropdown)
        .find('select')
        .select(NON_VA_URGENT_CARE);
      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.wait('@mockUrgentCare');
      cy.get('#search-results-subheader').contains(
        `Results for "Urgent care", "${NON_VA_URGENT_CARE}" near "Austin, Texas"`,
      );
      cy.get('#other-tools').should('exist');

      cy.get('.facility-result h3').contains('MinuteClinic');
      cy.get('.va-pagination').should('not.exist');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('finds In-network community emergency care', () => {
      cy.visit('/find-locations');

      cy.get('#street-city-state-zip').type('Austin, TX{esc}');
      cy.get(facilityDropdown)
        .shadow()
        .find('select')
        .select('Emergency care');
      cy.get(serviceDropdown)
        .find('select')
        .select('In-network community emergency care');
      cy.get('#facility-search').click({ waitForAnimations: true });
      cy.wait('@searchFacilitiesProvider');
      cy.get('#search-results-subheader').contains(
        `Results for "Emergency Care", "In-network community emergency care" near "Austin, Texas"`,
      );
      cy.get('#emergency-care-info-note').should('exist');
      cy.get('.facility-result h3').contains('DELL SETON MEDICAL CENTER AT UT');

      cy.injectAxe();
      cy.axeCheck();
    });
  });
}
