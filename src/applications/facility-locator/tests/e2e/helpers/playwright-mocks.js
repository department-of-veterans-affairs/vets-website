/**
 * Playwright mock data and route setup functions.
 * Ports facility-helpers-cypress.js and ccp-helpers-cypress.js to Playwright.
 */

// --- VA Facility mock data (from facility-helpers-cypress.js) ---

const vaResultsData = {
  data: [
    {
      id: 'vha_691GE',
      type: 'va_facilities',
      attributes: {
        uniqueId: '691GE',
        name: 'Los Angeles VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        website: null,
        lat: 34.05171284,
        long: -77.52753613,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: null,
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012-3328',
          },
          mailing: {},
        },
        phone: {
          main: '213-253-5000 x',
          fax: '213-253-5510 x',
          afterHours: '877-252-4866 x',
          patientAdvocate: '213-253-2677 x24111',
          enrollmentCoordinator: '213-253-2677 x24033',
          pharmacy: '800-952-4852 x',
          mentalHealthClinic: '310-268-4449',
        },
        hours: {
          monday: '700AM-530PM',
          tuesday: '700AM-530PM',
          wednesday: '700AM-530PM',
          thursday: '700AM-530PM',
          friday: '700AM-530PM',
          saturday: '-',
          sunday: '-',
        },
        services: {
          lastUpdated: '2017-07-24',
          health: [
            { sl1: ['DentalServices'], sl2: [] },
            { sl1: ['MentalHealthCare'], sl2: [] },
            { sl1: ['PrimaryCare'], sl2: [] },
          ],
        },
        feedback: {
          health: {
            primaryCareUrgent: '0.78',
            primaryCareRoutine: '0.77',
            effectiveDate: '2017-03-24',
          },
        },
        access: {
          health: {
            primaryCare: { new: 15, established: 3 },
            mentalHealth: { new: 12, established: 2 },
            womensHealth: { new: null, established: 9 },
            audiology: { new: 48, established: 0 },
            gastroenterology: { new: 7, established: null },
            opthalmology: { new: 9, established: 6 },
            optometry: { new: 14, established: 5 },
            urologyClinic: { new: 23, established: 3 },
            effectiveDate: '2017-08-14',
          },
        },
      },
    },
    {
      id: 'vba_343o',
      type: 'va_facilities',
      attributes: {
        uniqueId: '343o',
        name: 'Los Angeles Ambulatory Care Center',
        facilityType: 'va_benefits_facility',
        classification: 'OUTBASED',
        website: null,
        lat: 34.05171315,
        long: -118.2387403,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: 'Room A-444',
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012',
          },
          mailing: {},
        },
        phone: { main: '213-253-2677 Ext 24759', fax: '' },
        hours: {
          monday: '8:00AM-2:30PM',
          tuesday: '8:00AM-2:30PM',
          wednesday: '8:00AM-2:30PM',
          thursday: '8:00AM-2:30PM',
          friday: 'By Appointment Only',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: { benefits: { other: '', standard: [] } },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vha_688',
      type: 'facility',
      attributes: {
        classification: 'VA Medical Center (VAMC)',
        distance: null,
        facilityType: 'va_health_facility',
        id: 'vha_688',
        lat: 38.929401,
        long: -77.0111955,
        mobile: false,
        name: 'Washington VA Medical Center',
        operationalHoursSpecialInstructions: [
          'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
        ],
        uniqueId: '688',
        visn: '5',
        website:
          'https://www.va.gov/washington-dc-health-care/locations/washington-va-medical-center/',
        tmpCovidOnlineScheduling: null,
        access: { health: [], effectiveDate: '' },
        address: {
          physical: {
            zip: '20422-0001',
            city: 'Washington',
            state: 'DC',
            address1: '50 Irving Street, Northwest',
          },
        },
        feedback: {
          health: {
            primaryCareUrgent: 0.6800000071525574,
            primaryCareRoutine: 0.8199999928474426,
            specialtyCareUrgent: 0.7400000095367432,
            specialtyCareRoutine: 0.7900000214576721,
          },
          effectiveDate: '2025-02-04',
        },
        hours: {
          monday: '24/7',
          tuesday: '24/7',
          wednesday: '24/7',
          thursday: '24/7',
          friday: '24/7',
          saturday: '24/7',
          sunday: '24/7',
        },
        operatingStatus: { code: 'NORMAL' },
        phone: {
          fax: '202-745-8530',
          main: '202-745-8000',
          pharmacy: '202-745-8235',
          afterHours: '202-745-8000',
          patientAdvocate: '202-745-8588',
          mentalHealthClinic: '202-745-8000, ext. 58127',
          enrollmentCoordinator: '202-745-8000 x56333',
          healthConnect: '855-679-0250',
        },
        services: {
          health: [
            {
              name: 'Advice nurse',
              serviceId: 'adviceNurse',
              link:
                'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services/adviceNurse',
            },
          ],
          link:
            'https://api.va.gov/services/va_facilities/v1/facilities/vha_688/services',
          lastUpdated: '2025-02-19',
        },
      },
    },
    {
      id: 'vba_344l',
      type: 'facility',
      attributes: {
        classification: 'VetSuccess On Campus',
        distance: null,
        facilityType: 'va_benefits_facility',
        id: 'vba_344l',
        lat: 34.0865467,
        long: -118.2930592,
        mobile: null,
        name: 'VetSuccess on Campus at Los Angeles City College',
        operationalHoursSpecialInstructions: null,
        uniqueId: '344l',
        visn: null,
        website: null,
        tmpCovidOnlineScheduling: null,
        access: { health: [], effectiveDate: '' },
        address: {
          physical: {
            zip: '90029',
            city: 'Los Angeles',
            state: 'CA',
            address1: '855 North Vermont',
          },
        },
        feedback: [],
        hours: {
          monday: '9:00 a.m. - 5:30 p.m.',
          tuesday: 'Closed',
          wednesday: 'Closed',
          thursday: 'Closed',
          friday: 'Closed',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        operatingStatus: {
          code: 'VIRTUAL_CARE',
          additionalInfo:
            "We're not open for in-person service at this time. Our staff are still available by phone and by our online customer service tool.",
        },
        phone: { main: '323-953-4000, ext. 1253' },
        services: {
          benefits: [
            {
              name: 'ApplyingForBenefits',
              serviceId: 'applyingForBenefits',
              link:
                'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services/applyingForBenefits',
            },
          ],
          link:
            'https://api.va.gov/services/va_facilities/v1/facilities/vba_344l/services',
        },
      },
    },
  ],
  links: {
    self:
      'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1',
    first:
      'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
    prev: null,
    next: null,
    last:
      'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 3,
    },
  },
};

