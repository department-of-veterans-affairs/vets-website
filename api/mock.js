/**
 * Vercel Serverless Function — Mock VA API
 *
 * Serves mock responses for the three deployed apps:
 *   - static-pages (feature toggles, maintenance windows, user)
 *   - facility-locator (facilities API v2)
 *   - hca / 10-10EZ (enrollment, prefill, rating, submission)
 *
 * All responses are derived from the existing test fixtures in the repo.
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
      veteran_status: { status: 'OK', is_veteran: true, served_in_military: true },
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
    id: 'vha_518',
    lat: 42.50367478,
    long: -71.2726766,
    mobile: false,
    name: 'Edith Nourse Rogers Memorial Veterans\' Hospital',
    operatingStatus: { code: 'NORMAL' },
    phone: { main: '781-687-2000' },
    uniqueId: '518',
    visn: '1',
    website: 'https://www.va.gov/bedford-health-care/',
  },
];

// Facility Locator — mock VA facilities search response
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
          physical: {
            zip: '78744-3111',
            city: 'Austin',
            state: 'TX',
            address1: '7901 Metropolis Drive',
          },
        },
        classification: 'Multi-Specialty CBOC',
        facilityType: 'va_health_facility',
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
        name: 'Austin VA Clinic',
        operatingStatus: { code: 'NORMAL' },
        phone: { main: '512-823-4000' },
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
          ],
          effectiveDate: '2020-07-20',
        },
        activeStatus: 'A',
        address: {
          physical: {
            zip: '78712',
            city: 'Temple',
            state: 'TX',
            address1: '1901 Veterans Memorial Drive',
          },
        },
        classification: 'VA Medical Center (VAMC)',
        facilityType: 'va_health_facility',
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
        name: 'Olin E. Teague Veterans\' Medical Center',
        operatingStatus: { code: 'NORMAL' },
        phone: { main: '254-778-4811' },
        website: 'https://www.va.gov/central-texas-health-care/',
      },
    },
  ],
  meta: {
    pagination: { currentPage: 1, perPage: 10, totalPages: 1, totalEntries: 2 },
  },
};

const mockSpecialties = {
  data: [
    { id: '101Y00000X', attributes: { name: 'Counselor', specialtyCode: '101Y00000X' } },
    { id: '261QE0002X', attributes: { name: 'Emergency Care', specialtyCode: '261QE0002X' } },
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

    // Facility locator
    'POST /facilities_api/v2/va': mockFacilitySearchResults,
    'POST /facilities_api/v2/ccp/provider': mockFacilitySearchResults,
    'POST /facilities_api/v2/ccp/pharmacy': mockFacilitySearchResults,
    'POST /facilities_api/v2/ccp/urgent_care': mockFacilitySearchResults,
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
