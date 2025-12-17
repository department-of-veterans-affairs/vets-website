/* eslint-disable camelcase */
const responses = {
  'GET /v0/ch31_case_details': {
    data: {
      id: '',
      type: 'ch31_case_details',
      attributes: {
        res_case_id: 123456,
        is_transfered_to_cwnrs: true,
        external_status: {
          is_discontinued: false,
          discontinued_reason: null,
          state_list: [
            { step_code: 'APPL', status: 'COMPLETED' },
            { step_code: 'ELGLDET', status: 'COMPLETED' },
            { step_code: 'ORICMPT', status: 'PENDING' },
            { step_code: 'INTAKE', status: 'ACTIVE' },
            { step_code: 'ENTLDET', status: 'PENDING' },
            { step_code: 'PLANSELECT', status: 'PENDING' },
            { step_code: 'BFSACT', status: 'PENDING' },
          ],
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
        { name: 'vre_eligibility_status_phase_2_updates', value: true },
      ],
    },
  },
};

module.exports = responses;