// --- CCP mock data (from ccp-helpers-cypress.js) ---

const emergencyCareData = [
  {
    id: '6ec8fea621c7f89b005113af0762c8e96ab7ffb93ea42de7407545dcefcc415d',
    type: 'provider',
    attributes: {
      accNewPatients: 'true',
      address: {
        street: '7 Medical Pkwy',
        city: 'Farmers Branch',
        state: 'TX',
        zip: '75234',
      },
      caresitePhone: '9722471000',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 32.91448,
      long: -96.8729,
      name: 'DALLAS MEDICAL CENTER LLC',
      phone: null,
      posCodes: null,
      prefContact: null,
      uniqueId: '1861690364',
    },
  },
  {
    id: 'd177566d94932c18a97fc5e441e792cae77544874012095f174886dd6b156400',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '1500 Red River St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
      caresitePhone: '5123247000',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.27558,
      long: -97.733979,
      name: 'DELL SETON MEDICAL CENTER AT UT',
      phone: null,
      posCodes: null,
      prefContact: null,
      uniqueId: '1093810327',
    },
  },
];

const urgentCareData = [
  {
    id: 'ccp_5cae942081050162cd3917d91a04cc7a2ca303f05274d0a2c2bcdc6ae0255b07',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '1920 E Riverside Dr Ste A-110',
        city: 'Austin',
        state: 'TX',
        zip: '78741',
      },
      caresitePhone: '5123261600',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.242494,
      long: -97.728154,
      name: 'FastMed Urgent Care',
      phone: null,
      posCodes: '20',
      prefContact: null,
      specialty: [],
      uniqueId: '1346545209',
    },
  },
  {
    id: 'ccp_3740b047cfb32751691e2955df16fc3e61d63ed59f6dbe8aa50aa726ca84ca30',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '3311 N Lamar Blvd',
        city: 'Austin',
        state: 'TX',
        zip: '78705',
      },
      caresitePhone: '5129757791',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.302,
      long: -97.74471,
      name: 'FastMed Urgent Care',
      phone: null,
      posCodes: '20',
      prefContact: null,
      specialty: [],
      uniqueId: '1346545209',
    },
  },
  {
    id: 'ccp_222196a93173f5ea6cd64c16d5e986a48571a201848dddbc4e313a6185bb0774',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '2610 Lake Austin Blvd',
        city: 'Austin',
        state: 'TX',
        zip: '78703',
      },
      caresitePhone: '8663892727',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.28156,
      long: -97.77505,
      name: 'MinuteClinic',
      phone: null,
      posCodes: '17',
      prefContact: null,
      specialty: [],
      uniqueId: '1609076330',
    },
  },
];

