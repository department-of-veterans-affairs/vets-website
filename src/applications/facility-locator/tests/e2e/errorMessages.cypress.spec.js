/* eslint-disable @department-of-veterans-affairs/axe-check-required */

import FacilityHelpers from './helpers/facility-helpers-cypress';
import FeaturesHelpers from './helpers/features-helpers-cypress';
import CcpHelpers from './helpers/ccp-helpers-cypress';

import {
  enabledFeatures,
  featureCombinationsTogglesToTest,
} from './featureTogglesToTest';
import * as h from './helpers';

const featureSets = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featureSets) {
  describe(`Facility search error messages ${enabledFeatures(
    featureSet,
  )}`, () => {
    const addrErrorMessage =
      'Enter a zip code or a city and state in the search box';

    const serviceErrorMessage = 'ErrorStart typing and select a service type';

    beforeEach(() => {
      cy.intercept('GET', '/v0/maintenance_windows', []);
      FeaturesHelpers.initApplicationMock(featureSet);
      CcpHelpers.initApplicationMock('1223X2210X', 'mockDentists');
      FacilityHelpers.initApplicationMock();

      cy.visit(h.ROOT_URL);
      cy.injectAxeThenAxeCheck();
    });

    it('shows error message in location field on invalid search', () => {
      cy.injectAxeThenAxeCheck();
      h.submitSearchForm();
      h.errorMessageContains(addrErrorMessage);
      h.elementIsFocused(h.CITY_STATE_ZIP_INPUT);
    });

    it('shows error message on leaving location field empty', () => {
      h.focusElement(h.CITY_STATE_ZIP_INPUT);
      h.findSelectInVaSelect(h.FACILITY_TYPE_DROPDOWN).focus();

      h.submitSearchForm();
      h.errorMessageContains(addrErrorMessage);
    });

    it('shows error message when leaving facility type field empty', () => {
      h.typeInCityStateInput('Austin, TX', true);
      h.findSelectInVaSelect(h.FACILITY_TYPE_DROPDOWN).focus();
      h.submitSearchForm();

      cy.get(h.FACILITY_TYPE_DROPDOWN)
        .shadow()
        .find('.usa-error-message')
        .contains('Select a facility type');
      cy.get(h.FACILITY_TYPE_DROPDOWN)
        .shadow()
        .find('select')
        .select('VA health');

      h.verifyElementDoesNotExist(h.SEARCH_FORM_ERROR_MESSAGE);
    });

    it('shows error message when leaving service type field empty', () => {
      h.typeInCityStateInput('Austin, TX');
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CC_PRO);

      // Wait for services to be saved to state and input field to not be disabled
      cy.wait('@mockServices');

      h.verifyElementIsNotDisabled(h.CCP_SERVICE_TYPE_INPUT);
      h.submitSearchForm();
      h.errorMessageContains(serviceErrorMessage);
      h.typeAndSelectInCCPServiceTypeInput('Clinic/Center - Urgent Care');

      h.verifyElementDoesNotExist(h.SEARCH_FORM_ERROR_MESSAGE);
    });

    it('shows error message when typing in `back pain`, NOT selecting a service type, and attempting to search', () => {
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CC_PRO);
      h.typeInCCPServiceTypeInput('back pain');
      h.submitSearchForm();

      h.errorMessageContains(serviceErrorMessage);
    });

    it('does not show error message when selecting a service type, then tab-ing/focusing back to the facility type field, then tab-ing forward to service type field', () => {
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CC_PRO);
      h.typeAndSelectInCCPServiceTypeInput('Clinic/Center - Urgent Care');
      h.findSelectInVaSelect(h.FACILITY_TYPE_DROPDOWN).focus();

      h.verifyElementExists(h.CCP_SERVICE_TYPE_INPUT);
      h.verifyElementDoesNotExist(h.SEARCH_FORM_ERROR_MESSAGE);
    });

    it('shows error message when deleting service after search', () => {
      h.typeInCityStateInput('Austin, TX');
      h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CC_PRO);

      cy.wait('@mockServices');

      h.typeAndSelectInCCPServiceTypeInput('Dentist - Orofacial Pain');
      h.submitSearchForm();

      h.verifyElementShouldContainString(
        h.SEARCH_RESULTS_SUMMARY,
        /(Showing|results).*Community providers.*Dentist - Orofacial Pain.*Austin, Texas/i,
      );

      h.clearInput(h.CCP_SERVICE_TYPE_INPUT);
      h.submitSearchForm();
      h.errorMessageContains(serviceErrorMessage);
    });
  });
}
