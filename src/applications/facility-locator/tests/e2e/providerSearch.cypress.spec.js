/* eslint-disable @department-of-veterans-affairs/axe-check-required */

import mockGeocodingData from '../../constants/mock-geocoding-data.json';
import CcpHelpers from './helpers/ccp-helpers-cypress';
import {
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} from './featureTogglesToTest';
import * as h from './helpers';

const CC_PROVIDER = 'Community providers (in VA’s network)';
const NON_VA_URGENT_CARE = 'In-network community urgent care';
const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

const loadAndSelectCCProviders = () => {
  cy.visit(h.ROOT_URL);
  cy.injectAxeThenAxeCheck();

  h.typeInCityStateInput('Austin, TX{esc}');
  h.vaSelectSelect(h.FACILITY_TYPES.CC_PRO, h.FACILITY_TYPE_DROPDOWN);

  // Wait for services to be saved to state and input field to not be disabled
  cy.wait('@mockServices');
};

for (const featureSet of featureSetsToTest) {
  const isProgDiscEnabled = featureSet.some(
    isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
  );

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
      loadAndSelectCCProviders();

      h.verifyElementIsNotDisabled(h.CCP_SERVICE_TYPE_INPUT);
      h.focusElement(h.CCP_SERVICE_TYPE_INPUT);

      if (!isProgDiscEnabled) {
        h.verifyElementExists(h.SEARCH_AVAILABLE);
      }

      h.typeInCCPServiceTypeInput('D');

      if (!isProgDiscEnabled) {
        h.verifyElementExists(h.SEARCH_AVAILABLE);
      }

      h.typeInCCPServiceTypeInput('De'); // 2nd and 3rd character -
      h.verifyElementDoesNotExist(h.SEARCH_AVAILABLE);
    });

    it("renders `We couldn't find that, please try another service ` prompt", () => {
      loadAndSelectCCProviders();

      h.typeInCCPServiceTypeInput('djf');
      h.verifyElementExists(h.NO_SERVICE);
    });

    it('finds community dentists', () => {
      loadAndSelectCCProviders();

      h.typeInCCPServiceTypeInput('Dentist');
      h.clickElement('#downshift-1-item-0');
      h.submitSearchForm();

      cy.wait('@searchDentistsProvider');

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        /(Showing|results).*Community providers.*Dentist - Orofacial Pain.*near.*Austin, Texas/i,
      );

      h.verifyElementShouldContainText('.facility-result h3', 'Kerr, Max Olen');
      h.verifyElementDoesNotExist('.va-pagination');
    });

    it('finds community urgent care - Clinic/Center', () => {
      loadAndSelectCCProviders();

      h.typeInCCPServiceTypeInput('Clinic/Center - Urgent Care');
      h.clickElement('#downshift-1-item-0');
      h.submitSearchForm();

      cy.wait('@searchUrgentCare'); // only CCP Urgent care this way

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        `results for "${CC_PROVIDER}", "Clinic/Center - Urgent Care" near "Austin, Texas"`,
      );

      h.verifyElementShouldContainText('.facility-result h3', 'MinuteClinic');
      h.verifyElementDoesNotExist('.va-pagination');
    });

    it('finds community urgent care', () => {
      cy.visit(h.ROOT_URL);
      cy.injectAxeThenAxeCheck();

      h.typeInCityStateInput('Austin, TX{esc}');
      h.vaSelectSelect(h.FACILITY_TYPES.URGENT, h.FACILITY_TYPE_DROPDOWN);

      cy.get(serviceDropdown)
        .find('select')
        .select(NON_VA_URGENT_CARE);

      h.submitSearchForm();

      cy.wait('@mockUrgentCare');

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        `Results for "Urgent care", "${NON_VA_URGENT_CARE}" near "Austin, Texas"`,
      );

      h.verifyElementShouldContainText('.facility-result h3', 'MinuteClinic');
      h.verifyElementDoesNotExist('.va-pagination');
    });

    it('finds In-network community emergency care', () => {
      cy.visit(h.ROOT_URL);
      cy.injectAxeThenAxeCheck();

      h.typeInCityStateInput('Austin, TX{esc}');
      h.vaSelectSelect(h.FACILITY_TYPES.EMERGENCY, h.FACILITY_TYPE_DROPDOWN);

      cy.get(serviceDropdown)
        .find('select')
        .select('In-network community emergency care');

      h.submitSearchForm();

      cy.wait('@searchFacilitiesProvider');

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        `Results for "Emergency Care", "In-network community emergency care" near "Austin, Texas"`,
      );

      h.verifyElementExists('#emergency-care-info-note');
      h.verifyElementShouldContainText(
        '.facility-result h3',
        'DELL SETON MEDICAL CENTER AT UT',
      );
    });
  });
}