const pharmacies = [
  {
    id: '2524dc6a54faf416ae16f61b51ab40741b4cb21324846a1a2c8f11002f3fbc24',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '750 N VIRGINIA ST',
        city: 'RENO',
        state: 'NV',
        zip: '89501',
      },
      caresitePhone: '7753378703',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 39.534779,
      long: -119.814921,
      name: 'WALGREENS',
      phone: null,
      posCodes: null,
      prefContact: null,
      trainings: [],
      uniqueId: '1437164407',
    },
  },
];

const specialtiesData = {
  data: [
    {
      id: '1223X2210X',
      type: 'specialty',
      attributes: {
        classification: 'Dentist',
        grouping: 'Dental Providers',
        name: 'Dentist - Orofacial Pain',
        specialization: 'Orofacial Pain',
        specialtyCode: '1223X2210X',
        specialtyDescription:
          'A dentist who assesses, diagnoses, and treats patients with complex chronic orofacial pain...',
      },
    },
    {
      id: '261QU0200X',
      type: 'specialty',
      attributes: {
        classification: 'Clinic/Center',
        grouping: 'Ambulatory Health Care Facilities',
        name: 'Clinic/Center - Urgent Care',
        specialization: 'Urgent Care',
        specialtyCode: '261QU0200X',
        specialtyDescription: 'Definition to come...',
      },
    },
    {
      id: '261QE0002X',
      type: 'specialty',
      attributes: {
        classification: 'Clinic/Center',
        grouping: 'Ambulatory Health Care Facilities',
        name: 'Clinic/Center - Emergency Care',
        specialization: 'Emergency Care',
        specialtyCode: '261QE0002X',
        specialtyDescription: 'Definition to come...',
      },
    },
    {
      id: '282N00000X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital',
        specialization: null,
        specialtyCode: '282N00000X',
        specialtyDescription: 'An acute general hospital...',
      },
    },
    {
      id: '282NC0060X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital - Critical Access',
        specialization: 'Critical Access',
        specialtyCode: '282NC0060X',
        specialtyDescription: 'Definition to come.',
      },
    },
    {
      id: '282NR1301X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital - Rural',
        specialization: 'Rural',
        specialtyCode: '282NR1301X',
        specialtyDescription: 'Definition to come...',
      },
    },
    {
      id: '282NW0100X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital - Women',
        specialization: 'Women',
        specialtyCode: '282NW0100X',
        specialtyDescription: 'Definition to come...',
      },
    },
  ],
};

