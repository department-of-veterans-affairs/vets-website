/**
 * Vercel Serverless Function — Mock VA API
 *
 * Serves mock responses for the three deployed apps:
 *   - static-pages (feature toggles, maintenance windows, user)
 *   - facility-locator (facilities API v2)
 *   - hca / 10-10EZ (enrollment, prefill, rating, submission)
 *
 * All responses are derived from the existing test fixtures in the repo.
 * Sources:
 *   - src/applications/hca/tests/e2e/fixtures/mocks/
 *   - src/applications/facility-locator/constants/
 *   - src/applications/facility-locator/tests/e2e/helpers/ccp-helpers-cypress.js
 */

// ---------------------------------------------------------------------------
// Mock data (inlined from test fixtures to keep the function self-contained)
// ---------------------------------------------------------------------------

const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      profile: {
        sign_in: { service_name: 'idme' },
        email: 'vets.gov.user+71@gmail.com',
        loa: { current: 3 },
        first_name: 'Julio',
        middle_name: 'E',
        last_name: 'Hunter',
        gender: 'M',
        birth_date: '1951-11-18',
        verified: true,
      },
      veteran_status: { status: 'OK', is_veteran: true },
      inProgressForms: [],
      prefillsAvailable: ['1010ez'],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'user-profile',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
        facilities: [
          { facility_id: '983', is_cerner: false },
          { facility_id: '984', is_cerner: false },
        ],
      },
      vet360ContactInformation: {
        email: null,
        residentialAddress: null,
        mailingAddress: {
          addressLine1: '123 elm st',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Northampton',
          countryName: 'United States',
          countryCodeIso2: 'US',
          countryCodeIso3: 'USA',
          countryCodeFips: null,
          countyCode: '36005',
          countyName: 'Bronx County',
          createdAt: '2020-12-10T20:02:29.000+00:00',
          effectiveEndDate: null,
          effectiveStartDate: '2021-01-20T02:29:58.000+00:00',
          geocodeDate: '2021-01-20T02:31:05.000+00:00',
          geocodePrecision: 31,
          id: 208622,
          internationalPostalCode: null,
          latitude: 40.8293,
          longitude: -73.9284,
          province: null,
          sourceDate: '2021-01-20T02:29:58.000+00:00',
          sourceSystemUser: null,
          stateCode: 'MA',
          transactionId: '0edf4400-9de7-442c-ae65-abf192702cef',
          updatedAt: '2021-01-20T02:31:06.000+00:00',
          validationKey: null,
          vet360Id: '1273500',
          zipCode: '01060',
          zipCodeSuffix: '2100',
        },
        mobilePhone: null,
        homePhone: null,
        workPhone: {
          areaCode: '270',
          countryCode: '1',
          createdAt: '2018-04-20T17:22:56.000+00:00',
          extension: null,
          effectiveEndDate: null,
          effectiveStartDate: '2012-10-25T09:03:30.000+00:00',
          id: 2270938,
          isInternational: false,
          isTextable: false,
          isTextPermitted: false,
          isTty: false,
          isVoicemailable: false,
          phoneNumber: '2323232',
          phoneType: 'WORK',
          sourceDate: '2012-10-25T09:03:30.000+00:00',
          sourceSystemUser: null,
          transactionId: 'DATA SEEDING',
          updatedAt: '2018-04-20T17:22:56.000+00:00',
          vet360Id: '1273500',
        },
        temporaryPhone: null,
        faxNumber: null,
        textPermission: null,
      },
    },
  },
  meta: { errors: null },
};

const mockFeatureToggles = {
  data: {
    type: 'feature_toggles',
    features: [],
  },
};

const mockMaintenanceWindows = { data: [] };

const mockVamcEhr = {
  data: { nodeQuery: { count: 0, entities: [] } },
};

const mockEnrollmentStatus = {
  applicationDate: null,
  enrollmentDate: null,
  preferredFacility: null,
  effectiveDate: null,
  primaryEligibility: null,
  priorityGroup: null,
  canSubmitFinancialInfo: true,
  parsedStatus: 'none_of_the_above',
};

const mockRating = {
  data: {
    id: '',
    type: 'hash',
    attributes: { userPercentOfDisability: 0 },
  },
};

