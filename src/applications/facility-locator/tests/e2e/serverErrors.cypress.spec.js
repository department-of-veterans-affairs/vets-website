import {
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} from './featureTogglesToTest';
import * as h from './helpers';

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
  'facilities_use_address_typeahead',
]);

for (const featureSet of featureSetsToTest) {
  const serviceDropdown = featureSet.some(
    isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
  )
    ? '.service-type-dropdown-desktop'
    : '.service-type-dropdown-tablet';

  describe(`Facility Locator error handling ${enabledFeatures(
    featureSet,
  )}`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: featureSet,
        },
      });

      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('GET', '/facilities_api/**', {
        statusCode: 500,
        body: {
          error: 'server error',
        },
      }).as('getServerError');

      cy.intercept('POST', '/facilities_api/**', {
        statusCode: 500,
        body: {
          error: 'server error',
        },
      }).as('getServerError');
    });

    it('should show an error if the API returns a non-200 response', () => {
      cy.visit(h.ROOT_URL);
      cy.injectAxeThenAxeCheck();

      h.typeInCityStateInput('Austin, TX');
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.HEALTH);

      cy.get(serviceDropdown)
        .find('select')
        .select('Primary care');

      h.submitSearchForm();

      cy.wait('@getServerError');
      h.verifyElementShouldContainString(
        'h2.usa-alert-heading',
        'Find VA locations isn’t working right now',
      );

      h.verifyElementDoesNotExist('#emergency-care-info-note');
    });

    it('should show the 911 banner for emergency searches even if the API returns a non-200 response', () => {
      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('GET', '/facilities_api/**', {
        statusCode: 500,
        body: {
          error: 'server error',
        },
      }).as('getServerError');

      cy.visit(h.ROOT_URL);
      cy.injectAxeThenAxeCheck();

      h.typeInCityStateInput('Austin, TX');
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.EMERGENCY);
      h.submitSearchForm();

      cy.wait('@getServerError');

      h.verifyElementShouldContainString(
        'h2.usa-alert-heading',
        'Find VA locations isn’t working right now',
      );

      cy.get('#emergency-care-info-note')
        .contains('call')
        .contains('911');
    });
  });
}