const ccpProviders = {
  '1223X2210X': [
    {
      id: 'ab1152a9353aacc5fa99cdda2fad92e68f53132ed23c86bdf4d18656af1ac323',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '5920 W William Cannon Dr Ste 6-210',
          city: 'Austin',
          state: 'TX',
          zip: '78749',
        },
        caresitePhone: '5122154350',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 30.230597,
        long: -97.859772,
        name: 'Kerr, Max Olen',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1609075092',
      },
    },
  ],
  '261QE0002X': emergencyCareData,
  '213E00000X': [
    {
      id: 'a',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '401 N 17TH ST STE 311',
          city: 'ALLENTOWN',
          state: 'PA',
          zip: '18104-5051',
        },
        caresitePhone: '610-969-4470',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 40.60274,
        long: -75.494775,
        name: 'BRIGIDO, STEPHEN',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1407853336',
      },
    },
    {
      id: 'b',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '401 N 17TH ST STE 105',
          city: 'ALLENTOWN',
          state: 'PA',
          zip: '18104-5049',
        },
        caresitePhone: '610-969-4470',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 40.60274,
        long: -75.494775,
        name: 'OFRICHTER, WILLIAM',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [
          {
            courseName: 'Opioid Safety Initiative (OSI)',
            courseCode: '1086479',
            courseCompletionDate: '2/11/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
        ],
        uniqueId: '1689649824',
      },
    },
    {
      id: 'c',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '401 N 17TH ST STE 311',
          city: 'ALLENTOWN',
          state: 'PA',
          zip: '18104-5051',
        },
        caresitePhone: '610-969-4470',
        email: null,
        fax: null,
        gender: 'Female',
        lat: 40.60274,
        long: -75.494775,
        name: 'BAKER, LORA',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [
          {
            courseName: 'A Perspective for Veteran Care',
            courseCode: '1085488',
            courseCompletionDate: '2/5/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
          {
            courseName: 'Opioid Safety Initiative (OSI)',
            courseCode: '1073710',
            courseCompletionDate: '2/4/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
          {
            courseName: 'Opioid Safety Initiative (OSI)',
            courseCode: '1086479',
            courseCompletionDate: '2/4/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
        ],
        uniqueId: '1235114331',
      },
    },
  ],
  '261QU0200X': urgentCareData,
};

// --- Route setup functions ---

function jsonResponse(data) {
  return {
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(data),
  };
}

async function setupCommonMocks(page, featureSet = []) {
  const { setupMapboxStubs } = require('./playwright-helpers');
  await setupMapboxStubs(page);
  await page.route('**/v0/feature_toggles*', route =>
    route.fulfill(jsonResponse({ data: { features: featureSet } })),
  );
  await page.route(/maintenance_windows/, route =>
    route.fulfill(jsonResponse([])),
  );
}

async function setupVAFacilityMocks(page) {
  await page.route(new RegExp('facilities_api/v2/va'), async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill(jsonResponse(vaResultsData));
    } else {
      await route.continue();
    }
  });

  for (const item of vaResultsData.data) {
    // eslint-disable-next-line no-await-in-loop
    await page.route(new RegExp(`facilities_api/v2/va/${item.id}`), route =>
      route.fulfill(jsonResponse({ data: item })),
    );
  }
}