const mockPrefill = {
  formData: {
    veteranFullName: { first: 'Julio', middle: 'E', last: 'Hunter' },
    gender: 'M',
    veteranDateOfBirth: '1951-11-18',
    veteranSocialSecurityNumber: '796378321',
    homePhone: '6575107441',
    email: 'vets.gov.user+71@gmail.com',
    lastServiceBranch: 'air force',
    lastEntryDate: '1977-06-03',
    lastDischargeDate: '1998-06-30',
    dischargeType: 'honorable',
  },
  metadata: {
    version: 0,
    prefill: true,
    returnUrl: '/check-your-personal-information',
  },
};

const mockSaveInProgress = {
  data: {
    id: '',
    type: 'in_progress_forms',
    attributes: {
      formId: '1010ez',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      metadata: {
        version: 0,
        returnUrl: '/check-your-personal-information',
        savedAt: 1739200257608,
        submission: {
          status: false,
          errorMessage: false,
          id: false,
          timestamp: false,
          hasAttemptedSubmit: false,
        },
        createdAt: 1739200226,
        expiresAt: 32472162000,
        lastUpdated: 1739200257,
        inProgressFormId: 12345,
      },
    },
  },
};

const mockSubmission = {
  formSubmissionId: '123fake-submission-id-567',
  timestamp: 1736357117521,
};

