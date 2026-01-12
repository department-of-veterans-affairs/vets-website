/* eslint-disable camelcase */
const responses = {
  'GET /v0/backend_statuses/gibs': {
    data: {
      id: 'string',
      type: 'string',
      attributes: {
        isAvailable: true,
        name: 'gibs',
      },
    },
  },
  'GET /sob/v0/ch33_status': {
    data: {
      id: '',
      type: 'ch33_status',
      attributes: {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1988-03-01',
        vaFileNumber: '374374377',
        regionalProcessingOffice: 'Muskogee, OK',
        eligibilityDate: '2005-04-01',
        delimitingDate: null,
        percentageBenefit: 100,
        activeDuty: true,
        veteranIsEligible: true,
        originalEntitlement: {
          months: 36,
          days: 0,
        },
        usedEntitlement: {
          months: 22,
          days: 3,
        },
        remainingEntitlement: {
          months: 0,
          days: 0,
        },
        entitlementTransferredOut: {
          months: 14,
          days: 0,
        },
      },
    },
  },
  'GET /v0/user': {
    data: {
      attributes: {
        profile: {
          sign_in: {
            service_name: 'idme',
          },
          email: 'fake@fake.com',
          loa: { current: 3 },
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          gender: 'F',
          birth_date: '1985-01-01',
          verified: true,
        },
        veteran_status: {
          status: 'OK',
          is_veteran: true,
          served_in_military: true,
        },
        in_progress_forms: [],
        prefills_available: ['21-526EZ'],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'form526',
          'user-profile',
          'health-records',
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
            {
              facility_id: '983',
              is_cerner: false,
            },
            {
              facility_id: '984',
              is_cerner: false,
            },
          ],
        },
      },
    },
    meta: { errors: null },
  },

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'profile_show_profile_2.0', value: false },
        { name: 'vaOnlineScheduling', value: true },
        { name: 'vaOnlineSchedulingCancel', value: true },
        { name: 'vaOnlineSchedulingRequests', value: true },
        { name: 'vaOnlineSchedulingCommunityCare', value: true },
        { name: 'vaOnlineSchedulingDirect', value: true },
        { name: 'vaOnlineSchedulingPast', value: true },
        { name: 'vaOnlineSchedulingExpressCare', value: true },
        { name: 'vaOnlineSchedulingExpressCareNew', value: true },
        { name: 'vaOnlineSchedulingFlatFacilityPage', value: true },
        { name: 'vaOnlineSchedulingProviderSelection', value: true },
        { name: 'vaOnlineSchedulingCheetah', value: true },
        { name: 'vaOnlineSchedulingHomepageRefresh', value: true },
        { name: 'vaOnlineSchedulingVAOSServiceCCAppointments', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceVAAppointments', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceRequests', value: false },
        { name: 'edu_section_103', value: true },
        { name: 'gibctEybBottomSheet', value: true },
      ],
    },
  },
};

module.exports = responses;
