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
  'GET /v1/post911_gi_bill_status': (_, res) => {
    res.status(404).json({
      errors: [
        {
          title: 'Not Found',
          detail: 'No record found for this Identifier.',
          code: '404',
          status: '404',
        },
      ],
    });
  },
  // 'GET /v1/post911_gi_bill_status': {
  //   data: {
  //     attributes: {
  //       firstName: 'Srikanth',
  //       lastName: 'Vanapalli',
  //       nameSuffix: 'Jr',
  //       dateTimeOfBirth: '1975-02-04T17:51:56Z',
  //       vaFileNumber: '1234567890V123456',
  //       activeDuty: false,
  //       veteranIsEligible: true,
  //       regionalProcessingOffice: 'Central Office Washington, DC',
  //       eligibilityDateTime: '2004-10-01T04:00:00Z',
  //       delimitingDateTime: '2015-10-01T04:00:00Z',
  //       percentageBenefit: 100,
  //       originalEntitlement: {
  //         months: 0,
  //         days: 10,
  //       },
  //       usedEntitlement: {
  //         months: 0,
  //         days: 10,
  //       },
  //       remainingEntitlement: {
  //         months: 0,
  //         days: 10,
  //       },
  //       enrollments: [
  //         {
  //           beginDateTime: '2012-11-01T04:00:00Z',
  //           endDateTime: '2012-12-01T04:00:00Z',
  //           facilityCode: 11902614,
  //           facilityName: 'Purdue University',
  //           participantId: 11170323,
  //           trainingType: 'UNDER_GRAD',
  //           termId: 'termId_example',
  //           hourType: 'hourType_example',
  //           fullTimeHours: 12,
  //           fullTimeCreditHourUnderGrad: 0,
  //           vacationDayCount: 0,
  //           onCampusHours: 12,
  //           onlineHours: 0,
  //           yellowRibbonAmount: 0,
  //           status: 'Approved',
  //           amendments: [
  //             {
  //               residenceHours: 0,
  //               distanceHours: 0,
  //               yellowRibbonAmount: 0,
  //               amendmentType: 'type_example',
  //               amendmentStatus: 'status_example',
  //               amendmentEffectiveDate: '2012-11-01T04:00:00Z',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // },
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
        { name: 'showExpandableVamcAlert', value: true },
        { name: 'facilityLocatorShowCommunityCares', value: true },
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