// HCA facilities — from src/applications/hca/tests/e2e/fixtures/mocks/facilities.json
const mockHcaFacilities = [
  {
    access: null,
    activeStatus: null,
    address: {
      physical: {
        zip: '01730-1114',
        city: 'Bedford',
        state: 'MA',
        address1: '200 Springs Road',
      },
    },
    classification: 'VA Medical Center (VAMC)',
    detailedServices: null,
    distance: null,
    facilityType: 'va_health_facility',
    facilityTypePrefix: 'vha',
    feedback: {
      health: {
        primaryCareUrgent: 0.94,
        primaryCareRoutine: 0.94,
        specialtyCareUrgent: 0.83,
        specialtyCareRoutine: 0.96,
      },
      effectiveDate: '2024-02-08',
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
    id: 'vha_518',
    lat: 42.50367478,
    long: -71.2726766,
    mobile: false,
    name: 'Edith Nourse Rogers Memorial Veterans\' Hospital',
    operatingStatus: { code: 'NORMAL' },
    operationalHoursSpecialInstructions: [
      'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
    ],
    phone: {
      fax: '781-687-2101',
      main: '781-687-2000',
      pharmacy: '800-838-6331 x2210',
      afterHours: '800-838-6331',
      patientAdvocate: '781-687-2612',
      mentalHealthClinic: '781-687-2347',
      enrollmentCoordinator: '781-687-2275',
    },
    services: {
      health: [
        { name: 'Audiology and speech', serviceId: 'audiology' },
        { name: 'Cardiology', serviceId: 'cardiology' },
        { name: 'Mental health care', serviceId: 'mentalHealth' },
        { name: 'Primary care', serviceId: 'primaryCare' },
        { name: 'Pharmacy', serviceId: 'pharmacy' },
        { name: 'Urgent care', serviceId: 'urgentCare' },
      ],
      lastUpdated: '2024-09-22',
    },
    type: 'va_facilities',
    uniqueId: '518',
    visn: '1',
    website: 'https://www.va.gov/bedford-health-care/',
  },
  {
    access: null,
    activeStatus: null,
    address: {
      physical: {
        zip: '01060',
        city: 'Northampton',
        state: 'MA',
        address1: '421 North Main Street',
      },
    },
    classification: 'Multi-Specialty CBOC',
    detailedServices: null,
    distance: null,
    facilityType: 'va_health_facility',
    facilityTypePrefix: 'vha',
    feedback: {
      health: {
        primaryCareUrgent: 0.85,
        primaryCareRoutine: 0.91,
        specialtyCareUrgent: 0.78,
        specialtyCareRoutine: 0.88,
      },
      effectiveDate: '2024-02-08',
    },
    hours: {
      monday: '800AM-430PM',
      tuesday: '800AM-430PM',
      wednesday: '800AM-430PM',
      thursday: '800AM-430PM',
      friday: '800AM-430PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    id: 'vha_631GA',
    lat: 42.31928,
    long: -72.63835,
    mobile: false,
    name: 'Northampton VA Medical Center',
    operatingStatus: { code: 'NORMAL' },
    operationalHoursSpecialInstructions: [],
    phone: {
      fax: '413-584-4015',
      main: '413-584-4040',
      pharmacy: '413-584-4040 x2115',
      afterHours: '413-584-4040',
      patientAdvocate: '413-584-4040 x2425',
      mentalHealthClinic: '413-584-4040 x2490',
      enrollmentCoordinator: '413-584-4040 x2192',
    },
    services: {
      health: [
        { name: 'Mental health care', serviceId: 'mentalHealth' },
        { name: 'Primary care', serviceId: 'primaryCare' },
        { name: 'Laboratory and pathology', serviceId: 'laboratory' },
        { name: 'Social work', serviceId: 'socialWork' },
      ],
      lastUpdated: '2024-09-22',
    },
    type: 'va_facilities',
    uniqueId: '631GA',
    visn: '1',
    website: 'https://www.va.gov/central-western-massachusetts-health-care/',
  },
];

// Facility Locator — VA facilities search response
const mockFacilitySearchResults = {
  data: [
    {
      id: 'vha_688GA',
      type: 'facility',
      attributes: {
        access: {
          health: [
            { service: 'PrimaryCare', new: 4.01, established: 1.5 },
            { service: 'MentalHealthCare', new: 1.8, established: 3.68 },
          ],
          effectiveDate: '2020-07-20',
        },
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '78744-3111',
            city: 'Austin',
            state: 'TX',
            address1: '7901 Metropolis Drive',
          },
        },
        classification: 'Multi-Specialty CBOC',
        facilityType: 'va_health_facility',
        feedback: {
          health: {
            primaryCareUrgent: 0.86,
            primaryCareRoutine: 0.91,
            specialtyCareUrgent: 0.79,
            specialtyCareRoutine: 0.85,
          },
          effectiveDate: '2020-07-20',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-430PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        lat: 30.205656,
        long: -97.6903515,
        mobile: false,
        name: 'Austin VA Clinic',
        operatingStatus: { code: 'NORMAL' },
        operationalHoursSpecialInstructions: [],
        phone: {
          fax: '512-823-4001',
          main: '512-823-4000',
          pharmacy: '512-823-4010',
          afterHours: '512-823-4000',
          patientAdvocate: '512-823-4020',
          mentalHealthClinic: '512-823-4030',
          enrollmentCoordinator: '512-823-4040',
        },
        services: {
          health: [
            { name: 'Primary care', serviceId: 'primaryCare' },
            { name: 'Mental health care', serviceId: 'mentalHealth' },
            { name: 'Audiology and speech', serviceId: 'audiology' },
            { name: 'Pharmacy', serviceId: 'pharmacy' },
            { name: 'Laboratory and pathology', serviceId: 'laboratory' },
          ],
          lastUpdated: '2024-09-22',
        },
        uniqueId: '688GA',
        visn: '17',
        website: 'https://www.va.gov/central-texas-health-care/',
      },
    },
    {
      id: 'vha_674',
      type: 'facility',
      attributes: {
        access: {
          health: [
            { service: 'PrimaryCare', new: 5.2, established: 2.1 },
            { service: 'MentalHealthCare', new: 3.0, established: 1.5 },
          ],
          effectiveDate: '2020-07-20',
        },
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '78712',
            city: 'Temple',
            state: 'TX',
            address1: '1901 Veterans Memorial Drive',
          },
        },
        classification: 'VA Medical Center (VAMC)',
        facilityType: 'va_health_facility',
        feedback: {
          health: {
            primaryCareUrgent: 0.92,
            primaryCareRoutine: 0.88,
            specialtyCareUrgent: 0.84,
            specialtyCareRoutine: 0.90,
          },
          effectiveDate: '2020-07-20',
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
        lat: 31.048,
        long: -97.381,
        mobile: false,
        name: 'Olin E. Teague Veterans\' Medical Center',
        operatingStatus: { code: 'NORMAL' },
        operationalHoursSpecialInstructions: [
          'Visiting hours are 24/7. Please check in at the front desk.',
        ],
        phone: {
          fax: '254-778-4812',
          main: '254-778-4811',
          pharmacy: '254-778-4813',
          afterHours: '254-778-4811',
          patientAdvocate: '254-778-4820',
          mentalHealthClinic: '254-778-4830',
          enrollmentCoordinator: '254-778-4840',
        },
        services: {
          health: [
            { name: 'Primary care', serviceId: 'primaryCare' },
            { name: 'Mental health care', serviceId: 'mentalHealth' },
            { name: 'Urgent care', serviceId: 'urgentCare' },
            { name: 'Cardiology', serviceId: 'cardiology' },
            { name: 'Pharmacy', serviceId: 'pharmacy' },
          ],
          lastUpdated: '2024-09-22',
        },
        uniqueId: '674',
        visn: '17',
        website: 'https://www.va.gov/central-texas-health-care/',
      },
    },
  ],
  meta: {
    pagination: { currentPage: 1, perPage: 10, totalPages: 1, totalEntries: 2 },
  },
};

