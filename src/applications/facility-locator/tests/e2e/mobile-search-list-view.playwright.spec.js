const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const {
  communityPharmacySearchResults,
  communityCareProviderSearchResults,
  emergencyCareSearchResults,
  urgentCareSearchResults,
  vaFacilitySearchResults,
  vbaSearchResults,
  cemeterySearchResults,
  vetCenterSearchResults,
  noResults,
} = require('../../constants/mobile-map-test-data');
const {
  jsonResponse,
  featureCombinationsTogglesToTest,
  enabledFeatures,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const featureSetsToTest = featureCombinationsTogglesToTest(
  [
    'facilities_use_fl_progressive_disclosure',
    'facility_locator_mobile_map_update',
  ],
  ['facility_locator_mobile_map_update'],
);

const verifyStandardPhoneNumbers = async (page, mainNumber) => {
  await h.verifyMainNumber(page, mainNumber);
  await h.verifyTTYNumber(page);
};

for (const featureSet of featureSetsToTest) {
  test.describe(`mobile list behavior ${enabledFeatures(featureSet)}`, () => {
    test.beforeEach(async ({ page }) => {
      await h.setupMapboxStubs(page);
      await page.setViewportSize({ width: 480, height: 1200 });
      await page.route('**/v0/feature_toggles*', route =>
        route.fulfill(jsonResponse({ data: { features: featureSet } })),
      );
      await page.route(/maintenance_windows/, route =>
        route.fulfill(jsonResponse([])),
      );
    });

    test('with no search parameters - shows search text', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.verifyElementByText(page, h.MOBILE_LIST_SEARCH_TEXT);
    });

    test('with no search results - shows no results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(noResults));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Juneau, AK');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.HEALTH);
      await h.submitSearchForm(page);

      await h.verifyElementShouldContainText(
        page,
        h.SEARCH_RESULTS_SUMMARY,
        'No results found',
      );
    });

    test('VA health - renders list results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(vaFacilitySearchResults));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Atlanta, GA');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.HEALTH);
      await h.selectServiceTypeInVAHealthDropdown(page, 'Gynecology');
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'Fort McPherson VA Clinic',
          distance: '3.8 miles',
          addressLine1: '1701 Hardee Avenue, Southwest',
          addressLine2: 'Atlanta, GA 30310-5110',
          website:
            'https://www.va.gov/atlanta-health-care/locations/fort-mcpherson-va-clinic/',
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '404-230-5683');
      await h.verifyHealthConnectNumber(page, '855-679-0214');
      await h.verifyMentalHealthNumber(page, '404-321-6111, ext. 121776');
    });

    test('urgent care - renders list results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/ccp/urgent_care'), route =>
        route.fulfill(jsonResponse(urgentCareSearchResults[1])),
      );
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(urgentCareSearchResults[0]));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Tampa, FL');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.URGENT);
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'FAST TRACK URGENT CARE CENTER',
          distance: '0.5 miles',
          addressLine1: '564 CHANNELSIDE DR',
          addressLine2: 'TAMPA, FL 33602-5620',
          website: null,
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '813-925-1903');
    });

    test('emergency care - renders list results', async ({ page }) => {
      await page.route(
        /facilities_api\/v2\/ccp\/provider.*specialties/,
        route => route.fulfill(jsonResponse(emergencyCareSearchResults[1])),
      );
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(emergencyCareSearchResults[0]));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Norfolk, VA');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.EMERGENCY);
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'SENTARA NORFOLK GENERAL HOSPITAL',
          distance: '1.1 miles',
          addressLine1: '600 GRESHAM DR',
          addressLine2: 'NORFOLK, VA 23507-1904',
          website: null,
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '757-388-3000');
    });

    test('community providers - renders list results', async ({ page }) => {
      await page.route(
        /facilities_api\/v2\/ccp\/provider.*specialties/,
        route =>
          route.fulfill(jsonResponse(communityCareProviderSearchResults[1])),
      );
      await page.route(new RegExp('facilities_api/v2/ccp/specialties'), route =>
        route.fulfill(jsonResponse(communityCareProviderSearchResults[0])),
      );

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Seattle, WA');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);
      await h.typeAndSelectInCCPServiceTypeInput(page, 'Chiropractor');
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'Pirak, Michael John',
          distance: '1.4 miles',
          addressLine1: '203 14th Ave E',
          addressLine2: 'Seattle, WA 98112',
          website: null,
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '206-381-3473');
    });

    test('community pharmacies - renders list results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/ccp/pharmacy'), route =>
        route.fulfill(jsonResponse(communityPharmacySearchResults)),
      );

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Reno, NV');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PHARM);
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'WALGREENS',
          distance: '0.6 miles',
          addressLine1: '750 N VIRGINIA ST',
          addressLine2: 'RENO, NV 89501',
          website: null,
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '775-337-8703');
    });

    test('VBAs - renders list results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(vbaSearchResults));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Tulsa, OK');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.VBA);
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'Muskogee VA Regional Benefit Office',
          distance: '41.9 miles',
          addressLine1: '125 South Main Street',
          addressLine2: 'Muskogee, OK 74401',
          website: null,
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '800-827-1000');
    });

    test('cemeteries - renders list results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(cemeterySearchResults));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Honolulu, HI');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CEM);
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'National Memorial Cemetery of the Pacific',
          distance: '1.3 miles',
          addressLine1: '2177 Puowaina Dr',
          addressLine2: 'Honolulu, HI 96813-1729',
          website: null,
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '808-532-3720');
    });

    test('vet centers - renders list results', async ({ page }) => {
      await page.route(new RegExp('facilities_api/v2/va'), async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(vetCenterSearchResults));
        } else {
          await route.continue();
        }
      });

      await page.goto(h.ROOT_URL);

      expect(await axeCheck(page)).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Chicago, IL');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.VET);
      await h.submitSearchForm(page);

      await h.verifyMobileListItem(
        page,
        {
          index: 0,
          pin: 1,
          name: 'Evanston Vet Center',
          distance: '10.1 miles',
          addressLine1: '1901 Howard Street',
          addressLine2: 'Evanston, IL 60202',
          website: 'https://www.va.gov/evanston-vet-center/',
        },
        0,
      );

      await verifyStandardPhoneNumbers(page, '847-332-1019');
    });
  });
}
