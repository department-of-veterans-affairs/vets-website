import {
  communityPharmacySearchResults,
  communityCareProviderSearchResults,
  emergencyCareSearchResults,
  urgentCareSearchResults,
  vaFacilitySearchResults,
  vbaSearchResults,
  cemeterySearchResults,
  vetCenterSearchResults,
  noResults,
} from '../../constants/mobile-map-test-data';
import * as FT from './featureTogglesToTest';
import * as h from './helpers';

const featureSetsToTest = FT.featureCombinationsTogglesToTest(
  [
    'facilities_use_fl_progressive_disclosure',
    'facility_locator_mobile_map_update',
  ],
  ['facility_locator_mobile_map_update'],
);

const verifyStandardPhoneNumbers = mainNumber => {
  h.verifyMainNumber(mainNumber);
  h.verifyTTYNumber();
};

featureSetsToTest.forEach(featureSet => {
  describe(`mobile list behavior ${FT.enabledFeatures(featureSet)}`, () => {
    beforeEach(() => {
      cy.viewport(480, 1200);
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          features: featureSet,
        },
      });
    });

    describe('with no search parameters', () => {
      it('should correctly load the basic view', () => {
        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();
        h.verifyElementByText(h.MOBILE_LIST_SEARCH_TEXT);
      });
    });

    describe('with no search results', () => {
      it('should correctly load the basic view', () => {
        cy.intercept('POST', '/facilities_api/v2/va', noResults);

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Juneau, AK');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.HEALTH);
        h.submitSearchForm();

        h.verifyElementShouldContainText(
          h.SEARCH_RESULTS_SUMMARY,
          'No results found',
        );
      });
    });

    describe('for VA health facilities', () => {
      it('should correctly render the given results', () => {
        cy.intercept('POST', '/facilities_api/v2/va', vaFacilitySearchResults);

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Atlanta, GA');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.HEALTH);
        h.selectServiceTypeInVAHealthDropdown('Gynecology');
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'Fort McPherson VA Clinic',
            distance: '3.8 miles',
            addressLine1: '1701 Hardee Avenue, Southwest',
            addressLine2: 'Atlanta, GA 30310-5110',
            website:
              'https://www.va.gov/atlanta-health-care/locations/fort-mcpherson-va-clinic/',
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=1701%20Hardee%20Avenue%2C%20Southwest%2C%20Atlanta%2C%20GA%2030310-5110',
          },
          0,
        );

        verifyStandardPhoneNumbers('404-230-5683');
        h.verifyHealthConnectNumber('855-679-0214');
        h.verifyMentalHealthNumber('404-321-6111, ext. 121776');
      });
    });

    describe('for urgent care facilities', () => {
      it('should correctly render the given results', () => {
        cy.intercept(
          'GET',
          '/facilities_api/v2/ccp/urgent_care*',
          urgentCareSearchResults[1],
        );

        cy.intercept(
          'POST',
          '/facilities_api/v2/va*',
          urgentCareSearchResults[0],
        );

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Tampa, FL');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.URGENT);
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'FAST TRACK URGENT CARE CENTER',
            distance: '0.5 miles',
            addressLine1: '564 CHANNELSIDE DR',
            addressLine2: 'TAMPA, FL 33602-5620',
            website: null,
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=564%20CHANNELSIDE%20DR%2C%20TAMPA%2C%20FL%2033602-5620',
          },
          0,
        );

        verifyStandardPhoneNumbers('813-925-1903');
      });
    });

    describe('for emergency care facilities', () => {
      it('should correctly render the given results', () => {
        cy.intercept(
          'GET',
          '/facilities_api/v2/ccp/provider?*specialties*',
          emergencyCareSearchResults[1],
        );

        cy.intercept(
          'POST',
          '/facilities_api/v2/va*',
          emergencyCareSearchResults[0],
        );

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Norfolk, VA');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.EMERGENCY);
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'SENTARA NORFOLK GENERAL HOSPITAL',
            distance: '1.1 miles',
            addressLine1: '600 GRESHAM DR',
            addressLine2: 'NORFOLK, VA 23507-1904',
            website: null,
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=600%20GRESHAM%20DR%2C%20NORFOLK%2C%20VA%2023507-1904',
          },
          0,
        );

        verifyStandardPhoneNumbers('757-388-3000');
      });
    });

    describe('for VA community providers', () => {
      it('should correctly render the given results', () => {
        cy.intercept(
          'GET',
          '/facilities_api/v2/ccp/provider?*specialties*',
          communityCareProviderSearchResults[1],
        );

        cy.intercept(
          'GET',
          '/facilities_api/v2/ccp/specialties*',
          communityCareProviderSearchResults[0],
        );

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Seattle, WA');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CC_PRO);
        h.typeAndSelectInCCPServiceTypeInput('Chiropractor');
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'Pirak, Michael John',
            distance: '1.4 miles',
            addressLine1: '203 14th Ave E',
            addressLine2: 'Seattle, WA 98112',
            website: null,
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=203%2014th%20Ave%20E%2C%20Seattle%2C%20WA%2098112',
          },
          0,
        );

        verifyStandardPhoneNumbers('206-381-3473');
      });
    });

    describe('for community pharmacies', () => {
      it('should correctly render the given results', () => {
        cy.intercept(
          'GET',
          '/facilities_api/v2/ccp/pharmacy*',
          communityPharmacySearchResults,
        );

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Reno, NV');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CC_PHARM);
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'WALGREENS',
            distance: '0.6 miles',
            addressLine1: '750 N VIRGINIA ST',
            addressLine2: 'RENO, NV 89501',
            website: null,
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=750%20N%20VIRGINIA%20ST%2C%20RENO%2C%20NV%2089501',
          },
          0,
        );

        verifyStandardPhoneNumbers('775-337-8703');
      });
    });

    describe('for VBAs', () => {
      it('should correctly render the given results', () => {
        cy.intercept('POST', '/facilities_api/v2/va*', vbaSearchResults);

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Tulsa, OK');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.VBA);
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'Muskogee VA Regional Benefit Office',
            distance: '41.9 miles',
            addressLine1: '125 South Main Street',
            addressLine2: 'Muskogee, OK 74401',
            website: null,
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=125%20South%20Main%20Street%2C%20Muskogee%2C%20OK%2074401',
          },
          0,
        );

        verifyStandardPhoneNumbers('800-827-1000');
      });
    });

    describe('for cemeteries', () => {
      it('should correctly render the given results', () => {
        cy.intercept('POST', '/facilities_api/v2/va*', cemeterySearchResults);

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Honolulu, HI');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.CEM);
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'National Memorial Cemetery of the Pacific',
            distance: '1.3 miles',
            addressLine1: '2177 Puowaina Dr',
            addressLine2: 'Honolulu, HI 96813-1729',
            website: null,
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=2177%20Puowaina%20Dr%2C%20Honolulu%2C%20HI%2096813-1729',
          },
          0,
        );

        verifyStandardPhoneNumbers('808-532-3720');
      });
    });

    describe('for vet centers', () => {
      it('should correctly render the given results', () => {
        cy.intercept('POST', '/facilities_api/v2/va*', vetCenterSearchResults);

        cy.visit(h.ROOT_URL);
        cy.injectAxeThenAxeCheck();

        h.typeInCityStateInput('Chicago, IL');
        h.selectFacilityTypeInDropdown(h.FACILITY_TYPES.VET);
        h.submitSearchForm();

        // Verify first item on the mobile List view (regression check)
        h.verifyMobileListItem(
          {
            index: 0,
            pin: 1,
            name: 'Evanston Vet Center',
            distance: '10.1 miles',
            addressLine1: '1901 Howard Street',
            addressLine2: 'Evanston, IL 60202',
            website: 'https://www.va.gov/evanston-vet-center/',
            map:
              'https://maps.google.com?saddr=Current+Location&daddr=1901%20Howard%20Street%2C%20Evanston%2C%20IL%2060202',
          },
          0,
        );

        verifyStandardPhoneNumbers('847-332-1019');
      });
    });
  });
});