// Community Care — providers (from ccp-helpers-cypress.js)
const mockCcpProviders = {
  data: [
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
    {
      id: 'd177566d94932c18a97fc5e441e792cae77544874012095f174886dd6b156400',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '1500 Red River St',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
        },
        caresitePhone: '5123247000',
        email: null,
        fax: null,
        gender: 'Female',
        lat: 30.27558,
        long: -97.733979,
        name: 'Johnson, Sarah L',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1093810327',
      },
    },
  ],
  meta: {
    pagination: { currentPage: 1, prevPage: null, nextPage: null, totalPages: 1, totalEntries: 2 },
  },
};

// Community Care — pharmacies (from ccp-helpers-cypress.js)
const mockCcpPharmacies = {
  data: [
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
  ],
  meta: {
    pagination: { currentPage: 1, prevPage: null, nextPage: null, totalPages: 1, totalEntries: 1 },
  },
};

// Community Care — urgent care (from ccp-helpers-cypress.js)
const mockCcpUrgentCare = {
  data: [
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
  ],
  meta: {
    pagination: { currentPage: 1, prevPage: null, nextPage: null, totalPages: 1, totalEntries: 2 },
  },
};

// Specialties — from src/applications/facility-locator/constants/mock-provider-services.json
const mockSpecialties = {
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
        specialtyDescription: 'A dentist who assesses, diagnoses, and treats patients with complex chronic orofacial pain and dysfunction disorders.',
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
        specialtyDescription: 'An acute general hospital providing inpatient diagnostic and therapeutic services for a variety of medical conditions.',
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

// ---------------------------------------------------------------------------
// Route matching
// ---------------------------------------------------------------------------

function matchRoute(method, pathname) {
  const key = `${method} ${pathname}`;

  const routes = {
    // Common
    'GET /v0/user': mockUser,
    'GET /v0/feature_toggles': mockFeatureToggles,
    'GET /v0/maintenance_windows': mockMaintenanceWindows,
    'OPTIONS /v0/maintenance_windows': 'OK',
    'GET /csrf_token': { csrfToken: 'mock-csrf-token' },

    // HCA
    'GET /data/cms/vamc-ehr.json': mockVamcEhr,
    'GET /v0/in_progress_forms/1010ez': mockPrefill,
    'PUT /v0/in_progress_forms/1010ez': mockSaveInProgress,
    'GET /v0/health_care_applications/rating_info': mockRating,
    'GET /v0/health_care_applications/facilities': mockHcaFacilities,
    'POST /v0/health_care_applications/enrollment_status': mockEnrollmentStatus,
    'POST /v0/health_care_applications': mockSubmission,

    // Facility locator — VA facilities
    'POST /facilities_api/v2/va': mockFacilitySearchResults,

    // Facility locator — Community Care
    'POST /facilities_api/v2/ccp/provider': mockCcpProviders,
    'POST /facilities_api/v2/ccp/pharmacy': mockCcpPharmacies,
    'POST /facilities_api/v2/ccp/urgent_care': mockCcpUrgentCare,
    'GET /facilities_api/v2/ccp/specialties': mockSpecialties,
  };

  // Exact match
  if (routes[key]) return routes[key];

  // Prefix matching for parameterized routes
  if (method === 'GET' && pathname.startsWith('/facilities_api/v2/va/')) {
    return { data: mockFacilitySearchResults.data[0] };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Vercel serverless handler
// ---------------------------------------------------------------------------

module.exports = (req, res) => {
  // CORS headers so the frontend can call the API from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Key-Inflection, X-CSRF-Token, Source-App-Name');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vercel rewrites change req.url to /api/mock so we pass the original
  // path via a query parameter from the rewrite rules in vercel.json.
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.searchParams.get('__original_path') || url.pathname;
  const method = req.method;

  const response = matchRoute(method, pathname);

  if (response === null) {
    return res.status(404).json({
      errors: [{
        title: 'Not found',
        detail: `No mock configured for ${method} ${pathname}`,
        status: '404',
      }],
    });
  }

  if (typeof response === 'string') {
    return res.status(200).send(response);
  }

  return res.status(200).json(response);
};