async function setupCCPMocks(page, providerType = 'nodata') {
  await page.route(new RegExp('facilities_api/v2/ccp/specialties'), route =>
    route.fulfill(jsonResponse(specialtiesData)),
  );

  await page.route(new RegExp('facilities_api/v2/ccp/pharmacy'), route =>
    route.fulfill(
      jsonResponse({
        data: pharmacies,
        meta: {
          pagination: {
            currentPage: 1,
            prevPage: null,
            nextPage: 2,
            totalPages: 166,
            totalEntries: 2487,
          },
        },
        links: {
          self:
            'https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=15&radius=42',
          first:
            'https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=15&radius=42',
          prev: null,
          next:
            'https://api.va.gov/facilities_api/v2/ccp?page=2&per_page=15&radius=42',
          last:
            'https://api.va.gov/facilities_api/v2/ccp?page=166&per_page=15&radius=42',
        },
      }),
    ),
  );

  await page.route(new RegExp('facilities_api/v2/ccp/urgent_care'), route =>
    route.fulfill(
      jsonResponse({
        data: urgentCareData,
        meta: {
          pagination: {
            currentPage: 1,
            prevPage: null,
            nextPage: null,
            totalPages: 1,
            totalEntries: 10,
          },
        },
        links: {
          self:
            'https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=10&radius=42',
          first:
            'https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=10&radius=42',
          prev: null,
          next: null,
          last:
            'https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=10&radius=42',
        },
      }),
    ),
  );

  const providersData =
    providerType && ccpProviders[providerType]?.length
      ? ccpProviders[providerType]
      : [];

  await page.route(
    new RegExp(
      `facilities_api/v2/ccp/provider.*specialties.*${providerType.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}`,
    ),
    route =>
      route.fulfill(
        jsonResponse({
          data: providersData,
          meta: {
            pagination: {
              currentPage: 1,
              prevPage: null,
              nextPage: null,
              totalPages: 1,
              totalEntries: providersData.length,
            },
          },
          links: {
            self: `https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=15&radius=42&specialties%5B%5D=${providerType}`,
            first: `https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=15&radius=42&specialties%5B%5D=${providerType}`,
            prev: null,
            next: null,
            last: `https://api.va.gov/facilities_api/v2/ccp?page=1&per_page=15&radius=42&specialties%5B%5D=${providerType}`,
          },
        }),
      ),
  );
}

// --- Feature toggle utilities (from featureTogglesToTest.js) ---

function arrayChooseK(arr, k, state = []) {
  if (k === 0) return [state];
  return arr.flatMap((v, i) =>
    arrayChooseK(arr.slice(i + 1), k - 1, [...state, v]),
  );
}

function createFlipperFeatureSet(togglesCombinations, toggleNames) {
  return togglesCombinations.map(toggles => {
    const toggleSet = [];
    toggleNames.forEach(name => {
      toggleSet.push({ name, value: toggles.includes(name) });
    });
    return toggleSet;
  });
}

function isFeatureEnabled(featureName) {
  return function isEnabled(feature) {
    return feature.name === featureName && feature.value;
  };
}

function featureCombinationsTogglesToTest(
  toggleNames = [],
  requiredToggles = [],
) {
  if (toggleNames.length === 0) return [];
  const togglesCombinations = [];
  for (let i = 0; i <= toggleNames.length; i++) {
    togglesCombinations.push(...arrayChooseK(toggleNames, i));
  }
  return createFlipperFeatureSet(togglesCombinations, toggleNames).filter(
    features =>
      requiredToggles.every(toggle => features.some(isFeatureEnabled(toggle))),
  );
}

function enabledFeatures(features) {
  return features
    .filter(f => f.value)
    .map(f => f.name)
    .join(',');
}

// --- Analytics assertion utilities (from analyticsUtils.js) ---

function assertDataLayerEvent(win, eventName) {
  const found = win.dataLayer.find(d => d.event && d.event === eventName);
  if (!found)
    throw new Error(`Expected dataLayer event "${eventName}" not found`);
}

function assertDataLayerLastItems(win, items, event) {
  const eventTest = win.dataLayer
    .filter(d => d.event && d.event === event)
    .pop();
  items.forEach(a => {
    if (!Object.keys(eventTest).includes(a)) {
      throw new Error(`Expected key "${a}" in event "${event}"`);
    }
  });
}

function assertEventAndAttributes(win, event, attr) {
  const found = win.dataLayer.find(
    d => Object.keys(d).length > 0 && Object.values(d).includes(event),
  );
  if (!found) throw new Error(`Expected dataLayer event "${event}" not found`);
  attr.forEach(a => {
    if (!Object.keys(found).includes(a)) {
      throw new Error(`Expected attribute "${a}" in event "${event}"`);
    }
  });
}

module.exports = {
  vaResultsData,
  specialtiesData,
  jsonResponse,
  setupCommonMocks,
  setupVAFacilityMocks,
  setupCCPMocks,
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
  assertDataLayerEvent,
  assertDataLayerLastItems,
  assertEventAndAttributes,
};
